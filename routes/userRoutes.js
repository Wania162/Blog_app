const express = require('express');
const router  = express.Router();
const {
  uploadAvatar, deleteAvatar,
  updateProfile, getUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// Upload middleware lazily load karo
const avatarUpload = (req, res, next) => {
  const { uploadAvatar: upload } = require('../config/cloudinary').getCloudinary();
  upload.single('avatar')(req, res, next);
};

router.put('/update',    protect, updateProfile);
router.post('/avatar',   protect, avatarUpload, uploadAvatar);
router.delete('/avatar', protect, deleteAvatar);
router.get('/:id',       getUserProfile);

module.exports = router;