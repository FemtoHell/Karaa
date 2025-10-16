import React, { useState, useMemo, useEffect } from 'react';
import './Templates.css';
import { Link, useNavigate } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import { API_ENDPOINTS, apiRequest } from './config/api';

const Templates = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isGuest } = useAuth();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showGuestLimitModal, setShowGuestLimitModal] = useState(false);
  const [allTemplates, setAllTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await apiRequest(API_ENDPOINTS.TEMPLATES);
        if (response.success) {
          setAllTemplates(response.data);
        }
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleTemplateClick = (templateId, action) => {
    // Allow preview for everyone
    if (action === 'preview') {
      navigate(`/preview?template=${templateId}`);
      return;
    }

    // Check authentication for using templates
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    // Guest users can't use full features
    if (isGuest) {
      setShowGuestLimitModal(true);
      return;
    }

    // Navigate to editor for authenticated users
    navigate(`/editor?template=${templateId}&action=${action}`);
  };

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let templates = allTemplates;

    // Apply category filter
    if (selectedCategory !== 'all') {
      templates = templates.filter(template => template.category === selectedCategory);
    }

    // Apply color filter
    if (selectedColor !== 'all') {
      templates = templates.filter(template => template.color === selectedColor);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      templates = templates.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'popular':
        templates.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'newest':
        templates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'name':
        templates.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return templates;
  }, [allTemplates, selectedCategory, selectedColor, searchQuery, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedColor('all');
    setSearchQuery('');
    setSortBy('popular');
  };

  return (
    <div className="templates-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-container">
          <div className="header-content">
            <Link to="/" className="logo-wrapper">
              <div className="logo-icon">
                <svg width="11" height="14" viewBox="0 0 11 14" fill="none">
                  <path d="M0 0H11V14L5.5 11L0 14V0Z" fill="#FFFFFF"/>
                </svg>
              </div>
              <span className="logo-text">ResumeBuilder</span>
            </Link>

            <nav className="nav-menu">
              <Link to="/" className="nav-link">{t('Home') || 'Home'}</Link>
              <Link to="/features" className="nav-link">{t('features')}</Link>
              <Link to="/testimonials" className="nav-link">{t('testimonials')}</Link>
              <Link to="/templates" className="nav-link active">{t('templates')}</Link>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              {isAuthenticated && <Link to="/help" className="nav-link">{t('Help') || 'Help'}</Link>}
            </nav>

            <div className="header-actions">
              <LanguageSwitcher />
              {isGuest ? (
                <>
                  <span style={{ color: '#F59E0B', marginRight: '12px', fontSize: '14px' }}>Guest Mode</span>
                  <Link to="/login" className="btn-primary">{t('signIn')}</Link>
                </>
              ) : isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary">{t('dashboard')}</Link>
              ) : (
                <Link to="/login" className="btn-primary">{t('signIn')}</Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="templates-hero">
        <div className="templates-hero-container">
          <h1 className="templates-hero-title">{t('chooseYourTemplate')}</h1>
          <p className="templates-hero-subtitle">{t('templatesSubtitle')}</p>
        </div>
      </section>

      {/* Filters */}
      <div className="templates-hero-container">
        <div className="templates-filters">
          <div className="search-wrapper">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M9 17A8 8 0 109 1a8 8 0 000 16zM19 19l-4.35-4.35" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder={t('searchTemplates')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="search-clear">×</button>
            )}
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">{t('allCategories')}</option>
            <option value="modern">{t('modern')}</option>
            <option value="professional">{t('professional')}</option>
            <option value="creative">{t('creative')}</option>
            <option value="minimalist">{t('minimalist')}</option>
          </select>

          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="filter-select"
          >
            <option value="all">{t('allColors')}</option>
            <option value="blue">{t('blue')}</option>
            <option value="green">{t('green')}</option>
            <option value="purple">{t('purple')}</option>
            <option value="orange">{t('orange')}</option>
            <option value="red">{t('red')}</option>
            <option value="gray">{t('gray')}</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="popular">{t('mostPopular')}</option>
            <option value="newest">{t('newest')}</option>
            <option value="name">{t('nameAZ')}</option>
          </select>

          {(selectedCategory !== 'all' || selectedColor !== 'all' || searchQuery) && (
            <button onClick={clearFilters} className="btn-clear-filters">
              {t('clearFilters')}
            </button>
          )}
        </div>

        {searchQuery && (
          <div className="templates-results">
            <p className="results-count">
              {filteredTemplates.length} results for "<span className="search-term">{searchQuery}</span>"
            </p>
          </div>
        )}
      </div>

      {/* Templates Grid */}
      <section className="templates-section">
        <div className="templates-section-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading templates...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>Error loading templates: {error}</p>
              <button onClick={() => window.location.reload()} className="btn-primary">
                Retry
              </button>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="empty-state">
              <p>No templates found</p>
              <button onClick={clearFilters} className="btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="templates-grid">
              {filteredTemplates.map(template => (
                <div key={template._id} className="template-card">
                  <div className="template-image-wrapper" style={{ background: template.gradient }}>
                    <img src={template.image} alt={template.name} />
                    <div className="template-overlay">
                      <button
                        onClick={() => handleTemplateClick(template._id, 'preview')}
                        className="btn-preview"
                      >
                        {t('preview')}
                      </button>
                      <button
                        onClick={() => handleTemplateClick(template._id, 'use')}
                        className="btn-use-template"
                      >
                        {t('useTemplate')}
                      </button>
                    </div>
                  </div>
                  <div className="template-info">
                    <div className="template-header">
                      <h3 className="template-name">{template.name}</h3>
                      <span className={`template-category category-${template.category}`}>{template.category}</span>
                    </div>
                    <p className="template-description">{template.description}</p>
                    <div className="template-tags">
                      {template.tags && template.tags.map((tag, idx) => (
                        <span key={idx} className="template-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Auth Required Modal */}
      {showAuthModal && (
        <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAuthModal(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <div className="auth-modal-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="#EEF2FF"/>
                <path d="M24 16v8m0 4h.01M24 40c8.837 0 16-7.163 16-16S32.837 8 24 8 8 15.163 8 24s7.163 16 16 16z" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>{t('loginRequired')}</h3>
            <p>{t('loginRequiredMessage')}</p>
            <div className="auth-modal-actions">
              <Link to="/login" className="btn-modal-login">{t('signIn')}</Link>
              <Link to="/login" className="btn-modal-register">{t('createAccount')}</Link>
            </div>
          </div>
        </div>
      )}

      {/* Guest Limitation Modal */}
      {showGuestLimitModal && (
        <div className="auth-modal-overlay" onClick={() => setShowGuestLimitModal(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowGuestLimitModal(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <div className="auth-modal-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="#FEF3C7"/>
                <path d="M24 16v8m0 4h.01M24 40c8.837 0 16-7.163 16-16S32.837 8 24 8 8 15.163 8 24s7.163 16 16 16z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Guest Mode Limitation</h3>
            <p>You are currently in guest mode. To use templates and create resumes, please create a free account or sign in.</p>
            <div className="auth-modal-actions">
              <Link to="/login" className="btn-modal-login">{t('signIn')}</Link>
              <Link to="/login" className="btn-modal-register">{t('createAccount')}</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;
