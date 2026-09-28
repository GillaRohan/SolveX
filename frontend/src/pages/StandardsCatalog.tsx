import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Search, 
  ArrowRight, 
  CheckCircle, 
  Bot,
  FlaskConical
} from 'lucide-react';
import { api } from '../services/api';
import { Standard } from '../types';
import { NavPage } from '../components/Shell';
import { useLanguage } from '../context/LanguageContext';

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
  const { t } = useLanguage();
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
    <div className="space-y-6 max-w-6xl mx-auto text-[#192425]">
      {/* ── Header Card ─────────────────────────────────── */}
      <div className="saas-card p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E6DF] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#8B9798] uppercase tracking-wider">
                NATIONAL STANDARDS REPOSITORY
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C99738]/15 text-[#A47720] font-bold border border-[#C99738]/30">
                21,000+ IS Codes
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#113235] font-serif-heading">
              {t('catalogTitle')}
            </h1>
            <p className="text-sm text-[#5C6768]">
              {t('catalogSubtitle')}
            </p>
          </div>

          <button
            onClick={() => onNavigate('ai-assistant', { initialQuery: 'Find applicable Indian Standard for my product.' })}
            className="btn-teal text-xs shrink-0 cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            Ask AI to Recommend
          </button>
        </div>

        {/* Search Row */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8B9798] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('catalogSearchPlaceholder')}
              className="saas-input w-full pl-10 py-3 text-sm bg-[#F7F8F5] focus:bg-white"
            />
          </div>
          <button type="submit" className="btn-teal shrink-0 text-xs py-2.5 px-5 cursor-pointer">
            {t('searchButton')}
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                category === cat
                  ? 'bg-[#113235] text-white shadow-xs'
                  : 'bg-[#F3F4F0] text-[#5C6768] hover:bg-[#EAECE6] hover:text-[#192425] border border-[#E2E6DF]'
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}

          <label className="ml-auto flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#A47720] bg-[#FBF5E8] border border-[#E8D3A7] px-3 py-1.5 rounded-xl select-none">
            <input
              type="checkbox"
              checked={mandatoryOnly}
              onChange={(e) => setMandatoryOnly(e.target.checked)}
              className="rounded text-[#C99738] focus:ring-[#C99738]"
            />
            <span>Mandatory QCO Only</span>
          </label>
        </div>
      </div>

      {/* ── Standards Grid ────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 p-16 text-center text-[#8B9798] text-xs">
            <div className="w-8 h-8 rounded-full border-2 border-[#113235] border-t-transparent animate-spin mx-auto mb-3" />
            Loading Indian standards catalog...
          </div>
        ) : standards.length === 0 ? (
          <div className="col-span-2 saas-card p-12 text-center space-y-3">
            <Award className="w-10 h-10 text-[#C99738] mx-auto" />
            <h3 className="font-bold text-[#113235] text-sm">No standards match your criteria</h3>
            <p className="text-xs text-[#5C6768]">
              Try broader search terms or ask the AI Assistant for recommendations.
            </p>
            <button
              onClick={() => onNavigate('ai-assistant')}
              className="btn-teal mx-auto text-xs py-2 px-4 cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" /> Ask AI Assistant
            </button>
          </div>
        ) : (
          standards.map((std) => (
            <div
              key={std.id}
              onClick={() => setSelectedStandardModal(std)}
              className="saas-card p-5 cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#113235] bg-[#F3F4F0] border border-[#E2E6DF] px-2.5 py-0.5 rounded-lg">
                      {std.standardNumber}
                    </span>
                    <span className="text-[10px] text-[#8B9798] font-semibold">
                      Ed. {std.version}
                    </span>
                  </div>

                  {std.isMandatory && (
                    <span className="text-[10px] font-bold text-[#A47720] bg-[#FBF5E8] border border-[#E8D3A7] px-2 py-0.5 rounded-full shrink-0">
                      Mandatory QCO
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-[#113235] group-hover:text-[#C99738] transition-colors leading-snug">
                  {std.title}
                </h3>

                <p className="text-xs text-[#5C6768] line-clamp-2 leading-relaxed">
                  {std.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E2E6DF] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#8B9798]">
                  <span className="font-medium">{std.category}</span>
                  <span>·</span>
                  <span className="font-semibold text-[#113235]">{std.certificationScheme}</span>
                </div>
                <span className="font-bold text-[#113235] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Details <ArrowRight className="w-3.5 h-3.5 text-[#C99738]" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Standard Detail Modal ─────────────────────────── */}
      {selectedStandardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E2E6DF] max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E2E6DF] flex items-start justify-between sticky top-0 bg-white z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-sm px-2.5 py-0.5 bg-[#F3F4F0] text-[#113235] border border-[#E2E6DF] rounded-lg">
                    {selectedStandardModal.standardNumber}
                  </span>
                  {selectedStandardModal.isMandatory && (
                    <span className="text-[10px] font-bold bg-[#FBF5E8] text-[#A47720] border border-[#E8D3A7] px-2 py-0.5 rounded-full">
                      Mandatory QCO
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-base text-[#113235] leading-snug">
                  {selectedStandardModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedStandardModal(null)}
                className="p-1.5 text-[#8B9798] hover:text-[#192425] rounded-lg hover:bg-[#F3F4F0] transition-colors cursor-pointer ml-3"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-[#F7F8F5] rounded-xl border border-[#E2E6DF] space-y-1.5">
                <span className="font-bold text-[#8B9798] uppercase tracking-wider block text-[10px]">
                  Scope & Application
                </span>
                <p className="text-[#192425] leading-relaxed">
                  {selectedStandardModal.scope || selectedStandardModal.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-white rounded-xl border border-[#E2E6DF] space-y-1">
                  <span className="font-bold text-[#113235] block text-[11px]">Certification Scheme:</span>
                  <span className="font-semibold text-[#C99738]">{selectedStandardModal.certificationScheme}</span>
                  {selectedStandardModal.qcoDate && (
                    <p className="text-[10px] text-[#8B9798] mt-1">
                      <strong>QCO Date:</strong> {selectedStandardModal.qcoDate}
                    </p>
                  )}
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-[#E2E6DF] space-y-1">
                  <span className="font-bold text-[#113235] block text-[11px]">Testing Protocols:</span>
                  <p className="text-[11px] text-[#5C6768] leading-relaxed">
                    {selectedStandardModal.testingRequirements || 'Standard mechanical, electrical, and chemical performance testing at NABL / BIS recognized laboratories.'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2E6DF] flex flex-wrap items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setSelectedStandardModal(null);
                    onNavigate('ai-assistant', { initialQuery: `Explain ${selectedStandardModal.standardNumber} and all key testing clauses in simple terms.` });
                  }}
                  className="btn-teal text-xs py-2 px-4 cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5" />
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
