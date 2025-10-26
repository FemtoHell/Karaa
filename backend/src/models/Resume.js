const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    default: null
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  content: {
    personal: {
      fullName: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      website: String,
      summary: String,
      photo: String  // Add photo field for avatar URL
    },
    experience: [{
      jobTitle: String,
      company: String,
      location: String,
      startDate: String,
      endDate: String,
      current: Boolean,
      description: String,
      achievements: [String],
      metrics: [{
        type: { type: String, enum: ['percentage', 'number', 'currency', 'time'] },
        value: String,
        description: String
      }]
    }],
    education: [{
      degree: String,
      school: String,
      location: String,
      startDate: String,
      endDate: String,
      gpa: String,
      description: String
    }],
    skills: {
      technical: [String],
      soft: [String],
      languages: [String]
    },
    skillsWithProficiency: [{
      id: String,
      name: String,
      category: { type: String, enum: ['technical', 'soft', 'language', 'tool'], default: 'technical' },
      proficiency: { type: Number, min: 1, max: 5, default: 3 }
    }],
    projects: [{
      name: String,
      description: String,
      technologies: String,
      link: String,
      startDate: String,
      endDate: String
    }],
    certificates: [{
      name: String,
      issuer: String,
      date: String,
      link: String,
      description: String
    }],
    activities: [{
      title: String,
      organization: String,
      startDate: String,
      endDate: String,
      description: String
    }]
  },
  customization: {
    font: {
      type: String,
      default: 'Inter'
    },
    fontSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium'
    },
    colorScheme: {
      type: String,
      default: 'blue'
    },
    spacing: {
      type: String,
      enum: ['compact', 'normal', 'relaxed'],
      default: 'normal'
    },
    layout: {
      type: String,
      enum: [
        // Standard layouts from Template model
        'single-column',        // Traditional 1 column
        'two-column',           // Sidebar + main
        'two-column-equal',     // Equal split (50/50)
        'timeline',             // Vertical timeline
        'modern-blocks',        // Card/block based
        'infographic',          // Visual/chart based
        'grid',                 // Grid layout
        // Legacy/Additional layouts for backward compatibility
        'modern',
        'academic',
        'creative-grid',
        'traditional',
        'portfolio-style',
        'dynamic',
        'minimal',
        'marketing-focused',
        'data-focused'
      ],
      default: 'single-column'
    }
  },

  // Sharing settings
  shareId: {
    type: String,
    unique: true,
    sparse: true
    // Note: index: true removed to avoid duplicate with unique: true
  },
  isPublic: {
    type: Boolean,
    default: false  // FR-7.3: Default to private, requires explicit consent
  },
  privacyConsent: {
    given: {
      type: Boolean,
      default: false
    },
    givenAt: {
      type: Date,
      default: null
    },
    ipAddress: {
      type: String,
      default: null
    }
  },
  shareSettings: {
    allowDownload: {
      type: Boolean,
      default: true
    },
    password: {
      type: String,
      default: null
    },
    expiresAt: {
      type: Date,
      default: null
    },
    viewCount: {
      type: Number,
      default: 0
    }
  },

  // Version control
  version: {
    type: Number,
    default: 1
  },
  parentResume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    default: null
  },
  versionHistory: [{
    version: Number,
    content: mongoose.Schema.Types.Mixed,
    customization: mongoose.Schema.Types.Mixed,
    createdAt: Date,
    comment: String
  }],

  // Soft delete
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
ResumeSchema.index({ user: 1, updatedAt: -1 });
ResumeSchema.index({ deletedAt: 1 });
ResumeSchema.index({ title: 'text' });

module.exports = mongoose.model('Resume', ResumeSchema);
