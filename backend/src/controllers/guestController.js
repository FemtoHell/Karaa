const { cache } = require('../config/redis');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../middleware/errorHandler');

// Guest session TTL: 24 hours
const GUEST_SESSION_TTL = 24 * 60 * 60;

// In-memory fallback storage when Redis is unavailable
const memoryStore = {
  sessions: new Map(),
  resumes: new Map(),
  sessionResumes: new Map()
};

// Helper to get data from Redis or memory fallback
const getData = async (key) => {
  try {
    const redisData = await cache.get(key);
    if (redisData !== null) {
      console.log(`✅ Redis GET success for key: ${key}`);
      return redisData;
    }
  } catch (error) {
    console.warn(`⚠️ Redis GET failed for ${key}, using memory fallback:`, error.message);
  }

  // Fallback to memory
  let memoryData = null;
  if (key.startsWith('guest:session:') && key.endsWith(':resumes')) {
    memoryData = memoryStore.sessionResumes.get(key);
  } else if (key.startsWith('guest:resume:')) {
    memoryData = memoryStore.resumes.get(key);
  } else if (key.startsWith('guest:session:')) {
    memoryData = memoryStore.sessions.get(key);
  }

  if (memoryData) {
    console.log(`✅ Memory GET success for key: ${key}`);
  } else {
    console.log(`❌ Data not found in memory for key: ${key}`);
  }

  return memoryData || null;
};

// Helper to set data to Redis and memory fallback
const setData = async (key, value, ttl) => {
  // Always store in memory first (to ensure data is saved even if Redis fails)
  if (key.startsWith('guest:session:') && key.endsWith(':resumes')) {
    memoryStore.sessionResumes.set(key, value);
    console.log(`✅ Memory SET success for session resumes: ${key}`);
  } else if (key.startsWith('guest:resume:')) {
    memoryStore.resumes.set(key, value);
    console.log(`✅ Memory SET success for resume: ${key}`);
  } else if (key.startsWith('guest:session:')) {
    memoryStore.sessions.set(key, value);
    console.log(`✅ Memory SET success for session: ${key}`);
  }

  // Try to store in Redis (non-blocking)
  try {
    await cache.set(key, value, ttl);
    console.log(`✅ Redis SET success for key: ${key}`);
  } catch (error) {
    console.warn(`⚠️ Redis SET failed for ${key}, data saved in memory:`, error.message);
  }

  // Set cleanup timer for memory store
  setTimeout(() => {
    if (key.startsWith('guest:session:') && key.endsWith(':resumes')) {
      memoryStore.sessionResumes.delete(key);
    } else if (key.startsWith('guest:resume:')) {
      memoryStore.resumes.delete(key);
    } else if (key.startsWith('guest:session:')) {
      memoryStore.sessions.delete(key);
    }
    console.log(`🗑️ Memory cleanup for key: ${key}`);
  }, ttl * 1000);
};

// Helper to delete data from both Redis and memory
const deleteData = async (key) => {
  try {
    await cache.del(key);
    console.log(`✅ Redis DEL success for key: ${key}`);
  } catch (error) {
    console.warn(`⚠️ Redis DEL failed for ${key}:`, error.message);
  }

  // Always delete from memory
  memoryStore.sessions.delete(key);
  memoryStore.resumes.delete(key);
  memoryStore.sessionResumes.delete(key);
  console.log(`✅ Memory DEL success for key: ${key}`);
};

// @desc    Create guest session
// @route   POST /api/v1/guest/session
// @access  Public
exports.createGuestSession = asyncHandler(async (req, res, next) => {
  const sessionId = uuidv4();

  console.log(`🎫 Creating guest session: ${sessionId}`);

  // Store session in Redis (with memory fallback)
  await setData(`guest:session:${sessionId}`, {
    created: new Date(),
    lastActivity: new Date()
  }, GUEST_SESSION_TTL);

  console.log(`✅ Guest session created successfully: ${sessionId}`);

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

  console.log('📝 Save Guest Resume Request:', {
    sessionId,
    title,
    template_id,
    hasContent: !!content,
    hasCustomization: !!customization
  });

  if (!sessionId) {
    console.error('❌ Session ID missing in request');
    return next(new ErrorResponse('Session ID is required', 400));
  }

  // Check if session exists
  console.log(`🔍 Checking session: guest:session:${sessionId}`);
  const session = await getData(`guest:session:${sessionId}`);

  if (!session) {
    console.error(`❌ Session not found or expired: ${sessionId}`);
    console.log('📊 Current memory store state:', {
      sessions: Array.from(memoryStore.sessions.keys()),
      resumes: Array.from(memoryStore.resumes.keys()),
      sessionResumes: Array.from(memoryStore.sessionResumes.keys())
    });
    return next(new ErrorResponse('Session expired or invalid', 401));
  }

  console.log(`✅ Session found: ${sessionId}`, session);

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

  // Store in Redis (with memory fallback)
  await setData(`guest:resume:${resumeId}`, resumeData, GUEST_SESSION_TTL);

  // Add to session's resume list
  const sessionResumes = await getData(`guest:session:${sessionId}:resumes`) || [];
  sessionResumes.push(resumeId);
  await setData(`guest:session:${sessionId}:resumes`, sessionResumes, GUEST_SESSION_TTL);

  // Update session activity
  await setData(`guest:session:${sessionId}`, {
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

  const resume = await getData(`guest:resume:${id}`);

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

  const resume = await getData(`guest:resume:${id}`);

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

  await setData(`guest:resume:${id}`, updatedResume, GUEST_SESSION_TTL);

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

  console.log(`📂 Get Guest Resumes Request - sessionId: ${sessionId}`);

  if (!sessionId) {
    console.error('❌ Session ID missing in query');
    return next(new ErrorResponse('Session ID is required', 400));
  }

  const resumeIds = await getData(`guest:session:${sessionId}:resumes`) || [];
  console.log(`📋 Found ${resumeIds.length} resume IDs for session ${sessionId}:`, resumeIds);

  const resumes = await Promise.all(
    resumeIds.map(async (id) => {
      const resume = await getData(`guest:resume:${id}`);
      return resume;
    })
  );

  // Filter out expired resumes
  const validResumes = resumes.filter(r => r !== null);
  console.log(`✅ Returning ${validResumes.length} valid resumes`);

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

  const resume = await getData(`guest:resume:${id}`);

  if (!resume) {
    return next(new ErrorResponse('Resume not found or expired', 404));
  }

  // Verify session owns this resume
  if (resume.sessionId !== sessionId) {
    return next(new ErrorResponse('Unauthorized access', 403));
  }

  // Delete resume
  await deleteData(`guest:resume:${id}`);

  // Remove from session's resume list
  const resumeIds = await getData(`guest:session:${sessionId}:resumes`) || [];
  const updatedIds = resumeIds.filter(rid => rid !== id);
  await setData(`guest:session:${sessionId}:resumes`, updatedIds, GUEST_SESSION_TTL);

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
  const resumeIds = await getData(`guest:session:${sessionId}:resumes`) || [];

  const migratedResumes = [];

  for (const id of resumeIds) {
    const guestResume = await getData(`guest:resume:${id}`);

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
      await deleteData(`guest:resume:${id}`);
    }
  }

  // Clear guest session
  await deleteData(`guest:session:${sessionId}`);
  await deleteData(`guest:session:${sessionId}:resumes`);

  res.status(200).json({
    success: true,
    message: `Successfully migrated ${migratedResumes.length} resume(s)`,
    data: migratedResumes
  });
});
