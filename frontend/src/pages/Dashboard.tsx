import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  ScanLine, 
  Search, 
  FileUp, 
  CheckCircle2, 
  FlaskConical, 
  Mic, 
  ArrowRight, 
  Award, 
  ShieldCheck, 
  TrendingUp, 
  FileText, 
  AlertCircle, 
  Sparkles, 
  ChevronRight,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { NavPage } from '../components/Shell';
import { api } from '../services/api';
import { Standard, NotificationItem } from '../types';
import { MarkInspector } from '../components/MarkInspector';
import { FeeEstimator } from '../components/FeeEstimator';

interface DashboardProps {
  onNavigate: (page: NavPage, data?: any) => void;
  onOpenVoiceModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onOpenVoiceModal }) => {
  const { user, role } = useAuth();
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [standards, setStandards] = useState<Standard[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stdData, notifData] = await Promise.all([
          api.getStandards(),
          api.getNotifications()
        ]);
        setStandards(stdData.slice(0, 4));
        setNotifications(notifData.slice(0, 3));
      } catch (e) {
        console.warn('Dashboard fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('ai-assistant', { initialQuery: searchQuery.trim() });
    }
  };

  const quickActions = [
    {
      title: 'Ask BIS AI',
      desc: 'Conversational standards discovery',
      icon: Bot,
      color: 'from-blue-600 to-indigo-600',
      action: () => onNavigate('ai-assistant')
    },
    {
      title: 'Scan Product',
      desc: 'Live camera mark verification',
      icon: ScanLine,
      color: 'from-cyan-600 to-teal-600',
      action: () => onNavigate('scan-product')
    },
    {
      title: 'Find Standard',
      desc: 'Search 20,000+ Indian Standards',
      icon: Award,
      color: 'from-bis-600 to-blue-700',
      action: () => onNavigate('standards')
    },
    {
      title: 'Upload Document',
      desc: 'Extract clauses & test protocols',
      icon: FileUp,
      color: 'from-purple-600 to-indigo-600',
      action: () => onNavigate('documents')
    },
    {
      title: 'Check Compliance',
      desc: 'Personalized 6-stage roadmap',
      icon: CheckCircle2,
      color: 'from-emerald-600 to-teal-700',
      action: () => onNavigate('compliance')
    },
    {
      title: 'Find Laboratory',
      desc: 'Accredited NABL & BIS testing labs',
      icon: FlaskConical,
      color: 'from-amber-600 to-orange-600',
      action: () => onNavigate('laboratories')
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ===================== HERO SECTION ===================== */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#071D33] via-[#0A2540] to-[#003366] text-white p-6 sm:p-10 shadow-2xl border border-[#143B63]">
        {/* Background ambient elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-bis-600/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-cyan-300 font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>National Standards & Certification AI • Official BIS Standards Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            {t('heroTitle')}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* Main AI Search Input */}
          <form onSubmit={handleHeroSearch} className="pt-2">
            <div className="relative flex items-center bg-white rounded-2xl p-1.5 shadow-2xl shadow-black/30 border-2 border-white/20 focus-within:border-cyan-400 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('askPlaceholder')}
                className="w-full px-3 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-bis-600 to-cyan-600 hover:from-bis-700 hover:to-cyan-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all shrink-0 flex items-center gap-2"
              >
                <span>Consult AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Prompt suggestions pills */}
            <div className="flex flex-wrap items-center gap-2 pt-3 text-[11px] text-slate-300">
              <span className="text-slate-400">Try asking:</span>
              {[
                'I manufacture electric kettles. Which standard applies?',
                'Two-wheeler helmets IS 4151 testing',
                'What is CRS scheme vs ISI mark?',
                'Packaged drinking water lab fees'
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => onNavigate('ai-assistant', { initialQuery: prompt })}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-colors"
                >
                  "{prompt.slice(0, 32)}..."
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>

      {/* ===================== QUICK ACTIONS GRID ===================== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Intelligent Action Center
          </h2>
          <span className="text-xs text-slate-500">
            Tailored for <strong className="text-bis-700 font-semibold">{role}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {quickActions.map((qa) => {
            const Icon = qa.icon;
            return (
              <button
                key={qa.title}
                onClick={qa.action}
                className="group p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all text-left flex flex-col justify-between hover:-translate-y-1"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${qa.color} text-white flex items-center justify-center mb-3 shadow-md`}>
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-bis-600 transition-colors">
                    {qa.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                    {qa.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================== TELEMETRY STATS ===================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 block">Standards Cataloged</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">20,450+</div>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" /> 8 Mandatory QCOs in 2024
          </span>
        </div>

        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 block">Documents Analyzed</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">1,420</div>
          <span className="text-[11px] text-bis-600 font-medium mt-1 block">
            Automatic clause parsing
          </span>
        </div>

        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 block">Recognized Laboratories</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">280+</div>
          <span className="text-[11px] text-cyan-600 font-medium mt-1 block">
            NABL & BIS certified across India
          </span>
        </div>

        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 block">Compliance Readiness</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">78 / 100</div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
            MSME sample project active
          </span>
        </div>
      </div>

      {/* ===================== DUAL COLUMN: RECOMMENDED STANDARDS + GAZETTE ALERTS ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Standards (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-bis-600" />
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                {t('recommendedStandards')}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('standards')}
              className="text-xs text-bis-600 font-bold hover:underline flex items-center gap-1"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {standards.map((std) => (
              <div
                key={std.id}
                onClick={() => onNavigate('standards', { selectedStandard: std })}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-bis-300 hover:shadow-md transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono font-extrabold text-xs text-bis-700 bg-bis-50 border border-bis-200 px-2 py-0.5 rounded-md">
                    {std.standardNumber}
                  </span>
                  {std.isMandatory && (
                    <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                      Mandatory QCO
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-slate-800 line-clamp-2 group-hover:text-bis-600">
                  {std.title}
                </h3>

                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {std.description}
                </p>

                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-200/50">
                  <span>{std.category}</span>
                  <span className="font-medium text-bis-600 flex items-center gap-1">
                    Details <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Gazette & QCO Updates (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                  Gazette & QCO Alerts
                </h2>
              </div>
              <button
                onClick={() => onNavigate('alerts')}
                className="text-xs text-bis-600 font-bold hover:underline"
              >
                All alerts
              </button>
            </div>

            <div className="space-y-3">
              {notifications.map((n) => (
                <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-700 uppercase">
                      {n.category}
                    </span>
                    <span className="text-[10px] text-slate-400">Recent</span>
                  </div>
                  <h4 className="font-bold text-slate-800 line-clamp-1">{n.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{n.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-cyan-50/70 border border-cyan-200 rounded-xl text-xs text-cyan-900 space-y-1">
            <span className="font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-cyan-700" />
              Did you know?
            </span>
            <p className="text-[11px] text-cyan-800">
              MSMEs enjoy a 50% concession on BIS marking fees for their first product certification under Atmanirbhar Bharat!
            </p>
          </div>
        </div>
      </div>

      {/* ===================== INTERACTIVE INSPECTOR & MSME FEE ESTIMATOR ===================== */}
      <MarkInspector />

      <FeeEstimator />

      {/* ===================== FREQUENTLY ASKED QUESTIONS ===================== */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <HelpCircle className="w-5 h-5 text-bis-600" />
          <h2 className="font-bold text-slate-900 text-sm sm:text-base">
            Frequently Asked Questions on Indian Standards & BIS Services
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
            <h4 className="font-bold text-slate-800 text-xs">What is the difference between ISI Mark and CRS?</h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Scheme I (ISI Mark) requires factory audits and continuous surveillance. Scheme II (CRS) applies to IT/electronics based purely on accredited laboratory test reports.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
            <h4 className="font-bold text-slate-800 text-xs">Is a Quality Control Order (QCO) legally compulsory?</h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Yes. Manufacturing, importing, or stocking goods covered under an active QCO without an authentic BIS certification is a punishable offense under Section 16 of the BIS Act 2016.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
            <h4 className="font-bold text-slate-800 text-xs">How do consumers verify a gold hallmark HUID?</h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Every hallmarked jewel contains a 6-digit laser-engraved alphanumeric code. Enter it into SolveX's Scanner to view purity, assaying date, and jeweller registration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
