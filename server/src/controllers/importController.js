import jobImportQueue from '../config/queue.js';
import ImportLog from '../models/ImportLog.js';
import logger from '../utils/logger.js';

export const triggerImport = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required',
      });
    }

    // Create import log
    const log = await ImportLog.create({
      fileName: url.split('feed=')[1] || url.split('/').pop() || 'manual-import',
      sourceUrl: url,
      status: 'processing',
    });

    // Add job to queue
    await jobImportQueue.add('import', {
      url,
      logId: log._id.toString(),
    });

    logger.info(`Import triggered for ${url}`, { logId: log._id });

    res.status(201).json({
      success: true,
      message: 'Import started',
      logId: log._id,
    });
  } catch (error) {
    logger.error('Failed to trigger import', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getImportHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = {};
    if (status) query.status = status;

    const logs = await ImportLog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await ImportLog.countDocuments(query);

    res.json({
      success: true,
      data: logs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    logger.error('Failed to fetch import history', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getImportById = async (req, res) => {
  try {
    const { id } = req.params;

    const log = await ImportLog.findById(id).lean();

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Import log not found',
      });
    }

    res.json({
      success: true,
      data: log,
    });
  } catch (error) {
    logger.error('Failed to fetch import log', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
