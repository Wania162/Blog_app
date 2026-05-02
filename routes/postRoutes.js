const express = require('express');
const router  = express.Router();
const {
  getAllPosts, getSinglePost, createPost,
  updatePost, deletePost, getMyPosts,
} = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/',       getAllPosts);
router.get('/mine',   protect, getMyPosts);
router.get('/:id',    getSinglePost);
router.post('/',      protect, createPost);
router.put('/:id',    protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;