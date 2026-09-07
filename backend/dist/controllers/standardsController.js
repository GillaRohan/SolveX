"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchStandards = exports.getStandardById = exports.getStandards = void 0;
const client_1 = require("@prisma/client");
const ragService_js_1 = require("../services/ragService.js");
const prisma = new client_1.PrismaClient();
const getStandards = async (req, res) => {
    try {
        const { category, mandatory, search } = req.query;
        const where = {};
        if (category && category !== 'ALL') {
            where.category = { contains: String(category) };
        }
        if (mandatory !== undefined) {
            where.isMandatory = mandatory === 'true';
        }
        if (search) {
            const q = String(search);
            where.OR = [
                { standardNumber: { contains: q } },
                { title: { contains: q } },
                { description: { contains: q } },
                { category: { contains: q } }
            ];
        }
        const standards = await prisma.standard.findMany({
            where,
            include: {
                _count: {
                    select: { clauses: true }
                }
            },
            orderBy: { standardNumber: 'asc' }
        });
        res.json({ success: true, count: standards.length, standards });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to fetch standards' });
    }
};
exports.getStandards = getStandards;
const getStandardById = async (req, res) => {
    try {
        const { id } = req.params;
        const standard = await prisma.standard.findFirst({
            where: {
                OR: [
                    { id },
                    { standardNumber: id }
                ]
            },
            include: {
                clauses: {
                    orderBy: { clauseNumber: 'asc' }
                }
            }
        });
        if (!standard) {
            res.status(404).json({ success: false, message: 'Standard not found' });
            return;
        }
        // Also look up relevant laboratories that cover this standard
        const labs = await prisma.laboratory.findMany({
            where: {
                standardsCovered: { contains: standard.standardNumber }
            }
        });
        res.json({
            success: true,
            standard,
            recommendedLaboratories: labs
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to fetch standard' });
    }
};
exports.getStandardById = getStandardById;
const searchStandards = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            res.status(400).json({ success: false, message: 'Search query is required' });
            return;
        }
        const results = await ragService_js_1.RAGService.search(query);
        res.json({ success: true, count: results.length, results });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Search failed' });
    }
};
exports.searchStandards = searchStandards;
