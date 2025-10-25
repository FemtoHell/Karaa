const mongoose = require('mongoose');
const Template = require('../models/Template');
require('dotenv').config();

// Import templates from templateSeeds.js
const path = require('path');
const fs = require('fs');

// Read templateSeeds.js and extract templates array
const templateSeedsPath = path.join(__dirname, '../seeds/templateSeeds.js');
const templateSeedsContent = fs.readFileSync(templateSeedsPath, 'utf-8');

// Extract templates array using regex (simple approach)
// Better approach: directly require if it exports templates
let templates = [];

try {
  // Try to evaluate the templates array from the file
  const templatesMatch = templateSeedsContent.match(/const templates = \[([\s\S]*?)\];/);
  if (templatesMatch) {
    // Use eval carefully - this is for development seeding only
    eval(`templates = [${templatesMatch[1]}];`);
    console.log(`📦 Loaded ${templates.length} templates from templateSeeds.js`);
  } else {
    throw new Error('Could not extract templates array');
  }
} catch (error) {
  console.warn('⚠️  Could not load from templateSeeds.js, using fallback templates');

  // Fallback to inline templates if import fails
  templates = [
  // 1. MODERN MINIMAL
  {
    name: 'Modern Minimal',
    description: 'Clean, ATS-friendly single-column resume perfect for software engineers',
    category: 'modern',
    color: 'blue',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=500&fit=crop&q=80',
    tags: ['tech', 'developer', 'modern', 'ats-friendly'],
    popularity: 95,
  {
    name: 'Modern Green',
    description: 'Vibrant design with geometric elements for creative minds and designers',
    category: 'modern',
    color: 'green',
    gradient: 'linear-gradient(135deg, #10B981 0%, #3B82F6 70.71%)',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=600&fit=crop&q=80',
    tags: ['creative', 'design', 'vibrant', 'geometric', 'modern'],
    popularity: 88
  },
  {
    name: 'Modern Purple',
    description: 'Bold and colorful template for standout applications and creative roles',
    category: 'modern',
    color: 'purple',
    gradient: 'linear-gradient(135deg, #A855F7 0%, #DB2777 70.71%)',
    image: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=400&h=600&fit=crop&q=80',
    tags: ['bold', 'colorful', 'creative', 'standout', 'modern'],
    popularity: 92
  },
  {
    name: 'Modern Orange',
    description: 'Energetic and trendy design for dynamic professionals and marketers',
    category: 'modern',
    color: 'orange',
    gradient: 'linear-gradient(135deg, #F97316 0%, #DC2626 70.71%)',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=600&fit=crop&q=80',
    tags: ['energetic', 'trendy', 'dynamic', 'marketing', 'modern'],
    popularity: 85
  },
  // Professional Templates
  {
    name: 'Corporate Elite',
    description: 'Professional layout perfect for corporate environments and executive positions',
    category: 'professional',
    color: 'gray',
    gradient: '#F3F4F6',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=600&fit=crop&q=80',
    tags: ['corporate', 'executive', 'formal', 'business', 'traditional'],
    popularity: 90
  },
  {
    name: 'Business Blue',
    description: 'Trustworthy design for finance and consulting roles with clean typography',
    category: 'professional',
    color: 'blue',
    gradient: '#EFF6FF',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=600&fit=crop&q=80',
    tags: ['finance', 'consulting', 'trustworthy', 'clean', 'business'],
    popularity: 93
  },
  {
    name: 'Professional Green',
    description: 'Clean professional layout for any industry with subtle green accents',
    category: 'professional',
    color: 'green',
    gradient: '#F0FDF4',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=600&fit=crop&q=80',
    tags: ['clean', 'professional', 'versatile', 'subtle', 'industry'],
    popularity: 87
  },
  {
    name: 'Executive',
    description: 'Sophisticated template for senior positions and leadership roles',
    category: 'professional',
    color: 'blue',
    gradient: '#EEF2FF',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=600&fit=crop&q=80',
    tags: ['sophisticated', 'senior', 'leadership', 'executive', 'formal'],
    popularity: 91
  },
  // Creative Templates
  {
    name: 'Creative Burst',
    description: 'Artistic and colorful design for designers and creative professionals',
    category: 'creative',
    color: 'purple',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #F59E0B 70.71%)',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=600&fit=crop&q=80',
    tags: ['artistic', 'colorful', 'designers', 'creative', 'unique'],
    popularity: 89
  },
  {
    name: 'Creative Red',
    description: 'Bold red design for marketing professionals and creative agencies',
    category: 'creative',
    color: 'red',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #F97316 70.71%)',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=600&fit=crop&q=80',
    tags: ['bold', 'red', 'marketing', 'agencies', 'creative'],
    popularity: 84
  },
  {
    name: 'Creative Minimal',
    description: 'Minimalist creative template with artistic elements and clean layout',
    category: 'creative',
    color: 'gray',
    gradient: 'linear-gradient(135deg, #6B7280 0%, #374151 70.71%)',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=600&fit=crop&q=80',
    tags: ['minimalist', 'artistic', 'clean', 'creative', 'simple'],
    popularity: 86
  },
  // Minimalist Templates
  {
    name: 'Minimal Clean',
    description: 'Ultra-clean minimalist design focusing on content and readability',
    category: 'minimalist',
    color: 'gray',
    gradient: '#F9FAFB',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=600&fit=crop&q=80',
    tags: ['ultra-clean', 'minimalist', 'content', 'readability', 'simple'],
    popularity: 88
  },
  {
    name: 'Minimal Blue',
    description: 'Simple blue accent template with focus on typography and structure',
    category: 'minimalist',
    color: 'blue',
    gradient: '#F8FAFC',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=600&fit=crop&q=80',
    tags: ['simple', 'blue', 'typography', 'structure', 'minimalist'],
    popularity: 90
  }
];

const seedTemplates = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing templates
    await Template.deleteMany({});
    console.log('🗑️  Cleared existing templates');

    // Insert new templates
    const createdTemplates = await Template.insertMany(templates);
    console.log(`✅ Created ${createdTemplates.length} templates`);

    // Display created templates
    createdTemplates.forEach((template, index) => {
      console.log(`${index + 1}. ${template.name} (${template.category}) - ID: ${template._id}`);
    });

    console.log('\n✨ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding templates:', error);
    process.exit(1);
  }
};

seedTemplates();
