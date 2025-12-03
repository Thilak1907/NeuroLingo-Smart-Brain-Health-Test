export const trackUserInteraction = (interactionType, details) => {
    console.log(`User Interaction: ${interactionType}`, details);
};

export const trackTestResult = (testName, score) => {
    console.log(`Test Result - ${testName}: ${score}`);
};

export const logError = (error) => {
    console.error('Analytics Error:', error);
};