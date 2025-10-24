import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HelpPage.css';
import { useLanguage } from './LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const HelpPage = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('notifications');

  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Resume Downloaded Successfully',
      message: 'Your resume "Software Engineer Resume" has been downloaded as PDF',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'New Template Available',
      message: 'Check out our new "Modern Creative" template designed for designers',
      time: '2 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'warning',
      title: 'Resume Needs Update',
      message: 'Your resume "Marketing Manager CV" hasn\'t been updated in 30 days',
      time: '1 day ago',
      read: true
    },
    {
      id: 4,
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile information has been successfully updated',
      time: '2 days ago',
      read: true
    },
    {
      id: 5,
      type: 'info',
      title: 'Subscription Renewed',
      message: 'Your Pro subscription has been renewed for another month',
      time: '5 days ago',
      read: true
    }
  ];

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I create my first resume?',
          a: 'Click on "Create New Resume" from your dashboard, choose a template, and start filling in your information. Our editor provides real-time preview as you type.'
        },
        {
          q: 'Can I use ResumeBuilder for free?',
          a: 'Yes! We offer a free plan that includes access to 3 professional templates and basic customization options.'
        }
      ]
    },
    {
      category: 'Resume Editing',
      questions: [
        {
          q: 'How do I customize my resume design?',
          a: 'Use the customization panel in the editor to change colors, fonts, spacing, and section order. All changes are reflected in real-time.'
        },
        {
          q: 'Can I save multiple versions of my resume?',
          a: 'Absolutely! You can create and save unlimited resume versions, tailored for different job applications.'
        }
      ]
    },
    {
      category: 'Export & Download',
      questions: [
        {
          q: 'What export formats are available?',
          a: 'You can export your resume as PDF (recommended for applications) or DOCX (for further editing).'
        },
        {
          q: 'Is my exported resume ATS-friendly?',
          a: 'Yes! All our templates are designed to be ATS-compatible, ensuring your resume passes applicant tracking systems.'
        }
      ]
    },
    {
      category: 'Account & Billing',
      questions: [
        {
          q: 'How do I upgrade my plan?',
          a: 'Go to Settings > Subscription and click "Upgrade Plan". Choose your preferred plan and complete the payment process.'
        },
        {
          q: 'Can I cancel my subscription anytime?',
          a: 'Yes, you can cancel anytime from your account settings. You\'ll retain access until the end of your billing period.'
        }
      ]
    }
  ];

  return (
    <div className="help-page">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-container">
          <div className="dashboard-header-content">
            <Link to="/" className="logo-wrapper">
              <img src="/images/resumebuilder-logo.webp" alt="ResumeBuilder Logo" className="logo-image" />
              <span className="logo-text">ResumeBuilder</span>
            </Link>

            <nav className="nav-menu">
              <Link to="/" className="nav-link">{t('Home') || 'Home'}</Link>
              <Link to="/templates" className="nav-link">{t('templates')}</Link>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            </nav>

            <div className="header-user">
              <LanguageSwitcher />
              <Link to="/dashboard" className="btn-back">
                ← {t('backToDashboard')}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="help-main">
        <div className="help-container">
          <div className="help-header">
            <h1>Help & Notifications</h1>
            <p>Find answers to common questions and manage your notifications</p>
          </div>

          {/* Tabs */}
          <div className="help-tabs">
            <button
              className={`help-tab ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C6.686 2 4 4.686 4 8v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8c0-3.314-2.686-6-6-6zm0 16a3 3 0 01-3-3h6a3 3 0 01-3 3z" fill="currentColor"/>
              </svg>
              Notifications
            </button>
            <button
              className={`help-tab ${activeTab === 'faq' ? 'active' : ''}`}
              onClick={() => setActiveTab('faq')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C11.45 10.9 11 11.5 11 13H9v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H6c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" fill="currentColor"/>
              </svg>
              FAQ
            </button>
            <button
              className={`help-tab ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" fill="currentColor"/>
              </svg>
              Contact Support
            </button>
          </div>

          {/* Tab Content */}
          <div className="help-content">
            {activeTab === 'notifications' && (
              <div className="notifications-section">
                <div className="notifications-header">
                  <h2>All Notifications</h2>
                  <button className="btn-mark-read">Mark all as read</button>
                </div>

                <div className="notifications-list">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`notification-item ${notif.read ? 'read' : 'unread'}`}>
                      <div className={`notification-icon ${notif.type}`}>
                        {notif.type === 'success' && (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M7 10l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        )}
                        {notif.type === 'info' && (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 9v4m0-7h.01M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        )}
                        {notif.type === 'warning' && (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L11.732 4c-.77-1.333-2.694-1.333-3.464 0L1.34 16c-.77 1.333.192 3 1.732 3z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        )}
                      </div>
                      <div className="notification-content">
                        <h4>{notif.title}</h4>
                        <p>{notif.message}</p>
                        <span className="notification-time">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="faq-section">
                <div className="faq-search">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M8.5 3a5.5 5.5 0 014.38 8.88l4.62 4.62a1 1 0 01-1.42 1.42l-4.62-4.62A5.5 5.5 0 118.5 3zm0 2a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" fill="#9CA3AF"/>
                  </svg>
                  <input type="text" placeholder="Search for help..." />
                </div>

                {faqs.map((category, idx) => (
                  <div key={idx} className="faq-category">
                    <h3 className="faq-category-title">{category.category}</h3>
                    <div className="faq-questions">
                      {category.questions.map((item, i) => (
                        <div key={i} className="faq-item">
                          <h4 className="faq-question">{item.q}</h4>
                          <p className="faq-answer">{item.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="contact-section">
                <div className="contact-methods">
                  <div className="contact-method">
                    <div className="contact-icon">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M4 6h24v20H4V6zm0 2v2l12 8 12-8V8L16 16 4 8z" fill="#4F46E5"/>
                      </svg>
                    </div>
                    <h3>Email Support</h3>
                    <p>Get help via email within 24 hours</p>
                    <a href="mailto:support@resumebuilder.com" className="btn-contact">support@resumebuilder.com</a>
                  </div>

                  <div className="contact-method">
                    <div className="contact-icon">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M6 8a2 2 0 012-2h4.586a2 2 0 011.414.586l2.828 2.828a2 2 0 010 2.828l-2.828 2.828a22 22 0 009.172 9.172l2.828-2.828a2 2 0 012.828 0l2.828 2.828a2 2 0 01.586 1.414V28a2 2 0 01-2 2h-4C11.82 30 4 22.18 4 10V8h2z" fill="#10B981"/>
                      </svg>
                    </div>
                    <h3>Live Chat</h3>
                    <p>Chat with our support team in real-time</p>
                    <button className="btn-contact">Start Chat</button>
                  </div>

                  <div className="contact-method">
                    <div className="contact-icon">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4zm0 22c-5.523 0-10-4.477-10-10S10.477 6 16 6s10 4.477 10 10-4.477 10-10 10zm1-17h-2v8l7 4.2.9-1.5-6-3.5V9z" fill="#F59E0B"/>
                      </svg>
                    </div>
                    <h3>Help Center</h3>
                    <p>Browse our comprehensive knowledge base</p>
                    <Link to="/faq" className="btn-contact">Visit Help Center</Link>
                  </div>
                </div>

                <div className="contact-form-section">
                  <h3>Send us a message</h3>
                  <form className="contact-form">
                    <div className="form-group">
                      <label>Name</label>
                      <input type="text" placeholder="Your name" />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" placeholder="your.email@example.com" />
                    </div>
                    <div className="form-group">
                      <label>Subject</label>
                      <input type="text" placeholder="How can we help?" />
                    </div>
                    <div className="form-group">
                      <label>Message</label>
                      <textarea rows="5" placeholder="Describe your issue or question..."></textarea>
                    </div>
                    <button type="submit" className="btn-submit-contact">Send Message</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

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

export default HelpPage;
