// import { Worker } from 'bullmq';
// import { redisConnection } from '../config/redis.js';
// import { connectDB } from '../config/db.js';
// import Job from '../models/Job.js';
// import ImportLog from '../models/ImportLog.js';
// import { fetchAndParseXML, transformJobData, extractJobs } from '../utils/xmlParser.js';
// import logger from '../utils/logger.js';
// import dotenv from 'dotenv';

// dotenv.config();

// // Connect to MongoDB
// await connectDB();

// const BATCH_SIZE = parseInt(process.env.BATCH_SIZE) || 10;

// const worker = new Worker(
//   'job-import',
//   async (job) => {
//     const { url, logId } = job.data;
//     const startTime = Date.now();

//     let stats = {
//       totalFetched: 0,
//       newJobs: 0,
//       updatedJobs: 0,
//       failedJobs: 0,
//       failedReasons: [],
//     };

//     try {
//       logger.info(`Starting import from: ${url}`);

//       // Fetch and parse XML
//       const xmlData = await fetchAndParseXML(url);
//       const jobs = extractJobs(xmlData);
//       stats.totalFetched = jobs.length;

//       logger.info(`Fetched ${stats.totalFetched} jobs from ${url}`);

//       // Update log with fetched count
//       await ImportLog.findByIdAndUpdate(logId, {
//         totalFetched: stats.totalFetched,
//       });

//       // Process jobs in batches
//       for (let i = 0; i < stats.totalFetched; i += BATCH_SIZE) {
//         const batch = jobs.slice(i, i + BATCH_SIZE);

//         await Promise.all(
//           batch.map(async (rawJob) => {
//             try {
//               const jobData = transformJobData(rawJob, url);

//               const existing = await Job.findOne({ externalId: jobData.externalId });

//               if (existing) {
//                 await Job.updateOne(
//                   { externalId: jobData.externalId },
//                   { ...jobData, lastUpdated: new Date() }
//                 );
//                 stats.updatedJobs++;
//               } else {
//                 await Job.create(jobData);
//                 stats.newJobs++;
//               }
//             } catch (err) {
//               stats.failedJobs++;
//               stats.failedReasons.push({
//                 jobId: rawJob.guid || 'unknown',
//                 reason: err.message,
//                 error: err.stack,
//               });
//               logger.error('Job processing failed', { rawJob, error: err.message });
//             }
//           })
//         );

//         // Update progress
//         const progress = Math.round(((i + batch.length) / stats.totalFetched) * 100);
//         await job.updateProgress(progress);

//         // Update log progress
//         await ImportLog.findByIdAndUpdate(logId, {
//           progress,
//           ...stats,
//           totalImported: stats.newJobs + stats.updatedJobs,
//         });

//         logger.info(`Processed ${i + batch.length}/${stats.totalFetched} jobs`);
//       }

//       // Final update
//       const duration = Date.now() - startTime;
//       await ImportLog.findByIdAndUpdate(logId, {
//         ...stats,
//         totalImported: stats.newJobs + stats.updatedJobs,
//         status: 'completed',
//         duration,
//         progress: 100,
//       });

//       logger.success(`Import completed for ${url}`, stats);

//       return stats;
//     } catch (error) {
//       logger.error('Import failed', { url, error: error.message });

//       await ImportLog.findByIdAndUpdate(logId, {
//         status: 'failed',
//         failedReasons: [
//           ...stats.failedReasons,
//           {
//             reason: error.message,
//             error: error.stack,
//           },
//         ],
//       });

//       throw error;
//     }
//   },
//   {
//     connection: redisConnection,
//     concurrency: parseInt(process.env.WORKER_CONCURRENCY) || 3,
//   }
// );

// worker.on('completed', (job) => {
//   logger.success(`Job ${job.id} completed`, job.returnvalue);
// });

// worker.on('failed', (job, err) => {
//   logger.error(`Job ${job.id} failed`, err.message);
// });

// worker.on('error', (err) => {
//   logger.error('Worker error', err);
// });

// console.log('🔄 Job Import Worker Started');






import Queue from 'bull';
import { connectDB } from '../config/db.js';
import Job from '../models/Job.js';
import ImportLog from '../models/ImportLog.js';
import { fetchAndParseXML, transformJobData, extractJobs } from '../utils/xmlParser.js';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();
await connectDB();

const BATCH_SIZE = parseInt(process.env.BATCH_SIZE) || 50;  // Increased!
const CONCURRENCY = parseInt(process.env.WORKER_CONCURRENCY) || 10;  // Increased!

const jobImportQueue = new Queue('job-import', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
});

jobImportQueue.process('import',CONCURRENCY, async (job) => {
  const { url, logId } = job.data;
  const startTime = Date.now();

  let stats = {
    totalFetched: 0,
    newJobs: 0,
    updatedJobs: 0,
    failedJobs: 0,
    failedReasons: [],
  };

  try {
    logger.info(`Starting import from: ${url}`);

    const xmlData = await fetchAndParseXML(url);
    const jobs = extractJobs(xmlData);
    stats.totalFetched = jobs.length;

    logger.info(`Fetched ${stats.totalFetched} jobs from ${url}`);

    await ImportLog.findByIdAndUpdate(logId, { totalFetched: stats.totalFetched });

    // Process in large batches with bulk operations
    for (let i = 0; i < stats.totalFetched; i += BATCH_SIZE) {
      const batchStart = Date.now();
      const batch = jobs.slice(i, i + BATCH_SIZE);

      // Transform all jobs
      const transformedJobs = batch.map(rawJob => {
        try {
          return transformJobData(rawJob, url);
        } catch (err) {
          stats.failedJobs++;
          stats.failedReasons.push({
            jobId: rawJob.guid || 'unknown',
            reason: err.message,
            error: err.stack
          });
          return null;
        }
      }).filter(Boolean);

      // Bulk check existing
      const externalIds = transformedJobs.map(j => j.externalId);
      const existingJobs = await Job.find({ 
        externalId: { $in: externalIds } 
      }).select('externalId').lean();

      const existingIdsSet = new Set(existingJobs.map(j => j.externalId));

      const newJobs = [];
      const updateOps = [];

      transformedJobs.forEach(jobData => {
        if (existingIdsSet.has(jobData.externalId)) {
          updateOps.push({
            updateOne: {
              filter: { externalId: jobData.externalId },
              update: { $set: { ...jobData, lastUpdated: new Date() } }
            }
          });
          stats.updatedJobs++;
        } else {
          newJobs.push(jobData);
          stats.newJobs++;
        }
      });

      // Bulk operations
      try {
        if (newJobs.length > 0) {
          await Job.insertMany(newJobs, { ordered: false });
        }
        if (updateOps.length > 0) {
          await Job.bulkWrite(updateOps, { ordered: false });
        }
      } catch (err) {
        logger.error('Bulk operation error', err.message);
        stats.failedJobs += err.writeErrors?.length || 0;
      }

      // Update progress every 5 batches
      if (i % (BATCH_SIZE * 5) === 0 || i + BATCH_SIZE >= stats.totalFetched) {
        const progress = Math.round(((i + batch.length) / stats.totalFetched) * 100);
        job.progress(progress);

        await ImportLog.findByIdAndUpdate(logId, {
          progress,
          ...stats,
          totalImported: stats.newJobs + stats.updatedJobs,
        });
      }

      logger.info(`Batch ${Math.floor(i/BATCH_SIZE) + 1} processed in ${Date.now() - batchStart}ms`);
    }

    const duration = Date.now() - startTime;
    await ImportLog.findByIdAndUpdate(logId, {
      ...stats,
      totalImported: stats.newJobs + stats.updatedJobs,
      status: 'completed',
      duration,
      progress: 100,
    });

    logger.success(`Import completed in ${duration}ms`, stats);
    return stats;

  } catch (error) {
    logger.error('Import failed', { url, error: error.message });
    await ImportLog.findByIdAndUpdate(logId, {
      status: 'failed',
      failedReasons: [...stats.failedReasons, { reason: error.message }]
    });
    throw error;
  }
});

jobImportQueue.on('completed', (job, result) => {
  logger.success(`Job ${job.id} completed`, result);
});

jobImportQueue.on('failed', (job, err) => {
  logger.error(`Job ${job.id} failed`, err.message);
});

console.log('🔄 Job Import Worker Started (Optimized)');
console.log(`⚙️  Concurrency: ${CONCURRENCY}, Batch Size: ${BATCH_SIZE}`);
