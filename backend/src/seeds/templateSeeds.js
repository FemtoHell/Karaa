const mongoose = require('mongoose');
const Template = require('../models/Template');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Template seeds
const templates = [
  {
    name: 'Modern Professional',
    description: 'A clean and modern template perfect for tech professionals and developers',
    category: 'modern',
    color: 'blue',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    image: '/templates/modern-professional.png',
    tags: ['tech', 'developer', 'modern', 'clean'],
    popularity: 95,
    views: 5234,
    isActive: true,
    config: {
      layout: 'single-column',
      fontSize: 'medium',
      spacing: 'normal',
      fontFamily: 'Inter',
      sections: ['personal', 'summary', 'experience', 'education', 'skills', 'projects']
    }
  },
  {
    name: 'Creative Designer',
    description: 'Stand out with this creative template designed for designers and creative professionals',
    category: 'creative',
    color: 'purple',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    image: '/templates/creative-designer.png',
    tags: ['design', 'creative', 'portfolio', 'colorful'],
    popularity: 88,
    views: 4521,
    isActive: true,
    config: {
      layout: 'two-column',
      fontSize: 'medium',
      spacing: 'relaxed',
      fontFamily: 'Poppins',
      sections: ['personal', 'summary', 'skills', 'experience', 'projects', 'education']
    }
  },
  {
    name: 'Executive Professional',
    description: 'Elegant and professional template ideal for executives and senior management',
    category: 'professional',
    color: 'gray',
    gradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
    image: '/templates/executive-professional.png',
    tags: ['executive', 'management', 'professional', 'formal'],
    popularity: 92,
    views: 6123,
    isActive: true,
    config: {
      layout: 'single-column',
      fontSize: 'medium',
      spacing: 'normal',
      fontFamily: 'Georgia',
      sections: ['personal', 'summary', 'experience', 'education', 'skills', 'certificates']
    }
  },
  {
    name: 'Minimalist Clean',
    description: 'Simple and clean template that lets your content shine',
    category: 'minimalist',
    color: 'gray',
    gradient: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)',
    image: '/templates/minimalist-clean.png',
    tags: ['minimalist', 'simple', 'clean', 'modern'],
    popularity: 90,
    views: 5678,
    isActive: true,
    config: {
      layout: 'single-column',
      fontSize: 'medium',
      spacing: 'compact',
      fontFamily: 'Arial',
      sections: ['personal', 'experience', 'education', 'skills']
    }
  },
  {
    name: 'Tech Innovator',
    description: 'Modern tech-focused template with a bold design for software engineers',
    category: 'modern',
    color: 'green',
    gradient: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)',
    image: '/templates/tech-innovator.png',
    tags: ['tech', 'software', 'engineer', 'developer'],
    popularity: 93,
    views: 7890,
    isActive: true,
    config: {
      layout: 'two-column',
      fontSize: 'medium',
      spacing: 'normal',
      fontFamily: 'Roboto Mono',
      sections: ['personal', 'skills', 'experience', 'projects', 'education', 'certificates']
    }
  },
  {
    name: 'Business Analyst',
    description: 'Professional template tailored for business analysts and consultants',
    category: 'professional',
    color: 'blue',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    image: '/templates/business-analyst.png',
    tags: ['business', 'analyst', 'consultant', 'professional'],
    popularity: 87,
    views: 4321,
    isActive: true,
    config: {
      layout: 'single-column',
      fontSize: 'medium',
      spacing: 'normal',
      fontFamily: 'Times New Roman',
      sections: ['personal', 'summary', 'experience', 'skills', 'education', 'certificates']
    }
  },
  {
    name: 'Creative Portfolio',
    description: 'Showcase your creative work with this vibrant portfolio-style template',
    category: 'creative',
    color: 'orange',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    image: '/templates/creative-portfolio.png',
    tags: ['creative', 'portfolio', 'artist', 'designer'],
    popularity: 85,
    views: 3987,
    isActive: true,
    config: {
      layout: 'modern',
      fontSize: 'medium',
      spacing: 'relaxed',
      fontFamily: 'Montserrat',
      sections: ['personal', 'summary', 'projects', 'experience', 'skills', 'education']
    }
  },
  {
    name: 'Academic Scholar',
    description: 'Traditional academic template perfect for researchers and educators',
    category: 'professional',
    color: 'gray',
    gradient: 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
    image: '/templates/academic-scholar.png',
    tags: ['academic', 'research', 'education', 'professor'],
    popularity: 82,
    views: 3456,
    isActive: true,
    config: {
      layout: 'single-column',
      fontSize: 'medium',
      spacing: 'normal',
      fontFamily: 'Georgia',
      sections: ['personal', 'summary', 'education', 'experience', 'certificates', 'activities']
    }
  },
  {
    name: 'Startup Founder',
    description: 'Bold and innovative template for entrepreneurs and startup founders',
    category: 'modern',
    color: 'red',
    gradient: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
    image: '/templates/startup-founder.png',
    tags: ['startup', 'entrepreneur', 'founder', 'innovative'],
    popularity: 89,
    views: 5012,
    isActive: true,
    config: {
      layout: 'two-column',
      fontSize: 'medium',
      spacing: 'normal',
      fontFamily: 'Inter',
      sections: ['personal', 'summary', 'experience', 'projects', 'skills', 'education']
    }
  },
  {
    name: 'Elegant Minimalist',
    description: 'Sophisticated minimalist design for any professional',
    category: 'minimalist',
    color: 'purple',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    image: '/templates/elegant-minimalist.png',
    tags: ['minimalist', 'elegant', 'simple', 'professional'],
    popularity: 91,
    views: 5890,
    isActive: true,
    config: {
      layout: 'single-column',
      fontSize: 'medium',
      spacing: 'compact',
      fontFamily: 'Helvetica',
      sections: ['personal', 'experience', 'education', 'skills', 'certificates']
    }
  },
  {
    name: 'Marketing Pro',
    description: 'Dynamic template designed for marketing professionals',
    category: 'creative',
    color: 'orange',
    gradient: 'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',
    image: '/templates/marketing-pro.png',
    tags: ['marketing', 'sales', 'creative', 'professional'],
    popularity: 86,
    views: 4567,
    isActive: true,
    config: {
      layout: 'two-column',
      fontSize: 'medium',
      spacing: 'normal',
      fontFamily: 'Lato',
      sections: ['personal', 'summary', 'experience', 'skills', 'projects', 'education']
    }
  },
  {
    name: 'Data Scientist',
    description: 'Technical template optimized for data scientists and analysts',
    category: 'modern',
    color: 'blue',
    gradient: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
    image: '/templates/data-scientist.png',
    tags: ['data', 'science', 'analytics', 'technical'],
    popularity: 94,
    views: 6789,
    isActive: true,
    config: {
      layout: 'single-column',
      fontSize: 'medium',
      spacing: 'normal',
      fontFamily: 'Source Code Pro',
      sections: ['personal', 'summary', 'skills', 'experience', 'projects', 'education', 'certificates']
    }
  }
];

// Import function
const importTemplates = async () => {
  try {
    // Clear existing templates
    await Template.deleteMany({});
    console.log('Cleared existing templates');

    // Insert new templates
    const insertedTemplates = await Template.insertMany(templates);
    console.log(`✅ Successfully imported ${insertedTemplates.length} templates`);

    // Display summary
    console.log('\n📊 Template Summary:');
    const categories = await Template.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    categories.forEach(cat => {
      console.log(`  - ${cat._id}: ${cat.count} templates`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing templates:', error);
    process.exit(1);
  }
};

// Run import
importTemplates();
