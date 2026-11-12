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
