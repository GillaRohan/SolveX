import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, isUrgent } = req.query;

    const where: any = {};
    if (type && type !== 'ALL') {
      where.type = String(type);
    }
    if (isUrgent !== undefined) {
      where.isUrgent = isUrgent === 'true';
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { publishedAt: 'desc' }
    });

    res.json({ success: true, count: notifications.length, notifications });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch notifications' });
  }
};

export const createNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, type, category, isUrgent } = req.body;

    if (!title || !content) {
      res.status(400).json({ success: false, message: 'Title and content are required' });
      return;
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        content,
        type: type || 'QCO_UPDATE',
        category: category || 'Gazette Notification',
        isUrgent: Boolean(isUrgent),
      }
    });

    res.status(201).json({ success: true, notification });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to create notification' });
  }
};
