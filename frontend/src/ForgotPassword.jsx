import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const ForgotPassword = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Password reset requested for:', email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Header - Đồng bộ với Login */}
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            <Link to="/" className="logo-wrapper">
              <img src="/images/resumebuilder-logo.webp" alt="ResumeBuilder Logo" className="logo-image" />
              <span className="logo-text">ResumeBuilder</span>
            </Link>

            <nav className="nav-menu">
              <Link to="/" className="nav-link">{t('Home') || 'Home'}</Link>
              <Link to="/features" className="nav-link">{t('features')}</Link>
              <Link to="/testimonials" className="nav-link">{t('testimonials')}</Link>
              <Link to="/templates" className="nav-link">{t('templates')}</Link>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            </nav>

            <div className="header-actions">
              <LanguageSwitcher />
              <Link to="/login" className="btn-primary">{t('signIn') || 'Sign In'}</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="login-container">
        <div className="login-left">
          <div className="login-illustration">
            <div className="illustration-content">
              <div className="illustration-icon">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="40" fill="#4F46E5" opacity="0.1"/>
                  <path d="M40 20C30.06 20 22 28.06 22 38v4c0 1.1.9 2 2 2h32c1.1 0 2-.9 2-2v-4c0-9.94-8.06-18-18-18zm0 7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6zM24 46v12c0 1.1.9 2 2 2h28c1.1 0 2-.9 2-2V46H24z" fill="#4F46E5"/>
                </svg>
              </div>
              <h2 className="illustration-title">Forgot Password?</h2>
              <p className="illustration-subtitle">No worries! Enter your email and we'll send you instructions to reset your password.</p>
              <div className="illustration-features">
                <div className="illustration-feature">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Secure & Fast</span>
                </div>
                <div className="illustration-feature">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Email Verification</span>
                </div>
                <div className="illustration-feature">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Get Back Quickly</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-container">
            {!isSubmitted ? (
              <>
                <div className="login-header">
                  <Link to="/login" className="back-link">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ marginRight: '8px' }}>
                      <path d="M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Back to Login
                  </Link>
                  <h1>Reset Password</h1>
                  <p>Enter your email address and we'll send you a link to reset your password</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-input"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn-submit"
                    disabled={loading}
                    style={{
                      opacity: loading ? 0.6 : 1,
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>

                <div className="divider">
                  <span className="divider-text">OR</span>
                </div>

                <div className="terms-text" style={{ textAlign: 'center' }}>
                  Remember your password?{' '}
                  <Link to="/login" style={{ color: '#4F46E5', fontWeight: '600' }}>Sign In</Link>
                </div>
              </>
            ) : (
              <div className="success-message">
                <div className="success-icon">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="32" fill="#10B981" opacity="0.1"/>
                    <path d="M20 32l8 8 16-16" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="success-title">Check Your Email</h2>
                <p className="success-text">
                  We've sent password reset instructions to <strong>{email}</strong>
                </p>
                <p className="success-subtext">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4F46E5',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    try another email address
                  </button>
                </p>
                <Link to="/login" className="btn-submit" style={{ marginTop: '24px', display: 'inline-block', textDecoration: 'none', textAlign: 'center', width: '100%' }}>
                  Back to Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
