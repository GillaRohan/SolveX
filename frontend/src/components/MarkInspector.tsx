import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, Info, Check, Eye } from 'lucide-react';

export const MarkInspector: React.FC = () => {
  const [selectedHotspot, setSelectedHotspot] = useState<'standard' | 'monogram' | 'cml' | 'seal'>('monogram');

  const inspectionPoints = {
    standard: {
      title: '1. Indian Standard Number (Top)',
      rule: 'Must state the exact IS number, e.g. "IS 302-2-15" or "IS 4151".',
      fakeTell: 'Counterfeit marks often display generic words like "TESTED OK", "APPROVED", or a fake non-existent IS number.'
    },
    monogram: {
      title: '2. The Triangular Monogram (Center)',
      rule: 'The official BIS monogram has precise geometric proportions with the stylized letters "ISI" enclosed within a double triangle.',
      fakeTell: 'Fakes frequently have uneven line thickness, incorrect proportions, or blurred lettering.'
    },
    cml: {
      title: '3. The 7-Digit CM/L Number (Bottom)',
      rule: 'Must state "CM/L-" followed by a 7-digit unique operational licence number (e.g. CM/L-8400192).',
      fakeTell: 'If an ISI mark has no CM/L number at the bottom, or only has 4-5 digits, it is 100% illegal and counterfeit.'
    },
    seal: {
      title: '4. Packaging Tamper Seal & Batch Code',
      rule: 'Genuine products carry batch numbers, date of manufacture, and tamper-evident packaging matching the SIT schedule.',
      fakeTell: 'Missing batch numbers, absent address, or peeled stickers over unbranded boxes indicate spurious products.'
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-bis-50 text-bis-600 flex items-center justify-center">
          <Eye className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Interactive BIS Mark Authenticity Inspector
          </h2>
          <p className="text-xs text-slate-500">
            Click on each section of the mark below to learn how to spot genuine certification vs counterfeit labels
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Interactive Holographic Mark Card */}
        <div className="bg-gradient-to-br from-[#071D33] via-[#0A2540] to-bis-900 rounded-3xl p-6 text-white text-center shadow-xl border border-slate-700/50 flex flex-col items-center justify-center min-h-[260px] space-y-4">
          <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/15">
            Interactive Mark Hotspots
          </span>

          {/* Hotspot 1: IS Standard */}
          <button
            onClick={() => setSelectedHotspot('standard')}
            className={`px-4 py-1.5 rounded-xl font-mono text-xs font-black transition-all ${
              selectedHotspot === 'standard'
                ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-400/30 scale-105'
                : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
            }`}
          >
            IS 302-2-15 🎯
          </button>

          {/* Hotspot 2: Monogram */}
          <button
            onClick={() => setSelectedHotspot('monogram')}
            className={`w-28 h-20 rounded-2xl flex flex-col items-center justify-center font-serif font-black text-2xl tracking-tighter transition-all ${
              selectedHotspot === 'monogram'
                ? 'bg-gradient-to-tr from-cyan-400 to-white text-slate-950 ring-4 ring-cyan-400/30 scale-105'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
            }`}
          >
            <span>🇮🇳 ISI</span>
            <span className="text-[9px] font-sans font-bold tracking-widest opacity-80 uppercase">Standard</span>
          </button>

          {/* Hotspot 3: CM/L Number */}
          <button
            onClick={() => setSelectedHotspot('cml')}
            className={`px-4 py-1.5 rounded-xl font-mono text-xs font-black transition-all ${
              selectedHotspot === 'cml'
                ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-400/30 scale-105'
                : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
            }`}
          >
            CM/L - 8400192 🎯
          </button>
        </div>

        {/* Inspection Details Card */}
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-bis-800">
              {inspectionPoints[selectedHotspot].title}
            </span>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 space-y-1">
            <span className="font-bold text-emerald-800 flex items-center gap-1.5 text-[11px]">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Statutory Requirement:
            </span>
            <p className="text-slate-700 leading-relaxed font-medium">
              {inspectionPoints[selectedHotspot].rule}
            </p>
          </div>

          <div className="p-3.5 bg-red-50/70 rounded-2xl border border-red-200/80 space-y-1">
            <span className="font-bold text-red-800 flex items-center gap-1.5 text-[11px]">
              <AlertCircle className="w-3.5 h-3.5 text-red-600" />
              How to Spot Counterfeits:
            </span>
            <p className="text-slate-700 leading-relaxed font-medium">
              {inspectionPoints[selectedHotspot].fakeTell}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
