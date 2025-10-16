import { API_ENDPOINTS, apiRequest } from '../config/api';

// Consistent keys - đồng bộ với AuthContext
const GUEST_SESSION_KEY = 'guestSessionId'; // Changed from 'guest_session_id'
const GUEST_RESUME_KEY = 'guest_resume_id';

// Get or create guest session
export const getGuestSession = async () => {
  let sessionId = localStorage.getItem(GUEST_SESSION_KEY);

  if (!sessionId) {
    try {
      const response = await fetch(API_ENDPOINTS.GUEST_SESSION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (data.success) {
        sessionId = data.data.sessionId;
        localStorage.setItem(GUEST_SESSION_KEY, sessionId);
        // Also set expiry time
        if (data.data.expiresIn) {
          localStorage.setItem('guestExpiresIn', data.data.expiresIn);
        }
      }
    } catch (error) {
      console.error('Failed to create guest session:', error);
    }
  }

  return sessionId;
};

// Save guest resume
export const saveGuestResume = async (data) => {
  const sessionId = await getGuestSession();

  if (!sessionId) {
    throw new Error('Failed to create guest session');
  }

  try {
    const response = await fetch(API_ENDPOINTS.GUEST_RESUME, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        sessionId
      })
    });

    const result = await response.json();

    if (result.success) {
      // Store resume ID for later retrieval
      localStorage.setItem(GUEST_RESUME_KEY, result.data.id);
      return result.data;
    }

    throw new Error(result.message || 'Failed to save resume');
  } catch (error) {
    console.error('Failed to save guest resume:', error);
    throw error;
  }
};

// Get guest resume
export const getGuestResume = async (resumeId) => {
  const sessionId = localStorage.getItem(GUEST_SESSION_KEY);

  if (!sessionId || !resumeId) {
    return null;
  }

  try {
    const response = await fetch(`${API_ENDPOINTS.GUEST_RESUME_BY_ID(resumeId)}?sessionId=${sessionId}`);
    const result = await response.json();

    if (result.success) {
      return result.data;
    }

    return null;
  } catch (error) {
    console.error('Failed to get guest resume:', error);
    return null;
  }
};

// Update guest resume
export const updateGuestResume = async (resumeId, data) => {
  const sessionId = await getGuestSession();

  if (!sessionId || !resumeId) {
    throw new Error('Invalid session or resume ID');
  }

  try {
    const response = await fetch(API_ENDPOINTS.GUEST_RESUME_BY_ID(resumeId), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        sessionId
      })
    });

    const result = await response.json();

    if (result.success) {
      return result.data;
    }

    throw new Error(result.message || 'Failed to update resume');
  } catch (error) {
    console.error('Failed to update guest resume:', error);
    throw error;
  }
};

// Get all guest resumes
export const getGuestResumes = async () => {
  const sessionId = localStorage.getItem(GUEST_SESSION_KEY);

  if (!sessionId) {
    return [];
  }

  try {
    const response = await fetch(`${API_ENDPOINTS.GUEST_RESUMES}?sessionId=${sessionId}`);
    const result = await response.json();

    if (result.success) {
      return result.data;
    }

    return [];
  } catch (error) {
    console.error('Failed to get guest resumes:', error);
    return [];
  }
};

// Migrate guest data to user account
export const migrateGuestData = async () => {
  const sessionId = localStorage.getItem(GUEST_SESSION_KEY);

  if (!sessionId) {
    return { success: true, migrated: 0 };
  }

  try {
    const response = await apiRequest(API_ENDPOINTS.GUEST_MIGRATE, {
      method: 'POST',
      body: JSON.stringify({ sessionId })
    });

    if (response.success) {
      // Clear guest session after successful migration
      localStorage.removeItem(GUEST_SESSION_KEY);
      localStorage.removeItem(GUEST_RESUME_KEY);
    }

    return response;
  } catch (error) {
    console.error('Failed to migrate guest data:', error);
    throw error;
  }
};

// Check if user is in guest mode
export const isGuestMode = () => {
  return !!localStorage.getItem(GUEST_SESSION_KEY);
};

// Clear guest session
export const clearGuestSession = () => {
  localStorage.removeItem(GUEST_SESSION_KEY);
  localStorage.removeItem(GUEST_RESUME_KEY);
};
