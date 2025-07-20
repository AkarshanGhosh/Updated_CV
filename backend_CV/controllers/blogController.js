const BlogPost = require('../models/BlogPost');
const { catchAsync, AppError } = require('../utils/errorHandler');
const mongoose = require('mongoose');

// Input validation helper
const validateBlogPostInput = (title, body) => {
  const errors = [];
  
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  }
  
  if (!body || typeof body !== 'string' || body.trim().length === 0) {
    errors.push('Body is required and must be a non-empty string');
  }
  
  if (title && title.trim().length > 200) {
    errors.push('Title must be less than 200 characters');
  }
  
  return errors;
};

// Validate MongoDB ObjectId
const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid blog post ID', 400);
  }
};

// Get all blog posts
const getAllBlogPosts = catchAsync(async (req, res, next) => {
  const { search, page = 1, limit = 10 } = req.query;
  
  // Validate and sanitize pagination params
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 10)); // Cap at 50
  
  let query = {};
  
  // Add search functionality
  if (search && typeof search === 'string' && search.trim()) {
    query.$text = { $search: search.trim() };
  }
  
  const skip = (pageNum - 1) * limitNum;
  
  const blogPosts = await BlogPost.find(query)
    .sort({ createdAt: -1 }) // Sort by newest first
    .skip(skip)
    .limit(limitNum)
    .lean(); // Use lean() for better performance
    
  const total = await BlogPost.countDocuments(query);
  
  res.status(200).json({
    status: 'success',
    results: blogPosts.length,
    totalPages: Math.ceil(total / limitNum),
    currentPage: pageNum,
    data: {
      blogPosts
    }
  });
});

// Get single blog post
const getBlogPost = catchAsync(async (req, res, next) => {
  validateObjectId(req.params.id);
  
  const blogPost = await BlogPost.findById(req.params.id).lean();
  
  if (!blogPost) {
    return next(new AppError('Blog post not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      blogPost
    }
  });
});

// Create new blog post
const createBlogPost = catchAsync(async (req, res, next) => {
  const { title, body } = req.body;

  // Validate input
  const validationErrors = validateBlogPostInput(title, body);
  if (validationErrors.length > 0) {
    return next(new AppError(validationErrors.join('. '), 400));
  }

  const blogPostData = {
    title: title.trim(),
    body: body.trim()
  };

  const blogPost = await BlogPost.create(blogPostData);

  res.status(201).json({
    status: 'success',
    data: {
      blogPost
    }
  });
});

// Update blog post
const updateBlogPost = catchAsync(async (req, res, next) => {
  const { title, body } = req.body;
  
  validateObjectId(req.params.id);

  const blogPost = await BlogPost.findById(req.params.id);

  if (!blogPost) {
    return next(new AppError('Blog post not found', 404));
  }

  // Build update object only with provided fields
  const updateData = {};
  
  if (title !== undefined) {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return next(new AppError('Title must be a non-empty string', 400));
    }
    if (title.trim().length > 200) {
      return next(new AppError('Title must be less than 200 characters', 400));
    }
    updateData.title = title.trim();
  }
  
  if (body !== undefined) {
    if (!body || typeof body !== 'string' || body.trim().length === 0) {
      return next(new AppError('Body must be a non-empty string', 400));
    }
    updateData.body = body.trim();
  }

  // Only update if there are changes
  if (Object.keys(updateData).length === 0) {
    return next(new AppError('No valid fields to update', 400));
  }

  const updatedBlogPost = await BlogPost.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      blogPost: updatedBlogPost
    }
  });
});

// Delete blog post
const deleteBlogPost = catchAsync(async (req, res, next) => {
  validateObjectId(req.params.id);
  
  const blogPost = await BlogPost.findById(req.params.id);

  if (!blogPost) {
    return next(new AppError('Blog post not found', 404));
  }

  await BlogPost.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

module.exports = {
  getAllBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
};