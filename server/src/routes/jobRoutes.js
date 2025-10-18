import express from 'express';
import { getJobs, getJobById, getJobStats } from '../controllers/jobController.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/stats', getJobStats);
router.get('/:id', getJobById);

export default router;
