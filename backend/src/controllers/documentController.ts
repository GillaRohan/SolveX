import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { DocumentParser } from '../services/documentParser.js';
import { AuthRequest } from '../middleware/auth.js';
import fs from 'fs';

const prisma = new PrismaClient();

export const uploadDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const { originalname, mimetype, size, path: filePath } = req.file;

    // Process document using DocumentParser
    const analysis = await DocumentParser.processDocument(filePath, originalname, mimetype);

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
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Document processing failed' });
  }
};

export const getDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
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
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch documents' });
  }
};

export const getDocumentById = async (req: Request, res: Response): Promise<void> => {
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
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch document' });
  }
};

export const chatWithDocument = async (req: Request, res: Response): Promise<void> => {
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

    const answer = await DocumentParser.answerDocumentQuery(query, document);

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
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Document Q&A failed' });
  }
};

export const deleteDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findUnique({ where: { id } });
    if (!document) {
      res.status(404).json({ success: false, message: 'Document not found' });
      return;
    }

    // Try deleting physical file
    if (document.storagePath && fs.existsSync(document.storagePath)) {
      try {
        fs.unlinkSync(document.storagePath);
      } catch (e) {
        console.warn('Could not delete physical file:', e);
      }
    }

    await prisma.document.delete({ where: { id } });

    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to delete document' });
  }
};
