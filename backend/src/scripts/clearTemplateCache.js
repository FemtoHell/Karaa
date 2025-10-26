/**
 * ================================================================================
 * CLEAR TEMPLATE CACHE SCRIPT
 * ================================================================================
 * Clears all Redis cache for templates to force fresh data
 * Run: node src/scripts/clearTemplateCache.js
 * ================================================================================
 */

const { redisClient } = require('../config/redis');
const dotenv = require('dotenv');

dotenv.config();

const clearTemplateCache = async () => {
  try {
    console.log('🔄 Connecting to Redis...');

    // Connect to Redis
    await redisClient.connect();
    console.log('✅ Redis connected');

    // Get all template cache keys
    const keys = await redisClient.keys('template*');

    if (keys.length === 0) {
      console.log('✅ No template cache found');
      process.exit(0);
    }

    console.log(`🗑️  Found ${keys.length} cached template entries`);

    // Delete all template caches
    for (const key of keys) {
      await redisClient.del(key);
      console.log(`   ✓ Deleted: ${key}`);
    }

    console.log('✅ All template cache cleared successfully!');

    await redisClient.quit();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
    await redisClient.quit().catch(() => {});
    process.exit(1);
  }
};

clearTemplateCache();
