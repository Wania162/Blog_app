const User = require('../models/User');

exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Photo select karo' });
    }
    const { cloudinary } = require('../config/cloudinary').getCloudinary();
    if (req.user.avatarPublicId) {
      await cloudinary.uploader.destroy(req.user.avatarPublicId).catch(() => {});
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.file.path, avatarPublicId: req.file.filename },
      { new: true }
    ).select('-password');
    return res.json({ success: true, avatar: user.avatar, user });
  } catch (err) { return next(err); }
};

exports.deleteAvatar = async (req, res, next) => {
  try {
    const { cloudinary } = require('../config/cloudinary').getCloudinary();
    if (req.user.avatarPublicId) {
      await cloudinary.uploader.destroy(req.user.avatarPublicId).catch(() => {});
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: '', avatarPublicId: '' },
      { new: true }
    ).select('-password');
    return res.json({ success: true, message: 'Avatar delete ho gaya', user });
  } catch (err) { return next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: req.body.name },
      { new: true }
    ).select('-password');
    return res.json({ success: true, user });
  } catch (err) { return next(err); }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User nahi mila' });
    return res.json({ success: true, user });
  } catch (err) { return next(err); }
};