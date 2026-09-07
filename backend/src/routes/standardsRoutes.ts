import { Router } from 'express';
import { getStandards, getStandardById, searchStandards } from '../controllers/standardsController.js';

const router = Router();

router.get('/', getStandards);
router.post('/search', searchStandards);
router.get('/:id', getStandardById);

export default router;
