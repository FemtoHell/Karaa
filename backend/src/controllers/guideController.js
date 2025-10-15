const Guide = require('../models/Guide');
const { cache } = require('../config/redis');
const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../middleware/errorHandler');
const { industryGuides, generalTips, actionVerbs } = require('../utils/guideContent');

// @desc    Get industry-specific guide content (FR-6.1)
// @route   GET /api/v1/guides/industry/:industry
// @access  Public
exports.getIndustryGuide = asyncHandler(async (req, res, next) => {
  const { industry } = req.params;

  const guide = industryGuides[industry];
  if (!guide) {
    return next(new ErrorResponse('Guide not found for this industry', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      industry,
      ...guide,
      generalTips,
      actionVerbs
    }
  });
});

// @desc    Get all available industries
// @route   GET /api/v1/guides/industries
// @access  Public
exports.getIndustries = asyncHandler(async (req, res, next) => {
  const industries = Object.keys(industryGuides).map(key => ({
    id: key,
    title: industryGuides[key].title,
    icon: industryGuides[key].icon,
    keywords: industryGuides[key].keywords
  }));

  res.status(200).json({
    success: true,
    data: industries
  });
});

// @desc    Get all guides
// @route   GET /api/v1/guides
// @access  Public
exports.getGuides = asyncHandler(async (req, res, next) => {
  const { industry, category, featured, search } = req.query;

  // Cache key
  const cacheKey = `guides:industry:${industry || 'all'}:category:${category || 'all'}:featured:${featured || 'all'}:search:${search || ''}`;

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
  const query = { isPublished: true };

  if (industry) {
    query.industry = industry;
  }

  if (category) {
    query.category = category;
  }

  if (featured) {
    query.featured = featured === 'true';
  }

  if (search) {
    query.$text = { $search: search };
  }

  const guides = await Guide.find(query)
    .populate('recommendedTemplates', 'name image category')
    .select('-content -sections')
    .sort({ featured: -1, publishedAt: -1 });

  // Cache for 1 hour
  await cache.set(cacheKey, guides, 3600);

  res.status(200).json({
    success: true,
    count: guides.length,
    data: guides
  });
});

// @desc    Get single guide
// @route   GET /api/v1/guides/:slug
// @access  Public
exports.getGuide = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;

  // Cache key
  const cacheKey = `guide:${slug}`;

  // Check cache
  const cachedData = await cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json({
      success: true,
      cached: true,
      data: cachedData
    });
  }

  const guide = await Guide.findOne({ slug, isPublished: true })
    .populate('recommendedTemplates', 'name image category gradient color');

  if (!guide) {
    return next(new ErrorResponse('Guide not found', 404));
  }

  // Increment views
  guide.views += 1;
  await guide.save();

  // Cache for 1 hour
  await cache.set(cacheKey, guide, 3600);

  res.status(200).json({
    success: true,
    data: guide
  });
});

// @desc    Get guides by industry
// @route   GET /api/v1/guides/industry/:industry
// @access  Public
exports.getGuidesByIndustry = asyncHandler(async (req, res, next) => {
  const { industry } = req.params;

  const guides = await Guide.find({
    industry,
    isPublished: true
  })
    .select('-content -sections')
    .sort({ featured: -1, publishedAt: -1 });

  res.status(200).json({
    success: true,
    count: guides.length,
    data: guides
  });
});

// @desc    Create guide (Admin only)
// @route   POST /api/v1/guides
// @access  Private/Admin
exports.createGuide = asyncHandler(async (req, res, next) => {
  const guide = await Guide.create(req.body);

  // Clear cache
  await cache.delPattern('guide*');

  res.status(201).json({
    success: true,
    data: guide
  });
});

// @desc    Update guide (Admin only)
// @route   PUT /api/v1/guides/:id
// @access  Private/Admin
exports.updateGuide = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let guide = await Guide.findById(id);

  if (!guide) {
    return next(new ErrorResponse('Guide not found', 404));
  }

  guide = await Guide.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });

  // Clear cache
  await cache.delPattern('guide*');

  res.status(200).json({
    success: true,
    data: guide
  });
});

// @desc    Delete guide (Admin only)
// @route   DELETE /api/v1/guides/:id
// @access  Private/Admin
exports.deleteGuide = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const guide = await Guide.findById(id);

  if (!guide) {
    return next(new ErrorResponse('Guide not found', 404));
  }

  await guide.deleteOne();

  // Clear cache
  await cache.delPattern('guide*');

  res.status(200).json({
    success: true,
    message: 'Guide deleted successfully'
  });
});

// @desc    Like a guide
// @route   POST /api/v1/guides/:id/like
// @access  Public
exports.likeGuide = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const guide = await Guide.findById(id);

  if (!guide) {
    return next(new ErrorResponse('Guide not found', 404));
  }

  guide.likes += 1;
  await guide.save();

  res.status(200).json({
    success: true,
    data: {
      likes: guide.likes
    }
  });
});
