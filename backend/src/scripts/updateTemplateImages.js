const mongoose = require('mongoose');
const Template = require('../models/Template');
const dotenv = require('dotenv');

dotenv.config();

const imageMap = {
  'Modern Professional': 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=500&fit=crop&q=80',
  'Creative Designer': 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&h=500&fit=crop&q=80',
  'Executive Professional': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=500&fit=crop&q=80',
  'Minimalist Clean': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=500&fit=crop&q=80',
  'Tech Innovator': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=500&fit=crop&q=80',
  'Business Analyst': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=500&fit=crop&q=80',
  'Creative Portfolio': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=500&fit=crop&q=80',
  'Academic Scholar': 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=500&fit=crop&q=80',
  'Startup Founder': 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=500&fit=crop&q=80',
  'Elegant Minimalist': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=500&fit=crop&q=80',
  'Marketing Pro': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=500&fit=crop&q=80',
  'Data Scientist': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=500&fit=crop&q=80'
};

async function updateImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const [name, imageUrl] of Object.entries(imageMap)) {
      const result = await Template.updateOne(
        { name },
        { $set: { image: imageUrl } }
      );
      console.log(`Updated ${name}: ${result.modifiedCount > 0 ? '✅' : '⚠️  (not found or no change)'}`);
    }

    console.log('\n✅ All template images updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateImages();
