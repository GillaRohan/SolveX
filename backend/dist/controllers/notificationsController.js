"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = exports.getNotifications = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getNotifications = async (req, res) => {
    try {
        const { type, isUrgent } = req.query;
        const where = {};
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
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to fetch notifications' });
    }
};
exports.getNotifications = getNotifications;
const createNotification = async (req, res) => {
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
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to create notification' });
    }
};
exports.createNotification = createNotification;
