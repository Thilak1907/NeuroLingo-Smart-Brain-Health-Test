import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { comprehensionTasks, namingTasks } from '../data/languageTestData';
import '../assets/styles/cognitive-tests.css';

const LanguageTest = ({ onComplete, onCancel }) => {
    const { t, language } = useContext(LanguageContext);
    const [testPhase, setTestPhase] = useState('instruction'); // instruction, comprehension, naming, results
    const [progress, setProgress] = useState(0);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [currentComprehensionTasks, setCurrentComprehensionTasks] = useState([]);
    const [currentNamingTasks, setCurrentNamingTasks] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [results, setResults] = useState({
        score: 0,
        comprehensionScore: 0,
        namingScore: 0,
        accuracy: 0
    });

    // Load tasks based on language
    useEffect(() => {
        const lang = comprehensionTasks[language] ? language : 'en';
        setCurrentComprehensionTasks(comprehensionTasks[lang]);
        setCurrentNamingTasks(namingTasks[lang]);
    }, [language]);

    // Initialize comprehension phase
    useEffect(() => {
        if (testPhase === 'comprehension' && currentComprehensionTasks.length > 0 && startTime === null) {
            setStartTime(Date.now());
        }
    }, [testPhase, currentComprehensionTasks, startTime]);

    const handleStartTest = () => {
        setTestPhase('comprehension');
        setProgress(0);
        setCurrentTaskIndex(0);
        setCorrectAnswers(0);
        setWrongAnswers(0);
        setUserInput('');
        setStartTime(null); // Reset start time
    };

    const handleComprehensionAnswer = (selectedOption) => {
        const currentTask = currentComprehensionTasks[currentTaskIndex];

        if (selectedOption === currentTask.correctAnswer) {
            setCorrectAnswers(prev => prev + 1);
        } else {
            setWrongAnswers(prev => prev + 1);
        }

        if (currentTaskIndex < currentComprehensionTasks.length - 1) {
            setCurrentTaskIndex(prev => prev + 1);
            setProgress(Math.floor((currentTaskIndex + 1) / (currentComprehensionTasks.length + currentNamingTasks.length) * 100));
        } else {
            // Move to naming phase
            setTestPhase('naming');
            setCurrentTaskIndex(0);
            setProgress(50);
            setUserInput('');
        }
    };

    const handleNamingSubmit = () => {
        const currentTask = currentNamingTasks[currentTaskIndex];
        const normalizedInput = userInput.trim().toLowerCase();

        let isCorrect = false;
        for (const answer of currentTask.correctAnswer) {
            if (normalizedInput === answer.toLowerCase()) {
                isCorrect = true;
                break;
            }
        }

        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
        } else {
            setWrongAnswers(prev => prev + 1);
        }

        if (currentTaskIndex < currentNamingTasks.length - 1) {
            setCurrentTaskIndex(prev => prev + 1);
            setUserInput('');
            const newProgress = 50 + Math.floor((currentTaskIndex + 1) / currentNamingTasks.length * 50);
            setProgress(newProgress);
        } else {
            // Complete test
            completeTest();
        }
    };

    const showHint = () => {
        return currentNamingTasks[currentTaskIndex]?.hint || '';
    };

    const completeTest = () => {
        const endTimeMs = Date.now();
        setEndTime(endTimeMs);

        // Calculate results
        const totalQuestions = currentComprehensionTasks.length + currentNamingTasks.length;
        const totalAnswered = correctAnswers + wrongAnswers + (testPhase === 'naming' ? 1 : 0);

        // Calculate separate scores for each section
        const comprehensionTotal = currentComprehensionTasks.length;
        const namingTotal = currentNamingTasks.length;

        const comprehensionCorrect = Math.min(correctAnswers, comprehensionTotal);
        const namingCorrect = Math.max(0, correctAnswers - comprehensionTotal);

        const comprehensionScore = Math.round((comprehensionCorrect / comprehensionTotal) * 100);
        const namingScore = Math.round((namingCorrect / namingTotal) * 100);

        // Overall accuracy
        const accuracy = Math.round((correctAnswers / totalAnswered) * 100) || 0;

        // Combined score (weighted)
        const score = Math.round((comprehensionScore * 0.6) + (namingScore * 0.4));

        setResults({
            score,
            accuracy,
            comprehensionScore,
            namingScore
        });

        setTestPhase('results');
        setProgress(100);

        // Report results if callback provided
        if (onComplete) {
            onComplete({
                domain: 'language',
                score,
                details: {
                    accuracy,
                    comprehensionScore,
                    namingScore,
                    correctAnswers,
                    totalQuestions
                }
            });
        }
    };

    const renderInstructionPhase = () => (
        <div className="test-instruction-phase">
            <h2>{t('language_test_title', 'Language Test')}</h2>
            <div className="test-instructions">
                <p>{t('language_test_instruction1', 'This test will evaluate your language abilities through two different tasks:')}</p>

                <h3>{t('comprehension_test_title', 'Reading Comprehension')}</h3>
                <p>{t('comprehension_test_instruction', 'You will be shown a short text. After reading, you will be asked a question about the content.')}</p>

                <h3>{t('naming_test_title', 'Object Naming')}</h3>
                <p>{t('naming_test_instruction', 'You will be shown images of common objects. Your task is to type the name of each object.')}</p>

                <div className="test-time-info">
                    <p>{t('language_test_info', 'Take your time to read carefully and respond accurately.')}</p>
                </div>
            </div>

            <div className="button-group">
                <button onClick={onCancel} className="secondary-button">
                    {t('cancel', 'Cancel')}
                </button>
                <button onClick={handleStartTest} className="primary-button">
                    {t('start_test', 'Start Test')}
                </button>
            </div>
        </div>
    );

    const renderComprehensionPhase = () => {
        if (currentComprehensionTasks.length === 0) return <div>Loading...</div>;
        const currentTask = currentComprehensionTasks[currentTaskIndex];

        return (
            <div className="comprehension-phase">
                <div className="test-progress-header">
                    <div className="test-progress">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="progress-text">
                            {progress}%
                        </div>
                    </div>
                </div>

                <div className="comprehension-container">
                    <div className="comprehension-text">
                        {currentTask.text}
                    </div>

                    <div className="comprehension-question">
                        <h3>{currentTask.question}</h3>
                    </div>

                    <div className="comprehension-options">
                        {currentTask.options.map((option, index) => (
                            <button
                                key={index}
                                className="comprehension-option"
                                onClick={() => handleComprehensionAnswer(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    <div className="button-group" style={{ marginTop: '20px' }}>
                        <button onClick={onCancel} className="cancel-btn">
                            {t('cancel', 'Cancel')}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderNamingPhase = () => {
        if (currentNamingTasks.length === 0) return <div>Loading...</div>;
        const currentTask = currentNamingTasks[currentTaskIndex];

        return (
            <div className="naming-phase">
                <div className="test-progress-header">
                    <div className="test-progress">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="progress-text">
                            {progress}%
                        </div>
                    </div>
                </div>

                <div className="naming-container">
                    <h3>{t('naming_instruction', 'What is this called?')}</h3>

                    <div className="naming-image">
                        <span className="emoji-image">{currentTask.image}</span>
                    </div>

                    <div className="naming-input">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder={t('naming_placeholder', 'Type your answer here...')}
                        />
                        <button
                            onClick={handleNamingSubmit}
                            disabled={userInput.trim() === ''}
                            className="primary-button"
                        >
                            {t('submit', 'Submit')}
                        </button>
                    </div>

                    <div className="naming-hint">
                        <button className="hint-button" onClick={() => alert(showHint())}>
                            {t('show_hint', 'Show Hint')}
                        </button>
                    </div>

                    <div className="button-group" style={{ marginTop: '20px' }}>
                        <button onClick={onCancel} className="cancel-btn">
                            {t('cancel', 'Cancel')}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderResultsPhase = () => (
        <div className="test-results-phase">
            <h2>{t('language_test_completed', 'Language Test Completed!')}</h2>

            <div className="results-container">
                <div className="result-score">
                    <div className="score-circle">
                        <span className="score-value">{results.score}</span>
                    </div>
                    <div className="score-label">{t('score', 'Score')}</div>
                </div>

                <div className="results-details">
                    <div className="result-item">
                        <span className="result-label">{t('comprehension_score', 'Comprehension')}:</span>
                        <span className="result-value">{results.comprehensionScore}%</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">{t('naming_score', 'Naming')}:</span>
                        <span className="result-value">{results.namingScore}%</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">{t('overall_accuracy', 'Overall Accuracy')}:</span>
                        <span className="result-value">{results.accuracy}%</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">{t('correct_answers', 'Correct Answers')}:</span>
                        <span className="result-value">{correctAnswers}</span>
                    </div>
                </div>
            </div>

            <div className="results-interpretation">
                {results.score >= 80 ? (
                    <p className="interpretation high">
                        {t('language_high_score', 'Excellent! Your language abilities are very strong.')}
                    </p>
                ) : results.score >= 60 ? (
                    <p className="interpretation medium">
                        {t('language_medium_score', 'Good job! Your language skills are solid.')}
                    </p>
                ) : (
                    <p className="interpretation low">
                        {t('language_low_score', 'Your language skills could benefit from more reading and vocabulary practice.')}
                    </p>
                )}
            </div>

            <div className="test-navigation">
                <button onClick={() => setTestPhase('instruction')} className="secondary-button">
                    {t('retake_test', 'Retake Test')}
                </button>
            </div>
        </div>
    );

    // Render based on test phase
    switch (testPhase) {
        case 'instruction':
            return renderInstructionPhase();
        case 'comprehension':
            return renderComprehensionPhase();
        case 'naming':
            return renderNamingPhase();
        case 'results':
            return renderResultsPhase();
        default:
            return renderInstructionPhase();
    }
};

export default LanguageTest;