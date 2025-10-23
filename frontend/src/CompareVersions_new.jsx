import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CompareVersions.css';
import { API_ENDPOINTS, apiRequest } from './config/api';

const CompareVersions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [versions, setVersions] = useState([]);
  const [selectedV1, setSelectedV1] = useState(null);
  const [selectedV2, setSelectedV2] = useState('current');
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    fetchVersionHistory();
  }, [id]);

  const fetchVersionHistory = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(API_ENDPOINTS.RESUME_VERSIONS(id));

      if (response.success) {
        setVersions(response.data.versions || []);

        // Auto-select last version and current for comparison
        if (response.data.versions && response.data.versions.length > 0) {
          setSelectedV1(response.data.versions[response.data.versions.length - 1].version);
        }
      }
    } catch (error) {
      console.error('Error fetching version history:', error);
      alert('Failed to load version history');
    } finally {
      setLoading(false);
    }
  };

  const compareVersions = async () => {
    if (!selectedV1) {
      alert('Please select two versions to compare');
      return;
    }

    // Check if selecting same versions
    if (selectedV1 === selectedV2 ||
        (selectedV2 !== 'current' && parseInt(selectedV1) === parseInt(selectedV2))) {
      alert('⚠️ Cannot compare a version with itself. Please select two different versions.');
      return;
    }

    try {
      setComparing(true);
      const response = await apiRequest(
        API_ENDPOINTS.COMPARE_VERSIONS(id, selectedV1, selectedV2)
      );

      if (response.success) {
        setComparisonData(response.data);
      }
    } catch (error) {
      console.error('Error comparing versions:', error);
      alert('Failed to compare versions');
    } finally {
      setComparing(false);
    }
  };

  const restoreVersion = async (version) => {
    if (!window.confirm(`Are you sure you want to restore to version ${version}? This will save your current state before restoring.`)) {
      return;
    }

    try {
      const response = await apiRequest(
        API_ENDPOINTS.RESTORE_VERSION(id, version),
        { method: 'POST' }
      );

      if (response.success) {
        alert(`Successfully restored to version ${version}`);
        navigate(`/editor/${id}`);
      }
    } catch (error) {
      console.error('Error restoring version:', error);
      alert('Failed to restore version');
    }
  };

  const renderResumePreview = (content, customization, label, version) => {
    const cvData = content || {};
    const custom = customization || {};
    const isCurrentVersion = version === 'current';

    return (
      <div className="resume-preview-container">
        <div className="preview-header">
          <h3>{label}</h3>
          {!isCurrentVersion && (
            <button
              className="btn-restore-small"
              onClick={() => restoreVersion(version)}
            >
              Restore
            </button>
          )}
        </div>
        <div
          className="resume-preview-paper"
          style={{
            fontFamily: custom.font || 'Inter',
            fontSize: custom.fontSize === 'small' ? '12px' : custom.fontSize === 'large' ? '16px' : '14px',
            background: '#FFFFFF',
            padding: '40px',
            minHeight: '1100px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px'
          }}
        >
          {/* Personal Info */}
          <div className="cv-personal" style={{ marginBottom: '24px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0', color: '#111827' }}>
              {cvData.personal?.fullName || 'Your Name'}
            </h1>
            <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
              {cvData.personal?.email && <span>{cvData.personal.email}</span>}
              {cvData.personal?.phone && <span> • {cvData.personal.phone}</span>}
              {cvData.personal?.location && <span> • {cvData.personal.location}</span>}
            </div>
            {(cvData.personal?.linkedin || cvData.personal?.website) && (
              <div style={{ fontSize: '14px', color: '#6B7280' }}>
                {cvData.personal?.linkedin && <span>{cvData.personal.linkedin}</span>}
                {cvData.personal?.website && <span> • {cvData.personal.website}</span>}
              </div>
            )}
            {cvData.personal?.summary && (
              <p style={{ marginTop: '16px', fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
                {cvData.personal.summary}
              </p>
            )}
          </div>

          {/* Experience */}
          {cvData.experience && cvData.experience.length > 0 && (
            <div className="cv-section" style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '12px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
                Experience
              </h2>
              {cvData.experience.map((exp, idx) => (
                <div key={idx} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0' }}>
                      {exp.jobTitle}
                    </h3>
                    <span style={{ fontSize: '13px', color: '#6B7280' }}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#4B5563', marginBottom: '4px' }}>
                    {exp.company} {exp.location && `• ${exp.location}`}
                  </div>
                  {exp.description && (
                    <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5', margin: '8px 0 0 0' }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {cvData.education && cvData.education.length > 0 && (
            <div className="cv-section" style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '12px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
                Education
              </h2>
              {cvData.education.map((edu, idx) => (
                <div key={idx} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0' }}>
                      {edu.degree}
                    </h3>
                    <span style={{ fontSize: '13px', color: '#6B7280' }}>
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#4B5563', marginBottom: '4px' }}>
                    {edu.school} {edu.location && `• ${edu.location}`}
                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                  </div>
                  {edu.description && (
                    <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5', margin: '8px 0 0 0' }}>
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {cvData.skills && (cvData.skills.technical?.length > 0 || cvData.skills.soft?.length > 0) && (
            <div className="cv-section" style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '12px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
                Skills
              </h2>
              {cvData.skills.technical?.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ fontSize: '14px', color: '#111827' }}>Technical: </strong>
                  <span style={{ fontSize: '14px', color: '#374151' }}>
                    {cvData.skills.technical.join(', ')}
                  </span>
                </div>
              )}
              {cvData.skills.soft?.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ fontSize: '14px', color: '#111827' }}>Soft Skills: </strong>
                  <span style={{ fontSize: '14px', color: '#374151' }}>
                    {cvData.skills.soft.join(', ')}
                  </span>
                </div>
              )}
              {cvData.skills.languages?.length > 0 && (
                <div>
                  <strong style={{ fontSize: '14px', color: '#111827' }}>Languages: </strong>
                  <span style={{ fontSize: '14px', color: '#374151' }}>
                    {cvData.skills.languages.join(', ')}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Projects */}
          {cvData.projects && cvData.projects.length > 0 && (
            <div className="cv-section" style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '12px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
                Projects
              </h2>
              {cvData.projects.map((proj, idx) => (
                <div key={idx} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0' }}>
                      {proj.name}
                    </h3>
                    {proj.startDate && (
                      <span style={{ fontSize: '13px', color: '#6B7280' }}>
                        {proj.startDate} - {proj.endDate || 'Present'}
                      </span>
                    )}
                  </div>
                  {proj.technologies && (
                    <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>
                      {proj.technologies}
                    </div>
                  )}
                  {proj.description && (
                    <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5', margin: '8px 0 0 0' }}>
                      {proj.description}
                    </p>
                  )}
                  {proj.link && (
                    <a href={proj.link} style={{ fontSize: '13px', color: '#4F46E5', textDecoration: 'none' }}>
                      {proj.link}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Certificates */}
          {cvData.certificates && cvData.certificates.length > 0 && (
            <div className="cv-section" style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '12px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
                Certificates
              </h2>
              {cvData.certificates.map((cert, idx) => (
                <div key={idx} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0' }}>
                      {cert.name}
                    </h3>
                    {cert.date && (
                      <span style={{ fontSize: '13px', color: '#6B7280' }}>
                        {cert.date}
                      </span>
                    )}
                  </div>
                  {cert.issuer && (
                    <div style={{ fontSize: '14px', color: '#4B5563', marginBottom: '4px' }}>
                      {cert.issuer}
                    </div>
                  )}
                  {cert.description && (
                    <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5', margin: '8px 0 0 0' }}>
                      {cert.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContentComparison = () => {
    if (!comparisonData) return null;

    const { version1, version2 } = comparisonData;

    return (
      <div className="comparison-grid">
        {renderResumePreview(
          version1.content,
          version1.customization,
          `Version ${version1.version} - ${new Date(version1.createdAt).toLocaleDateString()}`,
          version1.version
        )}
        {renderResumePreview(
          version2.content,
          version2.customization,
          version2.version === 'current'
            ? 'Current Version'
            : `Version ${version2.version} - ${new Date(version2.createdAt).toLocaleDateString()}`,
          version2.version
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="compare-loading">
        <div className="spinner"></div>
        <p>Loading version history...</p>
      </div>
    );
  }

  return (
    <div className="compare-versions-page">
      <header className="compare-header">
        <div className="compare-header-content">
          <button className="btn-back" onClick={() => navigate(`/editor/${id}`)}>
            ← Back to Editor
          </button>
          <h1>Compare Versions</h1>
        </div>
      </header>

      <div className="compare-main">
        <div className="version-selector">
          <div className="selector-group">
            <label>Select Version 1:</label>
            <select
              value={selectedV1 || ''}
              onChange={(e) => setSelectedV1(parseInt(e.target.value))}
            >
              <option value="">Select a version...</option>
              {versions.map((v) => (
                <option
                  key={v.version}
                  value={v.version}
                  disabled={selectedV2 !== 'current' && v.version === parseInt(selectedV2)}
                >
                  Version {v.version} - {new Date(v.createdAt).toLocaleDateString()} ({v.comment || 'No comment'})
                  {selectedV2 !== 'current' && v.version === parseInt(selectedV2) ? ' (Already selected)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="vs-divider">VS</div>

          <div className="selector-group">
            <label>Select Version 2:</label>
            <select
              value={selectedV2}
              onChange={(e) => setSelectedV2(e.target.value === 'current' ? 'current' : parseInt(e.target.value))}
            >
              <option value="current">Current Version</option>
              {versions.map((v) => (
                <option
                  key={v.version}
                  value={v.version}
                  disabled={v.version === parseInt(selectedV1)}
                >
                  Version {v.version} - {new Date(v.createdAt).toLocaleDateString()} ({v.comment || 'No comment'})
                  {v.version === parseInt(selectedV1) ? ' (Already selected)' : ''}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn-compare"
            onClick={compareVersions}
            disabled={!selectedV1 || comparing}
          >
            {comparing ? 'Comparing...' : 'Compare'}
          </button>
        </div>

        {selectedV1 && selectedV2 !== 'current' && parseInt(selectedV1) === parseInt(selectedV2) && (
          <div className="warning-message">
            ⚠️ You have selected the same version. Please choose two different versions to compare.
          </div>
        )}

        {comparisonData && renderContentComparison()}

        {!comparisonData && !comparing && (
          <div className="no-comparison">
            <p>Select two versions and click "Compare" to see the differences</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareVersions;
