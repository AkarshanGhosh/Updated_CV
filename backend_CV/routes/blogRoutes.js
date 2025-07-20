const express = require('express');
const {
  getAllBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes - all blog posts
router.get('/', getAllBlogPosts);
router.get('/:id', getBlogPost);

// Blog management routes (you can protect these if needed)
router.post('/', createBlogPost);
router.put('/:id', updateBlogPost);
router.delete('/:id', deleteBlogPost);

module.exports = router;