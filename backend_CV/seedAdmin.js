const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const HomePage = require('./models/HomePage');
const AboutPage = require('./models/AboutPage');

// Load env vars
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Create admin user
    const existingUser = await User.findOne({ email: 'akarshanghosh28@gmail.com' });
    
    if (!existingUser) {
      const adminUser = await User.create({
        email: 'akarshanghosh28@gmail.com',
        password: 'admin123', // Change this to a secure password
        isAdmin: true
      });
      console.log('✅ Admin user created:', adminUser.email);
    } else {
      console.log('✅ Admin user already exists');
    }

    // Create default HomePage content
    const existingHomePage = await HomePage.findOne({});
    
    if (!existingHomePage) {
      await HomePage.create({
        heroTitle: 'Hi, I\'m Akarshan Ghosh',
        heroSubtitle: 'Full Stack Developer & Tech Innovator',
        heroDescription: 'I create amazing digital experiences with modern technologies and innovative solutions.',
        callToAction: {
          text: 'Explore My Work',
          link: '/projects'
        },
        socialLinks: {
          linkedin: 'https://www.linkedin.com/in/akarshan-ghosh/',
          github: 'https://github.com/AkarshanGhosh',
          otherProfile: 'https://github.com/AkarshanGhosh28',
          email: 'akarshanghosh28@gmail.com'
        }
      });
      console.log('✅ Default HomePage content created');
    } else {
      console.log('✅ HomePage content already exists');
    }

    // Create default AboutPage content
    const existingAboutPage = await AboutPage.findOne({});
    
    if (!existingAboutPage) {
      await AboutPage.create({
        mainDescription: 'I am a passionate full-stack developer with expertise in modern web technologies. I love creating innovative solutions and bringing ideas to life through code.',
        skills: [
          { name: 'JavaScript', level: 'Advanced', category: 'Programming' },
          { name: 'React.js', level: 'Advanced', category: 'Frontend' },
          { name: 'Node.js', level: 'Advanced', category: 'Backend' },
          { name: 'MongoDB', level: 'Intermediate', category: 'Database' },
          { name: 'Python', level: 'Intermediate', category: 'Programming' }
        ]
      });
      console.log('✅ Default AboutPage content created');
    } else {
      console.log('✅ AboutPage content already exists');
    }

    console.log('\n🎉 Seeding completed successfully!');
    console.log('📧 Admin Email: akarshanghosh28@gmail.com');
    console.log('🔑 Admin Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
