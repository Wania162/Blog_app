const express = require('express');
const router  = express.Router();
const {
  getStats, getAllUsers, updateUserRole,
  deleteUser, getAllPostsAdmin, deletePostAdmin,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Saare routes protected + admin only
router.use(protect, adminOnly);

router.get('/stats',          getStats);
router.get('/users',          getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id',   deleteUser);
router.get('/posts',          getAllPostsAdmin);
router.delete('/posts/:id',   deletePostAdmin);

module.exports = router;