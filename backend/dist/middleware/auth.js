"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_js_1 = require("../config.js");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // For seamless demo exploration, if demo-role header is provided:
        const demoRole = req.headers['x-demo-role'];
        if (demoRole) {
            req.user = {
                id: `demo-${demoRole.toLowerCase()}-id`,
                email: `${demoRole.toLowerCase()}@solvex.in`,
                role: demoRole.toUpperCase(),
                name: `Demo ${demoRole.toUpperCase()}`
            };
            return next();
        }
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_js_1.config.jwtSecret);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};
exports.authenticate = authenticate;
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Authentication required' });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: `Access denied. Role '${req.user.role}' is not authorized for this resource.`
            });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
