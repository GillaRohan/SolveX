import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface SearchResult {
  type: 'STANDARD' | 'CLAUSE' | 'DOCUMENT' | 'LAB';
  id: string;
  title: string;
  subtitle: string;
  snippet: string;
  relevanceScore: number;
  metadata?: any;
}

export class RAGService {
  /**
   * Universal Semantic & Keyword Search across standards, clauses, documents, and labs
   */
  public static async search(query: string, limit: number = 10): Promise<SearchResult[]> {
    const q = query.trim().toLowerCase();
    const results: SearchResult[] = [];

    // 1. Search Standards
    const standards = await prisma.standard.findMany({
      include: { clauses: true }
    });

    for (const std of standards) {
      let score = 0;
      const numMatch = std.standardNumber.toLowerCase().includes(q);
      const titleMatch = std.title.toLowerCase().includes(q);
      const descMatch = std.description.toLowerCase().includes(q);
      const catMatch = std.category.toLowerCase().includes(q);

      if (numMatch) score += 50;
      if (titleMatch) score += 30;
      if (descMatch) score += 15;
      if (catMatch) score += 10;

      if (score > 0) {
        results.push({
          type: 'STANDARD',
          id: std.id,
          title: `${std.standardNumber}: ${std.title}`,
          subtitle: `${std.category} | ${std.certificationScheme} | Version ${std.version}`,
          snippet: std.description.slice(0, 200) + '...',
          relevanceScore: score,
          metadata: {
            standardNumber: std.standardNumber,
            isMandatory: std.isMandatory,
            qcoDate: std.qcoDate
          }
        });
      }

      // Check clauses inside this standard
      for (const clause of std.clauses) {
        let clauseScore = 0;
        if (clause.clauseNumber.toLowerCase().includes(q)) clauseScore += 40;
        if (clause.title.toLowerCase().includes(q)) clauseScore += 30;
        if (clause.content.toLowerCase().includes(q)) clauseScore += 20;

        if (clauseScore > 0) {
          results.push({
            type: 'CLAUSE',
            id: clause.id,
            title: `${clause.clauseNumber}: ${clause.title} (${std.standardNumber})`,
            subtitle: `Standard: ${std.standardNumber} | Page ${clause.pageNumber || 'N/A'}`,
            snippet: clause.content,
            relevanceScore: clauseScore,
            metadata: {
              standardId: std.id,
              standardNumber: std.standardNumber,
              clauseNumber: clause.clauseNumber,
              pageNumber: clause.pageNumber
            }
          });
        }
      }
    }

    // 2. Search Laboratories
    const labs = await prisma.laboratory.findMany();
    for (const lab of labs) {
      let labScore = 0;
      if (lab.name.toLowerCase().includes(q)) labScore += 35;
      if (lab.capabilities.toLowerCase().includes(q)) labScore += 25;
      if (lab.standardsCovered.toLowerCase().includes(q)) labScore += 30;
      if (lab.location.toLowerCase().includes(q)) labScore += 20;

      if (labScore > 0) {
        results.push({
          type: 'LAB',
          id: lab.id,
          title: lab.name,
          subtitle: `${lab.location}, ${lab.state} | ${lab.capabilities}`,
          snippet: `Standards tested: ${lab.standardsCovered}`,
          relevanceScore: labScore,
          metadata: {
            location: lab.location,
            contactPhone: lab.contactPhone,
            isNablAccredited: lab.isNablAccredited
          }
        });
      }
    }

    // 3. Search Uploaded Documents
    const docs = await prisma.document.findMany();
    for (const doc of docs) {
      let docScore = 0;
      if (doc.name.toLowerCase().includes(q)) docScore += 30;
      if (doc.extractedText && doc.extractedText.toLowerCase().includes(q)) docScore += 20;

      if (docScore > 0) {
        results.push({
          type: 'DOCUMENT',
          id: doc.id,
          title: doc.name,
          subtitle: `Uploaded Document (${(doc.fileSize / 1024).toFixed(1)} KB) - ${doc.status}`,
          snippet: doc.extractedText ? doc.extractedText.slice(0, 200) + '...' : 'Uploaded specification document',
          relevanceScore: docScore,
          metadata: {
            fileType: doc.fileType,
            status: doc.status
          }
        });
      }
    }

    // Sort by relevance score descending
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    return results.slice(0, limit);
  }

  /**
   * Clause Finder across standards
   */
  public static async findClauses(clauseQuery: string, standardNumber?: string): Promise<any[]> {
    const q = clauseQuery.toLowerCase().trim();

    const clauses = await prisma.standardClause.findMany({
      where: standardNumber ? { standard: { standardNumber: { contains: standardNumber } } } : {},
      include: { standard: true }
    });

    const matches = clauses.filter(c => 
      c.clauseNumber.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.content.toLowerCase().includes(q) ||
      c.standard.standardNumber.toLowerCase().includes(q)
    );

    return matches.map(c => ({
      id: c.id,
      standardNumber: c.standard.standardNumber,
      standardTitle: c.standard.title,
      clauseNumber: c.clauseNumber,
      clauseTitle: c.title,
      content: c.content,
      pageNumber: c.pageNumber,
      sourceUrl: c.standard.sourceUrl,
      explanation: `Specifies compliance parameters for ${c.title} under ${c.standard.standardNumber}. Failure to satisfy this threshold results in non-conformity during type testing.`
    }));
  }
}
