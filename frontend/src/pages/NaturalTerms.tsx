import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle, 
  Layers, 
  ExternalLink,
  Bot
} from 'lucide-react';
import { api } from '../services/api';
import { BISTerm } from '../types';
import { NavPage } from '../components/Shell';

interface NaturalTermsProps {
  onNavigate: (page: NavPage, data?: any) => void;
}

export const NaturalTerms: React.FC<NaturalTermsProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<BISTerm | null>(null);
  const [viewMode, setViewMode] = useState<'simple' | 'technical'>('simple');
  const [loading, setLoading] = useState(false);

  const predefinedTerms = [
    'ISI Mark',
    'HUID (Hallmark Unique Identification)',
    'CRS (Compulsory Registration Scheme)',
    'Conformity Assessment',
    'QCO (Quality Control Order)',
    'NABL Accreditation',
    'FMCS (Foreign Manufacturers Certification Scheme)'
  ];

  const handleSearchTerm = async (termText: string) => {
    setLoading(true);
    try {
      const termData = await api.explainTerm(termText);
      setSelectedTerm(termData);
    } catch (e) {
      console.warn('Failed to fetch term explanation:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Natural Terms AI</h1>
        <p className="text-xs text-slate-500">
          Transform complex BIS legal & technical jargon into clear, actionable definitions
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) handleSearchTerm(query.trim());
          }}
          className="relative max-w-2xl"
        >
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any BIS term (e.g. ISI Mark, HUID, CRS, QCO, SIT, NABL)..."
            className="w-full pl-11 pr-28 py-3 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-bis-600 focus:ring-1 focus:ring-bis-600 outline-none"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-bis-600 hover:bg-bis-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
          >
            {loading ? 'Explaining...' : 'Explain'}
          </button>
        </form>

        {/* Quick Click Term Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-semibold text-slate-400">Popular Terms:</span>
          {predefinedTerms.map((t) => (
            <button
              key={t}
              onClick={() => {
                setQuery(t);
                handleSearchTerm(t);
              }}
              className="text-[11px] px-3 py-1 rounded-lg bg-slate-100 hover:bg-bis-50 hover:text-bis-700 border border-slate-200 text-slate-700 transition-colors font-medium"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ===================== SELECTED TERM EXPLAINER CARD ===================== */}
      {selectedTerm ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-in fade-in">
          {/* Term Header & Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-bis-600 bg-bis-50 px-2 py-0.5 rounded border border-bis-200">
                BIS Glossary & Regulatory Directive
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">{selectedTerm.term}</h2>
              {selectedTerm.aliases?.length > 0 && (
                <p className="text-xs text-slate-400">
                  Also known as: {selectedTerm.aliases.join(', ')}
                </p>
              )}
            </div>

            {/* Toggle: Simple vs Technical */}
            <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto border border-slate-200">
              <button
                onClick={() => setViewMode('simple')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  viewMode === 'simple'
                    ? 'bg-white text-bis-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌱 Simple Explanation
              </button>
              <button
                onClick={() => setViewMode('technical')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  viewMode === 'technical'
                    ? 'bg-white text-bis-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔬 Technical & Statutory
              </button>
            </div>
          </div>

          {/* Definition Box */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              {viewMode === 'simple' ? 'Plain Language Overview' : 'Statutory & Regulatory Definition'}
            </span>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              {viewMode === 'simple' ? selectedTerm.simpleDefinition : selectedTerm.technicalDefinition}
            </p>
          </div>

          {/* Dual Impact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/70 space-y-1">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Why it Matters
              </span>
              <p className="text-slate-700 leading-relaxed">{selectedTerm.whyItMatters}</p>
            </div>

            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200/70 space-y-1">
              <span className="font-bold text-blue-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-700" />
                Who Needs It
              </span>
              <p className="text-slate-700 leading-relaxed">{selectedTerm.whoNeedsIt}</p>
            </div>
          </div>

          {/* Related BIS Services & Standards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-700 block">Connected BIS Portals & Services:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedTerm.relatedServices.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-medium text-[11px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-700 block">Key Standards Involving This:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedTerm.applicableStandards.map((st, i) => (
                  <span key={i} className="px-2.5 py-1 bg-bis-50 text-bis-700 border border-bis-200 rounded-lg font-mono font-bold text-[11px]">
                    {st}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Ask Follow-up in AI Assistant */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500">Need deeper technical analysis?</span>
            <button
              onClick={() => onNavigate('ai-assistant', { initialQuery: `Explain ${selectedTerm.term} and how it applies to compliance in detail.` })}
              className="flex items-center gap-2 px-4 py-2 bg-bis-600 hover:bg-bis-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              <Bot className="w-4 h-4" />
              Ask AI Follow-up
            </button>
          </div>
        </div>
      ) : (
        /* Default Guidance View */
        <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-sm">Select or search any BIS term above</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click on popular terms like "ISI Mark", "HUID", or "CRS" to view both simple consumer definitions and formal statutory standards language.
          </p>
        </div>
      )}
    </div>
  );
};
