import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CompareVersions.css';
import { API_ENDPOINTS, apiRequest } from './config/api';
import ResumePreview from './components/ResumePreview';

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

  const renderResumePreview = (content, customization, label, version) => {
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
        <div className="resume-preview-wrapper">
          <ResumePreview
            cvData={content}
            customization={customization}
            template={{
              name: 'Classic',
              color: '#3B82F6',
              gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
            editable={false}
          />
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
