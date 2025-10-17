const redis = require('redis');
require('dotenv').config();

// Create Redis client
// Support both REDIS_URL (from Render) and individual credentials
const redisClient = process.env.REDIS_URL
  ? redis.createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: false // Disable auto-reconnect to prevent blocking
      }
    })
  : redis.createClient({
      username: process.env.REDIS_USERNAME || 'default',
      password: process.env.REDIS_PASSWORD || undefined,
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        reconnectStrategy: false
      },
      database: process.env.REDIS_DB || 0
    });

// Error handling
redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redisClient.on('ready', () => {
  console.log('✅ Redis client ready');
});

// Connect to Redis
const connectRedis = async () => {
  try {
    await redisClient.connect();
    return true;
  } catch (error) {
    console.error('❌ Redis connection error:', error.message);
    return false;
  }
};

// Cache helper functions
const cacheHelpers = {
  // Get cached data
  get: async (key) => {
    if (!redisClient.isOpen) {
      console.warn('Redis not connected, skipping GET');
      return null;
    }
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  },

  // Set cache with TTL
  set: async (key, value, ttl = 3600) => {
    if (!redisClient.isOpen) {
      console.warn('Redis not connected, skipping SET');
      return false;
    }
    try {
      await redisClient.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  },

  // Delete cache
  del: async (key) => {
    if (!redisClient.isOpen) {
      console.warn('Redis not connected, skipping DEL');
      return false;
    }
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error('Redis DEL error:', error);
      return false;
    }
  },

  // Delete multiple keys by pattern
  delPattern: async (pattern) => {
    if (!redisClient.isOpen) {
      console.warn('Redis not connected, skipping DEL PATTERN');
      return false;
    }
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
      return true;
    } catch (error) {
      console.error('Redis DEL PATTERN error:', error);
      return false;
    }
  },

  // Check if key exists
  exists: async (key) => {
    if (!redisClient.isOpen) {
      console.warn('Redis not connected, skipping EXISTS');
      return false;
    }
    try {
      const exists = await redisClient.exists(key);
      return exists === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  },

  // Increment counter
  incr: async (key) => {
    if (!redisClient.isOpen) {
      console.warn('Redis not connected, skipping INCR');
      return null;
    }
    try {
      return await redisClient.incr(key);
    } catch (error) {
      console.error('Redis INCR error:', error);
      return null;
    }
  },

  // Set expiration time
  expire: async (key, seconds) => {
    if (!redisClient.isOpen) {
      console.warn('Redis not connected, skipping EXPIRE');
      return false;
    }
    try {
      await redisClient.expire(key, seconds);
      return true;
    } catch (error) {
      console.error('Redis EXPIRE error:', error);
      return false;
    }
  }
};

module.exports = {
  redisClient,
  connectRedis,
  cache: cacheHelpers
};
