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

