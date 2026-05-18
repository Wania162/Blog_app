const User = require('../models/User');
const Post = require('../models/Post');

// Stats
exports.getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalPosts, totalViews] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Post.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
    ]);
    return res.json({
      success: true,
      data: {
        totalUsers,
        totalPosts,
        totalViews: totalViews[0]?.total || 0,
      },
    });
  } catch (err) { return next(err); }
};

// Saare users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json({ success: true, data: users });
  } catch (err) { return next(err); }
};

// Role change
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role galat hai' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User nahi mila' });
    return res.json({ success: true, data: user });
  } catch (err) { return next(err); }
};

// User delete
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User nahi mila' });
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Admin ko delete nahi kar sakte' });
    }
    await user.deleteOne();
    return res.json({ success: true, message: 'User delete ho gaya' });
  } catch (err) { return next(err); }
};

// Saari posts — admin
exports.getAllPostsAdmin = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    return res.json({ success: true, data: posts });
  } catch (err) { return next(err); }
};

// Koi bhi post delete — admin
exports.deletePostAdmin = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post nahi mili' });
    await post.deleteOne();
    return res.json({ success: true, message: 'Post delete ho gayi' });
  } catch (err) { return next(err); }
};