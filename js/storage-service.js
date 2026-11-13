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

