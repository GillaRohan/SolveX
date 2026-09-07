import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import standardsRoutes from './routes/standardsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import complianceRoutes from './routes/complianceRoutes.js';
import laboratoriesRoutes from './routes/laboratoriesRoutes.js';
import scannerRoutes from './routes/scannerRoutes.js';
import notificationsRoutes from './routes/notificationsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-demo-role']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads serving
app.use('/uploads', express.static(config.uploadDir));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SolveX BIS Intelligent Assistant API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/standards', standardsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/laboratories', laboratoriesRoutes);
app.use('/api/scanner', scannerRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(`🚀 SolveX BIS Assistant Backend running on port ${config.port}`);
  console.log(`🔗 API Base: http://localhost:${config.port}/api`);
  console.log(`📂 Uploads: ${config.uploadDir}`);
  console.log(`=======================================================`);
});

export default app;
