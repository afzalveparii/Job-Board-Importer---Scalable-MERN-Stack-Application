import Redis from 'ioredis';

export const redisConnection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redisConnection.on('connect', () => {
  console.log('✅ Redis Connected');
});

redisConnection.on('error', (err) => {
  console.error('❌ Redis Error:', err.message);
});

export default redisConnection;
