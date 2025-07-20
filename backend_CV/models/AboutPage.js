const mongoose = require('mongoose');

const aboutPageSchema = new mongoose.Schema({
  mainDescription: {
    type: String,
    required: true,
    default: 'I am a passionate full-stack developer with experience in modern web technologies.'
  },
  skills: [{
    name: {
      type: String,
      required: true
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      required: true
    },
    category: {
      type: String,
      default: 'General'
    }
  }],
  experience: [{
    title: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    technologies: [String]
  }],
  education: [{
    degree: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    year: {
      type: String,
      required: true
    },
    grade: {
      type: String
    }
  }],
  aboutImage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AboutPage', aboutPageSchema);