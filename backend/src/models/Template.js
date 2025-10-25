const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a template name'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['modern', 'professional', 'creative', 'minimalist']
  },
  color: {
    type: String,
    required: [true, 'Please add a color'],
    enum: ['blue', 'green', 'purple', 'orange', 'red', 'gray']
  },
  gradient: {
    type: String,
    default: null
  },
  image: {
    type: String,
    required: [true, 'Please add a preview image']
  },
  tags: [{
    type: String,
    lowercase: true
  }],
  config: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // Photo configuration
  photoConfig: {
    enabled: { type: Boolean, default: false },
    style: { 
      type: String, 
      enum: ['circle', 'rounded', 'square'],
      default: 'circle'
    },
    position: {
      type: String,
      enum: ['header', 'sidebar', 'top-left', 'top-right'],
      default: 'header'
    },
    size: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium'
    }
  },

  // Template Layout Configuration
  layout: {
    type: {
      type: String,
      enum: [
        'single-column',        // Traditional 1 column
        'two-column',           // Sidebar + main (e.g., 30/70)
        'two-column-equal',     // Equal split (50/50)
        'timeline',             // Vertical timeline
        'modern-blocks',        // Card/block based
        'infographic',          // Visual/chart based
        'grid'                  // Grid layout
      ],
      default: 'single-column'
    },
    columns: {
      count: { type: Number, default: 1, min: 1, max: 3 },
      widths: [{ type: String }],  // e.g., ['30%', '70%'] or ['50%', '50%']
      gap: { type: String, default: '24px' }
    }
  },

  // Section Configuration
  sections: {
    order: [{
      type: String,
      enum: [
        'personal', 'summary', 'experience', 'education',
        'skills', 'projects', 'certificates', 'activities',
        'languages', 'awards', 'publications', 'references'
      ]
    }],
    visible: {
      personal: { type: Boolean, default: true },
      summary: { type: Boolean, default: true },
      experience: { type: Boolean, default: true },
      education: { type: Boolean, default: true },
      skills: { type: Boolean, default: true },
      projects: { type: Boolean, default: true },
      certificates: { type: Boolean, default: false },
      activities: { type: Boolean, default: false },
      languages: { type: Boolean, default: false },
      awards: { type: Boolean, default: false },
      publications: { type: Boolean, default: false },
      references: { type: Boolean, default: false }
    },
    config: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },

  // Typography
  typography: {
    headingFont: { type: String, default: 'Inter' },
    bodyFont: { type: String, default: 'Inter' },
    sizes: {
      name: { type: String, default: '28px' },
      heading: { type: String, default: '16px' },
      subheading: { type: String, default: '14px' },
      body: { type: String, default: '12px' }
    }
  },

  // Colors
  colors: {
    primary: { type: String, default: '#3B82F6' },
    secondary: { type: String, default: '#1E40AF' },
    text: { type: String, default: '#000000' },
    textLight: { type: String, default: '#666666' },
    background: { type: String, default: '#FFFFFF' }
  },

  // Features
  features: {
    hasPhoto: { type: Boolean, default: false },
    hasIcons: { type: Boolean, default: false },
    hasCharts: { type: Boolean, default: false },
    atsFriendly: { type: Boolean, default: true },
    multiPage: { type: Boolean, default: false }
  },

  popularity: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  views: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
TemplateSchema.index({ category: 1, isActive: 1 });
TemplateSchema.index({ color: 1 });
TemplateSchema.index({ popularity: -1 });
TemplateSchema.index({ tags: 1 });

// Text search index
TemplateSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text'
});

module.exports = mongoose.model('Template', TemplateSchema);
