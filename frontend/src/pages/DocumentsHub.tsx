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
      setChatHistory(prev => [...prev, { q, a: 'Could not extract context from document. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in text-[#1F2937]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-6 rounded-sm bg-[#D4AF37]" />
            <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Document Intelligence Hub
            </h1>
          </div>
          <p className="text-xs text-[#6B7280]">
            Upload CAD drawings, test certificates, or datasheets for instant clause extraction and compliance analysis
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 btn-primary text-xs font-bold transition-all shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <UploadCloud className="w-4 h-4 text-white" />
          <span>Upload Specification</span>
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
          }}
          className="hidden"
          accept=".pdf,.docx,.txt"
        />
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between animate-in fade-in">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-red-500 font-bold">✕</button>
        </div>
      )}

      {/* Upload Progress Banner */}
      {isUploading && (
        <div className="card p-5 bg-white border border-[#D4AF37]/40 space-y-2 shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#996515] flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#C9A227]" />
              Parsing technical specification with Document OCR...
            </span>
            <span className="text-[#111827] font-mono">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#D4AF37] to-[#996515] h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Uploaded Documents List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="card p-4 space-y-3 bg-white border border-[#D4AF37]/35 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-bold text-[#374151] uppercase tracking-wider">
                Specifications ({documents.length})
              </span>
              <span className="text-[10px] text-[#6B7280]">Select to view summary</span>
            </div>

            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {documents.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#6B7280] space-y-2">
                  <FileText className="w-8 h-8 text-[#C9A227] mx-auto" />
                  <p>No specifications uploaded yet.</p>
                </div>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoc(doc);
                      setChatHistory([]);
                    }}
                    className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all flex items-start justify-between gap-2 ${
                      selectedDoc?.id === doc.id
                        ? 'bg-[#FEF9C3] border-[#D4AF37] shadow-xs'
                        : 'bg-[#FAFAF8] hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-white border border-[#D4AF37]/30 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <FileCheck className="w-3.5 h-3.5 text-[#996515]" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#111827] truncate text-xs">{doc.name}</p>
                        <p className="text-[10px] text-[#6B7280]">
                          {(doc.fileSize / 1024).toFixed(1)} KB • {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(doc.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 rounded-lg transition-colors shrink-0 cursor-pointer"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Document Extraction & Chat (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {selectedDoc?.summary ? (
            <div className="card p-6 space-y-5 bg-white border border-[#D4AF37]/35 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#996515] bg-[#FEF9C3] px-2.5 py-0.5 rounded-md border border-[#D4AF37]/40">
                    Auto-Extracted Specification Summary
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-[#111827] mt-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {selectedDoc.summary.documentTitle}
                  </h2>
                </div>
              </div>

              {/* Requirements & Clauses Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#FAFAF8] rounded-2xl border border-gray-200 space-y-1.5 shadow-2xs">
                  <span className="font-bold text-[#111827] flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Key Identified Requirements:
                  </span>
                  <ul className="space-y-1 text-[#4B5563] list-disc list-inside">
                    {selectedDoc.summary.keyRequirements.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-[#FAFAF8] rounded-2xl border border-gray-200 space-y-1.5 shadow-2xs">
                  <span className="font-bold text-[#111827] flex items-center gap-1.5 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#996515]" />
                    Mandatory Indian Standards Clauses:
                  </span>
                  <ul className="space-y-1 text-[#4B5563] list-disc list-inside">
                    {selectedDoc.summary.importantClauses.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pitfalls Callout */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-1 text-amber-900">
                <span className="font-bold flex items-center gap-1 text-[11px] text-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Potential Compliance Pitfalls &amp; Test Failures:
                </span>
                <ul className="space-y-1 text-[#4B5563] list-disc list-inside">
                  {selectedDoc.summary.potentialCompliancePitfalls.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              {/* Document QA Chat Area */}
              <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#111827]">
                  <MessageSquare className="w-4 h-4 text-[#996515]" />
                  <span>Ask AI Questions About This Specification</span>
                </div>

                {/* Chat History */}
                {chatHistory.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
                    {chatHistory.map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="p-2.5 rounded-xl bg-white border border-gray-200 text-[#111827] font-semibold text-right shadow-2xs">
                          {item.q}
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#FEF9C3] border border-[#D4AF37]/40 text-[#1F2937]">
                          {item.a}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleDocChat} className="flex gap-2">
                  <input
                    type="text"
                    value={chatQuery}
                    onChange={(e) => setChatQuery(e.target.value)}
                    placeholder="e.g. What is the earth resistance limit specified in this document?..."
                    className="flex-1 px-3.5 py-2 text-xs bg-white border border-gray-300 focus:border-[#C9A227] rounded-xl text-[#111827] placeholder-[#9CA3AF] outline-none shadow-2xs transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!chatQuery.trim() || chatLoading}
                    className="px-4 py-2 btn-primary text-xs font-bold disabled:opacity-50 cursor-pointer"
                  >
                    {chatLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center space-y-3 bg-white border border-[#D4AF37]/30 shadow-sm">
              <UploadCloud className="w-12 h-12 text-[#C9A227] mx-auto" />
              <h3 className="font-bold text-[#111827] text-sm">Select or upload a specification document</h3>
              <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                Our Document OCR engine automatically parses clauses, test tolerances, and BOM materials against BIS standards.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
