import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SharedResume.css';
import { API_ENDPOINTS } from './config/api';

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
      const response = await fetch(API_ENDPOINTS.EXPORT_SHARED_PDF(shareId));

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resume.title || 'resume'}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
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
    // Check if the error is because the resume is private
    const isPrivateError = error && (error.includes('not public') || error.includes('not found'));

    return (
      <div className="shared-resume-error">
        <div className="error-icon">{isPrivateError ? '🔒' : '⚠️'}</div>
        <h1>{isPrivateError ? 'This Resume is Private' : 'Resume Not Found'}</h1>
        <p>
          {isPrivateError
            ? 'This resume has been set to private by the owner and is no longer publicly accessible.'
            : (error || 'This resume link is invalid or has expired.')
          }
        </p>
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
      {/* Simple Header - Like Preview */}
      <header className="shared-header">
        <div className="shared-header-content">
          <div className="header-left">
            <div className="logo-section">
              <img src="/images/resumebuilder-logo.webp" alt="ResumeBuilder Logo" className="logo-image" />
              <span className="logo-text">ResumeBuilder</span>
            </div>
            <div className="resume-title-section">
              <p className="viewing-label">Viewing shared resume:</p>
              <h1>{resume.title}</h1>
            </div>
          </div>
          <div className="header-actions">
            {resume.allowDownload !== false && (
              <>
                <button 
                  className="btn-download" 
                  onClick={downloadPDF}
                  disabled={downloading}
                  title="Download as PDF"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8.5 11.5a.5.5 0 01-1 0V6.707L5.354 8.854a.5.5 0 11-.708-.708l3-3a.5.5 0 01.708 0l3 3a.5.5 0 01-.708.708L8.5 6.707V11.5z"/>
                    <path d="M14 13.5a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 13.5V9.5a.5.5 0 011 0v4a.5.5 0 00.5.5h9a.5.5 0 00.5-.5v-4a.5.5 0 011 0v4z"/>
                  </svg>
                  {downloading ? 'Downloading...' : 'Download PDF'}
                </button>
              </>
            )}
            <button 
              className="btn-home-link" 
              onClick={() => navigate('/')}
            >
              Create Your Resume
            </button>
          </div>
        </div>
      </header>

      {/* Resume Preview - Styled like Editor Preview */}
      <div className="shared-content">
        <div className="preview-wrapper">
          <div 
            id="resume-preview" 
            className="resume-preview-paper"
            style={{
              fontFamily: customization.fontFamily || 'Inter, system-ui, sans-serif',
              fontSize: `${customization.fontSize || 14}px`,
              color: customization.textColor || '#1f2937'
            }}
          >
            {/* Personal Info */}
            {cvData.personal && (
              <div className="resume-header" style={{ 
                borderBottom: `3px solid ${customization.primaryColor || '#4F46E5'}`,
                paddingBottom: '24px',
                marginBottom: '32px'
              }}>
                <h1 style={{ 
                  fontSize: '2.5em', 
                  margin: '0 0 8px 0',
                  fontWeight: '700',
                  color: customization.primaryColor || '#1f2937',
                  letterSpacing: '-0.02em'
                }}>
                  {cvData.personal.fullName}
                </h1>
                {cvData.personal.title && (
                  <div style={{ 
                    fontSize: '1.1em', 
                    color: '#6B7280', 
                    marginBottom: '12px',
                    fontWeight: '500'
                  }}>
                    {cvData.personal.title}
                  </div>
                )}
                <div style={{ 
                  fontSize: '0.9em', 
                  color: '#6B7280',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  {cvData.personal.email && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M0 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v.217l7 4.2 7-4.2V4a1 1 0 00-1-1H2zm13 2.383l-4.708 2.825L15 11.105V5.383zm-.034 6.876l-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 002 13h12a1 1 0 00.966-.741zM1 11.105l4.708-2.897L1 5.383v5.722z"/>
                      </svg>
                      {cvData.personal.email}
                    </span>
                  )}
                  {cvData.personal.phone && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M3.654 1.328a.678.678 0 00-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 004.168 6.608 17.569 17.569 0 006.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 00-.063-1.015l-2.307-1.794a.678.678 0 00-.58-.122l-2.19.547a1.745 1.745 0 01-1.657-.459L5.482 8.062a1.745 1.745 0 01-.46-1.657l.548-2.19a.678.678 0 00-.122-.58L3.654 1.328z"/>
                      </svg>
                      {cvData.personal.phone}
                    </span>
                  )}
                  {cvData.personal.location && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 16s6-5.686 6-10A6 6 0 002 6c0 4.314 6 10 6 10zm0-7a3 3 0 110-6 3 3 0 010 6z"/>
                      </svg>
                      {cvData.personal.location}
                    </span>
                  )}
                  {cvData.personal.linkedin && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 01.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                      </svg>
                      {cvData.personal.linkedin}
                    </span>
                  )}
                  {cvData.personal.website && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M0 8a8 8 0 1116 0A8 8 0 010 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 005.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 01.64-1.539 6.7 6.7 0 01.597-.933A7.025 7.025 0 002.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 00-.656 2.5h2.49zM4.847 5a12.5 12.5 0 00-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 00-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 00.337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 01-.597-.933A9.268 9.268 0 014.09 12H2.255a7.024 7.024 0 003.072 2.472zM3.82 11a13.652 13.652 0 01-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0013.745 12H11.91a9.27 9.27 0 01-.64 1.539 6.688 6.688 0 01-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 01-.312 2.5zm2.802-3.5a6.959 6.959 0 00-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 00-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 00-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z"/>
                      </svg>
                      {cvData.personal.website}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Summary */}
            {cvData.summary && cvData.summary.trim() && (
              <div className="resume-section" style={{ marginBottom: '28px' }}>
                <h2 style={{ 
                  fontSize: '1.4em',
                  fontWeight: '600',
                  color: customization.primaryColor || '#4F46E5',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Professional Summary
                </h2>
                <p style={{ margin: 0, lineHeight: '1.7', color: '#374151' }}>{cvData.summary}</p>
              </div>
            )}

            {/* Experience */}
            {cvData.experience && cvData.experience.length > 0 && (
              <div className="resume-section" style={{ marginBottom: '28px' }}>
                <h2 style={{ 
                  fontSize: '1.4em',
                  fontWeight: '600',
                  color: customization.primaryColor || '#4F46E5',
                  marginBottom: '16px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Work Experience
                </h2>
                {cvData.experience.map((exp, index) => (
                  <div key={index} style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '1.1em', color: '#111827' }}>{exp.position || exp.jobTitle}</strong>
                      <span style={{ color: '#6B7280', fontSize: '0.85em', whiteSpace: 'nowrap', marginLeft: '16px' }}>
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div style={{ color: '#4B5563', marginBottom: '8px', fontWeight: '500' }}>
                      {exp.company}{exp.location && <span style={{ color: '#9CA3AF' }}> • {exp.location}</span>}
                    </div>
                    {exp.description && (
                      <div style={{ lineHeight: '1.6', color: '#374151' }}>
                        {exp.description.split('\n').map((line, i) => (
                          <div key={i} style={{ marginBottom: '4px' }}>{line}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {cvData.education && cvData.education.length > 0 && (
              <div className="resume-section" style={{ marginBottom: '28px' }}>
                <h2 style={{ 
                  fontSize: '1.4em',
                  fontWeight: '600',
                  color: customization.primaryColor || '#4F46E5',
                  marginBottom: '16px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Education
                </h2>
                {cvData.education.map((edu, index) => (
                  <div key={index} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '1.1em', color: '#111827' }}>{edu.degree}</strong>
                      <span style={{ color: '#6B7280', fontSize: '0.85em', whiteSpace: 'nowrap', marginLeft: '16px' }}>
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                    <div style={{ color: '#4B5563', fontWeight: '500' }}>
                      {edu.school}{edu.location && <span style={{ color: '#9CA3AF' }}> • {edu.location}</span>}
                    </div>
                    {edu.gpa && <div style={{ color: '#6B7280', fontSize: '0.9em', marginTop: '4px' }}>GPA: {edu.gpa}</div>}
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {cvData.skills && Object.keys(cvData.skills).some(cat => cvData.skills[cat]?.length > 0) && (
              <div className="resume-section" style={{ marginBottom: '28px' }}>
                <h2 style={{ 
                  fontSize: '1.4em',
                  fontWeight: '600',
                  color: customization.primaryColor || '#4F46E5',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Skills
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Object.entries(cvData.skills).map(([category, skills]) => (
                    skills?.length > 0 && (
                      <div key={category} style={{ display: 'flex', gap: '8px' }}>
                        <strong style={{ 
                          textTransform: 'capitalize', 
                          minWidth: '100px',
                          color: '#374151'
                        }}>
                          {category}:
                        </strong>
                        <span style={{ color: '#4B5563' }}>{skills.join(' • ')}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="shared-footer">
        <p>
          Powered by <strong>ResumeBuilder</strong> • 
          <a href="/" onClick={() => navigate('/')}> Create your own professional resume for free</a>
        </p>
      </footer>
    </div>
  );
};

export default SharedResume;
