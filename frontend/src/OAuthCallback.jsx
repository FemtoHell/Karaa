import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './AuthContext';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthCallback } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get token, refreshToken and user from URL params
        const token = searchParams.get('token');
        const refreshToken = searchParams.get('refreshToken');
        const userStr = searchParams.get('user');

        if (!token || !userStr) {
          throw new Error('Missing authentication data');
        }

        // Parse user data
        const user = JSON.parse(decodeURIComponent(userStr));

        // Handle OAuth callback
        const result = await handleOAuthCallback(token, refreshToken, user);

        if (result.success) {
          // Redirect to dashboard
          navigate('/dashboard', { replace: true });
        } else {
          throw new Error(result.error || 'OAuth authentication failed');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        // Redirect to login with error message
        navigate('/login?error=' + encodeURIComponent(error.message), { replace: true });
      }
    };

    processCallback();
  }, [searchParams, navigate, handleOAuthCallback]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #4F46E5',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }} />
        <p style={{ color: '#6B7280', fontSize: '14px' }}>
          Completing authentication...
        </p>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default OAuthCallback;
