import React, { useState } from 'react';

const CognitiveTest = () => {
    const [score, setScore] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const questions = [
        { question: "What is 2 + 2?", answer: "4" },
        { question: "What is the capital of France?", answer: "Paris" },
        { question: "What is 5 * 6?", answer: "30" },
    ];

    const handleAnswer = () => {
        setIsSubmitting(true);
        
        // Convert answer to string for comparison and trim whitespace
        const currentAnswer = questions[questionIndex].answer.toString().toLowerCase().trim();
        const userAnswer = userInput.toString().toLowerCase().trim();
        
        if (userAnswer === currentAnswer) {
            setScore(score + 1);
        }
        
        setQuestionIndex(questionIndex + 1);
        setUserInput('');
        setIsSubmitting(false);
    };

    if (questionIndex >= questions.length) {
        return (
            <div className="cognitive-test-results">
                <h2>Test Complete</h2>
                <p>Your Score: {score}/{questions.length}</p>
                <p className="score-percentage">Percentage: {Math.round((score/questions.length) * 100)}%</p>
            </div>
        );
    }

    return (
        <div className="cognitive-test">
            <h2>{questions[questionIndex].question}</h2>
            <div className="input-container">
                <input 
                    type="text" 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    disabled={isSubmitting}
                />
                <button 
                    onClick={handleAnswer}
                    disabled={isSubmitting || userInput.trim() === ''}
                >
                    Submit
                </button>
            </div>
        </div>
    );
}

export default CognitiveTest;