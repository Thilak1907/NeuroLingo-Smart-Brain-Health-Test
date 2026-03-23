"use client";
import React, { useContext, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LanguageContext } from '../contexts/LanguageContext';
import { UserContext } from '../contexts/UserContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import '../assets/styles/results.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Results() {
  const { t } = useContext(LanguageContext);
  const { testResults, user } = useContext(UserContext);
  const router = useRouter();
  const reportRef = useRef(null);

  useEffect(() => {
    // If somehow landed here safely without user, we might want to redirect
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  const onBackToDashboard = () => router.push('/dashboard');

  // Mock result data if none provided
  const testResult = testResults || {
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

  // Determine risk level class for styling
  const getRiskClass = (score) => {
    if (score >= 80) return 'low-risk';
    if (score >= 60) return 'moderate-risk';
    return 'high-risk';
  };

  const riskClass = getRiskClass(testResult.scores.overall);

  // Prepare chart data
  const chartData = {
    labels: [t('memory'), t('attention'), t('language'), t('visuospatial')],
    datasets: [
      {
        label: t('testScores'),
        data: [
          testResult.scores.memory,
          testResult.scores.attention,
          testResult.scores.language,
          testResult.scores.visuospatial
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        }
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to download PDF
  const downloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      // Show loading indicator
      const loadingElement = document.createElement('div');
      loadingElement.className = 'pdf-loading';
      loadingElement.textContent = t('generatingPdf');
      document.body.appendChild(loadingElement);

      // Create PDF
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;

      // Add NeuroLingo header
      pdf.setFillColor(59, 123, 213);
      pdf.rect(0, 0, pdfWidth, 20, 'F');
      pdf.setFontSize(16);
      pdf.setTextColor(255, 255, 255);
      pdf.text('NeuroLingo - ' + t('brainHealthTest'), 10, 13);

      // Add the captured image
      pdf.addImage(imgData, 'PNG', imgX, 25, imgWidth * ratio, imgHeight * ratio);

      // Add footer
      const today = new Date().toLocaleDateString();
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`${t('generatedOn')}: ${today}`, 10, pdfHeight - 10);
      pdf.text('© NeuroLingo', pdfWidth - 25, pdfHeight - 10);

      // Save the PDF
      pdf.save(`NeuroLingo-Results-${formatDate(testResult.date).replace(/\//g, '-')}.pdf`);

      // Remove loading indicator
      document.body.removeChild(loadingElement);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(t('pdfError'));
    }
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <h1>{t('myTestResults')}</h1>
        <button
          className="back-btn"
          onClick={onBackToDashboard}
        >
          {t('backToDashboard')}
        </button>
      </div>

      <div className="report-content" ref={reportRef}>
        <div className="test-info">
          <h2>{t('brainHealthTest')}</h2>
          <div className="test-date">{formatDate(testResult.date)}</div>
        </div>

        <div className="results-summary">
          <div className="overall-score-section">
            <div className={`score-circle ${riskClass}`}>
              <div className="score-value">{testResult.scores.overall}</div>
            </div>
            <div className="risk-level">
              {testResult.risk === 'low' ? t('lowRisk') :
                testResult.risk === 'moderate' ? t('moderateRisk') : t('highRisk')}
            </div>
          </div>

          <div className="cognitive-domains">
            <div className="domain-scores">
              <div className="domain-row">
                <div className="domain-label">{t('memory')}</div>
                <div className="score-bar-container">
                  <div
                    className="score-bar memory"
                    style={{ width: `${testResult.scores.memory}%` }}
                  >
                    <span className="score-percentage">{testResult.scores.memory}%</span>
                  </div>
                </div>
              </div>

              <div className="domain-row">
                <div className="domain-label">{t('attention')}</div>
                <div className="score-bar-container">
                  <div
                    className="score-bar attention"
                    style={{ width: `${testResult.scores.attention}%` }}
                  >
                    <span className="score-percentage">{testResult.scores.attention}%</span>
                  </div>
                </div>
              </div>

              <div className="domain-row">
                <div className="domain-label">{t('language')}</div>
                <div className="score-bar-container">
                  <div
                    className="score-bar language"
                    style={{ width: `${testResult.scores.language}%` }}
                  >
                    <span className="score-percentage">{testResult.scores.language}%</span>
                  </div>
                </div>
              </div>

              <div className="domain-row">
                <div className="domain-label">{t('visuospatial')}</div>
                <div className="score-bar-container">
                  <div
                    className="score-bar visuospatial"
                    style={{ width: `${testResult.scores.visuospatial}%` }}
                  >
                    <span className="score-percentage">{testResult.scores.visuospatial}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <h3>{t('domainComparison')}</h3>
          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} height={280} />
          </div>
        </div>

        <div className="interpretation">
          <h3>{t('resultInterpretation')}</h3>
          <p>
            {testResult.scores.overall >= 80
              ? t('highScoreInterpretation')
              : testResult.scores.overall >= 60
                ? t('moderateScoreInterpretation')
                : t('lowScoreInterpretation')}
          </p>

          {testResult.scores.memory < 70 && (
            <div className="recommendation">
              <strong>{t('memoryRecommendation')}</strong>
            </div>
          )}

          {testResult.scores.attention < 70 && (
            <div className="recommendation">
              <strong>{t('attentionRecommendation')}</strong>
            </div>
          )}
        </div>
      </div>

      <div className="results-actions">
        <button
          className="btn primary-btn"
          onClick={downloadPDF}
        >
          <i className="download-icon"></i>
          {t('downloadPDF')}
        </button>
        <button className="btn secondary-btn" onClick={onBackToDashboard}>
          {t('backToDashboard')}
        </button>
      </div>
    </div>
  );
}

export default Results;