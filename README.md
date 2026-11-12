# CAREBRIDGE — Clinician-Verified Digital Discharge Communication Platform

> *"Better understanding. Safer transitions. Connected care."*

**CAREBRIDGE** is a clinician-verified digital discharge communication platform built for the MedTech Hackathon. It bridges the critical transition from hospital to home by transforming structured clinical discharge instructions into patient-friendly bilingual (English & தமிழ்) summaries, verifying completeness, facilitating secure QR-code-based provider handovers, and validating patient comprehension.

---

## 1. System Features & Workflows

### 🩺 Clinician Portal
1. **Interactive Readiness & Completeness Verification**:
   - 4-module statutory checklist: Diagnosis & Summary, Structured Medications, Lifestyle & Red Flag Warnings, Follow-up Appointment.
   - Highlights completeness score (100% verified).
2. **Clinical Sign-Off**:
   - Cryptographic physician authorization checkbox and sign-off button for attending doctors (e.g. Dr. Arun Kumar).
3. **Structured Discharge Form**:
   - Create new patient records with patient demographics, diagnoses, dynamic medication lists with dosages/timing, lifestyle instructions, emergency red flags, and follow-up schedules.
4. **Time-Limited, Privacy-Safe Handover Sharing**:
   - Generates high-entropy cryptographic tokens.
   - Saves **only the SHA-256 hash** of the token in the database.
   - Generates a **zero-PHI QR code** containing strictly the secure handover URL (`?token=...`).
   - One-click token revocation if needed.

### 👤 Patient & Caregiver Portal
1. **High-Readability Care Booklet**:
   - Visual medication cards categorized by schedule: Morning, Evening, Night.
   - Clear, highlighted follow-up appointment date & clinic location.
2. **Instant Bilingual Sync (English ↔ தமிழ்)**:
   - Clinically reviewed Tamil translations for medical instructions, lifestyle warnings, and precautions.
   - Styled with Google's `Noto Sans Tamil` and `Inter` typography.
3. **Audio Narration (Web Speech API)**:
   - Plays spoken audio instructions in English and Tamil with Play, Pause, Resume, and Stop controls.
4. **Interactive Patient Understanding Check**:
   - 3-point confirmation questions covering appointment, medication schedule, and warning signs.
   - Direct *"Ask for Clarification"* modal to submit questions back to the clinician.
5. **Downloadable Care Booklet**:
   - Exports clean, professional PDF discharge summaries via `jsPDF` or browser print.

### 🧪 Presentation Demo Mode (Most Important)
- Clearly visible in the **Settings** tab.
- **"Load Demo Data"**: Instantly populates 3 fictional doctors, 8 diverse patient records, and realistic discharge summaries (mix of Approved, Pending, and Drafts).
- **Duplicate Prevention**: Automatically ignores duplicate records when clicked repeatedly.
- **"Reset Demo Data Only"**: Removes solely demonstration records (`is_demo = true`), safeguarding any real clinical data.

---

## 2. Supabase Database Setup

1. Log in to your [Supabase Dashboard](https://supabase.com).
2. Navigate to your project (`xsdjwfotqtgyezlljuda`).
3. Click on the **SQL Editor** (`>_`) in the left navigation.
4. Open the included [`schema.sql`](schema.sql) file from this repository.
5. Copy all contents into the SQL Editor and click **Run**.
6. The following 7 tables with Row Level Security (RLS) policies and indexes will be created:
   - `profiles`
   - `patients`
   - `doctors`
   - `discharge_records`
   - `clarification_requests`
   - `access_tokens`
   - `audit_logs`

---

## 3. Technology Stack

- **Frontend Shell**: Google Stitch design system, HTML5, CSS3, Tailwind CSS (CDN).
- **Typography**: Manrope, Inter, Noto Sans Tamil, Material Symbols Outlined.
- **Logic & Architecture**: Vanilla JavaScript (Modular ES6 architecture).
- **Backend & Database**: Supabase PostgreSQL with Row Level Security (RLS).
- **Security & Cryptography**: Native Browser Web Crypto API (`crypto.getRandomValues`, `crypto.subtle.digest` SHA-256).
- **Document Generation**: `jsPDF` (CDN).
- **QR Code Generation**: `QRCode.js` (CDN).
- **Accessibility & Narration**: Browser Web Speech API (`SpeechSynthesis`).
- **Deployment Target**: Vercel Static Hosting (`vercel.json`).

---

## 4. Security & Medical Safety Boundaries

> [!IMPORTANT]
> **Clinical Boundary**: CAREBRIDGE is a communication handover tool. It does **not** provide automated diagnoses, calculate medication dosages, or modify clinician-approved treatments. Administrative completeness checks verify presence of required information, while clinical responsibility remains strictly with the licensed clinician.

> [!NOTE]
> **Zero-PHI QR Codes**: QR codes generated for handover contain **strictly** a high-entropy random URL token. Patient names, diagnoses, medicines, and identifiers are **never** encoded inside the QR image or query parameters.

---

## 5. Local Execution

Simply open `index.html` in any modern web browser or serve it with any local static HTTP server:

```bash
# Using Python
python -m http.server 3000

# Or using Node
npx serve .
```

Navigate to `http://localhost:3000` to explore the full CAREBRIDGE application!

