import { 
  Standard, 
  Laboratory, 
  UploadedDocument, 
  ComplianceProject, 
  ProductVerification, 
  NotificationItem, 
  BISTerm, 
  User 
} from '../types';

const API_BASE = '/api';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('solvex_token');
  const demoRole = localStorage.getItem('solvex_demo_role') || 'CONSUMER';
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-demo-role': demoRole
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async register(userData: any): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async demoLogin(role: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Demo login failed');
    return data;
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch user');
    return data;
  },

  // Standards
  async getStandards(params?: { category?: string; mandatory?: boolean; search?: string }): Promise<Standard[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.mandatory !== undefined) query.append('mandatory', String(params.mandatory));
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE}/standards?${query.toString()}`, {
      headers: getHeaders()
    });
    const data = await res.json();
    return data.standards || [];
  },

  async getStandardById(id: string): Promise<{ standard: Standard; recommendedLaboratories: Laboratory[] }> {
    const res = await fetch(`${API_BASE}/standards/${id}`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Standard not found');
    return data;
  },

  async searchGlobal(query: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/standards/search`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    return data.results || [];
  },

  // AI Assistant
  async chatAI(query: string, language: string = 'en', conversationId?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ query, language, conversationId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'AI Chat failed');
    return data;
  },

  async recommendStandard(productDescription: string, language: string = 'en'): Promise<any> {
    const res = await fetch(`${API_BASE}/ai/standard-recommendation`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ productDescription, language })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Recommendation failed');
    return data;
  },

  async explainTerm(term: string): Promise<BISTerm> {
    const res = await fetch(`${API_BASE}/ai/explain-term`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ term })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Explanation failed');
    return data.explanation;
  },

  async clauseSearch(query: string, standardNumber?: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/ai/clause-search`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ query, standardNumber })
    });
    const data = await res.json();
    return data.results || [];
  },

  // Documents
  async uploadDocument(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('solvex_token');
    const demoRole = localStorage.getItem('solvex_demo_role') || 'CONSUMER';
    const headers: HeadersInit = { 'x-demo-role': demoRole };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      headers,
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Upload failed');
    return data;
  },

  async getDocuments(): Promise<UploadedDocument[]> {
    const res = await fetch(`${API_BASE}/documents`, {
      headers: getHeaders()
    });
    const data = await res.json();
    return data.documents || [];
  },

  async getDocumentById(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/documents/${id}`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Document not found');
    return data.document;
  },

  async chatWithDocument(id: string, query: string): Promise<any> {
    const res = await fetch(`${API_BASE}/documents/${id}/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Document chat failed');
    return data;
  },

  async deleteDocument(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/documents/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Delete failed');
  },

  // Compliance
  async getComplianceProjects(): Promise<ComplianceProject[]> {
    const res = await fetch(`${API_BASE}/compliance/projects`, {
      headers: getHeaders()
    });
    const data = await res.json();
    return data.projects || [];
  },

  async createComplianceProject(product: string, standardNumber: string): Promise<ComplianceProject> {
    const res = await fetch(`${API_BASE}/compliance/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ product, standardNumber })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Project creation failed');
    return data.project;
  },

  async generateChecklist(product: string, standardNumber: string): Promise<any> {
    const res = await fetch(`${API_BASE}/compliance/checklist`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ product, standardNumber })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Checklist generation failed');
    return data;
  },

  async analyzeGaps(projectId: string, completedCount: number, totalCount: number): Promise<any> {
    const res = await fetch(`${API_BASE}/compliance/analyze-gaps`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ projectId, completedTasksCount: completedCount, totalTasksCount: totalCount })
    });
    const data = await res.json();
    return data;
  },

  async updateTaskStatus(taskId: string, status: string): Promise<any> {
    const res = await fetch(`${API_BASE}/compliance/tasks/${taskId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    return data;
  },

  // Laboratories
  async getLaboratories(params?: { category?: string; standard?: string; state?: string; search?: string }): Promise<Laboratory[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.standard) query.append('standard', params.standard);
    if (params?.state) query.append('state', params.state);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE}/laboratories?${query.toString()}`, {
      headers: getHeaders()
    });
    const data = await res.json();
    return data.laboratories || [];
  },

  async recommendLaboratories(product: string, standardNumber?: string, location?: string): Promise<Laboratory[]> {
    const res = await fetch(`${API_BASE}/laboratories/recommend`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ product, standardNumber, location })
    });
    const data = await res.json();
    return data.recommendations || [];
  },

  // Scanner & Verification
  async verifyManual(licenceNumber: string): Promise<ProductVerification> {
    const res = await fetch(`${API_BASE}/scanner/verify-manual`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ licenceNumber })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Verification failed');
    return data.verification;
  },

  async scanImage(imageBase64: string): Promise<ProductVerification> {
    const res = await fetch(`${API_BASE}/scanner/scan-image`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ imageBase64 })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Scan analysis failed');
    return data.verification;
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: getHeaders()
    });
    const data = await res.json();
    return data.notifications || [];
  },

  // Admin
  async getAdminAnalytics(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/analytics`, {
      headers: getHeaders()
    });
    const data = await res.json();
    return data.analytics;
  }
};
