import express from 'express';
import {
  triggerImport,
  getImportHistory,
  getImportById,
} from '../controllers/importController.js';

const router = express.Router();

router.post('/trigger', triggerImport);
router.get('/history', getImportHistory);
router.get('/:id', getImportById);

export default router;
