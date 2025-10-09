const { cache } = require('../config/redis');

async function clearCache() {
  try {
    console.log('Clearing all template caches...');
    await cache.delPattern('template*');
    console.log('✅ Cache cleared successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
    process.exit(1);
  }
}

clearCache();
