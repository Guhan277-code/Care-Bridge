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
