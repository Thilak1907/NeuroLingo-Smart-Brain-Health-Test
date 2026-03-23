/**
 * NeuroLingo Voice Service
 * ========================
 * Handles Text-to-Speech (TTS) and Speech-to-Text (STT) 
 * using browser Web Speech API with fallback support.
 * 
 * In production, this would connect to:
 *   - Coqui XTTS for TTS
 *   - Whisper-small for STT
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Language code mapping
const LANG_MAP = {
    en: 'en-US',
    ta: 'ta-IN',
    hi: 'hi-IN',
    te: 'te-IN',
    bn: 'bn-IN'
};

// Shape symbol mapping for voice commands
const SYMBOL_MAP = {
    '●': ['circle', 'dot', 'fill circle', 'filled circle', 'சக்கரம்', 'வட்டம்', 'गोला', 'वृत्त', 'వృత్తం'],
    '▲': ['triangle', 'delta', 'முக்கோணம்', 'त्रिकोण', 'త్రిభుజం'],
    '■': ['square', 'box', 'rectangle', 'சதுரம்', 'वर्ग', 'చతురస్రం'],
    '★': ['star', 'நட்சத்திரம்', 'सितारा', 'तारा', 'నక్షత్రం'],
    '◆': ['diamond', 'rhombus', 'வைரம்', 'हीरा', 'వజ్రం'],
    '◯': ['circle', 'empty circle', 'வட்டம்', 'वृत्त', 'వృత్తం'],
    '△': ['triangle', 'முக்கோணம்', 'त्रिकोण', 'త్రిభుజం'],
    '□': ['square', 'சதுரம்', 'वर्ग', 'చతురస్రం'],
    '🔴': ['red', 'red circle', 'சிவப்பு', 'लाल', 'ఎరుపు'],
    '🔵': ['blue', 'blue circle', 'நீலம்', 'नीला', 'నీలం']
};

// ============================================================
// TEXT-TO-SPEECH (TTS)
// ============================================================

class TTSEngine {
    constructor() {
        this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
        this.currentUtterance = null;
        this.voiceCache = {};
        this.isReady = false;

        // Load voices
        if (this.synth) {
            this._loadVoices();
            if (this.synth.onvoiceschanged !== undefined) {
                this.synth.onvoiceschanged = () => this._loadVoices();
            }
        }
    }

    _loadVoices() {
        if (!this.synth) return;
        const voices = this.synth.getVoices();
        voices.forEach(voice => {
            const lang = voice.lang.split('-')[0];
            if (!this.voiceCache[lang]) {
                this.voiceCache[lang] = [];
            }
            this.voiceCache[lang].push(voice);
        });
        this.isReady = voices.length > 0;
    }

    /**
     * Get the best voice for a language
     */
    _getBestVoice(langCode) {
        const fullLang = LANG_MAP[langCode] || langCode;
        const shortLang = langCode;

        // Try to find exact match first
        const allVoices = this.synth.getVoices();

        let bestVoice = allVoices.find(v => v.lang === fullLang);
        if (!bestVoice) {
            bestVoice = allVoices.find(v => v.lang.startsWith(shortLang));
        }
        if (!bestVoice) {
            bestVoice = allVoices.find(v => v.lang.startsWith('en'));
        }

        return bestVoice;
    }

    /**
     * Speak text in the specified language
     * @param {string} text - Text to speak
     * @param {string} language - Language code (en, ta, hi, te, bn)
     * @param {Object} options - Optional settings
     * @returns {Promise} resolves when speech is complete
     */
    speak(text, language = 'en', options = {}) {
        return new Promise((resolve, reject) => {
            // Cancel any ongoing speech
            this.stop();

            // Strip fake IndicBert prefix so it doesn't get dictated
            const cleanText = text.replace(/\[IndicBert[\s\S]*?\]\s*/g, '').trim();

            // Try backend gTTS first as it supports all scripts
            const encodedText = encodeURIComponent(cleanText);
            const url = `${API_BASE}/tts?text=${encodedText}&language=${language}`;

            // Capture a local ref — this.currentAudio may be nulled by stop() before
            // the async .play() promise rejects, which would crash on .onerror()
            const audio = new Audio(url);
            this.currentAudio = audio;

            audio.onended = () => {
                if (this.currentAudio === audio) this.currentAudio = null;
                resolve();
            };

            const tryGoogleTTS = () => {
                console.warn('Backend TTS failed, trying direct Google TTS as fallback');
                const ttsLang = language.substring(0, 2);
                const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${ttsLang}&client=tw-ob`;

                const fallbackAudio = new Audio(googleUrl);
                this.currentAudio = fallbackAudio;

                fallbackAudio.onended = () => {
                    if (this.currentAudio === fallbackAudio) this.currentAudio = null;
                    resolve();
                };
                fallbackAudio.onerror = () => {
                    console.warn('Google TTS fallback failed, trying Browser TTS');
                    if (this.currentAudio === fallbackAudio) this.currentAudio = null;

                    const utterance = new SpeechSynthesisUtterance(cleanText);
                    utterance.lang = LANG_MAP[language] || language;
                    utterance.rate = options.rate || 0.9;
                    utterance.pitch = options.pitch || 1.0;
                    utterance.volume = options.volume || 1.0;

                    const voice = this._getBestVoice(language);
                    if (voice) utterance.voice = voice;

                    utterance.onend = () => {
                        this.currentUtterance = null;
                        resolve();
                    };
                    utterance.onerror = (event) => {
                        this.currentUtterance = null;
                        if (event.error === 'interrupted' || event.error === 'canceled') {
                            resolve();
                        } else {
                            // Browser TTS also failed — resolve silently so the test continues
                            console.warn('Browser TTS failed:', event.error);
                            resolve();
                        }
                    };

                    this.currentUtterance = utterance;
                    this.synth.speak(utterance);
                };
                fallbackAudio.play().catch(() => fallbackAudio.onerror());
            };

            audio.onerror = tryGoogleTTS;

            // ⚠️ Fix: capture local ref so .catch handler is safe even if stop() nulls currentAudio
            audio.play().catch(() => {
                if (this.currentAudio === audio) {
                    tryGoogleTTS();
                }
                // else stop() was called — already cleaned up, do nothing
            });
        });
    }

    /**
     * Stop current speech
     */
    stop() {
        if (this.synth.speaking) {
            this.synth.cancel();
        }
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
        this.currentUtterance = null;
    }

    /**
     * Check if TTS is currently speaking
     */
    isSpeaking() {
        return this.synth.speaking || (this.currentAudio && !this.currentAudio.paused);
    }

    /**
     * Check if TTS is available
     */
    isAvailable() {
        return true; // we now use backend TTS mainly
    }

    /**
     * Get available languages for TTS
     */
    getAvailableLanguages() {
        const voices = this.synth.getVoices();
        const langs = new Set();
        voices.forEach(v => langs.add(v.lang));
        return Array.from(langs);
    }
}


// ============================================================
// SPEECH-TO-TEXT (STT)
// ============================================================

class STTEngine {
    constructor() {
        this.SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
        this.recognition = null;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.stream = null;
        this.isListening = false;
        this.transcript = '';
        this.interimTranscript = '';
        this.onResult = null;
        this.onInterim = null;
        this.onError = null;
        this.onEnd = null;
        this._stopRequested = false;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Public API
    // ─────────────────────────────────────────────────────────────────────────

    isAvailable() {
        return !!(this.SpeechRecognition);
    }

    /**
     * Start listening.
     *
     * Strategy (same for ALL languages):
     *   1. Launch Web Speech API immediately with the correct locale →
     *      gives live interim results and a final transcript in real-time.
     *   2. For non-English, also run MediaRecorder silently in parallel →
     *      when the user stops, POST the audio to Whisper.
     *      If Whisper returns a non-empty string it REPLACES the Web Speech
     *      result (better accuracy for Indic scripts).
     *      If Whisper is unreachable or returns empty, the Web Speech result
     *      is used as-is — so the test always works.
     */
    startListening(language = 'en', options = {}) {
        return this._startDual(language, options);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Core: dual-engine listener
    // ─────────────────────────────────────────────────────────────────────────
    _startDual(language, options) {
        return new Promise(async (resolve, reject) => {
            if (!this.SpeechRecognition) {
                reject(new Error('Speech Recognition is not available in this browser'));
                return;
            }

            this._stopRequested = false;
            this.transcript = '';
            this.interimTranscript = '';
            this.audioChunks = [];
            this.isListening = true;

            // ── 1. Web Speech API (live, real-time) ─────────────────────────
            this._stopWebSpeechOnly();

            this.recognition = new this.SpeechRecognition();
            this.recognition.lang = LANG_MAP[language] || language;
            this.recognition.continuous = options.continuous || false;
            this.recognition.interimResults = options.interimResults !== false;
            this.recognition.maxAlternatives = options.maxAlternatives || 3;

            let webSpeechTranscript = '';
            let webSpeechDone = false;
            let resolved = false;

            const resolveOnce = (result) => {
                if (resolved) return;
                resolved = true;
                this.isListening = false;
                this.transcript = result;
                if (this.onResult && result) this.onResult(result, result);
                if (this.onEnd) this.onEnd(result);
                resolve(result);
            };

            this.recognition.onresult = (event) => {
                let finalText = '';
                let interimText = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        finalText += event.results[i][0].transcript;
                    } else {
                        interimText += event.results[i][0].transcript;
                    }
                }
                if (finalText) {
                    webSpeechTranscript += (webSpeechTranscript ? ' ' : '') + finalText;
                    if (this.onResult) this.onResult(webSpeechTranscript, finalText);
                }
                if (interimText !== undefined) {
                    this.interimTranscript = interimText;
                    if (this.onInterim) this.onInterim(interimText);
                }
            };

            this.recognition.onerror = (event) => {
                if (event.error !== 'no-speech' && event.error !== 'aborted') {
                    console.warn('[Web Speech] error:', event.error);
                }
                // Don't reject — let onend handle resolution
            };

            this.recognition.onend = async () => {
                webSpeechDone = true;
                this.recognition = null;

                if (language === 'en') {
                    // English: no Whisper needed, resolve immediately
                    resolveOnce(webSpeechTranscript);
                    this._stopRecorder();
                    return;
                }

                // Non-English: stop recorder and try Whisper for better accuracy
                this._stopRequested = true;
                const whisperText = await this._tryWhisper(language);

                // Use Whisper result only if it's non-empty and longer/different
                const best = (whisperText && whisperText.length > 0)
                    ? whisperText
                    : webSpeechTranscript;

                console.log(`[STT] WebSpeech="${webSpeechTranscript}" Whisper="${whisperText}" → using "${best}"`);
                resolveOnce(best);
            };

            this.recognition.onstart = () => { this.isListening = true; };

            try {
                this.recognition.start();
            } catch (err) {
                this.isListening = false;
                reject(err);
                return;
            }

            // ── 2. MediaRecorder (silent, parallel, non-English only) ────────
            if (language !== 'en' && navigator.mediaDevices) {
                try {
                    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                        ? 'audio/webm;codecs=opus'
                        : MediaRecorder.isTypeSupported('audio/webm')
                            ? 'audio/webm'
                            : 'audio/mp4';

                    this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });
                    this.mediaRecorder.ondataavailable = (e) => {
                        if (e.data && e.data.size > 0) this.audioChunks.push(e.data);
                    };
                    this.mediaRecorder.start(200);
                } catch (e) {
                    // Microphone already held by recognition, or denied — skip recording
                    console.warn('[STT] MediaRecorder could not start (OK — Web Speech still works):', e.message);
                    this.stream = null;
                    this.mediaRecorder = null;
                }
            }
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────────────────

    _stopWebSpeechOnly() {
        if (this.recognition) {
            try { this.recognition.stop(); } catch (e) { /* ignore */ }
            this.recognition = null;
        }
    }

    _stopRecorder() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            try { this.mediaRecorder.stop(); } catch (e) { /* ignore */ }
        }
        this.mediaRecorder = null;
        if (this.stream) {
            this.stream.getTracks().forEach(t => t.stop());
            this.stream = null;
        }
        this.audioChunks = [];
    }

    async _tryWhisper(language) {
        // Stop the recorder to finalise chunks
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            await new Promise((res) => {
                this.mediaRecorder.onstop = res;
                try { this.mediaRecorder.stop(); } catch (e) { res(); }
            });
        }
        if (this.stream) {
            this.stream.getTracks().forEach(t => t.stop());
            this.stream = null;
        }

        if (this.audioChunks.length === 0) return '';

        const mimeType = (this.mediaRecorder?.mimeType) || 'audio/webm';
        const blob = new Blob(this.audioChunks, { type: mimeType });
        this.audioChunks = [];

        const formData = new FormData();
        formData.append('audio', blob, `stt.${mimeType.includes('mp4') ? 'mp4' : 'webm'}`);
        formData.append('language', language);

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000); // 15 s max
            const res = await fetch(`${API_BASE}/stt`, {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });
            clearTimeout(timeout);

            if (!res.ok) return '';
            const data = await res.json();
            const text = (data.transcript || '').trim();
            if (text) console.log(`[Whisper STT][${language}] "${text}"`);
            return text;
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.warn('[Whisper STT] unreachable — Web Speech result will be used:', err.message);
            }
            return '';
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Stop / Abort
    // ─────────────────────────────────────────────────────────────────────────

    stopListening() {
        this._stopWebSpeechOnly(); // triggers onend → resolves the promise
        this._stopRecorder();
        this._stopRequested = true;
    }

    abort() {
        if (this.recognition) {
            try { this.recognition.abort(); } catch (e) { /* ignore */ }
            this.recognition = null;
        }
        this._stopRecorder();
        this._stopRequested = true;
        this.isListening = false;
    }

    getTranscript() { return this.transcript; }
    getInterimTranscript() { return this.interimTranscript; }
}





// ============================================================
// AUDIO RECORDER (for sending audio to backend Whisper)
// ============================================================

class AudioRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.stream = null;
        this.isRecording = false;
    }

    /**
     * Start recording audio
     * @returns {Promise<void>}
     */
    async startRecording() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(this.stream, {
                mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
            });
            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            this.mediaRecorder.start(100); // Collect data every 100ms
            this.isRecording = true;
        } catch (err) {
            throw new Error(`Microphone access denied: ${err.message}`);
        }
    }

    /**
     * Stop recording and return audio blob
     * @returns {Promise<Blob>}
     */
    stopRecording() {
        return new Promise((resolve) => {
            if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
                resolve(null);
                return;
            }

            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
                this.audioChunks = [];
                this.isRecording = false;

                // Stop all tracks
                if (this.stream) {
                    this.stream.getTracks().forEach(track => track.stop());
                    this.stream = null;
                }

                resolve(blob);
            };

            this.mediaRecorder.stop();
        });
    }

    /**
     * Cancel recording
     */
    cancelRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }
        this.audioChunks = [];
        this.isRecording = false;

        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }
}


// ============================================================
// BACKEND API SERVICE
// ============================================================

const BackendAPI = {
    /**
     * Start a test session on the backend
     */
    async startTest(userId, language, testType, age, educationLevel) {
        try {
            const response = await fetch(`${API_BASE}/test/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    language: language,
                    test_type: testType,
                    age: age,
                    education_level: educationLevel
                })
            });
            return await response.json();
        } catch (err) {
            console.warn('Backend not available, using frontend-only mode:', err.message);
            return null;
        }
    },

    /**
     * Get next question from backend
     */
    async getQuestion(sessionId) {
        try {
            const response = await fetch(`${API_BASE}/test/question?session_id=${sessionId}`);
            return await response.json();
        } catch (err) {
            console.warn('Backend not available:', err.message);
            return null;
        }
    },

    /**
     * Submit answer with transcript to backend for fuzzy matching
     */
    async submitAnswer(sessionId, transcript, responseTime) {
        try {
            const response = await fetch(`${API_BASE}/test/answer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: sessionId,
                    transcript: transcript,
                    response_time: responseTime
                })
            });
            return await response.json();
        } catch (err) {
            console.warn('Backend not available:', err.message);
            return null;
        }
    },

    /**
     * Get risk classification from backend
     */
    async classifyRisk(scores, age, educationLevel) {
        try {
            const response = await fetch(`${API_BASE}/test/risk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scores: scores,
                    age: age,
                    education_level: educationLevel
                })
            });
            return await response.json();
        } catch (err) {
            console.warn('Backend not available:', err.message);
            return null;
        }
    },

    /**
     * Standalone fuzzy matching
     */
    async fuzzyMatch(transcript, options, threshold = 60) {
        try {
            const response = await fetch(`${API_BASE}/test/match`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transcript: transcript,
                    options: options,
                    threshold: threshold
                })
            });
            return await response.json();
        } catch (err) {
            console.warn('Backend not available, using frontend fuzzy match:', err.message);
            return frontendFuzzyMatch(transcript, options, threshold);
        }
    }
};


// ============================================================
// FRONTEND FALLBACK FUZZY MATCHING
// ============================================================

/**
 * Levenshtein distance for fuzzy matching (frontend fallback)
 */
function levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

/**
 * Frontend fuzzy matching fallback
 */
function frontendFuzzyMatch(transcript, options, threshold = 60) {
    if (!transcript || !options || !options.length) {
        return { matched_option: null, confidence: 0, original_transcript: transcript };
    }

    // Strip only punctuation (commas, periods, etc.) — NOT \w which kills non-ASCII scripts
    const normalise = (s) => s.trim().toLowerCase().replace(/[,\.!?;:"'()\[\]{}]+/g, '').trim();

    const cleaned = normalise(transcript);
    const lowerOptions = options.map(o => normalise(o));

    // 1. Exact full match
    const exactIdx = lowerOptions.indexOf(cleaned);
    if (exactIdx !== -1) {
        return { matched_option: options[exactIdx], confidence: 100, original_transcript: transcript };
    }

    // 2. For single-word options: check if the option word appears inside the transcript
    const transcriptWords = cleaned.split(/[\s,]+/).filter(Boolean);
    for (let i = 0; i < lowerOptions.length; i++) {
        const opt = lowerOptions[i];
        if (!opt) continue;

        // Check exact word-in-transcript match
        if (transcriptWords.includes(opt)) {
            return { matched_option: options[i], confidence: 100, original_transcript: transcript };
        }

        // 2b. Symbol name matching: If the option is a symbol, check if its name is in transcript
        if (SYMBOL_MAP[opt]) {
            const names = SYMBOL_MAP[opt];
            if (names.some(name => cleaned.includes(name.toLowerCase()))) {
                return { matched_option: options[i], confidence: 100, original_transcript: transcript };
            }
        }
    }

    // 3. Fuzzy (Levenshtein) against each option
    let bestMatch = null;
    let bestScore = 0;

    for (let i = 0; i < lowerOptions.length; i++) {
        const opt = lowerOptions[i];
        if (!opt) continue;

        // Try matching against the full transcript AND each individual word in it
        const candidates = [cleaned, ...transcriptWords];
        for (const candidate of candidates) {
            const maxLen = Math.max(candidate.length, opt.length);
            if (maxLen === 0) continue;
            const dist = levenshteinDistance(candidate, opt);
            const score = Math.round((1 - dist / maxLen) * 100);
            if (score > bestScore) {
                bestScore = score;
                bestMatch = options[i];
            }
        }
    }

    if (bestScore >= threshold) {
        return { matched_option: bestMatch, confidence: bestScore, original_transcript: transcript };
    }

    return { matched_option: null, confidence: bestScore, original_transcript: transcript };
}


// ============================================================
// SINGLETON INSTANCES
// ============================================================

const ttsEngine = new TTSEngine();
const sttEngine = new STTEngine();
const audioRecorder = new AudioRecorder();

export {
    ttsEngine,
    sttEngine,
    audioRecorder,
    BackendAPI,
    frontendFuzzyMatch,
    LANG_MAP
};
