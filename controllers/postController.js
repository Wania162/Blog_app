const Post           = require('../models/Post');
const { cloudinary } = require('../config/cloudinary');

// Saare posts
exports.getAllPosts = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 6;

    const [posts, total] = await Promise.all([
      Post.find({ published: true })
          .populate('author', 'name email avatar')
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit),
      Post.countDocuments({ published: true }),
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: { currentPage: page, totalPages: Math.ceil(total / limit), total },
    });
  } catch (err) { next(err); }
};

// Ek post
exports.getSinglePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email avatar');
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    post.views += 1;
    await post.save({ validateBeforeSave: false });

    res.json({ success: true, data: post });
  } catch (err) { next(err); }
};

// Naya post — image ke saath
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;

    const postData = {
      title,
      content,
      tags:   Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      author: req.user._id,
    };

    // Agar image upload hui hai
    if (req.file) {
      postData.image         = req.file.path;
      postData.imagePublicId = req.file.filename;
    }

    const post      = await Post.create(postData);
    const populated = await post.populate('author', 'name email avatar');
    res.status(201).json({ success: true, data: populated });
  } catch (err) { next(err); }
};

// Update post
exports.updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You are not the owner of this post' });
    }

    // Nai image upload hui hai toh purani delete karo
    if (req.file) {
      if (post.imagePublicId) {
        await cloudinary.uploader.destroy(post.imagePublicId);
      }
      req.body.image         = req.file.path;
      req.body.imagePublicId = req.file.filename;
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: post });
  } catch (err) { next(err); }
};

// Delete post
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You are not the owner of this post' });
    }

    // Cloudinary se image bhi delete karo
    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId);
    }

    await post.deleteOne();
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (err) { next(err); }
};

// Mere posts
exports.getMyPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (err) { next(err); }
};