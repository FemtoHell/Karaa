const express = require('express');
const {
  getGuides,
  getGuide,
  getGuidesByIndustry,
  createGuide,
  updateGuide,
  deleteGuide,
  likeGuide
} = require('../controllers/guideController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getGuides);
router.get('/:slug', getGuide);
router.get('/industry/:industry', getGuidesByIndustry);
router.post('/:id/like', likeGuide);

// Admin only routes
router.post('/', protect, authorize('admin'), createGuide);
router.put('/:id', protect, authorize('admin'), updateGuide);
router.delete('/:id', protect, authorize('admin'), deleteGuide);

module.exports = router;
