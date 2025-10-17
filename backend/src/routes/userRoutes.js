const express = require('express');
const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  permanentDeleteAccount,
  uploadAvatar,
  getUserActivity
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { userValidation } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/profile')
  .get(getProfile)
  .put(userValidation.updateProfile, updateProfile);

router.put('/change-password', userValidation.changePassword, changePassword);
router.delete('/account', deleteAccount);
router.delete('/account/permanent', userValidation.permanentDelete, permanentDeleteAccount); // FR-7.2: Permanent account deletion
router.post('/avatar', uploadAvatar); // Add multer middleware in app.js
router.get('/activity', getUserActivity);

module.exports = router;
