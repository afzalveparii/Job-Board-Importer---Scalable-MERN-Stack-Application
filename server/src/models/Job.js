import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    externalId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      default: 'N/A',
    },
    location: {
      type: String,
      default: 'Remote',
    },
    description: {
      type: String,
    },
    url: {
      type: String,
    },
    category: {
      type: String,
      index: true,
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'],
      default: 'Full-time',
    },
    salary: {
      type: String,
    },
    postedDate: {
      type: Date,
      default: Date.now,
    },
    sourceUrl: {
      type: String,
      required: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
jobSchema.index({ category: 1, jobType: 1 });
jobSchema.index({ postedDate: -1 });
jobSchema.index({ company: 1 });

const Job = mongoose.model('Job', jobSchema);

export default Job;
