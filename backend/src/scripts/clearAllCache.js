const { cache } = require('../config/redis');

async function clearAllCache() {
  try {
    console.log('🔄 Clearing ALL caches...');

    // Clear all template-related caches
    const deleted1 = await cache.delPattern('template*');
    console.log('✅ Cleared template caches');

    // Clear all resume-related caches
    const deleted2 = await cache.delPattern('resume*');
    console.log('✅ Cleared resume caches');

    // Clear all guide-related caches
    const deleted3 = await cache.delPattern('guide*');
    console.log('✅ Cleared guide caches');

    console.log('\n✅ All caches cleared successfully!');
    console.log('👉 Now refresh your browser with Ctrl+Shift+R (hard refresh)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
    console.log('\n⚠️  Redis might not be running or already cleared');
    console.log('👉 Continue to refresh browser anyway');
    process.exit(0);
  }
}

clearAllCache();
