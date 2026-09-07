"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocument = exports.chatWithDocument = exports.getDocumentById = exports.getDocuments = exports.uploadDocument = void 0;
const client_1 = require("@prisma/client");
const documentParser_js_1 = require("../services/documentParser.js");
const fs_1 = __importDefault(require("fs"));
const prisma = new client_1.PrismaClient();
const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'No file uploaded' });
            return;
        }
        const { originalname, mimetype, size, path: filePath } = req.file;
        // Process document using DocumentParser
        const analysis = await documentParser_js_1.DocumentParser.processDocument(filePath, originalname, mimetype);
        // Save to database
        const document = await prisma.document.create({
            data: {
                userId: req.user ? req.user.id : null,
                name: originalname,
                fileType: mimetype,
                fileSize: size,
                storagePath: filePath,
                status: 'PROCESSED',
                extractedText: analysis.extractedText,
                summary: JSON.stringify(analysis.summary),
                chunks: {
                    create: analysis.chunks.map(c => ({
                        pageNumber: c.pageNumber,
                        clause: c.clause,
                        content: c.content
                    }))
                }
            },
            include: {
                chunks: true
            }
        });
        res.status(201).json({
            success: true,
            message: 'Document uploaded and analyzed successfully',
            document: {
                id: document.id,
                name: document.name,
                fileType: document.fileType,
                fileSize: document.fileSize,
                status: document.status,
                summary: analysis.summary,
                chunksCount: analysis.chunks.length,
                createdAt: document.createdAt
            }
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Document processing failed' });
    }
};
exports.uploadDocument = uploadDocument;
const getDocuments = async (req, res) => {
    try {
        const documents = await prisma.document.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                fileType: true,
                fileSize: true,
                status: true,
                summary: true,
                createdAt: true,
            }
        });
        const formatted = documents.map(d => ({
            ...d,
            summary: d.summary ? JSON.parse(d.summary) : null
        }));
        res.json({ success: true, count: documents.length, documents: formatted });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to fetch documents' });
    }
};
exports.getDocuments = getDocuments;
const getDocumentById = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await prisma.document.findUnique({
            where: { id },
            include: { chunks: true }
        });
        if (!document) {
            res.status(404).json({ success: false, message: 'Document not found' });
            return;
        }
        res.json({
            success: true,
            document: {
                ...document,
                summary: document.summary ? JSON.parse(document.summary) : null
            }
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to fetch document' });
    }
};
exports.getDocumentById = getDocumentById;
const chatWithDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { query } = req.body;
        if (!query) {
            res.status(400).json({ success: false, message: 'Question query is required' });
            return;
        }
        const document = await prisma.document.findUnique({
            where: { id },
            include: { chunks: true }
        });
        if (!document) {
            res.status(404).json({ success: false, message: 'Document not found' });
            return;
        }
        const answer = await documentParser_js_1.DocumentParser.answerDocumentQuery(query, document);
        res.json({
            success: true,
            documentId: id,
            documentName: document.name,
            query,
            answer,
            sources: [
                {
                    documentTitle: document.name,
                    clause: 'Extracted Clauses & Summary',
                    isOfficial: false,
                    notes: 'Grounded in user-uploaded specification'
                }
            ]
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Document Q&A failed' });
    }
};
exports.chatWithDocument = chatWithDocument;
const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await prisma.document.findUnique({ where: { id } });
        if (!document) {
            res.status(404).json({ success: false, message: 'Document not found' });
            return;
        }
        // Try deleting physical file
        if (document.storagePath && fs_1.default.existsSync(document.storagePath)) {
            try {
                fs_1.default.unlinkSync(document.storagePath);
            }
            catch (e) {
                console.warn('Could not delete physical file:', e);
            }
        }
        await prisma.document.delete({ where: { id } });
        res.json({ success: true, message: 'Document deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to delete document' });
    }
};
exports.deleteDocument = deleteDocument;
