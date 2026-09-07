import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Search, 
  Filter, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle, 
  FileText, 
  Bot,
  FlaskConical
} from 'lucide-react';
import { api } from '../services/api';
import { Standard } from '../types';
import { NavPage } from '../components/Shell';

interface StandardsCatalogProps {
  onNavigate: (page: NavPage, data?: any) => void;
  onSelectStandard?: (std: Standard) => void;
  initialSearch?: string;
}

export const StandardsCatalog: React.FC<StandardsCatalogProps> = ({ 
  onNavigate, 
  onSelectStandard,
  initialSearch = '' 
}) => {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState('ALL');
  const [mandatoryOnly, setMandatoryOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedStandardModal, setSelectedStandardModal] = useState<Standard | null>(null);

  const categories = [
    'ALL',
    'Electrical & Electronics',
    'Mechanical & Automotive',
    'Food, Water & Agriculture',
    'Electronics & IT Goods',
    'Gold & Hallmarking',
    'Mechanical & Metallurgy',
    'Toys & Children Products'
  ];

  useEffect(() => {
    fetchStandards();
  }, [category, mandatoryOnly]);

  const fetchStandards = async () => {
    setLoading(true);
    try {
      const data = await api.getStandards({
        category: category !== 'ALL' ? category : undefined,
        mandatory: mandatoryOnly ? true : undefined,
        search: search.trim() || undefined
      });
      setStandards(data);
    } catch (e) {
      console.warn('Failed to load standards:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStandards();
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Indian Standards Catalog (IS)</h1>
          <p className="text-xs text-slate-500">
            Explore authoritative specifications, mandatory Quality Control Orders, and technical clauses
          </p>
        </div>

        <button
          onClick={() => onNavigate('ai-assistant', { initialQuery: 'Find applicable Indian Standard for my product.' })}
          className="flex items-center gap-2 px-4 py-2 bg-bis-600 hover:bg-bis-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm self-start sm:self-auto"
        >
          <Bot className="w-4 h-4" />
          Ask AI to Recommend
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by IS number (e.g. IS 302, IS 4151), product keyword, or test name..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-bis-600 focus:ring-1 focus:ring-bis-600 outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
          >
            Search
          </button>
        </form>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                category === cat
                  ? 'bg-bis-600 text-white font-bold shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}

          <label className="ml-auto flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 bg-red-50/70 border border-red-200 px-3 py-1.5 rounded-lg">
            <input
              type="checkbox"
              checked={mandatoryOnly}
              onChange={(e) => setMandatoryOnly(e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500"
            />
            <span>Mandatory QCO Only</span>
          </label>
        </div>
      </div>

      {/* Standards List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 p-12 text-center text-slate-500 text-xs">
            Loading standards catalog...
          </div>
        ) : standards.length === 0 ? (
          <div className="col-span-2 p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
            <Award className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 text-sm">No standards match your criteria</h3>
            <p className="text-xs text-slate-400">
              Try searching with broader terms or asking the AI Assistant.
            </p>
          </div>
        ) : (
          standards.map((std) => (
            <div
              key={std.id}
              onClick={() => setSelectedStandardModal(std)}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-bis-300 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-bis-700 bg-bis-50 border border-bis-200 px-2.5 py-0.5 rounded-lg">
                      {std.standardNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      Edition: {std.version}
                    </span>
                  </div>

                  {std.isMandatory && (
                    <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full shrink-0">
                      Mandatory QCO
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-900 group-hover:text-bis-600 transition-colors leading-snug">
                  {std.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {std.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">{std.category}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[11px] text-cyan-700 font-medium">{std.certificationScheme}</span>
                </div>

                <span className="font-bold text-bis-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-xs">
                  Full Details <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ===================== STANDARD DETAIL MODAL ===================== */}
      {selectedStandardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#0A2540] to-bis-800 text-white flex items-start justify-between shrink-0 sticky top-0 z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-extrabold text-sm px-2.5 py-0.5 bg-white/20 rounded-md">
                    {selectedStandardModal.standardNumber}
                  </span>
                  {selectedStandardModal.isMandatory && (
                    <span className="text-[10px] font-bold bg-red-500/80 text-white px-2 py-0.5 rounded-full">
                      Mandatory Gazette QCO
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-base sm:text-lg leading-snug text-white">
                  {selectedStandardModal.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedStandardModal(null)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 text-xs">
              {/* Scope & Description */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-800 uppercase tracking-wider block text-[10px]">
                  Scope & Application
                </span>
                <p className="text-slate-700 leading-relaxed text-xs">
                  {selectedStandardModal.scope || selectedStandardModal.description}
                </p>
              </div>

              {/* Certification & Testing Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1">
                  <span className="font-bold text-blue-900 block text-[11px]">Certification Scheme:</span>
                  <span className="font-semibold text-slate-800">{selectedStandardModal.certificationScheme}</span>
                  {selectedStandardModal.qcoDate && (
                    <p className="text-[10px] text-blue-800 mt-1">
                      <strong>Order:</strong> {selectedStandardModal.qcoDate}
                    </p>
                  )}
                </div>

                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1">
                  <span className="font-bold text-emerald-900 block text-[11px]">Testing Protocols:</span>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    {selectedStandardModal.testingRequirements || 'Standard mechanical, electrical, and chemical performance testing.'}
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => {
                    const stdNum = selectedStandardModal.standardNumber;
                    setSelectedStandardModal(null);
                    onNavigate('compliance', { standardNumber: stdNum });
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Generate Compliance Checklist
                </button>

                <button
                  onClick={() => {
                    const stdNum = selectedStandardModal.standardNumber;
                    setSelectedStandardModal(null);
                    onNavigate('ai-assistant', { initialQuery: `Explain ${stdNum} and all key testing clauses in simple terms.` });
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-bis-600 hover:bg-bis-700 text-white rounded-xl font-bold shadow-sm"
                >
                  <Bot className="w-4 h-4" />
                  Ask AI About This Standard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
