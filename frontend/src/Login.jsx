import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      let result;
      if (isLogin) {
        // Login
        result = await login(email, password);
      } else {
        // Register
        const name = email.split('@')[0]; // Extract name from email
        result = await register(email, password, name);
      }

      if (result.success) {
        // Redirect to dashboard after successful login/register
        navigate('/dashboard');
      } else {
        alert(result.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      alert('An error occurred. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // Redirect to Google OAuth
    window.location.href = 'http://localhost:5000/api/v1/auth/google';
  };

  const handleLinkedInLogin = () => {
    console.log('LinkedIn login clicked');
    // Redirect to LinkedIn OAuth
    window.location.href = 'http://localhost:5000/api/v1/auth/linkedin';
  };

  const handleGuestMode = () => {
    console.log('Guest mode selected');
    // Don't login for guest mode, just redirect to templates
    navigate('/templates');
  };

  return (
    <div className="login-page">
      {/* Header - Same as LandingPage */}
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
            </nav>

            <div className="header-actions">
              <LanguageSwitcher />
              <Link to="/" className="btn-primary">{t('backToHome')}</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Login Content */}
      <div className="login-container">
        <div className="login-left">
          <div className="login-illustration">
            <div className="illustration-content">
              <div className="illustration-icon">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="40" fill="#4F46E5" opacity="0.1"/>
                  <path d="M30 20H50V60L40 53.33L30 60V20Z" fill="#4F46E5"/>
                </svg>
              </div>
              <h2 className="illustration-title">{t('welcomeToResumeBuilder')}</h2>
              <p className="illustration-subtitle">{t('createProfessionalResumes')}</p>
              <div className="illustration-features">
                <div className="illustration-feature">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Professional Templates</span>
                </div>
                <div className="illustration-feature">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Easy to Customize</span>
                </div>
                <div className="illustration-feature">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Export to PDF & DOCX</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-container">
            {/* Header */}
            <div className="login-header">
              <h1>{isLogin ? t('welcomeBack') : t('createAccount')}</h1>
              <p>{t('continueJourney')}</p>
            </div>

            {/* Tab Toggle */}
            <div className="login-tabs">
              <button
                className={`tab-button ${isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(true)}
              >
                {t('login')}
              </button>
              <button
                className={`tab-button ${!isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(false)}
              >
                {t('createAccount')}
              </button>
            </div>

            {/* Form */}
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  {t('emailAddress')}
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  {t('password')}
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    {t('confirmPassword')}
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-input"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              {isLogin && (
                <div className="form-options">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>{t('rememberMe')}</span>
                  </label>
                  <Link to="/forgot-password" className="forgot-link">
                    {t('forgotPassword')}
                  </Link>
                </div>
              )}

              <button type="submit" className="btn-submit">
                {isLogin ? t('signIn') : t('createAccount')}
              </button>
            </form>

            {/* Divider */}
            <div className="divider">
              <span className="divider-text">{t('or')}</span>
            </div>

            {/* Social Login */}
            <div className="social-login">
              <button
                className="btn-social btn-google"
                onClick={handleGoogleLogin}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
                  <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
                  <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49L4.405 11.9z" fill="#FBBC05"/>
                  <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51L4.405 8.1C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
                </svg>
                <span>{t('continueWithGoogle')}</span>
              </button>

              <button
                className="btn-social btn-linkedin"
                onClick={handleLinkedInLogin}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M18.521 0H1.475C.66 0 0 .645 0 1.441v17.118C0 19.355.66 20 1.475 20h17.046c.815 0 1.479-.645 1.479-1.441V1.441C20 .645 19.336 0 18.521 0zM5.942 17.024H2.954V7.499h2.988v9.525zM4.448 6.195a1.732 1.732 0 110-3.464 1.732 1.732 0 010 3.464zm12.576 10.829h-2.987v-4.632c0-1.103-.02-2.526-1.538-2.526-1.541 0-1.777 1.201-1.777 2.444v4.714H8.735V7.499h2.866v1.299h.041c.399-.754 1.373-1.549 2.827-1.549 3.024 0 3.582 1.991 3.582 4.578v5.197z" fill="#0077B5"/>
                </svg>
                <span>{t('continueWithLinkedIn')}</span>
              </button>
            </div>

            {/* Guest Mode */}
            <div className="guest-mode">
              <button className="btn-guest" onClick={handleGuestMode}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2C5.589 2 2 5.589 2 10s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zm0 14.4c-3.525 0-6.4-2.875-6.4-6.4 0-3.525 2.875-6.4 6.4-6.4 3.525 0 6.4 2.875 6.4 6.4 0 3.525-2.875 6.4-6.4 6.4z" fill="#6B7280"/>
                  <path d="M10 5c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 4.5c-.827 0-1.5-.673-1.5-1.5S9.173 6.5 10 6.5s1.5.673 1.5 1.5-.673 1.5-1.5 1.5zM10 12c-2.485 0-4.5 1.567-4.5 3.5v.5h9v-.5c0-1.933-2.015-3.5-4.5-3.5z" fill="#6B7280"/>
                </svg>
                <span>{t('continueAsGuest')}</span>
              </button>
              <p className="guest-note">
                {t('guestNote')}
              </p>
            </div>

            {/* Terms */}
            <div className="terms-text">
              {t('byContinuing')}{' '}
              <Link to="/terms">{t('termsOfService')}</Link> {t('and')}{' '}
              <Link to="/privacy">{t('privacyPolicy')}</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Same as LandingPage */}
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

export default Login;
