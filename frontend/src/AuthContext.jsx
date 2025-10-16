import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService, userService, guestService } from './services/api.service';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage for authentication state on initial load
    const token = localStorage.getItem('token');
    const guestSessionId = localStorage.getItem('guestSessionId');
    return !!(token || guestSessionId);
  });

  const [user, setUser] = useState(() => {
    // Load user data from localStorage if available
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isGuest, setIsGuest] = useState(() => {
    // Check if user is in guest mode
    return !!localStorage.getItem('guestSessionId');
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save authentication state to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Login with email and password
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const data = await authService.login(email, password);

      // Check if verification is required
      if (!data.success && data.requiresVerification) {
        return { 
          success: false, 
          requiresVerification: true, 
          email: data.email,
          message: data.message 
        };
      }

      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        setUser(data.user);
        return { success: true };
      }

      throw new Error(data.message || 'Login failed');
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Register new user
  const register = async (email, password, name) => {
    try {
      setLoading(true);
      setError(null);

      const data = await authService.register(name, email, password);

      // Check if verification is required
      if (data.requiresVerification) {
        return { 
          success: false, 
          requiresVerification: true, 
          email: data.email,
          message: data.message 
        };
      }

      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        setUser(data.user);
        return { success: true };
      }

      throw new Error(data.message || 'Registration failed');
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // OAuth login (Google, LinkedIn)
  const oAuthLogin = (provider) => {
    // Redirect to OAuth provider
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    window.location.href = `${baseURL}/auth/${provider.toLowerCase()}`;
  };

  // Handle OAuth callback
  const handleOAuthCallback = async (token, refreshToken, userData) => {
    try {
      localStorage.setItem('token', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      setIsAuthenticated(true);
      setUser(userData);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Create guest session
  const createGuestSession = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await guestService.createSession();

      if (data.success && data.data.sessionId) {
        localStorage.setItem('guestSessionId', data.data.sessionId);
        localStorage.setItem('guestExpiresIn', data.data.expiresIn);
        setIsAuthenticated(true);
        setIsGuest(true);
        setUser({
          name: 'Guest User',
          email: 'guest@temporary.com',
          isGuest: true
        });
        return { success: true };
      }

      throw new Error(data.message || 'Failed to create guest session');
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      if (!isGuest) {
        await authService.logout();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsAuthenticated(false);
      setIsGuest(false);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('guestSessionId');
      localStorage.removeItem('guestExpiresIn');
      // Redirect to login page
      window.location.href = '/login';
    }
  };

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getProfile();

      if (data.success) {
        setUser(data.data);
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
      // If token is invalid, logout
      if (err.message.includes('Session expired')) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      fetchUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    isAuthenticated,
    user,
    isGuest,
    loading,
    error,
    login,
    register,
    oAuthLogin,
    handleOAuthCallback,
    createGuestSession,
    logout,
    fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
