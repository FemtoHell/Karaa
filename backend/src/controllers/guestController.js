const { cache } = require('../config/redis');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../middleware/errorHandler');

// Guest session TTL: 24 hours
const GUEST_SESSION_TTL = 24 * 60 * 60;

// @desc    Create guest session
// @route   POST /api/v1/guest/session
// @access  Public
exports.createGuestSession = asyncHandler(async (req, res, next) => {
  const sessionId = uuidv4();

  // Store session in Redis
  await cache.set(`guest:session:${sessionId}`, {
    created: new Date(),
    lastActivity: new Date()
  }, GUEST_SESSION_TTL);

  res.status(201).json({
    success: true,
    data: {
      sessionId,
      expiresIn: GUEST_SESSION_TTL
    }
  });
});

// @desc    Save guest resume
// @route   POST /api/v1/guest/resume
// @access  Public
exports.saveGuestResume = asyncHandler(async (req, res, next) => {
  const { sessionId, title, template_id, content, customization } = req.body;

  if (!sessionId) {
    return next(new ErrorResponse('Session ID is required', 400));
  }

  // Check if session exists
  const session = await cache.get(`guest:session:${sessionId}`);
  if (!session) {
    return next(new ErrorResponse('Session expired or invalid', 401));
  }

  // Generate resume ID
  const resumeId = uuidv4();

  // Save resume data
  const resumeData = {
    id: resumeId,
    sessionId,
    title: title || 'Untitled Resume',
    template_id,
    content: content || {},
    customization: customization || {},
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Store in Redis with TTL
  await cache.set(`guest:resume:${resumeId}`, resumeData, GUEST_SESSION_TTL);

  // Add to session's resume list
  const sessionResumes = await cache.get(`guest:session:${sessionId}:resumes`) || [];
  sessionResumes.push(resumeId);
  await cache.set(`guest:session:${sessionId}:resumes`, sessionResumes, GUEST_SESSION_TTL);

  // Update session activity
  await cache.set(`guest:session:${sessionId}`, {
    ...session,
    lastActivity: new Date()
  }, GUEST_SESSION_TTL);

  res.status(201).json({
    success: true,
    data: resumeData
  });
});

// @desc    Get guest resume
// @route   GET /api/v1/guest/resume/:id
// @access  Public
exports.getGuestResume = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { sessionId } = req.query;

  if (!sessionId) {
    return next(new ErrorResponse('Session ID is required', 400));
  }

  const resume = await cache.get(`guest:resume:${id}`);

  if (!resume) {
    return next(new ErrorResponse('Resume not found or expired', 404));
  }

  // Verify session owns this resume
  if (resume.sessionId !== sessionId) {
    return next(new ErrorResponse('Unauthorized access', 403));
  }

  res.status(200).json({
    success: true,
    data: resume
  });
});

// @desc    Update guest resume
// @route   PUT /api/v1/guest/resume/:id
// @access  Public
exports.updateGuestResume = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { sessionId, title, content, customization } = req.body;

  if (!sessionId) {
    return next(new ErrorResponse('Session ID is required', 400));
  }

  const resume = await cache.get(`guest:resume:${id}`);

  if (!resume) {
    return next(new ErrorResponse('Resume not found or expired', 404));
  }

  // Verify session owns this resume
  if (resume.sessionId !== sessionId) {
    return next(new ErrorResponse('Unauthorized access', 403));
  }

  // Update resume data
  const updatedResume = {
    ...resume,
    ...(title && { title }),
    ...(content && { content }),
    ...(customization && { customization }),
    updatedAt: new Date()
  };

  await cache.set(`guest:resume:${id}`, updatedResume, GUEST_SESSION_TTL);

  res.status(200).json({
    success: true,
    data: updatedResume
  });
});

// @desc    Get all guest resumes for session
// @route   GET /api/v1/guest/resumes
// @access  Public
exports.getGuestResumes = asyncHandler(async (req, res, next) => {
  const { sessionId } = req.query;

  if (!sessionId) {
    return next(new ErrorResponse('Session ID is required', 400));
  }

  const resumeIds = await cache.get(`guest:session:${sessionId}:resumes`) || [];

  const resumes = await Promise.all(
    resumeIds.map(async (id) => {
      const resume = await cache.get(`guest:resume:${id}`);
      return resume;
    })
  );

  // Filter out expired resumes
  const validResumes = resumes.filter(r => r !== null);

  res.status(200).json({
    success: true,
    data: validResumes
  });
});

// @desc    Delete guest resume
// @route   DELETE /api/v1/guest/resume/:id
// @access  Public
exports.deleteGuestResume = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { sessionId } = req.query;

  if (!sessionId) {
    return next(new ErrorResponse('Session ID is required', 400));
  }

  const resume = await cache.get(`guest:resume:${id}`);

  if (!resume) {
    return next(new ErrorResponse('Resume not found or expired', 404));
  }

  // Verify session owns this resume
  if (resume.sessionId !== sessionId) {
    return next(new ErrorResponse('Unauthorized access', 403));
  }

  // Delete resume
  await cache.del(`guest:resume:${id}`);

  // Remove from session's resume list
  const resumeIds = await cache.get(`guest:session:${sessionId}:resumes`) || [];
  const updatedIds = resumeIds.filter(rid => rid !== id);
  await cache.set(`guest:session:${sessionId}:resumes`, updatedIds, GUEST_SESSION_TTL);

  res.status(200).json({
    success: true,
    message: 'Resume deleted successfully'
  });
});

// @desc    Migrate guest data to user account
// @route   POST /api/v1/guest/migrate
// @access  Private
exports.migrateGuestData = asyncHandler(async (req, res, next) => {
  const { sessionId } = req.body;
  const Resume = require('../models/Resume');

  if (!sessionId) {
    return next(new ErrorResponse('Session ID is required', 400));
  }

  // Get all guest resumes
  const resumeIds = await cache.get(`guest:session:${sessionId}:resumes`) || [];

  const migratedResumes = [];

  for (const id of resumeIds) {
    const guestResume = await cache.get(`guest:resume:${id}`);

    if (guestResume) {
      // Create permanent resume for user
      const resume = await Resume.create({
        user: req.user.id,
        template: guestResume.template_id,
        title: guestResume.title,
        content: guestResume.content,
        customization: guestResume.customization
      });

      migratedResumes.push(resume);

      // Delete guest resume
      await cache.del(`guest:resume:${id}`);
    }
  }

  // Clear guest session
  await cache.del(`guest:session:${sessionId}`);
  await cache.del(`guest:session:${sessionId}:resumes`);

  res.status(200).json({
    success: true,
    message: `Successfully migrated ${migratedResumes.length} resume(s)`,
    data: migratedResumes
  });
});
