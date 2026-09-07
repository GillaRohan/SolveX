import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { RAGService } from '../services/ragService.js';

const prisma = new PrismaClient();

export const getStandards = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, mandatory, search } = req.query;

    const where: any = {};
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
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch standards' });
  }
};

export const getStandardById = async (req: Request, res: Response): Promise<void> => {
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
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch standard' });
  }
};

export const searchStandards = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.body;
    if (!query) {
      res.status(400).json({ success: false, message: 'Search query is required' });
      return;
    }

    const results = await RAGService.search(query);
    res.json({ success: true, count: results.length, results });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Search failed' });
  }
};
