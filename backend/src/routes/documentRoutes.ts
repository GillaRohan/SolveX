import { Router } from 'express';
import { uploadDocument, getDocuments, getDocumentById, chatWithDocument, deleteDocument } from '../controllers/documentController.js';
import { upload } from '../middleware/upload.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const optionalAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
};

router.post('/upload', optionalAuth, upload.single('file'), uploadDocument);
router.get('/', optionalAuth, getDocuments);
router.get('/:id', getDocumentById);
router.post('/:id/chat', chatWithDocument);
router.delete('/:id', deleteDocument);

export default router;
