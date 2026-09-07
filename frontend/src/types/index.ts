export type UserRole = 'CONSUMER' | 'MANUFACTURER' | 'STUDENT' | 'ADMIN';
export type AppLanguage = 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'bn';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role: UserRole;
  language: AppLanguage;
}

export interface StandardClause {
  id: string;
  clauseNumber: string;
  title: string;
  content: string;
  pageNumber?: number;
}

export interface Standard {
  id: string;
  standardNumber: string;
  title: string;
  category: string;
  description: string;
  scope: string;
  status: string;
  version: string;
  isMandatory: boolean;
  qcoDate?: string;
  certificationScheme: string;
  testingRequirements?: string;
  sourceUrl?: string;
  clauses?: StandardClause[];
  _count?: {
    clauses: number;
  };
}

export interface Laboratory {
  id: string;
  name: string;
  location: string;
  state: string;
  capabilities: string;
  standardsCovered: string;
  contactEmail?: string;
  contactPhone?: string;
  address: string;
  isRecommended: boolean;
  isNablAccredited: boolean;
  isBisRecognized: boolean;
}

export interface DocumentSummary {
  documentTitle: string;
  keyRequirements: string[];
  importantClauses: string[];
  testingRequirements: string[];
  certificationRequirements: string[];
  importantTerms: string[];
  potentialCompliancePitfalls: string[];
}

export interface UploadedDocument {
  id: string;
  name: string;
  fileType: string;
  fileSize: number;
  status: string;
  summary: DocumentSummary | null;
  createdAt: string;
}

export interface ComplianceTask {
  id: string;
  projectId: string;
  title: string;
  category: 'IDENTIFY' | 'DISCOVER' | 'UNDERSTAND' | 'TEST' | 'CERTIFY' | 'COMPLY';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate?: string;
  notes?: string;
}

export interface ComplianceProject {
  id: string;
  userId: string;
  product: string;
  standardNumber: string;
  standardTitle?: string;
  score: number;
  status: 'IN_PROGRESS' | 'READY' | 'REVIEW_NEEDED';
  readinessBreakdown?: {
    standardIdentification: number;
    technicalDocumentation: number;
    laboratoryTesting: number;
    factoryInspectionPrep: number;
  };
  tasks: ComplianceTask[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVerification {
  isVerified: boolean;
  licenceNumber: string;
  brand: string;
  manufacturer: string;
  model: string;
  standardNumber: string;
  productCategory: string;
  status: 'OPERATIVE' | 'SUSPENDED' | 'EXPIRED' | 'NOT_FOUND' | 'COUNTERFEIT';
  validUntil: string;
  verificationType: string;
  factoryLocation?: string;
  markExplanation: string;
  consumerGuidance: string;
  isMockData: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  type: 'QCO_UPDATE' | 'STANDARD_REVISION' | 'SYSTEM' | 'REMINDER';
  category: string;
  isUrgent: boolean;
  publishedAt: string;
}

export interface ChatSource {
  standardNumber?: string;
  clause?: string;
  documentTitle?: string;
  sourceUrl?: string;
  isOfficial: boolean;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
  relatedQuestions?: string[];
  recommendedAction?: string;
  createdAt: string;
}

export interface BISTerm {
  term: string;
  aliases: string[];
  simpleDefinition: string;
  technicalDefinition: string;
  whyItMatters: string;
  whoNeedsIt: string;
  relatedServices: string[];
  applicableStandards: string[];
  followUpQuestions: string[];
}
