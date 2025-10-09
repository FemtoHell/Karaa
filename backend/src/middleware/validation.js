const { body, param, query, validationResult } = require('express-validator');

// Validation result handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Auth validation rules
const authValidation = {
  register: [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    validate
  ],

  login: [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
  ],

  forgotPassword: [
    body('email').isEmail().withMessage('Please provide a valid email'),
    validate
  ],

  resetPassword: [
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    validate
  ]
};

// Resume validation rules
const resumeValidation = {
  create: [
    body('title').optional().trim().notEmpty().withMessage('Resume title is required'),
    body('template_id')
      .optional({ nullable: true, checkFalsy: true })
      .custom((value) => {
        if (!value) return true; // Allow null/undefined
        // Check if it's a valid MongoDB ObjectId format
        return /^[a-f\d]{24}$/i.test(value);
      })
      .withMessage('Invalid template ID format'),
    validate
  ],

  update: [
    param('id').isMongoId().withMessage('Invalid resume ID'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    validate
  ],

  delete: [
    param('id').isMongoId().withMessage('Invalid resume ID'),
    validate
  ]
};

// Template validation rules
const templateValidation = {
  getOne: [
    param('id').isMongoId().withMessage('Invalid template ID'),
    validate
  ]
};

// User validation rules
const userValidation = {
  updateProfile: [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
    validate
  ],

  changePassword: [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long'),
    validate
  ]
};

module.exports = {
  validate,
  authValidation,
  resumeValidation,
  templateValidation,
  userValidation
};
