import Job from '../models/Job.js';
import logger from '../utils/logger.js';

export const upsertJob = async (jobData) => {
  try {
    const existing = await Job.findOne({ externalId: jobData.externalId });

    if (existing) {
      await Job.updateOne(
        { externalId: jobData.externalId },
        { ...jobData, lastUpdated: new Date() }
      );
      return { action: 'updated', job: jobData };
    } else {
      await Job.create(jobData);
      return { action: 'created', job: jobData };
    }
  } catch (error) {
    logger.error('Job upsert failed', { jobData, error: error.message });
    throw error;
  }
};

export const getJobs = async (filters = {}, page = 1, limit = 20) => {
  try {
    const query = {};

    if (filters.category) query.category = filters.category;
    if (filters.jobType) query.jobType = filters.jobType;
    if (filters.company) query.company = new RegExp(filters.company, 'i');

    const jobs = await Job.find(query)
      .sort({ postedDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Job.countDocuments(query);

    return {
      jobs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };
  } catch (error) {
    logger.error('Failed to fetch jobs', error);
    throw error;
  }
};
