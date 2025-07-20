const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  body: {
    type: String,
    required: [true, 'Body is required'],
    trim: true
  }
}, {
  timestamps: true // This will add createdAt and updatedAt automatically
});

// Index for search functionality
blogPostSchema.index({ 
  title: 'text', 
  body: 'text'
});

// Index for sorting by creation date
blogPostSchema.index({ createdAt: -1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);