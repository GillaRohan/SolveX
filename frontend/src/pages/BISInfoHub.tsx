import React, { useState } from 'react';
import { 
  Info, 
  Award, 
  ShieldCheck, 
  FlaskConical, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  HelpCircle,
  Bot
} from 'lucide-react';
import { NavPage } from '../components/Shell';
import { useLanguage } from '../context/LanguageContext';

interface BISInfoHubProps {
  onNavigate: (page: NavPage, data?: any) => void;
}

export const BISInfoHub: React.FC<BISInfoHubProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('ALL');

  const categories = [
    'ALL',
    'Product Certification (Scheme I)',
    'Compulsory Registration (Scheme II)',
    'Hallmarking Scheme',
    'Foreign Manufacturers (FMCS)',
    'Laboratory Recognition (LRS)'
  ];

  const infoCards = [
    {
      id: 'scheme-1',
      category: 'Product Certification (Scheme I)',
      title: 'Scheme I — The Iconic ISI Mark',
      summary: 'The primary third-party certification scheme for manufactured goods in India ensuring safety, reliability, and conformance to standards.',
      details: [
        'Requires factory audit, evaluation of manufacturing infrastructure, and routine testing apparatus.',
        'Draws samples for independent type testing at BIS recognized labs.',
        'Grants unique 7-digit CM/L licence number for operative tracking.',
        'Subject to ongoing unannounced market surveillance.'
      ],
      portal: 'ManakOnline Portal (manakonline.in)',
      standardsCount: 'Over 1,000 mandatory products'
    },
    {
      id: 'scheme-2',
      category: 'Compulsory Registration (Scheme II)',
      title: 'Scheme II — Compulsory Registration Scheme (CRS)',
      summary: 'Self-declaration of conformity operated in partnership with MeitY for electronics, IT, and telecom equipment.',
      details: [
        'Manufacturers submit test reports from accredited Indian testing laboratories directly on the CRS portal.',
        'No mandatory prior factory audit; fast-track registration within 15-20 working days.',
        'Issues unique R-XXXXXXXX registration number valid for 2 years.',
        'Mandatory for mobile phones, power banks, servers, and LED lamps.'
      ],
      portal: 'CRS BIS Portal (crsbis.in)',
      standardsCount: '80+ electronics categories'
    },
    {
      id: 'hallmark',
      category: 'Hallmarking Scheme',
      title: 'Gold & Silver Jewellery Hallmarking (HUID)',
      summary: 'Statutory verification of gold and silver fineness protecting consumers from purity fraud.',
      details: [
        'Enforces the 6-digit laser-engraved Hallmark Unique Identification (HUID).',
        'Standard purities: 22K (916), 18K (750), and 14K (585) with zero negative tolerance.',
        'Tested via Fire Assay (Cupellation) and X-ray Fluorescence (XRF) in accredited AHCs.',
        'Mandatory across 343+ designated districts in India.'
      ],
      portal: 'ManakOnline Hallmarking Module',
      standardsCount: 'IS 1417 & IS 2112'
    },
    {
      id: 'fmcs',
      category: 'Foreign Manufacturers (FMCS)',
      title: 'Foreign Manufacturers Certification Scheme (FMCS)',
      summary: 'Enables overseas production facilities to obtain the ISI mark for products destined for the Indian market.',
      details: [
        'Requires an on-site factory audit of overseas manufacturing facilities by BIS technical officers.',
        'Mandatory appointment of an Authorized Indian Representative (AIR).',
        'Submission of Performance Bank Guarantee (PBG) to ensure regulatory compliance.',
        'Critical for multinational brands exporting to India.'
      ],
      portal: 'FMCS Directorate (bis.gov.in)',
      standardsCount: '1,500+ overseas licenses'
    },
    {
      id: 'lrs',
      category: 'Laboratory Recognition (LRS)',
      title: 'Laboratory Recognition Scheme (LRS)',
      summary: 'Accreditation framework for external and commercial testing facilities testing samples for BIS conformity assessment.',
      details: [
        'Requires ISO/IEC 17025 accreditation from NABL.',
        'Proficiency testing and inter-laboratory comparison verification.',
        'Enables private and academic labs to execute statutory compliance testing.',
        'Covers chemical, electrical, mechanical, and microbiological domains.'
      ],
      portal: 'LRS Module (manakonline.in)',
      standardsCount: '280+ active laboratories'
    }
  ];

  const filteredCards = activeCategory === 'ALL' 
    ? infoCards 
    : infoCards.filter(c => c.category === activeCategory);

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-[#192425]">
      {/* ── Top Header Card ─────────────────────────────────── */}
      <div className="saas-card p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E6DF] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#8B9798] uppercase tracking-wider">
                STATUTORY GUIDANCE &amp; SCHEMES
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C99738]/15 text-[#A47720] font-bold border border-[#C99738]/30">
                BIS Act 2016
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#113235] font-serif-heading">
              {t('bisInfoTitle')}
            </h1>
            <p className="text-sm text-[#5C6768]">
              {t('bisInfoSubtitle')}
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

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#113235] text-white shadow-xs'
                  : 'bg-[#F3F4F0] text-[#5C6768] hover:bg-[#EAECE6] hover:text-[#192425] border border-[#E2E6DF]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Info Cards Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCards.map((card) => (
          <div key={card.id} className="saas-card p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C99738]/15 text-[#A47720] border border-[#C99738]/30">
                  {card.category}
                </span>
                <span className="text-xs text-[#8B9798] font-medium">
                  {card.standardsCount}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#113235]">
                  {card.title}
                </h3>
                <p className="text-xs text-[#5C6768] mt-1 leading-relaxed">
                  {card.summary}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#E2E6DF]">
                {card.details.map((point, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#5C6768]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E6DF] flex items-center justify-between text-xs">
              <span className="text-[#8B9798] text-[11px] truncate">{card.portal}</span>
              <button
                onClick={() => onNavigate('standards')}
                className="font-bold text-[#113235] hover:text-[#C99738] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
