const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { cache } = require('../config/redis');
const { sendTokenResponse, generateToken } = require('../utils/jwtUtils');
const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../middleware/errorHandler');
const { sendVerificationEmail, generateVerificationCode, sendWelcomeEmail } = require('../utils/emailService');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email, deletedAt: null });

  if (existingUser) {
    // If user exists but not verified, resend verification code
    if (!existingUser.isEmailVerified) {
      const verificationCode = generateVerificationCode();
      const hashedCode = crypto.createHash('sha256').update(verificationCode).digest('hex');
      
      existingUser.emailVerificationCode = hashedCode;
      existingUser.emailVerificationExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
      await existingUser.save();

      // Send verification email
      await sendVerificationEmail(email, name, verificationCode);

      return res.status(200).json({
        success: true,
        message: 'A verification code has been sent to your email',
        requiresVerification: true,
        email: email
      });
    }

    return next(new ErrorResponse('Email already registered', 400));
  }

  // Generate verification code
  const verificationCode = generateVerificationCode();
  const hashedCode = crypto.createHash('sha256').update(verificationCode).digest('hex');

  // Create user (password will be hashed by pre-save hook)
  const user = await User.create({
    name,
    email,
    password,
    provider: 'local',
    isEmailVerified: false,
    emailVerificationCode: hashedCode,
    emailVerificationExpire: Date.now() + 10 * 60 * 1000 // 10 minutes
  });

  // Send verification email - MUST succeed
  try {
    await sendVerificationEmail(email, name, verificationCode);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    // Delete the created user since email failed
    await User.findByIdAndDelete(user._id);
    return next(new ErrorResponse('Failed to send verification email. Please try again or check your email configuration.', 500));
  }

  res.status(201).json({
    success: true,
    message: 'Registration successful! Please check your email for the verification code',
    requiresVerification: true,
    email: user.email
  });
});

// @desc    Verify email with code
// @route   POST /api/v1/auth/verify-email
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return next(new ErrorResponse('Please provide email and verification code', 400));
  }

  // Hash the code to compare
  const hashedCode = crypto.createHash('sha256').update(code).digest('hex');

  // Find user with matching code and not expired
  const user = await User.findOne({
    email,
    emailVerificationCode: hashedCode,
    emailVerificationExpire: { $gt: Date.now() },
    deletedAt: null
  }).select('+emailVerificationCode +emailVerificationExpire');

  if (!user) {
    return next(new ErrorResponse('Invalid or expired verification code', 400));
  }

  // Update user
  user.isEmailVerified = true;
  user.emailVerificationCode = undefined;
  user.emailVerificationExpire = undefined;
  user.lastLogin = Date.now();
  await user.save();

  // Send welcome email (non-blocking)
  sendWelcomeEmail(user.email, user.name).catch(err => {
    console.error('Failed to send welcome email:', err);
  });

  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role
  };

  // Create welcome notification
  try {
    await Notification.create({
      user: user._id,
      type: 'success',
      title: 'Welcome to ResumeBuilder! 🎉',
      message: 'Your email has been verified successfully. Start creating your professional resume now!'
    });
  } catch (err) {
    console.error('Failed to create welcome notification:', err);
  }

  // Send token response
  sendTokenResponse(userData, 200, res);
});

// @desc    Resend verification code
// @route   POST /api/v1/auth/resend-verification
// @access  Public
exports.resendVerification = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorResponse('Please provide email', 400));
  }

  const user = await User.findOne({ email, deletedAt: null });

  if (!user) {
    return next(new ErrorResponse('No user found with that email', 404));
  }

  if (user.isEmailVerified) {
    return next(new ErrorResponse('Email already verified', 400));
  }

  // Generate new verification code
  const verificationCode = generateVerificationCode();
  const hashedCode = crypto.createHash('sha256').update(verificationCode).digest('hex');

  user.emailVerificationCode = hashedCode;
  user.emailVerificationExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // Send verification email
  try {
    await sendVerificationEmail(email, user.name, verificationCode);
    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email'
    });
  } catch (error) {
    return next(new ErrorResponse('Failed to send verification email', 500));
  }
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Get user with password
  const user = await User.findOne({ email, deletedAt: null }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if email is verified
  if (!user.isEmailVerified && user.provider === 'local') {
    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const hashedCode = crypto.createHash('sha256').update(verificationCode).digest('hex');

    user.emailVerificationCode = hashedCode;
    user.emailVerificationExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(email, user.name, verificationCode);
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }

    return res.status(403).json({
      success: false,
      message: 'Please verify your email first. A new verification code has been sent to your email.',
      requiresVerification: true,
      email: user.email
    });
  }

  // Check password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Update last login
  user.lastLogin = Date.now();
  await user.save();

  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role
  };

  // Create login notification
  try {
    await Notification.create({
      user: user._id,
      type: 'success',
      title: 'Login Successful',
      message: `Welcome back! You successfully logged in at ${new Date().toLocaleString()}`
    });
  } catch (err) {
    console.error('Failed to create login notification:', err);
  }

  // Send token response
  sendTokenResponse(userData, 200, res);
});

// @desc    Logout user / clear cookie
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password');

  if (!user || user.deletedAt) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      created_at: user.createdAt,
      last_login: user.lastLogin
    }
  });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email, deletedAt: null });

  if (!user) {
    return next(new ErrorResponse('No user found with that email', 404));
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token and set to resetPasswordToken field
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire (1 hour)
  user.resetPasswordExpire = Date.now() + 3600000;

  await user.save();

  // TODO: Send email with reset token
  // For now, just return the token
  res.status(200).json({
    success: true,
    message: 'Password reset email sent',
    resetToken: resetToken // Remove this in production
  });
});

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { resettoken } = req.params;
  const { password } = req.body;

  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resettoken)
    .digest('hex');

  // Find user by reset token
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
    deletedAt: null
  });

  if (!user) {
    return next(new ErrorResponse('Invalid or expired reset token', 400));
  }

  // Set new password (will be hashed by pre-save hook)
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successfully'
  });
});

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Check current password
  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  // Set new password (will be hashed by pre-save hook)
  user.password = newPassword;
  await user.save();

  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role
  };

  // Send token response
  sendTokenResponse(userData, 200, res);
});
