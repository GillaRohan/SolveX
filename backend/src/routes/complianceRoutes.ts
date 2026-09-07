import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  generateChecklist,
  analyzeComplianceGaps,
  updateTaskStatus
} from '../controllers/complianceController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const optionalAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
};

router.get('/projects', optionalAuth, getProjects);
router.get('/projects/:id', getProjectById);
router.post('/projects', optionalAuth, createProject);
router.post('/checklist', generateChecklist);
router.post('/analyze-gaps', analyzeComplianceGaps);
router.patch('/tasks/:id', updateTaskStatus);

export default router;
