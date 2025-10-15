import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from './config/api';
import './Guides.css';

const Guides = () => {
  const [industries, setIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [guideContent, setGuideContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all industries on mount
  useEffect(() => {
    fetchIndustries();
  }, []);

  const fetchIndustries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_ENDPOINTS.GUIDES}/industries`);
      const data = await response.json();

      if (data.success) {
        setIndustries(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch industries');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuideContent = async (industry) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_ENDPOINTS.GUIDES}/industry/${industry}`);
      const data = await response.json();

      if (data.success) {
        setGuideContent(data.data);
        setSelectedIndustry(industry);
      } else {
        throw new Error(data.message || 'Failed to fetch guide content');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleIndustryClick = (industryId) => {
    fetchGuideContent(industryId);
  };

  const handleBackToList = () => {
    setSelectedIndustry(null);
    setGuideContent(null);
  };

  if (loading && industries.length === 0) {
    return (
      <div className="guides-container">
        <div className="loading">Loading guides...</div>
      </div>
    );
  }

  if (error && industries.length === 0) {
    return (
      <div className="guides-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="guides-container">
      <header className="guides-header">
        <div className="header-content">
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
          <h1>CV Writing Guides</h1>
          <p className="subtitle">Industry-specific tips and best practices for your resume</p>
        </div>
      </header>

      <div className="guides-content">
        {!selectedIndustry ? (
          <div className="industries-grid">
            <h2>Choose Your Industry</h2>
            <div className="industries-list">
              {industries.map((industry) => (
                <div
                  key={industry.id}
                  className="industry-card"
                  onClick={() => handleIndustryClick(industry.id)}
                >
                  <div className="industry-icon">{industry.icon}</div>
                  <h3>{industry.title}</h3>
                  <div className="industry-keywords">
                    {industry.keywords?.slice(0, 3).map((keyword, idx) => (
                      <span key={idx} className="keyword-tag">{keyword}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="guide-detail">
            <button className="back-button" onClick={handleBackToList}>
              ← Back to Industries
            </button>

            {loading ? (
              <div className="loading">Loading guide content...</div>
            ) : guideContent ? (
              <>
                <div className="guide-header">
                  <h2>{guideContent.icon} {guideContent.title}</h2>
                </div>

                {/* Tips Section */}
                <section className="guide-section">
                  <h3>Key Tips</h3>
                  <ul className="tips-list">
                    {guideContent.tips?.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </section>

                {/* Examples Section */}
                {guideContent.examples && (
                  <section className="guide-section">
                    <h3>Examples</h3>
                    <div className="examples-grid">
                      <div className="example-box good">
                        <h4>✓ Good Example</h4>
                        <p>{guideContent.examples.good}</p>
                      </div>
                      <div className="example-box bad">
                        <h4>✗ Bad Example</h4>
                        <p>{guideContent.examples.bad}</p>
                      </div>
                    </div>
                  </section>
                )}

                {/* Keywords Section */}
                {guideContent.keywords && guideContent.keywords.length > 0 && (
                  <section className="guide-section">
                    <h3>Important Keywords</h3>
                    <div className="keywords-container">
                      {guideContent.keywords.map((keyword, idx) => (
                        <span key={idx} className="keyword-badge">{keyword}</span>
                      ))}
                    </div>
                  </section>
                )}

                {/* Action Verbs Section */}
                {guideContent.actionVerbs && (
                  <section className="guide-section">
                    <h3>Action Verbs to Use</h3>
                    <div className="action-verbs-grid">
                      {Object.entries(guideContent.actionVerbs).map(([category, verbs]) => (
                        <div key={category} className="verb-category">
                          <h4>{category}</h4>
                          <div className="verbs-list">
                            {verbs.map((verb, idx) => (
                              <span key={idx} className="verb-tag">{verb}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* General Tips Section */}
                {guideContent.generalTips && (
                  <section className="guide-section">
                    <h3>General Tips (For All Industries)</h3>
                    <ul className="tips-list">
                      {guideContent.generalTips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </>
            ) : (
              <div className="error">Failed to load guide content</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Guides;
