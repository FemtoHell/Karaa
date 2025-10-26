import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS, apiRequest } from './config/api';
import { useAuth } from './AuthContext';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const { user: _user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [page, filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const unreadOnly = filter === 'unread';
      const response = await apiRequest(
        `${API_ENDPOINTS.NOTIFICATIONS}?page=${page}&limit=20&unread_only=${unreadOnly}`
      );

      if (response.success) {
        setNotifications(response.data || []);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await apiRequest(API_ENDPOINTS.NOTIFICATIONS_UNREAD_COUNT);
      if (response.success) {
        setUnreadCount(response.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await apiRequest(API_ENDPOINTS.MARK_NOTIFICATION_READ(id), {
        method: 'PUT'
      });

      if (response.success) {
        // Update local state
        setNotifications(notifications.map(n =>
          n._id === id ? { ...n, isRead: true, readAt: new Date() } : n
        ));
        fetchUnreadCount();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
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
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      const response = await apiRequest(API_ENDPOINTS.DELETE_NOTIFICATION(id), {
        method: 'DELETE'
      });

      if (response.success) {
        setNotifications(notifications.filter(n => n._id !== id));
        fetchUnreadCount();
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const getFilteredNotifications = () => {
    if (filter === 'unread') {
      return notifications.filter(n => !n.isRead);
    } else if (filter === 'read') {
      return notifications.filter(n => n.isRead);
    }
    return notifications;
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="notifications-page">
      {/* Header */}
      <header className="notifications-header">
        <div className="notifications-header-content">
          <Link to="/dashboard" className="btn-back">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 18l-8-8 8-8M2 10h16" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Back to Dashboard</span>
          </Link>

          <div className="notifications-header-title">
            <h1>Notifications</h1>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount} unread</span>
            )}
          </div>

          <div className="notifications-header-actions">
            {unreadCount > 0 && (
              <button className="btn-mark-all" onClick={markAllAsRead}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14 4L6 12L2 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Mark all as read
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="notifications-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => { setFilter('all'); setPage(1); }}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => { setFilter('unread'); setPage(1); }}
        >
          Unread ({unreadCount})
        </button>
        <button
          className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
          onClick={() => { setFilter('read'); setPage(1); }}
        >
          Read
        </button>
      </div>

      {/* Notifications List */}
      <div className="notifications-container">
        {loading ? (
          <div className="notifications-loading">
            <div className="spinner"></div>
            <p>Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="notifications-empty">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="32" fill="#F3F4F6"/>
              <path d="M32 20c-6.627 0-12 5.373-12 12v7.172l-3.414 3.414A2 2 0 0017 46h30a2 2 0 00.414-3.414L44 39.172V32c0-6.627-5.373-12-12-12zm0 32c-3.314 0-6-2.686-6-6h12c0 3.314-2.686 6-6 6z" fill="#D1D5DB"/>
            </svg>
            <h3>No notifications yet</h3>
            <p>You'll see notifications here when you have activity</p>
          </div>
        ) : (
          <>
            <div className="notifications-list">
              {filteredNotifications.map(notification => (
                <div
                  key={notification._id}
                  className={`notification-card ${notification.isRead ? 'read' : 'unread'}`}
                >
                  <div className="notification-indicator"></div>

                  <div className={`notification-icon-wrapper ${notification.type}`}>
                    {notification.type === 'success' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    )}
                    {notification.type === 'info' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    )}
                    {notification.type === 'warning' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 20h20L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    )}
                    {notification.type === 'error' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    )}
                  </div>

                  <div className="notification-content">
                    <h3>{notification.title}</h3>
                    <p>{notification.message}</p>
                    <div className="notification-meta">
                      <span className="notification-time">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M7 3.5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        {formatDate(notification.createdAt)}
                      </span>
                      {notification.readAt && (
                        <span className="notification-read-time">
                          Read {formatDate(notification.readAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="notification-actions">
                    {!notification.isRead && (
                      <button
                        className="btn-action mark-read"
                        onClick={() => markAsRead(notification._id)}
                        title="Mark as read"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M14 4L6 12L2 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    )}
                    <button
                      className="btn-action delete"
                      onClick={() => deleteNotification(notification._id)}
                      title="Delete notification"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1m2 0v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="notifications-pagination">
                <button
                  className="btn-page"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Previous
                </button>

                <span className="page-info">
                  Page {page} of {totalPages}
                </span>

                <button
                  className="btn-page"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
