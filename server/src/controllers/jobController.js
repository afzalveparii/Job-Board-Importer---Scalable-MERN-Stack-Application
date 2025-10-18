import Job from '../models/Job.js';
import logger from '../utils/logger.js';

export const getJobs = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, jobType, company, search } = req.query;

    const query = {};

    if (category) query.category = category;
    if (jobType) query.jobType = jobType;
    if (company) query.company = new RegExp(company, 'i');
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { company: new RegExp(search, 'i') },
      ];
    }

    const jobs = await Job.find(query)
      .sort({ postedDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    logger.error('Failed to fetch jobs', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id).lean();

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    logger.error('Failed to fetch job', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJobStats = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const jobsByCategory = await Job.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const jobsByType = await Job.aggregate([
      { $group: { _id: '$jobType', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        totalJobs,
        jobsByCategory,
        jobsByType,
      },
    });
  } catch (error) {
    logger.error('Failed to fetch job stats', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
