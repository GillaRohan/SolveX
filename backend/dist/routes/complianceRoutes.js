"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const complianceController_js_1 = require("../controllers/complianceController.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return (0, auth_js_1.authenticate)(req, res, next);
    }
    next();
};
router.get('/projects', optionalAuth, complianceController_js_1.getProjects);
router.get('/projects/:id', complianceController_js_1.getProjectById);
router.post('/projects', optionalAuth, complianceController_js_1.createProject);
router.post('/checklist', complianceController_js_1.generateChecklist);
router.post('/analyze-gaps', complianceController_js_1.analyzeComplianceGaps);
router.patch('/tasks/:id', complianceController_js_1.updateTaskStatus);
exports.default = router;
