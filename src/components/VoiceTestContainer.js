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
 */

"use client";
import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LanguageContext } from '../contexts/LanguageContext';
import { UserContext } from '../contexts/UserContext';
import { ttsEngine, sttEngine, BackendAPI, frontendFuzzyMatch } from '../services/voiceService';
import '../assets/styles/voice-test.css';

// Template questions (fallback when backend is not available)
const TEMPLATE_QUESTIONS = {
    memory: {
        en: [
            {
                id: 'mem_en_1', type: 'recall',
                question: 'Please remember these three words: Apple, Chair, River',
                words_to_remember: ['apple', 'chair', 'river'],
                options: ['apple', 'chair', 'river', 'table', 'mountain', 'pencil'],
                response_format: 'voice_recall'
            },
            {
                id: 'mem_en_2', type: 'recall',
                question: 'Now recall the words you were asked to remember. Say each word clearly.',
                words_to_remember: ['apple', 'chair', 'river'],
                options: ['apple', 'chair', 'river', 'table', 'mountain', 'pencil'],
                response_format: 'voice_recall',
                is_recall_phase: true
            },
            {
                id: 'mem_en_3', type: 'sequence',
                question: 'Repeat these numbers in order: 7, 3, 9',
                correct_sequence: ['7', '3', '9'],
                options: ['7', '3', '9', '2', '8', '4'],
                response_format: 'voice_sequence'
            }
        ],
        ta: [
            {
                id: 'mem_ta_1', type: 'recall',
                question: 'இந்த மூன்று வார்த்தைகளை நினைவில் வையுங்கள்: ஆப்பிள், நாற்காலி, நதி',
                words_to_remember: ['ஆப்பிள்', 'நாற்காலி', 'நதி'],
                options: ['ஆப்பிள்', 'நாற்காலி', 'நதி', 'மேசை', 'மலை', 'பென்சில்'],
                response_format: 'voice_recall'
            }
        ],
        hi: [
            {
                id: 'mem_hi_1', type: 'recall',
                question: 'इन तीन शब्दों को याद रखें: सेब, कुर्सी, नदी',
                words_to_remember: ['सेब', 'कुर्सी', 'नदी'],
                options: ['सेब', 'कुर्सी', 'नदी', 'मेज़', 'पहाड़', 'पेंसिल'],
                response_format: 'voice_recall'
            }
        ],
        te: [
            {
                id: 'mem_te_1', type: 'recall',
                question: 'ఈ మూడు పదాలను గుర్తుంచుకోండి: ఆపిల్, కుర్చీ, నది',
                words_to_remember: ['ఆపిల్', 'కుర్చీ', 'నది'],
                options: ['ఆపిల్', 'కుర్చీ', 'నది', 'బల్ల', 'పర్వతం', 'పెన్సిల్'],
                response_format: 'voice_recall'
            }
        ]
    },
    attention: {
        en: [
            {
                id: 'att_en_1', type: 'stroop',
                question: 'What COLOR is this word displayed in? The word BLUE is shown in RED color.',
                display_word: 'BLUE', display_color: 'red',
                correct_answer: 'red',
                options: ['red', 'blue', 'green', 'yellow'],
                response_format: 'voice_select'
            },
            {
                id: 'att_en_2', type: 'stroop',
                question: 'What COLOR is this word displayed in? The word GREEN is shown in YELLOW color.',
                display_word: 'GREEN', display_color: 'yellow',
                correct_answer: 'yellow',
                options: ['green', 'yellow', 'red', 'blue'],
                response_format: 'voice_select'
            },
            {
                id: 'att_en_3', type: 'counting',
                question: 'Count backwards from 10 to 1 as fast as you can.',
                correct_answer: '10 9 8 7 6 5 4 3 2 1',
                options: [],
                response_format: 'voice_free'
            }
        ],
        ta: [
            {
                id: 'att_ta_1', type: 'stroop',
                question: 'இந்த வார்த்தை எந்த நிறத்தில் காட்டப்பட்டுள்ளது? நீலம் சிவப்பு நிறத்தில்.',
                display_word: 'நீலம்', display_color: 'red',
                correct_answer: 'சிவப்பு',
                options: ['சிவப்பு', 'நீலம்', 'பச்சை', 'மஞ்சள்'],
                response_format: 'voice_select'
            }
        ],
        hi: [
            {
                id: 'att_hi_1', type: 'stroop',
                question: 'यह शब्द किस रंग में दिखाया गया है? नीला शब्द लाल रंग में.',
                display_word: 'नीला', display_color: 'red',
                correct_answer: 'लाल',
                options: ['लाल', 'नीला', 'हरा', 'पीला'],
                response_format: 'voice_select'
            }
        ],
        te: [
            {
                id: 'att_te_1', type: 'stroop',
                question: 'ఈ పదం ఏ రంగులో చూపబడింది? నీలం ఎరుపు రంగులో.',
                display_word: 'నీలం', display_color: 'red',
                correct_answer: 'ఎరుపు',
                options: ['ఎరుపు', 'నీలం', 'ఆకుపచ్చ', 'పసుపు'],
                response_format: 'voice_select'
            }
        ]
    },
    language: {
        en: [
            {
                id: 'lang_en_1', type: 'naming',
                question: 'What is this object? It is a common yellow fruit, curved in shape.',
                correct_answer: 'banana',
                options: ['banana', 'apple', 'orange', 'grape'],
                response_format: 'voice_select'
            },
            {
                id: 'lang_en_2', type: 'comprehension',
                question: 'The cat sat on the mat. Where did the cat sit?',
                correct_answer: 'mat',
                options: ['mat', 'chair', 'table', 'floor'],
                response_format: 'voice_select'
            },
            {
                id: 'lang_en_3', type: 'fluency',
                question: 'Name as many animals as you can.',
                expected_keywords: ['dog', 'cat', 'bird', 'fish', 'lion', 'tiger', 'elephant', 'horse', 'cow', 'sheep', 'rabbit', 'snake', 'monkey', 'bear', 'deer'],
                options: [],
                response_format: 'voice_free'
            }
        ],
        ta: [
            {
                id: 'lang_ta_1', type: 'naming',
                question: 'இது என்ன பொருள்? இது ஒரு பொதுவான மஞ்சள் பழம்.',
                correct_answer: 'வாழைப்பழம்',
                options: ['வாழைப்பழம்', 'ஆப்பிள்', 'ஆரஞ்சு', 'திராட்சை'],
                response_format: 'voice_select'
            }
        ],
        hi: [
            {
                id: 'lang_hi_1', type: 'naming',
                question: 'यह क्या वस्तु है? यह एक आम पीला फल है.',
                correct_answer: 'केला',
                options: ['केला', 'सेब', 'संतरा', 'अंगूर'],
                response_format: 'voice_select'
            }
        ],
        te: [
            {
                id: 'lang_te_1', type: 'naming',
                question: 'ఈ వస్తువు ఏమిటి? ఇది ఒక సాధారణ పసుపు పండు.',
                correct_answer: 'అరటి',
                options: ['అరటి', 'ఆపిల్', 'నారింజ', 'ద్రాక్ష'],
                response_format: 'voice_select'
            }
        ]
    },
    visuospatial: {
        en: [
            {
                id: 'vis_en_1', type: 'pattern',
                question: 'What comes next in this pattern? Triangle, Square, Circle, Triangle, Square, ?',
                correct_answer: 'circle',
                options: ['circle', 'triangle', 'square', 'star'],
                display_pattern: ['▲', '■', '●', '▲', '■', '?'],
                response_format: 'voice_select'
            },
            {
                id: 'vis_en_2', type: 'spatial',
                question: 'If you fold a square paper diagonally, what shape do you get?',
                correct_answer: 'triangle',
                options: ['triangle', 'rectangle', 'circle', 'pentagon'],
                response_format: 'voice_select'
            }
        ],
        ta: [
            {
                id: 'vis_ta_1', type: 'pattern',
                question: 'இந்த முறையில் அடுத்தது என்ன? முக்கோணம், சதுரம், வட்டம், முக்கோணம், சதுரம், ?',
                correct_answer: 'வட்டம்',
                options: ['வட்டம்', 'முக்கோணம்', 'சதுரம்', 'நட்சத்திரம்'],
                display_pattern: ['▲', '■', '●', '▲', '■', '?'],
                response_format: 'voice_select'
            }
        ],
        hi: [
            {
                id: 'vis_hi_1', type: 'pattern',
                question: 'इस पैटर्न में आगे क्या आता है? त्रिकोण, वर्ग, वृत्त, त्रिकोण, वर्ग, ?',
                correct_answer: 'वृत्त',
                options: ['वृत्त', 'त्रिकोण', 'वर्ग', 'तारा'],
                display_pattern: ['▲', '■', '●', '▲', '■', '?'],
                response_format: 'voice_select'
            }
        ],
        te: [
            {
                id: 'vis_te_1', type: 'pattern',
                question: 'ఈ నమూనాలో తదుపరి ఏమిటి? త్రికోణం, చతురస్రం, వృత్తం, త్రికోణం, చతురస్రం, ?',
                correct_answer: 'వృత్తం',
                options: ['వృత్తం', 'త్రికోణం', 'చతురస్రం', 'నక్షత్రం'],
                display_pattern: ['▲', '■', '●', '▲', '■', '?'],
                response_format: 'voice_select'
            }
        ]
    }
};

// Test type labels for display
const TEST_TYPE_LABELS = {
    en: { memory: 'Memory Test', attention: 'Attention Test', language: 'Language Test', visuospatial: 'Visuospatial Test' },
    ta: { memory: 'நினைவாற்றல் சோதனை', attention: 'கவனச் சோதனை', language: 'மொழி சோதனை', visuospatial: 'பார்வை-இட சோதனை' },
    hi: { memory: 'स्मृति परीक्षण', attention: 'ध्यान परीक्षण', language: 'भाषा परीक्षण', visuospatial: 'दृश्य-स्थानिक परीक्षण' },
    te: { memory: 'జ్ఞాపకశక్తి పరీక్ష', attention: 'శ్రద్ధ పరీక్ష', language: 'భాష పరీక్ష', visuospatial: 'దృశ్య-ప్రాంతీయ పరీక్ష' }
};

function VoiceTestContainer() {
    const { language, t } = useContext(LanguageContext);
    const { user, setTestResults } = useContext(UserContext);
    const router = useRouter();

    // Flow state
    const [phase, setPhase] = useState('select');  // select, testing, scoring, results
    const [selectedTestType, setSelectedTestType] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState(language);

    // Test state
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [sessionId, setSessionId] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [questionStartTime, setQuestionStartTime] = useState(null);

    // Voice state
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false); // Whisper STT upload in progress
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [matchResult, setMatchResult] = useState(null);
    const [voiceSupported, setVoiceSupported] = useState({ tts: false, stt: false });

    // Results state
    const [domainScores, setDomainScores] = useState({});
    const [riskResult, setRiskResult] = useState(null);
    const [allTestResults, setAllTestResults] = useState({});
    const [completedTests, setCompletedTests] = useState([]);

    // UI state
    const [feedback, setFeedback] = useState(null);
    const [showOptions, setShowOptions] = useState(false);
    const [backendAvailable, setBackendAvailable] = useState(false);

    const answeredRef = useRef(false);

    // Check voice support
    useEffect(() => {
        setVoiceSupported({
            tts: ttsEngine.isAvailable(),
            stt: sttEngine.isAvailable()
        });
    }, []);

    // Check backend availability
    useEffect(() => {
        const checkBackend = async () => {
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

    const startTest = useCallback(async (testType) => {
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
            const result = await BackendAPI.startTest(
                user?.id || 'guest',
                selectedLanguage,
                testType,
                user?.age,
                user?.educationLevel
            );
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
    }, [backendAvailable, selectedLanguage, user]);

    // ============================================================
    // VOICE: Read question aloud
    // ============================================================

    const readQuestionAloud = useCallback(async (questionText) => {
        if (!voiceSupported.tts) return;

        setIsSpeaking(true);
        try {
            await ttsEngine.speak(questionText, selectedLanguage, { rate: 0.85 });
        } catch (err) {
            console.warn('TTS failed:', err);
        }
        setIsSpeaking(false);
    }, [voiceSupported.tts, selectedLanguage]);

    // Auto-read question when it changes
    useEffect(() => {
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
            const timer = setTimeout(() => {
                readQuestionAloud(question.question);
                // Show options after TTS finishes (or after delay)
                setTimeout(() => setShowOptions(true), 1000);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [phase, currentQuestionIndex, questions, readQuestionAloud]);

    // ============================================================
    // ANSWER PROCESSING: Fuzzy matching + scoring
    // (Defined BEFORE startListening since it's a dependency)
    // ============================================================

    const processAnswer = useCallback(async (spokenText) => {
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
                const result = await BackendAPI.submitAnswer(sessionId, spokenText, responseTime);
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

                for (const expectedWord of wordsToFind) {
                    // Check if this expected word is contained in the spoken transcript
                    const result = frontendFuzzyMatch(spokenText, [expectedWord]);
                    if (result.matched_option && result.confidence >= 50) {
                        matched.push(expectedWord);
                    }
                }

                matchedOption = matched;
                const correctWords = wordsToCheck.map(w => w.toLowerCase());
                const correctCount = matched.filter(m => correctWords.includes(m.toLowerCase())).length;
                isCorrect = correctCount > 0;
                confidence = correctWords.length > 0 ? Math.round((correctCount / correctWords.length) * 100) : 0;
            }
        } else if (question.response_format === 'voice_select') {
            // Single option matching
            const options = question.options || [];

            if (backendAvailable && sessionId) {
                const result = await BackendAPI.submitAnswer(sessionId, spokenText, responseTime);
                if (result) {
                    matchedOption = result.answer_result?.matched;
                    isCorrect = result.answer_result?.is_correct;
                    confidence = result.answer_result?.confidence || 0;
                }
            } else {
                const result = frontendFuzzyMatch(spokenText, options);
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
                for (const word of words) {
                    const result = frontendFuzzyMatch(word, expected);
                    if (result.matched_option && result.confidence >= 50) {
                        matched.push(result.matched_option);
                    }
                }
                matchedOption = matched;
                isCorrect = matched.length > 0;
                confidence = Math.min(100, matched.length * 10);
            } else {
                // Compare with correct_answer
                const result = frontendFuzzyMatch(spokenText, [question.correct_answer || '']);
                matchedOption = result.matched_option;
                isCorrect = result.confidence >= 60;
                confidence = result.confidence;
            }
        } else if (question.response_format === 'voice_sequence') {
            // Sequence matching
            const spokenNumbers = spokenText.replace(/[^\d\s]/g, '').split(/\s+/).filter(Boolean);
            const correctSeq = question.correct_sequence || [];

            let matchCount = 0;
            for (let i = 0; i < Math.min(spokenNumbers.length, correctSeq.length); i++) {
                if (spokenNumbers[i] === correctSeq[i]) matchCount++;
            }

            matchedOption = spokenNumbers.join(', ');
            isCorrect = matchCount === correctSeq.length;
            confidence = correctSeq.length > 0 ? Math.round((matchCount / correctSeq.length) * 100) : 0;
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
            keyword_count: Array.isArray(matchedOption) ? matchedOption.length : (matchedOption ? 1 : 0)
        };

        setAnswers(prev => [...prev, answerRecord]);

        // Show feedback
        setFeedback({
            isCorrect,
            message: isCorrect
                ? (selectedLanguage === 'ta' ? 'சரி! ✓' : selectedLanguage === 'hi' ? 'सही! ✓' : selectedLanguage === 'te' ? 'సరైనది! ✓' : 'Correct! ✓')
                : (selectedLanguage === 'ta' ? 'தவறு ✗' : selectedLanguage === 'hi' ? 'गलत ✗' : selectedLanguage === 'te' ? 'తప్పు ✗' : 'Incorrect ✗'),
            correctAnswer: question.correct_answer || (question.words_to_remember || []).join(', '),
            matched: matchedOption
        });

        // Read feedback aloud — in the selected language
        if (voiceSupported.tts) {
            const correctAnswer = question.correct_answer || (question.words_to_remember || []).join(', ');
            const feedbackText = isCorrect
                ? ({ ta: 'சரி!', hi: 'सही!', te: 'సరైనది!', bn: 'সঠিক!' }[selectedLanguage] || 'Correct!')
                : ({
                    ta: `தவறு. சரியான விடை: ${correctAnswer}`,
                    hi: `गलत। सही उत्तर है: ${correctAnswer}`,
                    te: `తప్పు. సరైన సమాధానం: ${correctAnswer}`,
                    bn: `ভুল। সঠিক উত্তর: ${correctAnswer}`
                }[selectedLanguage] || `Incorrect. The answer is: ${correctAnswer}`);
            setTimeout(() => {
                ttsEngine.speak(feedbackText, selectedLanguage, { rate: 1.0 }).catch(() => { });
            }, 500);
        }
    }, [questions, currentQuestionIndex, questionStartTime, backendAvailable, sessionId, selectedLanguage, voiceSupported.tts]);

    // ============================================================
    // VOICE: Listen for answer
    // (Defined AFTER processAnswer since it depends on it)
    // ============================================================

    const startListening = useCallback(async () => {
        if (!voiceSupported.stt || isListening || isProcessing) return;

        // Stop TTS if still speaking
        ttsEngine.stop();
        setIsSpeaking(false);

        setIsListening(true);
        setIsProcessing(false);
        setTranscript('');
        setInterimTranscript('');

        sttEngine.onResult = (fullTranscript, latest) => {
            setTranscript(fullTranscript);
        };

        sttEngine.onInterim = (interim) => {
            setInterimTranscript(interim);
        };

        try {
            const finalTranscript = await sttEngine.startListening(selectedLanguage, {
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
    }, [voiceSupported.stt, isListening, isProcessing, selectedLanguage, processAnswer]);

    const stopListening = useCallback(() => {
        sttEngine.stopListening();
        setIsListening(false);
        setIsProcessing(false);
    }, []);

    // ============================================================
    // SCORING: Finish current test
    // (Defined BEFORE goToNextQuestion since it's a dependency)
    // ============================================================

    const finishCurrentTest = useCallback(() => {
        // Calculate domain score
        const correct = answers.filter(a => a.is_correct).length;
        const total = answers.length;
        const avgConfidence = total > 0 ? answers.reduce((sum, a) => sum + a.confidence, 0) / total : 0;
        const avgResponseTime = total > 0 ? answers.reduce((sum, a) => sum + a.response_time, 0) / total : 0;

        let baseScore = total > 0 ? Math.round((correct / total) * 100) : 0;

        // Apply bonuses based on test type
        let bonus = 0;
        if (selectedTestType === 'memory') {
            if (avgResponseTime < 5) bonus = 5;
            else if (avgResponseTime < 10) bonus = 2;
        } else if (selectedTestType === 'attention') {
            bonus = Math.max(0, Math.min(15, Math.round(15 - (avgResponseTime * 3))));
        } else if (selectedTestType === 'language') {
            const keywordMatches = answers.reduce((sum, a) => sum + (a.keyword_count || 0), 0);
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
        setDomainScores(prev => ({ ...prev, [selectedTestType]: finalScore }));
        setAllTestResults(prev => ({
            ...prev,
            [selectedTestType]: { ...scoreResult, answers }
        }));
        setCompletedTests(prev => [...prev, selectedTestType]);

        // Go to scoring phase
        setPhase('scoring');
    }, [answers, selectedTestType]);

    // ============================================================
    // NAVIGATION
    // (Defined AFTER finishCurrentTest since it depends on it)
    // ============================================================

    const goToNextQuestion = useCallback(() => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Test domain complete — calculate score
            finishCurrentTest();
        }
    }, [currentQuestionIndex, questions.length, finishCurrentTest]);

    // ============================================================
    // RISK CLASSIFICATION: Calculate final results
    // (Defined BEFORE startNextTest since it's a dependency)
    // ============================================================

    const testTypes = ['memory', 'attention', 'language', 'visuospatial'];

    const calculateFinalResults = useCallback(async () => {
        setPhase('results');

        const scores = {
            memory: domainScores.memory || 0,
            attention: domainScores.attention || 0,
            language: domainScores.language || 0,
            visuospatial: domainScores.visuospatial || 0
        };

        // Try backend risk classification
        if (backendAvailable) {
            const result = await BackendAPI.classifyRisk(scores, user?.age, user?.educationLevel);
            if (result) {
                setRiskResult(result);
                return;
            }
        }

        // Frontend fallback risk classification
        const weights = { memory: 0.30, attention: 0.25, language: 0.25, visuospatial: 0.20 };
        let bhi = 0;
        for (const [domain, weight] of Object.entries(weights)) {
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
    }, [domainScores, allTestResults, backendAvailable, user, setTestResults, router]);

    // ============================================================
    // START NEXT TEST OR FINISH
    // (Defined AFTER calculateFinalResults since it depends on it)
    // ============================================================

    const startNextTest = useCallback(() => {
        const remaining = testTypes.filter(t => !completedTests.includes(t));
        if (remaining.length > 0) {
            setPhase('select');
        } else {
            // All tests complete — calculate risk
            calculateFinalResults();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [completedTests, calculateFinalResults]);


    // ============================================================
    // SELECT OPTION MANUALLY (tap/click fallback)
    // ============================================================

    const handleOptionClick = useCallback((option) => {
        if (answeredRef.current) return;
        setTranscript(option);
        processAnswer(option);
    }, [processAnswer]);

    // ============================================================
    // RENDER: Test Selection Phase
    // ============================================================

    const renderSelectPhase = () => {
        const labels = TEST_TYPE_LABELS[selectedLanguage] || TEST_TYPE_LABELS['en'];
        const remaining = testTypes.filter(t => !completedTests.includes(t));

        return (
            <div className="voice-test-select">
                <div className="select-header">
                    <h2>🧠 {selectedLanguage === 'ta' ? 'மூளை ஆரோக்கிய சோதனை' : selectedLanguage === 'hi' ? 'मस्तिष्क स्वास्थ्य परीक्षण' : selectedLanguage === 'te' ? 'మెదడు ఆరోగ్య పరీక్ష' : 'Brain Health Test'}</h2>
                    <p className="select-subtitle">
                        {selectedLanguage === 'ta' ? 'சோதனை வகையைத் தேர்ந்தெடுக்கவும்' : selectedLanguage === 'hi' ? 'परीक्षण प्रकार चुनें' : selectedLanguage === 'te' ? 'పరీక్ష రకం ఎంచుకోండి' : 'Select a test to begin'}
                    </p>
                </div>

                {/* Language Selection */}
                <div className="language-select-section">
                    <label className="lang-label">
                        {selectedLanguage === 'ta' ? 'மொழி:' : selectedLanguage === 'hi' ? 'भाषा:' : selectedLanguage === 'te' ? 'భాష:' : 'Language:'}
                    </label>
                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="lang-select"
                    >
                        <option value="en">English</option>
                        <option value="ta">தமிழ் (Tamil)</option>
                        <option value="hi">हिन्दी (Hindi)</option>
                        <option value="te">తెలుగు (Telugu)</option>
                    </select>
                </div>

                {/* Voice Support Indicator */}
                <div className="voice-status">
                    <span className={`status-dot ${voiceSupported.tts ? 'active' : 'inactive'}`}></span>
                    <span>Voice Output (TTS): {voiceSupported.tts ? 'Available' : 'Not Available'}</span>
                    <span className={`status-dot ${voiceSupported.stt ? 'active' : 'inactive'}`}></span>
                    <span>Voice Input (STT): {voiceSupported.stt ? 'Available' : 'Not Available'}</span>
                    <span className={`status-dot ${backendAvailable ? 'active' : 'inactive'}`}></span>
                    <span>Backend: {backendAvailable ? 'Connected' : 'Offline (using local mode)'}</span>
                </div>

                {/* Completed Tests */}
                {completedTests.length > 0 && (
                    <div className="completed-tests">
                        <h4>Completed:</h4>
                        <div className="completed-pills">
                            {completedTests.map(test => (
                                <span key={test} className="completed-pill">
                                    ✓ {labels[test]} — {domainScores[test]}%
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Test Type Cards */}
                <div className="test-type-grid">
                    {testTypes.map(type => {
                        const isCompleted = completedTests.includes(type);
                        const icons = { memory: '🧠', attention: '👁️', language: '💬', visuospatial: '🔷' };
                        const descs = {
                            en: { memory: 'Test your recall and working memory', attention: 'Evaluate focus and concentration', language: 'Check verbal fluency and comprehension', visuospatial: 'Test spatial reasoning and perception' },
                            ta: { memory: 'உங்கள் நினைவாற்றலை சோதிக்கவும்', attention: 'கவனம் மற்றும் ஒருமுகப்படுத்தலை மதிப்பிடுங்கள்', language: 'மொழி திறனை சரிபார்க்கவும்', visuospatial: 'இடஞ்சார்ந்த காரணத்தை சோதிக்கவும்' },
                            hi: { memory: 'अपनी याददाश्त का परीक्षण करें', attention: 'ध्यान और एकाग्रता का मूल्यांकन करें', language: 'भाषा कौशल जांचें', visuospatial: 'स्थानिक तर्क का परीक्षण करें' },
                            te: { memory: 'మీ జ్ఞాపకశక్తిని పరీక్షించండి', attention: 'దృష్టి మరియు ఏకాగ్రతను అంచనా వేయండి', language: 'భాషా నైపుణ్యాలను తనిఖీ చేయండి', visuospatial: 'ప్రాదేశిక తర్కాన్ని పరీక్షించండి' }
                        };
                        const desc = (descs[selectedLanguage] || descs['en'])[type];

                        return (
                            <button
                                key={type}
                                className={`test-type-card ${isCompleted ? 'completed' : ''}`}
                                onClick={() => !isCompleted && startTest(type)}
                                disabled={isCompleted}
                            >
                                <span className="test-type-icon">{icons[type]}</span>
                                <h3>{labels[type]}</h3>
                                <p>{desc}</p>
                                {isCompleted && (
                                    <div className="score-badge">✓ {domainScores[type]}%</div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Action buttons */}
                <div className="select-actions">
                    {remaining.length === 0 && (
                        <button className="btn-primary" onClick={calculateFinalResults}>
                            {selectedLanguage === 'ta' ? 'முடிவுகளைக் காண்க' : selectedLanguage === 'hi' ? 'परिणाम देखें' : selectedLanguage === 'te' ? 'ఫలితాలు చూడండి' : 'View Final Results'}
                        </button>
                    )}
                    <button className="btn-secondary" onClick={() => router.push('/dashboard')}>
                        {t('cancel', 'Cancel')}
                    </button>
                </div>
            </div>
        );
    };

    // ============================================================
    // RENDER: Testing Phase (Voice-Enabled Questions)
    // ============================================================

    const renderTestingPhase = () => {
        if (questions.length === 0) return <div className="loading-state">Loading questions...</div>;

        const question = questions[currentQuestionIndex];
        const progress = Math.round(((currentQuestionIndex) / questions.length) * 100);
        const labels = TEST_TYPE_LABELS[selectedLanguage] || TEST_TYPE_LABELS['en'];

        return (
            <div className="voice-test-active">
                {/* Header & Progress */}
                <div className="test-active-header">
                    <h3>{labels[selectedTestType]}</h3>
                    <div className="test-progress-bar">
                        <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                        <span className="progress-text">{currentQuestionIndex + 1} / {questions.length}</span>
                    </div>
                </div>

                {/* Question Display */}
                <div className="question-card">
                    {/* TTS indicator */}
                    {isSpeaking && (
                        <div className="speaking-indicator">
                            <div className="sound-wave">
                                <span></span><span></span><span></span><span></span><span></span>
                            </div>
                            <span className="speaking-text">
                                {selectedLanguage === 'ta' ? 'கேட்கிறது...' : selectedLanguage === 'hi' ? 'सुनिए...' : selectedLanguage === 'te' ? 'వింటోంది...' : 'Listening...'}
                            </span>
                        </div>
                    )}

                    <p className="question-text">{question.question}</p>

                    {/* Stroop display */}
                    {question.type === 'stroop' && question.display_word && (
                        <div className="stroop-display">
                            <span className="stroop-word" style={{ color: question.display_color }}>
                                {question.display_word}
                            </span>
                        </div>
                    )}

                    {/* Pattern display */}
                    {question.display_pattern && (
                        <div className="pattern-display">
                            {question.display_pattern.map((item, i) => (
                                <span key={i} className={`pattern-item ${item === '?' ? 'pattern-unknown' : ''}`}>
                                    {item}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Replay question button */}
                    <button
                        className="btn-replay"
                        onClick={() => readQuestionAloud(question.question)}
                        disabled={isSpeaking}
                    >
                        🔊 {selectedLanguage === 'ta' ? 'மீட்டமை' : selectedLanguage === 'hi' ? 'दोहराएं' : selectedLanguage === 'te' ? 'రీప్లే' : 'Replay'}
                    </button>
                </div>

                {/* Voice Input Section */}
                <div className="voice-input-section">
                    {/* Microphone button */}
                    <button
                        className={`mic-button ${isListening ? 'listening' : ''} ${isProcessing ? 'processing' : ''}`}
                        onClick={isListening ? stopListening : startListening}
                        disabled={answeredRef.current || isProcessing}
                    >
                        <span className="mic-icon">
                            {isProcessing ? '⏳' : isListening ? '⏹️' : '🎤'}
                        </span>
                        <span className="mic-label">
                            {isProcessing
                                ? (selectedLanguage === 'ta' ? 'எழுதுகிறது...' : selectedLanguage === 'hi' ? 'लिप्यंतरण...' : selectedLanguage === 'te' ? 'లిప్యంతరీకరణ...' : 'Transcribing...')
                                : isListening
                                    ? (selectedLanguage === 'ta' ? 'பேசுங்கள்... (நிறுத்த அழுத்தவும்)' : selectedLanguage === 'hi' ? 'बोलिए... (रोकने के लिए दबाएं)' : selectedLanguage === 'te' ? 'మాట్లాడండి... (ఆపడానికి నొక్కండి)' : 'Speaking... (tap to stop)')
                                    : (selectedLanguage === 'ta' ? 'பதிலளிக்க அழுத்தவும்' : selectedLanguage === 'hi' ? 'उत्तर देने के लिए दबाएं' : selectedLanguage === 'te' ? 'సమాధానం చెప్పండి' : 'Tap to Answer')
                            }
                        </span>
                    </button>

                    {/* Listening animation */}
                    {isListening && (
                        <div className="listening-waves">
                            <div className="wave"></div>
                            <div className="wave"></div>
                            <div className="wave"></div>
                        </div>
                    )}

                    {/* Transcript Display */}
                    {(transcript || interimTranscript) && (
                        <div className="transcript-display">
                            <span className="transcript-label">
                                {selectedLanguage === 'ta' ? 'நீங்கள் கூறியது:' : selectedLanguage === 'hi' ? 'आपने कहा:' : selectedLanguage === 'te' ? 'మీరు చెప్పింది:' : 'You said:'}
                            </span>
                            <span className="transcript-text">
                                {transcript}
                                {interimTranscript && <span className="interim"> {interimTranscript}</span>}
                            </span>
                        </div>
                    )}

                    {/* Match Result */}
                    {matchResult && (
                        <div className={`match-result ${matchResult.is_correct ? 'correct' : 'incorrect'}`}>
                            <span className="match-icon">{matchResult.is_correct ? '✓' : '✗'}</span>
                            <span className="match-text">
                                {matchResult.is_correct ? 'Matched!' : `Expected: ${feedback?.correctAnswer}`}
                            </span>
                            <span className="confidence-badge">
                                {matchResult.confidence}% confidence
                            </span>
                        </div>
                    )}
                </div>

                {/* Options (tap/click fallback) */}
                {showOptions && question.options && question.options.length > 0 && (
                    <div className="options-section">
                        <p className="options-label">
                            {selectedLanguage === 'ta' ? 'அல்லது தட்டி தேர்வு செய்யவும்:' : selectedLanguage === 'hi' ? 'या टैप करके चुनें:' : selectedLanguage === 'te' ? 'లేదా ట్యాప్ చేసి ఎంచుకోండి:' : 'Or tap to select:'}
                        </p>
                        <div className="options-grid">
                            {question.options.map((opt, i) => (
                                <button
                                    key={i}
                                    className={`option-btn ${matchResult
                                        ? (opt.toLowerCase() === (question.correct_answer || '').toLowerCase() ? 'correct-option' :
                                            opt === matchResult.matched_option ? 'selected-option' : '')
                                        : ''
                                        }`}
                                    onClick={() => handleOptionClick(opt)}
                                    disabled={answeredRef.current}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Feedback & Next */}
                {feedback && (
                    <div className={`feedback-section ${feedback.isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}>
                        <p className="feedback-message">{feedback.message}</p>
                        <button className="btn-next" onClick={goToNextQuestion}>
                            {currentQuestionIndex < questions.length - 1
                                ? (selectedLanguage === 'ta' ? 'அடுத்த கேள்வி →' : selectedLanguage === 'hi' ? 'अगला प्रश्न →' : selectedLanguage === 'te' ? 'తదుపరి ప్రశ్న →' : 'Next Question →')
                                : (selectedLanguage === 'ta' ? 'சோதனையை முடி' : selectedLanguage === 'hi' ? 'परीक्षण समाप्त करें' : selectedLanguage === 'te' ? 'పరీక్ష పూర్తి' : 'Finish Test')}
                        </button>
                    </div>
                )}

                {/* Cancel */}
                <button className="btn-cancel-test" onClick={() => setPhase('select')}>
                    {t('cancel', 'Cancel')}
                </button>
            </div>
        );
    };

    // ============================================================
    // RENDER: Scoring Phase
    // ============================================================

    // Speak score aloud when entering scoring phase
    useEffect(() => {
        if (phase !== 'scoring' || !voiceSupported.tts) return;
        const score = domainScores[selectedTestType] || 0;
        const scoreMsg = {
            ta: `சோதனை முடிந்தது. உங்கள் மதிப்பெண் ${score} சதவீதம்.`,
            hi: `परीक्षण पूर्ण हुआ। आपका स्कोर ${score} प्रतिशत है।`,
            te: `పరీక్ష పూర్తయింది. మీ స్కోర్ ${score} శాతం.`,
            en: `Test complete. Your score is ${score} percent.`
        }[selectedLanguage] || `Test complete. Your score is ${score} percent.`;
        const t = setTimeout(() => {
            ttsEngine.speak(scoreMsg, selectedLanguage, { rate: 0.9 }).catch(() => { });
        }, 600);
        return () => clearTimeout(t);
    }, [phase, selectedTestType, domainScores, selectedLanguage, voiceSupported.tts]);

    const renderScoringPhase = () => {
        const labels = TEST_TYPE_LABELS[selectedLanguage] || TEST_TYPE_LABELS['en'];
        const score = domainScores[selectedTestType] || 0;
        const testResult = allTestResults[selectedTestType] || {};

        return (
            <div className="voice-test-scoring">
                <div className="scoring-header">
                    <h2>{labels[selectedTestType]} — {selectedLanguage === 'ta' ? 'முடிவு' : selectedLanguage === 'hi' ? 'परिणाम' : selectedLanguage === 'te' ? 'ఫలితం' : 'Complete!'}</h2>
                </div>

                <div className="score-display">
                    <div className={`score-ring ${score >= 80 ? 'score-high' : score >= 60 ? 'score-mid' : 'score-low'}`}>
                        <span className="score-number">{score}</span>
                        <span className="score-percent">%</span>
                    </div>
                    <p className="score-label">{labels[selectedTestType]}</p>
                </div>

                {testResult.details && (
                    <div className="score-details">
                        <div className="detail-row">
                            <span>{selectedLanguage === 'ta' ? 'சரியான விடைகள்:' : selectedLanguage === 'hi' ? 'सही उत्तर:' : selectedLanguage === 'te' ? 'సరైన సమాధానాలు:' : 'Correct Answers:'}</span>
                            <span className="detail-value">{testResult.details.correct} / {testResult.details.total}</span>
                        </div>
                        <div className="detail-row">
                            <span>{selectedLanguage === 'ta' ? 'சராசரி நேரம்:' : selectedLanguage === 'hi' ? 'औसत समय:' : selectedLanguage === 'te' ? 'సగటు సమయం:' : 'Avg. Response Time:'}</span>
                            <span className="detail-value">{testResult.details.avgResponseTime}s</span>
                        </div>
                        <div className="detail-row">
                            <span>{selectedLanguage === 'ta' ? 'சராசரி நம்பிக்கை:' : selectedLanguage === 'hi' ? 'औसत विश्वास:' : selectedLanguage === 'te' ? 'సగటు విశ్వాసం:' : 'Avg. Confidence:'}</span>
                            <span className="detail-value">{testResult.details.avgConfidence}%</span>
                        </div>
                    </div>
                )}

                <div className="scoring-actions">
                    <button className="btn-primary" onClick={startNextTest}>
                        {testTypes.filter(t => !completedTests.includes(t)).length > 0
                            ? (selectedLanguage === 'ta' ? 'அடுத்த சோதனை →' : selectedLanguage === 'hi' ? 'अगला परीक्षण →' : selectedLanguage === 'te' ? 'తదుపరి పరీక్ష →' : 'Next Test →')
                            : (selectedLanguage === 'ta' ? 'இறுதி முடிவுகள்' : selectedLanguage === 'hi' ? 'अंतिम परिणाम' : selectedLanguage === 'te' ? 'చివరి ఫలితాలు' : 'Final Results')}
                    </button>
                    <button className="btn-secondary" onClick={() => setPhase('select')}>
                        {selectedLanguage === 'ta' ? 'சோதனைகளுக்கு திரும்பு' : selectedLanguage === 'hi' ? 'परीक्षणों पर वापस' : selectedLanguage === 'te' ? 'పరీక్షలకు తిరిగి' : 'Back to Tests'}
                    </button>
                </div>
            </div>
        );
    };

    // ============================================================
    // RENDER: Final Results Phase
    // ============================================================

    const renderResultsPhase = () => {
        if (!riskResult) {
            return (
                <div className="results-loading">
                    <div className="loading-spinner"></div>
                    <p>Calculating your Brain Health Index...</p>
                </div>
            );
        }

        const bhi = riskResult.brain_health_index;
        const riskColors = { 'Normal': '#22c55e', 'MCI': '#f59e0b', 'High Risk': '#ef4444' };

        return (
            <div className="voice-test-results">
                <h2>🧠 {selectedLanguage === 'ta' ? 'மூளை ஆரோக்கிய அறிக்கை' : selectedLanguage === 'hi' ? 'मस्तिष्क स्वास्थ्य रिपोर्ट' : selectedLanguage === 'te' ? 'మెదడు ఆరోగ్య నివేదిక' : 'Brain Health Report'}</h2>

                {/* Brain Health Index */}
                <div className="bhi-display">
                    <div className="bhi-ring" style={{ '--bhi-color': riskColors[riskResult.risk_level] || '#3b82f6' }}>
                        <span className="bhi-value">{bhi}</span>
                        <span className="bhi-unit">%</span>
                    </div>
                    <p className="bhi-label">Brain Health Index</p>
                    <div className="risk-badge" style={{ backgroundColor: riskColors[riskResult.risk_level] || '#3b82f6' }}>
                        {riskResult.risk_level}
                    </div>
                    <p className="risk-description">{riskResult.risk_description}</p>
                </div>

                {/* Domain Scores Chart */}
                <div className="domain-chart">
                    <h3>{selectedLanguage === 'ta' ? 'டொமைன் மதிப்பெண்கள்' : selectedLanguage === 'hi' ? 'डोमेन स्कोर' : selectedLanguage === 'te' ? 'డొమైన్ స్కోర్లు' : 'Domain Scores'}</h3>
                    <div className="domain-bars">
                        {Object.entries(riskResult.domain_scores || {}).map(([domain, score]) => {
                            const labelMap = {
                                en: { memory: 'Memory', attention: 'Attention', language: 'Language', visuospatial: 'Visuospatial' },
                                ta: { memory: 'நினைவாற்றல்', attention: 'கவனம்', language: 'மொழி', visuospatial: 'இட-பார்வை' },
                                hi: { memory: 'स्मृति', attention: 'ध्यान', language: 'भाषा', visuospatial: 'दृश्य-स्थानिक' },
                                te: { memory: 'జ్ఞాపకశక్తి', attention: 'శ్రద్ధ', language: 'భాష', visuospatial: 'దృశ్య-ప్రాంతీయ' }
                            };
                            const colors = { memory: '#3b82f6', attention: '#10b981', language: '#f59e0b', visuospatial: '#8b5cf6' };
                            const label = (labelMap[selectedLanguage] || labelMap['en'])[domain] || domain;

                            return (
                                <div key={domain} className="domain-bar-row">
                                    <span className="domain-label">{label}</span>
                                    <div className="domain-bar-track">
                                        <div
                                            className="domain-bar-fill"
                                            style={{ width: `${score}%`, backgroundColor: colors[domain] || '#3b82f6' }}
                                        >
                                            <span className="domain-bar-value">{score}%</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recommendations */}
                <div className="recommendations-section">
                    <h3>{selectedLanguage === 'ta' ? 'பரிந்துரைகள்' : selectedLanguage === 'hi' ? 'सिफारिशें' : selectedLanguage === 'te' ? 'సూచనలు' : 'Recommendations'}</h3>
                    <ul className="recommendations-list">
                        {riskResult.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                        ))}
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="results-actions">
                    <button className="btn-primary" onClick={() => {
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
                    }}>
                        {selectedLanguage === 'ta' ? 'டாஷ்போர்டுக்குத் திரும்பு' : selectedLanguage === 'hi' ? 'डैशबोर्ड पर वापस' : selectedLanguage === 'te' ? 'డాష్‌బోర్డ్‌కు తిరిగి' : 'Save & Return to Dashboard'}
                    </button>
                    <button className="btn-secondary" onClick={() => {
                        setPhase('select');
                        setCompletedTests([]);
                        setDomainScores({});
                        setAllTestResults({});
                        setRiskResult(null);
                    }}>
                        {selectedLanguage === 'ta' ? 'மீண்டும் எடு' : selectedLanguage === 'hi' ? 'फिर से लें' : selectedLanguage === 'te' ? 'మళ్ళీ తీసుకోండి' : 'Retake Test'}
                    </button>
                </div>
            </div>
        );
    };

    // ============================================================
    // MAIN RENDER
    // ============================================================

    return (
        <div className="voice-test-container">
            {phase === 'select' && renderSelectPhase()}
            {phase === 'testing' && renderTestingPhase()}
            {phase === 'scoring' && renderScoringPhase()}
            {phase === 'results' && renderResultsPhase()}
        </div>
    );
}

export default VoiceTestContainer;
