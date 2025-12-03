import React, { useState, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import MemoryTest from '../tests/MemoryTest';
import AttentionTest from '../tests/AttentionTest';
import LanguageTest from '../tests/LanguageTest';
import VisuospatialTest from '../tests/VisuospatialTest';
import ProblemSolvingTest from '../tests/ProblemSolvingTest';
import '../assets/styles/cognitive-tests.css';

function TestContainer({ onTestComplete, onCancel }) {
  const { t } = useContext(LanguageContext);
  const [currentStep, setCurrentStep] = useState('intro'); // 'intro', 'memory', 'attention', 'visuospatial', 'language', 'problem-solving', 'results' results
  const [consent, setConsent] = useState(false);

  // Track individual test results
  const [testResults, setTestResults] = useState({
    memory: null,
    attention: null,
    language: null,
    visuospatial: null,
    problemSolving: null
  });

  // Calculate overall progress
  const calculateProgress = () => {
    const steps = ['intro', 'memory', 'attention', 'language', 'visuospatial', 'problemSolving', 'results'];
    const currentIndex = steps.indexOf(currentStep);
    return Math.floor((currentIndex / (steps.length - 1)) * 100);
  };

  // Handle individual test completion
  const handleTestComplete = (domain, result) => {
    // Store the result for this domain
    setTestResults(prev => ({
      ...prev,
      [domain]: result
    }));

    // Determine next test to take
    switch (domain) {
      case 'memory':
        setCurrentStep('attention');
        break;
      case 'attention':
        setCurrentStep('language');
        break;
      case 'language':
        setCurrentStep('visuospatial');
        break;
      case 'visuospatial':
        setCurrentStep('problemSolving');
        break;
      case 'problemSolving':
        setCurrentStep('results');
        calculateBrainHealthIndex();
        break;
      default:
        break;
    }
  };

  // Calculate Brain Health Index from all test results
  const calculateBrainHealthIndex = () => {
    const { memory, attention, language, visuospatial, problemSolving } = testResults;

    // Domain weights (should sum to 1.0)
    const weights = {
      memory: 0.25,
      attention: 0.20,
      language: 0.20,
      visuospatial: 0.15,
      problemSolving: 0.20
    };

    // Calculate weighted average if we have all test results
    if (memory && attention && language && visuospatial && problemSolving) {
      const weightedScore = (
        (memory.score * weights.memory) +
        (attention.score * weights.attention) +
        (language.score * weights.language) +
        (visuospatial.score * weights.visuospatial) +
        (problemSolving.score * weights.problemSolving)
      );

      // Determine risk level based on score
      let riskLevel = 'Low';
      if (weightedScore < 60) {
        riskLevel = 'High';
      } else if (weightedScore < 75) {
        riskLevel = 'Moderate';
      }

      const result = {
        id: `test${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        overallScore: Math.round(weightedScore),
        domains: {
          memory: memory.score,
          attention: attention.score,
          language: language.score,
          visuospatial: visuospatial.score,
          problemSolving: problemSolving.score
        },
        details: {
          memory: memory.details,
          attention: attention.details,
          language: language.details,
          visuospatial: visuospatial.details,
          problemSolving: problemSolving.details
        },
        riskLevel: riskLevel
      };

      // Pass results to parent component
      onTestComplete(result);
    }
  };

  return (
    <div className="test-container">
      {/* Progress bar for the overall test */}
      {currentStep !== 'intro' && currentStep !== 'results' && (
        <div className="overall-test-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${calculateProgress()}%` }}></div>
          </div>
          <div className="progress-label">{calculateProgress()}% {t('complete', 'Complete')}</div>
        </div>
      )}

      {/* Introduction and consent screen */}
      {currentStep === 'intro' && (
        <div className="test-intro">
          <h2>{t('brain_health_assessment', 'Brain Health Assessment')}</h2>
          <div className="test-info">
            <p>{t('assessment_description', 'This test will assess multiple cognitive domains through a series of simple tasks:')}</p>
            <ul>
              <li>{t('memory_tasks', 'Memory tasks to assess your recall abilities')}</li>
              <li>{t('attention_tasks', 'Attention tasks to evaluate focus and concentration')}</li>
              <li>{t('language_tasks', 'Language tasks to check verbal fluency and comprehension')}</li>
              <li>{t('visuospatial_tasks', 'Visuospatial tasks to test perception and spatial reasoning')}</li>
              <li>{t('problem_solving_tasks', 'Problem-solving tasks to assess reasoning and planning')}</li>
            </ul>
            <p>{t('test_duration', 'The complete test takes approximately 15-20 minutes to complete.')}</p>
          </div>

          <div className="test-privacy-notice">
            <h3>{t('privacy_note', 'Privacy Note')}</h3>
            <p>{t('privacy_description', 'Your test data is encrypted and only accessible to you and your authorized healthcare provider.')}</p>
          </div>

          <div className="test-consent">
            <label className="consent-checkbox">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>{t('consent_text', 'I understand and consent to taking this cognitive assessment test.')}</span>
            </label>
          </div>

          <div className="button-group">
            <button className="secondary-button" onClick={onCancel}>
              {t('cancel', 'Cancel')}
            </button>
            <button
              className="primary-button"
              onClick={() => setCurrentStep('memory')}
              disabled={!consent}
            >
              {t('begin_test', 'Begin Test')}
            </button>
          </div>
        </div>
      )}

      {/* Memory Test */}
      {currentStep === 'memory' && (
        <div className="test-module">
          <MemoryTest
            onComplete={(result) => handleTestComplete('memory', result)}
            onCancel={onCancel}
          />
        </div>
      )}

      {/* Attention Test */}
      {currentStep === 'attention' && (
        <div className="test-module">
          <AttentionTest
            onComplete={(result) => handleTestComplete('attention', result)}
            onCancel={onCancel}
          />
        </div>
      )}

      {/* Language Test */}
      {currentStep === 'language' && (
        <div className="test-module">
          <LanguageTest
            onComplete={(result) => handleTestComplete('language', result)}
            onCancel={onCancel}
          />
        </div>
      )}

      {/* Visuospatial Test */}
      {currentStep === 'visuospatial' && (
        <div className="test-module">
          <VisuospatialTest
            onComplete={(result) => handleTestComplete('visuospatial', result)}
            onCancel={onCancel}
          />
        </div>
      )}

      {/* Problem Solving Test */}
      {currentStep === 'problemSolving' && (
        <div className="test-module">
          <ProblemSolvingTest
            onComplete={(result) => handleTestComplete('problemSolving', result)}
            onCancel={onCancel}
          />
        </div>
      )}

      {/* Results Screen - Will be handled by parent component */}
      {currentStep === 'results' && (
        <div className="test-module">
          <div className="processing-results">
            <h2>{t('calculating_results', 'Calculating Your Brain Health Index...')}</h2>
            <div className="loader"></div>
            <p>{t('processing_data', 'Processing test data and generating your comprehensive report.')}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestContainer;