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
import { useLanguage } from '../context/LanguageContext';

interface NaturalTermsProps {
  onNavigate: (page: NavPage, data?: any) => void;
}

export const NaturalTerms: React.FC<NaturalTermsProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
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
    <div className="space-y-6 max-w-6xl mx-auto text-[#192425]">
      {/* ── Header Card ────────────────────────────────────── */}
      <div className="saas-card p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E6DF] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#8B9798] uppercase tracking-wider">
                STANDARDS TERMINOLOGY &amp; GLOSSARY
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                Natural Language AI
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#113235] font-serif-heading">
              {t('naturalTermsTitle')}
            </h1>
            <p className="text-sm text-[#5C6768]">
              {t('naturalTermsSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('dashboard')}
              className="btn-outline text-xs"
            >
              {t('overview')}
            </button>
            <button
              onClick={() => onNavigate('ai-assistant')}
              className="btn-teal text-xs"
            >
              <Bot className="w-4 h-4" />
              <span>{t('askAI')}</span>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) handleSearchTerm(query.trim());
          }}
          className="relative max-w-3xl"
        >
          <Search className="w-5 h-5 text-[#8B9798] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('naturalSearchPlaceholder')}
            className="saas-input w-full pl-12 pr-28 py-3.5 text-sm bg-[#F7F8F5] focus:bg-white"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="btn-teal absolute right-2 top-1/2 -translate-y-1/2 py-2 px-4 text-xs font-semibold"
          >
            {loading ? 'Searching...' : t('searchButton')}
          </button>
        </form>

        {/* Quick Click Term Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-[#8B9798] font-medium mr-1">Popular Terms:</span>
          {predefinedTerms.map((tItem) => (
            <button
              key={tItem}
              onClick={() => {
                setQuery(tItem);
                handleSearchTerm(tItem);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#F3F4F0] hover:bg-[#EAECE6] text-[#192425] text-[11px] font-medium transition-colors border border-[#E2E6DF] cursor-pointer"
            >
              {tItem}
            </button>
          ))}
        </div>
      </div>

      {/* ── Explanation Result Card ────────────────────────── */}
      {selectedTerm ? (
        <div className="saas-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E6DF] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#113235]">
                  {selectedTerm.term}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C99738]/15 text-[#A47720] border border-[#C99738]/30">
                  {selectedTerm.category}
                </span>
              </div>
            </div>

            {/* Toggle Mode */}
            <div className="flex items-center p-1 bg-[#F3F4F0] rounded-xl border border-[#E2E6DF] text-xs">
              <button
                onClick={() => setViewMode('simple')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  viewMode === 'simple' ? 'bg-white text-[#113235] shadow-xs' : 'text-[#5C6768]'
                }`}
              >
                Simple Citizen Explanation
              </button>
              <button
                onClick={() => setViewMode('technical')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  viewMode === 'technical' ? 'bg-white text-[#113235] shadow-xs' : 'text-[#5C6768]'
                }`}
              >
                Technical / Statutory View
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F8F5] border border-[#E2E6DF] text-sm text-[#192425] leading-relaxed">
            {viewMode === 'simple' ? selectedTerm.simpleExplanation : selectedTerm.technicalDefinition}
          </div>

          {/* Related Standard Tags */}
          {selectedTerm.relatedStandards && selectedTerm.relatedStandards.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#113235]">
                {t('mappedStandard')}:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedTerm.relatedStandards.map((std, i) => (
                  <button
                    key={i}
                    onClick={() => onNavigate('standards', { search: std })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E2E6DF] text-xs font-bold text-[#113235] hover:border-[#113235] hover:bg-[#F7F8F5] transition-all cursor-pointer shadow-2xs"
                  >
                    <span>{std}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C99738]" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="saas-card p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F3F4F0] text-[#113235] flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6 text-[#C99738]" />
          </div>
          <h3 className="text-base font-bold text-[#113235]">
            Search or select a BIS term above
          </h3>
          <p className="text-xs text-[#5C6768] max-w-md mx-auto">
            Get instant dual-mode explanations (Simple Consumer View vs Technical Regulatory Framework) for any Bureau of Indian Standards concept.
          </p>
        </div>
      )}
    </div>
  );
};
