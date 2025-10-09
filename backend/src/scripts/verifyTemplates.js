const mongoose = require('mongoose');
const Template = require('../models/Template');
require('dotenv').config();

async function verifyTemplates() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const templates = await Template.find().select('_id name image color').limit(5);

    console.log('\n✅ NEW Templates in MongoDB:\n');
    templates.forEach(t => {
      console.log(`  ID: ${t._id}`);
      console.log(`  Name: ${t.name}`);
      console.log(`  Color: ${t.color}`);
      console.log(`  Image: ${t.image.substring(0, 70)}...`);
      console.log('');
    });

    const total = await Template.countDocuments();
    console.log(`📊 Total templates: ${total}\n`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

verifyTemplates();
