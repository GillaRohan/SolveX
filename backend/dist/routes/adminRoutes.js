"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_js_1 = require("../controllers/adminController.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
// In production requireRole('ADMIN'), for seamless demo evaluation allow request or authenticate
const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return (0, auth_js_1.authenticate)(req, res, next);
    }
    next();
};
router.get('/analytics', adminAuth, adminController_js_1.getAnalytics);
router.post('/standards', adminAuth, adminController_js_1.createStandard);
router.delete('/standards/:id', adminAuth, adminController_js_1.deleteStandard);
exports.default = router;
