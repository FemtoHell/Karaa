const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Resume = require('../models/Resume');
const { cache } = require('../config/redis');
const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../middleware/errorHandler');
const { encrypt, decrypt } = require('../utils/encryption');

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res, next) => {
  const cacheKey = `user:profile:${req.user.id}`;

  // Check cache
  const cachedData = await cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json({
      success: true,
      cached: true,
      data: cachedData
    });
  }

  const user = await User.findById(req.user.id)
    .where('deletedAt').equals(null)
    .select('name email avatar role phone location bio createdAt updatedAt lastLogin');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Decrypt sensitive fields (FR-7.1)
  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    phone: user.phone ? decrypt(user.phone) : null,
    location: user.location ? decrypt(user.location) : null,
    bio: user.bio ? decrypt(user.bio) : null,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
    last_login: user.lastLogin
  };

  // Cache for 10 minutes
  await cache.set(cacheKey, userData, 600);

  res.status(200).json({
    success: true,
    data: userData
  });
});

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { name, email, avatar, phone, location, bio } = req.body;

  // Check if email is already taken by another user
  if (email) {
    const existingUser = await User.findOne({
      email: email,
      _id: { $ne: req.user.id },
      deletedAt: null
    });

    if (existingUser) {
      return next(new ErrorResponse('Email already in use', 400));
    }
  }

  // Build update object with encryption for sensitive data (FR-7.1)
  const updates = {};

  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;
  if (avatar !== undefined) updates.avatar = avatar;
  
  // Encrypt sensitive personal information
  if (phone !== undefined) {
    updates.phone = phone ? encrypt(phone) : null;
  }
  if (location !== undefined) {
    updates.location = location ? encrypt(location) : null;
  }
  if (bio !== undefined) {
    updates.bio = bio ? encrypt(bio) : null;
  }

  if (Object.keys(updates).length === 0) {
    return next(new ErrorResponse('No fields to update', 400));
  }

  // Update user
  const user = await User.findByIdAndUpdate(
    req.user.id,
    updates,
    { new: true, runValidators: true }
  ).select('name email avatar role phone location bio createdAt updatedAt');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Decrypt sensitive fields for response
  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    phone: user.phone ? decrypt(user.phone) : null,
    location: user.location ? decrypt(user.location) : null,
    bio: user.bio ? decrypt(user.bio) : null,
    created_at: user.createdAt,
    updated_at: user.updatedAt
  };

  // Clear cache
  await cache.del(`user:profile:${req.user.id}`);

  res.status(200).json({
    success: true,
    data: userData
  });
});

// @desc    Change password
// @route   PUT /api/v1/users/change-password
// @access  Private
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user.id)
    .where('deletedAt').equals(null)
    .select('+password');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Check current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password
  user.password = hashedPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
});

// @desc    Delete account (soft delete)
// @route   DELETE /api/v1/users/account
// @access  Private
exports.deleteAccount = asyncHandler(async (req, res, next) => {
  // Soft delete user
  await User.findByIdAndUpdate(req.user.id, {
    deletedAt: new Date()
  });

  // Also soft delete all user's resumes
  await Resume.updateMany(
    { user: req.user.id },
    { deletedAt: new Date() }
  );

  // Clear cache
  await cache.del(`user:profile:${req.user.id}`);
  await cache.delPattern(`resumes:user:${req.user.id}:*`);
  await cache.delPattern(`resume:*:user:${req.user.id}`);

  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully'
  });
});

// @desc    Permanently delete account and all data (FR-7.2)
// @route   DELETE /api/v1/users/account/permanent
// @access  Private
exports.permanentDeleteAccount = asyncHandler(async (req, res, next) => {
  const { password, confirmation } = req.body;

  // Require password confirmation and explicit consent
  if (!password || confirmation !== 'DELETE MY ACCOUNT') {
    return next(new ErrorResponse('Password and confirmation required. Type "DELETE MY ACCOUNT" to confirm.', 400));
  }

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Verify password (skip for OAuth users)
  if (user.password) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorResponse('Incorrect password', 401));
    }
  }

  const Notification = require('../models/Notification');

  // Delete all user's resumes (permanent)
  const deletedResumes = await Resume.deleteMany({ user: req.user.id });
  console.log(`Permanently deleted ${deletedResumes.deletedCount} resumes for user ${req.user.id}`);

  // Delete all user's notifications
  const deletedNotifications = await Notification.deleteMany({ user: req.user.id });
  console.log(`Permanently deleted ${deletedNotifications.deletedCount} notifications for user ${req.user.id}`);

  // Clear all cache entries for this user
  await cache.del(`user:profile:${req.user.id}`);
  await cache.delPattern(`resumes:user:${req.user.id}:*`);
  await cache.delPattern(`resume:*:user:${req.user.id}`);
  await cache.delPattern(`notifications:user:${req.user.id}:*`);

  // Permanently delete user account
  await User.findByIdAndDelete(req.user.id);
  console.log(`Permanently deleted user account ${req.user.id}`);

  // Clear authentication cookie
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Account and all associated data permanently deleted',
    data: {
      resumesDeleted: deletedResumes.deletedCount,
      notificationsDeleted: deletedNotifications.deletedCount
    }
  });
});

// @desc    Upload avatar
// @route   POST /api/v1/users/avatar
// @access  Private
exports.uploadAvatar = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const avatarUrl = `/uploads/avatars/${req.file.filename}`;

  // Update user avatar
  await User.findByIdAndUpdate(req.user.id, {
    avatar: avatarUrl
  });

  // Clear cache
  await cache.del(`user:profile:${req.user.id}`);

  res.status(200).json({
    success: true,
    data: {
      avatar: avatarUrl
    }
  });
});

// @desc    Get user activity
// @route   GET /api/v1/users/activity
// @access  Private
exports.getUserActivity = asyncHandler(async (req, res, next) => {
  const { limit = 10 } = req.query;
  const cacheKey = `user:activity:${req.user.id}:limit:${limit}`;

  // Check cache
  const cachedData = await cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json({
      success: true,
      cached: true,
      data: cachedData
    });
  }

  // Get recent resume activities
  const resumes = await Resume.find({
    user: req.user.id,
    deletedAt: null
  })
    .select('title updatedAt')
    .sort({ updatedAt: -1 })
    .limit(parseInt(limit));

  // Format activities
  const activities = resumes.map(resume => ({
    type: 'resume_updated',
    title: resume.title,
    timestamp: resume.updatedAt
  }));

  // Cache for 5 minutes
  await cache.set(cacheKey, activities, 300);

  res.status(200).json({
    success: true,
    data: activities
  });
});
