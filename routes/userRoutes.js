const express    = require('express');
const router     = express.Router();
const { uploadAvatar, updateProfile, getUserProfile, deleteAvatar } = require('../controllers/userControllers');
const { protect }      = require('../middlewares/authMiddleware');
const { uploadAvatar: uploadAvatarMiddleware } = require('../config/cloudinary');

router.put('/update',    protect, updateProfile);
router.post('/avatar',   protect, uploadAvatarMiddleware.single('avatar'), uploadAvatar);
router.delete('/avatar', protect, deleteAvatar);
router.get('/:id',       getUserProfile);

module.exports = router;