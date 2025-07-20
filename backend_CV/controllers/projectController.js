// backend/controllers/projectController.js
const Project = require('../models/Project');
const { catchAsync, AppError } = require('../utils/errorHandler');
const { deleteImage, getPublicIdFromUrl } = require('../utils/cloudinary'); // Still needed for deletion

// Get all projects (public) with search
const getAllProjects = catchAsync(async (req, res, next) => {
  const { search, page = 1, limit = 10 } = req.query;

  let query = {};

  if (search) {
    query.$text = { $search: search };
  }

  const skip = (page - 1) * limit;

  const projects = await Project.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Project.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: projects.length,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: {
      projects
    }
  });
});

// Get single project (public)
const getProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      project
    }
  });
});

// Create new project (now expects JSON body with image URLs)
const createProject = catchAsync(async (req, res, next) => {
  const {
    name,
    description,
    images, // Expecting an array of URLs directly from the body
    githubLink,
    demoLink,
  } = req.body;

  if (!name || !description || !githubLink) {
    return next(new AppError('Please provide all required fields: name, description, githubLink', 400));
  }

  // Ensure images is an array, even if empty or single string
  const imageUrls = Array.isArray(images) ? images : (typeof images === 'string' && images.trim() !== '') ? images.split(',').map(url => url.trim()) : [];

  // You might want to add validation here to ensure images is not empty if required
  if (imageUrls.length === 0) {
      return next(new AppError('At least one image URL is required for a project.', 400));
  }

  const projectData = {
    name,
    description,
    images: imageUrls, // Directly use the provided URLs
    githubLink,
    demoLink: demoLink || '',
  };

  const project = await Project.create(projectData);

  res.status(201).json({
    status: 'success',
    data: {
      project
    }
  });
});

// Update project (now expects JSON body with image URLs)
const updateProject = catchAsync(async (req, res, next) => {
  const {
    name,
    description,
    images, // Expecting an array of URLs directly from the body
    githubLink,
    demoLink,
    clearImages // A flag to explicitly clear images if sent from frontend
  } = req.body;

  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  const updateData = {
    name: name !== undefined ? name : project.name,
    description: description !== undefined ? description : project.description,
    githubLink: githubLink !== undefined ? githubLink : project.githubLink,
    demoLink: demoLink !== undefined ? demoLink : project.demoLink,
  };

  // Handle images update:
  // If 'images' array is provided, use it.
  // If 'clearImages' is true, set images to empty array.
  // Otherwise, keep existing images.
  if (images !== undefined) {
      const newImageUrls = Array.isArray(images) ? images : (typeof images === 'string' && images.trim() !== '') ? images.split(',').map(url => url.trim()) : [];
      // If new images are provided, we should delete the old ones from Cloudinary.
      // This requires knowing the public IDs of the old images.
      // For simplicity here, we are just updating the URLs in the DB.
      // A more robust solution would involve sending public IDs from frontend for deletion.
      // For now, old images on Cloudinary will remain unless project is deleted.
      updateData.images = newImageUrls;
  } else if (clearImages === true) { // Explicitly clear images
      // Delete existing images from Cloudinary if explicitly asked to clear
      if (project.images && project.images.length > 0) {
          for (const imageUrl of project.images) {
              const publicId = getPublicIdFromUrl(imageUrl);
              await deleteImage(publicId);
          }
      }
      updateData.images = [];
  } else {
      // If images field is not provided in body, keep existing images
      updateData.images = project.images;
  }


  project = await Project.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      project
    }
  });
});

// Delete project (remains the same, deletes images from Cloudinary using URLs)
const deleteProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  // Delete associated images from Cloudinary
  if (project.images && project.images.length > 0) {
    for (const imageUrl of project.images) {
      const publicId = getPublicIdFromUrl(imageUrl);
      await deleteImage(publicId);
    }
  }

  await Project.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

module.exports = {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};