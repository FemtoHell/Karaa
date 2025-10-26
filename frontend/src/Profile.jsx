import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import { API_ENDPOINTS } from './config/api';

const Profile = () => {
  const { user: authUser, logout, updateUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: authUser?.name || '',
    email: authUser?.email || '',
    phone: '',
    location: '',
    bio: '',
    avatar: authUser?.avatar || 'https://ui-avatars.com/api/?name=User&background=4F46E5&color=fff&size=200',
    provider: 'local' // default to local
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(user);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [_error, setError] = useState(null);

  // Fetch user profile from backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!authUser) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(API_ENDPOINTS.USER_PROFILE, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });

        const data = await response.json();

        if (response.ok && data.success) {
          const profileData = {
            name: data.data.name || authUser.name,
            email: data.data.email || authUser.email,
            phone: data.data.phone || '',
            location: data.data.location || '',
            bio: data.data.bio || '',
            avatar: data.data.avatar || authUser.avatar || 'https://ui-avatars.com/api/?name=User&background=4F46E5&color=fff&size=200',
            provider: data.data.provider || authUser.provider || 'local' // Get provider from backend
          };
          setUser(profileData);
          setFormData(profileData);
          
          console.log('User profile loaded:', { provider: profileData.provider });
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [authUser]);

  // Update when authUser changes
  useEffect(() => {
    if (authUser) {
      setUser(prev => ({
        ...prev,
        name: authUser.name,
        email: authUser.email,
        avatar: authUser.avatar || prev.avatar
      }));
      setFormData(prev => ({
        ...prev,
        name: authUser.name,
        email: authUser.email,
        avatar: authUser.avatar || prev.avatar
      }));
    }
  }, [authUser]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.UPDATE_PROFILE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          avatar: formData.avatar
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      if (data.success) {
        setUser(formData);
        setEditMode(false);
        
        // Update auth context
        if (updateUser) {
          updateUser({
            ...authUser,
            name: formData.name,
            email: formData.email,
            avatar: formData.avatar
          });
        }

        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error.message);
      alert('Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setEditMode(false);
    setError(null);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE MY ACCOUNT') {
      alert('Please type "DELETE MY ACCOUNT" to confirm');
      return;
    }

    // Check if password is required (for local users)
    if (!deletePassword && user.provider === 'local') {
      alert('Please enter your password');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('Deleting account...');
      console.log('User provider:', user.provider);
      console.log('Has password:', !!deletePassword);
      console.log('Endpoint:', API_ENDPOINTS.DELETE_ACCOUNT_PERMANENT);
      
      const requestBody = {
        confirmation: deleteConfirmation
      };
      
      // Only include password if user entered one
      if (deletePassword) {
        requestBody.password = deletePassword;
      }
      
      console.log('Request body:', { ...requestBody, password: requestBody.password ? '***' : undefined });
      
      const response = await fetch(API_ENDPOINTS.DELETE_ACCOUNT_PERMANENT, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        // Show detailed error message
        const errorMsg = data.errors 
          ? data.errors.map(e => e.message).join(', ')
          : (data.message || 'Failed to delete account');
        throw new Error(errorMsg);
      }

      alert(`Account deleted successfully! ${data.data.resumesDeleted} resumes and ${data.data.notificationsDeleted} notifications were removed.`);

      // Logout and redirect
      logout();
      navigate('/');
    } catch (error) {
      console.error('Delete account error:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setDeleteConfirmation('');
      setDeletePassword('');
    }
  };

  return (
    <div className="profile-page">
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
              <Link to="/features" className="nav-link">{t('features')}</Link>
              <Link to="/testimonials" className="nav-link">{t('testimonials')}</Link>
              <Link to="/templates" className="nav-link">{t('templates')}</Link>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/help" className="nav-link">{t('Help') || 'Help'}</Link>
            </nav>

            <div className="header-user">
              <Link to="/dashboard" className="btn-back">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="profile-main">
        <div className="profile-container">
          <div className="profile-header">
            <h1>My Profile</h1>
            <p>Manage your personal information and account settings</p>
          </div>

          <div className="profile-content">
            {/* Profile Card */}
            <div className="profile-card">
              <div className="profile-card-header">
                <h2>Personal Information</h2>
                {!editMode ? (
                  <button className="btn-edit" onClick={() => setEditMode(true)} disabled={loading}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" fill="#4F46E5"/>
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button className="btn-cancel" onClick={handleCancel} disabled={saving}>Cancel</button>
                    <button className="btn-save" onClick={handleSave} disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>

              <div className="profile-card-body">
                <div className="profile-avatar-section">
                  <div className="avatar-wrapper">
                    <img src={user.avatar} alt={user.name} />
                    {editMode && (
                      <button className="btn-change-avatar">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    )}
                  </div>
                  {editMode && (
                    <p className="avatar-hint">Click to change profile picture</p>
                  )}
                </div>

                <div className="profile-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      ) : (
                        <p>{user.name}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Email Address</label>
                      {editMode ? (
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      ) : (
                        <p>{user.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone Number</label>
                      {editMode ? (
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      ) : (
                        <p>{user.phone}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Location</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                      ) : (
                        <p>{user.location}</p>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Bio</label>
                    {editMode ? (
                      <textarea
                        rows="3"
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      />
                    ) : (
                      <p>{user.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy & Security Card - FR-7.1, FR-7.2, FR-7.3 */}
            <div className="profile-card">
              <div className="profile-card-header">
                <h2>🔒 Privacy & Security</h2>
              </div>

              <div className="profile-card-body">
                <div className="privacy-info">
                  <div className="privacy-feature">
                    <div className="feature-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="feature-content">
                      <h4>Data Encryption (FR-7.1)</h4>
                      <p>Your personal data (email, phone, address) is encrypted using AES-256-GCM encryption</p>
                      <div className="encryption-status">
                        <span className="status-badge active">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13.5 4.5L6 12 2.5 8.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          Encryption Active
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="privacy-feature">
                    <div className="feature-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="#3B82F6" strokeWidth="2"/>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="#3B82F6" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div className="feature-content">
                      <h4>Privacy Consent (FR-7.3)</h4>
                      <p>Your CV remains private by default. Sharing requires explicit consent each time.</p>
                      <p className="privacy-note">✓ CVs are never publicly accessible without your permission</p>
                    </div>
                  </div>

                  <div className="privacy-feature">
                    <div className="feature-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="feature-content">
                      <h4>Data Deletion Rights (FR-7.2)</h4>
                      <p>You have full control over your data. Delete your account and all associated data permanently.</p>
                      <button
                        className="btn-delete-data"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        Delete All My Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Settings Card */}
            <div className="profile-card">
              <div className="profile-card-header">
                <h2>Account Settings</h2>
              </div>

              <div className="profile-card-body">
                <div className="settings-list">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Change Password</h4>
                      <p>Update your password to keep your account secure</p>
                    </div>
                    <button className="btn-setting">Change</button>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Email Notifications</h4>
                      <p>Manage your email notification preferences</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Two-Factor Authentication</h4>
                      <p>Add an extra layer of security to your account</p>
                    </div>
                    <button className="btn-setting">Enable</button>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Delete Account</h4>
                      <p>Permanently delete your account and all data</p>
                    </div>
                    <button
                      className="btn-setting danger"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Delete Account Modal - FR-7.2 */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>⚠️ Delete Account Permanently</h2>
              <button onClick={() => setShowDeleteModal(false)} className="btn-close">×</button>
            </div>
            <div className="modal-body">
              <div className="warning-box">
                <p><strong>Warning:</strong> This action is irreversible!</p>
                <p>All your data will be permanently deleted:</p>
                <ul>
                  <li>All resumes and CV data</li>
                  <li>All notifications and activity</li>
                  <li>Account information</li>
                  <li>Encrypted personal data</li>
                </ul>
              </div>

              <div className="form-group">
                <label>Type "DELETE MY ACCOUNT" to confirm:</label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="DELETE MY ACCOUNT"
                  className="delete-confirmation-input"
                />
              </div>

              {user.provider === 'local' && (
                <div className="form-group">
                  <label>Enter your password:</label>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Your password"
                    className="delete-password-input"
                    required
                  />
                  <small style={{color: '#999', fontSize: '12px'}}>
                    Password is required for local accounts
                  </small>
                </div>
              )}
              
              {user.provider !== 'local' && (
                <div className="form-group">
                  <small style={{color: '#999', fontSize: '12px'}}>
                    ℹ️ You are using {user.provider} authentication. No password required.
                  </small>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn-cancel-modal"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                  setDeletePassword('');
                }}
              >
                Cancel
              </button>
              <button
                className="btn-delete-confirm"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== 'DELETE MY ACCOUNT'}
              >
                Delete My Account Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
