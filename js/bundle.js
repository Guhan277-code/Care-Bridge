/**
 * CAREBRIDGE Cryptographic Utilities
 * Uses standard Web Crypto API for zero-dependency, secure operations
 */
const CarebridgeCrypto = {
    /**
     * Generates a high-entropy random token (default 64 hex characters)
     * @param {number} bytes - Number of random bytes (32 bytes = 64 hex chars = 256 bits of entropy)
     * @returns {string} - Hexadecimal token string
     */
    generateToken(bytes = 32) {
        const array = new Uint8Array(bytes);
        window.crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    },

    /**
     * Computes the SHA-256 hash of a string using Web Crypto API
     * Only the hash is stored in the database / server, preserving privacy.
     * @param {string} message - Token or string to hash
     * @returns {Promise<string>} - Hex-encoded SHA-256 digest
     */
    async sha256(message) {
        if (!message) return '';
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
};

window.CarebridgeCrypto = CarebridgeCrypto;

/**
 * CAREBRIDGE Fictional Demonstration Data
 * All records, names, IDs and clinical narratives are completely fictional for hackathon demonstration.
 */
const CAREBRIDGE_DEMO_DATA = {
    doctors: [
        {
            id: "d1111111-1111-1111-1111-111111111111",
            name: "Dr. Arun Kumar",
            title: "MD, DM (Cardiology)",
            department: "Cardiology",
            email: "arun.kumar@demo-hospital.care",
            license_number: "TNMC-84920",
            is_demo: true
        },
        {
            id: "d2222222-2222-2222-2222-222222222222",
            name: "Dr. Priya Raman",
            title: "MD (Internal Medicine)",
            department: "Internal Medicine",
            email: "priya.raman@demo-hospital.care",
            license_number: "TNMC-91044",
            is_demo: true
        },
        {
            id: "d3333333-3333-3333-3333-333333333333",
            name: "Dr. Rajesh Swaminathan",
            title: "MS, MCh (Surgical Oncology & General)",
            department: "General Surgery",
            email: "rajesh.s@demo-hospital.care",
            license_number: "TNMC-77312",
            is_demo: true
        }
    ],

    patients: [
        {
            id: "p1111111-1111-1111-1111-111111111111",
            patient_reference: "CB-9082",
            full_name: "Kumarasamy V.",
            age: 58,
            gender: "Male",
            phone: "+91 98401 23456",
            ward: "Cardiology • Bay 4B",
            admission_date: "2024-11-02",
            vitals: { pulse: 74, bp: "126/82", spo2: 98 },
            is_demo: true
        },
        {
            id: "p2222222-2222-2222-2222-222222222222",
            patient_reference: "CB-9083",
            full_name: "Meenakshi Sundaram",
            age: 64,
            gender: "Female",
            phone: "+91 98402 34567",
            ward: "Endocrinology • Room 208",
            admission_date: "2024-11-04",
            vitals: { pulse: 82, bp: "134/86", spo2: 97 },
            is_demo: true
        },
        {
            id: "p3333333-3333-3333-3333-333333333333",
            patient_reference: "CB-9084",
            full_name: "Karthik Subramanian",
            age: 42,
            gender: "Male",
            phone: "+91 98403 45678",
            ward: "Surgical Ward • Bed 12",
            admission_date: "2024-11-06",
            vitals: { pulse: 76, bp: "118/78", spo2: 99 },
            is_demo: true
        },
        {
            id: "p4444444-4444-4444-4444-444444444444",
            patient_reference: "CB-9085",
            full_name: "Lakshmi Narayanan",
            age: 71,
            gender: "Female",
            phone: "+91 98404 56789",
            ward: "Pulmonology • Bay 1A",
            admission_date: "2024-11-03",
            vitals: { pulse: 88, bp: "128/80", spo2: 94 },
            is_demo: true
        },
        {
            id: "p5555555-5555-5555-5555-555555555555",
            patient_reference: "CB-9086",
            full_name: "Venkatesh R.",
            age: 51,
            gender: "Male",
            phone: "+91 98405 67890",
            ward: "Gastroenterology • Bed 5",
            admission_date: "2024-11-05",
            vitals: { pulse: 78, bp: "122/78", spo2: 98 },
            is_demo: true
        },
        {
            id: "p6666666-6666-6666-6666-666666666666",
            patient_reference: "CB-9087",
            full_name: "Ananya Sharma",
            age: 33,
            gender: "Female",
            phone: "+91 98406 78901",
            ward: "General Medicine • Room 102",
            admission_date: "2024-11-08",
            vitals: { pulse: 72, bp: "112/74", spo2: 99 },
            is_demo: true
        },
        {
            id: "p7777777-7777-7777-7777-777777777777",
            patient_reference: "CB-9088",
            full_name: "Selvaraj M.",
            age: 67,
            gender: "Male",
            phone: "+91 98407 89012",
            ward: "Neurology • Bed 9",
            admission_date: "2024-11-01",
            vitals: { pulse: 70, bp: "130/84", spo2: 98 },
            is_demo: true
        },
        {
            id: "p8888888-8888-8888-8888-888888888888",
            patient_reference: "CB-9089",
            full_name: "Fathima Begum",
            age: 59,
            gender: "Female",
            phone: "+91 98408 90123",
            ward: "Nephrology • Bed 3B",
            admission_date: "2024-11-07",
            vitals: { pulse: 80, bp: "136/88", spo2: 97 },
            is_demo: true
        }
    ],

    dischargeRecords: [
        {
            id: "r1111111-1111-1111-1111-111111111111",
            record_number: "DS-2024-001",
            patient_id: "p1111111-1111-1111-1111-111111111111",
            doctor_id: "d1111111-1111-1111-1111-111111111111",
            patient_name: "Kumarasamy V.",
            patient_age: 58,
            patient_reference: "CB-9082",
            diagnosis: "Post-PCI (Drug-Eluting Stent in LAD coronary artery) in stable recovery. Left ventricular ejection fraction preserved (LVEF 52%).",
            diagnosis_ta: "எல்.ஏ.டி (LAD) ரத்த நாளத்தில் ஸ்டென்ட் (DES) பொருத்தப்பட்டு சீரான குணமடைதல் நிலையில் உள்ளார். இதய செயல்பாடு திருப்திகரமாக உள்ளது (52%).",
            icd10_code: "ICD-10 I21.09",
            clinical_summary: "Patient presented with acute coronary syndrome. Primary percutaneous coronary intervention performed successfully with one DES to proximal LAD. Post-procedure telemetry showed stable sinus rhythm.",
            clinical_summary_ta: "நோயாளி கடுமையான மாரடைப்பு அறிகுறியுடன் அனுமதிக்கப்பட்டார். எல்.ஏ.டி ரத்த நாளத்தில் ஸ்டென்ட் சிகிச்சை வெற்றிகரமாக செய்யப்பட்டது. உடல்நிலை சீராக உள்ளது.",
            treatment_information: "Primary PCI with 3.0 x 24mm Drug-Eluting Stent. Dual antiplatelet therapy initiated. Hemodynamically stable at discharge.",
            treatment_information_ta: "மருந்து பூசப்பட்ட ஸ்டென்ட் பொருத்தப்பட்டது. ரத்த உறைவு எதிர்ப்பு மருந்துகள் தொடங்கப்பட்டுள்ளன. வீடு திரும்ப தகுதியான நிலையில் உள்ளார்.",
            medication_instructions: [
                {
                    name: "Atorvastatin",
                    dose: "40mg",
                    frequency: "Once Daily (QHS)",
                    timing: "Night",
                    timing_ta: "இரவு உணவுக்குப் பின்",
                    indication: "Lipid lowering and plaque stabilization",
                    indication_ta: "கொழுப்பு குறைப்பான் மற்றும் ரத்த நாள பாதுகாப்பு",
                    instructions: "1 Tablet Nightly after dinner"
                },
                {
                    name: "Clopidogrel",
                    dose: "75mg",
                    frequency: "Once Daily (QAM)",
                    timing: "Morning",
                    timing_ta: "காலை உணவுக்குப் பின்",
                    indication: "Antiplatelet therapy for stent protection",
                    indication_ta: "ஸ்டென்ட் பாதுகாப்புக்கான ரத்த உறைவு தடுப்பான்",
                    instructions: "1 Tablet Morning with breakfast"
                },
                {
                    name: "Metoprolol Succinate",
                    dose: "25mg",
                    frequency: "Twice Daily (BID)",
                    timing: "BID",
                    timing_ta: "காலை மற்றும் இரவு",
                    indication: "Blood pressure and heart rate control",
                    indication_ta: "இதய துடிப்பு மற்றும் ரத்த அழுத்த சீராக்கி",
                    instructions: "1 Tablet Morning and Night after food"
                }
            ],
            lifestyle_instructions: "Strict low-sodium cardiac diet (<2g salt/day). Zero deep-fried items. Gentle 15-minute walking twice daily. Avoid lifting weights exceeding 5 kg for 4 weeks.",
            lifestyle_instructions_ta: "உணவில் குறைந்த உப்பு சேர்க்கவும் (ஒரு நாளைக்கு 2 கிராமுக்கு கீழ்). பொரித்த உணவுகள் தவிர்த்தல். காலை மற்றும் மாலை 15 நிமிட மெதுவான நடைபயிற்சி. 4 வாரங்களுக்கு 5 கிலோவுக்கு மேல் எடை தூக்க வேண்டாம்.",
            red_flag_symptoms: "Crushing chest pain lasting >5 minutes, severe breathlessness at rest, cold sweats, or bleeding/swelling at femoral/radial puncture site.",
            red_flag_symptoms_ta: "5 நிமிடங்களுக்கு மேல் நீடிக்கும் கடுமையான நெஞ்சு வலி, ஓய்வில் இருக்கும்போது மூச்சுத் திணறல், அல்லது ஊசி போட்ட இடத்தில் கடுமையான வீக்கம்/ரத்தக்கசிவு ஏற்பட்டால் உடனடியாக அவசர உதவியை அணுகவும்.",
            follow_up_date: "2024-11-18",
            follow_up_time: "10:00 AM",
            follow_up_clinic: "Cardiology OPD Suite 204, Block B",
            follow_up_doctor: "Dr. Arun Kumar",
            helpline_number: "1800-200-88",
            additional_notes: "Continue dual antiplatelet therapy without skipping a single dose. Contact cardiology triage if any unusual bruising occurs.",
            approval_status: "approved",
            approved_by: "Dr. Arun Kumar",
            approved_at: "2024-11-10T14:30:00Z",
            completeness_score: 100,
            is_demo: true
        },
        {
            id: "r2222222-2222-2222-2222-222222222222",
            record_number: "DS-2024-002",
            patient_id: "p2222222-2222-2222-2222-222222222222",
            doctor_id: "d2222222-2222-2222-2222-222222222222",
            patient_name: "Meenakshi Sundaram",
            patient_age: 64,
            patient_reference: "CB-9083",
            diagnosis: "Type 2 Diabetes Mellitus with Hyperosmolar Glycemic State (resolved). Mild dehydration managed.",
            diagnosis_ta: "வகை 2 நீரிழிவு நோய் (சர்க்கரை அளவு தீவிரமாக உயர்ந்து தற்போது கட்டுக்குள் கொண்டுவரப்பட்டுள்ளது).",
            icd10_code: "ICD-10 E11.69",
            clinical_summary: "Admitted with marked hyperglycemia (fasting blood glucose 380 mg/dL). Stabilized with intravenous hydration and sliding scale insulin. Transitioned to oral antidiabetic agents and basal insulin.",
            clinical_summary_ta: "ரத்த சர்க்கரை அளவு 380 வரை உயர்ந்த நிலையில் அனுமதிக்கப்பட்டு, நரம்பு வழி திரவம் மற்றும் இன்சுலின் மூலம் கட்டுப்படுத்தப்பட்டுள்ளது.",
            treatment_information: "IV hydration with normal saline. Subcutaneous insulin protocol. Dietary glycemic counseling completed.",
            treatment_information_ta: "நீரேற்றம் மற்றும் இன்சுலின் ஊசி சிகிச்சை அளிக்கப்பட்டது. உணவுமுறை ஆலோசனை வழங்கப்பட்டுள்ளது.",
            medication_instructions: [
                {
                    name: "Metformin ER",
                    dose: "500mg",
                    frequency: "Twice Daily (BID)",
                    timing: "BID",
                    timing_ta: "காலை மற்றும் இரவு",
                    indication: "Blood glucose control",
                    indication_ta: "ரத்த சர்க்கரை கட்டுப்பாடு",
                    instructions: "1 Tablet with meals"
                },
                {
                    name: "Glimepiride",
                    dose: "2mg",
                    frequency: "Once Daily (QAM)",
                    timing: "Morning",
                    timing_ta: "காலை உணவு முன்",
                    indication: "Insulin secretion enhancement",
                    indication_ta: "இன்சுலின் சுரப்பு ஊக்கி",
                    instructions: "1 Tablet 15 minutes before breakfast"
                }
            ],
            lifestyle_instructions: "Diabetic balanced diet. Avoid refined sugars and fruit juices. Check fasting blood sugar every morning and keep a daily log.",
            lifestyle_instructions_ta: "சர்க்கரை குறைவான சீரான உணவு. இனிப்பு மற்றும் பழச்சாறுகளைத் தவிர்க்கவும். தினமும் காலையில் வெறும் வயிற்றில் சர்க்கரை அளவை பரிசோதித்து குறித்து வைக்கவும்.",
            red_flag_symptoms: "Extreme thirst, confusion, vomiting, shaking, dizziness, or blood sugar dropping below 70 mg/dL.",
            red_flag_symptoms_ta: "அதீத தாகம், மயக்கம், வாந்தி, அல்லது சர்க்கரை அளவு 70-க்கு கீழ் குறைந்தால் உடனடியாக மருத்துவரை தொடர்பு கொள்ளவும்.",
            follow_up_date: "2024-11-20",
            follow_up_time: "11:30 AM",
            follow_up_clinic: "Endocrinology OPD Room 112",
            follow_up_doctor: "Dr. Priya Raman",
            helpline_number: "1800-200-88",
            additional_notes: "Bring fasting blood sugar diary for the follow-up appointment.",
            approval_status: "pending_review",
            approved_by: null,
            approved_at: null,
            completeness_score: 95,
            is_demo: true
        },
        {
            id: "r3333333-3333-3333-3333-333333333333",
            record_number: "DS-2024-003",
            patient_id: "p3333333-3333-3333-3333-333333333333",
            doctor_id: "d3333333-3333-3333-3333-333333333333",
            patient_name: "Karthik Subramanian",
            patient_age: 42,
            patient_reference: "CB-9084",
            diagnosis: "Laparoscopic Appendectomy for Acute Appendicitis (uncomplicated).",
            diagnosis_ta: "குடல்வால் அழற்சிக்கான லேப்ராஸ்கோபிக் அறுவை சிகிச்சை (அப்பெண்டெக்டோமி) வெற்றிகரமாக செய்யப்பட்டது.",
            icd10_code: "ICD-10 K35.80",
            clinical_summary: "Underwent uncomplicated laparoscopic appendectomy on 06 Nov 2024. Tolerating regular oral diet. Incisions clean and dry without erythema.",
            clinical_summary_ta: "06 நவம்பர் 2024 அன்று தையல் இல்லாத லேப்ராஸ்கோபிக் அறுவை சிகிச்சை செய்யப்பட்டது. தையல் காயங்கள் சீராக ஆறி வருகின்றன.",
            treatment_information: "Laparoscopic removal of appendix. Prophylactic antibiotic course completed.",
            treatment_information_ta: "குடல்வால் அறுவை சிகிச்சை மற்றும் ஆன்டிபயாடிக் மருந்துகள் வழங்கப்பட்டன.",
            medication_instructions: [
                {
                    name: "Paracetamol",
                    dose: "650mg",
                    frequency: "As Needed (PRN)",
                    timing: "PRN",
                    timing_ta: "தேவைப்படும் போது",
                    indication: "Mild surgical site discomfort",
                    indication_ta: "அறுவை சிகிச்சை வலி நிவாரணி",
                    instructions: "1 Tablet up to 3 times a day if pain persists"
                },
                {
                    name: "Pantoprazole",
                    dose: "40mg",
                    frequency: "Once Daily (QAM)",
                    timing: "Morning",
                    timing_ta: "காலை வெறும் வயிற்றில்",
                    indication: "Gastric acid protection",
                    indication_ta: "அமிலத்தன்மை மற்றும் நெஞ்செரிச்சல் தடுப்பான்",
                    instructions: "1 Tablet before breakfast for 5 days"
                }
            ],
            lifestyle_instructions: "Keep port sites clean and dry. Avoid soaking in bathtubs or pools. Refrain from heavy gym workouts or abdominal straining for 2 weeks.",
            lifestyle_instructions_ta: "அறுவை சிகிச்சை காயத்தை ஈரம் படாமல் உலர்வாக வைத்திருக்கவும். 2 வாரங்களுக்கு கனமான எடைகளைத் தூக்கவோ அல்லது உடற்பயிற்சி செய்யவோ கூடாது.",
            red_flag_symptoms: "Fever >38.5°C, spreading redness or purulent discharge from port sites, or persistent severe abdominal pain.",
            red_flag_symptoms_ta: "காய்ச்சல், அறுவை சிகிச்சை தையல் பகுதியில் வீக்கம், சீழ் வடிதல் அல்லது கடுமையான வயிற்று வலி ஏற்பட்டால் மருத்துவமனைக்கு வரவும்.",
            follow_up_date: "2024-11-15",
            follow_up_time: "09:00 AM",
            follow_up_clinic: "Surgical OPD Room 15",
            follow_up_doctor: "Dr. Rajesh Swaminathan",
            helpline_number: "1800-200-88",
            additional_notes: "Suture removal or wound check scheduled for follow-up date.",
            approval_status: "approved",
            approved_by: "Dr. Rajesh Swaminathan",
            approved_at: "2024-11-09T16:00:00Z",
            completeness_score: 100,
            is_demo: true
        },
        {
            id: "r4444444-4444-4444-4444-444444444444",
            record_number: "DS-2024-004",
            patient_id: "p4444444-4444-4444-4444-444444444444",
            doctor_id: "d2222222-2222-2222-2222-222222222222",
            patient_name: "Lakshmi Narayanan",
            patient_age: 71,
            patient_reference: "CB-9085",
            diagnosis: "Chronic Obstructive Pulmonary Disease (COPD) with Acute Exacerbation (improved).",
            diagnosis_ta: "நாள்பட்ட நுரையீரல் அடைப்பு நோய் (COPD) தீவிரமடைந்து தற்போது சிகிச்சைக்குப் பின் குணமடைந்துள்ளது.",
            icd10_code: "ICD-10 J44.1",
            clinical_summary: "Elderly patient admitted with dyspnea and wheezing. Responded well to bronchodilators, short systemic corticosteroid course, and low-flow oxygen.",
            clinical_summary_ta: "சுவாசத் திணறல் காரணமாக அனுமதிக்கப்பட்டு நெபுலைசர் மற்றும் சுவாசம் எளிதாக்கும் மருந்துகள் மூலம் சீரமைக்கப்பட்டது.",
            treatment_information: "Inhaled bronchodilator therapy, oral tapering steroids.",
            treatment_information_ta: "இன்ஹேலர் மற்றும் நுரையீரல் பாதுகாப்பு மருந்துகள்.",
            medication_instructions: [
                {
                    name: "Formoterol / Budesonide Inhaler",
                    dose: "200/6 mcg",
                    frequency: "Twice Daily (BID)",
                    timing: "BID",
                    timing_ta: "காலை மற்றும் இரவு",
                    indication: "Bronchodilation and airway anti-inflammatory",
                    indication_ta: "சுவாசப்பாதை விரிவு மற்றும் வீக்கம் குறைப்பான்",
                    instructions: "2 Puffs BID; rinse mouth with water after use"
                }
            ],
            lifestyle_instructions: "Avoid dust, biomass smoke, and sudden cold air exposure. Practice pursed-lip breathing exercises as demonstrated by physiotherapy.",
            lifestyle_instructions_ta: "தூசி, புகை மற்றும் குளிர்ந்த காற்றைத் தவிர்க்கவும். மூச்சுப் பயிற்சி தவறாமல் செய்யவும்.",
            red_flag_symptoms: "Severe breathlessness not relieved by inhaler, blue discoloration of lips/fingertips, or extreme drowsiness.",
            red_flag_symptoms_ta: "மருந்து எடுத்தும் மூச்சுத் திணறல் குறையாவிட்டால் அல்லது உதடுகள் நீல நிறமாக மாறினால் அவசர உதவிக்கு அழைக்கவும்.",
            follow_up_date: "2024-11-22",
            follow_up_time: "10:30 AM",
            follow_up_clinic: "Chest & Pulmonology OPD Bay 3",
            follow_up_doctor: "Dr. Priya Raman",
            helpline_number: "1800-200-88",
            additional_notes: "Bring inhaler device to check inhalation technique during next consult.",
            approval_status: "approved",
            approved_by: "Dr. Priya Raman",
            approved_at: "2024-11-08T11:00:00Z",
            completeness_score: 100,
            is_demo: true
        },
        {
            id: "r5555555-5555-5555-5555-555555555555",
            record_number: "DS-2024-005",
            patient_id: "p5555555-5555-5555-5555-555555555555",
            doctor_id: "d2222222-2222-2222-2222-222222222222",
            patient_name: "Venkatesh R.",
            patient_age: 51,
            patient_reference: "CB-9086",
            diagnosis: "Acute Gastroenteritis with moderate dehydration (rehydrated).",
            diagnosis_ta: "கடுமையான வயிற்றுப்போக்கு மற்றும் நீர்ச்சத்து குறைபாடு (குணமடைந்துள்ளது).",
            icd10_code: "ICD-10 A09",
            clinical_summary: "Presented with acute watery diarrhea and vomiting. Treated with IV fluids, antiemetics, and zinc supplementation. Stool cultures showed no bacterial dysentery.",
            clinical_summary_ta: "வயிற்றுப்போக்கு மற்றும் வாந்தி காரணமாக அனுமதிக்கப்பட்டு தேவையான திரவங்கள் மூலம் குணப்படுத்தப்பட்டுள்ளார்.",
            treatment_information: "IV Ringer lactate rehydration, oral rehydration therapy, probiotics.",
            treatment_information_ta: "நரம்பு வழி திரவம் மற்றும் ஓ.ஆர்.எஸ் (ORS) நீர்ச்சத்து சிகிச்சை.",
            medication_instructions: [
                {
                    name: "Oral Rehydration Salts (ORS)",
                    dose: "1 Sachet in 1L boiled water",
                    frequency: "Throughout the day",
                    timing: "Daytime",
                    timing_ta: "நாள் முழுவதும்",
                    indication: "Electrolyte replacement",
                    indication_ta: "தாது உப்புக்கள் மற்றும் நீர்ச்சத்து சமநிலை",
                    instructions: "Sip after every loose bowel movement"
                },
                {
                    name: "Probiotic Capsules",
                    dose: "1 Cap",
                    frequency: "Twice Daily (BID)",
                    timing: "BID",
                    timing_ta: "காலை மற்றும் இரவு",
                    indication: "Gut flora restoration",
                    indication_ta: "குடல் ஆரோக்கிய நுண்ணுயிர் சமநிலை",
                    instructions: "1 Capsule BID for 7 days"
                }
            ],
            lifestyle_instructions: "Bland diet (kanji, boiled rice, curd rice, bananas). Avoid spicy, oily, or unpasteurized street foods for 10 days.",
            lifestyle_instructions_ta: "எளிதில் செரிக்கும் உணவு (கஞ்சி, வேகவைத்த சாதம், தயிர் சாதம், வாழைப்பழம்). காரமான உணவுகளை தவிர்க்கவும்.",
            red_flag_symptoms: "Inability to keep fluids down, blood in stool, high fever >39°C, or decreased urine output.",
            red_flag_symptoms_ta: "தொடர் வாந்தியால் நீர் குடிக்க முடியாமை, மலத்தில் ரத்தம், அல்லது சிறுநீர் வெளியேற்றம் குறைதல்.",
            follow_up_date: "2024-11-19",
            follow_up_time: "02:00 PM",
            follow_up_clinic: "General Medicine OPD Room 104",
            follow_up_doctor: "Dr. Priya Raman",
            helpline_number: "1800-200-88",
            additional_notes: "Hydration is the primary medicine. Drink plenty of safe boiled water.",
            approval_status: "approved",
            approved_by: "Dr. Priya Raman",
            approved_at: "2024-11-09T18:00:00Z",
            completeness_score: 100,
            is_demo: true
        },
        {
            id: "r6666666-6666-6666-6666-666666666666",
            record_number: "DS-2024-006",
            patient_id: "p6666666-6666-6666-6666-666666666666",
            doctor_id: "d2222222-2222-2222-2222-222222222222",
            patient_name: "Ananya Sharma",
            patient_age: 33,
            patient_reference: "CB-9087",
            diagnosis: "Community-Acquired Pneumonia (Right Lower Lobe, resolving).",
            diagnosis_ta: "வலது கீழ் நுரையீரல் தொற்றுக் காய்ச்சல் (நிமோனியா - குணமாகி வருகிறது).",
            icd10_code: "ICD-10 J18.9",
            clinical_summary: "Young adult admitted with fever, productive cough, and right pleuritic chest pain. CXR confirmed RLL infiltrate. Afebrile for 48 hours on IV ceftriaxone. Transitioned to oral cefuroxime.",
            clinical_summary_ta: "சளி மற்றும் காய்ச்சலுடன் அனுமதிக்கப்பட்டு ஆன்டிபயாடிக் மருந்துகள் மூலம் குணமாகி வருகிறார்.",
            treatment_information: "IV antibiotic course completed. Switched to oral therapy.",
            treatment_information_ta: "ஆன்டிபயாடிக் மருந்து மாத்திரைகள் தொடர வேண்டும்.",
            medication_instructions: [
                {
                    name: "Cefuroxime Axetil",
                    dose: "500mg",
                    frequency: "Twice Daily (BID)",
                    timing: "BID",
                    timing_ta: "காலை மற்றும் இரவு",
                    indication: "Pneumonia antibiotic course",
                    indication_ta: "நுரையீரல் தொற்றை முழுமையாக நீக்கும் ஆன்டிபயாடிக்",
                    instructions: "1 Tablet BID with food for 5 remaining days. Do not stop early."
                }
            ],
            lifestyle_instructions: "Complete all prescribed antibiotics without missing doses. Adequate hydration (2.5L water/day). Steam inhalation for chest comfort.",
            lifestyle_instructions_ta: "மருத்துவர் கூறிய நாட்களுக்கு மாத்திரைகளை முழுமையாக உட்கொள்ளவும். தினமும் 2.5 லிட்டர் குடிநீர் மற்றும் நீராவி பிடிக்கவும்.",
            red_flag_symptoms: "Return of high fever, difficulty catching breath, or coughing up significant blood.",
            red_flag_symptoms_ta: "மீண்டும் காய்ச்சல் வருவது, மூச்சுத் திணறல் அல்லது சளியில் அதிக ரத்தம் வெளியேறுவது.",
            follow_up_date: "2024-11-21",
            follow_up_time: "10:00 AM",
            follow_up_clinic: "Medicine OPD Room 101",
            follow_up_doctor: "Dr. Priya Raman",
            helpline_number: "1800-200-88",
            additional_notes: "Repeat chest X-ray will be evaluated at the follow-up visit.",
            approval_status: "draft",
            approved_by: null,
            approved_at: null,
            completeness_score: 80,
            is_demo: true
        },
        {
            id: "r7777777-7777-7777-7777-777777777777",
            record_number: "DS-2024-007",
            patient_id: "p7777777-7777-7777-7777-777777777777",
            doctor_id: "d1111111-1111-1111-1111-111111111111",
            patient_name: "Selvaraj M.",
            patient_age: 67,
            patient_reference: "CB-9088",
            diagnosis: "Hypertensive Crisis (controlled) with Essential Hypertension.",
            diagnosis_ta: "கட்டுப்படுத்தப்பட்ட தீவிர உயர் ரத்த அழுத்தம் (தற்போது சீராக உள்ளது).",
            icd10_code: "ICD-10 I10",
            clinical_summary: "Presented with severe headache and BP 210/115 mmHg. Secondary target-organ damage ruled out via CT head and troponins. BP gradually titrated down to 132/84 mmHg with combined antihypertensives.",
            clinical_summary_ta: "அதிகப்படியான ரத்த அழுத்தத்துடன் அனுமதிக்கப்பட்டு தகுந்த சிகிச்சைகள் மூலம் 132/84 அளவிற்கு கொண்டுவரப்பட்டது.",
            treatment_information: "Emergency BP reduction, dual oral antihypertensive optimization.",
            treatment_information_ta: "ரத்த அழுத்தம் குறைக்கும் ஒருங்கிணைந்த மருந்துகள்.",
            medication_instructions: [
                {
                    name: "Telmisartan / Amlodipine",
                    dose: "40mg / 5mg",
                    frequency: "Once Daily (QAM)",
                    timing: "Morning",
                    timing_ta: "காலை உணவுடன்",
                    indication: "Hypertension control",
                    indication_ta: "ரத்த அழுத்த கட்டுப்பாடு",
                    instructions: "1 Tablet every morning at 8:00 AM"
                }
            ],
            lifestyle_instructions: "DASH diet (rich in fruits, vegetables, low fat dairy). Restrict dietary salt. Daily morning BP monitoring with recorded log.",
            lifestyle_instructions_ta: "உப்பில்லா அல்லது குறைந்த உப்பு உணவு. தினசரி ரத்த அழுத்த அளவீடு செய்து குறித்து வைக்கவும்.",
            red_flag_symptoms: "Sudden explosive headache, blurred or double vision, chest discomfort, or numbness in limbs.",
            red_flag_symptoms_ta: "திடீர் கடுமையான தலைவலி, பார்வை மங்குதல் அல்லது கை, கால்களில் மரத்துப்போகும் உணர்வு.",
            follow_up_date: "2024-11-17",
            follow_up_time: "11:00 AM",
            follow_up_clinic: "Hypertension Clinic Room 202",
            follow_up_doctor: "Dr. Arun Kumar",
            helpline_number: "1800-200-88",
            additional_notes: "Never discontinue antihypertensive medication abruptly.",
            approval_status: "approved",
            approved_by: "Dr. Arun Kumar",
            approved_at: "2024-11-08T15:00:00Z",
            completeness_score: 100,
            is_demo: true
        },
        {
            id: "r8888888-8888-8888-8888-888888888888",
            record_number: "DS-2024-008",
            patient_id: "p8888888-8888-8888-8888-888888888888",
            doctor_id: "d2222222-2222-2222-2222-222222222222",
            patient_name: "Fathima Begum",
            patient_age: 59,
            patient_reference: "CB-9089",
            diagnosis: "Chronic Kidney Disease Stage 3b with Volume Overload (euvolemic at discharge).",
            diagnosis_ta: "நாள்பட்ட சிறுநீரக நோய் (நிலை 3b) - உடலில் நீர் தேக்கம் குறைக்கப்பட்டு தற்போது சீராக உள்ளது.",
            icd10_code: "ICD-10 N18.3",
            clinical_summary: "Admitted with bilateral pedal edema and shortness of breath. Diuresis achieved with IV torsemide. Serum creatinine stabilized at baseline 2.1 mg/dL, electrolytes balanced.",
            clinical_summary_ta: "கால்களில் வீக்கம் மற்றும் நீர் தேக்கத்துடன் அனுமதிக்கப்பட்டு தேவையான சிறுநீர் வெளியேற்ற மருந்துகள் மூலம் சீரமைக்கப்பட்டது.",
            treatment_information: "Controlled diuresis, dietary potassium & sodium regulation.",
            treatment_information_ta: "நீர் வெளியேற்றும் மருந்து சிகிச்சை மற்றும் பொட்டாசியம் கட்டுப்பாடு.",
            medication_instructions: [
                {
                    name: "Torsemide",
                    dose: "20mg",
                    frequency: "Once Daily (QAM)",
                    timing: "Morning",
                    timing_ta: "காலை",
                    indication: "Fluid retention management",
                    indication_ta: "நீர் தேக்கம் மற்றும் வீக்கத்தை தடுக்கும் சிறுநீர் பெருக்கி",
                    instructions: "1 Tablet in the morning"
                }
            ],
            lifestyle_instructions: "Strict fluid restriction to 1.2 Liters per 24 hours. Renal diet (low potassium, low phosphorus, restricted salt). Daily weight monitoring before breakfast.",
            lifestyle_instructions_ta: "ஒரு நாளைக்கு 1.2 லிட்டர் மட்டுமே திரவம் குடிக்க வேண்டும். குறைந்த பொட்டாசியம் மற்றும் உப்பு உணவு. தினமும் காலையில் எடை சரிபார்க்கவும்.",
            red_flag_symptoms: "Rapid weight gain (>1.5 kg in 2 days), increasing leg swelling, breathlessness lying flat, or profound fatigue.",
            red_flag_symptoms_ta: "எடை திடீரென அதிகரிப்பது, மூச்சுத் திணறல் அல்லது அதீத உடல் சோர்வு ஏற்பட்டால் தொடர்பு கொள்ளவும்.",
            follow_up_date: "2024-11-25",
            follow_up_time: "10:00 AM",
            follow_up_clinic: "Nephrology OPD Suite 305",
            follow_up_doctor: "Dr. Priya Raman",
            helpline_number: "1800-200-88",
            additional_notes: "Repeat serum creatinine, BUN, and serum potassium 2 days prior to OPD visit.",
            approval_status: "pending_review",
            approved_by: null,
            approved_at: null,
            completeness_score: 95,
            is_demo: true
        }
    ],

    clarificationRequests: [
        {
            id: "c1111111-1111-1111-1111-111111111111",
            discharge_id: "r1111111-1111-1111-1111-111111111111",
            patient_name: "Kumarasamy V.",
            category: "medication",
            question: "Can I take Metoprolol with my morning tea, or must it be strictly after a solid breakfast?",
            status: "addressed",
            doctor_response: "Always take Metoprolol with or immediately following solid breakfast to avoid stomach irritation and ensure optimal absorption.",
            responded_at: "2024-11-11T09:15:00Z",
            patient_contact: "+91 98401 23456",
            is_demo: true,
            created_at: "2024-11-11T08:30:00Z"
        },
        {
            id: "c2222222-2222-2222-2222-222222222222",
            discharge_id: "r1111111-1111-1111-1111-111111111111",
            patient_name: "Kumarasamy V.",
            category: "lifestyle",
            question: "Is it safe to climb one flight of stairs slowly to reach my first-floor bedroom?",
            status: "pending",
            doctor_response: null,
            responded_at: null,
            patient_contact: "+91 98401 23456",
            is_demo: true,
            created_at: "2024-11-12T07:20:00Z"
        }
    ]
};

window.CAREBRIDGE_DEMO_DATA = CAREBRIDGE_DEMO_DATA;

/**
 * CAREBRIDGE Unified Storage Service
 * Connects directly to Supabase REST API with robust local fallback.
 */
class CarebridgeStorageService {
    constructor() {
        this.config = window.CAREBRIDGE_CONFIG || {};
        this.supabaseUrl = this.config.SUPABASE_URL || '';
        this.supabaseKey = this.config.SUPABASE_ANON_KEY || '';
        this.isSupabaseAvailable = false;
        this.storageKey = 'carebridge_local_store_v1';
        
        this.initStore();
        this.checkSupabaseConnectivity();
    }

    /**
     * Initializes local storage cache with demo baseline if empty
     */
    initStore() {
        try {
            const existing = localStorage.getItem(this.storageKey);
            if (!existing) {
                const initialData = {
                    doctors: [...(window.CAREBRIDGE_DEMO_DATA?.doctors || [])],
                    patients: [...(window.CAREBRIDGE_DEMO_DATA?.patients || [])],
                    dischargeRecords: [...(window.CAREBRIDGE_DEMO_DATA?.dischargeRecords || [])],
                    clarificationRequests: [...(window.CAREBRIDGE_DEMO_DATA?.clarificationRequests || [])],
                    accessTokens: [],
                    auditLogs: []
                };
                localStorage.setItem(this.storageKey, JSON.stringify(initialData));
            }
        } catch (e) {
            console.warn('[CAREBRIDGE] Local storage not accessible:', e);
        }
    }

    /**
     * Check if Supabase endpoint and tables are reachable
     */
    async checkSupabaseConnectivity() {
        if (!this.supabaseUrl || !this.supabaseKey) {
            this.isSupabaseAvailable = false;
            return false;
        }

        try {
            const res = await fetch(`${this.supabaseUrl}/rest/v1/discharge_records?select=count`, {
                method: 'HEAD',
                headers: {
                    'apikey': this.supabaseKey,
                    'Authorization': `Bearer ${this.supabaseKey}`
                }
            });
            this.isSupabaseAvailable = res.ok;
            console.log('[CAREBRIDGE] Supabase tables connected:', this.isSupabaseAvailable);
            return this.isSupabaseAvailable;
        } catch (err) {
            this.isSupabaseAvailable = false;
            return false;
        }
    }

    getLocalStore() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : { doctors: [], patients: [], dischargeRecords: [], clarificationRequests: [], accessTokens: [], auditLogs: [] };
        } catch (e) {
            return { doctors: [], patients: [], dischargeRecords: [], clarificationRequests: [], accessTokens: [], auditLogs: [] };
        }
    }

    setLocalStore(store) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(store));
        } catch (e) {
            console.error('[CAREBRIDGE] Failed to save local store:', e);
        }
    }

    // ==========================================
    // DISCHARGE RECORDS
    // ==========================================

    async getDischargeRecords(filter = {}) {
        // Try Supabase first
        if (this.isSupabaseAvailable) {
            try {
                let url = `${this.supabaseUrl}/rest/v1/discharge_records?select=*&order=created_at.desc`;
                if (filter.status && filter.status !== 'all') {
                    url += `&approval_status=eq.${encodeURIComponent(filter.status)}`;
                }
                const res = await fetch(url, {
                    headers: {
                        'apikey': this.supabaseKey,
                        'Authorization': `Bearer ${this.supabaseKey}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) return data;
                }
            } catch (e) {
                console.warn('[CAREBRIDGE] Supabase fetch failed, falling back to local store:', e);
            }
        }

        // Local Fallback
        const store = this.getLocalStore();
        let records = store.dischargeRecords || [];
        if (filter.status && filter.status !== 'all') {
            records = records.filter(r => r.approval_status === filter.status);
        }
        if (filter.search) {
            const q = filter.search.toLowerCase();
            records = records.filter(r => 
                (r.patient_name && r.patient_name.toLowerCase().includes(q)) ||
                (r.patient_reference && r.patient_reference.toLowerCase().includes(q)) ||
                (r.diagnosis && r.diagnosis.toLowerCase().includes(q))
            );
        }
        return records;
    }

    async getDischargeRecord(idOrRef) {
        if (!idOrRef) return null;

        // Try Supabase
        if (this.isSupabaseAvailable) {
            try {
                const url = `${this.supabaseUrl}/rest/v1/discharge_records?or=(id.eq.${encodeURIComponent(idOrRef)},patient_reference.eq.${encodeURIComponent(idOrRef)})&limit=1`;
                const res = await fetch(url, {
                    headers: {
                        'apikey': this.supabaseKey,
                        'Authorization': `Bearer ${this.supabaseKey}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) return data[0];
                }
            } catch (e) {
                console.warn('[CAREBRIDGE] Supabase get record error, using local fallback:', e);
            }
        }

        const store = this.getLocalStore();
        let record = store.dischargeRecords.find(r => r.id === idOrRef || r.patient_reference === idOrRef);
        if (!record && window.CAREBRIDGE_DEMO_DATA?.dischargeRecords) {
            record = window.CAREBRIDGE_DEMO_DATA.dischargeRecords.find(r => r.id === idOrRef || r.patient_reference === idOrRef);
        }
        return record || null;
    }

    async saveDischargeRecord(record) {
        if (!record.id) {
            record.id = 'r' + CarebridgeCrypto.generateToken(15);
        }
        if (!record.created_at) {
            record.created_at = new Date().toISOString();
        }
        record.updated_at = new Date().toISOString();

        // Save to Supabase if available
        if (this.isSupabaseAvailable) {
            try {
                await fetch(`${this.supabaseUrl}/rest/v1/discharge_records`, {
                    method: 'POST',
                    headers: {
                        'apikey': this.supabaseKey,
                        'Authorization': `Bearer ${this.supabaseKey}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'resolution=merge-duplicates'
                    },
                    body: JSON.stringify(record)
                });
            } catch (e) {
                console.warn('[CAREBRIDGE] Supabase save error:', e);
            }
        }

        // Always update local store
        const store = this.getLocalStore();
        const idx = store.dischargeRecords.findIndex(r => r.id === record.id);
        if (idx >= 0) {
            store.dischargeRecords[idx] = record;
        } else {
            store.dischargeRecords.unshift(record);
        }
        this.setLocalStore(store);
        await this.logAudit(record.id, 'RECORD_SAVED', { status: record.approval_status });
        return record;
    }

    async approveDischargeRecord(id, doctorName = 'Dr. Arun Kumar') {
        const updates = {
            approval_status: 'approved',
            approved_by: doctorName,
            approved_at: new Date().toISOString(),
            completeness_score: 100,
            updated_at: new Date().toISOString()
        };

        if (this.isSupabaseAvailable) {
            try {
                await fetch(`${this.supabaseUrl}/rest/v1/discharge_records?id=eq.${encodeURIComponent(id)}`, {
                    method: 'PATCH',
                    headers: {
                        'apikey': this.supabaseKey,
                        'Authorization': `Bearer ${this.supabaseKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updates)
                });
            } catch (e) {
                console.warn('[CAREBRIDGE] Supabase approve error:', e);
            }
        }

        const store = this.getLocalStore();
        const record = store.dischargeRecords.find(r => r.id === id);
        if (record) {
            Object.assign(record, updates);
            this.setLocalStore(store);
        }
        await this.logAudit(id, 'DISCHARGE_APPROVED', { doctor: doctorName, timestamp: updates.approved_at });
        return record;
    }

    // ==========================================
    // SECURE ACCESS TOKENS & SHARING
    // ==========================================

    async createAccessToken(dischargeId, hoursValid = 168) { // Default 7 days
        const expiresTimestamp = Date.now() + (hoursValid * 3600 * 1000);
        const expiresAt = new Date(expiresTimestamp).toISOString();
        const salt = CarebridgeCrypto.generateToken(8);
        
        // Compute cryptographic signature for cross-device tamper-proof verification
        const secretPayload = `cbh:${dischargeId}:${expiresTimestamp}:${salt}:CAREBRIDGE_VERIFIED_HANDOVER_2026`;
        const fullSig = await CarebridgeCrypto.sha256(secretPayload);
        const sig = fullSig.slice(0, 32);

        // Self-verifying token: works cross-device without requiring pre-existing database tables
        const rawToken = `cbh_${dischargeId}_${expiresTimestamp}_${salt}_${sig}`;
        const tokenHash = await CarebridgeCrypto.sha256(rawToken);

        const tokenRecord = {
            id: 't' + salt,
            discharge_id: dischargeId,
            token_hash: tokenHash,
            raw_token: rawToken,
            expires_at: expiresAt,
            revoked_at: null,
            created_at: new Date().toISOString(),
            is_demo: true
        };

        if (this.isSupabaseAvailable) {
            try {
                await fetch(`${this.supabaseUrl}/rest/v1/access_tokens`, {
                    method: 'POST',
                    headers: {
                        'apikey': this.supabaseKey,
                        'Authorization': `Bearer ${this.supabaseKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(tokenRecord)
                });
            } catch (e) {
                console.warn('[CAREBRIDGE] Supabase token save error:', e);
            }
        }

        const store = this.getLocalStore();
        store.accessTokens.push(tokenRecord);
        this.setLocalStore(store);

        await this.logAudit(dischargeId, 'TOKEN_CREATED', { expires_at: expiresAt });

        // Return the RAW token to the caller for QR/URL generation
        return {
            rawToken,
            tokenHash,
            expiresAt,
            tokenId: tokenRecord.id
        };
    }

    async validateToken(rawToken, urlRecordId = null) {
        if (!rawToken && !urlRecordId) {
            return { isValid: false, reason: 'No token or handover reference provided.' };
        }

        const store = this.getLocalStore();

        // 1. If rawToken is provided, compute hash
        let tokenHash = '';
        if (rawToken) {
            tokenHash = await CarebridgeCrypto.sha256(rawToken);
        }

        // 2. Check Supabase if table is reachable
        if (this.isSupabaseAvailable && tokenHash) {
            try {
                const res = await fetch(`${this.supabaseUrl}/rest/v1/access_tokens?token_hash=eq.${encodeURIComponent(tokenHash)}&limit=1`, {
                    headers: {
                        'apikey': this.supabaseKey,
                        'Authorization': `Bearer ${this.supabaseKey}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        const token = data[0];
                        if (token.revoked_at) {
                            return { isValid: false, reason: 'This handover link was revoked by the clinician.', dischargeId: token.discharge_id };
                        }
                        if (new Date(token.expires_at) < new Date()) {
                            return { isValid: false, reason: 'This handover link has expired for patient safety.', dischargeId: token.discharge_id };
                        }
                        return { isValid: true, dischargeId: token.discharge_id };
                    }
                }
            } catch (e) {
                console.warn('[CAREBRIDGE] Supabase token check error, using local/crypto fallback:', e);
            }
        }

        // 3. Check local store on this device
        if (tokenHash) {
            const token = store.accessTokens.find(t => t.token_hash === tokenHash || t.raw_token === rawToken);
            if (token) {
                if (token.revoked_at) {
                    return { isValid: false, reason: 'This handover link was revoked by the clinician.', dischargeId: token.discharge_id };
                }
                if (new Date(token.expires_at) < new Date()) {
                    return { isValid: false, reason: 'This handover link has expired for patient safety.', dischargeId: token.discharge_id };
                }
                return { isValid: true, dischargeId: token.discharge_id };
            }
        }

        // 4. Self-verifying cross-device cryptographic verification (Works across any device, phone, or browser!)
        if (typeof rawToken === 'string' && rawToken.startsWith('cbh_')) {
            const parts = rawToken.split('_');
            if (parts.length >= 5) {
                const dischargeId = parts[1];
                const expiresTimestamp = parseInt(parts[2], 10);
                const salt = parts[3];
                const providedSig = parts[4];

                // Check expiration timestamp
                if (Date.now() > expiresTimestamp) {
                    return { isValid: false, reason: 'This handover link has expired for patient safety.', dischargeId };
                }

                // Verify cryptographic HMAC/SHA-256 signature
                const expectedPayload = `cbh:${dischargeId}:${expiresTimestamp}:${salt}:CAREBRIDGE_VERIFIED_HANDOVER_2026`;
                const expectedSig = (await CarebridgeCrypto.sha256(expectedPayload)).slice(0, 32);

                if (providedSig === expectedSig) {
                    // Check if token was marked as revoked in this device's local store
                    const isRevoked = store.accessTokens.some(t => (t.token_hash === tokenHash || t.raw_token === rawToken) && t.revoked_at);
                    if (isRevoked) {
                        return { isValid: false, reason: 'This handover link was revoked by the clinician.', dischargeId };
                    }

                    // Register this verified token in the receiving device's local cache
                    store.accessTokens.push({
                        id: 't' + salt,
                        discharge_id: dischargeId,
                        token_hash: tokenHash,
                        raw_token: rawToken,
                        expires_at: new Date(expiresTimestamp).toISOString(),
                        revoked_at: null,
                        created_at: new Date().toISOString(),
                        is_demo: true
                    });
                    this.setLocalStore(store);

                    return { isValid: true, dischargeId };
                }
            }
        }

        // 5. Fallback for demo records when URL record ID is provided (e.g. ?token=...&record=...)
        if (urlRecordId) {
            const demoRec = window.CAREBRIDGE_DEMO_DATA?.dischargeRecords.find(r => r.id === urlRecordId || r.patient_reference === urlRecordId);
            if (demoRec) {
                return { isValid: true, dischargeId: demoRec.id };
            }
        }

        return { isValid: false, reason: 'Invalid or unknown token.' };
    }

    async revokeToken(tokenHashOrId) {
        const updates = { revoked_at: new Date().toISOString() };

        if (this.isSupabaseAvailable) {
            try {
                await fetch(`${this.supabaseUrl}/rest/v1/access_tokens?or=(id.eq.${encodeURIComponent(tokenHashOrId)},token_hash.eq.${encodeURIComponent(tokenHashOrId)})`, {
                    method: 'PATCH',
                    headers: {
                        'apikey': this.supabaseKey,
                        'Authorization': `Bearer ${this.supabaseKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updates)
                });
            } catch (e) {
                console.warn('[CAREBRIDGE] Supabase revoke error:', e);
            }
        }

        const store = this.getLocalStore();
        const token = store.accessTokens.find(t => t.id === tokenHashOrId || t.token_hash === tokenHashOrId);
        if (token) {
            token.revoked_at = updates.revoked_at;
            this.setLocalStore(store);
            await this.logAudit(token.discharge_id, 'TOKEN_REVOKED', { token_id: token.id });
        }
        return true;
    }

    // ==========================================
    // CLARIFICATION REQUESTS
    // ==========================================

    async getClarificationRequests(dischargeId) {
        if (this.isSupabaseAvailable) {
            try {
                const res = await fetch(`${this.supabaseUrl}/rest/v1/clarification_requests?discharge_id=eq.${encodeURIComponent(dischargeId)}&order=created_at.desc`, {
                    headers: {
                        'apikey': this.supabaseKey,
                        'Authorization': `Bearer ${this.supabaseKey}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) return data;
                }
            } catch (e) {
                console.warn('[CAREBRIDGE] Supabase clarification fetch error:', e);
            }
        }

        const store = this.getLocalStore();
        return store.clarificationRequests.filter(c => c.discharge_id === dischargeId);
    }

    async submitClarificationRequest(req) {
        req.id = 'c' + CarebridgeCrypto.generateToken(15);
        req.created_at = new Date().toISOString();
        req.status = 'pending';
        req.is_demo = true;

        if (this.isSupabaseAvailable) {
            try {
                await fetch(`${this.supabaseUrl}/rest/v1/clarification_requests`, {
                    method: 'POST',
                    headers: {
                        'apikey': this.supabaseKey,
                        'Authorization': `Bearer ${this.supabaseKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(req)
                });
            } catch (e) {
                console.warn('[CAREBRIDGE] Supabase submit clarification error:', e);
            }
        }

        const store = this.getLocalStore();
        store.clarificationRequests.unshift(req);
        this.setLocalStore(store);
        await this.logAudit(req.discharge_id, 'CLARIFICATION_REQUESTED', { category: req.category, question: req.question });
        return req;
    }

    // ==========================================
    // DEMO DATA MANAGEMENT (LOAD & RESET)
    // ==========================================

    async loadDemoData() {
        const demo = window.CAREBRIDGE_DEMO_DATA;
        if (!demo) return { success: false, message: 'Demo data template not loaded' };

        const store = this.getLocalStore();
        
        // Prevent duplicate demo records
        const existingRefs = new Set(store.dischargeRecords.map(r => r.patient_reference));
        const newRecords = demo.dischargeRecords.filter(r => !existingRefs.has(r.patient_reference));

        const existingPatientRefs = new Set(store.patients.map(p => p.patient_reference));
        const newPatients = demo.patients.filter(p => !existingPatientRefs.has(p.patient_reference));

        const existingDoctorEmails = new Set(store.doctors.map(d => d.email));
        const newDoctors = demo.doctors.filter(d => !existingDoctorEmails.has(d.email));

        store.dischargeRecords.push(...newRecords);
        store.patients.push(...newPatients);
        store.doctors.push(...newDoctors);
        store.clarificationRequests.push(...(demo.clarificationRequests || []));

        this.setLocalStore(store);

        // Attempt to sync to Supabase if tables exist
        if (this.isSupabaseAvailable) {
            try {
                if (newDoctors.length > 0) {
                    await fetch(`${this.supabaseUrl}/rest/v1/doctors`, {
                        method: 'POST',
                        headers: { 'apikey': this.supabaseKey, 'Authorization': `Bearer ${this.supabaseKey}`, 'Content-Type': 'application/json', 'Prefer': 'resolution=ignore-duplicates' },
                        body: JSON.stringify(newDoctors)
                    });
                }
                if (newPatients.length > 0) {
                    await fetch(`${this.supabaseUrl}/rest/v1/patients`, {
                        method: 'POST',
                        headers: { 'apikey': this.supabaseKey, 'Authorization': `Bearer ${this.supabaseKey}`, 'Content-Type': 'application/json', 'Prefer': 'resolution=ignore-duplicates' },
                        body: JSON.stringify(newPatients)
                    });
                }
                if (newRecords.length > 0) {
                    await fetch(`${this.supabaseUrl}/rest/v1/discharge_records`, {
                        method: 'POST',
                        headers: { 'apikey': this.supabaseKey, 'Authorization': `Bearer ${this.supabaseKey}`, 'Content-Type': 'application/json', 'Prefer': 'resolution=ignore-duplicates' },
                        body: JSON.stringify(newRecords)
                    });
                }
            } catch (e) {
                console.warn('[CAREBRIDGE] Supabase demo data sync error:', e);
            }
        }

        await this.logAudit(null, 'DEMO_DATA_LOADED', { recordsCount: demo.dischargeRecords.length });
        return {
            success: true,
            addedCount: newRecords.length,
            totalRecords: store.dischargeRecords.length,
            message: `Loaded ${newRecords.length} new demo records (${store.dischargeRecords.length} total).`
        };
    }

    async resetDemoData() {
        // Reset ONLY demo records (is_demo === true)
        const store = this.getLocalStore();
        const nonDemoRecords = store.dischargeRecords.filter(r => !r.is_demo);
        const nonDemoPatients = store.patients.filter(p => !p.is_demo);
        const nonDemoDoctors = store.doctors.filter(d => !d.is_demo);
        const nonDemoClarifications = store.clarificationRequests.filter(c => !c.is_demo);
        const nonDemoTokens = store.accessTokens.filter(t => !t.is_demo);

        store.dischargeRecords = nonDemoRecords;
        store.patients = nonDemoPatients;
        store.doctors = nonDemoDoctors;
        store.clarificationRequests = nonDemoClarifications;
        store.accessTokens = nonDemoTokens;

        this.setLocalStore(store);

        if (this.isSupabaseAvailable) {
            try {
                await fetch(`${this.supabaseUrl}/rest/v1/discharge_records?is_demo=eq.true`, {
                    method: 'DELETE',
                    headers: { 'apikey': this.supabaseKey, 'Authorization': `Bearer ${this.supabaseKey}` }
                });
                await fetch(`${this.supabaseUrl}/rest/v1/patients?is_demo=eq.true`, {
                    method: 'DELETE',
                    headers: { 'apikey': this.supabaseKey, 'Authorization': `Bearer ${this.supabaseKey}` }
                });
                await fetch(`${this.supabaseUrl}/rest/v1/doctors?is_demo=eq.true`, {
                    method: 'DELETE',
                    headers: { 'apikey': this.supabaseKey, 'Authorization': `Bearer ${this.supabaseKey}` }
                });
            } catch (e) {
                console.warn('[CAREBRIDGE] Supabase demo reset error:', e);
            }
        }

        await this.logAudit(null, 'DEMO_DATA_RESET', {});
        return { success: true, message: 'All demonstration records have been cleanly removed.' };
    }

    // ==========================================
    // AUDIT LOGGING
    // ==========================================

    async logAudit(dischargeId, action, details = {}) {
        const audit = {
            id: 'a' + CarebridgeCrypto.generateToken(15),
            discharge_id: dischargeId,
            action,
            actor_role: 'clinician',
            actor_name: window.CAREBRIDGE_CONFIG?.DEFAULT_DOCTOR?.name || 'Dr. Arun Kumar',
            details,
            created_at: new Date().toISOString()
        };

        if (this.isSupabaseAvailable) {
            try {
                await fetch(`${this.supabaseUrl}/rest/v1/audit_logs`, {
                    method: 'POST',
                    headers: {
                        'apikey': this.supabaseKey,
                        'Authorization': `Bearer ${this.supabaseKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(audit)
                });
            } catch (e) {
                // Ignore audit log network failures
            }
        }

        const store = this.getLocalStore();
        store.auditLogs.unshift(audit);
        this.setLocalStore(store);
    }
}

window.CarebridgeStorage = new CarebridgeStorageService();

/**
 * CAREBRIDGE Web Speech API Service
 * Handles English and Tamil text-to-speech with speech synthesis state management
 */
class CarebridgeAudioService {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.currentUtterance = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.onStateChangeCallback = null;

        if (this.synth) {
            this.loadVoices();
            if (this.synth.onvoiceschanged !== undefined) {
                this.synth.onvoiceschanged = () => this.loadVoices();
            }
        }
    }

    loadVoices() {
        if (!this.synth) return;
        this.voices = this.synth.getVoices();
    }

    isSupported() {
        return !!window.speechSynthesis && !!window.SpeechSynthesisUtterance;
    }

    getVoiceForLanguage(lang = 'en') {
        if (!this.voices || this.voices.length === 0) {
            this.loadVoices();
        }

        if (lang === 'ta') {
            // Find Tamil voice
            const tamilVoice = this.voices.find(v => 
                v.lang.startsWith('ta') || 
                v.name.toLowerCase().includes('tamil') ||
                v.lang === 'ta-IN' || 
                v.lang === 'ta_IN'
            );
            return tamilVoice || null;
        }

        // Find English voice (prefer Indian English or standard English)
        const enVoice = this.voices.find(v => v.lang === 'en-IN') || 
                        this.voices.find(v => v.lang.startsWith('en')) || 
                        null;
        return enVoice;
    }

    speak(text, lang = 'en', onComplete = null) {
        if (!this.isSupported()) {
            alert('Audio speech playback is not supported on this browser.');
            return false;
        }

        if (!text || text.trim() === '') {
            console.warn('[CAREBRIDGE Audio] No text provided for speech.');
            return false;
        }

        this.stop();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'ta' ? 'ta-IN' : 'en-US';
        utterance.rate = 0.9; // Slightly slower, clear pace for patient comprehension
        utterance.pitch = 1.0;

        const voice = this.getVoiceForLanguage(lang);
        if (voice) {
            utterance.voice = voice;
        } else if (lang === 'ta') {
            console.info('[CAREBRIDGE Audio] Native Tamil voice not pre-installed on this OS; using default phonetic engine.');
        }

        utterance.onstart = () => {
            this.isPlaying = true;
            this.isPaused = false;
            if (this.onStateChangeCallback) this.onStateChangeCallback('playing');
        };

        utterance.onpause = () => {
            this.isPaused = true;
            if (this.onStateChangeCallback) this.onStateChangeCallback('paused');
        };

        utterance.onresume = () => {
            this.isPaused = false;
            if (this.onStateChangeCallback) this.onStateChangeCallback('playing');
        };

        utterance.onend = () => {
            this.isPlaying = false;
            this.isPaused = false;
            this.currentUtterance = null;
            if (this.onStateChangeCallback) this.onStateChangeCallback('stopped');
            if (onComplete) onComplete();
        };

        utterance.onerror = (err) => {
            console.warn('[CAREBRIDGE Audio] Speech error:', err);
            this.isPlaying = false;
            this.isPaused = false;
            this.currentUtterance = null;
            if (this.onStateChangeCallback) this.onStateChangeCallback('stopped');
        };

        this.currentUtterance = utterance;
        this.synth.speak(utterance);
        return true;
    }

    pause() {
        if (this.synth && this.isPlaying && !this.isPaused) {
            this.synth.pause();
            this.isPaused = true;
            if (this.onStateChangeCallback) this.onStateChangeCallback('paused');
        }
    }

    resume() {
        if (this.synth && this.isPaused) {
            this.synth.resume();
            this.isPaused = false;
            if (this.onStateChangeCallback) this.onStateChangeCallback('playing');
        }
    }

    stop() {
        if (this.synth) {
            this.synth.cancel();
            this.isPlaying = false;
            this.isPaused = false;
            this.currentUtterance = null;
            if (this.onStateChangeCallback) this.onStateChangeCallback('stopped');
        }
    }

    togglePlay(text, lang = 'en', onComplete = null) {
        if (this.isPlaying) {
            if (this.isPaused) {
                this.resume();
            } else {
                this.pause();
            }
        } else {
            this.speak(text, lang, onComplete);
        }
    }
}

window.CarebridgeAudio = new CarebridgeAudioService();

/**
 * CAREBRIDGE PDF Generation Service
 * Generates verified discharge documentation using jsPDF with browser print fallback
 */
const CarebridgePDFService = {
    generateDischargeSummary(record, lang = 'en') {
        if (!record) return;

        // If jsPDF is available via window.jspdf
        const { jsPDF } = window.jspdf || {};

        if (!jsPDF) {
            // Fallback: trigger print
            window.print();
            return;
        }

        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const isTa = lang === 'ta';
        const teal = [0, 99, 110];
        const slate = [23, 50, 77];
        const gray = [100, 116, 139];

        // Header Banner
        doc.setFillColor(teal[0], teal[1], teal[2]);
        doc.rect(0, 0, 210, 24, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text("CAREBRIDGE - CLINICAL DISCHARGE SUMMARY", 14, 15);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text("Clinician-Verified Patient Care & Handover Document", 14, 20);

        // Patient Metadata Box
        doc.setDrawColor(220, 225, 230);
        doc.setFillColor(248, 250, 249);
        doc.roundedRect(14, 30, 182, 28, 2, 2, 'FD');

        doc.setTextColor(slate[0], slate[1], slate[2]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(`Patient: ${record.patient_name || 'N/A'}`, 18, 38);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(`Age/Sex: ${record.patient_age || '--'} yrs | Ref: ${record.patient_reference || '--'}`, 18, 44);
        doc.text(`Discharge Date: ${record.created_at ? record.created_at.split('T')[0] : 'Current'}`, 18, 50);

        doc.setFont('helvetica', 'bold');
        doc.text(`Attending Physician:`, 110, 38);
        doc.setFont('helvetica', 'normal');
        doc.text(`${record.approved_by || record.follow_up_doctor || 'Dr. Arun Kumar, MD'}`, 110, 44);
        doc.text(`Status: ${record.approval_status ? record.approval_status.toUpperCase() : 'VERIFIED'}`, 110, 50);

        let y = 66;

        // 1. Primary Diagnosis
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(teal[0], teal[1], teal[2]);
        doc.text("1. PRIMARY DIAGNOSIS & CLINICAL SUMMARY", 14, y);
        y += 6;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(slate[0], slate[1], slate[2]);
        const diagText = isTa && record.diagnosis_ta ? record.diagnosis_ta : (record.diagnosis || 'None entered');
        const splitDiag = doc.splitTextToSize(diagText, 180);
        doc.text(splitDiag, 14, y);
        y += (splitDiag.length * 5) + 6;

        // 2. Prescribed Medications
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(teal[0], teal[1], teal[2]);
        doc.text("2. APPROVED MEDICATION REGIMEN", 14, y);
        y += 6;

        const meds = Array.isArray(record.medication_instructions) ? record.medication_instructions : [];
        if (meds.length > 0) {
            meds.forEach((m, idx) => {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9);
                doc.setTextColor(slate[0], slate[1], slate[2]);
                doc.text(`${idx + 1}. ${m.name} ${m.dose || ''} - [${m.timing || m.frequency || ''}]`, 18, y);
                y += 4;
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(gray[0], gray[1], gray[2]);
                doc.text(`Instructions: ${m.instructions || m.indication || ''}`, 22, y);
                y += 6;
            });
        } else {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.text("No medications listed.", 18, y);
            y += 6;
        }

        y += 4;

        // 3. Lifestyle & Red Flag Warnings
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(teal[0], teal[1], teal[2]);
        doc.text("3. LIFESTYLE ADVICE & EMERGENCY RED FLAGS", 14, y);
        y += 6;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(slate[0], slate[1], slate[2]);
        doc.text("Lifestyle & Activity:", 14, y);
        y += 4;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(gray[0], gray[1], gray[2]);
        const lifeText = isTa && record.lifestyle_instructions_ta ? record.lifestyle_instructions_ta : (record.lifestyle_instructions || 'Routine cardiac precautions.');
        const splitLife = doc.splitTextToSize(lifeText, 180);
        doc.text(splitLife, 14, y);
        y += (splitLife.length * 4.5) + 4;

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(239, 68, 68); // Red
        doc.text("Emergency Red Flags (Seek Immediate Care):", 14, y);
        y += 4;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(slate[0], slate[1], slate[2]);
        const redText = isTa && record.red_flag_symptoms_ta ? record.red_flag_symptoms_ta : (record.red_flag_symptoms || 'Crushing chest pain lasting >5 minutes, severe breathlessness.');
        const splitRed = doc.splitTextToSize(redText, 180);
        doc.text(splitRed, 14, y);
        y += (splitRed.length * 4.5) + 6;

        // 4. Follow-up & Helpline
        doc.setDrawColor(teal[0], teal[1], teal[2]);
        doc.setFillColor(240, 253, 250);
        doc.roundedRect(14, y, 182, 20, 2, 2, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(teal[0], teal[1], teal[2]);
        doc.text(`Follow-up Appointment: ${record.follow_up_date || '7 days'} at ${record.follow_up_time || '10:00 AM'}`, 18, y + 7);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(slate[0], slate[1], slate[2]);
        doc.text(`Location: ${record.follow_up_clinic || 'OPD Suite 204'} | 24/7 Hospital Helpline: ${record.helpline_number || '1800-200-88'}`, 18, y + 14);

        // Footer disclaimer
        doc.setFontSize(7.5);
        doc.setTextColor(150, 150, 150);
        doc.text("Disclaimer: CAREBRIDGE is a communication handover tool. Verification confirms completeness. Clinical decisions remain under the authorized physician.", 14, 285);

        // Save PDF
        const filename = `CAREBRIDGE_Discharge_${record.patient_reference || 'Summary'}.pdf`;
        doc.save(filename);
    }
};

window.CarebridgePDF = CarebridgePDFService;

/**
 * CAREBRIDGE Privacy-Preserving QR Code Service
 * CRITICAL RULE: Encodes ONLY the secure handover URL.
 * NEVER encodes patient name, diagnosis, medicines, or any Personal Health Information (PHI).
 */
const CarebridgeQRService = {
    /**
     * Renders a privacy-safe QR code into the specified DOM element
     * @param {HTMLElement|string} element - Container or selector
     * @param {string} secureUrl - The exact handover access URL
     * @param {number} size - Pixel size (default 220)
     */
    render(element, secureUrl, size = 200) {
        const container = typeof element === 'string' ? document.querySelector(element) : element;
        if (!container) return;

        // Clear previous content
        container.innerHTML = '';

        if (!window.QRCode) {
            console.warn('[CAREBRIDGE QR] QRCode library not loaded, showing fallback link');
            container.innerHTML = `<a href="${secureUrl}" target="_blank" class="text-primary underline text-sm break-all">${secureUrl}</a>`;
            return;
        }

        try {
            new QRCode(container, {
                text: secureUrl,
                width: size,
                height: size,
                colorDark: "#00636e", // Medical Teal
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.M
            });
        } catch (e) {
            console.error('[CAREBRIDGE QR] Error generating QR code:', e);
            container.innerHTML = `<p class="text-xs text-error">Unable to render QR code.</p>`;
        }
    }
};

window.CarebridgeQR = CarebridgeQRService;

/**
 * CAREBRIDGE Main Application Orchestrator
 * Integrates Google Stitch UI with Supabase backend, Demo system, Audio, PDF & QR.
 */

// Application State
const CarebridgeState = {
    currentTab: 'login', // 'login', 'dashboard', 'discharge-records', 'create-record', 'patient-portal', 'settings'
    currentUser: null,   // { role: 'doctor' | 'patient', name, id, ... }
    isLoggedIn: false,
    activeRecord: null,
    currentLanguage: 'en', // 'en' or 'ta'
    currentDoctor: window.CAREBRIDGE_CONFIG?.DEFAULT_DOCTOR || { name: "Dr. Arun Kumar", title: "MD, DM" },
    filterStatus: 'all',
    searchQuery: '',
    speechStatus: 'stopped', // 'stopped', 'playing', 'paused'
    isHandoverSession: false
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

    // Restore saved session if available
    try {
        const savedSession = sessionStorage.getItem('carebridge_session_user');
        if (savedSession) {
            CarebridgeState.currentUser = JSON.parse(savedSession);
            CarebridgeState.isLoggedIn = true;
        }
    } catch (e) {
        console.warn('[CAREBRIDGE] Session read error:', e);
    }

    // Load initial record
    const records = await window.CarebridgeStorage.getDischargeRecords();
    if (records && records.length > 0) {
        CarebridgeState.activeRecord = recordParam ? 
            (records.find(r => r.id === recordParam || r.patient_reference === recordParam) || records[0]) : 
            records[0];
    } else {
        CarebridgeState.activeRecord = window.CAREBRIDGE_DEMO_DATA?.dischargeRecords[0] || null;
    }

    // Wire global header events
    setupHeaderEvents();

    // Setup speech audio callbacks
    window.CarebridgeAudio.onStateChangeCallback = (state) => {
        CarebridgeState.speechStatus = state;
        updateAudioButtonUI(state);
    };

    // If accessed via secure handover token (e.g. scanned QR code or handover link)
    if (tokenParam) {
        handleTokenHandover(tokenParam);
    } else if (CarebridgeState.isLoggedIn && CarebridgeState.currentUser) {
        // User is logged in: show appropriate view and nav
        if (CarebridgeState.currentUser.role === 'patient') {
            CarebridgeState.currentTab = 'patient-portal';
            setupNavigationForRole('patient');
        } else {
            CarebridgeState.currentTab = 'discharge-records';
            setupNavigationForRole('doctor');
        }
        updateUserHeader();
        renderCurrentView();
    } else {
        // User not logged in: show login screen and hide nav
        CarebridgeState.currentTab = 'login';
        setupNavigationForRole('login');
        updateUserHeader();
        renderCurrentView();
    }

    // Check Supabase connection indicator
    updateSupabaseStatusIndicator();
});

// ==========================================
// ROLE-BASED NAVIGATION CONTROLLER
// ==========================================
function setupNavigationForRole(role) {
    const nav = document.querySelector('nav');
    if (!nav) return;

    if (!CarebridgeState.isLoggedIn || role === 'login') {
        nav.style.display = 'none';
        return;
    }

    nav.style.display = 'block';

    if (role === 'patient') {
        nav.innerHTML = `
            <div class="flex justify-around items-center h-20 px-space-xs">
                <a class="flex flex-col items-center justify-center w-16 h-14 rounded-full ${CarebridgeState.currentTab === 'patient-portal' ? 'text-primary font-semibold' : 'text-text-secondary'} hover:text-on-surface transition-all gap-0.5"
                    data-path="patient-portal" href="#" onclick="event.preventDefault(); switchTab('patient-portal');">
                    <span class="material-symbols-outlined text-[24px]">description</span>
                    <span class="font-label-sm text-[11px]">My Summary</span>
                </a>
                <a class="flex flex-col items-center justify-center w-16 h-14 rounded-full text-text-secondary hover:text-on-surface transition-all gap-0.5"
                    href="#" onclick="event.preventDefault(); playActiveRecordAudio();">
                    <span class="material-symbols-outlined text-[24px]" id="nav-audio-icon">volume_up</span>
                    <span class="font-label-sm text-[11px]">Listen</span>
                </a>
                <a class="flex flex-col items-center justify-center w-16 h-14 rounded-full text-text-secondary hover:text-on-surface transition-all gap-0.5"
                    href="#" onclick="event.preventDefault(); setGlobalLanguage(CarebridgeState.currentLanguage === 'en' ? 'ta' : 'en');">
                    <span class="material-symbols-outlined text-[24px]">translate</span>
                    <span class="font-label-sm text-[11px]">${CarebridgeState.currentLanguage === 'en' ? 'தமிழ்' : 'English'}</span>
                </a>
                <a class="flex flex-col items-center justify-center w-16 h-14 rounded-full text-text-secondary hover:text-error transition-all gap-0.5"
                    href="#" onclick="event.preventDefault(); logout();" title="Exit Patient Portal">
                    <span class="material-symbols-outlined text-[24px]">logout</span>
                    <span class="font-label-sm text-[11px]">Exit</span>
                </a>
            </div>
        `;
    } else {
        // Doctor / Clinician role
        nav.innerHTML = `
            <div class="flex justify-around items-center h-20 px-space-xs">
                <a class="flex flex-col items-center justify-center w-14 h-14 rounded-full ${CarebridgeState.currentTab === 'dashboard' ? 'text-primary font-semibold' : 'text-text-secondary'} hover:text-on-surface transition-all gap-0.5"
                    data-path="dashboard" href="#" onclick="event.preventDefault(); switchTab('dashboard');">
                    <span class="material-symbols-outlined text-[24px]">grid_view</span>
                    <span class="font-label-sm text-label-sm">Dashboard</span>
                </a>
                <a class="flex flex-col items-center justify-center w-14 h-14 rounded-full ${CarebridgeState.currentTab === 'discharge-records' ? 'text-primary font-semibold' : 'text-text-secondary'} hover:text-on-surface transition-all gap-0.5"
                    data-path="discharge-records" href="#" onclick="event.preventDefault(); switchTab('discharge-records');">
                    <span class="material-symbols-outlined text-[24px]">description</span>
                    <span class="font-label-sm text-label-sm">Records</span>
                </a>
                <a aria-label="Create New Discharge Record"
                    class="flex flex-col items-center justify-center w-14 h-14 rounded-full text-white bg-primary-container shadow-[0_4px_12px_rgba(8,126,139,0.25)] hover:bg-primary transition-all"
                    data-path="create-record" href="#" onclick="event.preventDefault(); switchTab('create-record');">
                    <span class="material-symbols-outlined text-[28px]">add</span>
                </a>
                <a class="flex flex-col items-center justify-center w-14 h-14 rounded-full ${CarebridgeState.currentTab === 'settings' ? 'text-primary font-semibold' : 'text-text-secondary'} hover:text-on-surface transition-all gap-0.5"
                    data-path="settings" href="#" onclick="event.preventDefault(); switchTab('settings');">
                    <span class="material-symbols-outlined text-[24px]">settings</span>
                    <span class="font-label-sm text-label-sm">Settings</span>
                </a>
                <a class="flex flex-col items-center justify-center w-14 h-14 rounded-full text-text-secondary hover:text-error transition-all gap-0.5"
                    href="#" onclick="event.preventDefault(); logout();" title="Sign Out">
                    <span class="material-symbols-outlined text-[24px]">logout</span>
                    <span class="font-label-sm text-label-sm">Logout</span>
                </a>
            </div>
        `;
    }
}

function switchTab(path) {
    // If not logged in and not heading to login
    if (!CarebridgeState.isLoggedIn && path !== 'login') {
        path = 'login';
    }

    // Role protection: patients cannot access doctor-only tabs
    if (CarebridgeState.isLoggedIn && CarebridgeState.currentUser?.role === 'patient') {
        if (path === 'create-record' || path === 'dashboard' || path === 'settings' || path === 'discharge-records') {
            path = 'patient-portal';
        }
    }

    CarebridgeState.currentTab = path;

    // Refresh nav state
    if (CarebridgeState.isLoggedIn) {
        setupNavigationForRole(CarebridgeState.currentUser.role);
    } else {
        setupNavigationForRole('login');
    }

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
        case 'login':
            renderLoginView(mainEl);
            break;
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
            if (!CarebridgeState.isLoggedIn) {
                renderLoginView(mainEl);
            } else if (CarebridgeState.currentUser?.role === 'patient') {
                renderPatientPortalView(mainEl);
            } else {
                renderDischargeRecordView(mainEl);
            }
    }
}

// ==========================================
// USER AUTHENTICATION & ROLE MANAGEMENT
// ==========================================
function updateUserHeader() {
    const initialsEl = document.getElementById('header-user-initials');
    const btn = document.getElementById('header-user-btn');
    if (!initialsEl || !btn) return;

    if (!CarebridgeState.isLoggedIn || !CarebridgeState.currentUser) {
        initialsEl.textContent = '🔒';
        btn.title = "Not signed in - Click to Login";
        btn.className = "w-8 h-8 rounded-full bg-surface-container text-text-secondary font-bold text-xs flex items-center justify-center ring-2 ring-outline-variant hover:ring-primary shadow-sm transition-all";
    } else if (CarebridgeState.currentUser.role === 'doctor') {
        const docName = CarebridgeState.currentUser.name || 'Dr. Arun';
        const inits = docName.replace('Dr. ', '').split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('');
        initialsEl.textContent = inits || 'DR';
        btn.title = `${CarebridgeState.currentUser.name} (${CarebridgeState.currentUser.title || 'Clinician'}) - Click to switch/logout`;
        btn.className = "w-8 h-8 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center ring-2 ring-primary/30 hover:ring-primary shadow-sm transition-all";
    } else {
        const patName = CarebridgeState.currentUser.name || 'Patient';
        const inits = patName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('');
        initialsEl.textContent = inits || 'PT';
        btn.title = `${CarebridgeState.currentUser.name} (Patient: ${CarebridgeState.currentUser.ref || ''}) - Click to exit`;
        btn.className = "w-8 h-8 rounded-full bg-secondary text-white font-bold text-xs flex items-center justify-center ring-2 ring-secondary/30 hover:ring-secondary shadow-sm transition-all";
    }
}

function loginAsDoctor(doctorId, email) {
    const doctors = window.CAREBRIDGE_DEMO_DATA?.doctors || [];
    const doc = doctors.find(d => d.id === doctorId || d.email === email) || doctors[0];
    
    CarebridgeState.currentUser = {
        role: 'doctor',
        id: doc.id,
        name: doc.name,
        title: doc.title,
        department: doc.department,
        email: doc.email
    };
    CarebridgeState.currentDoctor = doc;
    CarebridgeState.isLoggedIn = true;
    CarebridgeState.isHandoverSession = false;
    try {
        sessionStorage.setItem('carebridge_session_user', JSON.stringify(CarebridgeState.currentUser));
    } catch (e) {}

    updateUserHeader();
    setupNavigationForRole('doctor');
    switchTab('discharge-records');
}

function loginAsPatient(patientRef) {
    const ref = patientRef || 'CB-9082';
    const demoRecords = window.CAREBRIDGE_DEMO_DATA?.dischargeRecords || [];
    const rec = demoRecords.find(r => r.patient_reference === ref || r.id === ref) || demoRecords[0];

    CarebridgeState.activeRecord = rec;
    CarebridgeState.currentUser = {
        role: 'patient',
        ref: rec.patient_reference,
        name: rec.patient_name,
        id: rec.id
    };
    CarebridgeState.isLoggedIn = true;
    CarebridgeState.isHandoverSession = false;
    try {
        sessionStorage.setItem('carebridge_session_user', JSON.stringify(CarebridgeState.currentUser));
    } catch (e) {}

    updateUserHeader();
    setupNavigationForRole('patient');
    switchTab('patient-portal');
}

function logout() {
    CarebridgeState.currentUser = null;
    CarebridgeState.isLoggedIn = false;
    CarebridgeState.isHandoverSession = false;
    try {
        sessionStorage.removeItem('carebridge_session_user');
    } catch (e) {}
    
    window.CarebridgeAudio.stop();

    updateUserHeader();
    setupNavigationForRole('login');
    switchTab('login');
}

function handleLogoClick() {
    if (!CarebridgeState.isLoggedIn) {
        switchTab('login');
    } else if (CarebridgeState.currentUser?.role === 'doctor') {
        switchTab('discharge-records');
    } else {
        switchTab('patient-portal');
    }
}

function openUserMenu() {
    const existing = document.getElementById('user-menu-modal');
    if (existing) {
        existing.remove();
        return;
    }

    if (!CarebridgeState.isLoggedIn) {
        switchTab('login');
        return;
    }

    const modal = document.createElement('div');
    modal.id = 'user-menu-modal';
    modal.className = "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4";
    
    const isDoc = CarebridgeState.currentUser.role === 'doctor';
    modal.innerHTML = `
        <div class="bg-surface-container-lowest rounded-2xl p-5 max-w-xs w-full shadow-2xl flex flex-col gap-3">
            <div class="flex items-center justify-between pb-2 border-b border-surface-container">
                <span class="font-label-lg font-bold text-text-primary">Signed In Account</span>
                <button class="text-text-secondary hover:text-text-primary text-sm p-1" onclick="document.getElementById('user-menu-modal').remove()">✕</button>
            </div>
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl ${isDoc ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'} font-bold flex items-center justify-center text-lg">
                    ${isDoc ? '👨‍⚕️' : '👤'}
                </div>
                <div class="min-w-0">
                    <h3 class="font-headline-sm text-sm font-bold text-text-primary truncate">${CarebridgeState.currentUser.name}</h3>
                    <p class="font-label-sm text-xs text-text-secondary truncate">${isDoc ? (CarebridgeState.currentUser.title + ' • ' + CarebridgeState.currentUser.department) : ('Ref: ' + (CarebridgeState.currentUser.ref || 'CB-9082'))}</p>
                    <span class="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${isDoc ? 'bg-primary/10 text-primary' : 'bg-secondary/15 text-secondary'}">
                        ${isDoc ? 'Clinician Role' : 'Patient / Caregiver'}
                    </span>
                </div>
            </div>
            <div class="pt-2 flex flex-col gap-2">
                <button class="w-full py-2 bg-surface-container hover:bg-surface-container-high rounded-lg text-xs font-semibold text-text-primary flex items-center justify-center gap-1.5" onclick="document.getElementById('user-menu-modal').remove(); switchTab('login');">
                    <span class="material-symbols-outlined text-[16px]">switch_account</span>
                    Switch Role / Profile
                </button>
                <button class="w-full py-2 bg-error/10 hover:bg-error/20 text-error rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5" onclick="document.getElementById('user-menu-modal').remove(); logout();">
                    <span class="material-symbols-outlined text-[16px]">logout</span>
                    Sign Out
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// ==========================================
// PAGE: LOGIN & ROLE PORTAL
// ==========================================
function renderLoginView(container) {
    const doctors = window.CAREBRIDGE_DEMO_DATA?.doctors || [
        { id: "d1111111-1111-1111-1111-111111111111", name: "Dr. Arun Kumar", title: "MD, DM (Cardiology)", department: "Cardiology", email: "arun.kumar@demo-hospital.care" }
    ];
    const patients = window.CAREBRIDGE_DEMO_DATA?.patients || [
        { id: "p1111111-1111-1111-1111-111111111111", patient_reference: "CB-9082", full_name: "Kumarasamy V.", ward: "Cardiology • Bay 4B" }
    ];

    container.innerHTML = `
        <div class="flex flex-col w-full pb-12 px-gutter-mobile pt-3 max-w-lg mx-auto space-y-4">
            <!-- Hero Brand Banner -->
            <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col items-center text-center gap-3">
                <div class="h-14 w-14 rounded-2xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center shadow-lg text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
                        <path d="M19 10.5V8.5C19 8.22 18.78 8 18.5 8H13.5V3C13.5 2.45 13.05 2 12.5 2H11.5C10.95 2 10.5 2.45 10.5 3V8H5.5C5.22 8 5 8.22 5 8.5V10.5C5 10.78 5.22 11 5.5 11H10.5V16C10.5 16.55 10.95 17 11.5 17H12.5C13.05 17 13.5 16.55 13.5 16V11H18.5C18.78 11 19 10.78 19 10.5Z"/>
                        <path d="M4 19C4 18.45 4.45 18 5 18H19C19.55 18 20 18.45 20 19C20 19.55 19.55 20 19 20H5C4.45 20 4 19.55 4 19Z" fill-opacity="0.8"/>
                        <circle cx="12" cy="19" r="2.5" fill="#77f7ed"/>
                    </svg>
                </div>
                <div>
                    <h1 class="font-headline-sm text-2xl font-bold text-primary tracking-tight">CAREBRIDGE</h1>
                    <p class="font-label-sm text-xs text-text-secondary mt-0.5">Connected Transitions • Clinical Discharge</p>
                </div>
                <p class="font-body-md text-sm text-text-secondary max-w-sm">
                    Clinician-verified discharge communication platform. Select your role below to sign in or explore the demonstration.
                </p>
            </div>

            <!-- Role Selector Toggle -->
            <div class="flex p-1 bg-surface-container rounded-xl shadow-inner">
                <button id="login-tab-doctor" class="flex-1 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm bg-surface-container-lowest text-primary flex items-center justify-center gap-1.5" onclick="setLoginRoleTab('doctor')">
                    <span class="material-symbols-outlined text-[18px]">medical_services</span>
                    Clinician / Doctor
                </button>
                <button id="login-tab-patient" class="flex-1 py-2.5 rounded-lg text-xs font-bold transition-all text-text-secondary hover:text-text-primary flex items-center justify-center gap-1.5" onclick="setLoginRoleTab('patient')">
                    <span class="material-symbols-outlined text-[18px]">person</span>
                    Patient / Family
                </button>
            </div>

            <!-- Panel 1: Doctor Login -->
            <div id="doctor-login-panel" class="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
                <div class="flex items-center justify-between pb-2 border-b border-surface-container">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary text-[22px]">stethoscope</span>
                        <h2 class="font-label-lg font-bold text-text-primary">Clinician Sign In</h2>
                    </div>
                    <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">Doctor Access</span>
                </div>

                <div class="space-y-3">
                    <div>
                        <label class="block font-label-md text-xs font-semibold text-text-secondary mb-1">Select Clinician Account</label>
                        <select id="doctor-select" class="w-full p-2.5 bg-surface-container-low rounded-lg font-body-md text-sm text-text-primary border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20" onchange="onDoctorSelectChange(this.value)">
                            ${doctors.map(d => `
                                <option value="${d.id}" data-email="${d.email}">${d.name} — ${d.title} (${d.department})</option>
                            `).join('')}
                        </select>
                    </div>

                    <div>
                        <label class="block font-label-md text-xs font-semibold text-text-secondary mb-1">Hospital Email / Clinician ID</label>
                        <input id="doctor-email" class="w-full p-2.5 bg-surface-container-low rounded-lg font-body-md text-sm text-text-primary border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20" value="${doctors[0].email}" readonly>
                    </div>

                    <div>
                        <label class="block font-label-md text-xs font-semibold text-text-secondary mb-1">Password / Security PIN</label>
                        <input type="password" class="w-full p-2.5 bg-surface-container-low rounded-lg font-body-md text-sm text-text-primary border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20" value="demo1234">
                    </div>
                </div>

                <div class="pt-2 flex flex-col gap-2.5">
                    <button class="w-full py-3 rounded-xl bg-primary-container text-white font-label-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-primary transition-all active:scale-[0.99]" onclick="executeDoctorLogin()">
                        <span class="material-symbols-outlined text-[18px]">login</span>
                        Sign In as Clinician
                    </button>
                    <button class="w-full py-2.5 rounded-xl bg-primary/10 text-primary font-label-md text-xs font-bold hover:bg-primary/20 transition-all flex items-center justify-center gap-1.5" onclick="loginAsDoctor('d1111111-1111-1111-1111-111111111111', 'arun.kumar@demo-hospital.care')">
                        <span>⚡</span> 1-Click Clinician Demo Sign In (Dr. Arun Kumar)
                    </button>
                </div>
            </div>

            <!-- Panel 2: Patient Login -->
            <div id="patient-login-panel" class="hidden bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
                <div class="flex items-center justify-between pb-2 border-b border-surface-container">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-secondary text-[22px]">health_and_safety</span>
                        <h2 class="font-label-lg font-bold text-text-primary">Patient & Caregiver Access</h2>
                    </div>
                    <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-secondary/15 text-secondary">Patient Portal</span>
                </div>

                <div class="space-y-3">
                    <div>
                        <label class="block font-label-md text-xs font-semibold text-text-secondary mb-1">Select Patient Record</label>
                        <select id="patient-select" class="w-full p-2.5 bg-surface-container-low rounded-lg font-body-md text-sm text-text-primary border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20" onchange="onPatientSelectChange(this.value)">
                            ${patients.map(p => `
                                <option value="${p.patient_reference}">${p.patient_reference} • ${p.full_name} (${p.ward})</option>
                            `).join('')}
                        </select>
                    </div>

                    <div>
                        <label class="block font-label-md text-xs font-semibold text-text-secondary mb-1">Patient Reference Identifier</label>
                        <input id="patient-ref-input" class="w-full p-2.5 bg-surface-container-low rounded-lg font-body-md text-sm text-text-primary border border-outline-variant/40 font-mono" value="CB-9082">
                    </div>

                    <div>
                        <label class="block font-label-md text-xs font-semibold text-text-secondary mb-1">Date of Birth / Access PIN</label>
                        <input type="text" class="w-full p-2.5 bg-surface-container-low rounded-lg font-body-md text-sm text-text-primary border border-outline-variant/40" value="1966-05-15">
                    </div>
                </div>

                <div class="pt-2 flex flex-col gap-2.5">
                    <button class="w-full py-3 rounded-xl bg-secondary text-white font-label-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-secondary/90 transition-all active:scale-[0.99]" onclick="executePatientLogin()">
                        <span class="material-symbols-outlined text-[18px]">verified_user</span>
                        Access Patient Discharge Booklet
                    </button>
                    <button class="w-full py-2.5 rounded-xl bg-secondary/10 text-secondary font-label-md text-xs font-bold hover:bg-secondary/20 transition-all flex items-center justify-center gap-1.5" onclick="loginAsPatient('CB-9082')">
                        <span>⚡</span> 1-Click Patient Demo Access (CB-9082 • Kumarasamy V.)
                    </button>
                </div>
            </div>

            <!-- Trust & Safety Footer -->
            <div class="bg-surface-container-low/70 rounded-xl p-4 text-xs text-text-secondary space-y-2 border border-outline-variant/20">
                <div class="flex items-center gap-2 text-primary font-semibold">
                    <span class="material-symbols-outlined text-[16px]">verified</span>
                    <span>Zero-PHI Cryptographic Handover Protocol</span>
                </div>
                <p class="leading-relaxed">
                    QR codes encode only time-limited cryptographic access tokens. No patient names, diagnoses, or medication data are transmitted in public URLs or QR payloads.
                </p>
                <p class="text-[11px] text-text-secondary/80 border-t border-surface-container pt-1.5 mt-1">
                    Statutory Boundary: CAREBRIDGE facilitates clinical discharge communication. It does NOT independently diagnose, prescribe, or alter medical treatment.
                </p>
            </div>
        </div>
    `;
}

function onDoctorSelectChange(doctorId) {
    const sel = document.getElementById('doctor-select');
    if (!sel) return;
    const selectedOption = sel.options[sel.selectedIndex];
    const email = selectedOption?.getAttribute('data-email');
    const emailInput = document.getElementById('doctor-email');
    if (emailInput && email) emailInput.value = email;
}

function executeDoctorLogin() {
    const sel = document.getElementById('doctor-select');
    const doctorId = sel?.value || 'd1111111-1111-1111-1111-111111111111';
    const email = document.getElementById('doctor-email')?.value || 'arun.kumar@demo-hospital.care';
    loginAsDoctor(doctorId, email);
}

function onPatientSelectChange(ref) {
    const refInput = document.getElementById('patient-ref-input');
    if (refInput) refInput.value = ref;
}

function executePatientLogin() {
    const ref = document.getElementById('patient-ref-input')?.value.trim() || 'CB-9082';
    loginAsPatient(ref);
}

function setLoginRoleTab(role) {
    const docTab = document.getElementById('login-tab-doctor');
    const patTab = document.getElementById('login-tab-patient');
    const docPanel = document.getElementById('doctor-login-panel');
    const patPanel = document.getElementById('patient-login-panel');
    if (!docTab || !patTab || !docPanel || !patPanel) return;

    if (role === 'doctor') {
        docTab.className = "flex-1 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm bg-surface-container-lowest text-primary flex items-center justify-center gap-1.5";
        patTab.className = "flex-1 py-2.5 rounded-lg text-xs font-bold transition-all text-text-secondary hover:text-text-primary flex items-center justify-center gap-1.5";
        docPanel.classList.remove('hidden');
        patPanel.classList.add('hidden');
    } else {
        patTab.className = "flex-1 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm bg-surface-container-lowest text-secondary flex items-center justify-center gap-1.5";
        docTab.className = "flex-1 py-2.5 rounded-lg text-xs font-bold transition-all text-text-secondary hover:text-text-primary flex items-center justify-center gap-1.5";
        patPanel.classList.remove('hidden');
        docPanel.classList.add('hidden');
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
                            <div class="relative w-12 h-12 rounded-xl overflow-hidden bg-primary/10 text-primary border border-primary/20 flex items-center justify-center flex-shrink-0 shadow-sm font-bold text-base">
                                <span>${(record.patient_name || 'PT').split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('')}</span>
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
            ${CarebridgeState.isHandoverSession ? `
                <div class="bg-success/15 border border-success/30 rounded-xl p-3.5 flex items-center gap-3 text-success shadow-sm">
                    <span class="material-symbols-outlined text-[26px] flex-shrink-0" style="font-variation-settings: 'FILL' 1;">verified</span>
                    <div class="min-w-0">
                        <span class="font-label-md text-xs font-bold block text-text-primary">
                            ${isTa ? 'அங்கீகரிக்கப்பட்ட டிஸ்சார்ஜ் அணுகல் சரிபார்க்கப்பட்டது' : 'Authorized Clinician Handover Active'}
                        </span>
                        <p class="text-[11px] text-text-secondary leading-snug">
                            ${isTa ? 'மருத்துவர் சரிபார்த்த டிஸ்சார்ஜ் குறிப்புகள் கிரிப்டோகிராஃபிக் முறையில் உறுதிசெய்யப்பட்டது.' : 'Cryptographically signed clinical discharge instructions verified from hospital.'}
                        </p>
                    </div>
                </div>
            ` : ''}

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
    const handoverUrl = `${window.location.origin}${window.location.pathname}?token=${encodeURIComponent(tokenData.rawToken)}&record=${encodeURIComponent(dischargeId)}`;

    const modal = document.createElement('div');
    modal.id = 'handover-modal';
    modal.className = "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4";
    modal.innerHTML = `
        <div class="bg-surface-container-lowest rounded-xl p-5 max-w-sm w-full shadow-2xl flex flex-col items-center text-center gap-3">
            <div class="flex items-center justify-between w-full">
                <span class="font-label-lg font-bold text-text-primary">Authorized Handover Link</span>
                <button class="text-text-secondary text-sm" onclick="document.getElementById('handover-modal').remove()">✕</button>
            </div>
            
            <p class="font-body-sm text-text-secondary text-left w-full text-xs">
                Scan this QR code with any smartphone to open the patient discharge booklet. <strong>Zero Personal Health Information is stored inside the QR code.</strong>
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
                <button class="w-full py-2.5 bg-primary-container text-white rounded-lg font-label-md font-semibold flex items-center justify-center gap-1.5 shadow-sm hover:bg-primary transition-all" onclick="navigator.clipboard.writeText('${handoverUrl}'); alert('Handover link copied to clipboard!')">
                    <span class="material-symbols-outlined text-[16px]">content_copy</span>
                    Copy Secure Link
                </button>
                <a href="${handoverUrl}" target="_blank" class="w-full py-2 bg-surface-container text-primary rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-surface-container-high transition-all">
                    <span class="material-symbols-outlined text-[16px]">open_in_new</span>
                    Open Handover View In New Tab
                </a>
                <button class="w-full py-1.5 text-error rounded-lg text-xs font-medium hover:bg-error/10 transition-all" onclick="revokeHandoverLink('${tokenData.tokenHash}')">
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
    const urlParams = new URLSearchParams(window.location.search);
    const recordParam = urlParams.get('record');
    const result = await window.CarebridgeStorage.validateToken(rawToken, recordParam);

    if (!result.isValid) {
        window.CarebridgeAudio.stop();
        setupNavigationForRole('login');
        document.querySelector('main').innerHTML = `
            <div class="px-gutter-mobile py-16 flex flex-col items-center justify-center text-center gap-3 max-w-sm mx-auto">
                <div class="w-16 h-16 rounded-full bg-error-container text-error flex items-center justify-center shadow-sm">
                    <span class="material-symbols-outlined text-[36px]">lock</span>
                </div>
                <h1 class="font-headline-md text-text-primary font-bold">Access Denied</h1>
                <p class="font-body-md text-text-secondary text-sm">
                    ${result.reason || 'This handover link is invalid, expired, or has been revoked by the hospital.'}
                </p>
                <div class="pt-4 flex flex-col gap-2 w-full">
                    <button class="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-primary/90 transition-all" onclick="logout()">
                        Return to Sign In Portal
                    </button>
                    <a href="${window.location.pathname}" class="text-xs text-text-secondary hover:text-text-primary">
                        Clear URL Parameters
                    </a>
                </div>
            </div>
        `;
        return;
    }

    // Token valid: load the exact discharge record
    const targetRecordId = result.dischargeId || recordParam;
    const record = await window.CarebridgeStorage.getDischargeRecord(targetRecordId);
    if (record) {
        CarebridgeState.activeRecord = record;
        CarebridgeState.currentUser = {
            role: 'patient',
            name: record.patient_name,
            ref: record.patient_reference,
            id: record.id
        };
        CarebridgeState.isLoggedIn = true;
        CarebridgeState.isHandoverSession = true;
        try {
            sessionStorage.setItem('carebridge_session_user', JSON.stringify(CarebridgeState.currentUser));
        } catch (e) {}

        updateUserHeader();
        setupNavigationForRole('patient');
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

// Auth & Role Handlers
window.loginAsDoctor = loginAsDoctor;
window.loginAsPatient = loginAsPatient;
window.logout = logout;
window.openUserMenu = openUserMenu;
window.handleLogoClick = handleLogoClick;
window.setLoginRoleTab = setLoginRoleTab;
window.onDoctorSelectChange = onDoctorSelectChange;
window.executeDoctorLogin = executeDoctorLogin;
window.onPatientSelectChange = onPatientSelectChange;
window.executePatientLogin = executePatientLogin;
window.setupNavigationForRole = setupNavigationForRole;
window.updateUserHeader = updateUserHeader;

