const Resume = require('../models/Resume');
const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../middleware/errorHandler');
const { decryptResumePersonalData } = require('../utils/encryption');
const { generatePdf } = require('../utils/pdfGenerator');

// @desc    Export resume as PDF
// @route   GET /api/v1/resumes/:id/export/pdf
// @access  Private
exports.exportPdf = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const resume = await Resume.findOne({
    _id: id,
    user: req.user.id,
    deletedAt: null
  });

  if (!resume) {
    return next(new ErrorResponse('Resume not found', 404));
  }

  try {
    // Decrypt personal data before exporting
    const decryptedContent = decryptResumePersonalData(resume.content);

    // Generate PDF buffer
    const buffer = await generatePdf({
      content: decryptedContent,
      customization: resume.customization
    });

    // Set response headers with CORS
    const fileName = `${decryptedContent.personal?.fullName || 'Resume'}_${resume.title}.pdf`.replace(/\s+/g, '_');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Send buffer
    res.send(buffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    return next(new ErrorResponse('Failed to generate PDF file', 500));
  }
});

// @desc    Export shared resume as PDF (public)
// @route   GET /api/v1/resumes/share/:shareId/export/pdf
// @access  Public
exports.exportSharedPdf = asyncHandler(async (req, res, next) => {
  const { shareId } = req.params;
  const { password } = req.query;

  const resume = await Resume.findOne({
    shareId,
    isPublic: true,
    deletedAt: null
  });

  if (!resume) {
    return next(new ErrorResponse('Shared resume not found or is private', 404));
  }

  // Check if expired
  if (resume.shareSettings.expiresAt && new Date() > resume.shareSettings.expiresAt) {
    return next(new ErrorResponse('This shared link has expired', 410));
  }

  // Check password if set
  if (resume.shareSettings.password && resume.shareSettings.password !== password) {
    return next(new ErrorResponse('Incorrect password', 401));
  }

  // Check if download is allowed
  if (!resume.shareSettings.allowDownload) {
    return next(new ErrorResponse('Download is not allowed for this resume', 403));
  }

  try {
    // Decrypt personal data before exporting
    const decryptedContent = decryptResumePersonalData(resume.content);

    // Generate PDF buffer
    const buffer = await generatePdf({
      content: decryptedContent,
      customization: resume.customization
    });

    // Set response headers with CORS
    const fileName = `${decryptedContent.personal?.fullName || 'Resume'}_${resume.title}.pdf`.replace(/\s+/g, '_');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Send buffer
    res.send(buffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    return next(new ErrorResponse('Failed to generate PDF file', 500));
  }
});
