import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS, apiRequest } from '../config/api';
import { useAuth } from '../AuthContext';
import './NotificationBell.css';

const NotificationBell = () => {
  const { isAuthenticated, isGuest } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated && !isGuest) {
      fetchNotifications();
    }
  }, [isAuthenticated, isGuest]);

  const fetchNotifications = async () => {
    try {
      const response = await apiRequest(`${API_ENDPOINTS.NOTIFICATIONS}?limit=5`);
      if (response.success) {
        setNotifications(response.data || []);
        const unread = (response.data || []).filter(n => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.warn('Could not fetch notifications:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await apiRequest(API_ENDPOINTS.MARK_ALL_NOTIFICATIONS_READ, {
        method: 'PUT'
      });

      if (response.success) {
        setNotifications(notifications.map(n => ({
          ...n,
          isRead: true,
          readAt: new Date()
        })));
        setUnreadCount(0);
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
        setNotifications(notifications.map(n =>
          n._id === notificationId ? { ...n, isRead: true, readAt: new Date() } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
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
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Don't show for guests
  if (!isAuthenticated || isGuest) {
    return null;
  }

  return (
    <div className="notification-bell-wrapper">
      <button
        className="btn-notification"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2C6.686 2 4 4.686 4 8v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8c0-3.314-2.686-6-6-6zm0 16a3 3 0 01-3-3h6a3 3 0 01-3 3z" fill="currentColor"/>
        </svg>
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {/* Notification Panel */}
      {showNotifications && (
        <>
          <div className="notification-backdrop" onClick={() => setShowNotifications(false)} />
          <div className="notification-panel">
            <div className="notification-header">
              <h3>Notifications</h3>
              {unreadCount > 0 && (
                <button className="btn-clear" onClick={markAllAsRead}>
                  Mark all as read
                </button>
              )}
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
              <Link to="/notifications" onClick={() => setShowNotifications(false)}>
                View All Notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
