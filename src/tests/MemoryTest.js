import React, { useState, useEffect, useContext, useRef } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { memoryWords } from '../data/memoryTestData';
import '../assets/styles/cognitive-tests.css';

const MemoryTest = ({ onComplete, onCancel }) => {
    const { t, language } = useContext(LanguageContext);
    const [testPhase, setTestPhase] = useState('instruction'); // instruction, memorization, distraction, recall, results
    const [progress, setProgress] = useState(0);
    const [memoryItems, setMemoryItems] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [timeRemaining, setTimeRemaining] = useState(30);
    const [distractionTask, setDistractionTask] = useState({ question: '', answer: 0 });
    const [distractionInput, setDistractionInput] = useState('');
    const [results, setResults] = useState({
        score: 0,
        correctItems: 0,
        totalItems: 0,
        responseTime: 0
    });
    const [startTime, setStartTime] = useState(null);
    const timerRef = useRef(null);

    // Generate memory items based on language
    useEffect(() => {
        if (testPhase === 'memorization') {
            const wordPool = memoryWords[language] || memoryWords['en'];

            // Select random words
            const selectedWords = [];
            const wordCount = 8; // Number of words to remember

            // Create a copy to avoid modifying the original array
            const poolCopy = [...wordPool];

            while (selectedWords.length < wordCount && poolCopy.length > 0) {
                const randomIndex = Math.floor(Math.random() * poolCopy.length);
                const word = poolCopy.splice(randomIndex, 1)[0];
                selectedWords.push(word);
            }

            setMemoryItems(selectedWords);

            // Automatically move to distraction phase after 30 seconds
            timerRef.current = setTimeout(() => {
                setTestPhase('distraction');
                setProgress(33);
                setTimeRemaining(15);
                generateDistractionTask();
            }, 30000);

            return () => {
                if (timerRef.current) clearTimeout(timerRef.current);
            };
        }
    }, [testPhase, language]);

    // Generate distraction task
    const generateDistractionTask = () => {
        const num1 = Math.floor(Math.random() * 20) + 1;
        const num2 = Math.floor(Math.random() * 20) + 1;
        const operator = Math.random() > 0.5 ? '+' : '-';

        let answer;
        let question;

        if (operator === '+') {
            answer = num1 + num2;
            question = `${num1} + ${num2}`;
        } else {
            // Ensure positive result for subtraction
            const max = Math.max(num1, num2);
            const min = Math.min(num1, num2);
            answer = max - min;
            question = `${max} - ${min}`;
        }

        setDistractionTask({ question, answer });
        setDistractionInput('');
    };

    // Handle countdown timer
    useEffect(() => {
        if ((testPhase === 'memorization' || testPhase === 'distraction') && timeRemaining > 0) {
            const timer = setTimeout(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);

            return () => clearTimeout(timer);
        } else if (testPhase === 'distraction' && timeRemaining === 0) {
            setTestPhase('recall');
            setProgress(66);
            setStartTime(Date.now());
        }
    }, [testPhase, timeRemaining]);

    const handleStartTest = () => {
        setTestPhase('memorization');
        setTimeRemaining(30);
        setProgress(0);
        setUserAnswers([]);
    };

    const handleInputChange = (e) => {
        setCurrentInput(e.target.value);
    };

    const handleAddAnswer = () => {
        if (currentInput.trim()) {
            // Check if already added
            if (!userAnswers.includes(currentInput.trim())) {
                setUserAnswers([...userAnswers, currentInput.trim()]);
            }
            setCurrentInput('');
        }
    };

    const handleRemoveAnswer = (index) => {
        const newAnswers = [...userAnswers];
        newAnswers.splice(index, 1);
        setUserAnswers(newAnswers);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddAnswer();
        }
    };

    const handleDistractionSubmit = (e) => {
        e.preventDefault();
        // Just generate a new task regardless of correctness to keep them busy
        generateDistractionTask();
    };

    const handleCompleteRecall = () => {
        const endTime = Date.now();
        const responseTimeSeconds = Math.floor((endTime - startTime) / 1000);

        // Calculate score
        let correctCount = 0;
        const normalizedUserAnswers = userAnswers.map(answer => answer.toLowerCase().trim());
        const normalizedMemoryItems = memoryItems.map(item => item.toLowerCase().trim());

        // Count unique correct answers
        const uniqueCorrectAnswers = new Set();

        normalizedUserAnswers.forEach(answer => {
            if (normalizedMemoryItems.includes(answer)) {
                uniqueCorrectAnswers.add(answer);
            }
        });

        correctCount = uniqueCorrectAnswers.size;

        // Calculate percentage score (0-100)
        const percentage = Math.round((correctCount / memoryItems.length) * 100);

        setResults({
            score: percentage,
            correctItems: correctCount,
            totalItems: memoryItems.length,
            responseTime: responseTimeSeconds
        });

        setTestPhase('results');
        setProgress(100);

        // If onComplete callback is provided, pass the results
        if (onComplete) {
            onComplete({
                domain: 'memory',
                score: percentage,
                details: {
                    correctItems: correctCount,
                    totalItems: memoryItems.length,
                    responseTime: responseTimeSeconds,
                    items: memoryItems,
                    userAnswers: userAnswers
                }
            });
        }
    };

    return (
        <div className="cognitive-test-container">
            <div className="test-header">
                <h2>{t('memory_test_title', 'Memory Test')}</h2>
                <p className="description">{t('memory_test_desc', 'Assessment of short-term and working memory')}</p>

                <div className="progress-indicator">
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="progress-text">{progress}% {t('complete', 'complete')}</span>
                </div>
            </div>

            {testPhase === 'instruction' && (
                <div className="test-content">
                    <div className="test-instructions">
                        <h3>{t('instructions', 'Instructions')}</h3>
                        <p>{t('memory_instruction_1', 'You will be shown a list of words to memorize for 30 seconds.')}</p>
                        <p>{t('memory_instruction_2', 'After a brief distraction task, you\'ll be asked to recall as many words as you can.')}</p>
                        <p>{t('memory_instruction_3', 'Try to remember as many words as possible.')}</p>
                    </div>
                    <div className="button-group">
                        {onCancel && (
                            <button className="btn cancel-btn" onClick={onCancel}>
                                {t('cancel', 'Cancel')}
                            </button>
                        )}
                        <button className="btn primary-btn" onClick={handleStartTest}>
                            {t('start_memory_test', 'Start Memory Test')}
                        </button>
                    </div>
                </div>
            )}

            {testPhase === 'memorization' && (
                <div className="test-content">
                    <div className="memorization-phase">
                        <h3>{t('memorize_words', 'Memorize these words')}</h3>
                        <div className="timer-display">
                            {t('time_remaining', 'Time remaining')}: <span className="time-value">{timeRemaining}s</span>
                        </div>

                        <div className="word-grid">
                            {memoryItems.map((item, index) => (
                                <div key={index} className="memory-card">
                                    {item}
                                </div>
                            ))}
                        </div>

                        <p className="task-instruction">{t('memorize_instruction', 'Try to remember these words in any order.')}</p>
                    </div>
                </div>
            )}

            {testPhase === 'distraction' && (
                <div className="test-content">
                    <div className="distraction-phase">
                        <h3>{t('quick_math', 'Quick Math')}</h3>
                        <p>{t('distraction_instruction', 'Solve these problems while waiting.')}</p>
                        <div className="timer-display">
                            {t('time_remaining', 'Time remaining')}: <span className="time-value">{timeRemaining}s</span>
                        </div>

                        <div className="math-problem">
                            <span className="problem-text">{distractionTask.question} = ?</span>
                        </div>

                        <form onSubmit={handleDistractionSubmit} className="distraction-form">
                            <input
                                type="number"
                                value={distractionInput}
                                onChange={(e) => setDistractionInput(e.target.value)}
                                autoFocus
                                className="math-input"
                            />
                            <button type="submit" className="btn secondary-btn">{t('submit', 'Submit')}</button>
                        </form>
                    </div>
                </div>
            )}

            {testPhase === 'recall' && (
                <div className="test-content">
                    <div className="recall-phase">
                        <h3>{t('word_recall', 'Word Recall')}</h3>
                        <p>{t('recall_instruction', 'Type the words you remember (in any order):')}</p>

                        <div className="memory-input-group">
                            <input
                                type="text"
                                value={currentInput}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                placeholder={t('type_word_placeholder', 'Type a word and press Enter')}
                                autoFocus
                            />
                            <button className="btn secondary-btn" onClick={handleAddAnswer} disabled={!currentInput.trim()}>
                                {t('add', 'Add')}
                            </button>
                        </div>

                        <div className="recalled-list">
                            {userAnswers.map((answer, index) => (
                                <div key={index} className="recalled-item">
                                    {answer}
                                    <button
                                        className="remove-answer"
                                        onClick={() => handleRemoveAnswer(index)}
                                        title={t('remove', 'Remove')}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="button-group">
                            <button className="btn primary-btn" onClick={handleCompleteRecall}>
                                {t('complete_test', 'Complete Test')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {testPhase === 'results' && (
                <div className="test-content">
                    <div className="results-phase">
                        <h3>{t('memory_test_results', 'Memory Test Results')}</h3>

                        <div className="overall-score">
                            <div className="score-circle">
                                {results.score}
                            </div>
                            <p>{t('your_memory_score', 'Your Memory Score')}</p>
                        </div>

                        <div className="result-details">
                            <p>{t('recalled_count', 'You correctly recalled')} <strong>{results.correctItems}</strong> {t('out_of', 'out of')} <strong>{results.totalItems}</strong> {t('words', 'words')}.</p>
                        </div>

                        <div className="comparison-container">
                            <div className="list-column">
                                <h4>{t('words_to_remember', 'Words to Remember')}:</h4>
                                <ul className="result-list">
                                    {memoryItems.map((item, index) => (
                                        <li key={index} className={userAnswers.map(a => a.toLowerCase()).includes(item.toLowerCase()) ? 'recalled' : 'missed'}>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="list-column">
                                <h4>{t('your_answers', 'Your Answers')}:</h4>
                                <ul className="result-list">
                                    {userAnswers.map((answer, index) => (
                                        <li key={index} className={memoryItems.map(i => i.toLowerCase()).includes(answer.toLowerCase()) ? 'correct' : 'incorrect'}>
                                            {answer}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="button-group">
                            <button className="btn primary-btn" onClick={handleStartTest}>
                                {t('retry_test', 'Retry Test')}
                            </button>
                            {/* If controlled by parent, this button might be redundant or should call a 'next' function */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemoryTest;