import React, { useState } from 'react';
import { 
  Bot, 
  Award, 
  BookOpen, 
  Info, 
  GraduationCap, 
  FlaskConical, 
  Search, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  Calculator,
  CheckCircle2,
  FileText,
  Mic,
  HelpCircle,
  TrendingUp,
  Building2
} from 'lucide-react';
import { NavPage } from '../components/Shell';
import { useLanguage } from '../context/LanguageContext';
import { FeeEstimator } from '../components/FeeEstimator';
import { MarkInspector } from '../components/MarkInspector';

interface DashboardProps {
  onNavigate: (page: NavPage, data?: any) => void;
  onOpenVoiceModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onOpenVoiceModal }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'estimator' | 'inspector' | 'faq'>('overview');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('ai-assistant', { initialQuery: searchQuery.trim() });
    }
  };

  const quickServices = [
    {
      id: 'standards' as NavPage,
      title: t('cardStandardsHelp'),
      desc: t('cardStandardsDesc'),
      icon: Award,
      badge: '21,000+ Standards',
      badgeColor: 'bg-[#C99738]/15 text-[#A47720] border-[#C99738]/30',
      actionText: t('exploreStandards')
    },
    {
      id: 'ai-assistant' as NavPage,
      title: t('cardAIHelp'),
      desc: t('cardAIDesc'),
      icon: Bot,
      badge: 'Grounded AI',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      actionText: t('askAI')
    },
    {
      id: 'natural-terms' as NavPage,
      title: t('cardNaturalHelp'),
      desc: t('cardNaturalDesc'),
      icon: BookOpen,
      badge: 'Natural Mapping',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      actionText: t('viewAll')
    },
    {
      id: 'bis-info' as NavPage,
      title: t('cardBISInfoHelp'),
      desc: t('cardBISInfoDesc'),
      icon: Info,
      badge: 'Schemes & QCO',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      actionText: t('details')
    },
    {
      id: 'impact' as NavPage,
      title: t('cardTrainingHelp'),
      desc: t('cardTrainingDesc'),
      icon: GraduationCap,
      badge: 'Capacity Building',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      actionText: t('exploreStandards')
    },
    {
      id: 'laboratories' as NavPage,
      title: t('cardLabsHelp'),
      desc: t('cardLabsDesc'),
      icon: FlaskConical,
      badge: '280+ Labs',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      actionText: t('viewAll')
    },
  ];

  const quickSearchTags = [
    { label: 'IS 694 (Cables)', query: 'IS 694 electrical cables compliance' },
    { label: 'IS 302 (Appliances)', query: 'IS 302 safety of household appliances' },
    { label: 'IS 4984 (HDPE Pipes)', query: 'IS 4984 HDPE pipes testing schedule' },
    { label: 'Gold Hallmarking (HUID)', query: 'Gold Hallmarking 6 digit HUID rules' },
    { label: 'MSME 50% Concession', query: 'MSME 50% concession on BIS marking fees' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* ── Top Header Section inspired by reference layout ────────────────── */}
      <div className="bg-white border border-[#E2E6DF] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E6DF] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#8B9798] uppercase tracking-wider">
                NATIONAL STANDARDS INTELLIGENCE
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                Official BIS Grounding
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#113235] tracking-tight font-serif-heading">
              {t('appName')}
            </h1>
            <p className="text-sm text-[#5C6768] font-medium">
              "{t('portalTagline')}" &mdash; {t('heroSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('ai-assistant')}
              className="btn-teal cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>{t('askAI')}</span>
            </button>
            <button
              onClick={onOpenVoiceModal}
              className="btn-outline cursor-pointer"
              title={t('voiceAssistant')}
            >
              <Mic className="w-4 h-4 text-[#C99738]" />
              <span className="hidden sm:inline">{t('voiceAssistant')}</span>
            </button>
          </div>
        </div>

        {/* Search Bar inside Main Overview Card */}
        <div className="pt-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-5 h-5 text-[#8B9798] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="saas-input w-full pl-12 pr-28 py-3.5 text-sm bg-[#F7F8F5] focus:bg-white"
            />
            <button
              type="submit"
              className="btn-teal absolute right-2 top-1/2 -translate-y-1/2 py-2 px-4 text-xs font-semibold"
            >
              {t('searchButton')}
            </button>
          </form>

          {/* Quick search chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <span className="text-[#8B9798] font-medium mr-1">{t('quickSearch')}:</span>
            {quickSearchTags.map((tag, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onNavigate('ai-assistant', { initialQuery: tag.query })}
                className="px-2.5 py-1 rounded-lg bg-[#F3F4F0] hover:bg-[#EAECE6] text-[#192425] text-[11px] font-medium transition-colors border border-[#E2E6DF] cursor-pointer"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sub-navigation Tab Pills ────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-[#E2E6DF] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeTab === 'overview'
              ? 'bg-[#113235] text-white shadow-xs'
              : 'text-[#5C6768] hover:bg-white hover:text-[#192425]'
          }`}
        >
          {t('overview')}
        </button>
        <button
          onClick={() => setActiveTab('inspector')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeTab === 'inspector'
              ? 'bg-[#113235] text-white shadow-xs'
              : 'text-[#5C6768] hover:bg-white hover:text-[#192425]'
          }`}
        >
          {t('cardMarkInspector')}
        </button>
        <button
          onClick={() => setActiveTab('estimator')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeTab === 'estimator'
              ? 'bg-[#113235] text-white shadow-xs'
              : 'text-[#5C6768] hover:bg-white hover:text-[#192425]'
          }`}
        >
          {t('cardFeeEstimator')}
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeTab === 'faq'
              ? 'bg-[#113235] text-white shadow-xs'
              : 'text-[#5C6768] hover:bg-white hover:text-[#192425]'
          }`}
        >
          BIS Q&amp;A Guidelines
        </button>
      </div>

      {/* ── TAB CONTENT ────────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="saas-card p-4 space-y-1">
              <span className="text-[11px] font-bold text-[#8B9798] uppercase tracking-wider block">
                {t('statsTotalStandards')}
              </span>
              <p className="text-2xl font-bold text-[#113235]">21,000+</p>
              <p className="text-[11px] text-emerald-700 font-medium">16 Technical Depts</p>
            </div>

            <div className="saas-card p-4 space-y-1">
              <span className="text-[11px] font-bold text-[#8B9798] uppercase tracking-wider block">
                {t('statsVerifiedLabs')}
              </span>
              <p className="text-2xl font-bold text-[#113235]">280+</p>
              <p className="text-[11px] text-emerald-700 font-medium">NABL &amp; BIS Recognized</p>
            </div>

            <div className="saas-card p-4 space-y-1">
              <span className="text-[11px] font-bold text-[#8B9798] uppercase tracking-wider block">
                {t('statsMandatoryQCOs')}
              </span>
              <p className="text-2xl font-bold text-[#113235]">700+ Products</p>
              <p className="text-[11px] text-amber-700 font-medium">Statutory Enforcement</p>
            </div>

            <div className="saas-card p-4 space-y-1 border-l-3 border-[#C99738]">
              <span className="text-[11px] font-bold text-[#8B9798] uppercase tracking-wider block">
                {t('statsMSMEConcession')}
              </span>
              <p className="text-2xl font-bold text-[#A47720]">50% OFF</p>
              <p className="text-[11px] text-[#A47720] font-medium">Marking Fee Subsidy</p>
            </div>
          </div>

          {/* Quick Services Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#113235]">
                {t('quickAccessTitle')}
              </h2>
              <span className="text-xs text-[#8B9798]">
                {t('quickAccessSubtitle')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickServices.map((srv) => {
                const Icon = srv.icon;
                return (
                  <div
                    key={srv.id}
                    onClick={() => onNavigate(srv.id)}
                    className="saas-card p-5 flex flex-col justify-between space-y-4 cursor-pointer group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-[#F3F4F0] text-[#113235] group-hover:bg-[#113235] group-hover:text-white flex items-center justify-center transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${srv.badgeColor}`}>
                          {srv.badge}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-[#113235] group-hover:text-[#C99738] transition-colors">
                          {srv.title}
                        </h3>
                        <p className="text-xs text-[#5C6768] mt-1 leading-relaxed">
                          {srv.desc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#113235]">
                      <span>{srv.actionText}</span>
                      <ChevronRight className="w-4 h-4 text-[#8B9798] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB CONTENT: MARK INSPECTOR ────────────────────────────────────── */}
      {activeTab === 'inspector' && (
        <div className="space-y-4">
          <MarkInspector />
        </div>
      )}

      {/* ── TAB CONTENT: FEE ESTIMATOR ─────────────────────────────────────── */}
      {activeTab === 'estimator' && (
        <div className="space-y-4">
          <FeeEstimator />
        </div>
      )}

      {/* ── TAB CONTENT: FAQ & GUIDELINES ──────────────────────────────────── */}
      {activeTab === 'faq' && (
        <div className="saas-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-[#113235] flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#C99738]" />
            Frequently Asked Questions on Indian Standards &amp; BIS Mandates
          </h2>

          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-xl bg-[#F7F8F5] border border-[#E2E6DF] space-y-1">
              <p className="font-bold text-xs text-[#113235]">1. What is the difference between ISI Mark (Scheme I) and CRS (Scheme II)?</p>
              <p className="text-xs text-[#5C6768] leading-relaxed">
                Scheme I (ISI Mark) requires third-party factory audit, continuous surveillance, and testing at independent laboratories. Scheme II (CRS) is a self-declaration of conformity based on testing of safety parameters at BIS-recognized laboratories, primarily applicable to electronic and IT goods.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F8F5] border border-[#E2E6DF] space-y-1">
              <p className="font-bold text-xs text-[#113235]">2. How can MSMEs claim the 50% concession on BIS marking fees?</p>
              <p className="text-xs text-[#5C6768] leading-relaxed">
                Under the Atmanirbhar Bharat initiative, Micro and Small enterprises with a valid Udyam Registration Certificate receive a 50% concession on annual minimum marking fees and a 20% concession on application and inspection charges for their first product licence.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F8F5] border border-[#E2E6DF] space-y-1">
              <p className="font-bold text-xs text-[#113235]">3. How can I verify if an ISI licence or HUID is authentic?</p>
              <p className="text-xs text-[#5C6768] leading-relaxed">
                Every genuine ISI mark contains a 7-digit CML (Certification of Marks Licence) number beneath the standard number. For Gold jewelry, the 6-digit alphanumeric HUID (Hallmark Unique Identification) can be verified directly on the BIS Care Portal or via our Mark Inspector tab.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
