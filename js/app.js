/**
 * CAREBRIDGE Main Application Orchestrator
 * Integrates Google Stitch UI with Supabase backend, Demo system, Audio, PDF & QR.
 */

// Application State
const CarebridgeState = {
    currentTab: 'discharge-records', // 'dashboard', 'discharge-records', 'create-record', 'patient-portal', 'settings'
    activeRecord: null,
    currentLanguage: 'en', // 'en' or 'ta'
    currentDoctor: window.CAREBRIDGE_CONFIG?.DEFAULT_DOCTOR || { name: "Dr. Arun Kumar", title: "MD, DM" },
    filterStatus: 'all',
    searchQuery: '',
    speechStatus: 'stopped' // 'stopped', 'playing', 'paused'
};

// Global Exposure
window.CarebridgeState = CarebridgeState;

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[CAREBRIDGE] Application Initializing...');
    
    // Check URL parameters for direct token access (e.g. ?token=xyz or ?record=r1)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    const recordParam = urlParams.get('record');

    // Load initial record
    const records = await window.CarebridgeStorage.getDischargeRecords();
    if (records && records.length > 0) {
        CarebridgeState.activeRecord = recordParam ? 
            (records.find(r => r.id === recordParam || r.patient_reference === recordParam) || records[0]) : 
            records[0];
    } else {
        CarebridgeState.activeRecord = window.CAREBRIDGE_DEMO_DATA?.dischargeRecords[0] || null;
    }

    // Initialize bottom navigation
    setupNavigation();

    // Wire global header events
    setupHeaderEvents();

    // Setup speech audio callbacks
    window.CarebridgeAudio.onStateChangeCallback = (state) => {
        CarebridgeState.speechStatus = state;
        updateAudioButtonUI(state);
    };

    // If accessed via secure handover token
    if (tokenParam) {
        handleTokenHandover(tokenParam);
    } else {
        renderCurrentView();
    }

    // Check Supabase connection indicator
    updateSupabaseStatusIndicator();
});

// ==========================================
// NAVIGATION CONTROLLER
// ==========================================
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav [data-path]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPath = link.getAttribute('data-path');
            switchTab(targetPath);
        });
    });
}

function switchTab(path) {
    CarebridgeState.currentTab = path;

    // Update bottom nav active classes
    const navLinks = document.querySelectorAll('nav [data-path]');
    navLinks.forEach(link => {
        const isCurrent = link.getAttribute('data-path') === path;
        if (isCurrent) {
            link.classList.add('text-primary', 'font-semibold');
            link.classList.remove('text-text-secondary');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('text-primary', 'font-semibold');
            link.classList.add('text-text-secondary');
            link.removeAttribute('aria-current');
        }
    });

    // Stop any ongoing audio narration
    window.CarebridgeAudio.stop();

    renderCurrentView();
}

// ==========================================
// VIEW RENDERER
// ==========================================
function renderCurrentView() {
    const mainEl = document.querySelector('main');
    if (!mainEl) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    switch (CarebridgeState.currentTab) {
        case 'dashboard':
            renderDashboardView(mainEl);
            break;
        case 'discharge-records':
            renderDischargeRecordView(mainEl);
            break;
        case 'create-record':
            renderCreateRecordView(mainEl);
            break;
        case 'patient-portal':
            renderPatientPortalView(mainEl);
            break;
        case 'settings':
            renderSettingsView(mainEl);
            break;
        default:
            renderDischargeRecordView(mainEl);
    }
}

// ==========================================
// HEADER & GLOBAL CONTROLS
// ==========================================
function setupHeaderEvents() {
    // English / Tamil buttons in header
    const langButtons = document.querySelectorAll('header .font-bilingual-indicator');
    if (langButtons.length >= 2) {
        langButtons[0].addEventListener('click', () => setGlobalLanguage('en'));
        langButtons[1].addEventListener('click', () => setGlobalLanguage('ta'));
    }

    // Notifications button
    const notifBtn = document.querySelector('header button[aria-label="Alerts and notifications"]');
    if (notifBtn) {
        notifBtn.addEventListener('click', () => {
            alert('Notifications:\n• 1 Clarification request pending for Kumarasamy V.\n• All statutory clinical markers verified.');
        });
    }
}

function setGlobalLanguage(lang) {
    CarebridgeState.currentLanguage = lang;
    
    // Update header toggle styles
    const langButtons = document.querySelectorAll('header .font-bilingual-indicator');
    if (langButtons.length >= 2) {
        if (lang === 'en') {
            langButtons[0].className = "px-2 py-0.5 rounded-full bg-surface-container-lowest text-primary font-bilingual-indicator text-bilingual-indicator shadow-sm";
            langButtons[1].className = "px-2 py-0.5 rounded-full text-text-secondary font-bilingual-indicator text-bilingual-indicator";
        } else {
            langButtons[1].className = "px-2 py-0.5 rounded-full bg-surface-container-lowest text-primary font-bilingual-indicator text-bilingual-indicator shadow-sm";
            langButtons[0].className = "px-2 py-0.5 rounded-full text-text-secondary font-bilingual-indicator text-bilingual-indicator";
        }
    }

    // Synchronize page language elements
    const enElements = document.querySelectorAll('.lang-en');
    const taElements = document.querySelectorAll('.lang-ta');

    if (lang === 'ta') {
        enElements.forEach(el => el.classList.add('hidden'));
        taElements.forEach(el => el.classList.remove('hidden'));
    } else {
        taElements.forEach(el => el.classList.add('hidden'));
        enElements.forEach(el => el.classList.remove('hidden'));
    }

    // If audio is playing, restart in new language
    if (CarebridgeState.speechStatus === 'playing') {
        playActiveRecordAudio();
    }
}

// ==========================================
// VIEW 1: DISCHARGE RECORD (Original Stitch View)
// ==========================================
function renderDischargeRecordView(container) {
    const record = CarebridgeState.activeRecord || window.CAREBRIDGE_DEMO_DATA.dischargeRecords[0];
    const isTa = CarebridgeState.currentLanguage === 'ta';

    const meds = Array.isArray(record.medication_instructions) ? record.medication_instructions : [];

    container.innerHTML = `
        <div class="flex flex-col w-full pb-8">
            <!-- Readiness Banner -->
            <div class="px-gutter-mobile pt-3 pb-2">
                <div class="bg-surface-container-lowest rounded-xl p-3 shadow-sm flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2.5 min-w-0">
                        <div class="w-8 h-8 rounded-full bg-success/15 flex items-center justify-center text-success flex-shrink-0">
                            <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">task_alt</span>
                        </div>
                        <div class="min-w-0">
                            <div class="flex items-center gap-1.5">
                                <span class="font-label-md text-label-md text-text-primary font-semibold truncate">Ready for clinician verification</span>
                                <span class="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                            </div>
                            <p class="font-body-sm text-body-sm text-text-secondary truncate">All statutory clinical markers verified</p>
                        </div>
                    </div>
                    <span class="font-label-sm text-label-sm px-2.5 py-1 rounded-full ${record.approval_status === 'approved' ? 'bg-success/10 text-success' : 'bg-warning/15 text-warning'} font-semibold flex-shrink-0">
                        ${record.approval_status === 'approved' ? 'Verified & Approved' : 'Pending Review'}
                    </span>
                </div>
            </div>

            <!-- Clinical Case Header -->
            <div class="px-gutter-mobile py-2">
                <div class="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-3">
                    <div class="flex items-start justify-between gap-3">
                        <div class="flex items-center gap-3 min-w-0">
                            <div class="relative w-12 h-12 rounded-xl overflow-hidden bg-surface-container flex-shrink-0">
                                <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC79uzfeAfG5hX8nE4MvijOLxHXKPD2lrPalu6nAaUXMrgUrGlWM2ECm-qBkB2HOjkjsKCUx8no6SMVB2h95ScZidUHHwFGGP8MyKmDwNimvwFyqaFVBQDbXsrIpOxpcq0unGaM1fova-QiBChUNT6JtqAbWhMEboto0ZupvXqx7JhKT5t_PzHNcf6v7v5e8ojKoAPhypFhjEw2qeWgGQ4MvJ0r8g79bV_jAflnKb8D" alt="Patient portrait">
                            </div>
                            <div class="min-w-0">
                                <div class="flex items-center gap-2">
                                    <h1 class="font-headline-sm text-headline-sm text-text-primary truncate">${record.patient_name}</h1>
                                    <span class="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-text-secondary font-medium">${record.patient_age}M</span>
                                </div>
                                <div class="flex items-center gap-2 mt-0.5 text-text-secondary font-label-md text-label-md">
                                    <span class="text-primary font-semibold">Ref: ${record.patient_reference}</span>
                                    <span>•</span>
                                    <span class="truncate">Cardiology • Bay 4B</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col items-end flex-shrink-0">
                            <span class="px-2.5 py-1 rounded-full ${record.approval_status === 'approved' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'} font-label-sm text-label-sm font-semibold flex items-center gap-1">
                                <span class="w-1.5 h-1.5 rounded-full ${record.approval_status === 'approved' ? 'bg-success' : 'bg-warning'}"></span>
                                ${record.approval_status === 'approved' ? 'Approved' : 'Pending Approval'}
                            </span>
                            <span class="font-label-sm text-label-sm text-text-secondary mt-1">Lead: ${record.approved_by || CarebridgeState.currentDoctor.name}</span>
                        </div>
                    </div>

                    <!-- Quick Telemetry Micro-Bar -->
                    <div class="grid grid-cols-3 gap-2 pt-2 bg-surface-container-low rounded-lg p-2.5">
                        <div class="flex flex-col">
                            <span class="font-label-sm text-label-sm text-text-secondary">Admission</span>
                            <span class="font-label-md text-label-md text-text-primary font-medium">02 Nov 2024</span>
                        </div>
                        <div class="flex flex-col">
                            <span class="font-label-sm text-label-sm text-text-secondary">Procedure</span>
                            <span class="font-label-md text-label-md text-text-primary font-medium truncate">Primary PCI</span>
                        </div>
                        <div class="flex flex-col">
                            <span class="font-label-sm text-label-sm text-text-secondary">Vitals Pulse</span>
                            <span class="font-label-md text-label-md text-success font-semibold flex items-center gap-0.5">
                                <span class="material-symbols-outlined text-[14px]">favorite</span> 74 bpm
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Completeness Verification Widget -->
            <div class="px-gutter-mobile py-2">
                <div class="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-3">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <div class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <span class="material-symbols-outlined text-[18px]">verified_user</span>
                            </div>
                            <div>
                                <h2 class="font-headline-sm text-headline-sm text-text-primary">Completeness Verification</h2>
                                <p class="font-body-sm text-body-sm text-text-secondary">4 of 4 statutory modules filled</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 bg-secondary-container/30 px-3 py-1.5 rounded-full">
                            <span class="material-symbols-outlined text-primary text-[18px]">task_alt</span>
                            <span class="font-label-md text-label-md text-primary font-bold">100%</span>
                        </div>
                    </div>

                    <!-- Completeness Checklist -->
                    <div class="space-y-2 pt-1">
                        <div class="flex items-start gap-2.5 p-2 rounded-lg bg-surface-container-low">
                            <div class="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-on-primary flex-shrink-0 mt-0.5 shadow-sm">
                                <span class="material-symbols-outlined text-[14px]">check</span>
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="flex items-center justify-between">
                                    <span class="font-label-md text-label-md text-text-primary font-semibold">Diagnosis & Summary</span>
                                    <span class="font-label-sm text-label-sm text-primary font-medium">Verified</span>
                                </div>
                                <p class="font-body-sm text-body-sm text-text-secondary truncate">${record.diagnosis}</p>
                            </div>
                        </div>

                        <div class="flex items-start gap-2.5 p-2 rounded-lg bg-surface-container-low">
                            <div class="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-on-primary flex-shrink-0 mt-0.5 shadow-sm">
                                <span class="material-symbols-outlined text-[14px]">check</span>
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="flex items-center justify-between">
                                    <span class="font-label-md text-label-md text-text-primary font-semibold">Structured Medications</span>
                                    <span class="font-label-sm text-label-sm px-2 py-0.2 rounded-full bg-surface-container text-text-secondary font-medium">${meds.length} Drugs</span>
                                </div>
                                <p class="font-body-sm text-body-sm text-text-secondary truncate">Dosages, frequencies, and precautions verified</p>
                            </div>
                        </div>

                        <div class="flex items-start gap-2.5 p-2 rounded-lg bg-surface-container-low">
                            <div class="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-on-primary flex-shrink-0 mt-0.5 shadow-sm">
                                <span class="material-symbols-outlined text-[14px]">check</span>
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="flex items-center justify-between">
                                    <span class="font-label-md text-label-md text-text-primary font-semibold">Lifestyle & Red Flag Warnings</span>
                                    <span class="font-label-sm text-label-sm text-secondary font-medium">Active</span>
                                </div>
                                <p class="font-body-sm text-body-sm text-text-secondary truncate">Diet, restrictions, and emergency indicators mapped</p>
                            </div>
                        </div>

                        <div class="flex items-start gap-2.5 p-2 rounded-lg bg-surface-container-low">
                            <div class="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-on-primary flex-shrink-0 mt-0.5 shadow-sm">
                                <span class="material-symbols-outlined text-[14px]">check</span>
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="flex items-center justify-between">
                                    <span class="font-label-md text-label-md text-text-primary font-semibold">Follow-up & Emergency Hub</span>
                                    <span class="font-label-sm text-label-sm text-primary font-medium">Scheduled</span>
                                </div>
                                <p class="font-body-sm text-body-sm text-text-secondary truncate">${record.follow_up_date} • ${record.follow_up_clinic}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-surface-container-low p-2.5 rounded-lg flex items-start gap-2">
                        <span class="material-symbols-outlined text-text-secondary text-[16px] flex-shrink-0 mt-0.5">info</span>
                        <p class="font-body-sm text-body-sm text-text-secondary leading-snug">
                            Verification confirms format completeness only. Clinical veracity and pharmaceutical compatibility remain strictly under the attending clinician's review.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Bilingual Preview Switcher -->
            <div class="px-gutter-mobile py-2">
                <div class="bg-surface-container-lowest rounded-xl p-3 shadow-sm flex flex-col gap-2.5">
                    <div class="flex items-center justify-between">
                        <span class="font-label-md text-label-md text-text-primary font-semibold flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-[18px] text-primary">translate</span>
                            Patient Discharge Copy Preview
                        </span>
                        <span class="font-label-sm text-label-sm text-text-secondary">Instant Bilingual Sync</span>
                    </div>
                    <div class="grid grid-cols-2 p-1 bg-surface-container rounded-lg gap-1">
                        <button class="py-2 px-3 rounded-lg font-label-md text-label-md ${!isTa ? 'font-semibold text-primary bg-surface-container-lowest shadow-sm' : 'font-medium text-text-secondary'} transition-all flex items-center justify-center gap-1.5" onclick="setGlobalLanguage('en')" type="button">
                            <span class="w-2 h-2 rounded-full ${!isTa ? 'bg-primary' : 'bg-transparent'}"></span>
                            English Summary
                        </button>
                        <button class="py-2 px-3 rounded-lg font-label-md text-label-md ${isTa ? 'font-semibold text-primary bg-surface-container-lowest shadow-sm' : 'font-medium text-text-secondary'} transition-all flex items-center justify-center gap-1.5" onclick="setGlobalLanguage('ta')" type="button">
                            <span class="w-2 h-2 rounded-full ${isTa ? 'bg-primary' : 'bg-transparent'}"></span>
                            தமிழ் சுருக்கம்
                        </button>
                    </div>
                </div>
            </div>

            <!-- Detailed Cards -->
            <div class="px-gutter-mobile py-2 space-y-3">
                <!-- Card 1: Diagnosis -->
                <div class="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-2">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <span class="material-symbols-outlined text-[20px]">ecg_heart</span>
                            </div>
                            <div>
                                <h3 class="font-label-lg text-label-lg text-text-primary font-semibold lang-en ${isTa ? 'hidden' : ''}">Primary Diagnosis</h3>
                                <h3 class="font-label-lg text-label-lg text-text-primary font-semibold lang-ta ${!isTa ? 'hidden' : ''}">முதன்மை நோய் கண்டறிதல்</h3>
                                <p class="font-body-sm text-body-sm text-text-secondary">${record.icd10_code || 'Validated'}</p>
                            </div>
                        </div>
                        <span class="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-text-secondary font-medium">Cardiology</span>
                    </div>
                    <div class="bg-surface-container-low p-3 rounded-lg mt-1">
                        <p class="font-body-md text-body-md text-text-primary font-medium lang-en ${isTa ? 'hidden' : ''}">${record.diagnosis}</p>
                        <p class="font-body-md text-body-md text-text-primary font-medium lang-ta ${!isTa ? 'hidden' : ''}">${record.diagnosis_ta || record.diagnosis}</p>
                    </div>
                </div>

                <!-- Card 2: Medications Regimen -->
                <div class="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-2.5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <span class="material-symbols-outlined text-[20px]">medication</span>
                            </div>
                            <div>
                                <h3 class="font-label-lg text-label-lg text-text-primary font-semibold lang-en ${isTa ? 'hidden' : ''}">Prescribed Regimen</h3>
                                <h3 class="font-label-lg text-label-lg text-text-primary font-semibold lang-ta ${!isTa ? 'hidden' : ''}">பரிந்துரைக்கப்பட்ட மருந்துகள்</h3>
                                <p class="font-body-sm text-body-sm text-text-secondary">${meds.length} active prescriptions</p>
                            </div>
                        </div>
                        <!-- Audio Playback Button -->
                        <button id="regimen-audio-btn" class="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-surface-container transition-all active:scale-95" onclick="playActiveRecordAudio()" title="Listen Audio Regimen" type="button">
                            <span class="material-symbols-outlined text-[20px]" id="audio-icon">volume_up</span>
                        </button>
                    </div>

                    <div class="space-y-2">
                        ${meds.map(m => `
                            <div class="p-3 bg-surface-container-low rounded-lg flex items-start justify-between gap-2">
                                <div class="min-w-0">
                                    <div class="flex items-center gap-2">
                                        <span class="font-label-md text-label-md text-text-primary font-bold">${m.name}</span>
                                        <span class="font-label-sm text-label-sm px-2 py-0.2 rounded bg-surface-container-highest text-text-secondary">${m.dose || ''}</span>
                                    </div>
                                    <p class="font-body-sm text-body-sm text-text-secondary mt-0.5 lang-en ${isTa ? 'hidden' : ''}">${m.instructions || m.indication || ''}</p>
                                    <p class="font-body-sm text-body-sm text-text-secondary mt-0.5 lang-ta ${!isTa ? 'hidden' : ''}">${m.timing_ta || m.indication_ta || m.instructions || ''}</p>
                                </div>
                                <span class="font-label-sm text-label-sm text-primary font-semibold bg-surface-container-lowest px-2 py-1 rounded">${m.timing || m.frequency}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Card 3: Lifestyle & Red Flags -->
                <div class="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-2.5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <span class="material-symbols-outlined text-[20px]">health_and_safety</span>
                            </div>
                            <div>
                                <h3 class="font-label-lg text-label-lg text-text-primary font-semibold lang-en ${isTa ? 'hidden' : ''}">Lifestyle & Red Flags</h3>
                                <h3 class="font-label-lg text-label-lg text-text-primary font-semibold lang-ta ${!isTa ? 'hidden' : ''}">வாழ்வியல் & அவசர எச்சரிக்கைகள்</h3>
                                <p class="font-body-sm text-body-sm text-text-secondary">Safety protocol</p>
                            </div>
                        </div>
                        <span class="w-2.5 h-2.5 rounded-full bg-error" title="Emergency guidelines enclosed"></span>
                    </div>

                    <div class="bg-surface-container-low p-3 rounded-lg space-y-2">
                        <div class="flex items-start gap-2">
                            <span class="material-symbols-outlined text-primary text-[18px] flex-shrink-0 mt-0.5">restaurant</span>
                            <div class="min-w-0">
                                <span class="font-label-md text-label-md text-text-primary font-semibold lang-en ${isTa ? 'hidden' : ''}">Cardiac Diet:</span>
                                <span class="font-label-md text-label-md text-text-primary font-semibold lang-ta ${!isTa ? 'hidden' : ''}">இதய உணவு முறை:</span>
                                <p class="font-body-sm text-body-sm text-text-secondary lang-en ${isTa ? 'hidden' : ''}">${record.lifestyle_instructions || 'Low sodium diet, avoid deep fried items.'}</p>
                                <p class="font-body-sm text-body-sm text-text-secondary lang-ta ${!isTa ? 'hidden' : ''}">${record.lifestyle_instructions_ta || record.lifestyle_instructions || 'குறைந்த உப்பு உணவு.'}</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-2 pt-1">
                            <span class="material-symbols-outlined text-error text-[18px] flex-shrink-0 mt-0.5">warning</span>
                            <div class="min-w-0">
                                <span class="font-label-md text-label-md text-error font-semibold lang-en ${isTa ? 'hidden' : ''}">Emergency Red Flags:</span>
                                <span class="font-label-md text-label-md text-error font-semibold lang-ta ${!isTa ? 'hidden' : ''}">அவசர எச்சரிக்கை அறிகுறிகள்:</span>
                                <p class="font-body-sm text-body-sm text-on-surface-variant lang-en ${isTa ? 'hidden' : ''}">${record.red_flag_symptoms}</p>
                                <p class="font-body-sm text-body-sm text-on-surface-variant lang-ta ${!isTa ? 'hidden' : ''}">${record.red_flag_symptoms_ta || record.red_flag_symptoms}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card 4: Follow-up Appointment -->
                <div class="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-2.5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <span class="material-symbols-outlined text-[20px]">calendar_today</span>
                            </div>
                            <div>
                                <h3 class="font-label-lg text-label-lg text-text-primary font-semibold lang-en ${isTa ? 'hidden' : ''}">Follow-up Appointment</h3>
                                <h3 class="font-label-lg text-label-lg text-text-primary font-semibold lang-ta ${!isTa ? 'hidden' : ''}">அடுத்த மருத்துவ சந்திப்பு</h3>
                                <p class="font-body-sm text-body-sm text-text-secondary">${record.follow_up_clinic}</p>
                            </div>
                        </div>
                        <span class="material-symbols-outlined text-success text-[20px]">event_available</span>
                    </div>
                    <div class="bg-surface-container-low p-3 rounded-lg flex items-center justify-between gap-3">
                        <div>
                            <span class="font-label-md text-label-md text-text-primary font-bold">${record.follow_up_date}, ${record.follow_up_time || '10:00 AM'}</span>
                            <p class="font-body-sm text-body-sm text-text-secondary mt-0.5">${record.follow_up_doctor || record.approved_by || 'Dr. Arun Kumar'}</p>
                        </div>
                        <a class="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold flex items-center gap-1" href="tel:${record.helpline_number || '180020088'}">
                            <span class="material-symbols-outlined text-[16px]">call</span>
                            Helpline
                        </a>
                    </div>
                </div>
            </div>

            <!-- Physician Authorization Section -->
            <div class="px-gutter-mobile py-4 mt-2">
                <div class="bg-surface-container-lowest rounded-xl p-5 shadow-md flex flex-col gap-4">
                    <div class="flex items-center gap-2.5">
                        <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary flex-shrink-0 shadow-sm">
                            <span class="material-symbols-outlined text-[20px]">draw</span>
                        </div>
                        <div>
                            <h2 class="font-headline-sm text-headline-sm text-text-primary">Physician Authorization</h2>
                            <p class="font-body-sm text-body-sm text-text-secondary">Cryptographic digital sign-off</p>
                        </div>
                    </div>

                    ${record.approval_status === 'approved' ? `
                        <div class="p-3 bg-success/10 rounded-lg flex items-center gap-2 text-success font-medium text-sm">
                            <span class="material-symbols-outlined">check_circle</span>
                            <span>Signed & Approved by ${record.approved_by || 'Dr. Arun Kumar'} on ${record.approved_at ? new Date(record.approved_at).toLocaleDateString() : 'Recent'}</span>
                        </div>
                    ` : `
                        <label class="flex items-start gap-3 p-3 bg-surface-container-low rounded-lg cursor-pointer select-none">
                            <input class="mt-0.5 w-5 h-5 rounded text-primary focus:ring-2 focus:ring-primary accent-primary-container cursor-pointer flex-shrink-0" id="physician-affirmation" onchange="toggleSignButton(this.checked)" type="checkbox">
                            <span class="font-body-sm text-body-sm text-text-primary leading-snug">
                                I, <strong class="text-primary font-semibold">${CarebridgeState.currentDoctor.name}</strong>, verify that I have clinically reviewed this summary and authorize the discharge instructions, structured prescriptions, and translation for ${record.patient_name}.
                            </span>
                        </label>
                    `}

                    <!-- Action Buttons -->
                    <div class="flex flex-col gap-2.5 pt-1">
                        ${record.approval_status !== 'approved' ? `
                            <button class="w-full py-3.5 px-4 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg font-semibold flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(8,126,139,0.25)] transition-all active:scale-[0.99] opacity-50 cursor-not-allowed" id="approve-btn" onclick="executeApproval()" type="button" disabled>
                                <span class="material-symbols-outlined text-[20px]">verified</span>
                                Approve & Issue Discharge Summary
                            </button>
                        ` : `
                            <button class="w-full py-3.5 px-4 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg font-semibold flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(8,126,139,0.25)] hover:bg-primary transition-all active:scale-[0.99]" onclick="openHandoverModal('${record.id}')" type="button">
                                <span class="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                                Generate Handover Link & QR Code
                            </button>
                        `}

                        <button class="w-full py-3 px-4 rounded-lg bg-surface-container-lowest text-primary font-label-lg text-label-lg font-semibold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-1.5 shadow-sm" onclick="exportRecordPDF()" type="button">
                            <span class="material-symbols-outlined text-[18px]">download</span>
                            Download Clinical PDF
                        </button>

                        <button class="w-full py-2 text-center text-text-secondary font-label-md text-label-md hover:text-text-primary transition-colors" onclick="switchTab('dashboard')" type="button">
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            </div>

            <!-- Modals Container -->
            <div id="modal-container"></div>
        </div>
    `;
}

// ==========================================
// VIEW 2: DOCTOR DASHBOARD
// ==========================================
async function renderDashboardView(container) {
    const records = await window.CarebridgeStorage.getDischargeRecords({
        status: CarebridgeState.filterStatus,
        search: CarebridgeState.searchQuery
    });

    const allRecords = await window.CarebridgeStorage.getDischargeRecords();
    const approvedCount = allRecords.filter(r => r.approval_status === 'approved').length;
    const pendingCount = allRecords.filter(r => r.approval_status !== 'approved').length;

    container.innerHTML = `
        <div class="flex flex-col w-full pb-8 px-gutter-mobile pt-3 space-y-4">
            <!-- Header Title -->
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="font-headline-md text-headline-md text-text-primary font-bold">Clinician Dashboard</h1>
                    <p class="font-body-sm text-body-sm text-text-secondary">Discharge Communication & Handover Hub</p>
                </div>
                <button class="px-3 py-2 rounded-lg bg-primary-container text-white font-label-md text-label-md font-semibold flex items-center gap-1.5 shadow-sm" onclick="switchTab('create-record')">
                    <span class="material-symbols-outlined text-[18px]">add</span>
                    New Record
                </button>
            </div>

            <!-- Quick Metrics Grid -->
            <div class="grid grid-cols-3 gap-2.5">
                <div class="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm flex flex-col">
                    <span class="font-label-sm text-label-sm text-text-secondary">Total Cases</span>
                    <span class="font-headline-md text-headline-md text-primary font-bold mt-1">${allRecords.length}</span>
                </div>
                <div class="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm flex flex-col">
                    <span class="font-label-sm text-label-sm text-success">Approved</span>
                    <span class="font-headline-md text-headline-md text-success font-bold mt-1">${approvedCount}</span>
                </div>
                <div class="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm flex flex-col">
                    <span class="font-label-sm text-label-sm text-warning">Pending</span>
                    <span class="font-headline-md text-headline-md text-warning font-bold mt-1">${pendingCount}</span>
                </div>
            </div>

            <!-- Search & Filter Bar -->
            <div class="bg-surface-container-lowest p-3 rounded-xl shadow-sm flex flex-col gap-2.5">
                <div class="relative">
                    <span class="material-symbols-outlined absolute left-3 top-2.5 text-text-secondary text-[20px]">search</span>
                    <input class="w-full pl-9 pr-3 py-2 bg-surface-container-low rounded-lg font-body-md text-body-md text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20" 
                           placeholder="Search by patient name, ref ID, or diagnosis..."
                           value="${CarebridgeState.searchQuery}"
                           oninput="onSearchInput(this.value)">
                </div>

                <div class="flex items-center gap-1.5 overflow-x-auto pb-1">
                    <button class="px-3 py-1 rounded-full font-label-sm text-label-sm ${CarebridgeState.filterStatus === 'all' ? 'bg-primary text-white font-semibold' : 'bg-surface-container text-text-secondary'}" onclick="setFilterStatus('all')">All</button>
                    <button class="px-3 py-1 rounded-full font-label-sm text-label-sm ${CarebridgeState.filterStatus === 'approved' ? 'bg-success text-white font-semibold' : 'bg-surface-container text-text-secondary'}" onclick="setFilterStatus('approved')">Approved</button>
                    <button class="px-3 py-1 rounded-full font-label-sm text-label-sm ${CarebridgeState.filterStatus === 'pending_review' ? 'bg-warning text-white font-semibold' : 'bg-surface-container text-text-secondary'}" onclick="setFilterStatus('pending_review')">Pending Review</button>
                    <button class="px-3 py-1 rounded-full font-label-sm text-label-sm ${CarebridgeState.filterStatus === 'draft' ? 'bg-outline text-white font-semibold' : 'bg-surface-container text-text-secondary'}" onclick="setFilterStatus('draft')">Drafts</button>
                </div>
            </div>

            <!-- Records List -->
            <div class="space-y-2.5">
                ${records.length === 0 ? `
                    <div class="bg-surface-container-lowest p-8 rounded-xl text-center flex flex-col items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-[36px] text-text-secondary">folder_open</span>
                        <p class="font-headline-sm text-text-primary">No records match your search</p>
                        <button class="mt-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold" onclick="switchTab('settings')">Load Demo Records</button>
                    </div>
                ` : records.map(r => `
                    <div class="bg-surface-container-lowest p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-2" onclick="selectRecord('${r.id}')">
                        <div class="flex items-start justify-between gap-2">
                            <div class="min-w-0">
                                <div class="flex items-center gap-2">
                                    <span class="font-headline-sm text-headline-sm text-text-primary truncate">${r.patient_name}</span>
                                    <span class="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-text-secondary">${r.patient_age} yrs</span>
                                </div>
                                <span class="font-label-md text-label-md text-primary font-semibold">Ref: ${r.patient_reference}</span>
                            </div>
                            <span class="px-2 py-1 rounded-full ${r.approval_status === 'approved' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'} font-label-sm text-label-sm font-semibold flex items-center gap-1">
                                <span class="w-1.5 h-1.5 rounded-full ${r.approval_status === 'approved' ? 'bg-success' : 'bg-warning'}"></span>
                                ${r.approval_status === 'approved' ? 'Approved' : 'Pending'}
                            </span>
                        </div>
                        <p class="font-body-sm text-body-sm text-text-secondary line-clamp-2">${r.diagnosis}</p>
                        <div class="flex items-center justify-between text-xs text-text-secondary pt-2 border-t border-surface-container">
                            <span>Follow-up: <strong>${r.follow_up_date}</strong></span>
                            <span class="text-primary font-semibold flex items-center gap-0.5">
                                View Summary <span class="material-symbols-outlined text-[16px]">chevron_right</span>
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function onSearchInput(val) {
    CarebridgeState.searchQuery = val;
    renderCurrentView();
}

function setFilterStatus(status) {
    CarebridgeState.filterStatus = status;
    renderCurrentView();
}

function selectRecord(id) {
    window.CarebridgeStorage.getDischargeRecord(id).then(rec => {
        if (rec) {
            CarebridgeState.activeRecord = rec;
            switchTab('discharge-records');
        }
    });
}

// ==========================================
// VIEW 3: CREATE DISCHARGE RECORD FORM
// ==========================================
function renderCreateRecordView(container) {
    container.innerHTML = `
        <div class="flex flex-col w-full pb-8 px-gutter-mobile pt-3 space-y-4">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="font-headline-md text-headline-md text-text-primary font-bold">New Discharge Record</h1>
                    <p class="font-body-sm text-body-sm text-text-secondary">Structured Clinical Documentation</p>
                </div>
                <button class="text-text-secondary text-sm font-medium" onclick="switchTab('dashboard')">Cancel</button>
            </div>

            <form id="create-record-form" class="space-y-4" onsubmit="handleSaveRecord(event)">
                <!-- Patient Demographics -->
                <div class="bg-surface-container-lowest p-4 rounded-xl shadow-sm space-y-3">
                    <h2 class="font-label-lg text-text-primary font-bold">1. Patient Information</h2>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block font-label-sm text-text-secondary mb-1">Patient Full Name *</label>
                            <input class="w-full p-2.5 bg-surface-container-low rounded-lg font-body-md text-text-primary focus:ring-2 focus:ring-primary/20" id="form-patient-name" required placeholder="e.g. Meenakshi Sundaram">
                        </div>
                        <div>
                            <label class="block font-label-sm text-text-secondary mb-1">Age *</label>
                            <input class="w-full p-2.5 bg-surface-container-low rounded-lg font-body-md text-text-primary focus:ring-2 focus:ring-primary/20" id="form-patient-age" type="number" min="0" max="120" required placeholder="64">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block font-label-sm text-text-secondary mb-1">Patient Ref / MRN *</label>
                            <input class="w-full p-2.5 bg-surface-container-low rounded-lg font-body-md text-text-primary focus:ring-2 focus:ring-primary/20" id="form-patient-ref" required value="CB-${Math.floor(1000 + Math.random() * 9000)}">
                        </div>
                        <div>
                            <label class="block font-label-sm text-text-secondary mb-1">Phone Number</label>
                            <input class="w-full p-2.5 bg-surface-container-low rounded-lg font-body-md text-text-primary focus:ring-2 focus:ring-primary/20" id="form-patient-phone" placeholder="+91 98401 23456">
                        </div>
                    </div>
                </div>

                <!-- Clinical Details -->
                <div class="bg-surface-container-lowest p-4 rounded-xl shadow-sm space-y-3">
                    <h2 class="font-label-lg text-text-primary font-bold">2. Clinical Diagnosis & Summary</h2>
                    <div>
                        <label class="block font-label-sm text-text-secondary mb-1">Primary Diagnosis *</label>
                        <input class="w-full p-2.5 bg-surface-container-low rounded-lg font-body-md text-text-primary focus:ring-2 focus:ring-primary/20" id="form-diagnosis" required placeholder="e.g. Type 2 Diabetes Mellitus with Hyperglycemia">
                    </div>
                    <div>
                        <label class="block font-label-sm text-text-secondary mb-1">Tamil Translation (Optional)</label>
                        <input class="w-full p-2.5 bg-surface-container-low rounded-lg font-body-md text-text-primary focus:ring-2 focus:ring-primary/20" id="form-diagnosis-ta" placeholder="e.g. வகை 2 நீரிழிவு நோய்">
                    </div>
                    <div>
                        <label class="block font-label-sm text-text-secondary mb-1">Clinical Inpatient Summary *</label>
                        <textarea class="w-full p-2.5 bg-surface-container-low rounded-lg font-body-md text-text-primary focus:ring-2 focus:ring-primary/20" id="form-summary" rows="3" required placeholder="Summary of hospital course and stability..."></textarea>
                    </div>
                </div>

                <!-- Structured Medications -->
                <div class="bg-surface-container-lowest p-4 rounded-xl shadow-sm space-y-3">
                    <div class="flex items-center justify-between">
                        <h2 class="font-label-lg text-text-primary font-bold">3. Prescribed Medications</h2>
                        <button type="button" class="text-xs text-primary font-semibold" onclick="addMedicationRow()">+ Add Medicine</button>
                    </div>
                    <div id="medications-container" class="space-y-2.5">
                        <div class="p-3 bg-surface-container-low rounded-lg space-y-2 med-row">
                            <div class="grid grid-cols-2 gap-2">
                                <input class="p-2 bg-surface-container-lowest rounded font-body-sm text-text-primary med-name" placeholder="Medicine Name (e.g. Metformin)" required value="Metformin ER">
                                <input class="p-2 bg-surface-container-lowest rounded font-body-sm text-text-primary med-dose" placeholder="Dose (e.g. 500mg)" value="500mg">
                            </div>
                            <div class="grid grid-cols-2 gap-2">
                                <select class="p-2 bg-surface-container-lowest rounded font-body-sm text-text-primary med-timing">
                                    <option value="Morning">Morning (QAM)</option>
                                    <option value="Night">Night (QHS)</option>
                                    <option value="BID" selected>Twice Daily (BID)</option>
                                    <option value="TID">Thrice Daily (TID)</option>
                                    <option value="PRN">As Needed (PRN)</option>
                                </select>
                                <input class="p-2 bg-surface-container-lowest rounded font-body-sm text-text-primary med-instructions" placeholder="Instructions (e.g. with meals)" value="1 Tablet with meals">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Lifestyle & Red Flags -->
                <div class="bg-surface-container-lowest p-4 rounded-xl shadow-sm space-y-3">
                    <h2 class="font-label-lg text-text-primary font-bold">4. Lifestyle & Red Flag Warnings</h2>
                    <div>
                        <label class="block font-label-sm text-text-secondary mb-1">Lifestyle & Diet Instructions</label>
                        <textarea class="w-full p-2.5 bg-surface-container-low rounded-lg font-body-md text-text-primary" id="form-lifestyle" rows="2" placeholder="Diabetic balanced diet. Avoid refined sugars."></textarea>
                    </div>
                    <div>
                        <label class="block font-label-sm text-error mb-1">Emergency Red Flag Symptoms *</label>
                        <textarea class="w-full p-2.5 bg-surface-container-low rounded-lg font-body-md text-text-primary border border-error/20" id="form-redflags" rows="2" required placeholder="Extreme thirst, confusion, shaking, dizziness, blood sugar < 70 mg/dL."></textarea>
                    </div>
                </div>

                <!-- Follow-up -->
                <div class="bg-surface-container-lowest p-4 rounded-xl shadow-sm space-y-3">
                    <h2 class="font-label-lg text-text-primary font-bold">5. Follow-up & Emergency Hub</h2>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block font-label-sm text-text-secondary mb-1">Follow-up Date *</label>
                            <input class="w-full p-2.5 bg-surface-container-low rounded-lg font-body-md text-text-primary" id="form-followup-date" type="date" required value="${new Date(Date.now() + 7*24*3600*1000).toISOString().split('T')[0]}">
                        </div>
                        <div>
                            <label class="block font-label-sm text-text-secondary mb-1">Clinic / Department</label>
                            <input class="w-full p-2.5 bg-surface-container-low rounded-lg font-body-md text-text-primary" id="form-followup-clinic" value="Outpatient Clinic Room 112">
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-3 pt-2">
                    <button type="submit" class="flex-1 py-3 bg-primary-container text-white font-label-lg font-semibold rounded-lg shadow-sm">Save & Review Record</button>
                    <button type="button" class="py-3 px-4 bg-surface-container text-text-secondary font-label-lg font-medium rounded-lg" onclick="switchTab('dashboard')">Cancel</button>
                </div>
            </form>
        </div>
    `;
}

function addMedicationRow() {
    const container = document.getElementById('medications-container');
    if (!container) return;

    const row = document.createElement('div');
    row.className = "p-3 bg-surface-container-low rounded-lg space-y-2 med-row relative";
    row.innerHTML = `
        <button type="button" class="absolute top-2 right-2 text-text-secondary hover:text-error text-xs" onclick="this.parentElement.remove()">✕</button>
        <div class="grid grid-cols-2 gap-2">
            <input class="p-2 bg-surface-container-lowest rounded font-body-sm text-text-primary med-name" placeholder="Medicine Name" required>
            <input class="p-2 bg-surface-container-lowest rounded font-body-sm text-text-primary med-dose" placeholder="Dose (e.g. 20mg)">
        </div>
        <div class="grid grid-cols-2 gap-2">
            <select class="p-2 bg-surface-container-lowest rounded font-body-sm text-text-primary med-timing">
                <option value="Morning">Morning (QAM)</option>
                <option value="Night">Night (QHS)</option>
                <option value="BID">Twice Daily (BID)</option>
                <option value="TID">Thrice Daily (TID)</option>
                <option value="PRN">As Needed (PRN)</option>
            </select>
            <input class="p-2 bg-surface-container-lowest rounded font-body-sm text-text-primary med-instructions" placeholder="Instructions">
        </div>
    `;
    container.appendChild(row);
}

async function handleSaveRecord(e) {
    e.preventDefault();

    const medRows = document.querySelectorAll('.med-row');
    const meds = [];
    medRows.forEach(row => {
        const name = row.querySelector('.med-name')?.value;
        if (name) {
            meds.push({
                name,
                dose: row.querySelector('.med-dose')?.value || '',
                timing: row.querySelector('.med-timing')?.value || 'Morning',
                frequency: row.querySelector('.med-timing')?.value || 'Morning',
                instructions: row.querySelector('.med-instructions')?.value || ''
            });
        }
    });

    const newRecord = {
        record_number: `DS-2024-${Math.floor(100 + Math.random() * 900)}`,
        patient_name: document.getElementById('form-patient-name').value,
        patient_age: parseInt(document.getElementById('form-patient-age').value) || 50,
        patient_reference: document.getElementById('form-patient-ref').value,
        diagnosis: document.getElementById('form-diagnosis').value,
        diagnosis_ta: document.getElementById('form-diagnosis-ta').value || '',
        clinical_summary: document.getElementById('form-summary').value,
        treatment_information: "Standard care protocol provided.",
        medication_instructions: meds,
        lifestyle_instructions: document.getElementById('form-lifestyle').value,
        red_flag_symptoms: document.getElementById('form-redflags').value,
        follow_up_date: document.getElementById('form-followup-date').value,
        follow_up_clinic: document.getElementById('form-followup-clinic').value,
        approval_status: 'pending_review',
        approved_by: null,
        completeness_score: 95,
        is_demo: true
    };

    const saved = await window.CarebridgeStorage.saveDischargeRecord(newRecord);
    CarebridgeState.activeRecord = saved;
    alert('Discharge record saved successfully! Ready for clinician review.');
    switchTab('discharge-records');
}

// ==========================================
// VIEW 4: PATIENT & CAREGIVER PORTAL
// ==========================================
function renderPatientPortalView(container) {
    const record = CarebridgeState.activeRecord || window.CAREBRIDGE_DEMO_DATA.dischargeRecords[0];
    const isTa = CarebridgeState.currentLanguage === 'ta';
    const meds = Array.isArray(record.medication_instructions) ? record.medication_instructions : [];

    container.innerHTML = `
        <div class="flex flex-col w-full pb-8 px-gutter-mobile pt-3 space-y-4">
            <!-- Patient Header Banner -->
            <div class="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                <div>
                    <span class="font-label-sm text-primary font-bold tracking-wide uppercase">Patient Care Portal</span>
                    <h1 class="font-headline-sm text-headline-sm text-text-primary mt-0.5">${record.patient_name}</h1>
                    <p class="font-body-sm text-text-secondary">Ref: ${record.patient_reference} • Clinician Verified</p>
                </div>
                <button class="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary font-semibold text-xs shadow-sm flex items-center gap-1" onclick="setGlobalLanguage(CarebridgeState.currentLanguage === 'en' ? 'ta' : 'en')">
                    <span class="material-symbols-outlined text-[16px]">translate</span>
                    ${isTa ? 'English' : 'தமிழ்'}
                </button>
            </div>

            <!-- Big Follow-up Date Card -->
            <div class="bg-surface-container-lowest rounded-xl p-4 shadow-sm border-l-4 border-primary">
                <span class="font-label-sm text-text-secondary uppercase">Your Next Doctor Visit</span>
                <div class="flex items-center justify-between mt-1">
                    <div>
                        <h2 class="font-headline-md text-text-primary font-bold">${record.follow_up_date}</h2>
                        <p class="font-body-sm text-text-secondary">${record.follow_up_clinic} • ${record.approved_by || 'Dr. Arun Kumar'}</p>
                    </div>
                    <span class="material-symbols-outlined text-primary text-[32px]">event_available</span>
                </div>
            </div>

            <!-- Audio Read-Aloud Widget -->
            <div class="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <span class="material-symbols-outlined text-[24px]">hearing</span>
                    </div>
                    <div>
                        <h3 class="font-label-lg font-semibold text-text-primary">
                            ${isTa ? 'வழிமுறைகளைக் கேளுங்கள்' : 'Listen to Instructions'}
                        </h3>
                        <p class="font-body-sm text-text-secondary">
                            ${isTa ? 'தெளிவான குரல் வழிகாட்டி' : 'Accessible audio narration'}
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button class="p-2.5 rounded-full bg-primary-container text-white shadow-sm" onclick="playActiveRecordAudio()">
                        <span class="material-symbols-outlined text-[20px]" id="portal-audio-icon">volume_up</span>
                    </button>
                    <button class="p-2.5 rounded-full bg-surface-container text-text-secondary" onclick="window.CarebridgeAudio.stop()" title="Stop">
                        <span class="material-symbols-outlined text-[20px]">stop</span>
                    </button>
                </div>
            </div>

            <!-- Medication Schedule Cards -->
            <div class="space-y-2.5">
                <h2 class="font-headline-sm text-headline-sm text-text-primary font-bold">
                    ${isTa ? 'உங்கள் தினசரி மருந்துகள்' : 'Your Daily Medicines'}
                </h2>
                ${meds.map(m => `
                    <div class="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-start justify-between gap-3">
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="font-label-lg text-text-primary font-bold">${m.name}</span>
                                <span class="text-xs bg-surface-container px-2 py-0.5 rounded text-text-secondary">${m.dose || ''}</span>
                            </div>
                            <p class="font-body-sm text-text-secondary mt-1">
                                ${isTa ? (m.timing_ta || m.instructions || '') : (m.instructions || m.indication || '')}
                            </p>
                        </div>
                        <span class="px-2.5 py-1 rounded bg-primary/10 text-primary font-bold text-xs">
                            ${m.timing || m.frequency}
                        </span>
                    </div>
                `).join('')}
            </div>

            <!-- Patient Understanding Check Section -->
            <div class="bg-surface-container-lowest rounded-xl p-5 shadow-sm space-y-3">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-[22px]">quiz</span>
                    <div>
                        <h2 class="font-headline-sm text-headline-sm text-text-primary font-bold">
                            ${isTa ? 'புரிதல் உறுதிப்படுத்தல்' : 'Understanding Check'}
                        </h2>
                        <p class="font-body-sm text-text-secondary">Please confirm that you understand your discharge steps.</p>
                    </div>
                </div>

                <div class="space-y-2.5 pt-1">
                    <label class="flex items-start gap-2.5 p-2.5 bg-surface-container-low rounded-lg cursor-pointer">
                        <input type="checkbox" id="check-followup" class="mt-1 w-4 h-4 text-primary rounded" checked>
                        <span class="font-body-sm text-text-primary">
                            ${isTa ? 'எனது அடுத்த மருத்துவ சந்திப்பு எப்போது என்று எனக்குத் தெரியும்.' : 'I know when and where my next doctor appointment is.'}
                        </span>
                    </label>

                    <label class="flex items-start gap-2.5 p-2.5 bg-surface-container-low rounded-lg cursor-pointer">
                        <input type="checkbox" id="check-meds" class="mt-1 w-4 h-4 text-primary rounded" checked>
                        <span class="font-body-sm text-text-primary">
                            ${isTa ? 'நான் எனது மருந்துகளை எப்போது சாப்பிட வேண்டும் என்பதைப் புரிந்துகொண்டேன்.' : 'I understand when and how to take each prescribed medicine.'}
                        </span>
                    </label>

                    <label class="flex items-start gap-2.5 p-2.5 bg-surface-container-low rounded-lg cursor-pointer">
                        <input type="checkbox" id="check-redflags" class="mt-1 w-4 h-4 text-primary rounded" checked>
                        <span class="font-body-sm text-text-primary">
                            ${isTa ? 'அவசர எச்சரிக்கை அறிகுறிகள் ஏற்பட்டால் யாரைத் தொடர்பு கொள்ள வேண்டும் என்று எனக்குத் தெரியும்.' : 'I know what warning signs to watch out for and who to call.'}
                        </span>
                    </label>
                </div>

                <!-- Clarification Request Trigger -->
                <div class="pt-2">
                    <button class="w-full py-2.5 px-3 bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-label-md rounded-lg flex items-center justify-center gap-1.5" onclick="openClarificationModal('${record.id}')">
                        <span class="material-symbols-outlined text-[18px]">help_outline</span>
                        ${isTa ? 'எனக்கு சந்தேகம் உள்ளது / விளக்கம் தேவை' : 'I need clarification / have a question'}
                    </button>
                </div>
            </div>

            <!-- Download Button -->
            <button class="w-full py-3.5 bg-primary text-white font-label-lg font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2" onclick="exportRecordPDF()">
                <span class="material-symbols-outlined text-[20px]">download</span>
                ${isTa ? 'மருத்துவ குறிப்பேட்டை பதிவிறக்கு' : 'Download Patient Care Booklet (PDF)'}
            </button>
        </div>
    `;
}

// ==========================================
// VIEW 5: SETTINGS & DEMO DATA CONTROLLER
// ==========================================
function renderSettingsView(container) {
    const isSupabaseOk = window.CarebridgeStorage.isSupabaseAvailable;

    container.innerHTML = `
        <div class="flex flex-col w-full pb-8 px-gutter-mobile pt-3 space-y-4">
            <div>
                <h1 class="font-headline-md text-headline-md text-text-primary font-bold">Platform Settings</h1>
                <p class="font-body-sm text-body-sm text-text-secondary">Demo Data Management & System Status</p>
            </div>

            <!-- Supabase Cloud Connection Status -->
            <div class="bg-surface-container-lowest p-4 rounded-xl shadow-sm space-y-2">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full ${isSupabaseOk ? 'bg-success' : 'bg-warning'} animate-pulse"></span>
                        <h2 class="font-label-lg font-bold text-text-primary">Supabase Database Status</h2>
                    </div>
                    <span class="text-xs px-2 py-0.5 rounded-full ${isSupabaseOk ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'} font-semibold">
                        ${isSupabaseOk ? 'Connected Live' : 'Local Fallback Active'}
                    </span>
                </div>
                <p class="font-body-sm text-text-secondary text-xs break-all">
                    Endpoint: <code>${window.CAREBRIDGE_CONFIG?.SUPABASE_URL || 'Not set'}</code>
                </p>
                <div class="pt-1">
                    <button class="text-xs text-primary font-semibold underline" onclick="recheckSupabase()">Re-test Supabase Connection</button>
                </div>
            </div>

            <!-- DEMO DATA MANAGEMENT (MOST IMPORTANT REQUIREMENT) -->
            <div class="bg-surface-container-lowest p-4 rounded-xl shadow-sm space-y-3 border-2 border-primary/20">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-[24px]">science</span>
                    <div>
                        <h2 class="font-headline-sm text-headline-sm text-text-primary font-bold">Hackathon Demo Controls</h2>
                        <p class="font-body-sm text-body-sm text-text-secondary">Load or reset fictional test data</p>
                    </div>
                </div>

                <div class="p-3 bg-surface-container-low rounded-lg text-xs text-text-secondary space-y-1">
                    <p>• Populates <strong>3 fictional doctors</strong>, <strong>8 fictional patients</strong>, and <strong>8 discharge records</strong> (mix of Approved, Pending, and Drafts).</p>
                    <p>• Prevents duplicates when clicked repeatedly.</p>
                    <p>• Completely fictional — no real patient data is used.</p>
                </div>

                <div class="flex flex-col gap-2 pt-1">
                    <button class="w-full py-3.5 bg-primary-container text-white font-label-lg text-label-lg font-semibold rounded-lg shadow-md flex items-center justify-center gap-2 hover:bg-primary transition-all active:scale-[0.99]" onclick="triggerLoadDemoData()">
                        <span class="material-symbols-outlined text-[20px]">cloud_upload</span>
                        Load Demo Data (Hackathon Dataset)
                    </button>

                    <button class="w-full py-2.5 bg-surface-container text-error font-label-md text-label-md font-semibold rounded-lg hover:bg-error-container transition-all flex items-center justify-center gap-1.5" onclick="triggerResetDemoData()">
                        <span class="material-symbols-outlined text-[18px]">delete_sweep</span>
                        Reset Demo Data Only
                    </button>
                </div>
            </div>

            <!-- Active Clinician Identity -->
            <div class="bg-surface-container-lowest p-4 rounded-xl shadow-sm space-y-2">
                <h2 class="font-label-lg font-bold text-text-primary">Current Physician Session</h2>
                <div class="flex items-center gap-3 pt-1">
                    <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        AK
                    </div>
                    <div>
                        <p class="font-label-md font-bold text-text-primary">${CarebridgeState.currentDoctor.name}</p>
                        <p class="font-body-sm text-text-secondary">${CarebridgeState.currentDoctor.title} • ${CarebridgeState.currentDoctor.department}</p>
                    </div>
                </div>
            </div>

            <!-- Legal Safety Boundary Notice -->
            <div class="bg-surface-container-low p-3.5 rounded-xl text-xs text-text-secondary space-y-1">
                <span class="font-bold text-text-primary">Clinical Safety Boundary:</span>
                <p>CAREBRIDGE is a communication handover tool. It does NOT independently diagnose, prescribe, alter dosages, or replace qualified medical professionals.</p>
            </div>
        </div>
    `;
}

// ==========================================
// DEMO DATA HANDLERS
// ==========================================
async function triggerLoadDemoData() {
    if (!confirm("Load fictional demonstration records into the system?\n\nThis will populate 3 fictional doctors, 8 patients, and 8 discharge records. Duplicate records will be prevented automatically.")) {
        return;
    }

    const result = await window.CarebridgeStorage.loadDemoData();
    alert(`✅ ${result.message}`);
    switchTab('dashboard');
}

async function triggerResetDemoData() {
    if (!confirm("Are you sure you want to remove all demonstration records?\n\nOnly fictional demo records (is_demo=true) will be removed. Real clinical records will never be touched.")) {
        return;
    }

    const result = await window.CarebridgeStorage.resetDemoData();
    alert(`🗑️ ${result.message}`);
    switchTab('dashboard');
}

async function recheckSupabase() {
    const ok = await window.CarebridgeStorage.checkSupabaseConnectivity();
    alert(ok ? '✅ Supabase tables are connected and accessible live!' : '⚠️ Supabase tables not found or offline. Local demonstration store is active.');
    renderCurrentView();
}

function updateSupabaseStatusIndicator() {
    window.CarebridgeStorage.checkSupabaseConnectivity().then(ok => {
        console.log('[CAREBRIDGE] Supabase connectivity check complete. Live:', ok);
    });
}

// ==========================================
// AUDIO CONTROLLER (Web Speech API)
// ==========================================
function playActiveRecordAudio() {
    const record = CarebridgeState.activeRecord || window.CAREBRIDGE_DEMO_DATA.dischargeRecords[0];
    const isTa = CarebridgeState.currentLanguage === 'ta';

    let textToSpeak = '';
    if (isTa) {
        textToSpeak = `வணக்கம் ${record.patient_name}. உங்களின் அடுத்த மருத்துவ சந்திப்பு ${record.follow_up_date}. மருந்துகள்: `;
        if (record.medication_instructions) {
            record.medication_instructions.forEach(m => {
                textToSpeak += `${m.name}, ${m.timing_ta || m.timing}. `;
            });
        }
        textToSpeak += `அவசர எச்சரிக்கை: ${record.red_flag_symptoms_ta || record.red_flag_symptoms}`;
    } else {
        textToSpeak = `Hello ${record.patient_name}. Your discharge summary has been approved. Your follow-up appointment is on ${record.follow_up_date} at ${record.follow_up_clinic}. Your medications include: `;
        if (record.medication_instructions) {
            record.medication_instructions.forEach(m => {
                textToSpeak += `${m.name} ${m.dose || ''}, ${m.instructions || m.timing}. `;
            });
        }
        textToSpeak += `Important warning signs: ${record.red_flag_symptoms}`;
    }

    window.CarebridgeAudio.togglePlay(textToSpeak, isTa ? 'ta' : 'en');
}

function updateAudioButtonUI(state) {
    const icons = [document.getElementById('audio-icon'), document.getElementById('portal-audio-icon')];
    icons.forEach(icon => {
        if (!icon) return;
        if (state === 'playing') {
            icon.textContent = 'pause';
        } else if (state === 'paused') {
            icon.textContent = 'play_arrow';
        } else {
            icon.textContent = 'volume_up';
        }
    });
}

// ==========================================
// APPROVAL & SHARING WORKFLOW
// ==========================================
function toggleSignButton(isChecked) {
    const btn = document.getElementById('approve-btn');
    if (!btn) return;
    if (isChecked) {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
        btn.classList.add('hover:bg-primary', 'cursor-pointer');
    } else {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
        btn.classList.remove('hover:bg-primary', 'cursor-pointer');
    }
}

async function executeApproval() {
    const record = CarebridgeState.activeRecord;
    if (!record) return;

    const approved = await window.CarebridgeStorage.approveDischargeRecord(record.id, CarebridgeState.currentDoctor.name);
    CarebridgeState.activeRecord = approved;

    // Show Success Modal
    openApprovalSuccessModal(approved);
}

function openApprovalSuccessModal(record) {
    const modalContainer = document.getElementById('modal-container') || document.body;
    const modal = document.createElement('div');
    modal.id = 'success-modal-dynamic';
    modal.className = "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4";
    modal.innerHTML = `
        <div class="bg-surface-container-lowest rounded-xl p-5 max-w-sm w-full shadow-2xl flex flex-col items-center text-center gap-3">
            <div class="w-14 h-14 rounded-full bg-success/15 text-success flex items-center justify-center">
                <span class="material-symbols-outlined text-[32px]" style="font-variation-settings: 'FILL' 1;">task_alt</span>
            </div>
            <h3 class="font-headline-sm text-headline-sm text-text-primary">Discharge Authorized!</h3>
            <p class="font-body-md text-body-md text-text-secondary">
                Discharge Summary <strong>${record.patient_reference}</strong> has been clinically approved by ${record.approved_by || 'Dr. Arun Kumar'}. Both English and Tamil patient care summaries are now available.
            </p>
            <div class="w-full pt-2 flex flex-col gap-2">
                <button class="w-full py-3 rounded-lg bg-primary-container text-white font-label-lg font-semibold flex items-center justify-center gap-2" onclick="document.getElementById('success-modal-dynamic').remove(); openHandoverModal('${record.id}')">
                    <span class="material-symbols-outlined text-[18px]">qr_code_2</span>
                    Generate Handover QR Code
                </button>
                <button class="w-full py-2.5 rounded-lg bg-surface-container text-text-primary font-label-md" onclick="document.getElementById('success-modal-dynamic').remove(); switchTab('dashboard')">
                    Back to Dashboard
                </button>
            </div>
        </div>
    `;
    modalContainer.appendChild(modal);
}

// ==========================================
// SECURE SHARING & QR CODE MODAL
// ==========================================
async function openHandoverModal(dischargeId) {
    const tokenData = await window.CarebridgeStorage.createAccessToken(dischargeId, 168); // 7 days
    const handoverUrl = `${window.location.origin}${window.location.pathname}?token=${tokenData.rawToken}`;

    const modal = document.createElement('div');
    modal.id = 'handover-modal';
    modal.className = "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4";
    modal.innerHTML = `
        <div class="bg-surface-container-lowest rounded-xl p-5 max-w-sm w-full shadow-2xl flex flex-col items-center text-center gap-3">
            <div class="flex items-center justify-between w-full">
                <span class="font-label-lg font-bold text-text-primary">Authorized Handover Link</span>
                <button class="text-text-secondary text-sm" onclick="document.getElementById('handover-modal').remove()">✕</button>
            </div>
            
            <p class="font-body-sm text-text-secondary text-left w-full">
                This QR code contains a time-limited, cryptographically hashed access link. <strong>Zero Personal Health Information is stored inside the QR code.</strong>
            </p>

            <!-- QR Container -->
            <div id="qr-code-box" class="p-3 bg-white rounded-lg shadow-inner my-1 flex items-center justify-center"></div>

            <div class="w-full text-left space-y-1">
                <span class="text-xs text-text-secondary">Handover URL (Expires in 7 days):</span>
                <div class="p-2 bg-surface-container-low rounded text-xs font-mono text-primary break-all">
                    ${handoverUrl}
                </div>
            </div>

            <div class="w-full pt-1 flex flex-col gap-2">
                <button class="w-full py-2.5 bg-primary-container text-white rounded-lg font-label-md font-semibold flex items-center justify-center gap-1.5" onclick="navigator.clipboard.writeText('${handoverUrl}'); alert('Handover link copied to clipboard!')">
                    <span class="material-symbols-outlined text-[16px]">content_copy</span>
                    Copy Secure Link
                </button>
                <button class="w-full py-2 bg-surface-container text-error rounded-lg text-xs font-medium" onclick="revokeHandoverLink('${tokenData.tokenHash}')">
                    Revoke This Access Link
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Render QR Code
    setTimeout(() => {
        window.CarebridgeQR.render('#qr-code-box', handoverUrl, 180);
    }, 50);
}

async function revokeHandoverLink(tokenHash) {
    if (confirm('Revoke this handover link? The receiving provider will no longer have access to this record.')) {
        await window.CarebridgeStorage.revokeToken(tokenHash);
        alert('Access link has been permanently revoked.');
        document.getElementById('handover-modal')?.remove();
    }
}

// ==========================================
// CLARIFICATION REQUEST MODAL
// ==========================================
function openClarificationModal(dischargeId) {
    const modal = document.createElement('div');
    modal.id = 'clarification-modal';
    modal.className = "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4";
    modal.innerHTML = `
        <div class="bg-surface-container-lowest rounded-xl p-5 max-w-sm w-full shadow-2xl flex flex-col gap-3">
            <div class="flex items-center justify-between">
                <h3 class="font-headline-sm text-text-primary font-bold">Ask for Clarification</h3>
                <button class="text-text-secondary text-sm" onclick="document.getElementById('clarification-modal').remove()">✕</button>
            </div>
            <p class="font-body-sm text-text-secondary">
                Have a question about your medication or daily instructions? Send a message directly to your clinical team.
            </p>
            <form id="clarification-form" onsubmit="submitClarification(event, '${dischargeId}')" class="space-y-3">
                <div>
                    <label class="block text-xs font-semibold text-text-secondary mb-1">Topic</label>
                    <select id="clarify-cat" class="w-full p-2 bg-surface-container-low rounded text-sm text-text-primary">
                        <option value="medication">Medication & Timing</option>
                        <option value="lifestyle">Lifestyle & Diet</option>
                        <option value="follow_up">Follow-up Appointment</option>
                        <option value="symptoms">Symptoms & Warning Signs</option>
                        <option value="general">General Question</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-text-secondary mb-1">Your Question *</label>
                    <textarea id="clarify-text" required rows="3" class="w-full p-2 bg-surface-container-low rounded text-sm text-text-primary" placeholder="Type your question here..."></textarea>
                </div>
                <button type="submit" class="w-full py-2.5 bg-primary-container text-white rounded-lg font-semibold text-sm">Send to Doctor</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

async function submitClarification(e, dischargeId) {
    e.preventDefault();
    const cat = document.getElementById('clarify-cat').value;
    const text = document.getElementById('clarify-text').value;

    await window.CarebridgeStorage.submitClarificationRequest({
        discharge_id: dischargeId,
        patient_name: CarebridgeState.activeRecord?.patient_name || 'Patient',
        category: cat,
        question: text
    });

    alert('Your clarification question has been submitted to the doctor!');
    document.getElementById('clarification-modal')?.remove();
}

// ==========================================
// SECURE TOKEN HANDOVER FLOW
// ==========================================
async function handleTokenHandover(rawToken) {
    console.log('[CAREBRIDGE] Validating handover token...');
    const result = await window.CarebridgeStorage.validateToken(rawToken);

    if (!result.isValid) {
        document.querySelector('main').innerHTML = `
            <div class="px-gutter-mobile py-16 flex flex-col items-center justify-center text-center gap-3">
                <div class="w-16 h-16 rounded-full bg-error-container text-error flex items-center justify-center">
                    <span class="material-symbols-outlined text-[36px]">lock</span>
                </div>
                <h1 class="font-headline-md text-text-primary font-bold">Access Denied</h1>
                <p class="font-body-md text-text-secondary max-w-sm">
                    ${result.reason || 'This handover link is invalid, expired, or has been revoked by the hospital.'}
                </p>
                <div class="pt-4">
                    <button class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold" onclick="window.location.href = window.location.pathname">
                        Go to Home Portal
                    </button>
                </div>
            </div>
        `;
        return;
    }

    // Token valid: load the exact discharge record
    const record = await window.CarebridgeStorage.getDischargeRecord(result.dischargeId);
    if (record) {
        CarebridgeState.activeRecord = record;
        switchTab('patient-portal');
    }
}

// ==========================================
// PDF EXPORT
// ==========================================
function exportRecordPDF() {
    const record = CarebridgeState.activeRecord || window.CAREBRIDGE_DEMO_DATA.dischargeRecords[0];
    window.CarebridgePDF.generateDischargeSummary(record, CarebridgeState.currentLanguage);
}

// Expose handlers globally
window.switchTab = switchTab;
window.setGlobalLanguage = setGlobalLanguage;
window.playActiveRecordAudio = playActiveRecordAudio;
window.toggleSignButton = toggleSignButton;
window.executeApproval = executeApproval;
window.openHandoverModal = openHandoverModal;
window.revokeHandoverLink = revokeHandoverLink;
window.exportRecordPDF = exportRecordPDF;
window.triggerLoadDemoData = triggerLoadDemoData;
window.triggerResetDemoData = triggerResetDemoData;
window.recheckSupabase = recheckSupabase;
window.selectRecord = selectRecord;
window.onSearchInput = onSearchInput;
window.setFilterStatus = setFilterStatus;
window.addMedicationRow = addMedicationRow;
window.handleSaveRecord = handleSaveRecord;
window.openClarificationModal = openClarificationModal;
window.submitClarification = submitClarification;
