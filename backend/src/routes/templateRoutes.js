const express = require('express');
const {
  getTemplates,
  getTemplate,
  getCategories,
  getPopularTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate
} = require('../controllers/templateController');
const { protect, authorize } = require('../middleware/auth');
const { templateValidation } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', getTemplates);
router.get('/categories', getCategories);
router.get('/popular', getPopularTemplates);
router.get('/:id', templateValidation.getOne, getTemplate);

// Admin only routes
router.post('/', protect, authorize('admin'), createTemplate);
router.put('/:id', protect, authorize('admin'), updateTemplate);
router.delete('/:id', protect, authorize('admin'), deleteTemplate);

module.exports = router;
