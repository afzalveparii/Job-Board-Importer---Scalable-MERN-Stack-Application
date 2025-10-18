import mongoose from 'mongoose';

const importLogSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    sourceUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['processing', 'completed', 'failed'],
      default: 'processing',
    },
    totalFetched: {
      type: Number,
      default: 0,
    },
    totalImported: {
      type: Number,
      default: 0,
    },
    newJobs: {
      type: Number,
      default: 0,
    },
    updatedJobs: {
      type: Number,
      default: 0,
    },
    failedJobs: {
      type: Number,
      default: 0,
    },
    failedReasons: [
      {
        jobId: String,
        reason: String,
        error: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    duration: {
      type: Number, // milliseconds
      default: 0,
    },
    processedBy: {
      type: String,
      default: 'worker-1',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
importLogSchema.index({ status: 1, createdAt: -1 });

const ImportLog = mongoose.model('ImportLog', importLogSchema);

export default ImportLog;
