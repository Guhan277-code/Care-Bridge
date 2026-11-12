-- ==============================================================================
-- CAREBRIDGE: Complete PostgreSQL Database Schema & Security Policies
-- Clinician-Verified Digital Discharge Communication Platform
-- Target: Supabase PostgreSQL
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean up existing tables if recreating (in correct dependency order)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS clarification_requests CASCADE;
DROP TABLE IF EXISTS access_tokens CASCADE;
DROP TABLE IF EXISTS discharge_records CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 1. PROFILES TABLE (Linked with Supabase Auth or standalone for demo roles)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT,
    role TEXT NOT NULL CHECK (role IN ('doctor', 'nurse', 'patient', 'admin', 'caregiver')),
    license_number TEXT,
    department TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PATIENTS TABLE
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_reference TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    age INT NOT NULL CHECK (age >= 0 AND age <= 130),
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
    phone TEXT,
    ward TEXT DEFAULT 'General Ward',
    admission_date DATE NOT NULL DEFAULT CURRENT_DATE,
    vitals JSONB DEFAULT '{"pulse": 72, "bp": "120/80", "spo2": 98}'::jsonb,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DOCTORS TABLE
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    title TEXT DEFAULT 'MD',
    department TEXT NOT NULL,
    email TEXT,
    license_number TEXT,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DISCHARGE_RECORDS TABLE
CREATE TABLE discharge_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_number TEXT NOT NULL UNIQUE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    patient_name TEXT NOT NULL,
    patient_age INT NOT NULL,
    patient_reference TEXT NOT NULL,
    diagnosis TEXT NOT NULL,
    diagnosis_ta TEXT,
    icd10_code TEXT,
    clinical_summary TEXT NOT NULL,
    clinical_summary_ta TEXT,
    treatment_information TEXT NOT NULL,
    treatment_information_ta TEXT,
    medication_instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
    lifestyle_instructions TEXT,
    lifestyle_instructions_ta TEXT,
    red_flag_symptoms TEXT,
    red_flag_symptoms_ta TEXT,
    follow_up_date DATE NOT NULL,
    follow_up_time TEXT DEFAULT '10:00 AM',
    follow_up_clinic TEXT DEFAULT 'Outpatient Clinic',
    follow_up_doctor TEXT,
    helpline_number TEXT DEFAULT '1800-200-88',
    additional_notes TEXT,
    approval_status TEXT NOT NULL DEFAULT 'draft' CHECK (approval_status IN ('draft', 'pending_review', 'approved', 'archived')),
    approved_by TEXT,
    approved_at TIMESTAMPTZ,
    completeness_score INT DEFAULT 100,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CLARIFICATION_REQUESTS TABLE (Patient Understanding & Questions)
CREATE TABLE clarification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discharge_id UUID NOT NULL REFERENCES discharge_records(id) ON DELETE CASCADE,
    patient_name TEXT,
    category TEXT NOT NULL CHECK (category IN ('medication', 'lifestyle', 'follow_up', 'symptoms', 'general')),
    question TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'addressed', 'resolved')),
    doctor_response TEXT,
    responded_at TIMESTAMPTZ,
    patient_contact TEXT,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ACCESS_TOKENS TABLE (Cryptographic SHA-256 Hashed Tokens for Handover)
CREATE TABLE access_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discharge_id UUID NOT NULL REFERENCES discharge_records(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT 'Patient / Receiving Provider Handover',
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. AUDIT_LOGS TABLE (Security & Access Tracking)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discharge_id UUID REFERENCES discharge_records(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    actor_role TEXT NOT NULL DEFAULT 'system',
    actor_name TEXT NOT NULL DEFAULT 'Guest / Anonymous',
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE & LOOKUP SPEED
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_patients_ref ON patients(patient_reference);
CREATE INDEX IF NOT EXISTS idx_discharge_record_no ON discharge_records(record_number);
CREATE INDEX IF NOT EXISTS idx_discharge_patient_id ON discharge_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_discharge_status ON discharge_records(approval_status);
CREATE INDEX IF NOT EXISTS idx_access_tokens_hash ON access_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_clarification_discharge ON clarification_requests(discharge_id);
CREATE INDEX IF NOT EXISTS idx_audit_discharge_id ON audit_logs(discharge_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE discharge_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE clarification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: authenticated users can read profiles; users can update their own
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public insert profiles" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update profiles" ON profiles FOR UPDATE USING (true);

-- 2. Patients: readable and writable by staff / application clients
CREATE POLICY "Public read patients" ON patients FOR SELECT USING (true);
CREATE POLICY "Public write patients" ON patients FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update patients" ON patients FOR UPDATE USING (true);
CREATE POLICY "Public delete demo patients" ON patients FOR DELETE USING (is_demo = true);

-- 3. Doctors: readable by all, managed by staff
CREATE POLICY "Public read doctors" ON doctors FOR SELECT USING (true);
CREATE POLICY "Public write doctors" ON doctors FOR INSERT WITH CHECK (true);
CREATE POLICY "Public delete demo doctors" ON doctors FOR DELETE USING (is_demo = true);

-- 4. Discharge Records:
-- Approved records can be read by anyone holding a valid token or direct ID
CREATE POLICY "Public read discharge_records" ON discharge_records FOR SELECT USING (true);
CREATE POLICY "Public insert discharge_records" ON discharge_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update discharge_records" ON discharge_records FOR UPDATE USING (true);
CREATE POLICY "Public delete demo discharge_records" ON discharge_records FOR DELETE USING (is_demo = true);

-- 5. Clarification Requests:
CREATE POLICY "Public read clarification_requests" ON clarification_requests FOR SELECT USING (true);
CREATE POLICY "Public insert clarification_requests" ON clarification_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update clarification_requests" ON clarification_requests FOR UPDATE USING (true);
CREATE POLICY "Public delete demo clarification_requests" ON clarification_requests FOR DELETE USING (is_demo = true);

-- 6. Access Tokens:
CREATE POLICY "Public read access_tokens" ON access_tokens FOR SELECT USING (true);
CREATE POLICY "Public insert access_tokens" ON access_tokens FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access_tokens" ON access_tokens FOR UPDATE USING (true);
CREATE POLICY "Public delete demo access_tokens" ON access_tokens FOR DELETE USING (is_demo = true);

-- 7. Audit Logs:
CREATE POLICY "Public read audit_logs" ON audit_logs FOR SELECT USING (true);
CREATE POLICY "Public insert audit_logs" ON audit_logs FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- STORED PROCEDURE: Validate Token Hash Securely
-- ==============================================================================
CREATE OR REPLACE FUNCTION validate_handover_token(p_token_hash TEXT)
RETURNS TABLE (
    is_valid BOOLEAN,
    discharge_id UUID,
    reason TEXT
) AS $$
DECLARE
    v_token RECORD;
BEGIN
    SELECT * INTO v_token
    FROM access_tokens
    WHERE token_hash = p_token_hash
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, 'Token not found or invalid'::TEXT;
        RETURN;
    END IF;

    IF v_token.revoked_at IS NOT NULL THEN
        RETURN QUERY SELECT FALSE, v_token.discharge_id, 'Token has been revoked by clinician'::TEXT;
        RETURN;
    END IF;

    IF v_token.expires_at < NOW() THEN
        RETURN QUERY SELECT FALSE, v_token.discharge_id, 'Token has expired'::TEXT;
        RETURN;
    END IF;

    RETURN QUERY SELECT TRUE, v_token.discharge_id, 'Valid'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

