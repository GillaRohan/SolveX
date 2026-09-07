import { Router } from 'express';
import { getNotifications, createNotification } from '../controllers/notificationsController.js';

const router = Router();

router.get('/', getNotifications);
router.post('/', createNotification);

export default router;
