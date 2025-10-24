import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import './Login.css';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleOAuthCallback } = useAuth();
  const { t } = useLanguage();
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  const inputRefs = useRef([]);

  useEffect(() => {
    // Get email from navigation state
    const emailFromState = location.state?.email;
    if (emailFromState) {
      setEmail(emailFromState);
    } else {
      // If no email, redirect to login
      navigate('/login');
    }
  }, [location, navigate]);

  useEffect(() => {
    // Timer for resend button
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleCodeChange = (index, value) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setCode(newCode);

    // Focus last filled input or first empty
    const lastFilledIndex = newCode.findIndex(digit => !digit);
    const focusIndex = lastFilledIndex === -1 ? 5 : lastFilledIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      const response = await fetch(`${apiUrl}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          code: verificationCode
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Email verified successfully! Redirecting...');
        
        // Save token and user data
        if (data.token) {
          localStorage.setItem('token', data.token);
          if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
          }
          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            await handleOAuthCallback(data.token, data.refreshToken, data.user);
          }
        }

        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(data.message || 'Verification failed. Please try again.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    setResendLoading(true);
    setError('');
    setSuccess('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      const response = await fetch(`${apiUrl}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('A new verification code has been sent to your email');
        setResendTimer(60); // 60 seconds cooldown
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setError(data.message || 'Failed to resend code');
      }
    } catch (err) {
      console.error('Resend error:', err);
      setError('Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
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
        {/* Left Side - Illustration */}
        <div className="login-left">
          <div className="login-illustration">
            <div className="illustration-content">
              <div className="illustration-icon">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="40" fill="#4F46E5" opacity="0.1"/>
                  <path d="M40 24C31.163 24 24 31.163 24 40v0c0 8.837 7.163 16 16 16h0c8.837 0 16-7.163 16-16v0c0-8.837-7.163-16-16-16zm0 6l12 8-12 8-12-8 12-8z" fill="#4F46E5"/>
                  <path d="M28 46l12 8 12-8" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="illustration-title">Check Your Email</h2>
              <p className="illustration-subtitle">We've sent a 6-digit verification code to your email address. Please enter it to verify your account.</p>
              <div className="illustration-features">
                <div className="illustration-feature">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Secure Verification</span>
                </div>
                <div className="illustration-feature">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Quick & Easy</span>
                </div>
                <div className="illustration-feature">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Protected Account</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="login-right">
          <div className="login-form-container">
            {/* Header */}
            <div className="login-header" style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '48px', 
                marginBottom: '16px'
              }}>
                📧
              </div>
              <h1>Verify Your Email</h1>
              <p>We've sent a 6-digit code to</p>
              <p style={{ fontWeight: '600', color: '#4F46E5', marginTop: '8px' }}>
                {email}
              </p>
              <p style={{ fontSize: '14px', color: '#666', marginTop: '12px' }}>
                Please enter the code below to verify your email address
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ marginTop: '32px' }}>
              {/* Messages */}
              {error && (
                <div style={{
                  padding: '12px 16px',
                  marginBottom: '20px',
                  backgroundColor: '#fee',
                  border: '1px solid #fcc',
                  borderRadius: '8px',
                  color: '#c33',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
              )}

              {success && (
                <div style={{
                  padding: '12px 16px',
                  marginBottom: '20px',
                  backgroundColor: '#d1fae5',
                  border: '1px solid #6ee7b7',
                  borderRadius: '8px',
                  color: '#065f46',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  {success}
                </div>
              )}

              {/* Code Input */}
              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={loading}
                    className="form-input"
                    style={{
                      width: '50px',
                      height: '56px',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      padding: '0'
                    }}
                  />
                ))}
              </div>

              {/* Timer Info */}
              <div style={{
                textAlign: 'center',
                fontSize: '13px',
                color: '#666',
                marginBottom: '20px'
              }}>
                ⏰ Code expires in 10 minutes
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-submit"
                disabled={loading || code.join('').length !== 6}
                style={{
                  opacity: loading || code.join('').length !== 6 ? 0.6 : 1,
                  cursor: loading || code.join('').length !== 6 ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>

            {/* Resend Code */}
            <div className="divider" style={{ margin: '24px 0' }}>
              <span className="divider-text">Need help?</span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                Didn't receive the code?
              </p>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendLoading || resendTimer > 0}
                style={{
                  background: 'none',
                  border: 'none',
                  color: resendTimer > 0 ? '#999' : '#4F46E5',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: resendTimer > 0 ? 'not-allowed' : 'pointer',
                  textDecoration: 'underline',
                  marginBottom: '16px'
                }}
              >
                {resendLoading ? 'Sending...' : 
                 resendTimer > 0 ? `Resend code in ${resendTimer}s` : 
                 'Resend code'}
              </button>

              {/* Back to Login */}
              <div>
                <Link 
                  to="/login" 
                  style={{
                    fontSize: '14px',
                    color: '#666',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
