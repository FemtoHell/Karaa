const express = require('express');
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  notifyNewTemplate,
  notifyNewFeature,
  notifyNewGuide
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

// Admin only routes - broadcast notifications
router.post('/new-template', authorize('admin'), notifyNewTemplate);
router.post('/new-feature', authorize('admin'), notifyNewFeature);
router.post('/new-guide', authorize('admin'), notifyNewGuide);

module.exports = router;
