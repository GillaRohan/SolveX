"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const documentController_js_1 = require("../controllers/documentController.js");
const upload_js_1 = require("../middleware/upload.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return (0, auth_js_1.authenticate)(req, res, next);
    }
    next();
};
router.post('/upload', optionalAuth, upload_js_1.upload.single('file'), documentController_js_1.uploadDocument);
router.get('/', optionalAuth, documentController_js_1.getDocuments);
router.get('/:id', documentController_js_1.getDocumentById);
router.post('/:id/chat', documentController_js_1.chatWithDocument);
router.delete('/:id', documentController_js_1.deleteDocument);
exports.default = router;
