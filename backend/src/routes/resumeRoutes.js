const express = require('express');
const {
  getResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
  getResumeStats,
  generateShareLink,
  updateShareSettings,
  getSharedResume,
  saveVersion,
  getVersionHistory,
  restoreVersion,
  compareVersions,
  exportDocx,
  exportSharedDocx
} = require('../controllers/resumeController');
const { exportPdf, exportSharedPdf, exportPdfFromHtml } = require('../controllers/pdfExport');
const { protect } = require('../middleware/auth');
const { resumeValidation } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/share/:shareId', getSharedResume);
router.get('/share/:shareId/export/docx', exportSharedDocx);
router.get('/share/:shareId/export/pdf', exportSharedPdf);

// All other routes require authentication
router.use(protect);

router.route('/')
  .get(getResumes)
  .post(resumeValidation.create, createResume);

router.get('/stats', getResumeStats);

router.route('/:id')
  .get(getResume)
  .put(resumeValidation.update, updateResume)
  .delete(resumeValidation.delete, deleteResume);

router.post('/:id/duplicate', duplicateResume);

// Export routes
router.get('/:id/export/docx', exportDocx);
router.get('/:id/export/pdf', exportPdf);
router.post('/:id/export/pdf-html', exportPdfFromHtml);

// Sharing routes
router.post('/:id/share', generateShareLink);
router.put('/:id/share', updateShareSettings);

// Version control routes
router.post('/:id/version', saveVersion);
router.get('/:id/versions', getVersionHistory);
router.post('/:id/restore/:version', restoreVersion);
router.get('/:id/compare/:v1/:v2', compareVersions);

module.exports = router;
