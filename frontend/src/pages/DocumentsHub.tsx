import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Trash2, 
  MessageSquare, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  FileCheck, 
  Send,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { UploadedDocument } from '../types';
import { NavPage } from '../components/Shell';

interface DocumentsHubProps {
  onNavigate: (page: NavPage, data?: any) => void;
}

export const DocumentsHub: React.FC<DocumentsHubProps> = ({ onNavigate }) => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<UploadedDocument | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ q: string; a: string }>>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const data = await api.getDocuments();
      setDocuments(data);
      if (data.length > 0 && !selectedDoc) {
        setSelectedDoc(data[0]);
      }
    } catch (e) {
      console.warn('Error fetching docs:', e);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(20);
    setErrorMsg(null);

    const interval = setInterval(() => {
      setUploadProgress(prev => (prev < 90 ? prev + 20 : prev));
    }, 200);

    try {
      const res = await api.uploadDocument(file);
      clearInterval(interval);
      setUploadProgress(100);

      // Refresh doc list
      await fetchDocs();
      if (res.document) {
        setSelectedDoc(res.document);
      }
    } catch (err: any) {
      clearInterval(interval);
      setErrorMsg(err.message || 'File upload failed');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteDocument(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
      if (selectedDoc?.id === id) {
        setSelectedDoc(documents.find(d => d.id !== id) || null);
      }
    } catch (e) {
      console.warn('Failed to delete doc:', e);
    }
  };

  const handleDocChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim() || !selectedDoc || chatLoading) return;

    const q = chatQuery.trim();
    setChatQuery('');
    setChatLoading(true);

    try {
      const res = await api.chatWithDocument(selectedDoc.id, q);
      setChatHistory(prev => [...prev, { q, a: res.answer }]);
    } catch (err: any) {
      setChatHistory(prev => [...prev, { q, a: 'Error processing question on document.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Document Intelligence & Clause Extractor</h1>
        <p className="text-xs text-slate-500">
          Upload specifications, datasheets, or standard drafts to extract clauses, testing requirements, and compliance risks
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {errorMsg}
        </div>
      )}

      {/* ===================== DRAG & DROP UPLOAD BOX ===================== */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
        }}
        onClick={() => fileInputRef.current?.click()}
        className="p-8 border-2 border-dashed border-bis-300 hover:border-bis-600 bg-white hover:bg-bis-50/40 rounded-3xl text-center cursor-pointer transition-all shadow-sm group"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
          }}
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.webp"
          className="hidden"
        />

        <div className="w-14 h-14 rounded-2xl bg-bis-50 text-bis-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-7 h-7" />
        </div>

        <h3 className="font-bold text-sm text-slate-800">
          Click to upload or drag & drop specification files
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Supports PDF, Word (DOC/DOCX), Plain Text (TXT), and Engineering Drawings (PNG, JPG, WebP) up to 25MB
        </p>

        {isUploading && (
          <div className="mt-4 max-w-xs mx-auto space-y-1.5">
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-bis-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="text-[11px] text-bis-700 font-semibold">
              Extracting text and analyzing clauses ({uploadProgress}%)...
            </span>
          </div>
        )}
      </div>

      {/* ===================== DUAL WORKSPACE: DOC LIST + ANALYSIS ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Uploaded Document List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Uploaded Documents ({documents.length})
            </span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {documents.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No documents uploaded yet. Upload a PDF or specification sheet above.
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start justify-between gap-2 ${
                    selectedDoc?.id === doc.id
                      ? 'bg-bis-50/80 border-bis-300 shadow-sm'
                      : 'bg-slate-50 hover:bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5 truncate">
                    <FileText className={`w-4 h-4 shrink-0 mt-0.5 ${selectedDoc?.id === doc.id ? 'text-bis-600' : 'text-slate-400'}`} />
                    <div className="truncate">
                      <h4 className="font-bold text-slate-800 truncate max-w-[170px]">{doc.name}</h4>
                      <p className="text-[10px] text-slate-400">
                        {(doc.fileSize / 1024).toFixed(1)} KB • {doc.status}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(doc.id);
                    }}
                    className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: AI Document Analysis & Chat */}
        <div className="lg:col-span-2 space-y-6">
          {selectedDoc && selectedDoc.summary ? (
            <>
              {/* Document Summary Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold text-bis-600 uppercase tracking-wider bg-bis-50 px-2 py-0.5 rounded border border-bis-200">
                      AI Document Synthesis
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {selectedDoc.summary.documentTitle}
                    </h3>
                  </div>

                  <button
                    onClick={() => onNavigate('compliance')}
                    className="px-3 py-1.5 bg-bis-600 hover:bg-bis-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm self-start sm:self-auto"
                  >
                    Generate Checklist
                  </button>
                </div>

                {/* Key Requirements & Clauses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Key Requirements Identified:
                    </span>
                    <ul className="space-y-1 text-slate-700 list-disc list-inside">
                      {selectedDoc.summary.keyRequirements.map((r, i) => (
                        <li key={i} className="leading-relaxed">{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-bis-600" />
                      Important Clauses Citing Standards:
                    </span>
                    <ul className="space-y-1 text-slate-700 list-disc list-inside">
                      {selectedDoc.summary.importantClauses.map((c, i) => (
                        <li key={i} className="leading-relaxed">{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Testing Requirements & Compliance Pitfalls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
                    <span className="font-bold text-blue-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-700" />
                      Laboratory Testing Protocols:
                    </span>
                    <ul className="space-y-1 text-slate-700 list-disc list-inside">
                      {selectedDoc.summary.testingRequirements.map((t, i) => (
                        <li key={i} className="leading-relaxed">{t}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                      Potential Compliance Pitfalls:
                    </span>
                    <ul className="space-y-1 text-slate-700 list-disc list-inside">
                      {selectedDoc.summary.potentialCompliancePitfalls.map((p, i) => (
                        <li key={i} className="leading-relaxed">{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Chat with Document Component */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-bis-600" />
                  <h3 className="font-bold text-sm text-slate-900">
                    Chat with Document ({selectedDoc.name})
                  </h3>
                </div>

                {/* Q&A stream */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {chatHistory.length === 0 ? (
                    <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500 text-center">
                      Ask any question about this document (e.g. "What tests are required?", "Which clauses are critical?", "What are the common pitfalls?")
                    </div>
                  ) : (
                    chatHistory.map((h, i) => (
                      <div key={i} className="space-y-2 text-xs">
                        <div className="p-2.5 bg-bis-50 text-bis-900 font-medium rounded-lg text-right">
                          {h.q}
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl whitespace-pre-wrap">
                          {h.a}
                        </div>
                      </div>
                    ))
                  )}

                  {chatLoading && (
                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-bis-600" />
                      Analyzing clauses in document...
                    </div>
                  )}
                </div>

                {/* Chat form */}
                <form onSubmit={handleDocChat} className="flex gap-2">
                  <input
                    type="text"
                    value={chatQuery}
                    onChange={(e) => setChatQuery(e.target.value)}
                    placeholder="Ask a question about this document..."
                    className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-bis-600 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!chatQuery.trim() || chatLoading}
                    className="px-4 py-2 bg-bis-600 hover:bg-bis-700 text-white rounded-xl text-xs font-bold disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700 text-sm">No Document Selected</h3>
              <p className="text-xs text-slate-400">
                Upload a document or select an existing document from the left list to view AI clause breakdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
