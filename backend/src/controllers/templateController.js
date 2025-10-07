const Template = require('../models/Template');
const { cache } = require('../config/redis');
const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../middleware/errorHandler');

// @desc    Get all templates
// @route   GET /api/v1/templates
// @access  Public
exports.getTemplates = asyncHandler(async (req, res, next) => {
  const { category, color, sort = 'popularity', order = 'desc', search = '' } = req.query;

  // Cache key
  const cacheKey = `templates:category:${category || 'all'}:color:${color || 'all'}:sort:${sort}:search:${search}`;

  // Check cache
  const cachedData = await cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json({
      success: true,
      cached: true,
      data: cachedData
    });
  }

  // Build query
  const query = { isActive: true };

  if (category) {
    query.category = category;
  }

  if (color) {
    query.color = color;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];
  }

  // Get templates
  const sortObj = {};
  sortObj[sort] = order === 'asc' ? 1 : -1;

  const templates = await Template.find(query).sort(sortObj).select('-__v');

  // Cache for 1 hour
  await cache.set(cacheKey, templates, 3600);

  res.status(200).json({
    success: true,
    count: templates.length,
    data: templates
  });
});

// @desc    Get single template
// @route   GET /api/v1/templates/:id
// @access  Public
exports.getTemplate = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Cache key
  const cacheKey = `template:${id}`;

  // Check cache
  const cachedData = await cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json({
      success: true,
      cached: true,
      data: cachedData
    });
  }

  const template = await Template.findOne({ _id: id, isActive: true }).select('-__v');

  if (!template) {
    return next(new ErrorResponse('Template not found', 404));
  }

  // Increment view count
  template.views += 1;
  await template.save();

  // Cache for 1 hour
  await cache.set(cacheKey, template, 3600);

  res.status(200).json({
    success: true,
    data: template
  });
});

// @desc    Get template categories
// @route   GET /api/v1/templates/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  const cacheKey = 'template:categories';

  // Check cache
  const cachedData = await cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json({
      success: true,
      cached: true,
      data: cachedData
    });
  }

  const categories = await Template.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { category: '$_id', count: 1, _id: 0 } }
  ]);

  // Cache for 24 hours
  await cache.set(cacheKey, categories, 86400);

  res.status(200).json({
    success: true,
    data: categories
  });
});

// @desc    Get popular templates
// @route   GET /api/v1/templates/popular
// @access  Public
exports.getPopularTemplates = asyncHandler(async (req, res, next) => {
  const { limit = 6 } = req.query;
  const cacheKey = `templates:popular:limit:${limit}`;

  // Check cache
  const cachedData = await cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json({
      success: true,
      cached: true,
      data: cachedData
    });
  }

  const templates = await Template.find({ isActive: true })
    .sort({ popularity: -1, views: -1 })
    .limit(parseInt(limit))
    .select('-__v');

  // Cache for 30 minutes
  await cache.set(cacheKey, templates, 1800);

  res.status(200).json({
    success: true,
    count: templates.length,
    data: templates
  });
});

// @desc    Create template (Admin only)
// @route   POST /api/v1/templates
// @access  Private/Admin
exports.createTemplate = asyncHandler(async (req, res, next) => {
  const template = await Template.create(req.body);

  // Clear cache
  await cache.delPattern('template*');

  res.status(201).json({
    success: true,
    data: template
  });
});

// @desc    Update template (Admin only)
// @route   PUT /api/v1/templates/:id
// @access  Private/Admin
exports.updateTemplate = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let template = await Template.findById(id);

  if (!template) {
    return next(new ErrorResponse('Template not found', 404));
  }

  template = await Template.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  }).select('-__v');

  // Clear cache
  await cache.delPattern('template*');

  res.status(200).json({
    success: true,
    data: template
  });
});

// @desc    Delete template (Admin only)
// @route   DELETE /api/v1/templates/:id
// @access  Private/Admin
exports.deleteTemplate = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const template = await Template.findById(id);

  if (!template) {
    return next(new ErrorResponse('Template not found', 404));
  }

  // Soft delete by setting isActive to false
  template.isActive = false;
  await template.save();

  // Clear cache
  await cache.delPattern('template*');

  res.status(200).json({
    success: true,
    message: 'Template deleted successfully'
  });
});
