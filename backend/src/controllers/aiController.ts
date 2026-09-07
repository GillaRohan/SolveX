import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AIService } from '../services/aiService.js';
import { RAGService } from '../services/ragService.js';
import { AuthRequest } from '../middleware/auth.js';

const prisma = new PrismaClient();

export const chat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { query, language = 'en', conversationId, context } = req.body;

    if (!query) {
      res.status(400).json({ success: false, message: 'Query prompt is required' });
      return;
    }

    const aiResponse = await AIService.chat(query, language, context);

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
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'AI Chat processing failed' });
  }
};

export const recommendStandard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productDescription, language = 'en' } = req.body;

    if (!productDescription) {
      res.status(400).json({ success: false, message: 'Product description is required' });
      return;
    }

    const recommendation = await AIService.recommendStandard(productDescription, language);
    res.json({ success: true, ...recommendation });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Standard recommendation failed' });
  }
};

export const explainTerm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { term } = req.body;

    if (!term) {
      res.status(400).json({ success: false, message: 'Term query is required' });
      return;
    }

    const explanation = AIService.explainTerm(term);
    res.json({ success: true, explanation });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Term explanation failed' });
  }
};

export const clauseSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, standardNumber } = req.body;

    if (!query) {
      res.status(400).json({ success: false, message: 'Clause search query is required' });
      return;
    }

    const results = await RAGService.findClauses(query, standardNumber);
    res.json({ success: true, count: results.length, results });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Clause search failed' });
  }
};

export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
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
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch conversations' });
  }
};
