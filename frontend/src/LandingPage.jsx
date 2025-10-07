import React from 'react';
import './LandingPage.css';
import { Link } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from './components/Logo';

const LandingPage = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [showDemoModal, setShowDemoModal] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState('modern');

  // Template data for each category with working resume preview images
  const templateData = {
    modern: [
      { name: 'Modern Minimalist', desc: 'Clean and sleek design for tech professionals', image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=600&fit=crop&q=80' },
      { name: 'Contemporary Pro', desc: 'Modern layout with bold typography', image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=600&fit=crop&q=80' },
      { name: 'Urban Style', desc: 'Stylish design for creative industries', image: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=400&h=600&fit=crop&q=80' },
      { name: 'Tech Forward', desc: 'Perfect for startups and tech roles', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=600&fit=crop&q=80' }
    ],
    professional: [
      { name: 'Executive Elite', desc: 'Premium design for senior positions', image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=600&fit=crop&q=80' },
      { name: 'Corporate Classic', desc: 'Traditional layout for finance and law', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=600&fit=crop&q=80' },
      { name: 'Business Pro', desc: 'Clean professional for all industries', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=600&fit=crop&q=80' },
      { name: 'Management Plus', desc: 'Ideal for management roles', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=600&fit=crop&q=80' }
    ],
    creative: [
      { name: 'Artistic Flair', desc: 'Bold design for creative professionals', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=600&fit=crop&q=80' },
      { name: 'Designer Pro', desc: 'Showcase your creative portfolio', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=600&fit=crop&q=80' },
      { name: 'Creative Edge', desc: 'Stand out with unique layouts', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=600&fit=crop&q=80' },
      { name: 'Innovative Style', desc: 'Perfect for design and media roles', image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=600&fit=crop&q=80' }
    ]
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
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
              <Link to="/features" className="nav-link">{t('features')}</Link>
              <Link to="/pricing" className="nav-link">{t('pricing')}</Link>
              <Link to="/templates" className="nav-link">{t('templates')}</Link>
              <Link to="/testimonials" className="nav-link">{t('testimonials')}</Link>
              {isAuthenticated ? (
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              ) : (
                <Link to="/login" className="nav-link">{t('login')}</Link>
              )}
            </nav>

            <div className="header-actions">
              <LanguageSwitcher />
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary">Dashboard</Link>
              ) : (
                <Link to="/create" className="btn-primary">{t('createCVNow')}</Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              {t('heroTitle').split('\\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i === 0 && <br />}
                </React.Fragment>
              ))}
            </h1>
            <p className="hero-subtitle">
              {t('heroSubtitle')}
            </p>
            <div className="hero-actions">
              <Link to="/templates" className="btn-hero-primary">{t('getStartedFree')}</Link>
              <button className="btn-hero-secondary" onClick={() => setShowDemoModal(true)}>{t('watchDemo')}</button>
            </div>
            <div className="hero-features">
              <div className="feature-item">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="#10B981"/>
                </svg>
                <span>{t('noCreditCard')}</span>
              </div>
              <div className="feature-item">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="#10B981"/>
                </svg>
                <span>{t('freeTemplates')}</span>
              </div>
              <div className="feature-item">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="#10B981"/>
                </svg>
                <span>{t('downloadPDF')}</span>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <div className="hero-image-wrapper">
              <div className="resume-preview">
                <Logo size="xlarge" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title">{t('whyChoose')}</h2>
          <p className="section-subtitle">
            {t('whyChooseSubtitle')}
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="feature-title">{t('modernTemplates')}</h3>
              <p className="feature-description">
                {t('modernTemplatesDesc')}
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="feature-title">{t('easyCustomization')}</h3>
              <p className="feature-description">
                {t('easyCustomizationDesc')}
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="feature-title">{t('oneClickExport')}</h3>
              <p className="feature-description">
                {t('oneClickExportDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Preview Section */}
      <section className="templates-preview-section">
        <div className="templates-container">
          <h2 className="section-title">{t('chooseTemplate')}</h2>
          <p className="section-subtitle">
            {t('chooseTemplateSubtitle')}
          </p>

          <div className="templates-categories">
            <div
              className={`category-item ${activeCategory === 'modern' ? 'active' : ''}`}
              onClick={() => setActiveCategory('modern')}
            >
              {t('modernTemplatesCategory')}
            </div>
            <div
              className={`category-item ${activeCategory === 'professional' ? 'active' : ''}`}
              onClick={() => setActiveCategory('professional')}
            >
              {t('professionalTemplates')}
            </div>
            <div
              className={`category-item ${activeCategory === 'creative' ? 'active' : ''}`}
              onClick={() => setActiveCategory('creative')}
            >
              {t('creativeTemplates')}
            </div>
          </div>

          <div className="templates-grid">
            {templateData[activeCategory].map((template, index) => (
              <div key={index} className="template-card">
                <div className="template-preview">
                  <img src={template.image} alt={template.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div className="template-overlay">
                    <Link to={`/preview?template=${index + 1}`} className="btn-preview">{t('preview')}</Link>
                    <Link to="/templates" className="btn-use-template">{t('useTemplateBtn')}</Link>
                  </div>
                </div>
                <div className="template-info">
                  <h3 className="template-name">{template.name}</h3>
                  <p className="template-desc">{template.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="templates-actions">
            <Link to="/templates" className="btn-secondary">{t('browseAllTemplates')}</Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <h2 className="section-title">{t('whatUsersSay')}</h2>
          <p className="section-subtitle">
            {t('whatUsersSaySubtitle')}
          </p>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-rating">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="#F59E0B">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <p className="testimonial-text">
                {t('testimonial1')}
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img src="https://i.pravatar.cc/100?img=5" alt="Sarah Johnson" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                </div>
                <div>
                  <div className="author-name">Sarah Johnson</div>
                  <div className="author-role">{t('softwareEngineer')}</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-rating">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="#F59E0B">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <p className="testimonial-text">
                {t('testimonial2')}
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img src="https://i.pravatar.cc/100?img=12" alt="Michael Chen" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                </div>
                <div>
                  <div className="author-name">Michael Chen</div>
                  <div className="author-role">{t('marketingManager')}</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-rating">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="#F59E0B">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <p className="testimonial-text">
                {t('testimonial3')}
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img src="https://i.pravatar.cc/100?img=9" alt="Emily Rodriguez" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                </div>
                <div>
                  <div className="author-name">Emily Rodriguez</div>
                  <div className="author-role">{t('uxDesigner')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">{t('readyForJob')}</h2>
          <p className="cta-subtitle">
            {t('readyForJobSubtitle')}
          </p>
          <Link to="/templates" className="btn-cta">{t('createResumeNow')}</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-column">
              <h3 className="footer-heading">{t('product')}</h3>
              <ul className="footer-list">
                <li><Link to="/templates">{t('templates')}</Link></li>
                <li><Link to="/features">{t('features')}</Link></li>
                <li><Link to="/pricing">{t('pricing')}</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">{t('support')}</h3>
              <ul className="footer-list">
                <li><Link to="/help">{t('helpCenter')}</Link></li>
                <li><Link to="/contact">{t('contact')}</Link></li>
                <li><Link to="/faq">{t('faq')}</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">{t('company')}</h3>
              <ul className="footer-list">
                <li><Link to="/about">{t('about')}</Link></li>
                <li><Link to="/privacy">{t('privacy')}</Link></li>
                <li><Link to="/terms">{t('terms')}</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">© 2024 ResumeBuilder. {t('allRightsReserved')}</p>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      {showDemoModal && (
        <div className="demo-modal-overlay" onClick={() => setShowDemoModal(false)}>
          <div className="demo-modal" onClick={(e) => e.stopPropagation()}>
            <button className="demo-modal-close" onClick={() => setShowDemoModal(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 18L18 6M6 6l12 12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <div className="demo-video-container">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/Tt08KmFfIYQ"
                title="Resume Builder Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="demo-modal-footer">
              <h3>{t('videoTestimonial3Title')}</h3>
              <p>{t('videoTestimonial3Desc')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;