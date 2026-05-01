const User           = require('../models/User');
const { cloudinary } = require('../config/cloudinary');

// Avatar upload
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Photo select karo' });
    }

    // Purani pic delete karo
    if (req.user.avatarPublicId) {
      try {
        await cloudinary.uploader.destroy(req.user.avatarPublicId);
      } catch (e) {
        console.log('Old avatar delete failed:', e.message);
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        avatar:         req.file.path,
        avatarPublicId: req.file.filename,
      },
      { new: true, returnDocument: 'after' }
    );

    return res.status(200).json({
      success: true,
      message: 'Profile picture updated!',
      avatar:  user.avatar,
    });
  } catch (err) {
    return next(err);
  }
};

// Profile update
exports.updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true, returnDocument: 'after' }
    );
    return res.status(200).json({ success: true, user });
  } catch (err) {
    return next(err);
  }
};

// User profile dekho
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User nahi mila' });
    }
    return res.status(200).json({ success: true, user });
  } catch (err) {
    return next(err);
  }
};

// Avatar delete
exports.deleteAvatar = async (req, res, next) => {
  try {
    if (!req.user.avatarPublicId) {
      return res.status(400).json({ success: false, message: 'Koi avatar nahi hai' });
    }

    try {
      await cloudinary.uploader.destroy(req.user.avatarPublicId);
    } catch (e) {
      console.log('Cloudinary delete failed:', e.message);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: '', avatarPublicId: '' },
      { new: true, returnDocument: 'after' }
    );

    return res.status(200).json({ success: true, message: 'Avatar delete ho gaya', user });
  } catch (err) {
    return next(err);
  }
};