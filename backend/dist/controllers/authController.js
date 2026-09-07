"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.demoLogin = exports.login = exports.register = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_js_1 = require("../config.js");
const prisma = new client_1.PrismaClient();
const register = async (req, res) => {
    try {
        const { name, email, mobile, password, role, language } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: 'Name, email, and password are required' });
            return;
        }
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ success: false, message: 'An account with this email already exists' });
            return;
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                mobile: mobile || null,
                passwordHash,
                role: role || 'CONSUMER',
                language: language || 'en'
            }
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, config_js_1.config.jwtSecret, { expiresIn: config_js_1.config.jwtExpiresIn });
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                language: user.language
            }
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Registration failed' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Email and password are required' });
            return;
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, config_js_1.config.jwtSecret, { expiresIn: config_js_1.config.jwtExpiresIn });
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                language: user.language
            }
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Login failed' });
    }
};
exports.login = login;
const demoLogin = async (req, res) => {
    try {
        const { role } = req.body;
        const targetRole = (role || 'CONSUMER').toUpperCase();
        const user = await prisma.user.findFirst({
            where: { role: targetRole }
        });
        if (!user) {
            res.status(404).json({ success: false, message: `Demo user for role ${targetRole} not found` });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, config_js_1.config.jwtSecret, { expiresIn: config_js_1.config.jwtExpiresIn });
        res.json({
            success: true,
            message: `Logged in as Demo ${targetRole}`,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                language: user.language
            }
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Demo login failed' });
    }
};
exports.demoLogin = demoLogin;
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });
        if (!user) {
            res.json({
                success: true,
                user: {
                    id: req.user.id,
                    name: req.user.name,
                    email: req.user.email,
                    role: req.user.role,
                    language: 'en'
                }
            });
            return;
        }
        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                language: user.language
            }
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to retrieve profile' });
    }
};
exports.getMe = getMe;
