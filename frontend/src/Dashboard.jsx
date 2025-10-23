import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { API_ENDPOINTS, apiRequest } from './config/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isGuest } = useAuth();
  const { t } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [selectedResumes, setSelectedResumes] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect to login if not authenticated (but allow guests)
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch resumes and notifications
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch resumes based on user type
        if (isGuest) {
          // For guest users, fetch from guest endpoint
          const guestSessionId = localStorage.getItem('guestSessionId');
          if (guestSessionId) {
            const resumesResponse = await apiRequest(
              `${API_ENDPOINTS.GUEST_RESUMES}?sessionId=${guestSessionId}`
            );
            if (resumesResponse.success) {
              setResumes(resumesResponse.data || []);
            }
          }
          // Guests don't have notifications
          setNotifications([]);
        } else {
          // For regular users
          const resumesResponse = await apiRequest(API_ENDPOINTS.RESUMES);
          if (resumesResponse.success) {
            setResumes(resumesResponse.data || []);
          }

          // Fetch notifications
          try {
            const notifResponse = await apiRequest(API_ENDPOINTS.NOTIFICATIONS);
            if (notifResponse.success) {
              setNotifications(notifResponse.data || []);
            }
          } catch (err) {
            // Notifications might fail, but don't break the page
            console.warn('Could not fetch notifications:', err);
            setNotifications([]);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setResumes([]);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isGuest, isAuthenticated]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const duplicateResume = async (resumeId) => {
    try {
      const resume = resumes.find(r => r._id === resumeId);
      if (!resume) return;

      const response = await apiRequest(API_ENDPOINTS.DUPLICATE_RESUME(resumeId), {
        method: 'POST'
      });

      if (response.success) {
        // Refresh resumes list
        const resumesResponse = await apiRequest(API_ENDPOINTS.RESUMES);
        if (resumesResponse.success) {
          setResumes(resumesResponse.data || []);
        }
        alert(`Resume "${resume.title}" duplicated successfully!`);
      }
    } catch (err) {
      alert('Failed to duplicate resume: ' + err.message);
    }
  };

  const deleteResume = async (resumeId) => {
    try {
      const resume = resumes.find(r => r._id === resumeId);
      if (!resume) return;

      if (!window.confirm(`Are you sure you want to delete "${resume.title}"?`)) {
        return;
      }

      const response = await apiRequest(API_ENDPOINTS.RESUME_BY_ID(resumeId), {
        method: 'DELETE'
      });

      if (response.success) {
        setResumes(resumes.filter(r => r._id !== resumeId));
        alert(`Resume "${resume.title}" deleted successfully!`);
      }
    } catch (err) {
      alert('Failed to delete resume: ' + err.message);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await apiRequest(API_ENDPOINTS.MARK_ALL_NOTIFICATIONS_READ, {
        method: 'PUT'
      });

      if (response.success) {
        // Update local state
        setNotifications(notifications.map(n => ({
          ...n,
          isRead: true,
          readAt: new Date()
        })));
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await apiRequest(API_ENDPOINTS.MARK_NOTIFICATION_READ(notificationId), {
        method: 'PUT'
      });

      if (response.success) {
        // Update local state
        setNotifications(notifications.map(n =>
          n._id === notificationId ? { ...n, isRead: true, readAt: new Date() } : n
        ));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const toggleResumeSelection = (resumeId) => {
    setSelectedResumes(prev => {
      if (prev.includes(resumeId)) {
        return prev.filter(id => id !== resumeId);
      } else if (prev.length < 2) {
        return [...prev, resumeId];
      }
      return prev;
    });
  };

  const compareResumes = () => {
    if (selectedResumes.length === 2) {
      setShowCompareModal(true);
    } else {
      alert('Please select exactly 2 resumes to compare');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="dashboard-page">
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
              <Link to="/" className="nav-link">{t('Home') || 'Home'}</Link>
              <Link to="/templates" className="nav-link">{t('templates')}</Link>
              <Link to="/dashboard" className="nav-link active">Dashboard</Link>
            </nav>

            <div className="header-user">
              <LanguageSwitcher />
              <button
                className="btn-notification"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2C6.686 2 4 4.686 4 8v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8c0-3.314-2.686-6-6-6zm0 16a3 3 0 01-3-3h6a3 3 0 01-3 3z" fill="#6B7280"/>
                </svg>
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </button>

              <div className="user-avatar" onClick={() => setShowUserMenu(!showUserMenu)}>
                <img src={user?.avatar || "https://ui-avatars.com/api/?name=User&background=4F46E5&color=fff"} alt="User" />
              </div>

              {/* Notification Panel */}
              {showNotifications && (
                <div className="notification-panel">
                  <div className="notification-header">
                    <h3>Notifications</h3>
                    <button className="btn-clear" onClick={markAllAsRead}>Mark all as read</button>
                  </div>
                  <div className="notification-list">
                    {notifications.length === 0 ? (
                      <div className="empty-notifications">
                        <p>No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif._id}
                          className={`notification-item ${notif.isRead ? 'read' : 'unread'}`}
                          onClick={() => !notif.isRead && markAsRead(notif._id)}
                          style={{ cursor: notif.isRead ? 'default' : 'pointer' }}
                        >
                          <div className={`notification-icon ${notif.type}`}>
                            {notif.type === 'success' && (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M6 8l2 2 4-4" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            )}
                            {notif.type === 'info' && (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 7v4m0-6h.01M8 14A6 6 0 108 2a6 6 0 000 12z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            )}
                            {notif.type === 'warning' && (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 7v2m0 2h.01M8 14A6 6 0 108 2a6 6 0 000 12z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            )}
                          </div>
                          <div className="notification-content">
                            <h4>{notif.title}</h4>
                            <p>{notif.message}</p>
                            <span className="notification-time">{formatDate(notif.createdAt)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="notification-footer">
                    <Link to="/notifications">View All Notifications</Link>
                  </div>
                </div>
              )}

              {/* User Menu */}
              {showUserMenu && (
                <div className="user-menu">
                  <div className="user-menu-header">
                    <div className="user-menu-avatar">
                      <img src={user?.avatar || "https://ui-avatars.com/api/?name=User&background=4F46E5&color=fff"} alt="User" />
                    </div>
                    <div className="user-menu-info">
                      <h4>{user?.name || 'User'}</h4>
                      <p>{user?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                  <div className="user-menu-divider"></div>
                  <Link to="/profile" className="user-menu-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm0 2c-3.866 0-7 2.239-7 5v1h14v-1c0-2.761-3.134-5-7-5z" fill="#6B7280"/>
                    </svg>
                    {t('profile')}
                  </Link>
                  <Link to="/help" className="user-menu-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 14A6 6 0 108 2a6 6 0 000 12zm0-2a1 1 0 110-2 1 1 0 010 2zm1-8.5v4h-2v-4h2z" fill="#6B7280"/>
                    </svg>
                    {t('helpSupport')}
                  </Link>
                  <div className="user-menu-divider"></div>
                  <button onClick={logout} className="user-menu-item logout">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3m5 4l3 3-3 3m3-3H6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Welcome Section */}
          <section className="welcome-section">
            <div className="welcome-content">
              <h1>{t('welcomeBack')}, {user?.name || 'User'}!</h1>
              <p>{t('welcomeMessage')}</p>
            </div>
            <Link to="/templates" className="btn-create-new">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4v12m6-6H4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {t('createNewResume')}
            </Link>
          </section>

          {/* Stats Section */}
          <section className="stats-section">
            <div className="stat-card">
              <div className="stat-icon blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="stat-info">
                <h3>{resumes.length}</h3>
                <p>{t('totalResumes')}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-8" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="stat-info">
                <h3>0</h3>
                <p>{t('downloads')}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="#8B5CF6" strokeWidth="2"/>
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="#8B5CF6" strokeWidth="2"/>
                </svg>
              </div>
              <div className="stat-info">
                <h3>0</h3>
                <p>{t('views')}</p>
              </div>
            </div>
          </section>

          {/* Your Resumes Section */}
          <section className="resumes-section">
            <div className="section-header">
              <h2>{t('yourResumes')}</h2>
              {selectedResumes.length > 0 && (
                <div className="resume-actions">
                  <button onClick={compareResumes} className="btn-compare">
                    {t('compareSelected')} ({selectedResumes.length})
                  </button>
                  <button onClick={() => setSelectedResumes([])} className="btn-clear-selection">
                    {t('clearSelection')}
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>{t('loadingResumes')}</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>{t('errorLoadingResumes')}: {error}</p>
                <button onClick={() => window.location.reload()} className="btn-primary">
                  {t('retry')}
                </button>
              </div>
            ) : resumes.length === 0 ? (
              <div className="empty-resumes">
                <div className="empty-icon">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <path d="M20 16h24M20 24h24M20 32h16" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
                    <rect x="12" y="8" width="40" height="48" rx="2" stroke="#D1D5DB" strokeWidth="3"/>
                  </svg>
                </div>
                <h3>{t('noResumesYet')}</h3>
                <p>{t('getStartedMessage')}</p>
                <Link to="/templates" className="btn-primary">
                  {t('browseTemplates')}
                </Link>
              </div>
            ) : (
              <div className="resumes-grid">
                {resumes.map(resume => (
                  <div
                    key={resume._id}
                    className={`resume-card ${selectedResumes.includes(resume._id) ? 'selected' : ''}`}
                    onClick={() => toggleResumeSelection(resume._id)}
                  >
                    <div className="resume-thumbnail" style={{ background: resume.template?.gradient || '#F3F4F6' }}>
                      <div className="resume-preview-icon">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                          <path d="M10 8h12M10 12h12M10 16h8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </div>
                    <div className="resume-info">
                      <h3>{resume.title}</h3>
                      <p className="resume-template">{resume.template?.name || 'No template'}</p>
                      <p className="resume-date">{t('lastModified')}: {formatDate(resume.updatedAt)}</p>
                    </div>
                    <div className="resume-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/editor/${resume._id}`);
                        }}
                        className="action-btn"
                        title={t('edit')}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M11.333 2L14 4.667 5.333 13.333H2.667v-2.666L11.333 2z" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateResume(resume._id);
                        }}
                        className="action-btn"
                        title={t('duplicate')}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M5.333 5.333V3.333c0-.733.6-1.333 1.334-1.333h6.666c.734 0 1.334.6 1.334 1.333v6.667c0 .733-.6 1.333-1.334 1.333h-2" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
                          <rect x="2" y="5.333" width="8" height="8" rx="1.333" stroke="#6B7280" strokeWidth="1.5"/>
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteResume(resume._id);
                        }}
                        className="action-btn action-btn-danger"
                        title={t('delete')}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M4 5.333h8M6 2.667h4m-7.333 2.666v8c0 .734.6 1.334 1.333 1.334h6c.734 0 1.334-.6 1.334-1.334v-8" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Compare Modal */}
      {showCompareModal && (
        <div className="modal-overlay" onClick={() => setShowCompareModal(false)}>
          <div className="modal-content compare-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('compareResumes')}</h2>
              <button onClick={() => setShowCompareModal(false)} className="btn-close">×</button>
            </div>
            <div className="compare-content">
              <p>{t('compareFeatureComingSoon')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
