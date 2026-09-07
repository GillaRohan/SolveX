"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversations = exports.clauseSearch = exports.explainTerm = exports.recommendStandard = exports.chat = void 0;
const client_1 = require("@prisma/client");
const aiService_js_1 = require("../services/aiService.js");
const ragService_js_1 = require("../services/ragService.js");
const prisma = new client_1.PrismaClient();
const chat = async (req, res) => {
    try {
        const { query, language = 'en', conversationId, context } = req.body;
        if (!query) {
            res.status(400).json({ success: false, message: 'Query prompt is required' });
            return;
        }
        const aiResponse = await aiService_js_1.AIService.chat(query, language, context);
        // Save message to conversation if conversationId or user is logged in
        let activeConversationId = conversationId;
        if (req.user && !activeConversationId) {
            // Create new conversation
            const conv = await prisma.conversation.create({
                data: {
                    userId: req.user.id,
                    title: query.slice(0, 40) + '...'
                }
            });
            activeConversationId = conv.id;
        }
        if (activeConversationId) {
            // Save user message
            await prisma.message.create({
                data: {
                    conversationId: activeConversationId,
                    role: 'user',
                    content: query
                }
            });
            // Save assistant message
            await prisma.message.create({
                data: {
                    conversationId: activeConversationId,
                    role: 'assistant',
                    content: aiResponse.answer,
                    sources: JSON.stringify(aiResponse.sources),
                    relatedQuestions: JSON.stringify(aiResponse.relatedQuestions),
                    recommendedAction: aiResponse.recommendedAction
                }
            });
        }
        res.json({
            success: true,
            conversationId: activeConversationId,
            ...aiResponse
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'AI Chat processing failed' });
    }
};
exports.chat = chat;
const recommendStandard = async (req, res) => {
    try {
        const { productDescription, language = 'en' } = req.body;
        if (!productDescription) {
            res.status(400).json({ success: false, message: 'Product description is required' });
            return;
        }
        const recommendation = await aiService_js_1.AIService.recommendStandard(productDescription, language);
        res.json({ success: true, ...recommendation });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Standard recommendation failed' });
    }
};
exports.recommendStandard = recommendStandard;
const explainTerm = async (req, res) => {
    try {
        const { term } = req.body;
        if (!term) {
            res.status(400).json({ success: false, message: 'Term query is required' });
            return;
        }
        const explanation = aiService_js_1.AIService.explainTerm(term);
        res.json({ success: true, explanation });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Term explanation failed' });
    }
};
exports.explainTerm = explainTerm;
const clauseSearch = async (req, res) => {
    try {
        const { query, standardNumber } = req.body;
        if (!query) {
            res.status(400).json({ success: false, message: 'Clause search query is required' });
            return;
        }
        const results = await ragService_js_1.RAGService.findClauses(query, standardNumber);
        res.json({ success: true, count: results.length, results });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Clause search failed' });
    }
};
exports.clauseSearch = clauseSearch;
const getConversations = async (req, res) => {
    try {
        if (!req.user) {
            res.json({ success: true, conversations: [] });
            return;
        }
        const conversations = await prisma.conversation.findMany({
            where: { userId: req.user.id },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });
        res.json({ success: true, conversations });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to fetch conversations' });
    }
};
exports.getConversations = getConversations;
