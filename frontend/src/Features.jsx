import React from 'react';
import { Link } from 'react-router-dom';
import './Features.css';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';

const Features = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const features = [
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M18 24h12m-12 8h12m4 10H14a4 4 0 01-4-4V10a4 4 0 014-4h11.172a2 2 0 011.414.586l10.828 10.828a2 2 0 01.586 1.414V38a4 4 0 01-4 4z" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Professional Templates',
      description: 'Choose from 50+ professionally designed resume templates tailored for different industries and career levels.',
      benefits: ['ATS-friendly designs', 'Industry-specific layouts', 'Modern & clean aesthetics', 'Customizable sections']
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M24 12V8m0 8a4 4 0 100 8m0-8a4 4 0 110 8m-12 16a4 4 0 100-8m0 8a4 4 0 110-8m0 8v4m0-12V8m12 12v20m12-4a4 4 0 100-8m0 8a4 4 0 110-8m0 8v4m0-12V8" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Easy Customization',
      description: 'Customize every aspect of your resume with our intuitive drag-and-drop editor. No design skills required.',
      benefits: ['Real-time preview', 'Font & color control', 'Section reordering', 'Smart formatting']
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M24 20v12m0 0l-6-6m6 6l6-6m4 16H14a4 4 0 01-4-4V10a4 4 0 014-4h11.172a2 2 0 011.414.586l10.828 10.828a2 2 0 01.586 1.414V38a4 4 0 01-4 4z" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Multiple Export Options',
      description: 'Download your resume in PDF, DOCX, or TXT format. Print-ready and optimized for online applications.',
      benefits: ['High-quality PDF export', 'Editable DOCX format', 'Cloud storage integration', 'One-click sharing']
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M8 24h32M8 12h32M8 36h20" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Content Suggestions',
      description: 'Get AI-powered suggestions for bullet points, action verbs, and professional summaries tailored to your role.',
      benefits: ['Pre-written examples', 'Industry keywords', 'Achievement templates', 'Grammar checking']
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M24 8v8m-8-4h16M8 24h32m-8 8v8m-16-4h16" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Multi-Language Support',
      description: 'Create resumes in multiple languages with proper formatting and cultural considerations.',
      benefits: ['20+ languages supported', 'RTL text support', 'Localized templates', 'Character encoding']
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M18 34v-8m6 8v-12m6 12V22m6 12V18M8 42h32a2 2 0 002-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v32a2 2 0 002 2z" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Analytics & Tracking',
      description: 'Track resume views, downloads, and engagement when you share your resume online.',
      benefits: ['View statistics', 'Engagement metrics', 'Download tracking', 'Performance insights']
    }
  ];

  return (
    <div className="features-page">
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
              <Link to="/features" className="nav-link active">Features</Link>
              <Link to="/pricing" className="nav-link">Pricing</Link>
              <Link to="/templates" className="nav-link">Templates</Link>
              <Link to="/testimonials" className="nav-link">Testimonials</Link>
              {isAuthenticated ? (
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              ) : (
                <Link to="/login" className="nav-link">Login</Link>
              )}
            </nav>

            <div className="header-actions">
              <LanguageSwitcher />
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary">Dashboard</Link>
              ) : (
                <Link to="/templates" className="btn-primary">Get Started</Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">Powerful Features to Build Your Perfect Resume</h1>
          <p className="hero-subtitle">
            Everything you need to create a professional resume that stands out from the competition
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-grid-section">
        <div className="features-container">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon-wrapper">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <ul className="feature-benefits">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="#10B981"/>
                      </svg>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="additional-features-section">
        <div className="additional-features-container">
          <h2 className="section-title">And Much More...</h2>
          <div className="additional-features-grid">
            <div className="additional-feature">
              <div className="additional-feature-icon">✨</div>
              <h4>Auto-Save</h4>
              <p>Never lose your work with automatic cloud saving</p>
            </div>
            <div className="additional-feature">
              <div className="additional-feature-icon">🔒</div>
              <h4>Privacy Protected</h4>
              <p>Your data is encrypted and never shared</p>
            </div>
            <div className="additional-feature">
              <div className="additional-feature-icon">📱</div>
              <h4>Mobile Friendly</h4>
              <p>Edit your resume on any device, anywhere</p>
            </div>
            <div className="additional-feature">
              <div className="additional-feature-icon">⚡</div>
              <h4>Lightning Fast</h4>
              <p>Optimized for speed and performance</p>
            </div>
            <div className="additional-feature">
              <div className="additional-feature-icon">🎨</div>
              <h4>Custom Branding</h4>
              <p>Add your personal touch with custom colors</p>
            </div>
            <div className="additional-feature">
              <div className="additional-feature-icon">🔄</div>
              <h4>Version History</h4>
              <p>Access previous versions of your resume</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Create Your Professional Resume?</h2>
          <p className="cta-subtitle">Join thousands of job seekers who landed their dream jobs</p>
          <div className="cta-actions">
            <Link to="/templates" className="btn-cta-primary">Start Building Now</Link>
            <Link to="/pricing" className="btn-cta-secondary">View Pricing</Link>
          </div>
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
    </div>
  );
};

export default Features;
