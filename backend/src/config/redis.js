const redis = require('redis');

let redisClient = null;

const connectRedis = async () => {
  try {
    redisClient = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
      },
      password: process.env.REDIS_PASSWORD || undefined,
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('🔗 Redis connecting...');
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis Client Ready');
    });

    redisClient.on('reconnecting', () => {
      console.log('🔄 Redis reconnecting...');
    });

    redisClient.on('end', () => {
      console.log('⚠️  Redis connection closed');
    });

    await redisClient.connect();

    return redisClient;
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    // Don't exit process - Redis is optional for basic functionality
    return null;
  }
};

const getRedisClient = () => {
  if (!redisClient || !redisClient.isOpen) {
    console.warn('⚠️  Redis client not available');
    return null;
  }
  return redisClient;
};

// Cache helper functions
const cacheGet = async (key) => {
  const client = getRedisClient();
  if (!client) return null;

  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis GET error:', error);
    return null;
  }
};

const cacheSet = async (key, value, expiryInSeconds = 3600) => {
  const client = getRedisClient();
  if (!client) return false;

  try {
    await client.setEx(key, expiryInSeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Redis SET error:', error);
    return false;
  }
};

const cacheDel = async (key) => {
  const client = getRedisClient();
  if (!client) return false;

  try {
    await client.del(key);
    return true;
  } catch (error) {
    console.error('Redis DEL error:', error);
    return false;
  }
};

const cacheDelPattern = async (pattern) => {
  const client = getRedisClient();
  if (!client) return false;

  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
    return true;
  } catch (error) {
    console.error('Redis DEL pattern error:', error);
    return false;
  }
};

module.exports = {
  connectRedis,
  getRedisClient,
  cacheGet,
  cacheSet,
  cacheDel,
  cacheDelPattern,
};
