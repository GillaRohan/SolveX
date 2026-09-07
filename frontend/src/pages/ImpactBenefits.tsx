import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  GraduationCap, 
  Zap,
  Globe,
  Camera,
  Bot,
  FileText
} from 'lucide-react';
import { NavPage } from '../components/Shell';

interface ImpactBenefitsProps {
  onNavigate: (page: NavPage) => void;
}

export const ImpactBenefits: React.FC<ImpactBenefitsProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#071D33] via-[#0A2540] to-bis-800 text-white p-8 sm:p-12 shadow-2xl border border-[#143B63] text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-cyan-300 font-bold">
          <Sparkles className="w-4 h-4" />
          National Quality Mission & Standardization Impact
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Transforming the Indian Standards Ecosystem with AI Intelligence
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          From standards discovery to compliance readiness — making Bureau of Indian Standards (BIS) services intelligent, understandable, and immediately actionable for 1.4 billion citizens.
        </p>

        <div className="pt-3 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-bis-500 to-cyan-500 hover:from-bis-600 hover:to-cyan-600 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-xl transition-all"
          >
            Launch Command Center
          </button>
          <button
            onClick={() => onNavigate('ai-assistant')}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold text-xs sm:text-sm transition-all"
          >
            Test Grounded AI Assistant
          </button>
        </div>
      </div>

      {/* ===================== STAKEHOLDER IMPACT QUADRANT ===================== */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 text-center mb-6">
          Multi-Stakeholder Impact & Societal Value
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Consumers */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">For 1.4 Billion Consumers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instant verification of authentic ISI marks, CRS numbers, and gold HUID hallmarking using camera scanning. Transparent access to safety guidelines eliminates counterfeit hazards in household electronics and cookware.
            </p>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside pt-2 border-t border-slate-100">
              <li>Instant fraud & counterfeit detection with camera scanner</li>
              <li>Plain-language explanations for technical safety labels</li>
              <li>Direct channel for consumer grievances & reporting</li>
            </ul>
          </div>

          {/* MSMEs */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">For 63 Million Indian MSMEs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Drastically reduces regulatory ambiguity by translating natural product descriptions into exact Indian Standards, testing schedules, and step-by-step ManakOnline roadmaps.
            </p>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside pt-2 border-t border-slate-100">
              <li>Automatic standard discovery from plain-English descriptions</li>
              <li>Pre-compliance testing preparation preventing costly rejections</li>
              <li>Awareness of 50% concession on BIS marking fees for MSMEs</li>
            </ul>
          </div>

          {/* Manufacturers */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">For Industrial Manufacturers & Startups</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Accelerates time-to-market with automated clause extraction from uploaded CAD/datasheet specifications, smart lab recommendation, and audit-ready checklists.
            </p>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside pt-2 border-t border-slate-100">
              <li>6-Stage interactive statutory compliance roadmap</li>
              <li>Automatic clause-by-clause specification analysis</li>
              <li>Smart matching with NABL & BIS recognized testing labs</li>
            </ul>
          </div>

          {/* Students & Researchers */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">For Students, Engineers & Academia</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Democratizes access to national standardization science. Students can search 20,000+ standards, study test methodologies, and query specific clauses in 6 Indian languages.
            </p>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside pt-2 border-t border-slate-100">
              <li>Natural Terms dictionary translating jargon into clarity</li>
              <li>Multilingual voice assistant for regional inclusivity</li>
              <li>Semantic clause search across complex engineering domains</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ===================== CORE INNOVATION STACK ===================== */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900 text-center">
          SolveX Core Innovation Stack
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs text-center">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <Bot className="w-6 h-6 text-bis-600 mx-auto" />
            <div className="font-bold text-slate-800">Grounded BIS RAG</div>
            <div className="text-[10px] text-slate-500">Zero-hallucination domain AI</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <Camera className="w-6 h-6 text-cyan-600 mx-auto" />
            <div className="font-bold text-slate-800">Camera Scanner</div>
            <div className="text-[10px] text-slate-500">Live WebRTC mark detection</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <FileText className="w-6 h-6 text-purple-600 mx-auto" />
            <div className="font-bold text-slate-800">Document Intelligence</div>
            <div className="text-[10px] text-slate-500">Automated clause extraction</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <Globe className="w-6 h-6 text-emerald-600 mx-auto" />
            <div className="font-bold text-slate-800">Multilingual & Voice</div>
            <div className="text-[10px] text-slate-500">6 Indian languages spoken</div>
          </div>
        </div>
      </div>

      {/* ===================== FINAL VISION STATEMENT ===================== */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white text-center space-y-3">
        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
          National Quality Mission Core Vision
        </span>
        <blockquote className="text-lg sm:text-xl font-extrabold max-w-2xl mx-auto text-slate-100">
          "From standards discovery to compliance readiness — making BIS information intelligent, understandable, and actionable."
        </blockquote>
      </div>
    </div>
  );
};
