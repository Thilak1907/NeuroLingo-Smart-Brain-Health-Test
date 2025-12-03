import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { stroopData, oddOneOutData } from '../data/attentionTestData';
import '../assets/styles/cognitive-tests.css';

const AttentionTest = ({ onComplete, onCancel }) => {
    const { t, language } = useContext(LanguageContext);
    const [testPhase, setTestPhase] = useState('instruction'); // instruction, stroop, odd-one-out, results
    const [progress, setProgress] = useState(0);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [stroopTasks, setStroopTasks] = useState([]);
    const [oddTasks, setOddTasks] = useState([]);
    const [timeRemaining, setTimeRemaining] = useState(60);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [results, setResults] = useState({
        score: 0,
        reactionTime: 0,
        accuracy: 0
    });

    // Timer effect for timeRemaining countdown during test
    useEffect(() => {
        let timer;
        if ((testPhase === 'stroop' || testPhase === 'odd-one-out') && timeRemaining > 0) {
            timer = setTimeout(() => {
                setTimeRemaining(timeRemaining - 1);
            }, 1000);
        } else if (timeRemaining === 0 && (testPhase === 'stroop' || testPhase === 'odd-one-out')) {
            // Time's up, move to results
            completeTest();
        }
        return () => clearTimeout(timer);
    }, [timeRemaining, testPhase]);

    // Generate Stroop tasks
    useEffect(() => {
        if (testPhase === 'stroop' && stroopTasks.length === 0) {
            const currentLangData = stroopData[language] || stroopData['en'];
            const { colors, options } = currentLangData;
            const tasks = [];

            // Generate 10 Stroop tasks
            for (let i = 0; i < 10; i++) {
                const itemIndex = Math.floor(Math.random() * colors.length);
                const item = colors[itemIndex];

                tasks.push({
                    word: item.word,
                    displayColor: item.color,
                    options: shuffleArray([...options]),
                    correctAnswer: options.find(opt => {
                        // Map display color to option text (simplified logic, assumes options match color names)
                        // In a real app, we'd need a mapping. For now, we'll assume the options array 
                        // contains the translated color names corresponding to 'red', 'blue', etc.
                        // But wait, the data structure has 'word' and 'color' (english key).
                        // We need to map the English color key to the translated option.

                        // Let's find the index of the color in the English options, then get the translated option at that index.
                        const englishOptions = ['Red', 'Blue', 'Green', 'Yellow', 'Black'];
                        const colorIndex = englishOptions.findIndex(opt => opt.toLowerCase() === item.color.toLowerCase());
                        return options[colorIndex];
                    })
                });
            }

            setStroopTasks(shuffleArray(tasks));
            setStartTime(Date.now());
        }
    }, [testPhase, language]);

    // Generate Odd-One-Out tasks
    useEffect(() => {
        if (testPhase === 'odd-one-out' && oddTasks.length === 0) {
            // Use the external data
            // For a real app, we might want to randomize the order of items within each task
            // But for now, we'll just use the data as is, maybe shuffle the tasks themselves
            setOddTasks(shuffleArray([...oddOneOutData]));
        }
    }, [testPhase]);

    // Helper function to shuffle array
    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const handleStartTest = () => {
        setTestPhase('stroop');
        setProgress(0);
        setCurrentTaskIndex(0);
        setCorrectAnswers(0);
        setWrongAnswers(0);
        setTimeRemaining(60);
    };

    const handleStroopAnswer = (selectedOption) => {
        const currentTask = stroopTasks[currentTaskIndex];

        if (selectedOption === currentTask.correctAnswer) {
            setCorrectAnswers(prev => prev + 1);
        } else {
            setWrongAnswers(prev => prev + 1);
        }

        if (currentTaskIndex < stroopTasks.length - 1) {
            setCurrentTaskIndex(prev => prev + 1);
            setProgress(Math.floor((currentTaskIndex + 1) / (stroopTasks.length + oddTasks.length) * 100));
        } else {
            // Move to the next test phase
            setTestPhase('odd-one-out');
            setCurrentTaskIndex(0);
            setProgress(50);
        }
    };

    const handleOddOneOut = (selectedIndex) => {
        const currentTask = oddTasks[currentTaskIndex];

        if (selectedIndex === currentTask.correctIndex) {
            setCorrectAnswers(prev => prev + 1);
        } else {
            setWrongAnswers(prev => prev + 1);
        }

        if (currentTaskIndex < oddTasks.length - 1) {
            setCurrentTaskIndex(prev => prev + 1);
            const newProgress = 50 + Math.floor((currentTaskIndex + 1) / oddTasks.length * 50);
            setProgress(newProgress);
        } else {
            // Complete the test
            completeTest();
        }
    };

    const completeTest = () => {
        const endTimeMs = Date.now();
        setEndTime(endTimeMs);

        // Calculate results
        const totalQuestions = stroopTasks.length + oddTasks.length;
        const totalAnswered = correctAnswers + wrongAnswers + (testPhase === 'odd-one-out' ? 1 : 0);
        const accuracy = Math.round((correctAnswers / totalAnswered) * 100) || 0;
        const reactionTime = Math.round((endTimeMs - startTime) / totalAnswered / 10) / 100 || 0;

        // Score is based on both accuracy and reaction time
        // Faster reaction time is better, but accuracy is most important
        const timeScore = Math.max(0, 100 - (reactionTime * 5)); // penalize slow reactions
        const score = Math.round((accuracy * 0.7) + (timeScore * 0.3));

        setResults({
            score,
            accuracy,
            reactionTime
        });

        setTestPhase('results');
        setProgress(100);

        // Report results if callback provided
        if (onComplete) {
            onComplete({
                domain: 'attention',
                score,
                details: {
                    accuracy,
                    reactionTime,
                    correctAnswers,
                    totalQuestions: totalAnswered
                }
            });
        }
    };

    const renderInstructionPhase = () => (
        <div className="test-instruction-phase">
            <h2>{t('attention_test_title', 'Attention Test')}</h2>
            <div className="test-info">
                <p>{t('attention_test_instruction1', 'This test will evaluate your attention and concentration through two different tasks:')}</p>

                <h3>{t('stroop_test_title', 'Color-Word Stroop Test')}</h3>
                <p>{t('stroop_test_instruction', 'You will be shown color words written in different colors. Your task is to identify the COLOR the word is displayed in, NOT the word itself.')}</p>
                <div className="stroop-example" style={{ margin: '15px 0', padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #eee' }}>
                    <span style={{ color: 'red', fontWeight: 'bold', fontSize: '24px', display: 'block', marginBottom: '10px' }}>BLUE</span>
                    <p style={{ margin: 0 }}>{t('stroop_example', 'In this example, the correct answer would be "Red".')}</p>
                </div>

                <h3>{t('odd_one_out_title', 'Odd-One-Out Test')}</h3>
                <p>{t('odd_one_out_instruction', 'You will be shown a set of items. Your task is to identify which item does not belong with the others.')}</p>

                <div className="test-time-info" style={{ marginTop: '20px', fontWeight: '500', color: '#3a7bd5' }}>
                    <p>{t('attention_test_time', 'You will have 60 seconds to complete as many tasks as possible.')}</p>
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

    const renderStroopPhase = () => {
        const currentTask = stroopTasks[currentTaskIndex];

        if (!currentTask) return <div>Loading...</div>;

        return (
            <div className="stroop-phase">
                <div className="test-header">
                    <div className="progress-indicator">
                        <div className="progress-bar">
                            <div className="progress" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="progress-text">{progress}%</div>
                    </div>
                    <div className="timer-display">
                        {t('time_remaining', 'Time remaining')}: <span className="time-value">{timeRemaining}s</span>
                    </div>
                </div>

                <div className="task-card stroop-container">
                    <h3>{t('stroop_instruction', 'What COLOR is this word displayed in?')}</h3>
                    <div className="stroop-word" style={{ color: currentTask.displayColor }}>
                        {currentTask.word}
                    </div>

                    <div className="stroop-options">
                        {currentTask.options.map((option, index) => (
                            <button
                                key={index}
                                className="stroop-option"
                                onClick={() => handleStroopAnswer(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="button-group">
                    <button onClick={onCancel} className="cancel-btn">
                        {t('cancel', 'Cancel')}
                    </button>
                </div>
            </div>
        );
    };

    const renderOddOneOutPhase = () => {
        const currentTask = oddTasks[currentTaskIndex];

        if (!currentTask) return <div>Loading...</div>;

        return (
            <div className="odd-one-out-phase">
                <div className="test-header">
                    <div className="progress-indicator">
                        <div className="progress-bar">
                            <div className="progress" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="progress-text">{progress}%</div>
                    </div>
                    <div className="timer-display">
                        {t('time_remaining', 'Time remaining')}: <span className="time-value">{timeRemaining}s</span>
                    </div>
                </div>

                <div className="task-card">
                    <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>{t('odd_one_out_instruction', 'Select the item that does not belong with the others:')}</h3>

                    <div className="odd-one-out">
                        {currentTask.items.map((item, index) => (
                            <button
                                key={index}
                                className="odd-item"
                                onClick={() => handleOddOneOut(index)}
                            >
                                <span style={{ fontSize: '48px' }}>{item}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="button-group">
                    <button onClick={onCancel} className="cancel-btn">
                        {t('cancel', 'Cancel')}
                    </button>
                </div>
            </div>
        );
    };

    const renderResultsPhase = () => (
        <div className="test-results">
            <div className="results-header">
                <h2>{t('attention_test_completed', 'Attention Test Completed!')}</h2>
            </div>

            <div className="results-content">
                <div className="overall-score">
                    <div className="score-circle">
                        {results.score}
                    </div>
                    <div className="score-label">{t('score', 'Score')}</div>
                </div>

                <div className="risk-assessment">
                    <div className="results-details" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', textAlign: 'left' }}>
                        <div className="result-item">
                            <span className="result-label">{t('accuracy', 'Accuracy')}:</span>
                            <span className="result-value" style={{ fontWeight: 'bold', float: 'right' }}>{results.accuracy}%</span>
                        </div>
                        <div className="result-item">
                            <span className="result-label">{t('avg_reaction_time', 'Avg. Reaction Time')}:</span>
                            <span className="result-value" style={{ fontWeight: 'bold', float: 'right' }}>{results.reactionTime} sec</span>
                        </div>
                        <div className="result-item">
                            <span className="result-label">{t('correct_answers', 'Correct Answers')}:</span>
                            <span className="result-value" style={{ fontWeight: 'bold', float: 'right', color: 'green' }}>{correctAnswers}</span>
                        </div>
                        <div className="result-item">
                            <span className="result-label">{t('wrong_answers', 'Wrong Answers')}:</span>
                            <span className="result-value" style={{ fontWeight: 'bold', float: 'right', color: 'red' }}>{wrongAnswers}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="risk-assessment" style={{ marginTop: '20px' }}>
                {results.score >= 80 ? (
                    <p className="risk-level risk-low">
                        {t('attention_high_score', 'Excellent! Your attention skills are exceptional.')}
                    </p>
                ) : results.score >= 60 ? (
                    <p className="risk-level risk-moderate">
                        {t('attention_medium_score', 'Good job! Your attention skills are above average.')}
                    </p>
                ) : (
                    <p className="risk-level risk-high">
                        {t('attention_low_score', 'Your attention skills could use some improvement. Regular practice can help!')}
                    </p>
                )}
            </div>

            <div className="button-group" style={{ justifyContent: 'center', marginTop: '30px' }}>
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
        case 'stroop':
            return renderStroopPhase();
        case 'odd-one-out':
            return renderOddOneOutPhase();
        case 'results':
            return renderResultsPhase();
        default:
            return renderInstructionPhase();
    }
};

export default AttentionTest;