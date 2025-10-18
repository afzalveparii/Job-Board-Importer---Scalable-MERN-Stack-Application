// import { Queue } from 'bullmq';
// import { redisConnection } from './redis.js';

// export const jobImportQueue = new Queue('job-import', {
//   connection: redisConnection,
//   defaultJobOptions: {
//     attempts: 3,
//     backoff: {
//       type: 'exponential',
//       delay: 2000,
//     },
//     removeOnComplete: {
//       count: 100,
//       age: 3600,
//     },
//     removeOnFail: {
//       count: 500,
//     },
//   },
// });

// console.log('✅ Job Import Queue Initialized');

// export default jobImportQueue;


import Queue from 'bull';

export const jobImportQueue = new Queue('job-import', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});

console.log('✅ Job Import Queue Initialized (Bull)');
export default jobImportQueue;
