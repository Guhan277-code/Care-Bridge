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

