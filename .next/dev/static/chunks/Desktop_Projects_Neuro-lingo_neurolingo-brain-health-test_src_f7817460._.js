(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/services/voiceService.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/node_modules/@swc/helpers/esm/_async_to_generator.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_class_call_check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/node_modules/@swc/helpers/esm/_class_call_check.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_create_class$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/node_modules/@swc/helpers/esm/_create_class.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/node_modules/@swc/helpers/esm/_to_consumable_array.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/node_modules/@swc/helpers/esm/_type_of.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript) <export __generator as _>");
;
;
;
;
;
;
/**
 * NeuroLingo Voice Service
 * ========================
 * Handles Text-to-Speech (TTS) and Speech-to-Text (STT) 
 * using browser Web Speech API with fallback support.
 * 
 * In production, this would connect to:
 *   - Coqui XTTS for TTS
 *   - Whisper-small for STT
 */ var API_BASE = ("TURBOPACK compile-time value", "http://localhost:5000/api") || 'http://localhost:5000/api';
// Language code mapping
var LANG_MAP = {
    en: 'en-US',
    ta: 'ta-IN',
    hi: 'hi-IN',
    te: 'te-IN',
    bn: 'bn-IN'
};
// Shape symbol mapping for voice commands
var SYMBOL_MAP = {
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
var TTSEngine = /*#__PURE__*/ function() {
    "use strict";
    function TTSEngine() {
        var _this = this;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_class_call_check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, TTSEngine);
        this.synth = ("TURBOPACK compile-time truthy", 1) ? window.speechSynthesis : "TURBOPACK unreachable";
        this.currentUtterance = null;
        this.voiceCache = {};
        this.isReady = false;
        // Load voices
        if (this.synth) {
            this._loadVoices();
            if (this.synth.onvoiceschanged !== undefined) {
                this.synth.onvoiceschanged = function() {
                    return _this._loadVoices();
                };
            }
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_create_class$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(TTSEngine, [
        {
            key: "_loadVoices",
            value: function _loadVoices() {
                var _this = this;
                if (!this.synth) return;
                var voices = this.synth.getVoices();
                voices.forEach(function(voice) {
                    var lang = voice.lang.split('-')[0];
                    if (!_this.voiceCache[lang]) {
                        _this.voiceCache[lang] = [];
                    }
                    _this.voiceCache[lang].push(voice);
                });
                this.isReady = voices.length > 0;
            }
        },
        {
            /**
     * Get the best voice for a language
     */ key: "_getBestVoice",
            value: function _getBestVoice(langCode) {
                var fullLang = LANG_MAP[langCode] || langCode;
                var shortLang = langCode;
                // Try to find exact match first
                var allVoices = this.synth.getVoices();
                var bestVoice = allVoices.find(function(v) {
                    return v.lang === fullLang;
                });
                if (!bestVoice) {
                    bestVoice = allVoices.find(function(v) {
                        return v.lang.startsWith(shortLang);
                    });
                }
                if (!bestVoice) {
                    bestVoice = allVoices.find(function(v) {
                        return v.lang.startsWith('en');
                    });
                }
                return bestVoice;
            }
        },
        {
            /**
     * Speak text in the specified language
     * @param {string} text - Text to speak
     * @param {string} language - Language code (en, ta, hi, te, bn)
     * @param {Object} options - Optional settings
     * @returns {Promise} resolves when speech is complete
     */ key: "speak",
            value: function speak(text) {
                var _this = this;
                var language = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'en', options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
                return new Promise(function(resolve, reject) {
                    // Cancel any ongoing speech
                    _this.stop();
                    // Strip fake IndicBert prefix so it doesn't get dictated
                    var cleanText = text.replace(/\[IndicBert[\s\S]*?\]\s*/g, '').trim();
                    // Try backend gTTS first as it supports all scripts
                    var encodedText = encodeURIComponent(cleanText);
                    var url = "".concat(API_BASE, "/tts?text=").concat(encodedText, "&language=").concat(language);
                    // Capture a local ref — this.currentAudio may be nulled by stop() before
                    // the async .play() promise rejects, which would crash on .onerror()
                    var audio = new Audio(url);
                    _this.currentAudio = audio;
                    audio.onended = function() {
                        if (_this.currentAudio === audio) _this.currentAudio = null;
                        resolve();
                    };
                    var tryGoogleTTS = function() {
                        console.warn('Backend TTS failed, trying direct Google TTS as fallback');
                        var ttsLang = language.substring(0, 2);
                        var googleUrl = "https://translate.google.com/translate_tts?ie=UTF-8&q=".concat(encodedText, "&tl=").concat(ttsLang, "&client=tw-ob");
                        var fallbackAudio = new Audio(googleUrl);
                        _this.currentAudio = fallbackAudio;
                        fallbackAudio.onended = function() {
                            if (_this.currentAudio === fallbackAudio) _this.currentAudio = null;
                            resolve();
                        };
                        fallbackAudio.onerror = function() {
                            console.warn('Google TTS fallback failed, trying Browser TTS');
                            if (_this.currentAudio === fallbackAudio) _this.currentAudio = null;
                            var utterance = new SpeechSynthesisUtterance(cleanText);
                            utterance.lang = LANG_MAP[language] || language;
                            utterance.rate = options.rate || 0.9;
                            utterance.pitch = options.pitch || 1.0;
                            utterance.volume = options.volume || 1.0;
                            var voice = _this._getBestVoice(language);
                            if (voice) utterance.voice = voice;
                            utterance.onend = function() {
                                _this.currentUtterance = null;
                                resolve();
                            };
                            utterance.onerror = function(event) {
                                _this.currentUtterance = null;
                                if (event.error === 'interrupted' || event.error === 'canceled') {
                                    resolve();
                                } else {
                                    // Browser TTS also failed — resolve silently so the test continues
                                    console.warn('Browser TTS failed:', event.error);
                                    resolve();
                                }
                            };
                            _this.currentUtterance = utterance;
                            _this.synth.speak(utterance);
                        };
                        fallbackAudio.play().catch(function() {
                            return fallbackAudio.onerror();
                        });
                    };
                    audio.onerror = tryGoogleTTS;
                    // ⚠️ Fix: capture local ref so .catch handler is safe even if stop() nulls currentAudio
                    audio.play().catch(function() {
                        if (_this.currentAudio === audio) {
                            tryGoogleTTS();
                        }
                    // else stop() was called — already cleaned up, do nothing
                    });
                });
            }
        },
        {
            /**
     * Stop current speech
     */ key: "stop",
            value: function stop() {
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
        },
        {
            /**
     * Check if TTS is currently speaking
     */ key: "isSpeaking",
            value: function isSpeaking() {
                return this.synth.speaking || this.currentAudio && !this.currentAudio.paused;
            }
        },
        {
            /**
     * Check if TTS is available
     */ key: "isAvailable",
            value: function isAvailable() {
                return true; // we now use backend TTS mainly
            }
        },
        {
            /**
     * Get available languages for TTS
     */ key: "getAvailableLanguages",
            value: function getAvailableLanguages() {
                var voices = this.synth.getVoices();
                var langs = new Set();
                voices.forEach(function(v) {
                    return langs.add(v.lang);
                });
                return Array.from(langs);
            }
        }
    ]);
    return TTSEngine;
}();
// ============================================================
// SPEECH-TO-TEXT (STT)
// ============================================================
var STTEngine = /*#__PURE__*/ function() {
    "use strict";
    function STTEngine() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_class_call_check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, STTEngine);
        this.SpeechRecognition = ("TURBOPACK compile-time truthy", 1) ? window.SpeechRecognition || window.webkitSpeechRecognition : "TURBOPACK unreachable";
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_create_class$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(STTEngine, [
        {
            // ─────────────────────────────────────────────────────────────────────────
            // Public API
            // ─────────────────────────────────────────────────────────────────────────
            key: "isAvailable",
            value: function isAvailable() {
                return !!this.SpeechRecognition;
            }
        },
        {
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
     */ key: "startListening",
            value: function startListening() {
                var language = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'en', options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
                return this._startDual(language, options);
            }
        },
        {
            // ─────────────────────────────────────────────────────────────────────────
            // Core: dual-engine listener
            // ─────────────────────────────────────────────────────────────────────────
            key: "_startDual",
            value: function _startDual(language, options) {
                var _this = this;
                return new Promise(function(resolve, reject) {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(function() {
                        var _this, webSpeechTranscript, webSpeechDone, resolved, resolveOnce, _, mimeType, e;
                        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    _this = this;
                                    if (!this.SpeechRecognition) {
                                        reject(new Error('Speech Recognition is not available in this browser'));
                                        return [
                                            2
                                        ];
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
                                    webSpeechTranscript = '';
                                    webSpeechDone = false;
                                    resolved = false;
                                    resolveOnce = function(result) {
                                        if (resolved) return;
                                        resolved = true;
                                        _this.isListening = false;
                                        _this.transcript = result;
                                        if (_this.onResult && result) _this.onResult(result, result);
                                        if (_this.onEnd) _this.onEnd(result);
                                        resolve(result);
                                    };
                                    this.recognition.onresult = function(event) {
                                        var finalText = '';
                                        var interimText = '';
                                        for(var i = event.resultIndex; i < event.results.length; i++){
                                            if (event.results[i].isFinal) {
                                                finalText += event.results[i][0].transcript;
                                            } else {
                                                interimText += event.results[i][0].transcript;
                                            }
                                        }
                                        if (finalText) {
                                            webSpeechTranscript += (webSpeechTranscript ? ' ' : '') + finalText;
                                            if (_this.onResult) _this.onResult(webSpeechTranscript, finalText);
                                        }
                                        if (interimText !== undefined) {
                                            _this.interimTranscript = interimText;
                                            if (_this.onInterim) _this.onInterim(interimText);
                                        }
                                    };
                                    this.recognition.onerror = function(event) {
                                        if (event.error !== 'no-speech' && event.error !== 'aborted') {
                                            console.warn('[Web Speech] error:', event.error);
                                        }
                                    // Don't reject — let onend handle resolution
                                    };
                                    this.recognition.onend = function() {
                                        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(function() {
                                            var whisperText, best;
                                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
                                                switch(_state.label){
                                                    case 0:
                                                        webSpeechDone = true;
                                                        this.recognition = null;
                                                        if (language === 'en') {
                                                            // English: no Whisper needed, resolve immediately
                                                            resolveOnce(webSpeechTranscript);
                                                            this._stopRecorder();
                                                            return [
                                                                2
                                                            ];
                                                        }
                                                        // Non-English: stop recorder and try Whisper for better accuracy
                                                        this._stopRequested = true;
                                                        return [
                                                            4,
                                                            this._tryWhisper(language)
                                                        ];
                                                    case 1:
                                                        whisperText = _state.sent();
                                                        // Use Whisper result only if it's non-empty and longer/different
                                                        best = whisperText && whisperText.length > 0 ? whisperText : webSpeechTranscript;
                                                        console.log('[STT] WebSpeech="'.concat(webSpeechTranscript, '" Whisper="').concat(whisperText, '" → using "').concat(best, '"'));
                                                        resolveOnce(best);
                                                        return [
                                                            2
                                                        ];
                                                }
                                            });
                                        }).call(_this);
                                    };
                                    this.recognition.onstart = function() {
                                        _this.isListening = true;
                                    };
                                    try {
                                        this.recognition.start();
                                    } catch (err) {
                                        this.isListening = false;
                                        reject(err);
                                        return [
                                            2
                                        ];
                                    }
                                    if (!(language !== 'en' && navigator.mediaDevices)) return [
                                        3,
                                        4
                                    ];
                                    _state.label = 1;
                                case 1:
                                    _state.trys.push([
                                        1,
                                        3,
                                        ,
                                        4
                                    ]);
                                    _ = this;
                                    return [
                                        4,
                                        navigator.mediaDevices.getUserMedia({
                                            audio: true
                                        })
                                    ];
                                case 2:
                                    _.stream = _state.sent();
                                    mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
                                    this.mediaRecorder = new MediaRecorder(this.stream, {
                                        mimeType: mimeType
                                    });
                                    this.mediaRecorder.ondataavailable = function(e) {
                                        if (e.data && e.data.size > 0) _this.audioChunks.push(e.data);
                                    };
                                    this.mediaRecorder.start(200);
                                    return [
                                        3,
                                        4
                                    ];
                                case 3:
                                    e = _state.sent();
                                    // Microphone already held by recognition, or denied — skip recording
                                    console.warn('[STT] MediaRecorder could not start (OK — Web Speech still works):', e.message);
                                    this.stream = null;
                                    this.mediaRecorder = null;
                                    return [
                                        3,
                                        4
                                    ];
                                case 4:
                                    return [
                                        2
                                    ];
                            }
                        });
                    }).call(_this);
                });
            }
        },
        {
            // ─────────────────────────────────────────────────────────────────────────
            // Helpers
            // ─────────────────────────────────────────────────────────────────────────
            key: "_stopWebSpeechOnly",
            value: function _stopWebSpeechOnly() {
                if (this.recognition) {
                    try {
                        this.recognition.stop();
                    } catch (e) {}
                    this.recognition = null;
                }
            }
        },
        {
            key: "_stopRecorder",
            value: function _stopRecorder() {
                if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                    try {
                        this.mediaRecorder.stop();
                    } catch (e) {}
                }
                this.mediaRecorder = null;
                if (this.stream) {
                    this.stream.getTracks().forEach(function(t) {
                        return t.stop();
                    });
                    this.stream = null;
                }
                this.audioChunks = [];
            }
        },
        {
            key: "_tryWhisper",
            value: function _tryWhisper(language) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(function() {
                    var _this, _this_mediaRecorder, mimeType, blob, formData, controller, timeout, res, data, text, err;
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _this = this;
                                if (!(this.mediaRecorder && this.mediaRecorder.state !== 'inactive')) return [
                                    3,
                                    2
                                ];
                                return [
                                    4,
                                    new Promise(function(res) {
                                        _this.mediaRecorder.onstop = res;
                                        try {
                                            _this.mediaRecorder.stop();
                                        } catch (e) {
                                            res();
                                        }
                                    })
                                ];
                            case 1:
                                _state.sent();
                                _state.label = 2;
                            case 2:
                                if (this.stream) {
                                    this.stream.getTracks().forEach(function(t) {
                                        return t.stop();
                                    });
                                    this.stream = null;
                                }
                                if (this.audioChunks.length === 0) return [
                                    2,
                                    ''
                                ];
                                mimeType = ((_this_mediaRecorder = this.mediaRecorder) === null || _this_mediaRecorder === void 0 ? void 0 : _this_mediaRecorder.mimeType) || 'audio/webm';
                                blob = new Blob(this.audioChunks, {
                                    type: mimeType
                                });
                                this.audioChunks = [];
                                formData = new FormData();
                                formData.append('audio', blob, "stt.".concat(mimeType.includes('mp4') ? 'mp4' : 'webm'));
                                formData.append('language', language);
                                _state.label = 3;
                            case 3:
                                _state.trys.push([
                                    3,
                                    6,
                                    ,
                                    7
                                ]);
                                controller = new AbortController();
                                timeout = setTimeout(function() {
                                    return controller.abort();
                                }, 15000); // 15 s max
                                return [
                                    4,
                                    fetch("".concat(API_BASE, "/stt"), {
                                        method: 'POST',
                                        body: formData,
                                        signal: controller.signal
                                    })
                                ];
                            case 4:
                                res = _state.sent();
                                clearTimeout(timeout);
                                if (!res.ok) return [
                                    2,
                                    ''
                                ];
                                return [
                                    4,
                                    res.json()
                                ];
                            case 5:
                                data = _state.sent();
                                text = (data.transcript || '').trim();
                                if (text) console.log("[Whisper STT][".concat(language, '] "').concat(text, '"'));
                                return [
                                    2,
                                    text
                                ];
                            case 6:
                                err = _state.sent();
                                if (err.name !== 'AbortError') {
                                    console.warn('[Whisper STT] unreachable — Web Speech result will be used:', err.message);
                                }
                                return [
                                    2,
                                    ''
                                ];
                            case 7:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            // ─────────────────────────────────────────────────────────────────────────
            // Stop / Abort
            // ─────────────────────────────────────────────────────────────────────────
            key: "stopListening",
            value: function stopListening() {
                this._stopWebSpeechOnly(); // triggers onend → resolves the promise
                this._stopRecorder();
                this._stopRequested = true;
            }
        },
        {
            key: "abort",
            value: function abort() {
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
        },
        {
            key: "getTranscript",
            value: function getTranscript() {
                return this.transcript;
            }
        },
        {
            key: "getInterimTranscript",
            value: function getInterimTranscript() {
                return this.interimTranscript;
            }
        }
    ]);
    return STTEngine;
}();
// ============================================================
// AUDIO RECORDER (for sending audio to backend Whisper)
// ============================================================
var AudioRecorder = /*#__PURE__*/ function() {
    "use strict";
    function AudioRecorder() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_class_call_check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, AudioRecorder);
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.stream = null;
        this.isRecording = false;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_create_class$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(AudioRecorder, [
        {
            key: "startRecording",
            value: /**
     * Start recording audio
     * @returns {Promise<void>}
     */ function startRecording() {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(function() {
                    var _this, _, err;
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _this = this;
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    3,
                                    ,
                                    4
                                ]);
                                _ = this;
                                return [
                                    4,
                                    navigator.mediaDevices.getUserMedia({
                                        audio: true
                                    })
                                ];
                            case 2:
                                _.stream = _state.sent();
                                this.mediaRecorder = new MediaRecorder(this.stream, {
                                    mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
                                });
                                this.audioChunks = [];
                                this.mediaRecorder.ondataavailable = function(event) {
                                    if (event.data.size > 0) {
                                        _this.audioChunks.push(event.data);
                                    }
                                };
                                this.mediaRecorder.start(100); // Collect data every 100ms
                                this.isRecording = true;
                                return [
                                    3,
                                    4
                                ];
                            case 3:
                                err = _state.sent();
                                throw new Error("Microphone access denied: ".concat(err.message));
                            case 4:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            /**
     * Stop recording and return audio blob
     * @returns {Promise<Blob>}
     */ key: "stopRecording",
            value: function stopRecording() {
                var _this = this;
                return new Promise(function(resolve) {
                    if (!_this.mediaRecorder || _this.mediaRecorder.state === 'inactive') {
                        resolve(null);
                        return;
                    }
                    _this.mediaRecorder.onstop = function() {
                        var blob = new Blob(_this.audioChunks, {
                            type: 'audio/webm'
                        });
                        _this.audioChunks = [];
                        _this.isRecording = false;
                        // Stop all tracks
                        if (_this.stream) {
                            _this.stream.getTracks().forEach(function(track) {
                                return track.stop();
                            });
                            _this.stream = null;
                        }
                        resolve(blob);
                    };
                    _this.mediaRecorder.stop();
                });
            }
        },
        {
            /**
     * Cancel recording
     */ key: "cancelRecording",
            value: function cancelRecording() {
                if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                    this.mediaRecorder.stop();
                }
                this.audioChunks = [];
                this.isRecording = false;
                if (this.stream) {
                    this.stream.getTracks().forEach(function(track) {
                        return track.stop();
                    });
                    this.stream = null;
                }
            }
        }
    ]);
    return AudioRecorder;
}();
// ============================================================
// BACKEND API SERVICE
// ============================================================
var BackendAPI = {
    startTest: /**
     * Start a test session on the backend
     */ function startTest(userId, language, testType, age, educationLevel) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(function() {
            var response, err;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            3,
                            ,
                            4
                        ]);
                        return [
                            4,
                            fetch("".concat(API_BASE, "/test/start"), {
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
                            })
                        ];
                    case 1:
                        response = _state.sent();
                        return [
                            4,
                            response.json()
                        ];
                    case 2:
                        return [
                            2,
                            _state.sent()
                        ];
                    case 3:
                        err = _state.sent();
                        console.warn('Backend not available, using frontend-only mode:', err.message);
                        return [
                            2,
                            null
                        ];
                    case 4:
                        return [
                            2
                        ];
                }
            });
        })();
    },
    getQuestion: /**
     * Get next question from backend
     */ function getQuestion(sessionId) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(function() {
            var response, err;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            3,
                            ,
                            4
                        ]);
                        return [
                            4,
                            fetch("".concat(API_BASE, "/test/question?session_id=").concat(sessionId))
                        ];
                    case 1:
                        response = _state.sent();
                        return [
                            4,
                            response.json()
                        ];
                    case 2:
                        return [
                            2,
                            _state.sent()
                        ];
                    case 3:
                        err = _state.sent();
                        console.warn('Backend not available:', err.message);
                        return [
                            2,
                            null
                        ];
                    case 4:
                        return [
                            2
                        ];
                }
            });
        })();
    },
    submitAnswer: /**
     * Submit answer with transcript to backend for fuzzy matching
     */ function submitAnswer(sessionId, transcript, responseTime) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(function() {
            var response, err;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            3,
                            ,
                            4
                        ]);
                        return [
                            4,
                            fetch("".concat(API_BASE, "/test/answer"), {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    session_id: sessionId,
                                    transcript: transcript,
                                    response_time: responseTime
                                })
                            })
                        ];
                    case 1:
                        response = _state.sent();
                        return [
                            4,
                            response.json()
                        ];
                    case 2:
                        return [
                            2,
                            _state.sent()
                        ];
                    case 3:
                        err = _state.sent();
                        console.warn('Backend not available:', err.message);
                        return [
                            2,
                            null
                        ];
                    case 4:
                        return [
                            2
                        ];
                }
            });
        })();
    },
    classifyRisk: /**
     * Get risk classification from backend
     */ function classifyRisk(scores, age, educationLevel) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(function() {
            var response, err;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            3,
                            ,
                            4
                        ]);
                        return [
                            4,
                            fetch("".concat(API_BASE, "/test/risk"), {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    scores: scores,
                                    age: age,
                                    education_level: educationLevel
                                })
                            })
                        ];
                    case 1:
                        response = _state.sent();
                        return [
                            4,
                            response.json()
                        ];
                    case 2:
                        return [
                            2,
                            _state.sent()
                        ];
                    case 3:
                        err = _state.sent();
                        console.warn('Backend not available:', err.message);
                        return [
                            2,
                            null
                        ];
                    case 4:
                        return [
                            2
                        ];
                }
            });
        })();
    },
    fuzzyMatch: /**
     * Standalone fuzzy matching
     */ function fuzzyMatch(transcript, options) {
        var threshold = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 60;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(function() {
            var response, err;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            3,
                            ,
                            4
                        ]);
                        return [
                            4,
                            fetch("".concat(API_BASE, "/test/match"), {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    transcript: transcript,
                                    options: options,
                                    threshold: threshold
                                })
                            })
                        ];
                    case 1:
                        response = _state.sent();
                        return [
                            4,
                            response.json()
                        ];
                    case 2:
                        return [
                            2,
                            _state.sent()
                        ];
                    case 3:
                        err = _state.sent();
                        console.warn('Backend not available, using frontend fuzzy match:', err.message);
                        return [
                            2,
                            frontendFuzzyMatch(transcript, options, threshold)
                        ];
                    case 4:
                        return [
                            2
                        ];
                }
            });
        })();
    }
};
// ============================================================
// FRONTEND FALLBACK FUZZY MATCHING
// ============================================================
/**
 * Levenshtein distance for fuzzy matching (frontend fallback)
 */ function levenshteinDistance(a, b) {
    var matrix = [];
    for(var i = 0; i <= b.length; i++){
        matrix[i] = [
            i
        ];
    }
    for(var j = 0; j <= a.length; j++){
        matrix[0][j] = j;
    }
    for(var i1 = 1; i1 <= b.length; i1++){
        for(var j1 = 1; j1 <= a.length; j1++){
            if (b.charAt(i1 - 1) === a.charAt(j1 - 1)) {
                matrix[i1][j1] = matrix[i1 - 1][j1 - 1];
            } else {
                matrix[i1][j1] = Math.min(matrix[i1 - 1][j1 - 1] + 1, matrix[i1][j1 - 1] + 1, matrix[i1 - 1][j1] + 1);
            }
        }
    }
    return matrix[b.length][a.length];
}
/**
 * Frontend fuzzy matching fallback
 */ function frontendFuzzyMatch(transcript, options) {
    var threshold = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 60;
    if (!transcript || !options || !options.length) {
        return {
            matched_option: null,
            confidence: 0,
            original_transcript: transcript
        };
    }
    // Strip only punctuation (commas, periods, etc.) — NOT \w which kills non-ASCII scripts
    var normalise = function(s) {
        return s.trim().toLowerCase().replace(/[,\.!?;:"'()\[\]{}]+/g, '').trim();
    };
    var cleaned = normalise(transcript);
    var lowerOptions = options.map(function(o) {
        return normalise(o);
    });
    // 1. Exact full match
    var exactIdx = lowerOptions.indexOf(cleaned);
    if (exactIdx !== -1) {
        return {
            matched_option: options[exactIdx],
            confidence: 100,
            original_transcript: transcript
        };
    }
    // 2. For single-word options: check if the option word appears inside the transcript
    var transcriptWords = cleaned.split(/[\s,]+/).filter(Boolean);
    for(var i = 0; i < lowerOptions.length; i++){
        var opt = lowerOptions[i];
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
            var names = SYMBOL_MAP[opt];
            if (names.some(function(name) {
                return cleaned.includes(name.toLowerCase());
            })) {
                return {
                    matched_option: options[i],
                    confidence: 100,
                    original_transcript: transcript
                };
            }
        }
    }
    // 3. Fuzzy (Levenshtein) against each option
    var bestMatch = null;
    var bestScore = 0;
    for(var i1 = 0; i1 < lowerOptions.length; i1++){
        var opt1 = lowerOptions[i1];
        if (!opt1) continue;
        // Try matching against the full transcript AND each individual word in it
        var candidates = [
            cleaned
        ].concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(transcriptWords));
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = candidates[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var candidate = _step.value;
                var maxLen = Math.max(candidate.length, opt1.length);
                if (maxLen === 0) continue;
                var dist = levenshteinDistance(candidate, opt1);
                var score = Math.round((1 - dist / maxLen) * 100);
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = options[i1];
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
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
var ttsEngine = new TTSEngine();
var sttEngine = new STTEngine();
var audioRecorder = new AudioRecorder();
;
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/node_modules/@swc/helpers/esm/_async_to_generator.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/node_modules/@swc/helpers/esm/_object_spread.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/node_modules/@swc/helpers/esm/_object_spread_props.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/node_modules/@swc/helpers/esm/_sliced_to_array.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/node_modules/@swc/helpers/esm/_to_consumable_array.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/node_modules/@swc/helpers/esm/_type_of.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript) <export __generator as _>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$contexts$2f$LanguageContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/contexts/LanguageContext.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$contexts$2f$UserContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/contexts/UserContext.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/services/voiceService.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
var _s = __turbopack_context__.k.signature();
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
// Template questions (fallback when backend is not available)
var TEMPLATE_QUESTIONS = {
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
var TEST_TYPE_LABELS = {
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
    var _this = this;
    _s();
    var _useContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$contexts$2f$LanguageContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LanguageContext"]), language = _useContext.language, t = _useContext.t;
    var _useContext1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$contexts$2f$UserContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserContext"]), user = _useContext1.user, setTestResults = _useContext1.setTestResults;
    var router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Flow state
    var _useState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('select'), 2), phase = _useState[0], setPhase = _useState[1]; // select, testing, scoring, results
    var _useState1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null), 2), selectedTestType = _useState1[0], setSelectedTestType = _useState1[1];
    var _useState2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(language), 2), selectedLanguage = _useState2[0], setSelectedLanguage = _useState2[1];
    // Test state
    var _useState3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]), 2), questions = _useState3[0], setQuestions = _useState3[1];
    var _useState4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0), 2), currentQuestionIndex = _useState4[0], setCurrentQuestionIndex = _useState4[1];
    var _useState5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null), 2), sessionId = _useState5[0], setSessionId = _useState5[1];
    var _useState6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]), 2), answers = _useState6[0], setAnswers = _useState6[1];
    var _useState7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null), 2), questionStartTime = _useState7[0], setQuestionStartTime = _useState7[1];
    // Voice state
    var _useState8 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false), 2), isSpeaking = _useState8[0], setIsSpeaking = _useState8[1];
    var _useState9 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false), 2), isListening = _useState9[0], setIsListening = _useState9[1];
    var _useState10 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false), 2), isProcessing = _useState10[0], setIsProcessing = _useState10[1]; // Whisper STT upload in progress
    var _useState11 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(''), 2), transcript = _useState11[0], setTranscript = _useState11[1];
    var _useState12 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(''), 2), interimTranscript = _useState12[0], setInterimTranscript = _useState12[1];
    var _useState13 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null), 2), matchResult = _useState13[0], setMatchResult = _useState13[1];
    var _useState14 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        tts: false,
        stt: false
    }), 2), voiceSupported = _useState14[0], setVoiceSupported = _useState14[1];
    // Results state
    var _useState15 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({}), 2), domainScores = _useState15[0], setDomainScores = _useState15[1];
    var _useState16 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null), 2), riskResult = _useState16[0], setRiskResult = _useState16[1];
    var _useState17 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({}), 2), allTestResults = _useState17[0], setAllTestResults = _useState17[1];
    var _useState18 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]), 2), completedTests = _useState18[0], setCompletedTests = _useState18[1];
    // UI state
    var _useState19 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null), 2), feedback = _useState19[0], setFeedback = _useState19[1];
    var _useState20 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false), 2), showOptions = _useState20[0], setShowOptions = _useState20[1];
    var _useState21 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false), 2), backendAvailable = _useState21[0], setBackendAvailable = _useState21[1];
    var answeredRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Check voice support
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VoiceTestContainer.useEffect": function() {
            setVoiceSupported({
                tts: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ttsEngine"].isAvailable(),
                stt: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sttEngine"].isAvailable()
            });
        }
    }["VoiceTestContainer.useEffect"], []);
    // Check backend availability
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VoiceTestContainer.useEffect": function() {
            var checkBackend = {
                "VoiceTestContainer.useEffect.checkBackend": function() {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])({
                        "VoiceTestContainer.useEffect.checkBackend": function() {
                            var response, e;
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, {
                                "VoiceTestContainer.useEffect.checkBackend": function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            _state.trys.push([
                                                0,
                                                2,
                                                ,
                                                3
                                            ]);
                                            return [
                                                4,
                                                fetch('http://localhost:5000/api/health')
                                            ];
                                        case 1:
                                            response = _state.sent();
                                            if (response.ok) {
                                                setBackendAvailable(true);
                                            }
                                            return [
                                                3,
                                                3
                                            ];
                                        case 2:
                                            e = _state.sent();
                                            setBackendAvailable(false);
                                            return [
                                                3,
                                                3
                                            ];
                                        case 3:
                                            return [
                                                2
                                            ];
                                    }
                                }
                            }["VoiceTestContainer.useEffect.checkBackend"]);
                        }
                    }["VoiceTestContainer.useEffect.checkBackend"])();
                }
            }["VoiceTestContainer.useEffect.checkBackend"];
            checkBackend();
        }
    }["VoiceTestContainer.useEffect"], []);
    // ============================================================
    // TEST FLOW: Start a specific test
    // ============================================================
    var startTest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VoiceTestContainer.useCallback[startTest]": function(testType) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])({
                "VoiceTestContainer.useCallback[startTest]": function() {
                    var fetchedQuestions, result, qResult, qData, testData;
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, {
                        "VoiceTestContainer.useCallback[startTest]": function(_state) {
                            switch(_state.label){
                                case 0:
                                    setSelectedTestType(testType);
                                    setPhase('testing');
                                    setCurrentQuestionIndex(0);
                                    setAnswers([]);
                                    setTranscript('');
                                    setMatchResult(null);
                                    setFeedback(null);
                                    fetchedQuestions = null;
                                    if (!backendAvailable) return [
                                        3,
                                        4
                                    ];
                                    return [
                                        4,
                                        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BackendAPI"].startTest((user === null || user === void 0 ? void 0 : user.id) || 'guest', selectedLanguage, testType, user === null || user === void 0 ? void 0 : user.age, user === null || user === void 0 ? void 0 : user.educationLevel)
                                    ];
                                case 1:
                                    result = _state.sent();
                                    if (!(result && result.session_id)) return [
                                        3,
                                        4
                                    ];
                                    setSessionId(result.session_id);
                                    return [
                                        4,
                                        fetch("http://localhost:5000/api/questions?test_type=".concat(testType, "&language=").concat(selectedLanguage))
                                    ];
                                case 2:
                                    qResult = _state.sent();
                                    return [
                                        4,
                                        qResult.json()
                                    ];
                                case 3:
                                    qData = _state.sent();
                                    if (qData.questions && qData.questions.length > 0) {
                                        fetchedQuestions = qData.questions;
                                    }
                                    _state.label = 4;
                                case 4:
                                    // Fallback to template questions
                                    if (!fetchedQuestions) {
                                        testData = TEMPLATE_QUESTIONS[testType] || {};
                                        fetchedQuestions = testData[selectedLanguage] || testData['en'] || [];
                                    }
                                    setQuestions(fetchedQuestions);
                                    setQuestionStartTime(Date.now());
                                    return [
                                        2
                                    ];
                            }
                        }
                    }["VoiceTestContainer.useCallback[startTest]"]);
                }
            }["VoiceTestContainer.useCallback[startTest]"])();
        }
    }["VoiceTestContainer.useCallback[startTest]"], [
        backendAvailable,
        selectedLanguage,
        user
    ]);
    // ============================================================
    // VOICE: Read question aloud
    // ============================================================
    var readQuestionAloud = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VoiceTestContainer.useCallback[readQuestionAloud]": function(questionText) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])({
                "VoiceTestContainer.useCallback[readQuestionAloud]": function() {
                    var err;
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, {
                        "VoiceTestContainer.useCallback[readQuestionAloud]": function(_state) {
                            switch(_state.label){
                                case 0:
                                    if (!voiceSupported.tts) return [
                                        2
                                    ];
                                    setIsSpeaking(true);
                                    _state.label = 1;
                                case 1:
                                    _state.trys.push([
                                        1,
                                        3,
                                        ,
                                        4
                                    ]);
                                    return [
                                        4,
                                        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ttsEngine"].speak(questionText, selectedLanguage, {
                                            rate: 0.85
                                        })
                                    ];
                                case 2:
                                    _state.sent();
                                    return [
                                        3,
                                        4
                                    ];
                                case 3:
                                    err = _state.sent();
                                    console.warn('TTS failed:', err);
                                    return [
                                        3,
                                        4
                                    ];
                                case 4:
                                    setIsSpeaking(false);
                                    return [
                                        2
                                    ];
                            }
                        }
                    }["VoiceTestContainer.useCallback[readQuestionAloud]"]);
                }
            }["VoiceTestContainer.useCallback[readQuestionAloud]"])();
        }
    }["VoiceTestContainer.useCallback[readQuestionAloud]"], [
        voiceSupported.tts,
        selectedLanguage
    ]);
    // Auto-read question when it changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VoiceTestContainer.useEffect": function() {
            if (phase === 'testing' && questions.length > 0 && currentQuestionIndex < questions.length) {
                var question = questions[currentQuestionIndex];
                answeredRef.current = false;
                setTranscript('');
                setInterimTranscript('');
                setMatchResult(null);
                setFeedback(null);
                setShowOptions(false);
                setIsProcessing(false);
                setQuestionStartTime(Date.now());
                // Read question aloud after a short delay
                var timer = setTimeout({
                    "VoiceTestContainer.useEffect.timer": function() {
                        readQuestionAloud(question.question);
                        // Show options after TTS finishes (or after delay)
                        setTimeout({
                            "VoiceTestContainer.useEffect.timer": function() {
                                return setShowOptions(true);
                            }
                        }["VoiceTestContainer.useEffect.timer"], 1000);
                    }
                }["VoiceTestContainer.useEffect.timer"], 500);
                return ({
                    "VoiceTestContainer.useEffect": function() {
                        return clearTimeout(timer);
                    }
                })["VoiceTestContainer.useEffect"];
            }
        }
    }["VoiceTestContainer.useEffect"], [
        phase,
        currentQuestionIndex,
        questions,
        readQuestionAloud
    ]);
    // ============================================================
    // ANSWER PROCESSING: Fuzzy matching + scoring
    // (Defined BEFORE startListening since it's a dependency)
    // ============================================================
    var processAnswer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VoiceTestContainer.useCallback[processAnswer]": function(spokenText) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])({
                "VoiceTestContainer.useCallback[processAnswer]": function() {
                    var question, responseTime, isCorrect, matchedOption, confidence, wordsToCheck, options, result, _result_answer_result, _result_answer_result1, _result_answer_result2, wordsToFind, matched, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, expectedWord, result1, correctWords, correctCount, options1, result2, _result_answer_result3, _result_answer_result4, _result_answer_result5, result3, expected, words, matched1, _iteratorNormalCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, word, result4, result5, spokenNumbers, correctSeq, matchCount, i, result6, answerRecord, correctAnswer, feedbackText;
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, {
                        "VoiceTestContainer.useCallback[processAnswer]": function(_state) {
                            switch(_state.label){
                                case 0:
                                    if (answeredRef.current) return [
                                        2
                                    ];
                                    answeredRef.current = true;
                                    question = questions[currentQuestionIndex];
                                    if (!question) return [
                                        2
                                    ];
                                    responseTime = (Date.now() - questionStartTime) / 1000;
                                    isCorrect = false;
                                    matchedOption = null;
                                    confidence = 0;
                                    if (!(question.response_format === 'voice_recall')) return [
                                        3,
                                        4
                                    ];
                                    // Multi-word recall matching
                                    wordsToCheck = question.words_to_remember || [];
                                    options = question.options || wordsToCheck;
                                    if (!(backendAvailable && sessionId)) return [
                                        3,
                                        2
                                    ];
                                    return [
                                        4,
                                        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BackendAPI"].submitAnswer(sessionId, spokenText, responseTime)
                                    ];
                                case 1:
                                    result = _state.sent();
                                    if (result) {
                                        ;
                                        matchedOption = (_result_answer_result = result.answer_result) === null || _result_answer_result === void 0 ? void 0 : _result_answer_result.matched;
                                        isCorrect = (_result_answer_result1 = result.answer_result) === null || _result_answer_result1 === void 0 ? void 0 : _result_answer_result1.is_correct;
                                        confidence = ((_result_answer_result2 = result.answer_result) === null || _result_answer_result2 === void 0 ? void 0 : _result_answer_result2.confidence) || 0;
                                    }
                                    return [
                                        3,
                                        3
                                    ];
                                case 2:
                                    // Frontend fallback for voice_recall
                                    // Pass the FULL spoken transcript to frontendFuzzyMatch for each expected word.
                                    // This handles "ஆப்பிள் நாற்காலி நதி" matching all three individual words.
                                    wordsToFind = wordsToCheck.length > 0 ? wordsToCheck : options;
                                    matched = [];
                                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                    try {
                                        for(_iterator = wordsToFind[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                            expectedWord = _step.value;
                                            // Check if this expected word is contained in the spoken transcript
                                            result1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["frontendFuzzyMatch"])(spokenText, [
                                                expectedWord
                                            ]);
                                            if (result1.matched_option && result1.confidence >= 50) {
                                                matched.push(expectedWord);
                                            }
                                        }
                                    } catch (err) {
                                        _didIteratorError = true;
                                        _iteratorError = err;
                                    } finally{
                                        try {
                                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                                _iterator.return();
                                            }
                                        } finally{
                                            if (_didIteratorError) {
                                                throw _iteratorError;
                                            }
                                        }
                                    }
                                    matchedOption = matched;
                                    correctWords = wordsToCheck.map({
                                        "VoiceTestContainer.useCallback[processAnswer]": function(w) {
                                            return w.toLowerCase();
                                        }
                                    }["VoiceTestContainer.useCallback[processAnswer]"]);
                                    correctCount = matched.filter({
                                        "VoiceTestContainer.useCallback[processAnswer]": function(m) {
                                            return correctWords.includes(m.toLowerCase());
                                        }
                                    }["VoiceTestContainer.useCallback[processAnswer]"]).length;
                                    isCorrect = correctCount > 0;
                                    confidence = correctWords.length > 0 ? Math.round(correctCount / correctWords.length * 100) : 0;
                                    _state.label = 3;
                                case 3:
                                    return [
                                        3,
                                        9
                                    ];
                                case 4:
                                    if (!(question.response_format === 'voice_select')) return [
                                        3,
                                        8
                                    ];
                                    // Single option matching
                                    options1 = question.options || [];
                                    if (!(backendAvailable && sessionId)) return [
                                        3,
                                        6
                                    ];
                                    return [
                                        4,
                                        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BackendAPI"].submitAnswer(sessionId, spokenText, responseTime)
                                    ];
                                case 5:
                                    result2 = _state.sent();
                                    if (result2) {
                                        ;
                                        matchedOption = (_result_answer_result3 = result2.answer_result) === null || _result_answer_result3 === void 0 ? void 0 : _result_answer_result3.matched;
                                        isCorrect = (_result_answer_result4 = result2.answer_result) === null || _result_answer_result4 === void 0 ? void 0 : _result_answer_result4.is_correct;
                                        confidence = ((_result_answer_result5 = result2.answer_result) === null || _result_answer_result5 === void 0 ? void 0 : _result_answer_result5.confidence) || 0;
                                    }
                                    return [
                                        3,
                                        7
                                    ];
                                case 6:
                                    result3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["frontendFuzzyMatch"])(spokenText, options1);
                                    matchedOption = result3.matched_option;
                                    confidence = result3.confidence;
                                    isCorrect = matchedOption && matchedOption.toLowerCase() === (question.correct_answer || '').toLowerCase();
                                    _state.label = 7;
                                case 7:
                                    return [
                                        3,
                                        9
                                    ];
                                case 8:
                                    if (question.response_format === 'voice_free') {
                                        // Free-form matching
                                        expected = question.expected_keywords || [];
                                        if (expected.length > 0) {
                                            words = spokenText.toLowerCase().split(/[\s,]+/);
                                            matched1 = [];
                                            _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                                            try {
                                                for(_iterator1 = words[Symbol.iterator](); !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                                                    word = _step1.value;
                                                    result4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["frontendFuzzyMatch"])(word, expected);
                                                    if (result4.matched_option && result4.confidence >= 50) {
                                                        matched1.push(result4.matched_option);
                                                    }
                                                }
                                            } catch (err) {
                                                _didIteratorError1 = true;
                                                _iteratorError1 = err;
                                            } finally{
                                                try {
                                                    if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                                        _iterator1.return();
                                                    }
                                                } finally{
                                                    if (_didIteratorError1) {
                                                        throw _iteratorError1;
                                                    }
                                                }
                                            }
                                            matchedOption = matched1;
                                            isCorrect = matched1.length > 0;
                                            confidence = Math.min(100, matched1.length * 10);
                                        } else {
                                            // Compare with correct_answer
                                            result5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["frontendFuzzyMatch"])(spokenText, [
                                                question.correct_answer || ''
                                            ]);
                                            matchedOption = result5.matched_option;
                                            isCorrect = result5.confidence >= 60;
                                            confidence = result5.confidence;
                                        }
                                    } else if (question.response_format === 'voice_sequence') {
                                        // Sequence matching
                                        spokenNumbers = spokenText.replace(/[^\d\s]/g, '').split(/\s+/).filter(Boolean);
                                        correctSeq = question.correct_sequence || [];
                                        matchCount = 0;
                                        for(i = 0; i < Math.min(spokenNumbers.length, correctSeq.length); i++){
                                            if (spokenNumbers[i] === correctSeq[i]) matchCount++;
                                        }
                                        matchedOption = spokenNumbers.join(', ');
                                        isCorrect = matchCount === correctSeq.length;
                                        confidence = correctSeq.length > 0 ? Math.round(matchCount / correctSeq.length * 100) : 0;
                                    }
                                    _state.label = 9;
                                case 9:
                                    // Store the match result
                                    result6 = {
                                        matched_option: matchedOption,
                                        confidence: confidence,
                                        is_correct: isCorrect,
                                        original_transcript: spokenText
                                    };
                                    setMatchResult(result6);
                                    // Record the answer
                                    answerRecord = {
                                        question_id: question.id,
                                        question_index: currentQuestionIndex,
                                        transcript: spokenText,
                                        matched: matchedOption,
                                        is_correct: isCorrect,
                                        confidence: confidence,
                                        response_time: responseTime,
                                        keyword_count: Array.isArray(matchedOption) ? matchedOption.length : matchedOption ? 1 : 0
                                    };
                                    setAnswers({
                                        "VoiceTestContainer.useCallback[processAnswer]": function(prev) {
                                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(prev).concat([
                                                answerRecord
                                            ]);
                                        }
                                    }["VoiceTestContainer.useCallback[processAnswer]"]);
                                    // Show feedback
                                    setFeedback({
                                        isCorrect: isCorrect,
                                        message: isCorrect ? selectedLanguage === 'ta' ? 'சரி! ✓' : selectedLanguage === 'hi' ? 'सही! ✓' : selectedLanguage === 'te' ? 'సరైనది! ✓' : 'Correct! ✓' : selectedLanguage === 'ta' ? 'தவறு ✗' : selectedLanguage === 'hi' ? 'गलत ✗' : selectedLanguage === 'te' ? 'తప్పు ✗' : 'Incorrect ✗',
                                        correctAnswer: question.correct_answer || (question.words_to_remember || []).join(', '),
                                        matched: matchedOption
                                    });
                                    // Read feedback aloud — in the selected language
                                    if (voiceSupported.tts) {
                                        correctAnswer = question.correct_answer || (question.words_to_remember || []).join(', ');
                                        feedbackText = isCorrect ? ({
                                            ta: 'சரி!',
                                            hi: 'सही!',
                                            te: 'సరైనది!',
                                            bn: 'সঠিক!'
                                        })[selectedLanguage] || 'Correct!' : ({
                                            ta: "தவறு. சரியான விடை: ".concat(correctAnswer),
                                            hi: "गलत। सही उत्तर है: ".concat(correctAnswer),
                                            te: "తప్పు. సరైన సమాధానం: ".concat(correctAnswer),
                                            bn: "ভুল। সঠিক উত্তর: ".concat(correctAnswer)
                                        })[selectedLanguage] || "Incorrect. The answer is: ".concat(correctAnswer);
                                        setTimeout({
                                            "VoiceTestContainer.useCallback[processAnswer]": function() {
                                                __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ttsEngine"].speak(feedbackText, selectedLanguage, {
                                                    rate: 1.0
                                                }).catch({
                                                    "VoiceTestContainer.useCallback[processAnswer]": function() {}
                                                }["VoiceTestContainer.useCallback[processAnswer]"]);
                                            }
                                        }["VoiceTestContainer.useCallback[processAnswer]"], 500);
                                    }
                                    return [
                                        2
                                    ];
                            }
                        }
                    }["VoiceTestContainer.useCallback[processAnswer]"]);
                }
            }["VoiceTestContainer.useCallback[processAnswer]"])();
        }
    }["VoiceTestContainer.useCallback[processAnswer]"], [
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
    var startListening = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VoiceTestContainer.useCallback[startListening]": function() {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])({
                "VoiceTestContainer.useCallback[startListening]": function() {
                    var finalTranscript, err;
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, {
                        "VoiceTestContainer.useCallback[startListening]": function(_state) {
                            switch(_state.label){
                                case 0:
                                    if (!voiceSupported.stt || isListening || isProcessing) return [
                                        2
                                    ];
                                    // Stop TTS if still speaking
                                    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ttsEngine"].stop();
                                    setIsSpeaking(false);
                                    setIsListening(true);
                                    setIsProcessing(false);
                                    setTranscript('');
                                    setInterimTranscript('');
                                    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sttEngine"].onResult = ({
                                        "VoiceTestContainer.useCallback[startListening]": function(fullTranscript, latest) {
                                            setTranscript(fullTranscript);
                                        }
                                    })["VoiceTestContainer.useCallback[startListening]"];
                                    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sttEngine"].onInterim = ({
                                        "VoiceTestContainer.useCallback[startListening]": function(interim) {
                                            setInterimTranscript(interim);
                                        }
                                    })["VoiceTestContainer.useCallback[startListening]"];
                                    _state.label = 1;
                                case 1:
                                    _state.trys.push([
                                        1,
                                        3,
                                        ,
                                        4
                                    ]);
                                    return [
                                        4,
                                        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sttEngine"].startListening(selectedLanguage, {
                                            continuous: false,
                                            interimResults: true
                                        })
                                    ];
                                case 2:
                                    finalTranscript = _state.sent();
                                    setIsListening(false);
                                    setIsProcessing(false);
                                    if (finalTranscript && !answeredRef.current) {
                                        processAnswer(finalTranscript);
                                    }
                                    return [
                                        3,
                                        4
                                    ];
                                case 3:
                                    err = _state.sent();
                                    console.warn('STT failed:', err);
                                    setIsListening(false);
                                    setIsProcessing(false);
                                    return [
                                        3,
                                        4
                                    ];
                                case 4:
                                    return [
                                        2
                                    ];
                            }
                        }
                    }["VoiceTestContainer.useCallback[startListening]"]);
                }
            }["VoiceTestContainer.useCallback[startListening]"])();
        }
    }["VoiceTestContainer.useCallback[startListening]"], [
        voiceSupported.stt,
        isListening,
        isProcessing,
        selectedLanguage,
        processAnswer
    ]);
    var stopListening = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VoiceTestContainer.useCallback[stopListening]": function() {
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sttEngine"].stopListening();
            setIsListening(false);
            setIsProcessing(false);
        }
    }["VoiceTestContainer.useCallback[stopListening]"], []);
    // ============================================================
    // SCORING: Finish current test
    // (Defined BEFORE goToNextQuestion since it's a dependency)
    // ============================================================
    var finishCurrentTest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VoiceTestContainer.useCallback[finishCurrentTest]": function() {
            // Calculate domain score
            var correct = answers.filter({
                "VoiceTestContainer.useCallback[finishCurrentTest]": function(a) {
                    return a.is_correct;
                }
            }["VoiceTestContainer.useCallback[finishCurrentTest]"]).length;
            var total = answers.length;
            var avgConfidence = total > 0 ? answers.reduce({
                "VoiceTestContainer.useCallback[finishCurrentTest]": function(sum, a) {
                    return sum + a.confidence;
                }
            }["VoiceTestContainer.useCallback[finishCurrentTest]"], 0) / total : 0;
            var avgResponseTime = total > 0 ? answers.reduce({
                "VoiceTestContainer.useCallback[finishCurrentTest]": function(sum, a) {
                    return sum + a.response_time;
                }
            }["VoiceTestContainer.useCallback[finishCurrentTest]"], 0) / total : 0;
            var baseScore = total > 0 ? Math.round(correct / total * 100) : 0;
            // Apply bonuses based on test type
            var bonus = 0;
            if (selectedTestType === 'memory') {
                if (avgResponseTime < 5) bonus = 5;
                else if (avgResponseTime < 10) bonus = 2;
            } else if (selectedTestType === 'attention') {
                bonus = Math.max(0, Math.min(15, Math.round(15 - avgResponseTime * 3)));
            } else if (selectedTestType === 'language') {
                var keywordMatches = answers.reduce({
                    "VoiceTestContainer.useCallback[finishCurrentTest].keywordMatches": function(sum, a) {
                        return sum + (a.keyword_count || 0);
                    }
                }["VoiceTestContainer.useCallback[finishCurrentTest].keywordMatches"], 0);
                bonus = Math.min(10, keywordMatches * 2);
            }
            var finalScore = Math.min(100, baseScore + bonus);
            var scoreResult = {
                score: finalScore,
                details: {
                    correct: correct,
                    total: total,
                    baseScore: baseScore,
                    bonus: bonus,
                    avgConfidence: Math.round(avgConfidence),
                    avgResponseTime: Math.round(avgResponseTime * 10) / 10
                }
            };
            // Store result
            setDomainScores({
                "VoiceTestContainer.useCallback[finishCurrentTest]": function(prev) {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])({}, prev), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])({}, selectedTestType, finalScore));
                }
            }["VoiceTestContainer.useCallback[finishCurrentTest]"]);
            setAllTestResults({
                "VoiceTestContainer.useCallback[finishCurrentTest]": function(prev) {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])({}, prev), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])({}, selectedTestType, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])({}, scoreResult), {
                        answers: answers
                    })));
                }
            }["VoiceTestContainer.useCallback[finishCurrentTest]"]);
            setCompletedTests({
                "VoiceTestContainer.useCallback[finishCurrentTest]": function(prev) {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(prev).concat([
                        selectedTestType
                    ]);
                }
            }["VoiceTestContainer.useCallback[finishCurrentTest]"]);
            // Go to scoring phase
            setPhase('scoring');
        }
    }["VoiceTestContainer.useCallback[finishCurrentTest]"], [
        answers,
        selectedTestType
    ]);
    // ============================================================
    // NAVIGATION
    // (Defined AFTER finishCurrentTest since it depends on it)
    // ============================================================
    var goToNextQuestion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VoiceTestContainer.useCallback[goToNextQuestion]": function() {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex({
                    "VoiceTestContainer.useCallback[goToNextQuestion]": function(prev) {
                        return prev + 1;
                    }
                }["VoiceTestContainer.useCallback[goToNextQuestion]"]);
            } else {
                // Test domain complete — calculate score
                finishCurrentTest();
            }
        }
    }["VoiceTestContainer.useCallback[goToNextQuestion]"], [
        currentQuestionIndex,
        questions.length,
        finishCurrentTest
    ]);
    // ============================================================
    // RISK CLASSIFICATION: Calculate final results
    // (Defined BEFORE startNextTest since it's a dependency)
    // ============================================================
    var testTypes = [
        'memory',
        'attention',
        'language',
        'visuospatial'
    ];
    var calculateFinalResults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VoiceTestContainer.useCallback[calculateFinalResults]": function() {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])({
                "VoiceTestContainer.useCallback[calculateFinalResults]": function() {
                    var scores, result, weights, bhi, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step_value, domain, weight, riskLevel, riskDescription, recommendations, resultsObj;
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, {
                        "VoiceTestContainer.useCallback[calculateFinalResults]": function(_state) {
                            switch(_state.label){
                                case 0:
                                    setPhase('results');
                                    scores = {
                                        memory: domainScores.memory || 0,
                                        attention: domainScores.attention || 0,
                                        language: domainScores.language || 0,
                                        visuospatial: domainScores.visuospatial || 0
                                    };
                                    if (!backendAvailable) return [
                                        3,
                                        2
                                    ];
                                    return [
                                        4,
                                        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BackendAPI"].classifyRisk(scores, user === null || user === void 0 ? void 0 : user.age, user === null || user === void 0 ? void 0 : user.educationLevel)
                                    ];
                                case 1:
                                    result = _state.sent();
                                    if (result) {
                                        setRiskResult(result);
                                        return [
                                            2
                                        ];
                                    }
                                    _state.label = 2;
                                case 2:
                                    // Frontend fallback risk classification
                                    weights = {
                                        memory: 0.30,
                                        attention: 0.25,
                                        language: 0.25,
                                        visuospatial: 0.20
                                    };
                                    bhi = 0;
                                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                    try {
                                        for(_iterator = Object.entries(weights)[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                            _step_value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(_step.value, 2), domain = _step_value[0], weight = _step_value[1];
                                            bhi += (scores[domain] || 0) * weight;
                                        }
                                    } catch (err) {
                                        _didIteratorError = true;
                                        _iteratorError = err;
                                    } finally{
                                        try {
                                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                                _iterator.return();
                                            }
                                        } finally{
                                            if (_didIteratorError) {
                                                throw _iteratorError;
                                            }
                                        }
                                    }
                                    bhi = Math.round(bhi * 10) / 10;
                                    riskLevel = 'Normal';
                                    riskDescription = 'Your cognitive function appears to be within normal range.';
                                    if (bhi < 55) {
                                        riskLevel = 'High Risk';
                                        riskDescription = 'Several areas show below-average performance. We recommend consulting a neurologist.';
                                    } else if (bhi < 75) {
                                        riskLevel = 'MCI';
                                        riskDescription = 'Some areas may benefit from monitoring. Consider consulting a healthcare provider.';
                                    }
                                    recommendations = [];
                                    if (scores.memory < 70) recommendations.push('Practice memory exercises daily.');
                                    if (scores.attention < 70) recommendations.push('Try mindfulness meditation and focus exercises.');
                                    if (scores.language < 70) recommendations.push('Read regularly and practice word games.');
                                    if (scores.visuospatial < 70) recommendations.push('Engage in puzzles and spatial reasoning activities.');
                                    if (recommendations.length === 0) {
                                        recommendations.push('Maintain your cognitive health with regular mental exercises.');
                                    }
                                    resultsObj = {
                                        risk_level: riskLevel,
                                        brain_health_index: bhi,
                                        risk_description: riskDescription,
                                        recommendations: recommendations,
                                        domain_scores: scores,
                                        allTestResults: allTestResults,
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
                                    return [
                                        2
                                    ];
                            }
                        }
                    }["VoiceTestContainer.useCallback[calculateFinalResults]"]);
                }
            }["VoiceTestContainer.useCallback[calculateFinalResults]"])();
        }
    }["VoiceTestContainer.useCallback[calculateFinalResults]"], [
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
    var startNextTest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VoiceTestContainer.useCallback[startNextTest]": function() {
            var remaining = testTypes.filter({
                "VoiceTestContainer.useCallback[startNextTest].remaining": function(t) {
                    return !completedTests.includes(t);
                }
            }["VoiceTestContainer.useCallback[startNextTest].remaining"]);
            if (remaining.length > 0) {
                setPhase('select');
            } else {
                // All tests complete — calculate risk
                calculateFinalResults();
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["VoiceTestContainer.useCallback[startNextTest]"], [
        completedTests,
        calculateFinalResults
    ]);
    // ============================================================
    // SELECT OPTION MANUALLY (tap/click fallback)
    // ============================================================
    var handleOptionClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VoiceTestContainer.useCallback[handleOptionClick]": function(option) {
            if (answeredRef.current) return;
            setTranscript(option);
            processAnswer(option);
        }
    }["VoiceTestContainer.useCallback[handleOptionClick]"], [
        processAnswer
    ]);
    // ============================================================
    // RENDER: Test Selection Phase
    // ============================================================
    var renderSelectPhase = function() {
        var labels = TEST_TYPE_LABELS[selectedLanguage] || TEST_TYPE_LABELS['en'];
        var remaining = testTypes.filter(function(t) {
            return !completedTests.includes(t);
        });
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "voice-test-select",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "select-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: [
                                "🧠 ",
                                selectedLanguage === 'ta' ? 'மூளை ஆரோக்கிய சோதனை' : selectedLanguage === 'hi' ? 'मस्तिष्क स्वास्थ्य परीक्षण' : selectedLanguage === 'te' ? 'మెదడు ఆరోగ్య పరీక్ష' : 'Brain Health Test'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 779,
                            columnNumber: 21
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "select-subtitle",
                            children: selectedLanguage === 'ta' ? 'சோதனை வகையைத் தேர்ந்தெடுக்கவும்' : selectedLanguage === 'hi' ? 'परीक्षण प्रकार चुनें' : selectedLanguage === 'te' ? 'పరీక్ష రకం ఎంచుకోండి' : 'Select a test to begin'
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 780,
                            columnNumber: 21
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 778,
                    columnNumber: 17
                }, _this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "language-select-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "lang-label",
                            children: selectedLanguage === 'ta' ? 'மொழி:' : selectedLanguage === 'hi' ? 'भाषा:' : selectedLanguage === 'te' ? 'భాష:' : 'Language:'
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 787,
                            columnNumber: 21
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: selectedLanguage,
                            onChange: function(e) {
                                return setSelectedLanguage(e.target.value);
                            },
                            className: "lang-select",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "en",
                                    children: "English"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 795,
                                    columnNumber: 25
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "ta",
                                    children: "தமிழ் (Tamil)"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 796,
                                    columnNumber: 25
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "hi",
                                    children: "हिन्दी (Hindi)"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 797,
                                    columnNumber: 25
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "te",
                                    children: "తెలుగు (Telugu)"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 798,
                                    columnNumber: 25
                                }, _this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 790,
                            columnNumber: 21
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 786,
                    columnNumber: 17
                }, _this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "voice-status",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "status-dot ".concat(voiceSupported.tts ? 'active' : 'inactive')
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 804,
                            columnNumber: 21
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                "Voice Output (TTS): ",
                                voiceSupported.tts ? 'Available' : 'Not Available'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 805,
                            columnNumber: 21
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "status-dot ".concat(voiceSupported.stt ? 'active' : 'inactive')
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 806,
                            columnNumber: 21
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                "Voice Input (STT): ",
                                voiceSupported.stt ? 'Available' : 'Not Available'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 807,
                            columnNumber: 21
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "status-dot ".concat(backendAvailable ? 'active' : 'inactive')
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 808,
                            columnNumber: 21
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                "Backend: ",
                                backendAvailable ? 'Connected' : 'Offline (using local mode)'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 809,
                            columnNumber: 21
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 803,
                    columnNumber: 17
                }, _this),
                completedTests.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "completed-tests",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                            children: "Completed:"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 815,
                            columnNumber: 25
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "completed-pills",
                            children: completedTests.map(function(test) {
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                }, _this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 816,
                            columnNumber: 25
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 814,
                    columnNumber: 21
                }, _this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "test-type-grid",
                    children: testTypes.map(function(type) {
                        var isCompleted = completedTests.includes(type);
                        var icons = {
                            memory: '🧠',
                            attention: '👁️',
                            language: '💬',
                            visuospatial: '🔷'
                        };
                        var descs = {
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
                        var desc = (descs[selectedLanguage] || descs['en'])[type];
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "test-type-card ".concat(isCompleted ? 'completed' : ''),
                            onClick: function() {
                                return !isCompleted && startTest(type);
                            },
                            disabled: isCompleted,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "test-type-icon",
                                    children: icons[type]
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 846,
                                    columnNumber: 33
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: labels[type]
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 847,
                                    columnNumber: 33
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: desc
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 848,
                                    columnNumber: 33
                                }, _this),
                                isCompleted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                }, _this)
                            ]
                        }, type, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 840,
                            columnNumber: 29
                        }, _this);
                    })
                }, void 0, false, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 827,
                    columnNumber: 17
                }, _this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "select-actions",
                    children: [
                        remaining.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn-primary",
                            onClick: calculateFinalResults,
                            children: selectedLanguage === 'ta' ? 'முடிவுகளைக் காண்க' : selectedLanguage === 'hi' ? 'परिणाम देखें' : selectedLanguage === 'te' ? 'ఫలితాలు చూడండి' : 'View Final Results'
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 860,
                            columnNumber: 25
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn-secondary",
                            onClick: function() {
                                return router.push('/dashboard');
                            },
                            children: t('cancel', 'Cancel')
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 864,
                            columnNumber: 21
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 858,
                    columnNumber: 17
                }, _this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
            lineNumber: 777,
            columnNumber: 13
        }, _this);
    };
    // ============================================================
    // RENDER: Testing Phase (Voice-Enabled Questions)
    // ============================================================
    var renderTestingPhase = function() {
        if (questions.length === 0) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "loading-state",
            children: "Loading questions..."
        }, void 0, false, {
            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
            lineNumber: 877,
            columnNumber: 44
        }, _this);
        var question = questions[currentQuestionIndex];
        var progress = Math.round(currentQuestionIndex / questions.length * 100);
        var labels = TEST_TYPE_LABELS[selectedLanguage] || TEST_TYPE_LABELS['en'];
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "voice-test-active",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "test-active-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            children: labels[selectedTestType]
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 887,
                            columnNumber: 21
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "test-progress-bar",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "progress-track",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "progress-fill",
                                        style: {
                                            width: "".concat(progress, "%")
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                        lineNumber: 890,
                                        columnNumber: 29
                                    }, _this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 889,
                                    columnNumber: 25
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                }, _this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 888,
                            columnNumber: 21
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 886,
                    columnNumber: 17
                }, _this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "question-card",
                    children: [
                        isSpeaking && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "speaking-indicator",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "sound-wave",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                            lineNumber: 902,
                                            columnNumber: 33
                                        }, _this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                            lineNumber: 902,
                                            columnNumber: 46
                                        }, _this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                            lineNumber: 902,
                                            columnNumber: 59
                                        }, _this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                            lineNumber: 902,
                                            columnNumber: 72
                                        }, _this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                            lineNumber: 902,
                                            columnNumber: 85
                                        }, _this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 901,
                                    columnNumber: 29
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "speaking-text",
                                    children: selectedLanguage === 'ta' ? 'கேட்கிறது...' : selectedLanguage === 'hi' ? 'सुनिए...' : selectedLanguage === 'te' ? 'వింటోంది...' : 'Listening...'
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 904,
                                    columnNumber: 29
                                }, _this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 900,
                            columnNumber: 25
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "question-text",
                            children: question.question
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 910,
                            columnNumber: 21
                        }, _this),
                        question.type === 'stroop' && question.display_word && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "stroop-display",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "stroop-word",
                                style: {
                                    color: question.display_color
                                },
                                children: question.display_word
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                lineNumber: 915,
                                columnNumber: 29
                            }, _this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 914,
                            columnNumber: 25
                        }, _this),
                        question.display_pattern && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pattern-display",
                            children: question.display_pattern.map(function(item, i) {
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "pattern-item ".concat(item === '?' ? 'pattern-unknown' : ''),
                                    children: item
                                }, i, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 925,
                                    columnNumber: 33
                                }, _this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 923,
                            columnNumber: 25
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn-replay",
                            onClick: function() {
                                return readQuestionAloud(question.question);
                            },
                            disabled: isSpeaking,
                            children: [
                                "🔊 ",
                                selectedLanguage === 'ta' ? 'மீட்டமை' : selectedLanguage === 'hi' ? 'दोहराएं' : selectedLanguage === 'te' ? 'రీప్లే' : 'Replay'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 933,
                            columnNumber: 21
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 897,
                    columnNumber: 17
                }, _this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "voice-input-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "mic-button ".concat(isListening ? 'listening' : '', " ").concat(isProcessing ? 'processing' : ''),
                            onClick: isListening ? stopListening : startListening,
                            disabled: answeredRef.current || isProcessing,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "mic-icon",
                                    children: isProcessing ? '⏳' : isListening ? '⏹️' : '🎤'
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 950,
                                    columnNumber: 25
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "mic-label",
                                    children: isProcessing ? selectedLanguage === 'ta' ? 'எழுதுகிறது...' : selectedLanguage === 'hi' ? 'लिप्यंतरण...' : selectedLanguage === 'te' ? 'లిప్యంతరీకరణ...' : 'Transcribing...' : isListening ? selectedLanguage === 'ta' ? 'பேசுங்கள்... (நிறுத்த அழுத்தவும்)' : selectedLanguage === 'hi' ? 'बोलिए... (रोकने के लिए दबाएं)' : selectedLanguage === 'te' ? 'మాట్లాడండి... (ఆపడానికి నొక్కండి)' : 'Speaking... (tap to stop)' : selectedLanguage === 'ta' ? 'பதிலளிக்க அழுத்தவும்' : selectedLanguage === 'hi' ? 'उत्तर देने के लिए दबाएं' : selectedLanguage === 'te' ? 'సమాధానం చెప్పండి' : 'Tap to Answer'
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 953,
                                    columnNumber: 25
                                }, _this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 945,
                            columnNumber: 21
                        }, _this),
                        isListening && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "listening-waves",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "wave"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 966,
                                    columnNumber: 29
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "wave"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 967,
                                    columnNumber: 29
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "wave"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 968,
                                    columnNumber: 29
                                }, _this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 965,
                            columnNumber: 25
                        }, _this),
                        (transcript || interimTranscript) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "transcript-display",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "transcript-label",
                                    children: selectedLanguage === 'ta' ? 'நீங்கள் கூறியது:' : selectedLanguage === 'hi' ? 'आपने कहा:' : selectedLanguage === 'te' ? 'మీరు చెప్పింది:' : 'You said:'
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 975,
                                    columnNumber: 29
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "transcript-text",
                                    children: [
                                        transcript,
                                        interimTranscript && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "interim",
                                            children: [
                                                " ",
                                                interimTranscript
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                            lineNumber: 980,
                                            columnNumber: 55
                                        }, _this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 978,
                                    columnNumber: 29
                                }, _this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 974,
                            columnNumber: 25
                        }, _this),
                        matchResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "match-result ".concat(matchResult.is_correct ? 'correct' : 'incorrect'),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "match-icon",
                                    children: matchResult.is_correct ? '✓' : '✗'
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 988,
                                    columnNumber: 29
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "match-text",
                                    children: matchResult.is_correct ? 'Matched!' : "Expected: ".concat(feedback === null || feedback === void 0 ? void 0 : feedback.correctAnswer)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 989,
                                    columnNumber: 29
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "confidence-badge",
                                    children: [
                                        matchResult.confidence,
                                        "% confidence"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 992,
                                    columnNumber: 29
                                }, _this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 987,
                            columnNumber: 25
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 943,
                    columnNumber: 17
                }, _this),
                showOptions && question.options && question.options.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "options-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "options-label",
                            children: selectedLanguage === 'ta' ? 'அல்லது தட்டி தேர்வு செய்யவும்:' : selectedLanguage === 'hi' ? 'या टैप करके चुनें:' : selectedLanguage === 'te' ? 'లేదా ట్యాప్ చేసి ఎంచుకోండి:' : 'Or tap to select:'
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1002,
                            columnNumber: 25
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "options-grid",
                            children: question.options.map(function(opt, i) {
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "option-btn ".concat(matchResult ? opt.toLowerCase() === (question.correct_answer || '').toLowerCase() ? 'correct-option' : opt === matchResult.matched_option ? 'selected-option' : '' : ''),
                                    onClick: function() {
                                        return handleOptionClick(opt);
                                    },
                                    disabled: answeredRef.current,
                                    children: opt
                                }, i, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 1007,
                                    columnNumber: 33
                                }, _this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1005,
                            columnNumber: 25
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 1001,
                    columnNumber: 21
                }, _this),
                feedback && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "feedback-section ".concat(feedback.isCorrect ? 'feedback-correct' : 'feedback-incorrect'),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "feedback-message",
                            children: feedback.message
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1027,
                            columnNumber: 25
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn-next",
                            onClick: goToNextQuestion,
                            children: currentQuestionIndex < questions.length - 1 ? selectedLanguage === 'ta' ? 'அடுத்த கேள்வி →' : selectedLanguage === 'hi' ? 'अगला प्रश्न →' : selectedLanguage === 'te' ? 'తదుపరి ప్రశ్న →' : 'Next Question →' : selectedLanguage === 'ta' ? 'சோதனையை முடி' : selectedLanguage === 'hi' ? 'परीक्षण समाप्त करें' : selectedLanguage === 'te' ? 'పరీక్ష పూర్తి' : 'Finish Test'
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1028,
                            columnNumber: 25
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 1026,
                    columnNumber: 21
                }, _this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "btn-cancel-test",
                    onClick: function() {
                        return setPhase('select');
                    },
                    children: t('cancel', 'Cancel')
                }, void 0, false, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 1037,
                    columnNumber: 17
                }, _this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
            lineNumber: 884,
            columnNumber: 13
        }, _this);
    };
    // ============================================================
    // RENDER: Scoring Phase
    // ============================================================
    // Speak score aloud when entering scoring phase
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VoiceTestContainer.useEffect": function() {
            if (phase !== 'scoring' || !voiceSupported.tts) return;
            var score = domainScores[selectedTestType] || 0;
            var scoreMsg = {
                ta: "சோதனை முடிந்தது. உங்கள் மதிப்பெண் ".concat(score, " சதவீதம்."),
                hi: "परीक्षण पूर्ण हुआ। आपका स्कोर ".concat(score, " प्रतिशत है।"),
                te: "పరీక్ష పూర్తయింది. మీ స్కోర్ ".concat(score, " శాతం."),
                en: "Test complete. Your score is ".concat(score, " percent.")
            }[selectedLanguage] || "Test complete. Your score is ".concat(score, " percent.");
            var t = setTimeout({
                "VoiceTestContainer.useEffect.t": function() {
                    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$src$2f$services$2f$voiceService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ttsEngine"].speak(scoreMsg, selectedLanguage, {
                        rate: 0.9
                    }).catch({
                        "VoiceTestContainer.useEffect.t": function() {}
                    }["VoiceTestContainer.useEffect.t"]);
                }
            }["VoiceTestContainer.useEffect.t"], 600);
            return ({
                "VoiceTestContainer.useEffect": function() {
                    return clearTimeout(t);
                }
            })["VoiceTestContainer.useEffect"];
        }
    }["VoiceTestContainer.useEffect"], [
        phase,
        selectedTestType,
        domainScores,
        selectedLanguage,
        voiceSupported.tts
    ]);
    var renderScoringPhase = function() {
        var labels = TEST_TYPE_LABELS[selectedLanguage] || TEST_TYPE_LABELS['en'];
        var score = domainScores[selectedTestType] || 0;
        var testResult = allTestResults[selectedTestType] || {};
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "voice-test-scoring",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "scoring-header",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: [
                            labels[selectedTestType],
                            " — ",
                            selectedLanguage === 'ta' ? 'முடிவு' : selectedLanguage === 'hi' ? 'परिणाम' : selectedLanguage === 'te' ? 'ఫలితం' : 'Complete!'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                        lineNumber: 1072,
                        columnNumber: 21
                    }, _this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 1071,
                    columnNumber: 17
                }, _this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "score-display",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "score-ring ".concat(score >= 80 ? 'score-high' : score >= 60 ? 'score-mid' : 'score-low'),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "score-number",
                                    children: score
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 1077,
                                    columnNumber: 25
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "score-percent",
                                    children: "%"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 1078,
                                    columnNumber: 25
                                }, _this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1076,
                            columnNumber: 21
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "score-label",
                            children: labels[selectedTestType]
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1080,
                            columnNumber: 21
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 1075,
                    columnNumber: 17
                }, _this),
                testResult.details && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "score-details",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "detail-row",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: selectedLanguage === 'ta' ? 'சரியான விடைகள்:' : selectedLanguage === 'hi' ? 'सही उत्तर:' : selectedLanguage === 'te' ? 'సరైన సమాధానాలు:' : 'Correct Answers:'
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 1086,
                                    columnNumber: 29
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                }, _this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1085,
                            columnNumber: 25
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "detail-row",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: selectedLanguage === 'ta' ? 'சராசரி நேரம்:' : selectedLanguage === 'hi' ? 'औसत समय:' : selectedLanguage === 'te' ? 'సగటు సమయం:' : 'Avg. Response Time:'
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 1090,
                                    columnNumber: 29
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "detail-value",
                                    children: [
                                        testResult.details.avgResponseTime,
                                        "s"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 1091,
                                    columnNumber: 29
                                }, _this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1089,
                            columnNumber: 25
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "detail-row",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: selectedLanguage === 'ta' ? 'சராசரி நம்பிக்கை:' : selectedLanguage === 'hi' ? 'औसत विश्वास:' : selectedLanguage === 'te' ? 'సగటు విశ్వాసం:' : 'Avg. Confidence:'
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 1094,
                                    columnNumber: 29
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "detail-value",
                                    children: [
                                        testResult.details.avgConfidence,
                                        "%"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 1095,
                                    columnNumber: 29
                                }, _this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1093,
                            columnNumber: 25
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 1084,
                    columnNumber: 21
                }, _this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "scoring-actions",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn-primary",
                            onClick: startNextTest,
                            children: testTypes.filter(function(t) {
                                return !completedTests.includes(t);
                            }).length > 0 ? selectedLanguage === 'ta' ? 'அடுத்த சோதனை →' : selectedLanguage === 'hi' ? 'अगला परीक्षण →' : selectedLanguage === 'te' ? 'తదుపరి పరీక్ష →' : 'Next Test →' : selectedLanguage === 'ta' ? 'இறுதி முடிவுகள்' : selectedLanguage === 'hi' ? 'अंतिम परिणाम' : selectedLanguage === 'te' ? 'చివరి ఫలితాలు' : 'Final Results'
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1101,
                            columnNumber: 21
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn-secondary",
                            onClick: function() {
                                return setPhase('select');
                            },
                            children: selectedLanguage === 'ta' ? 'சோதனைகளுக்கு திரும்பு' : selectedLanguage === 'hi' ? 'परीक्षणों पर वापस' : selectedLanguage === 'te' ? 'పరీక్షలకు తిరిగి' : 'Back to Tests'
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1106,
                            columnNumber: 21
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 1100,
                    columnNumber: 17
                }, _this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
            lineNumber: 1070,
            columnNumber: 13
        }, _this);
    };
    // ============================================================
    // RENDER: Final Results Phase
    // ============================================================
    var renderResultsPhase = function() {
        if (!riskResult) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "results-loading",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "loading-spinner"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                        lineNumber: 1122,
                        columnNumber: 21
                    }, _this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Calculating your Brain Health Index..."
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                        lineNumber: 1123,
                        columnNumber: 21
                    }, _this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                lineNumber: 1121,
                columnNumber: 17
            }, _this);
        }
        var bhi = riskResult.brain_health_index;
        var riskColors = {
            'Normal': '#22c55e',
            'MCI': '#f59e0b',
            'High Risk': '#ef4444'
        };
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "voice-test-results",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    children: [
                        "🧠 ",
                        selectedLanguage === 'ta' ? 'மூளை ஆரோக்கிய அறிக்கை' : selectedLanguage === 'hi' ? 'मस्तिष्क स्वास्थ्य रिपोर्ट' : selectedLanguage === 'te' ? 'మెదడు ఆరోగ్య నివేదిక' : 'Brain Health Report'
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 1133,
                    columnNumber: 17
                }, _this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bhi-display",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bhi-ring",
                            style: {
                                '--bhi-color': riskColors[riskResult.risk_level] || '#3b82f6'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "bhi-value",
                                    children: bhi
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 1138,
                                    columnNumber: 25
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "bhi-unit",
                                    children: "%"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 1139,
                                    columnNumber: 25
                                }, _this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1137,
                            columnNumber: 21
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "bhi-label",
                            children: "Brain Health Index"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1141,
                            columnNumber: 21
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "risk-badge",
                            style: {
                                backgroundColor: riskColors[riskResult.risk_level] || '#3b82f6'
                            },
                            children: riskResult.risk_level
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1142,
                            columnNumber: 21
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "risk-description",
                            children: riskResult.risk_description
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1145,
                            columnNumber: 21
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 1136,
                    columnNumber: 17
                }, _this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "domain-chart",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            children: selectedLanguage === 'ta' ? 'டொமைன் மதிப்பெண்கள்' : selectedLanguage === 'hi' ? 'डोमेन स्कोर' : selectedLanguage === 'te' ? 'డొమైన్ స్కోర్లు' : 'Domain Scores'
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1150,
                            columnNumber: 21
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "domain-bars",
                            children: Object.entries(riskResult.domain_scores || {}).map(function(param) {
                                var _param = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(param, 2), domain = _param[0], score = _param[1];
                                var labelMap = {
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
                                var colors = {
                                    memory: '#3b82f6',
                                    attention: '#10b981',
                                    language: '#f59e0b',
                                    visuospatial: '#8b5cf6'
                                };
                                var label = (labelMap[selectedLanguage] || labelMap['en'])[domain] || domain;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "domain-bar-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "domain-label",
                                            children: label
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                            lineNumber: 1164,
                                            columnNumber: 37
                                        }, _this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "domain-bar-track",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "domain-bar-fill",
                                                style: {
                                                    width: "".concat(score, "%"),
                                                    backgroundColor: colors[domain] || '#3b82f6'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "domain-bar-value",
                                                    children: [
                                                        score,
                                                        "%"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                                    lineNumber: 1170,
                                                    columnNumber: 45
                                                }, _this)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                                lineNumber: 1166,
                                                columnNumber: 41
                                            }, _this)
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                            lineNumber: 1165,
                                            columnNumber: 37
                                        }, _this)
                                    ]
                                }, domain, true, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 1163,
                                    columnNumber: 33
                                }, _this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1151,
                            columnNumber: 21
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 1149,
                    columnNumber: 17
                }, _this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "recommendations-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            children: selectedLanguage === 'ta' ? 'பரிந்துரைகள்' : selectedLanguage === 'hi' ? 'सिफारिशें' : selectedLanguage === 'te' ? 'సూచనలు' : 'Recommendations'
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1181,
                            columnNumber: 21
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "recommendations-list",
                            children: riskResult.recommendations.map(function(rec, i) {
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: rec
                                }, i, false, {
                                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                                    lineNumber: 1184,
                                    columnNumber: 29
                                }, _this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                            lineNumber: 1182,
                            columnNumber: 21
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 1180,
                    columnNumber: 17
                }, _this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "results-actions",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn-primary",
                            onClick: function() {
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
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn-secondary",
                            onClick: function() {
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
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
                    lineNumber: 1190,
                    columnNumber: 17
                }, _this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/Projects/Neuro-lingo/neurolingo-brain-health-test/src/components/VoiceTestContainer.js",
            lineNumber: 1132,
            columnNumber: 13
        }, _this);
    };
    // ============================================================
    // MAIN RENDER
    // ============================================================
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
_s(VoiceTestContainer, "V31x0FNdpD2IPzmFobtrDsVPtag=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = VoiceTestContainer;
const __TURBOPACK__default__export__ = VoiceTestContainer;
var _c;
__turbopack_context__.k.register(_c, "VoiceTestContainer");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Projects$2f$Neuro$2d$lingo$2f$neurolingo$2d$brain$2d$health$2d$test$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_Projects_Neuro-lingo_neurolingo-brain-health-test_src_f7817460._.js.map