const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: function() {
      // Password required only if not using OAuth
      return !this.googleId && !this.linkedinId;
    },
    minlength: 6,
    select: false // Don't return password by default
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  // OAuth fields
  googleId: {
    type: String,
    sparse: true, // Allow multiple null values
    unique: true
  },
  linkedinId: {
    type: String,
    sparse: true,
    unique: true
  },

  // OAuth provider info
  provider: {
    type: String,
    enum: ['local', 'google', 'linkedin'],
    default: 'local'
  },

  // Password reset
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  // Activity tracking
  lastLogin: {
    type: Date,
    default: null
  },

  // Soft delete
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 });
UserSchema.index({ linkedinId: 1 });
UserSchema.index({ deletedAt: 1 });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash if password is modified and exists
  if (!this.isModified('password') || !this.password) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual for resumes
UserSchema.virtual('resumes', {
  ref: 'Resume',
  localField: '_id',
  foreignField: 'user'
});

module.exports = mongoose.model('User', UserSchema);
