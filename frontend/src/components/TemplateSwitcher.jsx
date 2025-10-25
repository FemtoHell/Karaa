import React, { useState, useEffect } from 'react';
import { templateService } from '../services/api.service';
import './TemplateSwitcher.css';

const TemplateSwitcher = ({ currentTemplateId, onTemplateChange, inline = false }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await templateService.getAll({ isActive: true });
      setTemplates(response.data || response.templates || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch templates:', err);
      setError('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template) => {
    onTemplateChange(template);
    if (!inline) {
      setIsOpen(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      modern: '#3B82F6',
      professional: '#6366F1',
      creative: '#EC4899',
      minimalist: '#10B981'
    };
    return colors[category] || '#6B7280';
  };

  const getLayoutIcon = (layoutType) => {
    const icons = {
      'single-column': '▋',
      'two-column': '▌▐',
      'two-column-equal': '▌▐',
      'timeline': '⋮',
      'modern-blocks': '▦',
      'infographic': '◈',
      'grid': '⊞'
    };
    return icons[layoutType] || '▋';
  };

  if (inline) {
    return (
      <div className="template-switcher-inline">
        {loading && <div className="template-switcher-loading">Loading templates...</div>}
        {error && <div className="template-switcher-error">{error}</div>}
        {!loading && !error && (
          <div className="template-grid-inline">
            {templates.map((template) => (
              <button
                key={template._id}
                className={`template-card-inline ${currentTemplateId === template._id ? 'active' : ''}`}
                onClick={() => handleTemplateSelect(template)}
                title={template.description}
              >
                <div
                  className="template-thumbnail"
                  style={{
                    background: template.gradient || `linear-gradient(135deg, ${template.colors?.primary || '#3B82F6'} 0%, ${template.colors?.secondary || '#1E40AF'} 100%)`
                  }}
                >
                  <span className="template-layout-icon">
                    {getLayoutIcon(template.layout?.type)}
                  </span>
                </div>
                <div className="template-info">
                  <div className="template-name">{template.name}</div>
                  <div
                    className="template-category"
                    style={{ color: getCategoryColor(template.category) }}
                  >
                    {template.category}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        className="btn-template-select"
        onClick={() => setIsOpen(!isOpen)}
        title="Change Template"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 3h12M2 8h12M2 13h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Templates
      </button>

      {isOpen && (
        <div className="template-switcher-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="template-switcher-modal" onClick={(e) => e.stopPropagation()}>
            <div className="template-switcher-header">
              <h3>Choose a Template</h3>
              <button className="btn-close-switcher" onClick={() => setIsOpen(false)}>×</button>
            </div>

            <div className="template-switcher-body">
              {loading && (
                <div className="template-switcher-loading">
                  <div className="spinner"></div>
                  <p>Loading templates...</p>
                </div>
              )}

              {error && (
                <div className="template-switcher-error">
                  <p>{error}</p>
                  <button onClick={fetchTemplates}>Retry</button>
                </div>
              )}

              {!loading && !error && (
                <div className="template-grid-modal">
                  {templates.map((template) => (
                    <button
                      key={template._id}
                      className={`template-card-modal ${currentTemplateId === template._id ? 'active' : ''}`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div
                        className="template-preview-large"
                        style={{
                          background: template.gradient || `linear-gradient(135deg, ${template.colors?.primary || '#3B82F6'} 0%, ${template.colors?.secondary || '#1E40AF'} 100%)`
                        }}
                      >
                        <span className="template-layout-icon-large">
                          {getLayoutIcon(template.layout?.type)}
                        </span>
                        {currentTemplateId === template._id && (
                          <div className="template-selected-badge">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M7 10l2 2 4-4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <circle cx="10" cy="10" r="9" stroke="#FFFFFF" strokeWidth="2"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="template-details">
                        <h4>{template.name}</h4>
                        <p className="template-description">{template.description}</p>
                        <div className="template-meta">
                          <span
                            className="template-category-badge"
                            style={{
                              backgroundColor: `${getCategoryColor(template.category)}20`,
                              color: getCategoryColor(template.category)
                            }}
                          >
                            {template.category}
                          </span>
                          <span className="template-layout-badge">
                            {template.layout?.type?.replace('-', ' ') || 'single column'}
                          </span>
                        </div>
                        <div className="template-features">
                          {template.features?.atsFriendly && (
                            <span className="feature-badge ats">ATS Friendly</span>
                          )}
                          {template.features?.hasPhoto && (
                            <span className="feature-badge">Photo</span>
                          )}
                          {template.features?.hasIcons && (
                            <span className="feature-badge">Icons</span>
                          )}
                          {template.features?.hasCharts && (
                            <span className="feature-badge">Charts</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TemplateSwitcher;
