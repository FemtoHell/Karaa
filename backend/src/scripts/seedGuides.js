const mongoose = require('mongoose');
const Guide = require('../models/Guide');
const Template = require('../models/Template');
const guides = require('../seeds/guideSeeds');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Import guides
const importGuides = async () => {
  try {
    // Get some template IDs to link to guides
    const templates = await Template.find().limit(3);
    const templateIds = templates.map(t => t._id);

    // Clear existing guides
    await Guide.deleteMany({});
    console.log('Cleared existing guides');

    // Add recommended templates to guides
    const guidesWithTemplates = guides.map((guide, index) => ({
      ...guide,
      recommendedTemplates: templateIds.slice(0, 2) // Add first 2 templates to each guide
    }));

    // Insert guides
    const insertedGuides = await Guide.insertMany(guidesWithTemplates);
    console.log(`✅ Successfully imported ${insertedGuides.length} guides`);

    // Display summary
    console.log('\n📊 Guide Summary:');
    const industries = await Guide.aggregate([
      { $group: { _id: '$industry', count: { $sum: 1 } } }
    ]);
    industries.forEach(ind => {
      console.log(`  - ${ind._id}: ${ind.count} guides`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing guides:', error);
    process.exit(1);
  }
};

// Run import
importGuides();
