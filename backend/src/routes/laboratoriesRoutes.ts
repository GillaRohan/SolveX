import { Router } from 'express';
import { getLaboratories, recommendLaboratories } from '../controllers/laboratoriesController.js';

const router = Router();

router.get('/', getLaboratories);
router.post('/recommend', recommendLaboratories);

export default router;
