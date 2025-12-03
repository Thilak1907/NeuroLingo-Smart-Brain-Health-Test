import React, { useState, useEffect, useContext } from 'react';
import TestContainer from './TestContainer';
import Results from './Results';
import { LanguageContext } from '../contexts/LanguageContext';
import '../assets/styles/dashboard.css';

function Dashboard({ user }) {
  const { language, changeLanguage, t } = useContext(LanguageContext);
  const [activeView, setActiveView] = useState('dashboard');
  const [testResults, setTestResults] = useState(null);
  
  useEffect(() => {
    // In a real app, you would fetch results from an API
    if (user.role === 'patient') {
      // Mock data for demo purposes - moved inside effect to avoid dependency issues
      const mockResults = {
        date: '2025-08-28',
        scores: {
          overall: 82,
          memory: 85,
          attention: 78,
          language: 90,
          visuospatial: 75
        },
        risk: 'low'
      };
      setTestResults(mockResults);
    }
  }, [user]);
  
  const handleViewResults = () => {
    setActiveView('results');
  };
  
  const handleBackToDashboard = () => {
    setActiveView('dashboard');
  };
  
  if (activeView === 'results') {
    return <Results results={testResults} onBackToDashboard={handleBackToDashboard} />;
  }
  
  if (activeView === 'test') {
    return (
      <TestContainer 
        onTestComplete={(results) => {
          setTestResults(Array.isArray(testResults) 
            ? [results, ...testResults] 
            : [results, testResults].filter(Boolean));
          setActiveView('results');
        }}
        onCancel={() => setActiveView('dashboard')}
      />
    );
  }
  
  return (
    <div className="dashboard-container">
      {/* Top Row: Welcome + Profile + Language */}
      <div className="dashboard-top-row">
        <div className="welcome-section">
          <h2>Welcome, {user.name}</h2>
          <p className="role-badge">{user.role === 'doctor' ? 'Healthcare Provider' : 'Patient'}</p>
        </div>
        
        <div className="profile-language-section">
          <div className="profile-section">
            <div className="profile-avatar">
              <img 
                src={user.avatar || "https://via.placeholder.com/40"} 
                alt={user.name} 
                className="avatar-image"
              />
            </div>
            <div className="profile-info">
              <span className="profile-name">{user.name}</span>
              <span className="last-login">Last login: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="language-selector">
            <select 
              value={language} 
              onChange={(e) => changeLanguage(e.target.value)}
              className="language-dropdown"
            >
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
              <option value="hi">हिंदी</option>
              <option value="te">తెలుగు</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        {/* Main Tiles Section */}
        <div className="main-tiles">
          {/* Start New Test */}
          <div className="tile tile-test">
            <div className="tile-icon test-icon"></div>
            <h3>{t('brainHealthTest')}</h3>
            <p>{t('takeTest')}</p>
            <button 
              className="btn primary-btn"
              onClick={() => setActiveView('test')}
            >
              {t('startNewTest')}
            </button>
          </div>
          
          {/* My Results */}
          <div className="tile tile-results">
            <div className="tile-icon results-icon"></div>
            <h3>{t('myResults')}</h3>
            <p>{t('viewResults')}</p>
            <button 
              className="btn secondary-btn"
              onClick={handleViewResults}
            >
              {t('viewResultsBtn')}
            </button>
            
            {testResults && (
              <div className="last-test-info">
                <p>Last test: {testResults.date}</p>
                <div className="score-indicator">
                  <span className="score">{testResults.scores.overall}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Progress Tracker */}
          <div className="tile tile-progress">
            <div className="tile-icon progress-icon"></div>
            <h3>Progress Tracker</h3>
            <div className="progress-chart">
              {testResults ? (
                <div className="mini-chart">
                  <div className="chart-bar" style={{height: `${testResults.scores.memory}%`}} title="Memory"></div>
                  <div className="chart-bar" style={{height: `${testResults.scores.attention}%`}} title="Attention"></div>
                  <div className="chart-bar" style={{height: `${testResults.scores.language}%`}} title="Language"></div>
                  <div className="chart-bar" style={{height: `${testResults.scores.visuospatial}%`}} title="Visuospatial"></div>
                </div>
              ) : (
                <p>No test data yet</p>
              )}
            </div>
            <button className="btn outline-btn">View Trends</button>
          </div>
          
          {/* Risk Alerts */}
          <div className="tile tile-risk">
            <div className="tile-icon alert-icon"></div>
            <h3>Risk Alerts</h3>
            <div className="risk-level">
              {testResults ? (
                <>
                  <div className={`risk-indicator risk-${testResults.risk}`}>
                    {testResults.risk.toUpperCase()} RISK
                  </div>
                  <p>Based on your latest test results</p>
                </>
              ) : (
                <p>No risk assessment yet</p>
              )}
            </div>
            <button className="btn outline-btn">Learn More</button>
          </div>
        </div>
        
        {/* Side Panel / Bottom Section */}
        <div className="dashboard-side-panel">
          {/* Test History */}
          <div className="side-section history-section">
            <h3>Test History</h3>
            <div className="history-list">
              {testResults ? (
                <div className="history-item">
                  <span className="history-date">{testResults.date}</span>
                  <span className="history-score">Score: {testResults.scores.overall}</span>
                  <button className="btn-link">View</button>
                </div>
              ) : (
                <p>No previous tests</p>
              )}
            </div>
          </div>
          
          {/* Knowledge Hub */}
          <div className="side-section knowledge-section">
            <h3>Knowledge Hub</h3>
            <div className="knowledge-items">
              <div className="knowledge-item">
                <span className="knowledge-title">Understanding Your Brain Health</span>
                <button className="btn-link">Read</button>
              </div>
              <div className="knowledge-item">
                <span className="knowledge-title">Tips for Cognitive Improvement</span>
                <button className="btn-link">Read</button>
              </div>
            </div>
          </div>
          
          {/* Export / Share */}
          <div className="side-section export-section">
            <h3>Export / Share</h3>
            <div className="export-options">
              <button className="btn outline-btn">Export as PDF</button>
              <button className="btn outline-btn">Share with Doctor</button>
            </div>
          </div>
          
          {/* Clinician Details (for patients) */}
          {user.role === 'patient' && (
            <div className="side-section clinician-section">
              <h3>My Clinician</h3>
              <div className="clinician-info">
                <div className="clinician-avatar">
                  <img src="https://via.placeholder.com/40" alt="Doctor" />
                </div>
                <div className="clinician-details">
                  <span className="clinician-name">Dr. Sarah Johnson</span>
                  <span className="clinician-specialty">Neurologist</span>
                  <button className="btn-link">Contact</button>
                </div>
              </div>
            </div>
          )}
          
          {/* Patient List (for doctors) */}
          {user.role === 'doctor' && (
            <div className="side-section patients-section">
              <h3>{t('myPatients')}</h3>
              <p>{t('managePatients')}</p>
              <button 
                className="btn secondary-btn"
                onClick={() => setActiveView('patients')}
              >
                {t('viewPatients')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;