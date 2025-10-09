const { redisClient, connectRedis } = require('../config/redis');
const mongoose = require('mongoose');
const Template = require('../models/Template');
require('dotenv').config();

// Template data with correct Unsplash images
const templateData = [
  {
    name: 'Modern Professional',
    category: 'modern',
    color: 'purple',
    description: 'Clean and modern design perfect for tech professionals',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=500&fit=crop&q=80',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    config: {
      layout: 'two-column',
      primaryFont: 'Inter',
      secondaryFont: 'Roboto',
      colors: { primary: '#667eea', secondary: '#764ba2', text: '#333333', background: '#ffffff' },
      sections: ['header', 'summary', 'experience', 'education', 'skills', 'certifications']
    }
  },
  {
    name: 'Creative Designer',
    category: 'creative',
    color: 'red',
    description: 'Bold and creative layout for designers and artists',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=500&fit=crop&q=80',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    config: {
      layout: 'creative-grid',
      primaryFont: 'Poppins',
      secondaryFont: 'Open Sans',
      colors: { primary: '#f093fb', secondary: '#f5576c', text: '#2d2d2d', background: '#fafafa' },
      sections: ['header', 'portfolio', 'experience', 'skills', 'education']
    }
  },
  {
    name: 'Executive Professional',
    category: 'professional',
    color: 'blue',
    description: 'Sophisticated design for senior executives',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&q=80',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    config: {
      layout: 'traditional',
      primaryFont: 'Playfair Display',
      secondaryFont: 'Lato',
      colors: { primary: '#4facfe', secondary: '#00f2fe', text: '#1a1a1a', background: '#ffffff' },
      sections: ['header', 'executive-summary', 'experience', 'education', 'achievements', 'skills']
    }
  },
  {
    name: 'Minimalist Clean',
    category: 'minimalist',
    color: 'green',
    description: 'Simple and elegant minimalist design',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&q=80',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    config: {
      layout: 'single-column',
      primaryFont: 'Helvetica',
      secondaryFont: 'Arial',
      colors: { primary: '#43e97b', secondary: '#38f9d7', text: '#404040', background: '#ffffff' },
      sections: ['header', 'summary', 'experience', 'education', 'skills']
    }
  },
  {
    name: 'Tech Innovator',
    category: 'modern',
    color: 'orange',
    description: 'Modern tech-focused design with clean lines',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop&q=80',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    config: {
      layout: 'two-column',
      primaryFont: 'Montserrat',
      secondaryFont: 'Source Sans Pro',
      colors: { primary: '#fa709a', secondary: '#fee140', text: '#2c2c2c', background: '#f9f9f9' },
      sections: ['header', 'technical-skills', 'experience', 'projects', 'education', 'certifications']
    }
  },
  {
    name: 'Business Analyst',
    category: 'professional',
    color: 'blue',
    description: 'Professional layout for business roles',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop&q=80',
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    config: {
      layout: 'traditional',
      primaryFont: 'Georgia',
      secondaryFont: 'Verdana',
      colors: { primary: '#30cfd0', secondary: '#330867', text: '#1f1f1f', background: '#ffffff' },
      sections: ['header', 'professional-summary', 'experience', 'education', 'skills', 'certifications']
    }
  },
  {
    name: 'Creative Portfolio',
    category: 'creative',
    color: 'purple',
    description: 'Artistic design showcasing creativity',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&q=80',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    config: {
      layout: 'portfolio-style',
      primaryFont: 'Raleway',
      secondaryFont: 'Nunito',
      colors: { primary: '#a8edea', secondary: '#fed6e3', text: '#3a3a3a', background: '#fefefe' },
      sections: ['header', 'portfolio', 'about', 'experience', 'skills', 'education']
    }
  },
  {
    name: 'Academic Scholar',
    category: 'professional',
    color: 'red',
    description: 'Formal design for academic positions',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&q=80',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    config: {
      layout: 'academic',
      primaryFont: 'Times New Roman',
      secondaryFont: 'Garamond',
      colors: { primary: '#ff9a9e', secondary: '#fecfef', text: '#000000', background: '#ffffff' },
      sections: ['header', 'education', 'publications', 'research', 'teaching', 'awards']
    }
  },
  {
    name: 'Startup Founder',
    category: 'modern',
    color: 'orange',
    description: 'Dynamic design for entrepreneurs',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&q=80',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    config: {
      layout: 'dynamic',
      primaryFont: 'Space Grotesk',
      secondaryFont: 'Inter',
      colors: { primary: '#ffecd2', secondary: '#fcb69f', text: '#2b2b2b', background: '#ffffff' },
      sections: ['header', 'vision', 'experience', 'ventures', 'skills', 'education']
    }
  },
  {
    name: 'Elegant Minimalist',
    category: 'minimalist',
    color: 'purple',
    description: 'Refined minimalist approach',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&q=80',
    gradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    config: {
      layout: 'minimal',
      primaryFont: 'Futura',
      secondaryFont: 'Avenir',
      colors: { primary: '#e0c3fc', secondary: '#8ec5fc', text: '#333333', background: '#ffffff' },
      sections: ['header', 'summary', 'experience', 'skills', 'education']
    }
  },
  {
    name: 'Marketing Pro',
    category: 'creative',
    color: 'blue',
    description: 'Eye-catching design for marketing professionals',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=500&fit=crop&q=80',
    gradient: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
    config: {
      layout: 'marketing-focused',
      primaryFont: 'Oswald',
      secondaryFont: 'PT Sans',
      colors: { primary: '#ff6e7f', secondary: '#bfe9ff', text: '#2e2e2e', background: '#f7f7f7' },
      sections: ['header', 'brand-statement', 'experience', 'campaigns', 'skills', 'education']
    }
  },
  {
    name: 'Data Scientist',
    category: 'modern',
    color: 'green',
    description: 'Analytical design for data professionals',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=500&fit=crop&q=80',
    gradient: 'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)',
    config: {
      layout: 'data-focused',
      primaryFont: 'Roboto Mono',
      secondaryFont: 'IBM Plex Sans',
      colors: { primary: '#96fbc4', secondary: '#f9f586', text: '#1e1e1e', background: '#ffffff' },
      sections: ['header', 'summary', 'technical-skills', 'experience', 'projects', 'education']
    }
  }
];

async function flushRedisAndReseed() {
  let redisConnected = false;

  try {
    console.log('🔄 STEP 1: Connecting to Redis...');
    redisConnected = await connectRedis();

    if (redisConnected) {
      console.log('✅ Redis connected');

      console.log('\n🔄 STEP 2: FLUSHING entire Redis database...');
      await redisClient.flushDb();
      console.log('✅ Redis database FLUSHED - ALL cache cleared!');
    } else {
      console.log('⚠️  Redis not available - skipping cache flush (cache will expire in 1 hour)');
    }
  } catch (error) {
    console.log('⚠️  Redis flush error:', error.message);
    console.log('⚠️  Continuing anyway - Redis might not be running');
  }

  try {
    console.log('\n🔄 STEP 3: Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-builder');
    console.log('✅ MongoDB connected');

    console.log('\n🔄 STEP 4: Deleting old templates...');
    const deleteResult = await Template.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} old templates`);

    console.log('\n🔄 STEP 5: Seeding new templates with fresh IDs...');
    const templates = await Template.insertMany(templateData);
    console.log(`✅ Created ${templates.length} new templates with new IDs:`);

    templates.slice(0, 3).forEach(t => {
      console.log(`   - ${t._id} | ${t.name}`);
    });
    console.log(`   ... and ${templates.length - 3} more`);

    console.log('\n✅✅✅ SUCCESS! ✅✅✅');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. ✅ Redis cache flushed (if Redis was running)');
    console.log('2. ✅ Templates re-seeded with NEW IDs');
    console.log('3. 👉 RESTART your backend server (Ctrl+C then npm run dev)');
    console.log('4. 👉 Hard refresh browser (Ctrl+Shift+R)');
    console.log('5. 👉 Navigate to http://localhost:5173/templates');
    console.log('\n🎯 Expected: All templates with new IDs and images!');

  } catch (error) {
    console.error('❌ MongoDB error:', error);
  } finally {
    await mongoose.disconnect();
    if (redisConnected) {
      await redisClient.quit();
    }
    process.exit(0);
  }
}

flushRedisAndReseed();
