const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{ // Only 'images' array remaining, no separate thumbnail field
    type: String
  }],
  githubLink: {
    type: String,
    required: true
  },
  demoLink: {
    type: String,
    default: ''
  },
}, {
  timestamps: true
});

// Index for search functionality - updated to only use 'name' and 'description'
projectSchema.index({
  name: 'text',
  description: 'text'
});

module.exports = mongoose.model('Project', projectSchema);