import React from 'react';
import { CameraScanner } from '../components/CameraScanner';
import { ShieldCheck, AlertTriangle, Award, CheckCircle, Info, ExternalLink } from 'lucide-react';
import { NavPage } from '../components/Shell';

interface ScanProductProps {
  onNavigate: (page: NavPage, data?: any) => void;
}

export const ScanProduct: React.FC<ScanProductProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 animate-in fade-in text-white">
      {/* Title & Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Product Scanner & Verification</h1>
          <p className="text-xs text-gray-400">
            Verify authenticity of ISI Mark, CRS Registration, or Gold Hallmark with BIS registry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Consumer Protection Mode Active
          </span>
        </div>
      </div>

      {/* Main Camera Scanner Component */}
      <CameraScanner 
        onViewStandard={(std) => onNavigate('standards', { search: std })}
      />

      {/* ===================== CONSUMER MARK RECOGNITION GUIDE ===================== */}
      <div className="card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
          <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">
              How to Verify Authentic BIS Certification Marks
            </h2>
            <p className="text-[11px] text-gray-400">Essential consumer identification criteria</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* ISI Mark Card */}
          <div className="p-4 rounded-2xl border border-white/10 bg-[#161B26] space-y-2 hover:border-emerald-500/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-white text-sm">ISI Mark (Scheme I)</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">Domestic Safety</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Must carry the <strong>Indian Standard number (IS XXXX)</strong> on top and the unique <strong>7-digit licence number (CM/L-XXXXXXX)</strong> at the bottom.
            </p>
            <div className="pt-2 text-[11px] text-gray-400 border-t border-white/10">
              Mandatory for: Helmets, Electric Kettles, Packaged Drinking Water, Gas Stoves, Pressure Cookers.
            </div>
          </div>

          {/* Hallmark Card */}
          <div className="p-4 rounded-2xl border border-white/10 bg-[#161B26] space-y-2 hover:border-amber-500/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-amber-300 text-sm">Gold Hallmark (HUID)</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">Purity Check</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Consists of 3 marks: <strong>BIS Triangle Logo</strong>, <strong>Purity Grade (e.g. 22K916)</strong>, and laser-engraved <strong>6-digit alphanumeric HUID</strong>.
            </p>
            <div className="pt-2 text-[11px] text-gray-400 border-t border-white/10">
              Mandatory for gold jewellery in 343+ designated districts.
            </div>
          </div>

          {/* CRS Card */}
          <div className="p-4 rounded-2xl border border-white/10 bg-[#161B26] space-y-2 hover:border-purple-500/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-purple-300 text-sm">CRS (Scheme II)</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">Electronics/IT</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Displays standard BIS CRS symbol with <em>"Self Declaration - Conforming to IS XXXX"</em> followed by unique <strong>R-XXXXXXXX registration number</strong>.
            </p>
            <div className="pt-2 text-[11px] text-gray-400 border-t border-white/10">
              Mandatory for: Laptops, Power Banks, Smart Phones, LED Lamps, Smart Watches.
            </div>
          </div>
        </div>

        {/* Warning Callout */}
        <div className="p-4 bg-amber-500/15 border border-amber-500/30 rounded-2xl text-xs text-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Consumer Advisory:</strong> If a product carries an ISI mark without a 7-digit CM/L number, or with a suspended licence status, it is counterfeit. Report the vendor directly through the national BIS Care portal or Consumer Helpline 1915.
          </div>
        </div>
      </div>
    </div>
  );
};
