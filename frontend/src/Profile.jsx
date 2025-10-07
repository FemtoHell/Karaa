import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';
import { useAuth } from './AuthContext';

const Profile = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState({
    name: authUser?.name || 'John Doe',
    email: authUser?.email || 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    bio: 'Passionate software engineer with 5+ years of experience',
    avatar: authUser?.avatar || 'https://ui-avatars.com/api/?name=John+Doe&background=4F46E5&color=fff&size=200'
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(user);

  // Update user state when authUser changes
  useEffect(() => {
    if (authUser) {
      setUser(prev => ({
        ...prev,
        name: authUser.name,
        email: authUser.email,
        avatar: authUser.avatar
      }));
      setFormData(prev => ({
        ...prev,
        name: authUser.name,
        email: authUser.email,
        avatar: authUser.avatar
      }));
    }
  }, [authUser]);

  const handleSave = () => {
    setUser(formData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData(user);
    setEditMode(false);
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-container">
          <div className="dashboard-header-content">
            <Link to="/" className="logo-wrapper">
              <div className="logo-icon">
                <svg width="11" height="14" viewBox="0 0 11 14" fill="none">
                  <path d="M0 0H11V14L5.5 11L0 14V0Z" fill="#FFFFFF"/>
                </svg>
              </div>
              <span className="logo-text">ResumeBuilder</span>
            </Link>

            <nav className="nav-menu">
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/templates" className="nav-link">Browse Templates</Link>
              <Link to="/help" className="nav-link">Help & Notifications</Link>
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
                  <button className="btn-edit" onClick={() => setEditMode(true)}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" fill="#4F46E5"/>
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
                    <button className="btn-save" onClick={handleSave}>Save Changes</button>
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
                    <button className="btn-setting danger">Delete</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Card */}
            <div className="profile-card">
              <div className="profile-card-header">
                <h2>Subscription</h2>
              </div>

              <div className="profile-card-body">
                <div className="subscription-info">
                  <div className="subscription-plan">
                    <div className="plan-badge">Pro Plan</div>
                    <h3>Professional</h3>
                    <p className="plan-price">$9.99/month</p>
                    <p className="plan-next-billing">Next billing date: Jan 15, 2025</p>
                  </div>

                  <div className="subscription-actions">
                    <Link to="/pricing" className="btn-upgrade">Upgrade Plan</Link>
                    <button className="btn-cancel-sub">Cancel Subscription</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
