import cron from 'node-cron';
import jobImportQueue from '../config/queue.js';
import ImportLog from '../models/ImportLog.js';
import logger from '../utils/logger.js';

const JOB_SOURCES = process.env.JOB_SOURCES
  ? process.env.JOB_SOURCES.split(',')
  : [
      'https://jobicy.com/?feed=job_feed',
      'https://jobicy.com/?feed=job_feed&job_categories=data-science',
    ];

export const startScheduledImports = () => {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    logger.info('Starting scheduled job import...');

    for (const url of JOB_SOURCES) {
      try {
        const log = await ImportLog.create({
          fileName: url.split('feed=')[1] || 'scheduled',
          sourceUrl: url,
          status: 'processing',
        });

        await jobImportQueue.add('import-jobs', {
          url,
          logId: log._id.toString(),
        });

        logger.info(`Scheduled import queued for ${url}`);
      } catch (error) {
        logger.error(`Failed to queue scheduled import for ${url}`, error);
      }
    }
  });

  logger.success('Cron job scheduled: Hourly job imports');
};
