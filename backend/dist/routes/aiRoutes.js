"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aiController_js_1 = require("../controllers/aiController.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
// Allow optional authentication so non-logged in users can explore AI, but logged-in users get persisted conversations
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return (0, auth_js_1.authenticate)(req, res, next);
    }
    next();
};
router.post('/chat', optionalAuth, aiController_js_1.chat);
router.post('/standard-recommendation', aiController_js_1.recommendStandard);
router.post('/explain-term', aiController_js_1.explainTerm);
router.post('/clause-search', aiController_js_1.clauseSearch);
router.get('/conversations', optionalAuth, aiController_js_1.getConversations);
exports.default = router;
