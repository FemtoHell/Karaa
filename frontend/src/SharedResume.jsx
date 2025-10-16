import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SharedResume.css';
import { API_ENDPOINTS } from './config/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const SharedResume = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchSharedResume = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_ENDPOINTS.RESUMES}/share/${shareId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load shared resume');
        }

        if (data.success) {
          setResume(data.data);
        } else {
          throw new Error('Resume not found or no longer available');
        }
      } catch (err) {
        console.error('Error fetching shared resume:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (shareId) {
      fetchSharedResume();
    }
  }, [shareId]);

  const downloadPDF = async () => {
    try {
      setDownloading(true);
      const element = document.getElementById('resume-preview');
      
      if (!element) {
        throw new Error('Resume preview not found');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${resume.title || 'resume'}.pdf`);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const downloadDocx = async () => {
    try {
      setDownloading(true);
      const response = await fetch(API_ENDPOINTS.EXPORT_SHARED_DOCX(shareId));
      
      if (!response.ok) {
        throw new Error('Failed to download DOCX');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resume.title || 'resume'}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading DOCX:', err);
      alert('Failed to download DOCX. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="shared-resume-loading">
        <div className="loading-spinner"></div>
        <p>Loading shared resume...</p>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="shared-resume-error">
        <div className="error-icon">⚠️</div>
        <h1>Resume Not Found</h1>
        <p>{error || 'This resume link is invalid or has expired.'}</p>
        <button onClick={() => navigate('/')} className="btn-home">
          Go to Home
        </button>
      </div>
    );
  }

  const cvData = resume.content || {};
  const customization = resume.customization || {};

  return (
    <div className="shared-resume-page">
      {/* Header */}
      <header className="shared-header">
        <div className="shared-header-content">
          <div className="header-left">
            <h1>Shared Resume</h1>
            <p>{resume.title}</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn-download" 
              onClick={downloadPDF}
              disabled={downloading}
            >
              {downloading ? 'Downloading...' : 'Download PDF'}
            </button>
            <button 
              className="btn-download btn-secondary" 
              onClick={downloadDocx}
              disabled={downloading}
            >
              Download DOCX
            </button>
            <button 
              className="btn-home-link" 
              onClick={() => navigate('/')}
            >
              Create Your Own Resume
            </button>
          </div>
        </div>
      </header>

      {/* Resume Preview */}
      <div className="shared-content">
        <div 
          id="resume-preview" 
          className="resume-container"
          style={{
            fontFamily: customization.fontFamily || 'Poppins, sans-serif',
            fontSize: `${customization.fontSize || 14}px`,
            color: customization.textColor || '#1f2937',
            backgroundColor: '#ffffff',
            padding: '40px',
            maxWidth: '210mm',
            margin: '0 auto',
            minHeight: '297mm'
          }}
        >
          {/* Personal Info */}
          {cvData.personal && (
            <div className="resume-header" style={{ 
              borderBottom: `2px solid ${customization.primaryColor || '#4F46E5'}`,
              paddingBottom: '20px',
              marginBottom: '30px'
            }}>
              <h1 style={{ 
                fontSize: '2em', 
                margin: '0 0 10px 0',
                color: customization.primaryColor || '#4F46E5'
              }}>
                {cvData.personal.fullName}
              </h1>
              <div style={{ fontSize: '0.9em', color: '#6B7280', marginBottom: '10px' }}>
                {cvData.personal.title}
              </div>
              <div style={{ fontSize: '0.85em', color: '#6B7280' }}>
                {cvData.personal.email && <span>{cvData.personal.email}</span>}
                {cvData.personal.phone && <span> • {cvData.personal.phone}</span>}
                {cvData.personal.location && <span> • {cvData.personal.location}</span>}
                {cvData.personal.linkedin && <span> • {cvData.personal.linkedin}</span>}
                {cvData.personal.github && <span> • {cvData.personal.github}</span>}
                {cvData.personal.website && <span> • {cvData.personal.website}</span>}
              </div>
            </div>
          )}

          {/* Summary */}
          {cvData.summary && cvData.summary.trim() && (
            <div className="resume-section" style={{ marginBottom: '25px' }}>
              <h2 style={{ 
                fontSize: '1.3em',
                color: customization.primaryColor || '#4F46E5',
                borderBottom: `1px solid ${customization.primaryColor || '#4F46E5'}`,
                paddingBottom: '5px',
                marginBottom: '15px'
              }}>
                Professional Summary
              </h2>
              <p style={{ margin: 0, lineHeight: '1.6' }}>{cvData.summary}</p>
            </div>
          )}

          {/* Experience */}
          {cvData.experience && cvData.experience.length > 0 && (
            <div className="resume-section" style={{ marginBottom: '25px' }}>
              <h2 style={{ 
                fontSize: '1.3em',
                color: customization.primaryColor || '#4F46E5',
                borderBottom: `1px solid ${customization.primaryColor || '#4F46E5'}`,
                paddingBottom: '5px',
                marginBottom: '15px'
              }}>
                Work Experience
              </h2>
              {cvData.experience.map((exp, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <strong style={{ fontSize: '1.05em' }}>{exp.position}</strong>
                    <span style={{ color: '#6B7280', fontSize: '0.9em' }}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div style={{ color: '#6B7280', marginBottom: '8px' }}>
                    {exp.company}{exp.location && ` • ${exp.location}`}
                  </div>
                  {exp.description && (
                    <div style={{ lineHeight: '1.6' }}>
                      {exp.description.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {cvData.education && cvData.education.length > 0 && (
            <div className="resume-section" style={{ marginBottom: '25px' }}>
              <h2 style={{ 
                fontSize: '1.3em',
                color: customization.primaryColor || '#4F46E5',
                borderBottom: `1px solid ${customization.primaryColor || '#4F46E5'}`,
                paddingBottom: '5px',
                marginBottom: '15px'
              }}>
                Education
              </h2>
              {cvData.education.map((edu, index) => (
                <div key={index} style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <strong style={{ fontSize: '1.05em' }}>{edu.degree}</strong>
                    <span style={{ color: '#6B7280', fontSize: '0.9em' }}>
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <div style={{ color: '#6B7280' }}>
                    {edu.school}{edu.location && ` • ${edu.location}`}
                  </div>
                  {edu.gpa && <div style={{ color: '#6B7280', fontSize: '0.9em' }}>GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {cvData.skills && Object.keys(cvData.skills).some(cat => cvData.skills[cat].length > 0) && (
            <div className="resume-section" style={{ marginBottom: '25px' }}>
              <h2 style={{ 
                fontSize: '1.3em',
                color: customization.primaryColor || '#4F46E5',
                borderBottom: `1px solid ${customization.primaryColor || '#4F46E5'}`,
                paddingBottom: '5px',
                marginBottom: '15px'
              }}>
                Skills
              </h2>
              {Object.entries(cvData.skills).map(([category, skills]) => (
                skills.length > 0 && (
                  <div key={category} style={{ marginBottom: '10px' }}>
                    <strong style={{ textTransform: 'capitalize' }}>{category}: </strong>
                    <span>{skills.join(' • ')}</span>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="shared-footer">
        <p>Created with ResumeBuilder • <a href="/">Create your own professional resume</a></p>
      </footer>
    </div>
  );
};

export default SharedResume;
