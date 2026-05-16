const express = require('express');
const router  = express.Router();
const {
  getAllPosts, getSinglePost, createPost,
  updatePost, deletePost, getMyPosts,
} = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');
const { getCloudinary } = require('../config/cloudinary');

const { uploadAvatar } = getCloudinary();

router.get('/',       getAllPosts);
router.get('/mine',   protect, getMyPosts);
router.get('/:id',    getSinglePost);
router.post('/',      protect, uploadAvatar.single('image'), createPost);
router.put('/:id',    protect, uploadAvatar.single('image'), updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;