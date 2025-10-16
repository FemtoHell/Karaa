import React from 'react';
import { Link } from 'react-router-dom';
import './Testimonials.css';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';

const Testimonials = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const testimonials = [
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

  const stats = [
    { number: '50K+', label: t('resumesCreated') },
    { number: '35K+', label: t('usersHired') },
    { number: '4.9/5', label: t('averageRating') },
    { number: '95%', label: t('successRate') }
  ];

  return (
    <div className="testimonials-page">
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
              <Link to="/" className="nav-link">{t('home') || 'Home'}</Link>
              <Link to="/features" className="nav-link">{t('features')}</Link>
              <Link to="/testimonials" className="nav-link active">{t('testimonials')}</Link>
              <Link to="/templates" className="nav-link">{t('templates')}</Link>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              {isAuthenticated && <Link to="/help" className="nav-link">{t('help') || 'Help'}</Link>}
            </nav>

            <div className="header-actions">
              <LanguageSwitcher />
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary">{t('dashboard')}</Link>
              ) : (
                <Link to="/templates" className="btn-primary">{t('getStarted')}</Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="testimonials-hero">
        <div className="testimonials-hero-container">
          <h1 className="testimonials-hero-title">{t('successStories')}</h1>
          <p className="testimonials-hero-subtitle">
            {t('successStoriesSubtitle')}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
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

      {/* Testimonials Grid */}
      <section className="testimonials-grid-section">
        <div className="testimonials-container">
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
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

      {/* Video Testimonials */}
      <section className="video-testimonials-section">
        <div className="video-testimonials-container">
          <h2 className="section-title">{t('hearFromUsers')}</h2>
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
          <h2 className="cta-title">{t('readyToWriteStory')}</h2>
          <p className="cta-subtitle">{t('joinProfessionals')}</p>
          <div className="cta-actions">
            <Link to="/templates" className="btn-cta-primary">{t('createResumeNow')}</Link>
            <Link to="/features" className="btn-cta-secondary">{t('features') || 'View Features'}</Link>
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
                <li><Link to="/testimonials">{t('testimonials')}</Link></li>
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

export default Testimonials;
