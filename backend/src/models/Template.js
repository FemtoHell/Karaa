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
