import React from 'react';
import { CameraScanner } from '../components/CameraScanner';
import { ShieldCheck, AlertTriangle, Award, CheckCircle, Info, ExternalLink } from 'lucide-react';
import { NavPage } from '../components/Shell';

interface ScanProductProps {
  onNavigate: (page: NavPage, data?: any) => void;
}

export const ScanProduct: React.FC<ScanProductProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Title & Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Product Scanner & Verification</h1>
          <p className="text-xs text-slate-500">
            Verify authenticity of ISI Mark, CRS Registration, or Gold Hallmark with BIS registry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Consumer Protection Mode Active
          </span>
        </div>
      </div>

      {/* Main Camera Scanner Component */}
      <CameraScanner 
        onViewStandard={(std) => onNavigate('standards', { search: std })}
      />

      {/* ===================== CONSUMER MARK RECOGNITION GUIDE ===================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-bis-600" />
          How to Verify Authentic BIS Certification Marks
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* ISI Mark Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-bis-800 text-sm">ISI Mark (Scheme I)</span>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">Domestic Safety</span>
            </div>
            <p className="text-slate-600">
              Must carry the <strong>Indian Standard number (IS XXXX)</strong> on top and the unique <strong>7-digit licence number (CM/L-XXXXXXX)</strong> at the bottom.
            </p>
            <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-200">
              Mandatory for: Helmets, Electric Kettles, Packaged Drinking Water, Gas Stoves, Pressure Cookers.
            </div>
          </div>

          {/* Hallmark Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-amber-700 text-sm">Gold Hallmark (HUID)</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">Purity Check</span>
            </div>
            <p className="text-slate-600">
              Consists of 3 marks: <strong>BIS Triangle Logo</strong>, <strong>Purity Grade (e.g. 22K916)</strong>, and laser-engraved <strong>6-digit alphanumeric HUID</strong>.
            </p>
            <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-200">
              Mandatory for gold jewellery in 343+ designated districts.
            </div>
          </div>

          {/* CRS Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-cyan-800 text-sm">CRS (Scheme II)</span>
              <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 text-[10px] font-bold">Electronics/IT</span>
            </div>
            <p className="text-slate-600">
              Displays standard BIS CRS symbol with <em>"Self Declaration - Conforming to IS XXXX"</em> followed by unique <strong>R-XXXXXXXX registration number</strong>.
            </p>
            <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-200">
              Mandatory for: Laptops, Power Banks, Smart Phones, LED Lamps, Smart Watches.
            </div>
          </div>
        </div>

        {/* Warning Callout */}
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <strong>Consumer Advisory:</strong> If a product carries an ISI mark without a 7-digit CM/L number, or with a suspended licence status, it is counterfeit. Report the vendor directly through the national BIS Care portal or Consumer Helpline 1915.
          </div>
        </div>
      </div>
    </div>
  );
};
