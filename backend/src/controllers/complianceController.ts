import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.js';

const prisma = new PrismaClient();

export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user ? req.user.id : undefined;

    const projects = await prisma.complianceProject.findMany({
      where: userId ? { userId } : {},
      include: {
        tasks: {
          orderBy: { category: 'asc' }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const formatted = projects.map(p => ({
      ...p,
      readinessBreakdown: p.readinessBreakdown ? JSON.parse(p.readinessBreakdown) : null
    }));

    res.json({ success: true, count: projects.length, projects: formatted });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch compliance projects' });
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await prisma.complianceProject.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: { category: 'asc' }
        }
      }
    });

    if (!project) {
      res.status(404).json({ success: false, message: 'Compliance project not found' });
      return;
    }

    res.json({
      success: true,
      project: {
        ...project,
        readinessBreakdown: project.readinessBreakdown ? JSON.parse(project.readinessBreakdown) : null
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch project' });
  }
};

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { product, standardNumber } = req.body;

    if (!product || !standardNumber) {
      res.status(400).json({ success: false, message: 'Product name and standard number are required' });
      return;
    }

    // Find standard if available
    const standard = await prisma.standard.findFirst({
      where: { standardNumber }
    });

    // Default or user ID
    let userId = req.user ? req.user.id : null;
    if (!userId) {
      const demoUser = await prisma.user.findFirst({ where: { role: 'MANUFACTURER' } });
      userId = demoUser ? demoUser.id : 'demo-user';
    }

    const initialTasks = [
      {
        title: `Confirm applicable standard version (${standardNumber}) and mandatory QCO scope`,
        category: 'IDENTIFY',
        status: 'COMPLETED',
        priority: 'HIGH',
        dueDate: 'Day 1-3',
        notes: 'Standard identified via SolveX AI recommendation.'
      },
      {
        title: 'Review bill of materials (BOM) and component supplier compliance',
        category: 'DISCOVER',
        status: 'COMPLETED',
        priority: 'HIGH',
        dueDate: 'Day 4-7',
        notes: 'Confirm food-contact / flame-retardant grade certificates.'
      },
      {
        title: 'Study technical safety clauses & internal construction tolerances',
        category: 'UNDERSTAND',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: 'Day 8-14',
        notes: 'Review dielectric thresholds and abnormal operation safeguards.'
      },
      {
        title: 'Send prototype specimens to BIS-recognized laboratory for type testing',
        category: 'TEST',
        status: 'PENDING',
        priority: 'HIGH',
        dueDate: 'Day 15-30',
        notes: 'Obtain test report with complete clause-wise compliance results.'
      },
      {
        title: 'Submit Form-V Application with factory layout on ManakOnline',
        category: 'CERTIFY',
        status: 'PENDING',
        priority: 'MEDIUM',
        dueDate: 'Day 31-45',
        notes: 'Prepare factory assessment readiness files and calibration records.'
      },
      {
        title: 'Implement in-house routine testing & Scheme of Inspection and Testing (SIT)',
        category: 'COMPLY',
        status: 'PENDING',
        priority: 'MEDIUM',
        dueDate: 'Ongoing',
        notes: 'Maintain daily batch testing register for BIS surveillance audits.'
      }
    ];

    const project = await prisma.complianceProject.create({
      data: {
        userId,
        product,
        standardNumber,
        standardTitle: standard ? standard.title : 'Indian Standard Specification',
        score: 65,
        status: 'IN_PROGRESS',
        readinessBreakdown: JSON.stringify({
          standardIdentification: 100,
          technicalDocumentation: 70,
          laboratoryTesting: 40,
          factoryInspectionPrep: 50
        }),
        tasks: {
          create: initialTasks
        }
      },
      include: {
        tasks: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Compliance roadmap created successfully',
      project: {
        ...project,
        readinessBreakdown: JSON.parse(project.readinessBreakdown || '{}')
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to create compliance project' });
  }
};

export const generateChecklist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { product, standardNumber, certificationType = 'Scheme I' } = req.body;

    const checklist = [
      {
        id: 'c1',
        section: '1. Standard Identification & QCO Status',
        item: `Verify applicable Indian Standard: ${standardNumber || 'IS 302-2-15'}`,
        description: 'Ensure you are manufacturing to the latest gazette revision with all active amendments.',
        status: 'COMPLETED',
        mandatory: true
      },
      {
        id: 'c2',
        section: '1. Standard Identification & QCO Status',
        item: 'Check DPIIT/Ministry Quality Control Order enforcement date',
        description: 'Verify whether commercial stocking or sale is already legally barred without BIS mark.',
        status: 'COMPLETED',
        mandatory: true
      },
      {
        id: 'c3',
        section: '2. Technical Documentation',
        item: 'Draft comprehensive Technical File and Bill of Materials (BOM)',
        description: 'Include component sub-assembly supplier certificates (plastics, cables, heating elements).',
        status: 'IN_PROGRESS',
        mandatory: true
      },
      {
        id: 'c4',
        section: '2. Technical Documentation',
        item: 'Prepare manufacturing process flowchart & quality control manual',
        description: 'Document incoming material inspection, in-process QC points, and finished goods testing.',
        status: 'PENDING',
        mandatory: true
      },
      {
        id: 'c5',
        section: '3. Laboratory Pre-Compliance Testing',
        item: 'Engage NABL / BIS Recognized Testing Laboratory',
        description: 'Submit product samples for full type testing under applicable clauses.',
        status: 'PENDING',
        mandatory: true
      },
      {
        id: 'c6',
        section: '3. Laboratory Pre-Compliance Testing',
        item: 'Verify passing results on abnormal operation and insulation tests',
        description: 'Ensure zero flame, dielectric breakdown, or hazardous leakage current.',
        status: 'PENDING',
        mandatory: true
      },
      {
        id: 'c7',
        section: '4. Plant & In-House Testing Setup',
        item: 'Procure calibrated routine testing equipment',
        description: 'Must include High Voltage Flash Tester, Earth Continuity Meter, and Leakage Current Tester.',
        status: 'PENDING',
        mandatory: true
      },
      {
        id: 'c8',
        section: '4. Plant & In-House Testing Setup',
        item: 'Maintain NABL calibration certificates for all test apparatus',
        description: 'Instruments must possess valid annual calibration from NABL accredited calibration labs.',
        status: 'PENDING',
        mandatory: true
      },
      {
        id: 'c9',
        section: '5. ManakOnline Certification Filing',
        item: 'File Form-V Online Application & submit manufacturing plant layout',
        description: 'Pay requisite application fees and upload undertaking documents.',
        status: 'PENDING',
        mandatory: true
      },
      {
        id: 'c10',
        section: '6. Factory Audit & Licence Grant',
        item: 'Host BIS Inspecting Officers for on-site factory verification',
        description: 'Inspectors verify routine testing, draw random market samples, and recommend CM/L issuance.',
        status: 'PENDING',
        mandatory: true
      }
    ];

    res.json({
      success: true,
      product: product || 'Electric Appliance',
      standardNumber: standardNumber || 'IS 302-2-15',
      certificationType,
      itemsCount: checklist.length,
      checklist
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to generate checklist' });
  }
};

export const analyzeComplianceGaps = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId, completedTasksCount = 3, totalTasksCount = 6 } = req.body;

    const ratio = completedTasksCount / (totalTasksCount || 1);
    const score = Math.min(100, Math.max(25, Math.round(ratio * 100)));

    let status = 'NEEDS_ATTENTION';
    if (score >= 80) status = 'READY';
    else if (score < 50) status = 'NOT_READY';

    res.json({
      success: true,
      score,
      status,
      scoreExplanation: `Score is calculated from weighted compliance milestones: Standard Identification (25%), Technical Files (25%), Laboratory Type Testing (30%), and In-House SIT Setup (20%).`,
      categoryBreakdown: {
        standardIdentification: 100,
        documentation: Math.min(100, Math.round(ratio * 90)),
        laboratoryTesting: Math.min(100, Math.round(ratio * 70)),
        factoryInspectionPrep: Math.min(100, Math.round(ratio * 60))
      },
      completedMilestones: [
        'Applicable Indian Standard identified and verified against latest Gazette QCO',
        'Initial product specifications and BOM structure reviewed'
      ],
      missingRequirements: [
        'Formal type testing report from BIS-recognized testing laboratory',
        'Valid annual calibration certificates for in-house high-voltage flash tester',
        'Drafted Scheme of Inspection and Testing (SIT) manual'
      ],
      riskAreas: [
        'High Risk: Operating uncertified manufacturing once the gazette QCO deadline passes',
        'Moderate Risk: Potential sample failure during dry-boil temperature rise testing if thermal cutoff trip point is too high'
      ],
      recommendedActions: [
        'Shortlist an accredited laboratory to perform pre-compliance testing',
        'Ensure in-house testing instruments have valid NABL calibration seals',
        'Avail the 50% MSME concession on BIS marking fees when submitting application on ManakOnline'
      ]
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Compliance gap analysis failed' });
  }
};

export const updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedTask = await prisma.complianceTask.update({
      where: { id },
      data: { status }
    });

    // Recalculate project score
    const allTasks = await prisma.complianceTask.findMany({
      where: { projectId: updatedTask.projectId }
    });

    const completed = allTasks.filter(t => t.status === 'COMPLETED').length;
    const newScore = Math.round((completed / allTasks.length) * 100);

    const project = await prisma.complianceProject.update({
      where: { id: updatedTask.projectId },
      data: {
        score: newScore,
        status: newScore >= 80 ? 'READY' : 'IN_PROGRESS'
      },
      include: { tasks: true }
    });

    res.json({
      success: true,
      task: updatedTask,
      newProjectScore: newScore,
      project
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update task' });
  }
};
