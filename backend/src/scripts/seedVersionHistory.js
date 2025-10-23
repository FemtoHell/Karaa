const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Resume = require('../models/Resume');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Sample data for versions
const sampleContent = {
  personal: {
    fullName: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johnsmith',
    website: 'johnsmith.dev',
    summary: 'Experienced software engineer with 5+ years of expertise in full-stack development.'
  },
  experience: [
    {
      jobTitle: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      startDate: '2022-01',
      endDate: '',
      current: true,
      description: 'Leading development of cloud-based applications using React and Node.js. Mentoring junior developers and implementing best practices.'
    },
    {
      jobTitle: 'Software Engineer',
      company: 'StartupXYZ',
      location: 'San Francisco, CA',
      startDate: '2020-03',
      endDate: '2021-12',
      current: false,
      description: 'Built scalable web applications using modern JavaScript frameworks. Collaborated with cross-functional teams to deliver high-quality products.'
    },
    {
      jobTitle: 'Junior Developer',
      company: 'WebSolutions Inc',
      location: 'San Francisco, CA',
      startDate: '2019-06',
      endDate: '2020-02',
      current: false,
      description: 'Developed responsive web applications and maintained existing codebases. Gained experience in Agile development methodologies.'
    }
  ],
  education: [
    {
      degree: 'Bachelor of Science in Computer Science',
      school: 'Stanford University',
      location: 'Stanford, CA',
      startDate: '2015-09',
      endDate: '2019-05',
      gpa: '3.8',
      description: 'Focus on Software Engineering and Artificial Intelligence'
    }
  ],
  skills: {
    technical: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS'],
    soft: ['Team Leadership', 'Problem Solving', 'Communication', 'Agile Methodologies'],
    languages: ['English (Native)', 'Spanish (Intermediate)']
  },
  projects: [
    {
      name: 'E-Commerce Platform',
      description: 'Built a full-stack e-commerce platform with React, Node.js, and MongoDB. Implemented payment integration and real-time inventory management.',
      technologies: 'React, Node.js, MongoDB, Stripe API',
      link: 'github.com/johnsmith/ecommerce',
      startDate: '2023-01',
      endDate: '2023-06'
    },
    {
      name: 'Task Management App',
      description: 'Developed a collaborative task management application with real-time updates using WebSocket.',
      technologies: 'Vue.js, Express, Socket.io, MySQL',
      link: 'github.com/johnsmith/taskmanager',
      startDate: '2022-08',
      endDate: '2022-12'
    }
  ],
  certificates: [
    {
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2023-03',
      link: 'aws.amazon.com/certification',
      description: 'Professional level certification for designing distributed systems on AWS'
    },
    {
      name: 'React Developer Certification',
      issuer: 'Meta',
      date: '2022-11',
      link: 'coursera.org/meta-react',
      description: 'Advanced React development certification'
    }
  ],
  activities: [
    {
      title: 'Tech Meetup Organizer',
      organization: 'SF JavaScript Community',
      startDate: '2022-01',
      endDate: '',
      description: 'Organize monthly meetups for JavaScript developers in San Francisco area'
    }
  ]
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

// Add version history to existing resumes
const seedVersionHistory = async () => {
  try {
    console.log('\n🔄 Adding version history to resumes...\n');

    // Get all resumes
    const resumes = await Resume.find({ deletedAt: null });

    if (resumes.length === 0) {
      console.log('⚠️  No resumes found. Please create some resumes first.');
      return;
    }

    console.log(`📋 Found ${resumes.length} resume(s)\n`);

    for (const resume of resumes) {
      // Skip if already has version history
      if (resume.versionHistory && resume.versionHistory.length > 0) {
        console.log(`⏭️  Resume "${resume.title}" already has ${resume.versionHistory.length} version(s), skipping...`);
        continue;
      }

      console.log(`📝 Processing: "${resume.title}"`);

      // Create version history with progressive improvements
      const versions = [];

      // Version 1 - Initial draft (30 days ago)
      const v1Content = {
        personal: { ...sampleContent.personal },
        experience: sampleContent.experience.slice(0, 1), // Only first job
        education: sampleContent.education,
        skills: {
          technical: sampleContent.skills.technical.slice(0, 4),
          soft: sampleContent.skills.soft.slice(0, 2),
          languages: sampleContent.skills.languages
        },
        projects: [],
        certificates: [],
        activities: []
      };

      versions.push({
        version: 1,
        content: v1Content,
        customization: {
          font: 'Inter',
          fontSize: 'medium',
          colorScheme: 'blue',
          spacing: 'normal',
          layout: 'single-column'
        },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        comment: 'Initial draft - Added basic information'
      });

      // Version 2 - Added more experience (15 days ago)
      const v2Content = {
        personal: { ...sampleContent.personal },
        experience: sampleContent.experience.slice(0, 2), // First 2 jobs
        education: sampleContent.education,
        skills: {
          technical: sampleContent.skills.technical.slice(0, 6),
          soft: sampleContent.skills.soft.slice(0, 3),
          languages: sampleContent.skills.languages
        },
        projects: sampleContent.projects.slice(0, 1), // First project
        certificates: [],
        activities: []
      };

      versions.push({
        version: 2,
        content: v2Content,
        customization: {
          font: 'Poppins',
          fontSize: 'medium',
          colorScheme: 'green',
          spacing: 'normal',
          layout: 'single-column'
        },
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        comment: 'Added more work experience and skills'
      });

      // Version 3 - Complete version (7 days ago)
      const v3Content = {
        personal: { ...sampleContent.personal },
        experience: sampleContent.experience, // All jobs
        education: sampleContent.education,
        skills: sampleContent.skills, // All skills
        projects: sampleContent.projects, // All projects
        certificates: sampleContent.certificates.slice(0, 1), // First certificate
        activities: []
      };

      versions.push({
        version: 3,
        content: v3Content,
        customization: {
          font: 'Poppins',
          fontSize: 'medium',
          colorScheme: 'purple',
          spacing: 'normal',
          layout: 'two-column'
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        comment: 'Added projects and certificates'
      });

      // Update resume with version history
      resume.versionHistory = versions;
      resume.version = 4; // Current version is 4

      // Update current content to be the most complete
      resume.content = { ...sampleContent };

      await resume.save();

      console.log(`   ✅ Added 3 versions to "${resume.title}"`);
      console.log(`   📊 Versions: v1 (30d ago) → v2 (15d ago) → v3 (7d ago) → v4 (current)\n`);
    }

    console.log('✨ Version history seeded successfully!\n');
  } catch (error) {
    console.error('❌ Error seeding version history:', error);
    throw error;
  }
};

// Run the script
const run = async () => {
  try {
    await connectDB();
    await seedVersionHistory();
    console.log('🎉 Done! You can now compare versions in the app.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
};

run();
