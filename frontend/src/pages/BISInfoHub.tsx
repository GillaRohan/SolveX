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
  HelpCircle
} from 'lucide-react';
import { NavPage } from '../components/Shell';

interface BISInfoHubProps {
  onNavigate: (page: NavPage, data?: any) => void;
}

export const BISInfoHub: React.FC<BISInfoHubProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const categories = [
    'ALL',
    'Product Certification (Scheme I)',
    'Compulsory Registration (Scheme II)',
    'Hallmarking Scheme',
    'Foreign Manufacturers (FMCS)',
    'Laboratory Recognition (LRS)',
    'Consumer Protection Services'
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
      portal: 'BIS Laboratory Network Portal',
      standardsCount: '280+ recognized labs'
    },
    {
      id: 'consumer',
      category: 'Consumer Protection Services',
      title: 'Consumer Rights & BIS Care Mobile Platform',
      summary: 'Tools for citizens to verify products, lodge complaints against misuse of marks, and claim redressal.',
      details: [
        'Instant verification of CM/L, R-numbers, and HUID codes via mobile app.',
        'Direct grievance redressal mechanism for substandard or fake ISI marked products.',
        'Statutory penalties for unauthorized use of Standard Marks under BIS Act 2016.',
        'Public awareness campaigns under Jago Grahak Jago.'
      ],
      portal: 'BIS Care App & National Consumer Helpline 1915',
      standardsCount: 'Pan-India consumer coverage'
    }
  ];

  const filteredCards = activeCategory === 'ALL' 
    ? infoCards 
    : infoCards.filter(c => c.category === activeCategory);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">BIS Information & Schemes Hub</h1>
        <p className="text-xs text-slate-500">
          Comprehensive guide to the Bureau of Indian Standards statutory schemes, certification processes, and portals
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeCategory === cat
                ? 'bg-bis-600 text-white font-bold shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {cat === 'ALL' ? 'All Schemes & Services' : cat}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-bis-700 bg-bis-50 border border-bis-200 px-2.5 py-0.5 rounded-lg">
                  {card.category}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {card.standardsCount}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {card.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {card.summary}
              </p>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
                <span className="font-bold text-slate-800 block text-[11px]">Key Highlights:</span>
                <ul className="space-y-1 list-disc list-inside text-[11px] text-slate-600">
                  {card.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">
                {card.portal}
              </span>

              <button
                onClick={() => onNavigate('ai-assistant', { initialQuery: `Explain ${card.title} in detail.` })}
                className="flex items-center gap-1 font-bold text-bis-600 hover:text-bis-800"
              >
                <span>Consult AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
