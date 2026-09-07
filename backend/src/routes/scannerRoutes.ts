import { Router } from 'express';
import { verifyManual, scanImage } from '../controllers/scannerController.js';

const router = Router();

router.post('/verify-manual', verifyManual);
router.post('/scan-image', scanImage);

export default router;
