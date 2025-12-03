import React, { useState, useEffect, useContext, useRef } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { mentalRotationShapes, patternCompletionTasks } from '../data/visuospatialTestData';
import '../assets/styles/cognitive-tests.css';

const VisuospatialTest = ({ onComplete, onCancel }) => {
    const { t } = useContext(LanguageContext);
    const [testPhase, setTestPhase] = useState('instruction'); // instruction, clock, mental-rotation, pattern, results
    const [progress, setProgress] = useState(0);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [rotationTasks, setRotationTasks] = useState([]);
    const [patternTasks, setPatternTasks] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [clockDrawing, setClockDrawing] = useState({
        hasCircle: false,
        hasNumbers: false,
        hasHands: false,
        score: 0
    });
    const [results, setResults] = useState({
        score: 0,
        clockScore: 0,
        rotationScore: 0,
        patternScore: 0
    });

    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [timeInput, setTimeInput] = useState({ hours: 10, minutes: 10 });
    const [drawingInstructions, setDrawingInstructions] = useState(null);

    // Generate clock drawing instructions
    useEffect(() => {
        if (testPhase === 'clock') {
            // Generate random time for clock
            const hours = Math.floor(Math.random() * 12) + 1;
            const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
            setTimeInput({ hours, minutes });

            // Set instructions
            const timeDisplay = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
            setDrawingInstructions(
                t('clock_drawing_instruction', `Draw a clock face showing the time ${timeDisplay}`)
                    .replace('${time}', timeDisplay)
            );

            // Setup canvas
            setupCanvas();
        }
    }, [testPhase, t]);

    // Generate mental rotation tasks
    useEffect(() => {
        if (testPhase === 'mental-rotation' && rotationTasks.length === 0) {
            const shapes = mentalRotationShapes;
            const rotations = [0, 90, 180, 270]; // rotation angles

            const tasks = [];
            for (let i = 0; i < 5; i++) {
                const shape = shapes[Math.floor(Math.random() * shapes.length)];
                const referenceRotation = rotations[Math.floor(Math.random() * rotations.length)];

                // Generate 4 options (1 correct, 3 incorrect)
                const correctOptionIndex = Math.floor(Math.random() * 4);
                const options = [];

                for (let j = 0; j < 4; j++) {
                    if (j === correctOptionIndex) {
                        options.push({
                            shape,
                            rotation: referenceRotation,
                            isCorrect: true
                        });
                    } else {
                        // For incorrect options, use different rotation or different shape
                        let differentShape = Math.random() > 0.5;
                        let optionShape = differentShape ?
                            shapes[Math.floor(Math.random() * shapes.length)] :
                            shape;

                        // Ensure it's different either by shape or rotation
                        while (optionShape === shape && !differentShape) {
                            differentShape = Math.random() > 0.5;
                            optionShape = differentShape ?
                                shapes[Math.floor(Math.random() * shapes.length)] :
                                shape;
                        }

                        options.push({
                            shape: optionShape,
                            rotation: differentShape ?
                                referenceRotation :
                                rotations.filter(r => r !== referenceRotation)[Math.floor(Math.random() * 3)],
                            isCorrect: false
                        });
                    }
                }

                tasks.push({
                    referenceShape: shape,
                    referenceRotation,
                    options
                });
            }

            setRotationTasks(tasks);
            setStartTime(Date.now());
        }
    }, [testPhase]);

    // Generate pattern completion tasks
    useEffect(() => {
        if (testPhase === 'pattern' && patternTasks.length === 0) {
            setPatternTasks(patternCompletionTasks);
        }
    }, [testPhase]);

    // Canvas setup and drawing functions
    const setupCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;

        // Add event listeners
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        // Mobile support
        canvas.addEventListener('touchstart', handleTouch);
        canvas.addEventListener('touchmove', handleTouch);
        canvas.addEventListener('touchend', stopDrawing);
    };

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(
            e.clientX - canvas.getBoundingClientRect().left,
            e.clientY - canvas.getBoundingClientRect().top
        );
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineTo(
            e.clientX - canvas.getBoundingClientRect().left,
            e.clientY - canvas.getBoundingClientRect().top
        );
        ctx.stroke();
    };

    const handleTouch = (e) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        const touch = e.touches[0];

        const mouseEvent = new MouseEvent(
            e.type === 'touchstart' ? 'mousedown' : 'mousemove',
            {
                clientX: touch.clientX,
                clientY: touch.clientY
            }
        );

        canvas.dispatchEvent(mouseEvent);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearDrawing = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const scoreClockDrawing = () => {
        // This would ideally use image analysis algorithms
        // For demo purposes, we'll simulate a basic assessment
        const score = Math.floor(Math.random() * 40) + 60; // Random score between 60-100

        setClockDrawing({
            hasCircle: true,
            hasNumbers: score > 70,
            hasHands: score > 80,
            score
        });

        // Move to next test phase
        setTestPhase('mental-rotation');
        setProgress(33);
        setCurrentTaskIndex(0);
    };

    const handleStartTest = () => {
        setTestPhase('clock');
        setProgress(0);
        setCurrentTaskIndex(0);
        setCorrectAnswers(0);
        setWrongAnswers(0);
    };

    const handleRotationAnswer = (isCorrect) => {
        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
        } else {
            setWrongAnswers(prev => prev + 1);
        }

        if (currentTaskIndex < rotationTasks.length - 1) {
            setCurrentTaskIndex(prev => prev + 1);
            setProgress(33 + Math.floor((currentTaskIndex + 1) / rotationTasks.length * 33));
        } else {
            // Move to pattern phase
            setTestPhase('pattern');
            setCurrentTaskIndex(0);
            setProgress(66);
        }
    };

    const handlePatternAnswer = (selectedOption) => {
        const currentTask = patternTasks[currentTaskIndex];

        if (selectedOption === currentTask.correctAnswer) {
            setCorrectAnswers(prev => prev + 1);
        } else {
            setWrongAnswers(prev => prev + 1);
        }

        if (currentTaskIndex < patternTasks.length - 1) {
            setCurrentTaskIndex(prev => prev + 1);
            const newProgress = 66 + Math.floor((currentTaskIndex + 1) / patternTasks.length * 34);
            setProgress(newProgress);
        } else {
            // Complete test
            completeTest();
        }
    };

    const completeTest = () => {
        // Calculate results
        const clockScore = clockDrawing.score;

        // Calculate rotation score
        const rotationTotal = rotationTasks.length;
        const rotationCorrect = Math.min(correctAnswers, rotationTotal);
        const rotationScore = Math.round((rotationCorrect / rotationTotal) * 100);

        // Calculate pattern score
        const patternTotal = patternTasks.length;
        const patternCorrect = Math.max(0, correctAnswers - rotationTotal);
        const patternScore = Math.round((patternCorrect / patternTotal) * 100);

        // Combined score (weighted)
        const score = Math.round(
            (clockScore * 0.4) + (rotationScore * 0.3) + (patternScore * 0.3)
        );

        setResults({
            score,
            clockScore,
            rotationScore,
            patternScore
        });

        setTestPhase('results');
        setProgress(100);

        // Report results if callback provided
        if (onComplete) {
            onComplete({
                domain: 'visuospatial',
                score,
                details: {
                    clockScore,
                    rotationScore,
                    patternScore,
                    correctAnswers,
                    totalQuestions: rotationTasks.length + patternTasks.length
                }
            });
        }
    };

    const renderInstructionPhase = () => (
        <div className="test-instruction-phase">
            <h2>{t('visuospatial_test_title', 'Visuospatial & Executive Function Test')}</h2>
            <div className="test-instructions">
                <p>{t('visuospatial_test_instruction1', 'This test will evaluate your visuospatial abilities through three different tasks:')}</p>

                <h3>{t('clock_drawing_title', 'Clock Drawing')}</h3>
                <p>{t('clock_drawing_instruction_general', 'You will be asked to draw a clock showing a specific time.')}</p>

                <h3>{t('mental_rotation_title', 'Mental Rotation')}</h3>
                <p>{t('mental_rotation_instruction', 'You will be shown a shape and asked to identify which of four options is the same shape, possibly rotated.')}</p>

                <h3>{t('pattern_completion_title', 'Pattern Completion')}</h3>
                <p>{t('pattern_completion_instruction', 'You will be shown a sequence and asked to determine the next item in the sequence.')}</p>
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

    const renderClockPhase = () => (
        <div className="clock-drawing-phase">
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

            <div className="clock-drawing-container">
                <h3>{drawingInstructions}</h3>

                <div className="canvas-container">
                    <canvas
                        ref={canvasRef}
                        width={300}
                        height={300}
                        className="drawing-canvas"
                    ></canvas>
                </div>

                <div className="clock-drawing-controls">
                    <button onClick={clearDrawing} className="secondary-button">
                        {t('clear_drawing', 'Clear Drawing')}
                    </button>
                    <button onClick={scoreClockDrawing} className="primary-button">
                        {t('done_drawing', 'Done')}
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

    const renderMentalRotationPhase = () => {
        const currentTask = rotationTasks[currentTaskIndex];

        return (
            <div className="mental-rotation-phase">
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

                <div className="mental-rotation-container">
                    <h3>{t('mental_rotation_question', 'Which option is the SAME as this shape (may be rotated)?')}</h3>

                    <div className="reference-shape">
                        <span
                            className="shape-display"
                            style={{
                                transform: `rotate(${currentTask.referenceRotation}deg)`,
                                fontSize: '4rem',
                                display: 'inline-block'
                            }}
                        >
                            {currentTask.referenceShape}
                        </span>
                    </div>

                    <div className="rotation-options">
                        {currentTask.options.map((option, index) => (
                            <button
                                key={index}
                                className="rotation-option"
                                onClick={() => handleRotationAnswer(option.isCorrect)}
                            >
                                <span
                                    style={{
                                        transform: `rotate(${option.rotation}deg)`,
                                        fontSize: '3rem',
                                        display: 'inline-block'
                                    }}
                                >
                                    {option.shape}
                                </span>
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

    const renderPatternPhase = () => {
        const currentTask = patternTasks[currentTaskIndex];

        return (
            <div className="pattern-phase">
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

                <div className="pattern-container">
                    <h3>{t('pattern_completion_question', 'What comes next in this sequence?')}</h3>

                    <div className="sequence-display">
                        {currentTask.sequence.map((item, index) => (
                            <span key={index} className="sequence-item">
                                {item}
                            </span>
                        ))}
                    </div>

                    <div className="pattern-options">
                        {currentTask.options.map((option, index) => (
                            <button
                                key={index}
                                className="pattern-option"
                                onClick={() => handlePatternAnswer(option)}
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

    const renderResultsPhase = () => (
        <div className="test-results-phase">
            <h2>{t('visuospatial_test_completed', 'Visuospatial Test Completed!')}</h2>

            <div className="results-container">
                <div className="result-score">
                    <div className="score-circle">
                        <span className="score-value">{results.score}</span>
                    </div>
                    <div className="score-label">{t('score', 'Score')}</div>
                </div>

                <div className="results-details">
                    <div className="result-item">
                        <span className="result-label">{t('clock_drawing', 'Clock Drawing')}:</span>
                        <span className="result-value">{results.clockScore}/100</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">{t('mental_rotation', 'Mental Rotation')}:</span>
                        <span className="result-value">{results.rotationScore}%</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">{t('pattern_completion', 'Pattern Completion')}:</span>
                        <span className="result-value">{results.patternScore}%</span>
                    </div>
                </div>
            </div>

            <div className="results-interpretation">
                {results.score >= 80 ? (
                    <p className="interpretation high">
                        {t('visuospatial_high_score', 'Excellent! Your visuospatial abilities are very strong.')}
                    </p>
                ) : results.score >= 60 ? (
                    <p className="interpretation medium">
                        {t('visuospatial_medium_score', 'Good job! You have solid visuospatial skills.')}
                    </p>
                ) : (
                    <p className="interpretation low">
                        {t('visuospatial_low_score', 'Your visuospatial abilities could benefit from more practice with puzzles and spatial tasks.')}
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
        case 'clock':
            return renderClockPhase();
        case 'mental-rotation':
            return renderMentalRotationPhase();
        case 'pattern':
            return renderPatternPhase();
        case 'results':
            return renderResultsPhase();
        default:
            return renderInstructionPhase();
    }
};

export default VisuospatialTest;