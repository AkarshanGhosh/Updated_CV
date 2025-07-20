const mongoose = require('mongoose');

const homePageSchema = new mongoose.Schema({
  heroTitle: {
    type: String,
    required: true,
    default: 'Welcome to My Portfolio'
  },
  heroSubtitle: {
    type: String,
    required: true,
    default: 'Full Stack Developer & Tech Enthusiast'
  },
  heroDescription: {
    type: String,
    required: true,
    default: 'I create amazing digital experiences with modern technologies'
  },
  profileImage: {
    type: String,
    default: ''
  },
  callToAction: {
    text: {
      type: String,
      default: 'View My Work'
    },
    link: {
      type: String,
      default: '/projects'
    }
  },
  socialLinks: {
    linkedin: {
      type: String,
      default: 'https://www.linkedin.com/in/akarshan-ghosh/'
    },
    github: {
      type: String,
      default: 'https://github.com/AkarshanGhosh'
    },
    otherProfile: {
      type: String,
      default: 'https://github.com/AkarshanGhosh28'
    },
    email: {
      type: String,
      default: 'akarshanghosh28@gmail.com'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HomePage', homePageSchema);