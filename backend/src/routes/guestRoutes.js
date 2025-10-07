const express = require('express');
const {
  createGuestSession,
  saveGuestResume,
  getGuestResume,
  updateGuestResume,
  getGuestResumes,
  deleteGuestResume,
  migrateGuestData
} = require('../controllers/guestController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes - no authentication required
router.post('/session', createGuestSession);
router.post('/resume', saveGuestResume);
router.get('/resume/:id', getGuestResume);
router.put('/resume/:id', updateGuestResume);
router.get('/resumes', getGuestResumes);
router.delete('/resume/:id', deleteGuestResume);

// Protected route - requires authentication to migrate
router.post('/migrate', protect, migrateGuestData);

module.exports = router;
