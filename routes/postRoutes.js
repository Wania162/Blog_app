const express = require('express');
const router  = express.Router();
const {
  getAllPosts, getSinglePost, createPost,
  updatePost, deletePost, getMyPosts,
} = require('../controllers/postController');
const { protect }         = require('../middlewares/authMiddleware');
const { uploadPostImage } = require('../config/cloudinary');

router.get('/',       getAllPosts);
router.get('/mine',   protect, getMyPosts);
router.get('/:id',    getSinglePost);

// uploadPostImage.single('image') — image upload middleware
router.post('/',      protect, uploadPostImage.single('image'), createPost);
router.put('/:id',    protect, uploadPostImage.single('image'), updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;