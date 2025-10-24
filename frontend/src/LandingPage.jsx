import React from 'react';
import './LandingPage.css';
import './Features.css';
import './Testimonials.css';
import { Link } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import NotificationBell from './components/NotificationBell';

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

  // Detailed Features data from Features.jsx
  const detailedFeatures = [
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

  // Additional Features data
  const additionalFeatures = [
    { icon: '✨', title: 'Auto-Save', desc: 'Never lose your work with automatic cloud saving' },
    { icon: '🔒', title: 'Privacy Protected', desc: 'Your data is encrypted and never shared' },
    { icon: '📱', title: 'Mobile Friendly', desc: 'Edit your resume on any device, anywhere' },
    { icon: '⚡', title: 'Lightning Fast', desc: 'Optimized for speed and performance' },
    { icon: '🎨', title: 'Custom Branding', desc: 'Add your personal touch with custom colors' },
    { icon: '🔄', title: 'Version History', desc: 'Access previous versions of your resume' }
  ];

  // Detailed Testimonials data from Testimonials.jsx
  const detailedTestimonials = [
    {
      name: 'Sarah Johnson',
      role: t('softwareEngineer'),
      company: 'Google',
      image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=4F46E5&color=fff',
      rating: 5,
      text: t('testimonial1'),
      highlight: t('gotHiredAt').replace('{company}', 'Google')
    },
    {
      name: 'Michael Chen',
      role: t('marketingManager'),
      company: 'Amazon',
      image: 'https://ui-avatars.com/api/?name=Michael+Chen&background=10B981&color=fff',
      rating: 5,
      text: t('testimonial2'),
      highlight: t('jobOffersIn').replace('{count}', '3').replace('{time}', '2 weeks')
    },
    {
      name: 'Emily Rodriguez',
      role: t('uxDesigner'),
      company: 'Airbnb',
      image: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=F59E0B&color=fff',
      rating: 5,
      text: t('testimonial3'),
      highlight: t('tripledResponseRate')
    },
    {
      name: 'David Kim',
      role: t('dataScientist'),
      company: 'Meta',
      image: 'https://ui-avatars.com/api/?name=David+Kim&background=8B5CF6&color=fff',
      rating: 5,
      text: t('testimonial4'),
      highlight: t('landedJobAt').replace('{company}', 'Meta')
    },
    {
      name: 'Jessica Taylor',
      role: t('productManager'),
      company: 'Microsoft',
      image: 'https://ui-avatars.com/api/?name=Jessica+Taylor&background=EF4444&color=fff',
      rating: 5,
      text: t('testimonial5'),
      highlight: t('interviewsScheduled').replace('{count}', '10')
    },
    {
      name: 'James Wilson',
      role: t('fullStackDeveloper'),
      company: 'Spotify',
      image: 'https://ui-avatars.com/api/?name=James+Wilson&background=06B6D4&color=fff',
      rating: 5,
      text: t('testimonial6'),
      highlight: t('hiredAt').replace('{company}', 'Spotify')
    }
  ];

  // Stats data from Testimonials.jsx
  const stats = [
    { number: '50K+', label: t('resumesCreated') },
    { number: '35K+', label: t('usersHired') },
    { number: '4.9/5', label: t('averageRating') },
    { number: '95%', label: t('successRate') }
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            <Link to="/" className="logo-wrapper">
              <img src="/images/resumebuilder-logo.webp" alt="ResumeBuilder Logo" className="logo-image" />
              <span className="logo-text">ResumeBuilder</span>
            </Link>

            <nav className="nav-menu">
              <Link to="/" className="nav-link">{t('Home') || 'Home'}</Link>
              <Link to="/templates" className="nav-link">{t('templates')}</Link>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            </nav>

            <div className="header-actions">
              <LanguageSwitcher />
              <NotificationBell />
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
              Build Your Professional Resume in <span style={{ color: '#8B5CF6' }}>Minutes</span>
            </h1>
            <p className="hero-subtitle">
              Create ATS-friendly resumes with our easy-to-use builder. Choose from professional templates and land your dream job faster.
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
                <img src="/images/landingpage.png" alt="Resume Builder" style={{ width: '100%', height: 'auto', objectFit: 'contain', borderRadius: '16px' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Expanded with detailed features */}
      <section className="features-grid-section" id="features">
        <div className="features-container">
          <h2 className="section-title">Our Features</h2>
          <p className="section-subtitle" style={{ textAlign: 'center', marginBottom: '48px', color: '#6B7280' }}>
            {t('whyChooseSubtitle')}
          </p>

          <div className="features-grid">
            {detailedFeatures.map((feature, index) => (
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

      {/* Additional Features Section */}
      <section className="additional-features-section">
        <div className="additional-features-container">
          <h2 className="section-title">And Much More...</h2>
          <div className="additional-features-grid">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="additional-feature">
                <div className="additional-feature-icon">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </div>
            ))}
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

      {/* Stats Section */}
      <section className="stats-section" id="stats">
        <div className="stats-container">
          <h2 className="section-title" style={{ marginBottom: '48px' }}>Our Success Numbers</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Expanded with detailed testimonials */}
      <section className="testimonials-grid-section" id="testimonials">
        <div className="testimonials-container">
          <h2 className="section-title">What Our Users Say</h2>
          <p className="section-subtitle" style={{ textAlign: 'center', marginBottom: '48px', color: '#6B7280' }}>
            {t('whatUsersSaySubtitle')}
          </p>

          <div className="testimonials-grid">
            {detailedTestimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">
                    <img src={testimonial.image} alt={testimonial.name} />
                  </div>
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <p className="testimonial-role">{testimonial.role}</p>
                    <p className="testimonial-company">{testimonial.company}</p>
                  </div>
                </div>

                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="#F59E0B">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>

                <p className="testimonial-text">{testimonial.text}</p>

                <div className="testimonial-highlight">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.707 4.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L7 9.586l5.293-5.293a1 1 0 011.414 0z" fill="#10B981"/>
                  </svg>
                  <span>{testimonial.highlight}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials Section */}
      <section className="video-testimonials-section" id="video-testimonials">
        <div className="video-testimonials-container">
          <h2 className="section-title">Video Testimonials</h2>
          <div className="video-grid">
            <div className="video-card">
              <div className="video-thumbnail">
                <iframe
                  width="100%"
                  height="200"
                  src="https://www.youtube.com/embed/Tt08KmFfIYQ"
                  title="Resume Tips Video 1"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: '8px 8px 0 0' }}
                ></iframe>
              </div>
              <h4>{t('videoTestimonial1Title')}</h4>
              <p>{t('videoTestimonial1Desc')}</p>
            </div>

            <div className="video-card">
              <div className="video-thumbnail">
                <iframe
                  width="100%"
                  height="200"
                  src="https://www.youtube.com/embed/y8YH0Qbu5h4"
                  title="Resume Tips Video 2"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: '8px 8px 0 0' }}
                ></iframe>
              </div>
              <h4>{t('videoTestimonial2Title')}</h4>
              <p>{t('videoTestimonial2Desc')}</p>
            </div>

            <div className="video-card">
              <div className="video-thumbnail">
                <iframe
                  width="100%"
                  height="200"
                  src="https://www.youtube.com/embed/z7tr27XP1Gs"
                  title="Resume Builder Tutorial"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: '8px 8px 0 0' }}
                ></iframe>
              </div>
              <h4>{t('videoTestimonial3Title')}</h4>
              <p>{t('videoTestimonial3Desc')}</p>
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
                <li><Link to="/">{t('Home') || 'Home'}</Link></li>
                <li><Link to="/templates">{t('templates')}</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
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