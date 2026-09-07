"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_js_1 = require("./config.js");
const errorHandler_js_1 = require("./middleware/errorHandler.js");
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const standardsRoutes_js_1 = __importDefault(require("./routes/standardsRoutes.js"));
const aiRoutes_js_1 = __importDefault(require("./routes/aiRoutes.js"));
const documentRoutes_js_1 = __importDefault(require("./routes/documentRoutes.js"));
const complianceRoutes_js_1 = __importDefault(require("./routes/complianceRoutes.js"));
const laboratoriesRoutes_js_1 = __importDefault(require("./routes/laboratoriesRoutes.js"));
const scannerRoutes_js_1 = __importDefault(require("./routes/scannerRoutes.js"));
const notificationsRoutes_js_1 = __importDefault(require("./routes/notificationsRoutes.js"));
const adminRoutes_js_1 = __importDefault(require("./routes/adminRoutes.js"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-demo-role']
}));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
// Static uploads serving
app.use('/uploads', express_1.default.static(config_js_1.config.uploadDir));
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
app.use('/api/auth', authRoutes_js_1.default);
app.use('/api/standards', standardsRoutes_js_1.default);
app.use('/api/ai', aiRoutes_js_1.default);
app.use('/api/documents', documentRoutes_js_1.default);
app.use('/api/compliance', complianceRoutes_js_1.default);
app.use('/api/laboratories', laboratoriesRoutes_js_1.default);
app.use('/api/scanner', scannerRoutes_js_1.default);
app.use('/api/notifications', notificationsRoutes_js_1.default);
app.use('/api/admin', adminRoutes_js_1.default);
// Global Error Handler
app.use(errorHandler_js_1.errorHandler);
// Start Server
app.listen(config_js_1.config.port, () => {
    console.log(`=======================================================`);
    console.log(`🚀 SolveX BIS Assistant Backend running on port ${config_js_1.config.port}`);
    console.log(`🔗 API Base: http://localhost:${config_js_1.config.port}/api`);
    console.log(`📂 Uploads: ${config_js_1.config.uploadDir}`);
    console.log(`=======================================================`);
});
exports.default = app;
