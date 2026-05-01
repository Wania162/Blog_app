const User = require('../models/User');
const { cloudinary } = require('../config/cloudinary');

// Profile picture upload
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Photo select' });
    }

    // Purani pic delete karo Cloudinary se
    if (req.user.avatarPublicId) {
      await cloudinary.uploader.destroy(req.user.avatarPublicId);
    }

    // Naya avatar save karo
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        avatar:        req.file.path,
        avatarPublicId: req.file.filename,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Profile picture updated successfully',
      avatar:  user.avatar,
    });
  } catch (err) { next(err); }
};

// Profile info update
exports.updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

// Kisi bhi user ki profile dekho
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) { next(err); }
};
// Avatar delete karo
exports.deleteAvatar = async (req, res, next) => {
  try {
    if (!req.user.avatarPublicId) {
      return res.status(400).json({ success: false, message: 'No avatar to delete' });
    }

    // Cloudinary se delete karo
    await cloudinary.uploader.destroy(req.user.avatarPublicId);

    // DB se bhi hata do
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: '', avatarPublicId: '' },
      { new: true }
    );

    res.json({ success: true, message: 'Avatar deleted successfully', user });
  } catch (err) { next(err); }
};