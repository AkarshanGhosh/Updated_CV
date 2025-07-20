// backend/routes/projectRoutes.js
const express = require('express');
const {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
// const { upload } = require('../utils/cloudinary'); // REMOVED: No longer needed for POST/PUT here

const router = express.Router();

// Public routes
router.get('/', getAllProjects);
router.get('/:id', getProject);

// Project management routes (now expect JSON body for images)
router.post('/', createProject); // Removed upload.fields
router.put('/:id', updateProject); // Removed upload.fields
router.delete('/:id', deleteProject);

module.exports = router;