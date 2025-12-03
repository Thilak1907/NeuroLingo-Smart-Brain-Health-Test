export const calculateMemoryScore = (correctAnswers, totalQuestions) => {
    return (correctAnswers / totalQuestions) * 100;
};

export const calculateCognitiveScore = (reactionTime, maxTime) => {
    return Math.max(0, (1 - (reactionTime / maxTime)) * 100);
};

export const calculateReactionScore = (correctResponses, totalResponses) => {
    return (correctResponses / totalResponses) * 100;
};