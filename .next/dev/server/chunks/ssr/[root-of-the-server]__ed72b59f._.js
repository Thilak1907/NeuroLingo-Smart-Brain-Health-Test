module.exports = [
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/services/voiceService.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BackendAPI",
    ()=>BackendAPI,
    "LANG_MAP",
    ()=>LANG_MAP,
    "audioRecorder",
    ()=>audioRecorder,
    "frontendFuzzyMatch",
    ()=>frontendFuzzyMatch,
    "sttEngine",
    ()=>sttEngine,
    "ttsEngine",
    ()=>ttsEngine
]);
/**
 * NeuroLingo Voice Service
 * ========================
 * Handles Text-to-Speech (TTS) and Speech-to-Text (STT) 
 * using browser Web Speech API with fallback support.
 * 
 * In production, this would connect to:
 *   - Coqui XTTS for TTS
 *   - Whisper-small for STT
 */ const API_BASE = ("TURBOPACK compile-time value", "http://localhost:5000/api") || 'http://localhost:5000/api';
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
    '●': [
        'circle',
        'dot',
        'fill circle',
        'filled circle',
        'சக்கரம்',
        'வட்டம்',
        'गोला',
        'वृत्त',
        'వృత్తం'
    ],
    '▲': [
        'triangle',
        'delta',
        'முக்கோணம்',
        'त्रिकोण',
        'త్రిభుజం'
    ],
    '■': [
        'square',
        'box',
        'rectangle',
        'சதுரம்',
        'वर्ग',
        'చతురస్రం'
    ],
    '★': [
        'star',
        'நட்சத்திரம்',
        'सितारा',
        'तारा',
        'నక్షత్రం'
    ],
    '◆': [
        'diamond',
        'rhombus',
        'வைரம்',
        'हीरा',
        'వజ్రం'
    ],
    '◯': [
        'circle',
        'empty circle',
        'வட்டம்',
        'वृत्त',
        'వృత్తం'
    ],
    '△': [
        'triangle',
        'முக்கோணம்',
        'त्रिकोण',
        'త్రిభుజం'
    ],
    '□': [
        'square',
        'சதுரம்',
        'वर्ग',
        'చతురస్రం'
    ],
    '🔴': [
        'red',
        'red circle',
        'சிவப்பு',
        'लाल',
        'ఎరుపు'
    ],
    '🔵': [
        'blue',
        'blue circle',
        'நீலம்',
        'नीला',
        'నీలం'
    ]
};
// ============================================================
// TEXT-TO-SPEECH (TTS)
// ============================================================
class TTSEngine {
    constructor(){
        this.synth = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
        this.currentUtterance = null;
        this.voiceCache = {};
        this.isReady = false;
        // Load voices
        if (this.synth) {
            this._loadVoices();
            if (this.synth.onvoiceschanged !== undefined) {
                this.synth.onvoiceschanged = ()=>this._loadVoices();
            }
        }
    }
    _loadVoices() {
        if (!this.synth) return;
        const voices = this.synth.getVoices();
        voices.forEach((voice)=>{
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
     */ _getBestVoice(langCode) {
        const fullLang = LANG_MAP[langCode] || langCode;
        const shortLang = langCode;
        // Try to find exact match first
        const allVoices = this.synth.getVoices();
        let bestVoice = allVoices.find((v)=>v.lang === fullLang);
        if (!bestVoice) {
            bestVoice = allVoices.find((v)=>v.lang.startsWith(shortLang));
        }
        if (!bestVoice) {
            bestVoice = allVoices.find((v)=>v.lang.startsWith('en'));
        }
        return bestVoice;
    }
    /**
     * Speak text in the specified language
     * @param {string} text - Text to speak
     * @param {string} language - Language code (en, ta, hi, te, bn)
     * @param {Object} options - Optional settings
     * @returns {Promise} resolves when speech is complete
     */ speak(text, language = 'en', options = {}) {
        return new Promise((resolve, reject)=>{
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
            audio.onended = ()=>{
                if (this.currentAudio === audio) this.currentAudio = null;
                resolve();
            };
            const tryGoogleTTS = ()=>{
                console.warn('Backend TTS failed, trying direct Google TTS as fallback');
                const ttsLang = language.substring(0, 2);
                const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${ttsLang}&client=tw-ob`;
                const fallbackAudio = new Audio(googleUrl);
                this.currentAudio = fallbackAudio;
                fallbackAudio.onended = ()=>{
                    if (this.currentAudio === fallbackAudio) this.currentAudio = null;
                    resolve();
                };
                fallbackAudio.onerror = ()=>{
                    console.warn('Google TTS fallback failed, trying Browser TTS');
                    if (this.currentAudio === fallbackAudio) this.currentAudio = null;
                    const utterance = new SpeechSynthesisUtterance(cleanText);
                    utterance.lang = LANG_MAP[language] || language;
                    utterance.rate = options.rate || 0.9;
                    utterance.pitch = options.pitch || 1.0;
                    utterance.volume = options.volume || 1.0;
                    const voice = this._getBestVoice(language);
                    if (voice) utterance.voice = voice;
                    utterance.onend = ()=>{
                        this.currentUtterance = null;
                        resolve();
                    };
                    utterance.onerror = (event)=>{
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
                fallbackAudio.play().catch(()=>fallbackAudio.onerror());
            };
            audio.onerror = tryGoogleTTS;
            // ⚠️ Fix: capture local ref so .catch handler is safe even if stop() nulls currentAudio
            audio.play().catch(()=>{
                if (this.currentAudio === audio) {
                    tryGoogleTTS();
                }
            // else stop() was called — already cleaned up, do nothing
            });
        });
    }
    /**
     * Stop current speech
     */ stop() {
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
     */ isSpeaking() {
        return this.synth.speaking || this.currentAudio && !this.currentAudio.paused;
    }
    /**
     * Check if TTS is available
     */ isAvailable() {
        return true; // we now use backend TTS mainly
    }
    /**
     * Get available languages for TTS
     */ getAvailableLanguages() {
        const voices = this.synth.getVoices();
        const langs = new Set();
        voices.forEach((v)=>langs.add(v.lang));
        return Array.from(langs);
    }
}
// ============================================================
// SPEECH-TO-TEXT (STT)
// ============================================================
class STTEngine {
    constructor(){
        this.SpeechRecognition = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
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
        return !!this.SpeechRecognition;
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
     */ startListening(language = 'en', options = {}) {
        return this._startDual(language, options);
    }
    // ─────────────────────────────────────────────────────────────────────────
    // Core: dual-engine listener
    // ─────────────────────────────────────────────────────────────────────────
    _startDual(language, options) {
        return new Promise(async (resolve, reject)=>{
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
            const resolveOnce = (result)=>{
                if (resolved) return;
                resolved = true;
                this.isListening = false;
                this.transcript = result;
                if (this.onResult && result) this.onResult(result, result);
                if (this.onEnd) this.onEnd(result);
                resolve(result);
            };
            this.recognition.onresult = (event)=>{
                let finalText = '';
                let interimText = '';
                for(let i = event.resultIndex; i < event.results.length; i++){
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
            this.recognition.onerror = (event)=>{
                if (event.error !== 'no-speech' && event.error !== 'aborted') {
                    console.warn('[Web Speech] error:', event.error);
                }
            // Don't reject — let onend handle resolution
            };
            this.recognition.onend = async ()=>{
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
                const best = whisperText && whisperText.length > 0 ? whisperText : webSpeechTranscript;
                console.log(`[STT] WebSpeech="${webSpeechTranscript}" Whisper="${whisperText}" → using "${best}"`);
                resolveOnce(best);
            };
            this.recognition.onstart = ()=>{
                this.isListening = true;
            };
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
                    this.stream = await navigator.mediaDevices.getUserMedia({
                        audio: true
                    });
                    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
                    this.mediaRecorder = new MediaRecorder(this.stream, {
                        mimeType
                    });
                    this.mediaRecorder.ondataavailable = (e)=>{
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
            try {
                this.recognition.stop();
            } catch (e) {}
            this.recognition = null;
        }
    }
    _stopRecorder() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            try {
                this.mediaRecorder.stop();
            } catch (e) {}
        }
        this.mediaRecorder = null;
        if (this.stream) {
            this.stream.getTracks().forEach((t)=>t.stop());
            this.stream = null;
        }
        this.audioChunks = [];
    }
    async _tryWhisper(language) {
        // Stop the recorder to finalise chunks
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            await new Promise((res)=>{
                this.mediaRecorder.onstop = res;
                try {
                    this.mediaRecorder.stop();
                } catch (e) {
                    res();
                }
            });
        }
        if (this.stream) {
            this.stream.getTracks().forEach((t)=>t.stop());
            this.stream = null;
        }
        if (this.audioChunks.length === 0) return '';
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const blob = new Blob(this.audioChunks, {
            type: mimeType
        });
        this.audioChunks = [];
        const formData = new FormData();
        formData.append('audio', blob, `stt.${mimeType.includes('mp4') ? 'mp4' : 'webm'}`);
        formData.append('language', language);
        try {
            const controller = new AbortController();
            const timeout = setTimeout(()=>controller.abort(), 15000); // 15 s max
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
            try {
                this.recognition.abort();
            } catch (e) {}
            this.recognition = null;
        }
        this._stopRecorder();
        this._stopRequested = true;
        this.isListening = false;
    }
    getTranscript() {
        return this.transcript;
    }
    getInterimTranscript() {
        return this.interimTranscript;
    }
}
// ============================================================
// AUDIO RECORDER (for sending audio to backend Whisper)
// ============================================================
class AudioRecorder {
    constructor(){
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.stream = null;
        this.isRecording = false;
    }
    /**
     * Start recording audio
     * @returns {Promise<void>}
     */ async startRecording() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });
            this.mediaRecorder = new MediaRecorder(this.stream, {
                mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
            });
            this.audioChunks = [];
            this.mediaRecorder.ondataavailable = (event)=>{
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
     */ stopRecording() {
        return new Promise((resolve)=>{
            if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
                resolve(null);
                return;
            }
            this.mediaRecorder.onstop = ()=>{
                const blob = new Blob(this.audioChunks, {
                    type: 'audio/webm'
                });
                this.audioChunks = [];
                this.isRecording = false;
                // Stop all tracks
                if (this.stream) {
                    this.stream.getTracks().forEach((track)=>track.stop());
                    this.stream = null;
                }
                resolve(blob);
            };
            this.mediaRecorder.stop();
        });
    }
    /**
     * Cancel recording
     */ cancelRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }
        this.audioChunks = [];
        this.isRecording = false;
        if (this.stream) {
            this.stream.getTracks().forEach((track)=>track.stop());
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
     */ async startTest (userId, language, testType, age, educationLevel) {
        try {
            const response = await fetch(`${API_BASE}/test/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
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
     */ async getQuestion (sessionId) {
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
     */ async submitAnswer (sessionId, transcript, responseTime) {
        try {
            const response = await fetch(`${API_BASE}/test/answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
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
     */ async classifyRisk (scores, age, educationLevel) {
        try {
            const response = await fetch(`${API_BASE}/test/risk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
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
     */ async fuzzyMatch (transcript, options, threshold = 60) {
        try {
            const response = await fetch(`${API_BASE}/test/match`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
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
 */ function levenshteinDistance(a, b) {
    const matrix = [];
    for(let i = 0; i <= b.length; i++){
        matrix[i] = [
            i
        ];
    }
    for(let j = 0; j <= a.length; j++){
        matrix[0][j] = j;
    }
    for(let i = 1; i <= b.length; i++){
        for(let j = 1; j <= a.length; j++){
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
            }
        }
    }
    return matrix[b.length][a.length];
}
/**
 * Frontend fuzzy matching fallback
 */ function frontendFuzzyMatch(transcript, options, threshold = 60) {
    if (!transcript || !options || !options.length) {
        return {
            matched_option: null,
            confidence: 0,
            original_transcript: transcript
        };
    }
    // Strip only punctuation (commas, periods, etc.) — NOT \w which kills non-ASCII scripts
    const normalise = (s)=>s.trim().toLowerCase().replace(/[,\.!?;:"'()\[\]{}]+/g, '').trim();
    const cleaned = normalise(transcript);
    const lowerOptions = options.map((o)=>normalise(o));
    // 1. Exact full match
    const exactIdx = lowerOptions.indexOf(cleaned);
    if (exactIdx !== -1) {
        return {
            matched_option: options[exactIdx],
            confidence: 100,
            original_transcript: transcript
        };
    }
    // 2. For single-word options: check if the option word appears inside the transcript
    const transcriptWords = cleaned.split(/[\s,]+/).filter(Boolean);
    for(let i = 0; i < lowerOptions.length; i++){
        const opt = lowerOptions[i];
        if (!opt) continue;
        // Check exact word-in-transcript match
        if (transcriptWords.includes(opt)) {
            return {
                matched_option: options[i],
                confidence: 100,
                original_transcript: transcript
            };
        }
        // 2b. Symbol name matching: If the option is a symbol, check if its name is in transcript
        if (SYMBOL_MAP[opt]) {
            const names = SYMBOL_MAP[opt];
            if (names.some((name)=>cleaned.includes(name.toLowerCase()))) {
                return {
                    matched_option: options[i],
                    confidence: 100,
                    original_transcript: transcript
                };
            }
        }
    }
    // 3. Fuzzy (Levenshtein) against each option
    let bestMatch = null;
    let bestScore = 0;
    for(let i = 0; i < lowerOptions.length; i++){
        const opt = lowerOptions[i];
        if (!opt) continue;
        // Try matching against the full transcript AND each individual word in it
        const candidates = [
            cleaned,
            ...transcriptWords
        ];
        for (const candidate of candidates){
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
        return {
            matched_option: bestMatch,
            confidence: bestScore,
            original_transcript: transcript
        };
    }
    return {
        matched_option: null,
        confidence: bestScore,
        original_transcript: transcript
    };
}
// ============================================================
// SINGLETON INSTANCES
// ============================================================
const ttsEngine = new TTSEngine();
const sttEngine = new STTEngine();
const audioRecorder = new AudioRecorder();
;
}),
"[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$contexts$2f$LanguageContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/contexts/LanguageContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$contexts$2f$UserContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/contexts/UserContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/services/voiceService.js [app-ssr] (ecmascript)");
/**
 * VoiceTestContainer - Voice-Enabled Brain Health Test Flow
 * =========================================================
 * Full system flow with voice input/output:
 * 1. User selects language + test type
 * 2. Questions are fetched (from backend or template data)
 * 3. Questions are read aloud via TTS
 * 4. User speaks answers via STT
 * 5. Fuzzy matching processes the transcript
 * 6. Scoring engine calculates domain scores
 * 7. Risk classification outputs results
 */ "use client";
;
;
;
;
;
;
;
// Template questions (fallback when backend is not available)
const TEMPLATE_QUESTIONS = {
    memory: {
        en: [
            {
                id: 'mem_en_1',
                type: 'recall',
                question: 'Please remember these three words: Apple, Chair, River',
                words_to_remember: [
                    'apple',
                    'chair',
                    'river'
                ],
                options: [
                    'apple',
                    'chair',
                    'river',
                    'table',
                    'mountain',
                    'pencil'
                ],
                response_format: 'voice_recall'
            },
            {
                id: 'mem_en_2',
                type: 'recall',
                question: 'Now recall the words you were asked to remember. Say each word clearly.',
                words_to_remember: [
                    'apple',
                    'chair',
                    'river'
                ],
                options: [
                    'apple',
                    'chair',
                    'river',
                    'table',
                    'mountain',
                    'pencil'
                ],
                response_format: 'voice_recall',
                is_recall_phase: true
            },
            {
                id: 'mem_en_3',
                type: 'sequence',
                question: 'Repeat these numbers in order: 7, 3, 9',
                correct_sequence: [
                    '7',
                    '3',
                    '9'
                ],
                options: [
                    '7',
                    '3',
                    '9',
                    '2',
                    '8',
                    '4'
                ],
                response_format: 'voice_sequence'
            }
        ],
        ta: [
            {
                id: 'mem_ta_1',
                type: 'recall',
                question: 'இந்த மூன்று வார்த்தைகளை நினைவில் வையுங்கள்: ஆப்பிள், நாற்காலி, நதி',
                words_to_remember: [
                    'ஆப்பிள்',
                    'நாற்காலி',
                    'நதி'
                ],
                options: [
                    'ஆப்பிள்',
                    'நாற்காலி',
                    'நதி',
                    'மேசை',
                    'மலை',
                    'பென்சில்'
                ],
                response_format: 'voice_recall'
            }
        ],
        hi: [
            {
                id: 'mem_hi_1',
                type: 'recall',
                question: 'इन तीन शब्दों को याद रखें: सेब, कुर्सी, नदी',
                words_to_remember: [
                    'सेब',
                    'कुर्सी',
                    'नदी'
                ],
                options: [
                    'सेब',
                    'कुर्सी',
                    'नदी',
                    'मेज़',
                    'पहाड़',
                    'पेंसिल'
                ],
                response_format: 'voice_recall'
            }
        ],
        te: [
            {
                id: 'mem_te_1',
                type: 'recall',
                question: 'ఈ మూడు పదాలను గుర్తుంచుకోండి: ఆపిల్, కుర్చీ, నది',
                words_to_remember: [
                    'ఆపిల్',
                    'కుర్చీ',
                    'నది'
                ],
                options: [
                    'ఆపిల్',
                    'కుర్చీ',
                    'నది',
                    'బల్ల',
                    'పర్వతం',
                    'పెన్సిల్'
                ],
                response_format: 'voice_recall'
            }
        ]
    },
    attention: {
        en: [
            {
                id: 'att_en_1',
                type: 'stroop',
                question: 'What COLOR is this word displayed in? The word BLUE is shown in RED color.',
                display_word: 'BLUE',
                display_color: 'red',
                correct_answer: 'red',
                options: [
                    'red',
                    'blue',
                    'green',
                    'yellow'
                ],
                response_format: 'voice_select'
            },
            {
                id: 'att_en_2',
                type: 'stroop',
                question: 'What COLOR is this word displayed in? The word GREEN is shown in YELLOW color.',
                display_word: 'GREEN',
                display_color: 'yellow',
                correct_answer: 'yellow',
                options: [
                    'green',
                    'yellow',
                    'red',
                    'blue'
                ],
                response_format: 'voice_select'
            },
            {
                id: 'att_en_3',
                type: 'counting',
                question: 'Count backwards from 10 to 1 as fast as you can.',
                correct_answer: '10 9 8 7 6 5 4 3 2 1',
                options: [],
                response_format: 'voice_free'
            }
        ],
        ta: [
            {
                id: 'att_ta_1',
                type: 'stroop',
                question: 'இந்த வார்த்தை எந்த நிறத்தில் காட்டப்பட்டுள்ளது? நீலம் சிவப்பு நிறத்தில்.',
                display_word: 'நீலம்',
                display_color: 'red',
                correct_answer: 'சிவப்பு',
                options: [
                    'சிவப்பு',
                    'நீலம்',
                    'பச்சை',
                    'மஞ்சள்'
                ],
                response_format: 'voice_select'
            }
        ],
        hi: [
            {
                id: 'att_hi_1',
                type: 'stroop',
                question: 'यह शब्द किस रंग में दिखाया गया है? नीला शब्द लाल रंग में.',
                display_word: 'नीला',
                display_color: 'red',
                correct_answer: 'लाल',
                options: [
                    'लाल',
                    'नीला',
                    'हरा',
                    'पीला'
                ],
                response_format: 'voice_select'
            }
        ],
        te: [
            {
                id: 'att_te_1',
                type: 'stroop',
                question: 'ఈ పదం ఏ రంగులో చూపబడింది? నీలం ఎరుపు రంగులో.',
                display_word: 'నీలం',
                display_color: 'red',
                correct_answer: 'ఎరుపు',
                options: [
                    'ఎరుపు',
                    'నీలం',
                    'ఆకుపచ్చ',
                    'పసుపు'
                ],
                response_format: 'voice_select'
            }
        ]
    },
    language: {
        en: [
            {
                id: 'lang_en_1',
                type: 'naming',
                question: 'What is this object? It is a common yellow fruit, curved in shape.',
                correct_answer: 'banana',
                options: [
                    'banana',
                    'apple',
                    'orange',
                    'grape'
                ],
                response_format: 'voice_select'
            },
            {
                id: 'lang_en_2',
                type: 'comprehension',
                question: 'The cat sat on the mat. Where did the cat sit?',
                correct_answer: 'mat',
                options: [
                    'mat',
                    'chair',
                    'table',
                    'floor'
                ],
                response_format: 'voice_select'
            },
            {
                id: 'lang_en_3',
                type: 'fluency',
                question: 'Name as many animals as you can.',
                expected_keywords: [
                    'dog',
                    'cat',
                    'bird',
                    'fish',
                    'lion',
                    'tiger',
                    'elephant',
                    'horse',
                    'cow',
                    'sheep',
                    'rabbit',
                    'snake',
                    'monkey',
                    'bear',
                    'deer'
                ],
                options: [],
                response_format: 'voice_free'
            }
        ],
        ta: [
            {
                id: 'lang_ta_1',
                type: 'naming',
                question: 'இது என்ன பொருள்? இது ஒரு பொதுவான மஞ்சள் பழம்.',
                correct_answer: 'வாழைப்பழம்',
                options: [
                    'வாழைப்பழம்',
                    'ஆப்பிள்',
                    'ஆரஞ்சு',
                    'திராட்சை'
                ],
                response_format: 'voice_select'
            }
        ],
        hi: [
            {
                id: 'lang_hi_1',
                type: 'naming',
                question: 'यह क्या वस्तु है? यह एक आम पीला फल है.',
                correct_answer: 'केला',
                options: [
                    'केला',
                    'सेब',
                    'संतरा',
                    'अंगूर'
                ],
                response_format: 'voice_select'
            }
        ],
        te: [
            {
                id: 'lang_te_1',
                type: 'naming',
                question: 'ఈ వస్తువు ఏమిటి? ఇది ఒక సాధారణ పసుపు పండు.',
                correct_answer: 'అరటి',
                options: [
                    'అరటి',
                    'ఆపిల్',
                    'నారింజ',
                    'ద్రాక్ష'
                ],
                response_format: 'voice_select'
            }
        ]
    },
    visuospatial: {
        en: [
            {
                id: 'vis_en_1',
                type: 'pattern',
                question: 'What comes next in this pattern? Triangle, Square, Circle, Triangle, Square, ?',
                correct_answer: 'circle',
                options: [
                    'circle',
                    'triangle',
                    'square',
                    'star'
                ],
                display_pattern: [
                    '▲',
                    '■',
                    '●',
                    '▲',
                    '■',
                    '?'
                ],
                response_format: 'voice_select'
            },
            {
                id: 'vis_en_2',
                type: 'spatial',
                question: 'If you fold a square paper diagonally, what shape do you get?',
                correct_answer: 'triangle',
                options: [
                    'triangle',
                    'rectangle',
                    'circle',
                    'pentagon'
                ],
                response_format: 'voice_select'
            }
        ],
        ta: [
            {
                id: 'vis_ta_1',
                type: 'pattern',
                question: 'இந்த முறையில் அடுத்தது என்ன? முக்கோணம், சதுரம், வட்டம், முக்கோணம், சதுரம், ?',
                correct_answer: 'வட்டம்',
                options: [
                    'வட்டம்',
                    'முக்கோணம்',
                    'சதுரம்',
                    'நட்சத்திரம்'
                ],
                display_pattern: [
                    '▲',
                    '■',
                    '●',
                    '▲',
                    '■',
                    '?'
                ],
                response_format: 'voice_select'
            }
        ],
        hi: [
            {
                id: 'vis_hi_1',
                type: 'pattern',
                question: 'इस पैटर्न में आगे क्या आता है? त्रिकोण, वर्ग, वृत्त, त्रिकोण, वर्ग, ?',
                correct_answer: 'वृत्त',
                options: [
                    'वृत्त',
                    'त्रिकोण',
                    'वर्ग',
                    'तारा'
                ],
                display_pattern: [
                    '▲',
                    '■',
                    '●',
                    '▲',
                    '■',
                    '?'
                ],
                response_format: 'voice_select'
            }
        ],
        te: [
            {
                id: 'vis_te_1',
                type: 'pattern',
                question: 'ఈ నమూనాలో తదుపరి ఏమిటి? త్రికోణం, చతురస్రం, వృత్తం, త్రికోణం, చతురస్రం, ?',
                correct_answer: 'వృత్తం',
                options: [
                    'వృత్తం',
                    'త్రికోణం',
                    'చతురస్రం',
                    'నక్షత్రం'
                ],
                display_pattern: [
                    '▲',
                    '■',
                    '●',
                    '▲',
                    '■',
                    '?'
                ],
                response_format: 'voice_select'
            }
        ]
    }
};
// Test type labels for display
const TEST_TYPE_LABELS = {
    en: {
        memory: 'Memory Test',
        attention: 'Attention Test',
        language: 'Language Test',
        visuospatial: 'Visuospatial Test'
    },
    ta: {
        memory: 'நினைவாற்றல் சோதனை',
        attention: 'கவனச் சோதனை',
        language: 'மொழி சோதனை',
        visuospatial: 'பார்வை-இட சோதனை'
    },
    hi: {
        memory: 'स्मृति परीक्षण',
        attention: 'ध्यान परीक्षण',
        language: 'भाषा परीक्षण',
        visuospatial: 'दृश्य-स्थानिक परीक्षण'
    },
    te: {
        memory: 'జ్ఞాపకశక్తి పరీక్ష',
        attention: 'శ్రద్ధ పరీక్ష',
        language: 'భాష పరీక్ష',
        visuospatial: 'దృశ్య-ప్రాంతీయ పరీక్ష'
    }
};
function VoiceTestContainer() {
    const { language, t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$contexts$2f$LanguageContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LanguageContext"]);
    const { user, setTestResults } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$contexts$2f$UserContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserContext"]);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    // Flow state
    const [phase, setPhase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('select'); // select, testing, scoring, results
    const [selectedTestType, setSelectedTestType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedLanguage, setSelectedLanguage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(language);
    // Test state
    const [questions, setQuestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [sessionId, setSessionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [answers, setAnswers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [questionStartTime, setQuestionStartTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Voice state
    const [isSpeaking, setIsSpeaking] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isListening, setIsListening] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isProcessing, setIsProcessing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false); // Whisper STT upload in progress
    const [transcript, setTranscript] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [interimTranscript, setInterimTranscript] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [matchResult, setMatchResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [voiceSupported, setVoiceSupported] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        tts: false,
        stt: false
    });
    // Results state
    const [domainScores, setDomainScores] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [riskResult, setRiskResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [allTestResults, setAllTestResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [completedTests, setCompletedTests] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    // UI state
    const [feedback, setFeedback] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showOptions, setShowOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [backendAvailable, setBackendAvailable] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const answeredRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Check voice support
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setVoiceSupported({
            tts: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ttsEngine"].isAvailable(),
            stt: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sttEngine"].isAvailable()
        });
    }, []);
    // Check backend availability
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const checkBackend = async ()=>{
            try {
                const response = await fetch('http://localhost:5000/api/health');
                if (response.ok) {
                    setBackendAvailable(true);
                }
            } catch (e) {
                setBackendAvailable(false);
            }
        };
        checkBackend();
    }, []);
    // ============================================================
    // TEST FLOW: Start a specific test
    // ============================================================
    const startTest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (testType)=>{
        setSelectedTestType(testType);
        setPhase('testing');
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setTranscript('');
        setMatchResult(null);
        setFeedback(null);
        let fetchedQuestions = null;
        // Try backend first
        if (backendAvailable) {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BackendAPI"].startTest(user?.id || 'guest', selectedLanguage, testType, user?.age, user?.educationLevel);
            if (result && result.session_id) {
                setSessionId(result.session_id);
                // Fetch questions from backend
                const qResult = await fetch(`http://localhost:5000/api/questions?test_type=${testType}&language=${selectedLanguage}`);
                const qData = await qResult.json();
                if (qData.questions && qData.questions.length > 0) {
                    fetchedQuestions = qData.questions;
                }
            }
        }
        // Fallback to template questions
        if (!fetchedQuestions) {
            const testData = TEMPLATE_QUESTIONS[testType] || {};
            fetchedQuestions = testData[selectedLanguage] || testData['en'] || [];
        }
        setQuestions(fetchedQuestions);
        setQuestionStartTime(Date.now());
    }, [
        backendAvailable,
        selectedLanguage,
        user
    ]);
    // ============================================================
    // VOICE: Read question aloud
    // ============================================================
    const readQuestionAloud = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (questionText)=>{
        if (!voiceSupported.tts) return;
        setIsSpeaking(true);
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ttsEngine"].speak(questionText, selectedLanguage, {
                rate: 0.85
            });
        } catch (err) {
            console.warn('TTS failed:', err);
        }
        setIsSpeaking(false);
    }, [
        voiceSupported.tts,
        selectedLanguage
    ]);
    // Auto-read question when it changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (phase === 'testing' && questions.length > 0 && currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            answeredRef.current = false;
            setTranscript('');
            setInterimTranscript('');
            setMatchResult(null);
            setFeedback(null);
            setShowOptions(false);
            setIsProcessing(false);
            setQuestionStartTime(Date.now());
            // Read question aloud after a short delay
            const timer = setTimeout(()=>{
                readQuestionAloud(question.question);
                // Show options after TTS finishes (or after delay)
                setTimeout(()=>setShowOptions(true), 1000);
            }, 500);
            return ()=>clearTimeout(timer);
        }
    }, [
        phase,
        currentQuestionIndex,
        questions,
        readQuestionAloud
    ]);
    // ============================================================
    // ANSWER PROCESSING: Fuzzy matching + scoring
    // (Defined BEFORE startListening since it's a dependency)
    // ============================================================
    const processAnswer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (spokenText)=>{
        if (answeredRef.current) return;
        answeredRef.current = true;
        const question = questions[currentQuestionIndex];
        if (!question) return;
        const responseTime = (Date.now() - questionStartTime) / 1000;
        let isCorrect = false;
        let matchedOption = null;
        let confidence = 0;
        // Process based on response format
        if (question.response_format === 'voice_recall') {
            // Multi-word recall matching
            const wordsToCheck = question.words_to_remember || [];
            const options = question.options || wordsToCheck;
            if (backendAvailable && sessionId) {
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BackendAPI"].submitAnswer(sessionId, spokenText, responseTime);
                if (result) {
                    matchedOption = result.answer_result?.matched;
                    isCorrect = result.answer_result?.is_correct;
                    confidence = result.answer_result?.confidence || 0;
                }
            } else {
                // Frontend fallback for voice_recall
                // Pass the FULL spoken transcript to frontendFuzzyMatch for each expected word.
                // This handles "ஆப்பிள் நாற்காலி நதி" matching all three individual words.
                const wordsToFind = wordsToCheck.length > 0 ? wordsToCheck : options;
                const matched = [];
                for (const expectedWord of wordsToFind){
                    // Check if this expected word is contained in the spoken transcript
                    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["frontendFuzzyMatch"])(spokenText, [
                        expectedWord
                    ]);
                    if (result.matched_option && result.confidence >= 50) {
                        matched.push(expectedWord);
                    }
                }
                matchedOption = matched;
                const correctWords = wordsToCheck.map((w)=>w.toLowerCase());
                const correctCount = matched.filter((m)=>correctWords.includes(m.toLowerCase())).length;
                isCorrect = correctCount > 0;
                confidence = correctWords.length > 0 ? Math.round(correctCount / correctWords.length * 100) : 0;
            }
        } else if (question.response_format === 'voice_select') {
            // Single option matching
            const options = question.options || [];
            if (backendAvailable && sessionId) {
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BackendAPI"].submitAnswer(sessionId, spokenText, responseTime);
                if (result) {
                    matchedOption = result.answer_result?.matched;
                    isCorrect = result.answer_result?.is_correct;
                    confidence = result.answer_result?.confidence || 0;
                }
            } else {
                const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["frontendFuzzyMatch"])(spokenText, options);
                matchedOption = result.matched_option;
                confidence = result.confidence;
                isCorrect = matchedOption && matchedOption.toLowerCase() === (question.correct_answer || '').toLowerCase();
            }
        } else if (question.response_format === 'voice_free') {
            // Free-form matching
            const expected = question.expected_keywords || [];
            if (expected.length > 0) {
                const words = spokenText.toLowerCase().split(/[\s,]+/);
                const matched = [];
                for (const word of words){
                    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["frontendFuzzyMatch"])(word, expected);
                    if (result.matched_option && result.confidence >= 50) {
                        matched.push(result.matched_option);
                    }
                }
                matchedOption = matched;
                isCorrect = matched.length > 0;
                confidence = Math.min(100, matched.length * 10);
            } else {
                // Compare with correct_answer
                const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["frontendFuzzyMatch"])(spokenText, [
                    question.correct_answer || ''
                ]);
                matchedOption = result.matched_option;
                isCorrect = result.confidence >= 60;
                confidence = result.confidence;
            }
        } else if (question.response_format === 'voice_sequence') {
            // Sequence matching
            const spokenNumbers = spokenText.replace(/[^\d\s]/g, '').split(/\s+/).filter(Boolean);
            const correctSeq = question.correct_sequence || [];
            let matchCount = 0;
            for(let i = 0; i < Math.min(spokenNumbers.length, correctSeq.length); i++){
                if (spokenNumbers[i] === correctSeq[i]) matchCount++;
            }
            matchedOption = spokenNumbers.join(', ');
            isCorrect = matchCount === correctSeq.length;
            confidence = correctSeq.length > 0 ? Math.round(matchCount / correctSeq.length * 100) : 0;
        }
        // Store the match result
        const result = {
            matched_option: matchedOption,
            confidence,
            is_correct: isCorrect,
            original_transcript: spokenText
        };
        setMatchResult(result);
        // Record the answer
        const answerRecord = {
            question_id: question.id,
            question_index: currentQuestionIndex,
            transcript: spokenText,
            matched: matchedOption,
            is_correct: isCorrect,
            confidence,
            response_time: responseTime,
            keyword_count: Array.isArray(matchedOption) ? matchedOption.length : matchedOption ? 1 : 0
        };
        setAnswers((prev)=>[
                ...prev,
                answerRecord
            ]);
        // Show feedback
        setFeedback({
            isCorrect,
            message: isCorrect ? selectedLanguage === 'ta' ? 'சரி! ✓' : selectedLanguage === 'hi' ? 'सही! ✓' : selectedLanguage === 'te' ? 'సరైనది! ✓' : 'Correct! ✓' : selectedLanguage === 'ta' ? 'தவறு ✗' : selectedLanguage === 'hi' ? 'गलत ✗' : selectedLanguage === 'te' ? 'తప్పు ✗' : 'Incorrect ✗',
            correctAnswer: question.correct_answer || (question.words_to_remember || []).join(', '),
            matched: matchedOption
        });
        // Read feedback aloud — in the selected language
        if (voiceSupported.tts) {
            const correctAnswer = question.correct_answer || (question.words_to_remember || []).join(', ');
            const feedbackText = isCorrect ? ({
                ta: 'சரி!',
                hi: 'सही!',
                te: 'సరైనది!',
                bn: 'সঠিক!'
            })[selectedLanguage] || 'Correct!' : ({
                ta: `தவறு. சரியான விடை: ${correctAnswer}`,
                hi: `गलत। सही उत्तर है: ${correctAnswer}`,
                te: `తప్పు. సరైన సమాధానం: ${correctAnswer}`,
                bn: `ভুল। সঠিক উত্তর: ${correctAnswer}`
            })[selectedLanguage] || `Incorrect. The answer is: ${correctAnswer}`;
            setTimeout(()=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ttsEngine"].speak(feedbackText, selectedLanguage, {
                    rate: 1.0
                }).catch(()=>{});
            }, 500);
        }
    }, [
        questions,
        currentQuestionIndex,
        questionStartTime,
        backendAvailable,
        sessionId,
        selectedLanguage,
        voiceSupported.tts
    ]);
    // ============================================================
    // VOICE: Listen for answer
    // (Defined AFTER processAnswer since it depends on it)
    // ============================================================
    const startListening = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!voiceSupported.stt || isListening || isProcessing) return;
        // Stop TTS if still speaking
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ttsEngine"].stop();
        setIsSpeaking(false);
        setIsListening(true);
        setIsProcessing(false);
        setTranscript('');
        setInterimTranscript('');
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sttEngine"].onResult = (fullTranscript, latest)=>{
            setTranscript(fullTranscript);
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sttEngine"].onInterim = (interim)=>{
            setInterimTranscript(interim);
        };
        try {
            const finalTranscript = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sttEngine"].startListening(selectedLanguage, {
                continuous: false,
                interimResults: true
            });
            setIsListening(false);
            setIsProcessing(false);
            if (finalTranscript && !answeredRef.current) {
                processAnswer(finalTranscript);
            }
        } catch (err) {
            console.warn('STT failed:', err);
            setIsListening(false);
            setIsProcessing(false);
        }
    }, [
        voiceSupported.stt,
        isListening,
        isProcessing,
        selectedLanguage,
        processAnswer
    ]);
    const stopListening = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sttEngine"].stopListening();
        setIsListening(false);
        setIsProcessing(false);
    }, []);
    // ============================================================
    // SCORING: Finish current test
    // (Defined BEFORE goToNextQuestion since it's a dependency)
    // ============================================================
    const finishCurrentTest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        // Calculate domain score
        const correct = answers.filter((a)=>a.is_correct).length;
        const total = answers.length;
        const avgConfidence = total > 0 ? answers.reduce((sum, a)=>sum + a.confidence, 0) / total : 0;
        const avgResponseTime = total > 0 ? answers.reduce((sum, a)=>sum + a.response_time, 0) / total : 0;
        let baseScore = total > 0 ? Math.round(correct / total * 100) : 0;
        // Apply bonuses based on test type
        let bonus = 0;
        if (selectedTestType === 'memory') {
            if (avgResponseTime < 5) bonus = 5;
            else if (avgResponseTime < 10) bonus = 2;
        } else if (selectedTestType === 'attention') {
            bonus = Math.max(0, Math.min(15, Math.round(15 - avgResponseTime * 3)));
        } else if (selectedTestType === 'language') {
            const keywordMatches = answers.reduce((sum, a)=>sum + (a.keyword_count || 0), 0);
            bonus = Math.min(10, keywordMatches * 2);
        }
        const finalScore = Math.min(100, baseScore + bonus);
        const scoreResult = {
            score: finalScore,
            details: {
                correct,
                total,
                baseScore,
                bonus,
                avgConfidence: Math.round(avgConfidence),
                avgResponseTime: Math.round(avgResponseTime * 10) / 10
            }
        };
        // Store result
        setDomainScores((prev)=>({
                ...prev,
                [selectedTestType]: finalScore
            }));
        setAllTestResults((prev)=>({
                ...prev,
                [selectedTestType]: {
                    ...scoreResult,
                    answers
                }
            }));
        setCompletedTests((prev)=>[
                ...prev,
                selectedTestType
            ]);
        // Go to scoring phase
        setPhase('scoring');
    }, [
        answers,
        selectedTestType
    ]);
    // ============================================================
    // NAVIGATION
    // (Defined AFTER finishCurrentTest since it depends on it)
    // ============================================================
    const goToNextQuestion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev)=>prev + 1);
        } else {
            // Test domain complete — calculate score
            finishCurrentTest();
        }
    }, [
        currentQuestionIndex,
        questions.length,
        finishCurrentTest
    ]);
    // ============================================================
    // RISK CLASSIFICATION: Calculate final results
    // (Defined BEFORE startNextTest since it's a dependency)
    // ============================================================
    const testTypes = [
        'memory',
        'attention',
        'language',
        'visuospatial'
    ];
    const calculateFinalResults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        setPhase('results');
        const scores = {
            memory: domainScores.memory || 0,
            attention: domainScores.attention || 0,
            language: domainScores.language || 0,
            visuospatial: domainScores.visuospatial || 0
        };
        // Try backend risk classification
        if (backendAvailable) {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BackendAPI"].classifyRisk(scores, user?.age, user?.educationLevel);
            if (result) {
                setRiskResult(result);
                return;
            }
        }
        // Frontend fallback risk classification
        const weights = {
            memory: 0.30,
            attention: 0.25,
            language: 0.25,
            visuospatial: 0.20
        };
        let bhi = 0;
        for (const [domain, weight] of Object.entries(weights)){
            bhi += (scores[domain] || 0) * weight;
        }
        bhi = Math.round(bhi * 10) / 10;
        let riskLevel = 'Normal';
        let riskDescription = 'Your cognitive function appears to be within normal range.';
        if (bhi < 55) {
            riskLevel = 'High Risk';
            riskDescription = 'Several areas show below-average performance. We recommend consulting a neurologist.';
        } else if (bhi < 75) {
            riskLevel = 'MCI';
            riskDescription = 'Some areas may benefit from monitoring. Consider consulting a healthcare provider.';
        }
        const recommendations = [];
        if (scores.memory < 70) recommendations.push('Practice memory exercises daily.');
        if (scores.attention < 70) recommendations.push('Try mindfulness meditation and focus exercises.');
        if (scores.language < 70) recommendations.push('Read regularly and practice word games.');
        if (scores.visuospatial < 70) recommendations.push('Engage in puzzles and spatial reasoning activities.');
        if (recommendations.length === 0) {
            recommendations.push('Maintain your cognitive health with regular mental exercises.');
        }
        const resultsObj = {
            risk_level: riskLevel,
            brain_health_index: bhi,
            risk_description: riskDescription,
            recommendations,
            domain_scores: scores,
            allTestResults,
            date: new Date().toLocaleDateString()
        };
        setRiskResult(resultsObj);
        setTestResults({
            date: new Date().toLocaleDateString(),
            scores: {
                overall: bhi,
                memory: scores.memory,
                attention: scores.attention,
                language: scores.language,
                visuospatial: scores.visuospatial
            },
            risk: riskLevel === 'Low Risk' ? 'low' : riskLevel === 'MCI' ? 'moderate' : 'high',
            fullResults: resultsObj
        });
        router.push('/results');
    }, [
        domainScores,
        allTestResults,
        backendAvailable,
        user,
        setTestResults,
        router
    ]);
    // ============================================================
    // START NEXT TEST OR FINISH
    // (Defined AFTER calculateFinalResults since it depends on it)
    // ============================================================
    const startNextTest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const remaining = testTypes.filter((t)=>!completedTests.includes(t));
        if (remaining.length > 0) {
            setPhase('select');
        } else {
            // All tests complete — calculate risk
            calculateFinalResults();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        completedTests,
        calculateFinalResults
    ]);
    // ============================================================
    // SELECT OPTION MANUALLY (tap/click fallback)
    // ============================================================
    const handleOptionClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((option)=>{
        if (answeredRef.current) return;
        setTranscript(option);
        processAnswer(option);
    }, [
        processAnswer
    ]);
    // ============================================================
    // RENDER: Test Selection Phase
    // ============================================================
    const renderSelectPhase = ()=>{
        const labels = TEST_TYPE_LABELS[selectedLanguage] || TEST_TYPE_LABELS['en'];
        const remaining = testTypes.filter((t)=>!completedTests.includes(t));
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "voice-test-select",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "select-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: [
                                "🧠 ",
                                selectedLanguage === 'ta' ? 'மூளை ஆரோக்கிய சோதனை' : selectedLanguage === 'hi' ? 'मस्तिष्क स्वास्थ्य परीक्षण' : selectedLanguage === 'te' ? 'మెదడు ఆరోగ్య పరీక్ష' : 'Brain Health Test'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 779,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "select-subtitle",
                            children: selectedLanguage === 'ta' ? 'சோதனை வகையைத் தேர்ந்தெடுக்கவும்' : selectedLanguage === 'hi' ? 'परीक्षण प्रकार चुनें' : selectedLanguage === 'te' ? 'పరీక్ష రకం ఎంచుకోండి' : 'Select a test to begin'
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 780,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 778,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "language-select-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "lang-label",
                            children: selectedLanguage === 'ta' ? 'மொழி:' : selectedLanguage === 'hi' ? 'भाषा:' : selectedLanguage === 'te' ? 'భాష:' : 'Language:'
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 787,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: selectedLanguage,
                            onChange: (e)=>setSelectedLanguage(e.target.value),
                            className: "lang-select",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "en",
                                    children: "English"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 795,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "ta",
                                    children: "தமிழ் (Tamil)"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 796,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "hi",
                                    children: "हिन्दी (Hindi)"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 797,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "te",
                                    children: "తెలుగు (Telugu)"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 798,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 790,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 786,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "voice-status",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `status-dot ${voiceSupported.tts ? 'active' : 'inactive'}`
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 804,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                "Voice Output (TTS): ",
                                voiceSupported.tts ? 'Available' : 'Not Available'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 805,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `status-dot ${voiceSupported.stt ? 'active' : 'inactive'}`
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 806,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                "Voice Input (STT): ",
                                voiceSupported.stt ? 'Available' : 'Not Available'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 807,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `status-dot ${backendAvailable ? 'active' : 'inactive'}`
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 808,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                "Backend: ",
                                backendAvailable ? 'Connected' : 'Offline (using local mode)'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 809,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 803,
                    columnNumber: 17
                }, this),
                completedTests.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "completed-tests",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                            children: "Completed:"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 815,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "completed-pills",
                            children: completedTests.map((test)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "completed-pill",
                                    children: [
                                        "✓ ",
                                        labels[test],
                                        " — ",
                                        domainScores[test],
                                        "%"
                                    ]
                                }, test, true, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 818,
                                    columnNumber: 33
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 816,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 814,
                    columnNumber: 21
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "test-type-grid",
                    children: testTypes.map((type)=>{
                        const isCompleted = completedTests.includes(type);
                        const icons = {
                            memory: '🧠',
                            attention: '👁️',
                            language: '💬',
                            visuospatial: '🔷'
                        };
                        const descs = {
                            en: {
                                memory: 'Test your recall and working memory',
                                attention: 'Evaluate focus and concentration',
                                language: 'Check verbal fluency and comprehension',
                                visuospatial: 'Test spatial reasoning and perception'
                            },
                            ta: {
                                memory: 'உங்கள் நினைவாற்றலை சோதிக்கவும்',
                                attention: 'கவனம் மற்றும் ஒருமுகப்படுத்தலை மதிப்பிடுங்கள்',
                                language: 'மொழி திறனை சரிபார்க்கவும்',
                                visuospatial: 'இடஞ்சார்ந்த காரணத்தை சோதிக்கவும்'
                            },
                            hi: {
                                memory: 'अपनी याददाश्त का परीक्षण करें',
                                attention: 'ध्यान और एकाग्रता का मूल्यांकन करें',
                                language: 'भाषा कौशल जांचें',
                                visuospatial: 'स्थानिक तर्क का परीक्षण करें'
                            },
                            te: {
                                memory: 'మీ జ్ఞాపకశక్తిని పరీక్షించండి',
                                attention: 'దృష్టి మరియు ఏకాగ్రతను అంచనా వేయండి',
                                language: 'భాషా నైపుణ్యాలను తనిఖీ చేయండి',
                                visuospatial: 'ప్రాదేశిక తర్కాన్ని పరీక్షించండి'
                            }
                        };
                        const desc = (descs[selectedLanguage] || descs['en'])[type];
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: `test-type-card ${isCompleted ? 'completed' : ''}`,
                            onClick: ()=>!isCompleted && startTest(type),
                            disabled: isCompleted,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "test-type-icon",
                                    children: icons[type]
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 846,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: labels[type]
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 847,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: desc
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 848,
                                    columnNumber: 33
                                }, this),
                                isCompleted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "score-badge",
                                    children: [
                                        "✓ ",
                                        domainScores[type],
                                        "%"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 850,
                                    columnNumber: 37
                                }, this)
                            ]
                        }, type, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 840,
                            columnNumber: 29
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 827,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "select-actions",
                    children: [
                        remaining.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn-primary",
                            onClick: calculateFinalResults,
                            children: selectedLanguage === 'ta' ? 'முடிவுகளைக் காண்க' : selectedLanguage === 'hi' ? 'परिणाम देखें' : selectedLanguage === 'te' ? 'ఫలితాలు చూడండి' : 'View Final Results'
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 860,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn-secondary",
                            onClick: ()=>router.push('/dashboard'),
                            children: t('cancel', 'Cancel')
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 864,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 858,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
            lineNumber: 777,
            columnNumber: 13
        }, this);
    };
    // ============================================================
    // RENDER: Testing Phase (Voice-Enabled Questions)
    // ============================================================
    const renderTestingPhase = ()=>{
        if (questions.length === 0) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "loading-state",
            children: "Loading questions..."
        }, void 0, false, {
            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
            lineNumber: 877,
            columnNumber: 44
        }, this);
        const question = questions[currentQuestionIndex];
        const progress = Math.round(currentQuestionIndex / questions.length * 100);
        const labels = TEST_TYPE_LABELS[selectedLanguage] || TEST_TYPE_LABELS['en'];
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "voice-test-active",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "test-active-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            children: labels[selectedTestType]
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 887,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "test-progress-bar",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "progress-track",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "progress-fill",
                                        style: {
                                            width: `${progress}%`
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                        lineNumber: 890,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 889,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "progress-text",
                                    children: [
                                        currentQuestionIndex + 1,
                                        " / ",
                                        questions.length
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 892,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 888,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 886,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "question-card",
                    children: [
                        isSpeaking && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "speaking-indicator",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "sound-wave",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                            lineNumber: 902,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                            lineNumber: 902,
                                            columnNumber: 46
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                            lineNumber: 902,
                                            columnNumber: 59
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                            lineNumber: 902,
                                            columnNumber: 72
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                            lineNumber: 902,
                                            columnNumber: 85
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 901,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "speaking-text",
                                    children: selectedLanguage === 'ta' ? 'கேட்கிறது...' : selectedLanguage === 'hi' ? 'सुनिए...' : selectedLanguage === 'te' ? 'వింటోంది...' : 'Listening...'
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 904,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 900,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "question-text",
                            children: question.question
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 910,
                            columnNumber: 21
                        }, this),
                        question.type === 'stroop' && question.display_word && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "stroop-display",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "stroop-word",
                                style: {
                                    color: question.display_color
                                },
                                children: question.display_word
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                lineNumber: 915,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 914,
                            columnNumber: 25
                        }, this),
                        question.display_pattern && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pattern-display",
                            children: question.display_pattern.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `pattern-item ${item === '?' ? 'pattern-unknown' : ''}`,
                                    children: item
                                }, i, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 925,
                                    columnNumber: 33
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 923,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn-replay",
                            onClick: ()=>readQuestionAloud(question.question),
                            disabled: isSpeaking,
                            children: [
                                "🔊 ",
                                selectedLanguage === 'ta' ? 'மீட்டமை' : selectedLanguage === 'hi' ? 'दोहराएं' : selectedLanguage === 'te' ? 'రీప్లే' : 'Replay'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 933,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 897,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "voice-input-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: `mic-button ${isListening ? 'listening' : ''} ${isProcessing ? 'processing' : ''}`,
                            onClick: isListening ? stopListening : startListening,
                            disabled: answeredRef.current || isProcessing,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "mic-icon",
                                    children: isProcessing ? '⏳' : isListening ? '⏹️' : '🎤'
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 950,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "mic-label",
                                    children: isProcessing ? selectedLanguage === 'ta' ? 'எழுதுகிறது...' : selectedLanguage === 'hi' ? 'लिप्यंतरण...' : selectedLanguage === 'te' ? 'లిప్యంతరీకరణ...' : 'Transcribing...' : isListening ? selectedLanguage === 'ta' ? 'பேசுங்கள்... (நிறுத்த அழுத்தவும்)' : selectedLanguage === 'hi' ? 'बोलिए... (रोकने के लिए दबाएं)' : selectedLanguage === 'te' ? 'మాట్లాడండి... (ఆపడానికి నొక్కండి)' : 'Speaking... (tap to stop)' : selectedLanguage === 'ta' ? 'பதிலளிக்க அழுத்தவும்' : selectedLanguage === 'hi' ? 'उत्तर देने के लिए दबाएं' : selectedLanguage === 'te' ? 'సమాధానం చెప్పండి' : 'Tap to Answer'
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 953,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 945,
                            columnNumber: 21
                        }, this),
                        isListening && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "listening-waves",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "wave"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 966,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "wave"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 967,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "wave"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 968,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 965,
                            columnNumber: 25
                        }, this),
                        (transcript || interimTranscript) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "transcript-display",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "transcript-label",
                                    children: selectedLanguage === 'ta' ? 'நீங்கள் கூறியது:' : selectedLanguage === 'hi' ? 'आपने कहा:' : selectedLanguage === 'te' ? 'మీరు చెప్పింది:' : 'You said:'
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 975,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "transcript-text",
                                    children: [
                                        transcript,
                                        interimTranscript && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "interim",
                                            children: [
                                                " ",
                                                interimTranscript
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                            lineNumber: 980,
                                            columnNumber: 55
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 978,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 974,
                            columnNumber: 25
                        }, this),
                        matchResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `match-result ${matchResult.is_correct ? 'correct' : 'incorrect'}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "match-icon",
                                    children: matchResult.is_correct ? '✓' : '✗'
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 988,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "match-text",
                                    children: matchResult.is_correct ? 'Matched!' : `Expected: ${feedback?.correctAnswer}`
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 989,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "confidence-badge",
                                    children: [
                                        matchResult.confidence,
                                        "% confidence"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 992,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 987,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 943,
                    columnNumber: 17
                }, this),
                showOptions && question.options && question.options.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "options-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "options-label",
                            children: selectedLanguage === 'ta' ? 'அல்லது தட்டி தேர்வு செய்யவும்:' : selectedLanguage === 'hi' ? 'या टैप करके चुनें:' : selectedLanguage === 'te' ? 'లేదా ట్యాప్ చేసి ఎంచుకోండి:' : 'Or tap to select:'
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1002,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "options-grid",
                            children: question.options.map((opt, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `option-btn ${matchResult ? opt.toLowerCase() === (question.correct_answer || '').toLowerCase() ? 'correct-option' : opt === matchResult.matched_option ? 'selected-option' : '' : ''}`,
                                    onClick: ()=>handleOptionClick(opt),
                                    disabled: answeredRef.current,
                                    children: opt
                                }, i, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 1007,
                                    columnNumber: 33
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1005,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 1001,
                    columnNumber: 21
                }, this),
                feedback && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `feedback-section ${feedback.isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "feedback-message",
                            children: feedback.message
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1027,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn-next",
                            onClick: goToNextQuestion,
                            children: currentQuestionIndex < questions.length - 1 ? selectedLanguage === 'ta' ? 'அடுத்த கேள்வி →' : selectedLanguage === 'hi' ? 'अगला प्रश्न →' : selectedLanguage === 'te' ? 'తదుపరి ప్రశ్న →' : 'Next Question →' : selectedLanguage === 'ta' ? 'சோதனையை முடி' : selectedLanguage === 'hi' ? 'परीक्षण समाप्त करें' : selectedLanguage === 'te' ? 'పరీక్ష పూర్తి' : 'Finish Test'
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1028,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 1026,
                    columnNumber: 21
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "btn-cancel-test",
                    onClick: ()=>setPhase('select'),
                    children: t('cancel', 'Cancel')
                }, void 0, false, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 1037,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
            lineNumber: 884,
            columnNumber: 13
        }, this);
    };
    // ============================================================
    // RENDER: Scoring Phase
    // ============================================================
    // Speak score aloud when entering scoring phase
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (phase !== 'scoring' || !voiceSupported.tts) return;
        const score = domainScores[selectedTestType] || 0;
        const scoreMsg = {
            ta: `சோதனை முடிந்தது. உங்கள் மதிப்பெண் ${score} சதவீதம்.`,
            hi: `परीक्षण पूर्ण हुआ। आपका स्कोर ${score} प्रतिशत है।`,
            te: `పరీక్ష పూర్తయింది. మీ స్కోర్ ${score} శాతం.`,
            en: `Test complete. Your score is ${score} percent.`
        }[selectedLanguage] || `Test complete. Your score is ${score} percent.`;
        const t = setTimeout(()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ttsEngine"].speak(scoreMsg, selectedLanguage, {
                rate: 0.9
            }).catch(()=>{});
        }, 600);
        return ()=>clearTimeout(t);
    }, [
        phase,
        selectedTestType,
        domainScores,
        selectedLanguage,
        voiceSupported.tts
    ]);
    const renderScoringPhase = ()=>{
        const labels = TEST_TYPE_LABELS[selectedLanguage] || TEST_TYPE_LABELS['en'];
        const score = domainScores[selectedTestType] || 0;
        const testResult = allTestResults[selectedTestType] || {};
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "voice-test-scoring",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "scoring-header",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: [
                            labels[selectedTestType],
                            " — ",
                            selectedLanguage === 'ta' ? 'முடிவு' : selectedLanguage === 'hi' ? 'परिणाम' : selectedLanguage === 'te' ? 'ఫలితం' : 'Complete!'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                        lineNumber: 1072,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 1071,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "score-display",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `score-ring ${score >= 80 ? 'score-high' : score >= 60 ? 'score-mid' : 'score-low'}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "score-number",
                                    children: score
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 1077,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "score-percent",
                                    children: "%"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 1078,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1076,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "score-label",
                            children: labels[selectedTestType]
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1080,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 1075,
                    columnNumber: 17
                }, this),
                testResult.details && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "score-details",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "detail-row",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: selectedLanguage === 'ta' ? 'சரியான விடைகள்:' : selectedLanguage === 'hi' ? 'सही उत्तर:' : selectedLanguage === 'te' ? 'సరైన సమాధానాలు:' : 'Correct Answers:'
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 1086,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "detail-value",
                                    children: [
                                        testResult.details.correct,
                                        " / ",
                                        testResult.details.total
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 1087,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1085,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "detail-row",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: selectedLanguage === 'ta' ? 'சராசரி நேரம்:' : selectedLanguage === 'hi' ? 'औसत समय:' : selectedLanguage === 'te' ? 'సగటు సమయం:' : 'Avg. Response Time:'
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 1090,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "detail-value",
                                    children: [
                                        testResult.details.avgResponseTime,
                                        "s"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 1091,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1089,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "detail-row",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: selectedLanguage === 'ta' ? 'சராசரி நம்பிக்கை:' : selectedLanguage === 'hi' ? 'औसत विश्वास:' : selectedLanguage === 'te' ? 'సగటు విశ్వాసం:' : 'Avg. Confidence:'
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 1094,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "detail-value",
                                    children: [
                                        testResult.details.avgConfidence,
                                        "%"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 1095,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1093,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 1084,
                    columnNumber: 21
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "scoring-actions",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn-primary",
                            onClick: startNextTest,
                            children: testTypes.filter((t)=>!completedTests.includes(t)).length > 0 ? selectedLanguage === 'ta' ? 'அடுத்த சோதனை →' : selectedLanguage === 'hi' ? 'अगला परीक्षण →' : selectedLanguage === 'te' ? 'తదుపరి పరీక్ష →' : 'Next Test →' : selectedLanguage === 'ta' ? 'இறுதி முடிவுகள்' : selectedLanguage === 'hi' ? 'अंतिम परिणाम' : selectedLanguage === 'te' ? 'చివరి ఫలితాలు' : 'Final Results'
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1101,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn-secondary",
                            onClick: ()=>setPhase('select'),
                            children: selectedLanguage === 'ta' ? 'சோதனைகளுக்கு திரும்பு' : selectedLanguage === 'hi' ? 'परीक्षणों पर वापस' : selectedLanguage === 'te' ? 'పరీక్షలకు తిరిగి' : 'Back to Tests'
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1106,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 1100,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
            lineNumber: 1070,
            columnNumber: 13
        }, this);
    };
    // ============================================================
    // RENDER: Final Results Phase
    // ============================================================
    const renderResultsPhase = ()=>{
        if (!riskResult) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "results-loading",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "loading-spinner"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                        lineNumber: 1122,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Calculating your Brain Health Index..."
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                        lineNumber: 1123,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                lineNumber: 1121,
                columnNumber: 17
            }, this);
        }
        const bhi = riskResult.brain_health_index;
        const riskColors = {
            'Normal': '#22c55e',
            'MCI': '#f59e0b',
            'High Risk': '#ef4444'
        };
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "voice-test-results",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    children: [
                        "🧠 ",
                        selectedLanguage === 'ta' ? 'மூளை ஆரோக்கிய அறிக்கை' : selectedLanguage === 'hi' ? 'मस्तिष्क स्वास्थ्य रिपोर्ट' : selectedLanguage === 'te' ? 'మెదడు ఆరోగ్య నివేదిక' : 'Brain Health Report'
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 1133,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bhi-display",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bhi-ring",
                            style: {
                                '--bhi-color': riskColors[riskResult.risk_level] || '#3b82f6'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "bhi-value",
                                    children: bhi
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 1138,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "bhi-unit",
                                    children: "%"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 1139,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1137,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "bhi-label",
                            children: "Brain Health Index"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1141,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "risk-badge",
                            style: {
                                backgroundColor: riskColors[riskResult.risk_level] || '#3b82f6'
                            },
                            children: riskResult.risk_level
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1142,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "risk-description",
                            children: riskResult.risk_description
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1145,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 1136,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "domain-chart",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            children: selectedLanguage === 'ta' ? 'டொமைன் மதிப்பெண்கள்' : selectedLanguage === 'hi' ? 'डोमेन स्कोर' : selectedLanguage === 'te' ? 'డొమైన్ స్కోర్లు' : 'Domain Scores'
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1150,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "domain-bars",
                            children: Object.entries(riskResult.domain_scores || {}).map(([domain, score])=>{
                                const labelMap = {
                                    en: {
                                        memory: 'Memory',
                                        attention: 'Attention',
                                        language: 'Language',
                                        visuospatial: 'Visuospatial'
                                    },
                                    ta: {
                                        memory: 'நினைவாற்றல்',
                                        attention: 'கவனம்',
                                        language: 'மொழி',
                                        visuospatial: 'இட-பார்வை'
                                    },
                                    hi: {
                                        memory: 'स्मृति',
                                        attention: 'ध्यान',
                                        language: 'भाषा',
                                        visuospatial: 'दृश्य-स्थानिक'
                                    },
                                    te: {
                                        memory: 'జ్ఞాపకశక్తి',
                                        attention: 'శ్రద్ధ',
                                        language: 'భాష',
                                        visuospatial: 'దృశ్య-ప్రాంతీయ'
                                    }
                                };
                                const colors = {
                                    memory: '#3b82f6',
                                    attention: '#10b981',
                                    language: '#f59e0b',
                                    visuospatial: '#8b5cf6'
                                };
                                const label = (labelMap[selectedLanguage] || labelMap['en'])[domain] || domain;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "domain-bar-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "domain-label",
                                            children: label
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                            lineNumber: 1164,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "domain-bar-track",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "domain-bar-fill",
                                                style: {
                                                    width: `${score}%`,
                                                    backgroundColor: colors[domain] || '#3b82f6'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "domain-bar-value",
                                                    children: [
                                                        score,
                                                        "%"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                                    lineNumber: 1170,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                                lineNumber: 1166,
                                                columnNumber: 41
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                            lineNumber: 1165,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, domain, true, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 1163,
                                    columnNumber: 33
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1151,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 1149,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "recommendations-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            children: selectedLanguage === 'ta' ? 'பரிந்துரைகள்' : selectedLanguage === 'hi' ? 'सिफारिशें' : selectedLanguage === 'te' ? 'సూచనలు' : 'Recommendations'
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1181,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "recommendations-list",
                            children: riskResult.recommendations.map((rec, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: rec
                                }, i, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 1184,
                                    columnNumber: 29
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1182,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 1180,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "results-actions",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn-primary",
                            onClick: ()=>{
                                // Pass results to parent
                                if (onTestComplete) {
                                    onTestComplete({
                                        date: new Date().toISOString().split('T')[0],
                                        scores: {
                                            overall: Math.round(bhi),
                                            memory: riskResult.domain_scores.memory || 0,
                                            attention: riskResult.domain_scores.attention || 0,
                                            language: riskResult.domain_scores.language || 0,
                                            visuospatial: riskResult.domain_scores.visuospatial || 0
                                        },
                                        risk: riskResult.risk_level === 'Normal' ? 'low' : riskResult.risk_level === 'MCI' ? 'moderate' : 'high',
                                        riskLevel: riskResult.risk_level,
                                        brainHealthIndex: bhi,
                                        recommendations: riskResult.recommendations
                                    });
                                }
                            },
                            children: selectedLanguage === 'ta' ? 'டாஷ்போர்டுக்குத் திரும்பு' : selectedLanguage === 'hi' ? 'डैशबोर्ड पर वापस' : selectedLanguage === 'te' ? 'డాష్‌బోర్డ్‌కు తిరిగి' : 'Save & Return to Dashboard'
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1191,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn-secondary",
                            onClick: ()=>{
                                setPhase('select');
                                setCompletedTests([]);
                                setDomainScores({});
                                setAllTestResults({});
                                setRiskResult(null);
                            },
                            children: selectedLanguage === 'ta' ? 'மீண்டும் எடு' : selectedLanguage === 'hi' ? 'फिर से लें' : selectedLanguage === 'te' ? 'మళ్ళీ తీసుకోండి' : 'Retake Test'
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1212,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 1190,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
            lineNumber: 1132,
            columnNumber: 13
        }, this);
    };
    // ============================================================
    // MAIN RENDER
    // ============================================================
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "voice-test-container",
        children: [
            phase === 'select' && renderSelectPhase(),
            phase === 'testing' && renderTestingPhase(),
            phase === 'scoring' && renderScoringPhase(),
            phase === 'results' && renderResultsPhase()
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
        lineNumber: 1231,
        columnNumber: 9
    }, this);
}
const __TURBOPACK__default__export__ = VoiceTestContainer;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ed72b59f._.js.map