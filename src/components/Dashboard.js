"use client";
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { LanguageContext } from '../contexts/LanguageContext';
import { UserContext } from '../contexts/UserContext';
import '../assets/styles/dashboard.css';

function Dashboard() {
  const { language, changeLanguage, t } = useContext(LanguageContext);
  const { user, testResults, setTestResults } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    // In a real app, you would fetch results from an API
    if (user?.role === 'patient' && !testResults) {
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
  }, [user, testResults, setTestResults]);

  if (!user) return null; // Wait for context


  const handleViewResults = () => {
    router.push('/results');
  };

  return (
    <div className="dashboard-container">
      {/* Top Row: Welcome + Profile + Language */}
      <div className="dashboard-top-row">
        <div className="welcome-section">
          <h2>{t('welcome')}, {user.name}</h2>
          <p className="role-badge">{user.role === 'doctor' ? t('healthcareProvider', 'Healthcare Provider') : t('patient', 'Patient')}</p>
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
          {/* Voice-Enabled Test (Primary) */}
          <div className="tile tile-voice-test" style={{ borderColor: '#3b82f6', borderWidth: '2px' }}>
            <h3>{t('voiceBrainTest', 'Voice Brain Health Test')}</h3>
            <p>{t('voiceBrainTestDesc', 'Take the full cognitive assessment with voice input/output. Questions are read aloud, and you speak your answers.')}</p>
            <button
              className="btn primary-btn"
              onClick={() => router.push('/voice-test')}
              style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
            >
              {t('startVoiceTest', 'Start Voice Test')}
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
            <h3>{t('progressTracker', 'Progress Tracker')}</h3>
            <div className="progress-chart">
              {testResults ? (
                <div className="mini-chart">
                  <div className="chart-bar" style={{ height: `${testResults.scores.memory}%` }} title={t('memoryScore')}></div>
                  <div className="chart-bar" style={{ height: `${testResults.scores.attention}%` }} title={t('attentionScore')}></div>
                  <div className="chart-bar" style={{ height: `${testResults.scores.language}%` }} title={t('languageScore')}></div>
                  <div className="chart-bar" style={{ height: `${testResults.scores.visuospatial}%` }} title={t('visuospatialScore')}></div>
                </div>
              ) : (
                <p>{t('noTestData', 'No test data yet')}</p>
              )}
            </div>
            <button className="btn outline-btn">{t('viewTrends', 'View Trends')}</button>
          </div>

          {/* Risk Alerts */}
          <div className="tile tile-risk">
            <div className="tile-icon alert-icon"></div>
            <h3>{t('riskAlerts', 'Risk Alerts')}</h3>
            <div className="risk-level">
              {testResults ? (
                <>
                  <div className={`risk-indicator risk-${testResults.risk}`}>
                    {testResults.risk.toUpperCase()} {t('risk', 'RISK')}
                  </div>
                  <p>{t('basedOnResults', 'Based on your latest test results')}</p>
                </>
              ) : (
                <p>{t('noRiskYet', 'No risk assessment yet')}</p>
              )}
            </div>
            <button className="btn outline-btn">{t('learnMore', 'Learn More')}</button>
          </div>
        </div>

        {/* Side Panel / Bottom Section */}
        <div className="dashboard-side-panel">
          {/* Test History */}
          <div className="side-section history-section">
            <h3>{t('testHistory', 'Test History')}</h3>
            <div className="history-list">
              {testResults ? (
                <div className="history-item">
                  <span className="history-date">{testResults.date}</span>
                  <span className="history-score">{t('score')}: {testResults.scores.overall}</span>
                  <button className="btn-link">{t('view', 'View')}</button>
                </div>
              ) : (
                <p>{t('noPreviousTests', 'No previous tests')}</p>
              )}
            </div>
          </div>

          {/* Knowledge Hub */}
          <div className="side-section knowledge-section">
            <h3>{t('knowledgeHub', 'Knowledge Hub')}</h3>
            <div className="knowledge-items">
              <div className="knowledge-item">
                <span className="knowledge-title">{t('brainHealthArticle', 'Understanding Your Brain Health')}</span>
                <button className="btn-link">{t('read', 'Read')}</button>
              </div>
              <div className="knowledge-item">
                <span className="knowledge-title">{t('cognitiveImprovementTips', 'Tips for Cognitive Improvement')}</span>
                <button className="btn-link">{t('read', 'Read')}</button>
              </div>
            </div>
          </div>

          {/* Export / Share */}
          <div className="side-section export-section">
            <h3>{t('exportShare', 'Export / Share')}</h3>
            <div className="export-options">
              <button className="btn outline-btn">{t('exportPdf', 'Export as PDF')}</button>
              <button className="btn outline-btn">{t('shareDoctor', 'Share with Doctor')}</button>
            </div>
          </div>

          {/* Clinician Details (for patients) */}
          {user.role === 'patient' && (
            <div className="side-section clinician-section">
              <h3>{t('myClinician', 'My Clinician')}</h3>
              <div className="clinician-info">
                <div className="clinician-avatar">
                  <img src="https://via.placeholder.com/40" alt="Doctor" />
                </div>
                <div className="clinician-details">
                  <span className="clinician-name">Dr. Sarah Johnson</span>
                  <span className="clinician-specialty">{t('neurologist', 'Neurologist')}</span>
                  <button className="btn-link">{t('contact', 'Contact')}</button>
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
                // Assuming patients view routes to some page, for now just log or push
                onClick={() => console.log('View Patients')}
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