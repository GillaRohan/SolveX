import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getLaboratories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, standard, state, search } = req.query;

    const where: any = {};
    if (category && category !== 'ALL') {
      where.capabilities = { contains: String(category) };
    }
    if (standard) {
      where.standardsCovered = { contains: String(standard) };
    }
    if (state && state !== 'ALL') {
      where.state = { contains: String(state) };
    }
    if (search) {
      const q = String(search);
      where.OR = [
        { name: { contains: q } },
        { location: { contains: q } },
        { capabilities: { contains: q } },
        { standardsCovered: { contains: q } },
        { state: { contains: q } }
      ];
    }

    const laboratories = await prisma.laboratory.findMany({
      where,
      orderBy: [
        { isRecommended: 'desc' },
        { name: 'asc' }
      ]
    });

    res.json({ success: true, count: laboratories.length, laboratories });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch laboratories' });
  }
};

export const recommendLaboratories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { product, standardNumber, location } = req.body;

    // ★ MANDATORY: Location is required when recommending laboratories
    if (!location || String(location).trim().length === 0) {
      res.status(400).json({
        success: false,
        message: 'Location is required. Please provide your City, State, or Pincode to find the nearest accredited BIS laboratory.'
      });
      return;
    }

    let where: any = {};
    if (standardNumber) {
      where.standardsCovered = { contains: standardNumber };
    }

    // Also search by product keywords in capabilities
    if (product && !standardNumber) {
      const productLower = String(product).toLowerCase();
      // Map common product keywords to lab capabilities
      const capabilityKeywords: string[] = [];
      if (productLower.includes('kettle') || productLower.includes('appliance') || productLower.includes('iron') || productLower.includes('fan') || productLower.includes('heater')) {
        capabilityKeywords.push('Electrical', 'Household Appliances');
      }
      if (productLower.includes('helmet') || productLower.includes('vehicle') || productLower.includes('automotive')) {
        capabilityKeywords.push('Automotive', 'Crash Testing', 'Helmet');
      }
      if (productLower.includes('battery') || productLower.includes('power bank') || productLower.includes('charger')) {
        capabilityKeywords.push('Battery', 'Electronics', 'Lithium');
      }
      if (productLower.includes('food') || productLower.includes('water') || productLower.includes('spice') || productLower.includes('packaged')) {
        capabilityKeywords.push('Food', 'Packaged Water', 'Microbiology');
      }
      if (productLower.includes('toy') || productLower.includes('children')) {
        capabilityKeywords.push('Toy', 'Consumer Products');
      }
      if (productLower.includes('led') || productLower.includes('lamp') || productLower.includes('light') || productLower.includes('bulb')) {
        capabilityKeywords.push('Lighting', 'LED', 'Electrical');
      }
      if (productLower.includes('gold') || productLower.includes('jewel') || productLower.includes('hallmark')) {
        capabilityKeywords.push('Gold', 'Hallmarking', 'Assay');
      }
      if (productLower.includes('cooker') || productLower.includes('pressure')) {
        capabilityKeywords.push('Mechanical', 'Pressure');
      }
      if (productLower.includes('cable') || productLower.includes('wire') || productLower.includes('transformer')) {
        capabilityKeywords.push('Cables', 'High Voltage', 'Power');
      }
      if (productLower.includes('cement') || productLower.includes('steel') || productLower.includes('construction')) {
        capabilityKeywords.push('Cement', 'Steel', 'Construction');
      }
      if (productLower.includes('plastic') || productLower.includes('polymer') || productLower.includes('pipe') || productLower.includes('pet')) {
        capabilityKeywords.push('Plastics', 'Polymer', 'PET');
      }

      // If we identified keywords, search by capabilities
      if (capabilityKeywords.length > 0) {
        where.OR = capabilityKeywords.map(kw => ({
          capabilities: { contains: kw }
        }));
      }
    }

    let labs = await prisma.laboratory.findMany({ where });

    // If no exact match for standard or product, return general recommended labs
    if (labs.length === 0) {
      labs = await prisma.laboratory.findMany({
        where: { isRecommended: true }
      });
    }

    // ★ Sort by location match (mandatory location used for proximity scoring)
    const loc = String(location).toLowerCase().trim();
    labs.sort((a, b) => {
      // Score: exact city match > state match > partial match > no match
      const scoreMatch = (lab: typeof a) => {
        const labLocation = lab.location.toLowerCase();
        const labState = lab.state.toLowerCase();
        const labAddress = lab.address.toLowerCase();

        // Exact city/location match
        if (labLocation.includes(loc) || loc.includes(labLocation.split(',')[0].trim())) return 100;
        // State match
        if (labState.includes(loc) || loc.includes(labState)) return 75;
        // Address partial match
        if (labAddress.includes(loc)) return 50;
        // Any partial match
        const locWords = loc.split(/[\s,]+/).filter(w => w.length > 2);
        const hasPartial = locWords.some(w => 
          labLocation.includes(w) || labState.includes(w) || labAddress.includes(w)
        );
        if (hasPartial) return 25;
        return 0;
      };

      const aScore = scoreMatch(a);
      const bScore = scoreMatch(b);

      // Primary: location match score (desc)
      if (bScore !== aScore) return bScore - aScore;
      // Secondary: recommended labs first
      return (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0);
    });

    res.json({
      success: true,
      query: { product, standardNumber, location },
      recommendedCount: labs.length,
      recommendations: labs
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to recommend laboratories' });
  }
};
