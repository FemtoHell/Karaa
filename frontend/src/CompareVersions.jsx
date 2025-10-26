import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CompareVersions.css';
import { API_ENDPOINTS, apiRequest } from './config/api';
import ResumePreview from './components/ResumePreview';
import { DEFAULT_TEMPLATE } from './constants/defaultTemplate';

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
    // eslint-disable-next-line
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

  const renderResumePreview = (content, customization, label, version, template) => {
    const isCurrentVersion = version === 'current';

    // Use template from API or fallback to complete default template
    const templateConfig = template || DEFAULT_TEMPLATE;

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
        <div className="resume-preview-wrapper">
          <ResumePreview
            cvData={content}
            customization={customization}
            template={templateConfig}
            editable={false}
          />
        </div>
      </div>
    );
  };

  const renderSummaryComparison = () => {
    if (!comparisonData) return null;

    const { version1, version2, template } = comparisonData;
    const v1Personal = version1.content?.personal || {};
    const v2Personal = version2.content?.personal || {};

    // Get photo style from template or customization
    const templateConfig = template || DEFAULT_TEMPLATE;
    const photoStyle = version1.customization?.photoStyle ||
                       templateConfig.photoConfig?.style ||
                       'circle';

    // Dynamic border-radius based on photo style (width/height in CSS for responsive)
    const getBorderRadius = () => {
      switch (photoStyle) {
        case 'circle':
          return '50%';
        case 'rounded':
          return '12px';
        case 'square':
          return '0';
        default:
          return '50%';
      }
    };

    const isDifferent = (field) => {
      return v1Personal[field] !== v2Personal[field];
    };

    return (
      <div className="summary-comparison">
        <h3>Quick Comparison Summary</h3>
        <div className="summary-grid">
          {/* Version 1 Column */}
          <div className="summary-column">
            <div className="summary-version-label">
              Version {version1.version}
            </div>

            {v1Personal.photo && (
              <div className="summary-avatar" style={{ borderRadius: getBorderRadius() }}>
                <img src={v1Personal.photo} alt={v1Personal.fullName || 'Avatar'} />
              </div>
            )}

            <div className="summary-info">
              <div className={`summary-field ${isDifferent('fullName') ? 'different' : ''}`}>
                <strong>Name:</strong> {v1Personal.fullName || 'N/A'}
              </div>
              <div className={`summary-field ${isDifferent('email') ? 'different' : ''}`}>
                <strong>Email:</strong> {v1Personal.email || 'N/A'}
              </div>
              <div className={`summary-field ${isDifferent('phone') ? 'different' : ''}`}>
                <strong>Phone:</strong> {v1Personal.phone || 'N/A'}
              </div>
              <div className={`summary-field ${isDifferent('location') ? 'different' : ''}`}>
                <strong>Location:</strong> {v1Personal.location || 'N/A'}
              </div>
            </div>
          </div>

          <div className="summary-divider">
            <div className="vs-badge">VS</div>
          </div>

          {/* Version 2 Column */}
          <div className="summary-column">
            <div className="summary-version-label">
              {version2.version === 'current' ? 'Current Version' : `Version ${version2.version}`}
            </div>

            {v2Personal.photo && (
              <div className="summary-avatar" style={{ borderRadius: getBorderRadius() }}>
                <img src={v2Personal.photo} alt={v2Personal.fullName || 'Avatar'} />
              </div>
            )}

            <div className="summary-info">
              <div className={`summary-field ${isDifferent('fullName') ? 'different' : ''}`}>
                <strong>Name:</strong> {v2Personal.fullName || 'N/A'}
              </div>
              <div className={`summary-field ${isDifferent('email') ? 'different' : ''}`}>
                <strong>Email:</strong> {v2Personal.email || 'N/A'}
              </div>
              <div className={`summary-field ${isDifferent('phone') ? 'different' : ''}`}>
                <strong>Phone:</strong> {v2Personal.phone || 'N/A'}
              </div>
              <div className={`summary-field ${isDifferent('location') ? 'different' : ''}`}>
                <strong>Location:</strong> {v2Personal.location || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContentComparison = () => {
    if (!comparisonData) return null;

    const { version1, version2, template } = comparisonData;

    return (
      <div className="comparison-grid">
        {renderResumePreview(
          version1.content,
          version1.customization,
          `Version ${version1.version} - ${new Date(version1.createdAt).toLocaleDateString()}`,
          version1.version,
          template
        )}
        {renderResumePreview(
          version2.content,
          version2.customization,
          version2.version === 'current'
            ? 'Current Version'
            : `Version ${version2.version} - ${new Date(version2.createdAt).toLocaleDateString()}`,
          version2.version,
          template
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

        {comparisonData && renderSummaryComparison()}
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
