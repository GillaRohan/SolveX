import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  Building2, 
  GraduationCap, 
  Bot, 
  FileText,
  Globe,
  ArrowRight,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { NavPage } from '../components/Shell';
import { useLanguage } from '../context/LanguageContext';

interface ImpactBenefitsProps {
  onNavigate: (page: NavPage) => void;
}

export const ImpactBenefits: React.FC<ImpactBenefitsProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-[#192425]">
      {/* ── Top Header Card ─────────────────────────────────── */}
      <div className="saas-card p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E6DF] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#8B9798] uppercase tracking-wider">
                CAPACITY BUILDING &amp; VALUE CREATION
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C99738]/15 text-[#A47720] font-bold border border-[#C99738]/30">
                Atmanirbhar Bharat
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#113235] font-serif-heading">
              {t('standardsTraining')}
            </h1>
            <p className="text-sm text-[#5C6768]">
              Empowering manufacturers, MSMEs, students, and citizens with accessible standardization science and training.
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

        {/* Highlight Banner */}
        <div className="p-4 rounded-xl bg-[#0D282A] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#E0B45C] text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>MSME 50% Marking Fee Concession</span>
            </div>
            <p className="text-xs text-[#B4C7C8] leading-relaxed max-w-2xl">
              Micro and Small enterprises registered under Udyam receive an automatic 50% concession on minimum marking fees and 20% on application fees for new BIS certifications.
            </p>
          </div>
          <button
            onClick={() => onNavigate('standards')}
            className="btn-gold shrink-0 text-xs py-2 px-3"
          >
            <span>{t('exploreStandards')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Stakeholder Quadrant Cards ───────────────────────── */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-[#113235]">
          Stakeholder Value &amp; Educational Modules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* MSMEs */}
          <div className="saas-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F3F4F0] text-[#113235] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#C99738]" />
            </div>
            <h3 className="text-sm font-bold text-[#113235]">For 63 Million Indian MSMEs</h3>
            <p className="text-xs text-[#5C6768] leading-relaxed">
              Drastically simplifies regulatory compliance by translating informal product terms into official Indian Standards, testing schedules, and step-by-step ManakOnline guidance.
            </p>
            <ul className="text-xs text-[#5C6768] space-y-1.5 list-disc list-inside pt-2 border-t border-[#E2E6DF]">
              <li>Zero-friction standard discovery from natural product names</li>
              <li>Pre-audit compliance preparation preventing costly rejection</li>
              <li>Step-by-step documentation for Udyam concessions</li>
            </ul>
          </div>

          {/* Industrial Manufacturers */}
          <div className="saas-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F3F4F0] text-[#113235] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#113235]" />
            </div>
            <h3 className="text-sm font-bold text-[#113235]">For Industrial Manufacturers &amp; Exporters</h3>
            <p className="text-xs text-[#5C6768] leading-relaxed">
              Accelerates product time-to-market with automated clause extraction, pre-testing guidance, and direct matching with 280+ NABL accredited testing laboratories.
            </p>
            <ul className="text-xs text-[#5C6768] space-y-1.5 list-disc list-inside pt-2 border-t border-[#E2E6DF]">
              <li>Detailed Scheme I (ISI Mark) and Scheme II (CRS) workflows</li>
              <li>Interactive statutory roadmap from lab testing to licence grant</li>
              <li>Real-time tracking of active Gazette Quality Control Orders (QCOs)</li>
            </ul>
          </div>

          {/* Students & Academia */}
          <div className="saas-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F3F4F0] text-[#113235] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="text-sm font-bold text-[#113235]">For Engineering Students &amp; Researchers</h3>
            <p className="text-xs text-[#5C6768] leading-relaxed">
              Democratizes national standardization knowledge. Students can browse 21,000+ Indian Standards, understand test methodologies, and query specific clauses in 8 Indian languages.
            </p>
            <ul className="text-xs text-[#5C6768] space-y-1.5 list-disc list-inside pt-2 border-t border-[#E2E6DF]">
              <li>Natural terms dictionary translating technical jargon</li>
              <li>Voice assistant supporting multilingual regional inquiries</li>
              <li>Comprehensive technical department indices</li>
            </ul>
          </div>

          {/* Consumers */}
          <div className="saas-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F3F4F0] text-[#113235] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-blue-700" />
            </div>
            <h3 className="text-sm font-bold text-[#113235]">For 1.4 Billion Consumers &amp; Citizens</h3>
            <p className="text-xs text-[#5C6768] leading-relaxed">
              Instant verification of authentic ISI marks, CRS numbers, and gold HUID hallmarking. Plain-language access to safety standards eliminates counterfeit hazards.
            </p>
            <ul className="text-xs text-[#5C6768] space-y-1.5 list-disc list-inside pt-2 border-t border-[#E2E6DF]">
              <li>Instant verification of 7-digit CML numbers and 6-digit HUID</li>
              <li>Plain-language explanations of mandatory safety parameters</li>
              <li>Awareness of statutory consumer protections under BIS Act 2016</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
