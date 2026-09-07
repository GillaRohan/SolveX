import { Router } from 'express';
import { chat, recommendStandard, explainTerm, clauseSearch, getConversations } from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Allow optional authentication so non-logged in users can explore AI, but logged-in users get persisted conversations
const optionalAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
};

router.post('/chat', optionalAuth, chat);
router.post('/standard-recommendation', recommendStandard);
router.post('/explain-term', explainTerm);
router.post('/clause-search', clauseSearch);
router.get('/conversations', optionalAuth, getConversations);

export default router;
