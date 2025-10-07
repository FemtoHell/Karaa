const { executeQuery } = require('../config/database');
const { cache } = require('../config/redis');
const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../middleware/errorHandler');

// @desc    Get all notifications for user
// @route   GET /api/v1/notifications
// @access  Private
exports.getNotifications = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, unread_only = false } = req.query;
  const offset = (page - 1) * limit;

  const cacheKey = `notifications:user:${req.user.id}:page:${page}:limit:${limit}:unread:${unread_only}`;

  // Check cache
  const cachedData = await cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json({
      success: true,
      cached: true,
      ...cachedData
    });
  }

  // Build query
  let whereClause = 'WHERE user_id = ?';
  const params = [req.user.id];

  if (unread_only === 'true') {
    whereClause += ' AND is_read = 0';
  }

  // Get total count
  const countResult = await executeQuery(
    `SELECT COUNT(*) as total FROM notifications ${whereClause}`,
    params
  );
  const total = countResult[0].total;

  // Get notifications
  const notifications = await executeQuery(
    `SELECT * FROM notifications
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, parseInt(limit), parseInt(offset)]
  );

  const response = {
    data: notifications,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }
  };

  // Cache for 1 minute (notifications change frequently)
  await cache.set(cacheKey, response, 60);

  res.status(200).json({
    success: true,
    ...response
  });
});

// @desc    Get unread count
// @route   GET /api/v1/notifications/unread-count
// @access  Private
exports.getUnreadCount = asyncHandler(async (req, res, next) => {
  const cacheKey = `notifications:unread:user:${req.user.id}`;

  // Check cache
  const cachedData = await cache.get(cacheKey);
  if (cachedData !== null) {
    return res.status(200).json({
      success: true,
      cached: true,
      count: cachedData
    });
  }

  const result = await executeQuery(
    'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
    [req.user.id]
  );

  const count = result[0].count;

  // Cache for 30 seconds
  await cache.set(cacheKey, count, 30);

  res.status(200).json({
    success: true,
    count
  });
});

// @desc    Mark notification as read
// @route   PUT /api/v1/notifications/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Check if notification exists and belongs to user
  const notifications = await executeQuery(
    'SELECT id FROM notifications WHERE id = ? AND user_id = ?',
    [id, req.user.id]
  );

  if (notifications.length === 0) {
    return next(new ErrorResponse('Notification not found', 404));
  }

  // Mark as read
  await executeQuery(
    'UPDATE notifications SET is_read = 1, read_at = NOW() WHERE id = ?',
    [id]
  );

  // Clear cache
  await cache.delPattern(`notifications:*:user:${req.user.id}:*`);
  await cache.del(`notifications:unread:user:${req.user.id}`);

  res.status(200).json({
    success: true,
    message: 'Notification marked as read'
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/v1/notifications/read-all
// @access  Private
exports.markAllAsRead = asyncHandler(async (req, res, next) => {
  await executeQuery(
    'UPDATE notifications SET is_read = 1, read_at = NOW() WHERE user_id = ? AND is_read = 0',
    [req.user.id]
  );

  // Clear cache
  await cache.delPattern(`notifications:*:user:${req.user.id}:*`);
  await cache.del(`notifications:unread:user:${req.user.id}`);

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

// @desc    Delete notification
// @route   DELETE /api/v1/notifications/:id
// @access  Private
exports.deleteNotification = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Check if notification exists and belongs to user
  const notifications = await executeQuery(
    'SELECT id FROM notifications WHERE id = ? AND user_id = ?',
    [id, req.user.id]
  );

  if (notifications.length === 0) {
    return next(new ErrorResponse('Notification not found', 404));
  }

  // Delete notification
  await executeQuery(
    'DELETE FROM notifications WHERE id = ?',
    [id]
  );

  // Clear cache
  await cache.delPattern(`notifications:*:user:${req.user.id}:*`);
  await cache.del(`notifications:unread:user:${req.user.id}`);

  res.status(200).json({
    success: true,
    message: 'Notification deleted successfully'
  });
});

// @desc    Create notification (Helper function for internal use)
// @access  Private
exports.createNotification = async (userId, type, title, message, metadata = null) => {
  try {
    await executeQuery(
      `INSERT INTO notifications (user_id, type, title, message, metadata, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [userId, type, title, message, metadata ? JSON.stringify(metadata) : null]
    );

    // Clear unread count cache
    await cache.del(`notifications:unread:user:${userId}`);
    await cache.delPattern(`notifications:*:user:${userId}:*`);

    return true;
  } catch (error) {
    console.error('Error creating notification:', error);
    return false;
  }
};

// @desc    Broadcast notification to all users
// @access  Private
exports.broadcastNotification = async (type, title, message, metadata = null) => {
  try {
    // Get all users
    const User = require('../models/User');
    const users = await User.find({ deletedAt: null }).select('_id');

    // Create notification for each user
    const promises = users.map(user =>
      exports.createNotification(user._id, type, title, message, metadata)
    );

    await Promise.all(promises);

    return true;
  } catch (error) {
    console.error('Error broadcasting notification:', error);
    return false;
  }
};

// @desc    Send new template notification
// @route   POST /api/v1/notifications/new-template
// @access  Private/Admin
exports.notifyNewTemplate = asyncHandler(async (req, res, next) => {
  const { templateName, templateId, category } = req.body;

  const title = 'New Resume Template Available!';
  const message = `Check out our new ${category} template: ${templateName}`;

  const metadata = {
    type: 'new_template',
    templateId,
    category
  };

  await exports.broadcastNotification('new_template', title, message, metadata);

  res.status(200).json({
    success: true,
    message: 'Notification sent to all users'
  });
});

// @desc    Send new feature notification
// @route   POST /api/v1/notifications/new-feature
// @access  Private/Admin
exports.notifyNewFeature = asyncHandler(async (req, res, next) => {
  const { featureName, description, link } = req.body;

  const title = 'New Feature Available!';
  const message = `${featureName}: ${description}`;

  const metadata = {
    type: 'new_feature',
    featureName,
    link
  };

  await exports.broadcastNotification('new_feature', title, message, metadata);

  res.status(200).json({
    success: true,
    message: 'Feature notification sent to all users'
  });
});

// @desc    Send guide notification
// @route   POST /api/v1/notifications/new-guide
// @access  Private/Admin
exports.notifyNewGuide = asyncHandler(async (req, res, next) => {
  const { guideTitle, guideSlug, industry } = req.body;

  const title = 'New Career Guide Available!';
  const message = `New guide for ${industry}: ${guideTitle}`;

  const metadata = {
    type: 'new_guide',
    guideSlug,
    industry
  };

  await exports.broadcastNotification('new_guide', title, message, metadata);

  res.status(200).json({
    success: true,
    message: 'Guide notification sent to all users'
  });
});
