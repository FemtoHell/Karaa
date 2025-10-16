const mongoose = require('mongoose');

const GuideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
    // Note: unique already creates an index, no need for index: true
  },
  industry: {
    type: String,
    required: [true, 'Please add an industry'],
    enum: [
      'technology',
      'healthcare',
      'finance',
      'education',
      'marketing',
      'sales',
      'engineering',
      'design',
      'legal',
      'hospitality',
      'retail',
      'construction',
      'manufacturing',
      'general'
    ]
  },
  category: {
    type: String,
    required: true,
    enum: ['resume-tips', 'interview-prep', 'career-advice', 'templates']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  content: {
    type: String,
    required: [true, 'Please add content']
  },
  sections: [{
    title: String,
    content: String,
    order: Number
  }],
  tips: [{
    icon: String,
    title: String,
    description: String
  }],
  dos: [String],
  donts: [String],
  examples: [{
    title: String,
    good: String,
    bad: String,
    explanation: String
  }],
  recommendedTemplates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template'
  }],
  tags: [{
    type: String,
    lowercase: true
  }],
  author: {
    name: String,
    role: String,
    avatar: String
  },
  readTime: {
    type: Number,
    default: 5 // minutes
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
GuideSchema.index({ industry: 1, category: 1 });
// Note: slug already has unique index from schema definition
GuideSchema.index({ tags: 1 });
GuideSchema.index({ title: 'text', description: 'text', content: 'text' });

module.exports = mongoose.model('Guide', GuideSchema);
