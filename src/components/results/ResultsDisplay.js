import React from 'react';

const ResultsDisplay = ({ results }) => {
    return (
        <div className="results-display">
            <h2>Your Test Results</h2>
            {results.length === 0 ? (
                <p>No results available. Please complete the tests.</p>
            ) : (
                <ul>
                    {results.map((result, index) => (
                        <li key={index}>
                            <strong>{result.testName}:</strong> {result.score}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ResultsDisplay;