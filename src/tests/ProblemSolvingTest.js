import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { reasoningTasks, planningTasks } from '../data/problemSolvingTestData';
import '../assets/styles/cognitive-tests.css';

const ProblemSolvingTest = ({ onComplete, onCancel }) => {
    const { t, language } = useContext(LanguageContext);
    const [testPhase, setTestPhase] = useState('instruction'); // instruction, reasoning, planning, results
    const [progress, setProgress] = useState(0);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [currentReasoningTasks, setCurrentReasoningTasks] = useState([]);
    const [currentPlanningTasks, setCurrentPlanningTasks] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [userPlan, setUserPlan] = useState([]);
    const [selectedStep, setSelectedStep] = useState(null);
    const [results, setResults] = useState({
        score: 0,
        reasoningScore: 0,
        planningScore: 0,
        accuracy: 0,
        timeTaken: 0
    });

    // Timer effect
    useEffect(() => {
        let timer;
        if ((testPhase === 'reasoning' || testPhase === 'planning') && timeRemaining > 0) {
            timer = setTimeout(() => {
                setTimeRemaining(timeRemaining - 1);
            }, 1000);
        } else if (timeRemaining === 0 && (testPhase === 'reasoning' || testPhase === 'planning')) {
            // Time's up for current phase
            if (testPhase === 'reasoning') {
                // Move to planning phase
                setTestPhase('planning');
                setCurrentTaskIndex(0);
                setProgress(50);
                setTimeRemaining(120); // 2 minutes for planning phase
            } else {
                // Complete test
                completeTest();
            }
        }
        return () => clearTimeout(timer);
    }, [timeRemaining, testPhase]);

    // Load tasks based on language
    useEffect(() => {
        const lang = reasoningTasks[language] ? language : 'en';
        setCurrentReasoningTasks(reasoningTasks[lang]);
        setCurrentPlanningTasks(planningTasks[lang]);
    }, [language]);

    // Initialize reasoning phase
    useEffect(() => {
        if (testPhase === 'reasoning' && currentReasoningTasks.length > 0 && startTime === null) {
            setStartTime(Date.now());
            setTimeRemaining(120); // 2 minutes for reasoning phase
        }
    }, [testPhase, currentReasoningTasks, startTime]);

    // Initialize planning phase
    useEffect(() => {
        if (testPhase === 'planning' && currentPlanningTasks.length > 0) {
            setTimeRemaining(120); // 2 minutes for planning phase
        }
    }, [testPhase, currentPlanningTasks]);

    // Initialize user plan for current planning task
    useEffect(() => {
        if (testPhase === 'planning' && currentPlanningTasks.length > 0) {
            const steps = currentPlanningTasks[currentTaskIndex].steps;
            setUserPlan(new Array(steps.length).fill(null));
        }
    }, [testPhase, currentTaskIndex, currentPlanningTasks]);

    const handleStartTest = () => {
        setTestPhase('reasoning');
        setProgress(0);
        setCurrentTaskIndex(0);
        setCorrectAnswers(0);
        setWrongAnswers(0);
        setStartTime(null); // Reset start time to trigger initialization
    };

    const handleReasoningAnswer = (selectedOption) => {
        const currentTask = currentReasoningTasks[currentTaskIndex];

        if (selectedOption === currentTask.correctAnswer) {
            setCorrectAnswers(prev => prev + 1);
        } else {
            setWrongAnswers(prev => prev + 1);
        }

        if (currentTaskIndex < currentReasoningTasks.length - 1) {
            setCurrentTaskIndex(prev => prev + 1);
            setProgress(Math.floor((currentTaskIndex + 1) / currentReasoningTasks.length * 50));
        } else {
            // Move to planning phase
            setTestPhase('planning');
            setCurrentTaskIndex(0);
            setProgress(50);
        }
    };

    const handleStepSelect = (stepIndex) => {
        setSelectedStep(stepIndex);
    };

    const handlePlanningPosition = (position) => {
        if (selectedStep === null) return;

        const newPlan = [...userPlan];

        // If the position already has a step, remove it
        const existingStepPosition = newPlan.findIndex(pos => pos === selectedStep);
        if (existingStepPosition !== -1) {
            newPlan[existingStepPosition] = null;
        }

        newPlan[position] = selectedStep;
        setUserPlan(newPlan);
        setSelectedStep(null);
    };

    const isPlanComplete = () => {
        return userPlan.every(step => step !== null);
    };

    const submitPlan = () => {
        const currentTask = currentPlanningTasks[currentTaskIndex];
        let score = 0;

        // Calculate how many steps are in the correct position
        for (let i = 0; i < userPlan.length; i++) {
            if (userPlan[i] === currentTask.correctOrder[i]) {
                score++;
            }
        }

        const accuracy = score / userPlan.length;

        if (accuracy >= 0.7) {
            setCorrectAnswers(prev => prev + 1);
        } else {
            setWrongAnswers(prev => prev + 1);
        }

        if (currentTaskIndex < currentPlanningTasks.length - 1) {
            setCurrentTaskIndex(prev => prev + 1);
            setSelectedStep(null);
            // Next task initialization will be handled by useEffect
            const newProgress = 50 + Math.floor((currentTaskIndex + 1) / currentPlanningTasks.length * 50);
            setProgress(newProgress);
        } else {
            // Complete test
            completeTest();
        }
    };

    const completeTest = () => {
        const timeTaken = Math.round((Date.now() - startTime) / 1000);

        // Calculate reasoning score
        const reasoningTotal = currentReasoningTasks.length;
        const reasoningCorrect = Math.min(correctAnswers, reasoningTotal);
        const reasoningScore = Math.round((reasoningCorrect / reasoningTotal) * 100);

        // Calculate planning score (assumed one planning task is one correct answer)
        const planningTotal = currentPlanningTasks.length;
        const planningCorrect = Math.max(0, correctAnswers - reasoningTotal);
        const planningScore = Math.round((planningCorrect / planningTotal) * 100);

        // Overall accuracy
        const totalQuestions = reasoningTotal + planningTotal;
        const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

        // Combined score (weighted)
        const score = Math.round((reasoningScore * 0.6) + (planningScore * 0.4));

        setResults({
            score,
            reasoningScore,
            planningScore,
            accuracy,
            timeTaken
        });

        setTestPhase('results');
        setProgress(100);

        // Report results if callback provided
        if (onComplete) {
            onComplete({
                domain: 'problem-solving',
                score,
                details: {
                    reasoningScore,
                    planningScore,
                    accuracy,
                    timeTaken,
                    correctAnswers,
                    totalQuestions
                }
            });
        }
    };

    const renderInstructionPhase = () => (
        <div className="test-instruction-phase">
            <h2>{t('problem_solving_test_title', 'Problem-Solving & Reasoning Test')}</h2>
            <div className="test-instructions">
                <p>{t('problem_solving_test_instruction1', 'This test will evaluate your problem-solving abilities through two different tasks:')}</p>

                <h3>{t('logical_reasoning_title', 'Logical Reasoning')}</h3>
                <p>{t('logical_reasoning_instruction', 'You will be presented with logical problems and must select the correct answer from multiple options.')}</p>

                <h3>{t('planning_title', 'Planning & Sequencing')}</h3>
                <p>{t('planning_instruction', 'You will organize steps in the correct sequence to accomplish a goal.')}</p>

                <div className="test-time-info">
                    <p>{t('problem_solving_test_time', 'You will have 2 minutes for each section of this test.')}</p>
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

    const renderReasoningPhase = () => {
        if (currentReasoningTasks.length === 0) return <div>Loading...</div>;
        const currentTask = currentReasoningTasks[currentTaskIndex];

        return (
            <div className="reasoning-phase">
                <div className="test-progress-header">
                    <div className="test-progress">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="progress-text">
                            {progress}%
                        </div>
                    </div>
                    <div className="test-timer">
                        {t('time_remaining', 'Time remaining')}: {timeRemaining}s
                    </div>
                </div>

                <div className="reasoning-container">
                    <div className="reasoning-question">
                        <h3>{currentTask.question}</h3>
                    </div>

                    <div className="reasoning-options">
                        {currentTask.options.map((option, index) => (
                            <button
                                key={index}
                                className="reasoning-option"
                                onClick={() => handleReasoningAnswer(option)}
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

    const renderPlanningPhase = () => {
        if (currentPlanningTasks.length === 0) return <div>Loading...</div>;

        const currentTask = currentPlanningTasks[currentTaskIndex];

        return (
            <div className="planning-phase">
                <div className="test-progress-header">
                    <div className="test-progress">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="progress-text">
                            {progress}%
                        </div>
                    </div>
                    <div className="test-timer">
                        {t('time_remaining', 'Time remaining')}: {timeRemaining}s
                    </div>
                </div>

                <div className="planning-container">
                    <h3>{currentTask.scenario}</h3>

                    <div className="planning-workspace">
                        <div className="steps-container">
                            <h4>{t('available_steps', 'Available Steps')}</h4>
                            <div className="available-steps">
                                {currentTask.steps.map((step, index) => (
                                    <button
                                        key={index}
                                        className={`step-button ${selectedStep === index ? 'selected' : ''} ${userPlan.includes(index) ? 'used' : ''}`}
                                        onClick={() => handleStepSelect(index)}
                                        disabled={userPlan.includes(index)}
                                    >
                                        {step}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="sequence-container">
                            <h4>{t('your_plan', 'Your Plan')}</h4>
                            <div className="sequence-slots">
                                {userPlan.map((stepIndex, position) => (
                                    <div
                                        key={position}
                                        className={`sequence-slot ${selectedStep !== null ? 'can-drop' : ''}`}
                                        onClick={() => handlePlanningPosition(position)}
                                    >
                                        <div className="position-number">{position + 1}</div>
                                        {stepIndex !== null ? (
                                            <div className="placed-step">
                                                {currentTask.steps[stepIndex]}
                                            </div>
                                        ) : (
                                            <div className="empty-slot">
                                                {t('drag_step_here', 'Click a step above, then click here')}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="planning-controls">
                        <button
                            className="primary-button"
                            onClick={submitPlan}
                            disabled={!isPlanComplete()}
                        >
                            {t('submit_plan', 'Submit Plan')}
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
            <h2>{t('problem_solving_test_completed', 'Problem-Solving Test Completed!')}</h2>

            <div className="results-container">
                <div className="result-score">
                    <div className="score-circle">
                        <span className="score-value">{results.score}</span>
                    </div>
                    <div className="score-label">{t('score', 'Score')}</div>
                </div>

                <div className="results-details">
                    <div className="result-item">
                        <span className="result-label">{t('reasoning_score', 'Reasoning')}:</span>
                        <span className="result-value">{results.reasoningScore}%</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">{t('planning_score', 'Planning')}:</span>
                        <span className="result-value">{results.planningScore}%</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">{t('overall_accuracy', 'Overall Accuracy')}:</span>
                        <span className="result-value">{results.accuracy}%</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">{t('time_taken', 'Time Taken')}:</span>
                        <span className="result-value">{results.timeTaken} sec</span>
                    </div>
                </div>
            </div>

            <div className="results-interpretation">
                {results.score >= 80 ? (
                    <p className="interpretation high">
                        {t('problem_solving_high_score', 'Excellent! Your problem-solving abilities are very strong.')}
                    </p>
                ) : results.score >= 60 ? (
                    <p className="interpretation medium">
                        {t('problem_solving_medium_score', 'Good job! You have solid reasoning and planning skills.')}
                    </p>
                ) : (
                    <p className="interpretation low">
                        {t('problem_solving_low_score', 'Your problem-solving skills could benefit from practice with logic puzzles and planning exercises.')}
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
        case 'reasoning':
            return renderReasoningPhase();
        case 'planning':
            return renderPlanningPhase();
        case 'results':
            return renderResultsPhase();
        default:
            return renderInstructionPhase();
    }
};

export default ProblemSolvingTest;