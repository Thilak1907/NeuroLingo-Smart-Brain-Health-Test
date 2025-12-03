import React, { useState, useEffect } from 'react';

const ReactionTest = () => {
    const [reactionTime, setReactionTime] = useState(null);
    const [isTesting, setIsTesting] = useState(false);
    const [startTime, setStartTime] = useState(null);

    const startTest = () => {
        setIsTesting(true);
        setReactionTime(null);
        setStartTime(null);
        setTimeout(() => {
            setStartTime(Date.now());
            alert('Click now!');
        }, Math.random() * 2000 + 1000); // Random delay between 1 and 3 seconds
    };

    const handleClick = () => {
        if (isTesting && startTime) {
            const timeTaken = Date.now() - startTime;
            setReactionTime(timeTaken);
            setIsTesting(false);
        }
    };

    useEffect(() => {
        if (reactionTime !== null) {
            alert(`Your reaction time is ${reactionTime} ms`);
        }
    }, [reactionTime]);

    return (
        <div>
            <h2>Reaction Test</h2>
            <button onClick={startTest} disabled={isTesting}>
                Start Test
            </button>
            <button onClick={handleClick} disabled={!isTesting}>
                Click Me!
            </button>
            {reactionTime !== null && <p>Your reaction time: {reactionTime} ms</p>}
        </div>
    );
};

export default ReactionTest;