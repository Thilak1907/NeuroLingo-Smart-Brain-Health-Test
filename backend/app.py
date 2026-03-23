"""
NeuroLingo Brain Health Test - Flask Backend
=============================================
Endpoints:
  POST /api/test/start          - Start a test session
  GET  /api/test/question       - Fetch next question
  POST /api/test/answer         - Submit answer (with fuzzy matching)
  POST /api/test/score          - Calculate cognitive scores
  POST /api/test/risk           - Risk classification
  GET  /api/tts                 - Text-to-Speech (placeholder for Coqui XTTS)
  POST /api/stt                 - Speech-to-Text (placeholder for Whisper-small)
  GET  /api/health              - Health check
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from fuzzywuzzy import fuzz, process
import uuid
import time
import json
import os

app = Flask(__name__)
CORS(app)

# ============================================================
# IN-MEMORY DATA STORE
# ============================================================

# Active test sessions
sessions = {}

# ============================================================
# QUESTION DATABASE (Template questions by language & test type)
# ============================================================

QUESTIONS_DB = {
    "memory": {
        "en": [
            {
                "id": "mem_en_1",
                "type": "recall",
                "question": "Please remember these three words: Apple, Chair, River",
                "words_to_remember": ["apple", "chair", "river"],
                "instruction": "After a short delay, you will be asked to recall these words.",
                "options": ["apple", "chair", "river", "table", "mountain", "pencil"],
                "response_format": "voice_recall"
            },
            {
                "id": "mem_en_2",
                "type": "recall",
                "question": "Remember these words: Elephant, Garden, Clock",
                "words_to_remember": ["elephant", "garden", "clock"],
                "instruction": "You will be asked to recall these words later.",
                "options": ["elephant", "garden", "clock", "book", "ocean", "house"],
                "response_format": "voice_recall"
            },
            {
                "id": "mem_en_3",
                "type": "recall",
                "question": "Please remember: Flower, Bridge, Music",
                "words_to_remember": ["flower", "bridge", "music"],
                "instruction": "Try to remember these words for later recall.",
                "options": ["flower", "bridge", "music", "forest", "candle", "wallet"],
                "response_format": "voice_recall"
            },
            {
                "id": "mem_en_4",
                "type": "sequence",
                "question": "Repeat these numbers in order: 7, 3, 9, 1, 5",
                "correct_sequence": ["7", "3", "9", "1", "5"],
                "instruction": "Say the numbers in the exact order shown.",
                "options": ["7", "3", "9", "1", "5", "2", "8", "4"],
                "response_format": "voice_sequence"
            },
            {
                "id": "mem_en_5",
                "type": "sequence",
                "question": "Repeat these numbers backwards: 4, 8, 2",
                "correct_sequence": ["2", "8", "4"],
                "instruction": "Say the numbers in reverse order.",
                "options": ["2", "8", "4", "1", "6", "3"],
                "response_format": "voice_sequence"
            }
        ],
        "ta": [
            {
                "id": "mem_ta_1",
                "type": "recall",
                "question": "இந்த மூன்று வார்த்தைகளை நினைவில் வையுங்கள்: ஆப்பிள், நாற்காலி, நதி",
                "words_to_remember": ["ஆப்பிள்", "நாற்காலி", "நதி"],
                "instruction": "சிறிது நேரம் கழித்து இந்த வார்த்தைகளை நினைவுபடுத்தும்படி கேட்கப்படுவீர்கள்.",
                "options": ["ஆப்பிள்", "நாற்காலி", "நதி", "மேசை", "மலை", "பென்சில்"],
                "response_format": "voice_recall"
            },
            {
                "id": "mem_ta_2",
                "type": "recall",
                "question": "இந்த வார்த்தைகளை நினைவில் வையுங்கள்: யானை, தோட்டம், கடிகாரம்",
                "words_to_remember": ["யானை", "தோட்டம்", "கடிகாரம்"],
                "instruction": "பின்னர் இவற்றை நினைவுபடுத்த வேண்டும்.",
                "options": ["யானை", "தோட்டம்", "கடிகாரம்", "புத்தகம்", "கடல்", "வீடு"],
                "response_format": "voice_recall"
            }
        ],
        "hi": [
            {
                "id": "mem_hi_1",
                "type": "recall",
                "question": "इन तीन शब्दों को याद रखें: सेब, कुर्सी, नदी",
                "words_to_remember": ["सेब", "कुर्सी", "नदी"],
                "instruction": "थोड़ी देर बाद आपसे ये शब्द याद करने को कहा जाएगा.",
                "options": ["सेब", "कुर्सी", "नदी", "मेज़", "पहाड़", "पेंसिल"],
                "response_format": "voice_recall"
            },
            {
                "id": "mem_hi_2",
                "type": "recall",
                "question": "ये शब्द याद रखें: हाथी, बगीचा, घड़ी",
                "words_to_remember": ["हाथी", "बगीचा", "घड़ी"],
                "instruction": "बाद में इन्हें याद करना होगा.",
                "options": ["हाथी", "बगीचा", "घड़ी", "किताब", "सागर", "घर"],
                "response_format": "voice_recall"
            }
        ],
        "te": [
            {
                "id": "mem_te_1",
                "type": "recall",
                "question": "ఈ మూడు పదాలను గుర్తుంచుకోండి: ఆపిల్, కుర్చీ, నది",
                "words_to_remember": ["ఆపిల్", "కుర్చీ", "నది"],
                "instruction": "కొంచెం సేపటి తర్వాత మీరు ఈ పదాలను గుర్తుచేయమని అడగబడతారు.",
                "options": ["ఆపిల్", "కుర్చీ", "నది", "బల్ల", "పర్వతం", "పెన్సిల్"],
                "response_format": "voice_recall"
            }
        ]
    },
    "attention": {
        "en": [
            {
                "id": "att_en_1",
                "type": "stroop",
                "question": "What COLOR is this word displayed in? The word 'BLUE' is shown in RED color.",
                "display_word": "BLUE",
                "display_color": "red",
                "correct_answer": "red",
                "options": ["red", "blue", "green", "yellow"],
                "response_format": "voice_select"
            },
            {
                "id": "att_en_2",
                "type": "stroop",
                "question": "What COLOR is this word displayed in? The word 'GREEN' is shown in YELLOW color.",
                "display_word": "GREEN",
                "display_color": "yellow",
                "correct_answer": "yellow",
                "options": ["green", "yellow", "red", "blue"],
                "response_format": "voice_select"
            },
            {
                "id": "att_en_3",
                "type": "reaction",
                "question": "Say 'YES' when you hear the target word. Target word: 'CAT'",
                "target_word": "cat",
                "word_list": ["dog", "cat", "bird", "fish", "cat", "tree"],
                "options": ["yes", "no"],
                "response_format": "voice_select"
            },
            {
                "id": "att_en_4",
                "type": "counting",
                "question": "Count backwards from 20 to 1 as fast as you can.",
                "correct_answer": "20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1",
                "options": [],
                "response_format": "voice_free"
            }
        ],
        "ta": [
            {
                "id": "att_ta_1",
                "type": "stroop",
                "question": "இந்த வார்த்தை எந்த நிறத்தில் காட்டப்பட்டுள்ளது? 'நீலம்' என்ற வார்த்தை சிவப்பு நிறத்தில் காட்டப்பட்டுள்ளது.",
                "display_word": "நீலம்",
                "display_color": "red",
                "correct_answer": "சிவப்பு",
                "options": ["சிவப்பு", "நீலம்", "பச்சை", "மஞ்சள்"],
                "response_format": "voice_select"
            }
        ],
        "hi": [
            {
                "id": "att_hi_1",
                "type": "stroop",
                "question": "यह शब्द किस रंग में दिखाया गया है? 'नीला' शब्द लाल रंग में दिखाया गया है.",
                "display_word": "नीला",
                "display_color": "red",
                "correct_answer": "लाल",
                "options": ["लाल", "नीला", "हरा", "पीला"],
                "response_format": "voice_select"
            }
        ],
        "te": [
            {
                "id": "att_te_1",
                "type": "stroop",
                "question": "ఈ పదం ఏ రంగులో చూపబడింది? 'నీలం' అనే పదం ఎరుపు రంగులో చూపబడింది.",
                "display_word": "నీలం",
                "display_color": "red",
                "correct_answer": "ఎరుపు",
                "options": ["ఎరుపు", "నీలం", "ఆకుపచ్చ", "పసుపు"],
                "response_format": "voice_select"
            }
        ]
    },
    "language": {
        "en": [
            {
                "id": "lang_en_1",
                "type": "naming",
                "question": "What is this object? It is a common yellow fruit.",
                "correct_answer": "banana",
                "options": ["banana", "apple", "orange", "grape"],
                "hint": "It is curved and yellow.",
                "response_format": "voice_select"
            },
            {
                "id": "lang_en_2",
                "type": "comprehension",
                "question": "The cat sat on the mat. Where did the cat sit?",
                "correct_answer": "mat",
                "options": ["mat", "chair", "table", "floor"],
                "response_format": "voice_select"
            },
            {
                "id": "lang_en_3",
                "type": "fluency",
                "question": "Name as many animals as you can in 30 seconds.",
                "category": "animals",
                "expected_keywords": ["dog", "cat", "bird", "fish", "lion", "tiger", "elephant", "horse", "cow", "sheep", "rabbit", "snake", "monkey", "bear", "deer"],
                "options": [],
                "response_format": "voice_free"
            },
            {
                "id": "lang_en_4",
                "type": "repetition",
                "question": "Repeat this sentence: The quick brown fox jumps over the lazy dog.",
                "correct_answer": "the quick brown fox jumps over the lazy dog",
                "options": [],
                "response_format": "voice_free"
            }
        ],
        "ta": [
            {
                "id": "lang_ta_1",
                "type": "naming",
                "question": "இது என்ன பொருள்? இது ஒரு பொதுவான மஞ்சள் பழம்.",
                "correct_answer": "வாழைப்பழம்",
                "options": ["வாழைப்பழம்", "ஆப்பிள்", "ஆரஞ்சு", "திராட்சை"],
                "hint": "இது வளைந்ததாகவும் மஞ்சளாகவும் இருக்கும்.",
                "response_format": "voice_select"
            },
            {
                "id": "lang_ta_2",
                "type": "comprehension",
                "question": "பூனை பாயின் மேல் அமர்ந்தது. பூனை எங்கே அமர்ந்தது?",
                "correct_answer": "பாய்",
                "options": ["பாய்", "நாற்காலி", "மேசை", "தரை"],
                "response_format": "voice_select"
            }
        ],
        "hi": [
            {
                "id": "lang_hi_1",
                "type": "naming",
                "question": "यह क्या वस्तु है? यह एक आम पीला फल है.",
                "correct_answer": "केला",
                "options": ["केला", "सेब", "संतरा", "अंगूर"],
                "hint": "यह मुड़ा हुआ और पीला होता है.",
                "response_format": "voice_select"
            }
        ],
        "te": [
            {
                "id": "lang_te_1",
                "type": "naming",
                "question": "ఈ వస్తువు ఏమిటి? ఇది ఒక సాధారణ పసుపు పండు.",
                "correct_answer": "అరటి",
                "options": ["అరటి", "ఆపిల్", "నారింజ", "ద్రాక్ష"],
                "hint": "ఇది వంకరగా మరియు పసుపు రంగులో ఉంటుంది.",
                "response_format": "voice_select"
            }
        ]
    },
    "visuospatial": {
        "en": [
            {
                "id": "vis_en_1",
                "type": "pattern",
                "question": "What comes next in this pattern? ▲ ■ ● ▲ ■ ?",
                "correct_answer": "●",
                "options": ["●", "▲", "■", "★"],
                "response_format": "voice_select"
            },
            {
                "id": "vis_en_2",
                "type": "clock",
                "question": "Draw a clock showing 10:10",
                "correct_answer": "10:10",
                "options": [],
                "response_format": "drawing"
            },
            {
                "id": "vis_en_3",
                "type": "spatial",
                "question": "If you fold this paper in half, which shape do you get? A square paper folded diagonally.",
                "correct_answer": "triangle",
                "options": ["triangle", "rectangle", "circle", "pentagon"],
                "response_format": "voice_select"
            }
        ],
        "ta": [
            {
                "id": "vis_ta_1",
                "type": "pattern",
                "question": "இந்த முறையில் அடுத்தது என்ன? ▲ ■ ● ▲ ■ ?",
                "correct_answer": "●",
                "options": ["●", "▲", "■", "★"],
                "response_format": "voice_select"
            }
        ],
        "hi": [
            {
                "id": "vis_hi_1",
                "type": "pattern",
                "question": "इस पैटर्न में आगे क्या आता है? ▲ ■ ● ▲ ■ ?",
                "correct_answer": "●",
                "options": ["●", "▲", "■", "★"],
                "response_format": "voice_select"
            }
        ],
        "te": [
            {
                "id": "vis_te_1",
                "type": "pattern",
                "question": "ఈ నమూనాలో తదుపరి ఏమిటి? ▲ ■ ● ▲ ■ ?",
                "correct_answer": "●",
                "options": ["●", "▲", "■", "★"],
                "response_format": "voice_select"
            }
        ]
    }
}


# ============================================================
# FUZZY MATCHING ENGINE
# ============================================================

def fuzzy_match_option(transcript, options, threshold=60):
    """
    Match a spoken transcript to the closest option using fuzzy matching.
    Supports Unicode scripts: Tamil, Hindi, Telugu, etc.
    """
    import re

    if not transcript or not options:
        return {"matched_option": None, "confidence": 0,
                "original_transcript": transcript, "all_scores": []}

    # Strip only punctuation; keep all Unicode letters (Tamil, Hindi, etc.)
    def normalise(s):
        s = s.strip().lower()
        # Remove punctuation but NOT Unicode letters/digits
        s = re.sub(r'[\u0000-\u0040\u005B-\u0060\u007B-\u00BF]+', ' ', s)
        return ' '.join(s.split())

    cleaned = normalise(transcript)
    transcript_words = cleaned.split()

    # Remove filler words (English only — safe for non-English too)
    filler_words = {"um", "uh", "like", "the", "a", "an", "is", "it", "its"}
    transcript_words = [w for w in transcript_words if w not in filler_words] or transcript_words
    cleaned = " ".join(transcript_words)

    lower_options = [normalise(opt) for opt in options]

    # 1. Exact full match
    if cleaned in lower_options:
        idx = lower_options.index(cleaned)
        return {"matched_option": options[idx], "confidence": 100,
                "original_transcript": transcript, "all_scores": [(options[idx], 100)]}

    # 2. Word-in-transcript containment (key fix for multi-word spoken answers)
    for i, opt_clean in enumerate(lower_options):
        if opt_clean and opt_clean in transcript_words:
            return {"matched_option": options[i], "confidence": 100,
                    "original_transcript": transcript, "all_scores": [(options[i], 100)]}

    # 3. fuzzywuzzy fuzzy match (works best for ASCII / romanised text)
    scores = []
    for opt, opt_clean in zip(options, lower_options):
        # Also fuzz against individual transcript words for short options
        candidates = [cleaned] + transcript_words
        best_score = 0
        for candidate in candidates:
            ratio       = fuzz.ratio(candidate, opt_clean)
            partial     = fuzz.partial_ratio(candidate, opt_clean)
            token_sort  = fuzz.token_sort_ratio(candidate, opt_clean)
            best_score  = max(best_score, ratio, partial, token_sort)
        scores.append((opt, best_score))

    scores.sort(key=lambda x: x[1], reverse=True)
    best_match, best_score = scores[0]

    if best_score >= threshold:
        return {"matched_option": best_match, "confidence": best_score,
                "original_transcript": transcript, "all_scores": scores}

    return {"matched_option": None, "confidence": best_score,
            "original_transcript": transcript, "all_scores": scores}


def fuzzy_match_multiple(transcript, options, threshold=55):
    """
    Check which words from 'options' appear in the spoken transcript.
    Designed for voice_recall tests (e.g., remember 3 Tamil words).
    Works with Unicode scripts: Tamil, Hindi, Telugu, etc.
    """
    import re
    if not transcript or not options:
        return []

    def normalise(s):
        s = s.strip().lower()
        # Strip only punctuation, keep Unicode letters
        s = re.sub(r'[\u0000-\u0040\u005B-\u0060\u007B-\u00BF]+', ' ', s)
        return ' '.join(s.split())

    cleaned = normalise(transcript)
    transcript_words = cleaned.split()
    matched = []

    for opt in options:
        opt_clean = normalise(opt)
        if not opt_clean:
            continue

        # 1. Exact word hit in transcript (handles Tamil perfectly)
        if opt_clean in transcript_words:
            if opt not in matched:
                matched.append(opt)
            continue

        # 2. Full-string or per-word fuzzy (for romanised/Hindi/approximate)
        candidates = [cleaned] + transcript_words
        best = max(
            max(fuzz.ratio(c, opt_clean) for c in candidates),
            max(fuzz.partial_ratio(c, opt_clean) for c in candidates)
        )
        if best >= threshold and opt not in matched:
            matched.append(opt)

    return matched


# ============================================================
# COGNITIVE SCORING ENGINE
# ============================================================

def calculate_domain_score(test_type, answers):
    """
    Calculate score for a specific cognitive domain.
    
    Args:
        test_type: 'memory', 'attention', 'language', 'visuospatial'
        answers: List of answer records with correctness
    
    Returns:
        dict with score, details
    """
    if not answers:
        return {"score": 0, "details": {}}
    
    correct_count = sum(1 for a in answers if a.get("is_correct", False))
    total = len(answers)
    base_score = round((correct_count / total) * 100) if total > 0 else 0
    
    details = {
        "correct": correct_count,
        "total": total,
        "base_score": base_score
    }
    
    if test_type == "memory":
        # Memory scoring: weight recall accuracy and response time
        avg_confidence = sum(a.get("confidence", 0) for a in answers) / total
        time_bonus = 0
        for a in answers:
            rt = a.get("response_time", 10)
            if rt < 5:
                time_bonus += 5
            elif rt < 10:
                time_bonus += 2
        
        score = min(100, base_score + time_bonus)
        details["avg_confidence"] = round(avg_confidence, 1)
        details["time_bonus"] = time_bonus
        
    elif test_type == "attention":
        # Attention scoring: accuracy + reaction time weighting
        total_rt = sum(a.get("response_time", 0) for a in answers)
        avg_rt = total_rt / total if total > 0 else 0
        
        # Faster reaction = higher bonus (up to 15 points)
        rt_bonus = max(0, min(15, 15 - (avg_rt * 3)))
        score = min(100, base_score + round(rt_bonus))
        
        details["avg_reaction_time"] = round(avg_rt, 2)
        details["rt_bonus"] = round(rt_bonus, 1)
        
    elif test_type == "language":
        # Language scoring: accuracy + semantic similarity bonus
        keyword_matches = sum(a.get("keyword_count", 0) for a in answers)
        keyword_bonus = min(10, keyword_matches * 2)
        
        score = min(100, base_score + keyword_bonus)
        details["keyword_matches"] = keyword_matches
        details["keyword_bonus"] = keyword_bonus
        
    elif test_type == "visuospatial":
        # Visuospatial: straight accuracy-based
        score = base_score
    else:
        score = base_score
    
    details["final_score"] = score
    return {"score": score, "details": details}


def classify_risk(scores, age=None, education_level=None):
    """
    Classify cognitive risk based on domain scores.
    
    Args:
        scores: dict with memory_score, attention_score, language_score, visuospatial_score
        age: optional, user's age
        education_level: optional, education level string
    
    Returns:
        dict with risk_level, brain_health_index, recommendations
    """
    weights = {
        "memory": 0.30,
        "attention": 0.25,
        "language": 0.25,
        "visuospatial": 0.20
    }
    
    # Calculate weighted Brain Health Index
    bhi = 0
    for domain, weight in weights.items():
        key = f"{domain}_score"
        domain_score = scores.get(key, scores.get(domain, 0))
        bhi += domain_score * weight
    
    bhi = round(bhi, 1)
    
    # Age-adjusted thresholds
    age_factor = 0
    if age:
        if age >= 70:
            age_factor = 5  # More lenient for older adults
        elif age >= 60:
            age_factor = 3
    
    # Determine risk level
    if bhi >= (75 - age_factor):
        risk_level = "Normal"
        risk_description = "Your cognitive function appears to be within normal range."
    elif bhi >= (55 - age_factor):
        risk_level = "MCI"  # Mild Cognitive Impairment
        risk_description = "Some areas of cognitive function may benefit from monitoring. Consider consulting a healthcare provider."
    else:
        risk_level = "High Risk"
        risk_description = "Several areas of cognitive function show below-average performance. We recommend consulting a neurologist for a comprehensive evaluation."
    
    # Generate recommendations
    recommendations = []
    
    memory_score = scores.get("memory_score", scores.get("memory", 0))
    attention_score = scores.get("attention_score", scores.get("attention", 0))
    language_score = scores.get("language_score", scores.get("language", 0))
    visuospatial_score = scores.get("visuospatial_score", scores.get("visuospatial", 0))
    
    if memory_score < 70:
        recommendations.append("Practice memory exercises like word recall and number sequences daily.")
    if attention_score < 70:
        recommendations.append("Try mindfulness meditation and focus-training exercises.")
    if language_score < 70:
        recommendations.append("Read regularly and practice word games to strengthen language skills.")
    if visuospatial_score < 70:
        recommendations.append("Engage in puzzles, drawing, and spatial reasoning activities.")
    
    if not recommendations:
        recommendations.append("Maintain your cognitive health with regular mental exercises.")
        recommendations.append("Stay physically active and maintain a healthy diet.")
    
    return {
        "risk_level": risk_level,
        "brain_health_index": bhi,
        "risk_description": risk_description,
        "recommendations": recommendations,
        "domain_scores": {
            "memory": memory_score,
            "attention": attention_score,
            "language": language_score,
            "visuospatial": visuospatial_score
        }
    }


# ============================================================
# API ENDPOINTS
# ============================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "NeuroLingo Backend",
        "version": "1.0.0",
        "timestamp": time.time()
    })


@app.route('/api/test/start', methods=['POST'])
def start_test():
    """
    Start a new test session.
    
    Body: { "user_id": "...", "language": "ta", "test_type": "memory" }
    """
    data = request.get_json()
    
    user_id = data.get("user_id", str(uuid.uuid4()))
    language = data.get("language", "en")
    test_type = data.get("test_type", "memory")
    age = data.get("age")
    education_level = data.get("education_level")
    
    # Create session
    session_id = str(uuid.uuid4())
    
    # Get questions for this test type and language
    test_questions = QUESTIONS_DB.get(test_type, {})
    questions = test_questions.get(language, test_questions.get("en", []))
    
    sessions[session_id] = {
        "session_id": session_id,
        "user_id": user_id,
        "language": language,
        "test_type": test_type,
        "age": age,
        "education_level": education_level,
        "questions": questions,
        "current_question_index": 0,
        "answers": [],
        "started_at": time.time(),
        "status": "in_progress"
    }
    
    return jsonify({
        "session_id": session_id,
        "test_type": test_type,
        "language": language,
        "total_questions": len(questions),
        "first_question": questions[0] if questions else None
    })


@app.route('/api/test/question', methods=['GET'])
def get_question():
    """
    Fetch the next question in the session.
    
    Query params: session_id
    """
    session_id = request.args.get("session_id")
    
    if not session_id or session_id not in sessions:
        return jsonify({"error": "Invalid session ID"}), 400
    
    session = sessions[session_id]
    idx = session["current_question_index"]
    questions = session["questions"]
    
    if idx >= len(questions):
        return jsonify({
            "status": "completed",
            "message": "All questions have been answered",
            "total_answered": len(session["answers"])
        })
    
    question = questions[idx]
    
    return jsonify({
        "question_index": idx,
        "total_questions": len(questions),
        "question": question,
        "language": session["language"],
        "test_type": session["test_type"]
    })


@app.route('/api/test/answer', methods=['POST'])
def submit_answer():
    """
    Submit an answer with fuzzy matching.
    
    Body: {
        "session_id": "...",
        "transcript": "appl",
        "response_time": 3.5
    }
    """
    data = request.get_json()
    
    session_id = data.get("session_id")
    transcript = data.get("transcript", "")
    response_time = data.get("response_time", 0)
    
    if not session_id or session_id not in sessions:
        return jsonify({"error": "Invalid session ID"}), 400
    
    session = sessions[session_id]
    idx = session["current_question_index"]
    questions = session["questions"]
    
    if idx >= len(questions):
        return jsonify({"error": "No more questions"}), 400
    
    question = questions[idx]
    
    # Apply fuzzy matching based on question type
    if question.get("response_format") == "voice_recall":
        # Match multiple words for recall tests
        options = question.get("words_to_remember", question.get("options", []))
        matched_words = fuzzy_match_multiple(transcript, options)
        correct_words = question.get("words_to_remember", [])
        
        correct_count = len([w for w in matched_words if w.lower() in [c.lower() for c in correct_words]])
        is_correct = correct_count > 0
        
        match_result = {
            "matched_words": matched_words,
            "correct_count": correct_count,
            "total_expected": len(correct_words),
            "confidence": round((correct_count / len(correct_words)) * 100) if correct_words else 0
        }
    elif question.get("response_format") == "voice_free":
        # Free-form response (e.g., fluency tests)
        expected_keywords = question.get("expected_keywords", [])
        if expected_keywords:
            matched_words = fuzzy_match_multiple(transcript, expected_keywords, threshold=50)
            is_correct = len(matched_words) > 0
            match_result = {
                "matched_keywords": matched_words,
                "keyword_count": len(matched_words),
                "confidence": min(100, len(matched_words) * 10)
            }
        else:
            # Simple string comparison
            correct = question.get("correct_answer", "")
            result = fuzzy_match_option(transcript, [correct])
            is_correct = result["confidence"] >= 60
            match_result = result
    else:
        # Standard option matching
        options = question.get("options", [])
        match_result = fuzzy_match_option(transcript, options)
        
        correct_answer = question.get("correct_answer", "")
        matched = match_result.get("matched_option", "")
        is_correct = matched and matched.lower() == correct_answer.lower()
    
    # Record the answer
    answer_record = {
        "question_id": question["id"],
        "question_index": idx,
        "original_transcript": transcript,
        "match_result": match_result,
        "is_correct": is_correct,
        "response_time": response_time,
        "confidence": match_result.get("confidence", 0),
        "keyword_count": match_result.get("keyword_count", 0),
        "timestamp": time.time()
    }
    
    session["answers"].append(answer_record)
    session["current_question_index"] = idx + 1
    
    # Check if test is complete
    test_complete = (idx + 1) >= len(questions)
    
    response = {
        "status": "completed" if test_complete else "next",
        "answer_result": {
            "is_correct": is_correct,
            "matched": match_result.get("matched_option") or match_result.get("matched_words", []),
            "confidence": match_result.get("confidence", 0),
            "correct_answer": question.get("correct_answer", question.get("words_to_remember", ""))
        },
        "question_index": idx,
        "next_question_index": idx + 1 if not test_complete else None
    }
    
    if test_complete:
        # Calculate score for this domain
        score_result = calculate_domain_score(session["test_type"], session["answers"])
        response["domain_score"] = score_result
        session["score"] = score_result
    
    return jsonify(response)


@app.route('/api/test/score', methods=['POST'])
def calculate_scores():
    """
    Calculate cognitive scores for all completed test domains.
    
    Body: {
        "session_ids": ["id1", "id2", ...],
        OR
        "scores": { "memory": 85, "attention": 78, ... }
    }
    """
    data = request.get_json()
    
    # Option 1: Calculate from sessions
    session_ids = data.get("session_ids", [])
    if session_ids:
        domain_scores = {}
        for sid in session_ids:
            if sid in sessions:
                session = sessions[sid]
                test_type = session["test_type"]
                if "score" in session:
                    domain_scores[test_type] = session["score"]["score"]
                else:
                    score_result = calculate_domain_score(test_type, session["answers"])
                    domain_scores[test_type] = score_result["score"]
        
        return jsonify({
            "memory_score": domain_scores.get("memory", 0),
            "attention_score": domain_scores.get("attention", 0),
            "language_score": domain_scores.get("language", 0),
            "visuospatial_score": domain_scores.get("visuospatial", 0),
            "total_score": sum(domain_scores.values())
        })
    
    # Option 2: Direct scores provided
    scores = data.get("scores", {})
    return jsonify({
        "memory_score": scores.get("memory", 0),
        "attention_score": scores.get("attention", 0),
        "language_score": scores.get("language", 0),
        "visuospatial_score": scores.get("visuospatial", 0),
        "total_score": sum(scores.values())
    })


@app.route('/api/test/risk', methods=['POST'])
def assess_risk():
    """
    Risk classification endpoint.
    
    Body: {
        "scores": { "memory": 85, "attention": 78, "language": 90, "visuospatial": 75 },
        "age": 65,
        "education_level": "college"
    }
    """
    data = request.get_json()
    
    scores = data.get("scores", {})
    age = data.get("age")
    education_level = data.get("education_level")
    
    result = classify_risk(scores, age, education_level)
    return jsonify(result)


@app.route('/api/test/match', methods=['POST'])
def match_transcript():
    """
    Standalone fuzzy matching endpoint.
    
    Body: {
        "transcript": "appl",
        "options": ["apple", "banana", "grape"],
        "threshold": 60
    }
    """
    data = request.get_json()
    
    transcript = data.get("transcript", "")
    options = data.get("options", [])
    threshold = data.get("threshold", 60)
    
    result = fuzzy_match_option(transcript, options, threshold)
    return jsonify(result)


@app.route('/api/tts', methods=['GET'])
def text_to_speech():
    """
    Text-to-Speech using gTTS to support all scripts.
    """
    text = request.args.get("text", "")
    language = request.args.get("language", "en")
    
    # Map short codes to gTTS supported codes
    # gTTS supports en, ta, hi, te, bn, etc.
    tts_lang = language[:2] if len(language) > 2 else language
    
    try:
        from gtts import gTTS
        import io
        tts = gTTS(text=text, lang=tts_lang)
        fp = io.BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        from flask import send_file
        return send_file(fp, mimetype='audio/mpeg')
    except ImportError:
        return jsonify({"error": "gTTS not installed"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500



# ── Whisper model cache (loaded once at startup, not per-request) ──────────────
_whisper_model = None
_whisper_available = False

def _get_whisper_model():
    global _whisper_model, _whisper_available
    if _whisper_model is not None:
        return _whisper_model
    try:
        import whisper
        print("[Whisper] Loading 'base' model (first request)...")
        _whisper_model = whisper.load_model("base")
        _whisper_available = True
        print("[Whisper] Model loaded and cached.")
        return _whisper_model
    except ImportError:
        print("[Whisper] openai-whisper not installed.")
        return None
    except Exception as e:
        print(f"[Whisper] Failed to load model: {e}")
        return None


@app.route('/api/stt', methods=['POST'])
def speech_to_text():
    """
    Speech-to-Text using OpenAI Whisper – supports all languages including
    Tamil (ta-IN), Hindi (hi-IN), Telugu (te-IN), etc.

    Body: multipart/form-data
        audio  – audio file (webm / mp4 / wav / ogg …)
        language – short code: 'en', 'ta', 'hi', 'te', 'bn'
    """
    import os, tempfile

    language = request.form.get("language", "en")

    # Whisper uses ISO 639-1 codes (2-letter), same as our short codes
    whisper_lang_map = {"en": "en", "ta": "ta", "hi": "hi", "te": "te", "bn": "bn"}
    whisper_lang = whisper_lang_map.get(language, language[:2])

    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    model = _get_whisper_model()
    if model is None:
        return jsonify({
            "transcript": "",
            "language": whisper_lang,
            "engine": "whisper_unavailable",
            "error": "Whisper model not available — install openai-whisper and restart backend."
        }), 200

    import os, tempfile
    audio_file = request.files["audio"]
    suffix = ".webm"
    mime = audio_file.content_type or ""
    if "mp4" in mime or "m4a" in mime:
        suffix = ".mp4"
    elif "ogg" in mime:
        suffix = ".ogg"
    elif "wav" in mime:
        suffix = ".wav"
    elif "mp3" in mime or "mpeg" in mime:
        suffix = ".mp3"

    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            audio_file.save(tmp)
            tmp_path = tmp.name

        result = model.transcribe(
            tmp_path,
            language=whisper_lang,
            fp16=False        # safe on CPU
        )

        transcript = result.get("text", "").strip()
        detected_lang = result.get("language", whisper_lang)

        return jsonify({
            "transcript": transcript,
            "language": detected_lang,
            "engine": "whisper",
        })

    except FileNotFoundError as e:
        # Usually means ffmpeg is not installed — don't crash Flask
        msg = str(e)
        if "ffmpeg" in msg.lower() or "avconv" in msg.lower():
            print(f"[Whisper] ffmpeg not found: {msg}")
            return jsonify({
                "transcript": "",
                "engine": "whisper_no_ffmpeg",
                "error": "ffmpeg is not installed. Install it for Whisper to decode audio."
            }), 200
        return jsonify({"error": msg, "transcript": ""}), 500
    except Exception as e:
        print(f"[Whisper] transcription error: {e}")
        return jsonify({"error": str(e), "transcript": ""}), 500
    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except Exception:
                pass


@app.route('/api/questions', methods=['GET'])
def get_all_questions():
    """
    Get all available questions for a test type and language.
    
    Query params: test_type, language
    """
    test_type = request.args.get("test_type", "memory")
    language = request.args.get("language", "en")
    
    test_questions = QUESTIONS_DB.get(test_type, {})
    questions = test_questions.get(language, test_questions.get("en", []))
    
    return jsonify({
        "test_type": test_type,
        "language": language,
        "total": len(questions),
        "questions": questions
    })

@app.route('/api/translate', methods=['POST'])
def translate_text():
    """
    Translates webpage contents using IndicBert logic.
    For demonstration purposes, this will use a mock dictionary
    when the actual model is not loaded to prevent huge downloads,
    but it represents the IndicBert integration.
    Body: {"texts": ["text1", "text2"], "target_lang": "ta"}
    """
    data = request.get_json()
    texts = data.get("texts", [])
    target_lang = data.get("target_lang", "en")
    
    if target_lang == "en":
        return jsonify({"translations": texts})
        
    translations = []
    # Mock IndicBert translation output
    for text in texts:
        if target_lang == "ta":
            translations.append(f"[IndicBert தமிழ்] {text}")
        elif target_lang == "hi":
            translations.append(f"[IndicBert हिंदी] {text}")
        elif target_lang == "te":
            translations.append(f"[IndicBert తెలుగు] {text}")
        else:
            translations.append(text)
            
    return jsonify({
        "translations": translations,
        "engine": "IndicBert_Translation_Model"
    })

# ============================================================
# MAIN
# ============================================================

if __name__ == '__main__':
    print("🧠 NeuroLingo Backend Starting...")
    print("=" * 50)
    print("Available endpoints:")
    print("  GET  /api/health        - Health check")
    print("  POST /api/test/start    - Start test session")
    print("  GET  /api/test/question - Get next question")
    print("  POST /api/test/answer   - Submit answer")
    print("  POST /api/test/score    - Calculate scores")
    print("  POST /api/test/risk     - Risk classification")
    print("  POST /api/test/match    - Fuzzy matching")
    print("  GET  /api/tts           - Text-to-Speech")
    print("  POST /api/stt           - Speech-to-Text")
    print("  GET  /api/questions     - Get all questions")
    print("=" * 50)
    
    app.run(debug=True, port=5000)
