const mongoose = require('mongoose');
const Template = require('../models/Template');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to MongoDB
const checkTemplates = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const templates = await Template.find({ isActive: true });

    console.log(`\n📊 Found ${templates.length} active templates:\n`);

    templates.forEach((template, index) => {
      console.log(`${index + 1}. ${template.name}`);
      console.log(`   ID: ${template._id}`);
      console.log(`   Category: ${template.category}`);
      console.log(`   Color: ${template.color}`);
      console.log(`   Popularity: ${template.popularity}`);
      console.log('');
    });

    // Test fetching one template by ID
    if (templates.length > 0) {
      const firstTemplate = templates[0];
      console.log('🧪 Testing fetch by ID...');
      const fetchedTemplate = await Template.findById(firstTemplate._id);
      if (fetchedTemplate) {
        console.log(`✅ Successfully fetched template: ${fetchedTemplate.name}`);
      } else {
        console.log('❌ Failed to fetch template by ID');
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkTemplates();
