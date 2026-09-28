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
    <div className="card p-6 sm:p-8 space-y-5 bg-white border border-[#D4AF37]/35 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#FEF9C3] text-[#996515] border border-[#D4AF37]/40 flex items-center justify-center shadow-xs">
          <Eye className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-[#111827]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Interactive BIS Mark Authenticity Inspector
          </h2>
          <p className="text-xs text-[#6B7280]">
            Click on each section of the mark below to learn how to spot genuine certification vs counterfeit labels
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Interactive Holographic Mark Card */}
        <div 
          className="rounded-3xl p-6 text-center shadow-md border border-[#D4AF37]/40 flex flex-col items-center justify-center min-h-[260px] space-y-4"
          style={{ background: 'linear-gradient(135deg, #1C180A 0%, #29210B 100%)' }}
        >
          <span className="text-[10px] text-[#F5D77F] font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-[#D4AF37]/30 backdrop-blur-md">
            Interactive Mark Hotspots
          </span>

          {/* Hotspot 1: IS Standard */}
          <button
            onClick={() => setSelectedHotspot('standard')}
            className={`px-4 py-1.5 rounded-xl font-mono text-xs font-black transition-all cursor-pointer ${
              selectedHotspot === 'standard'
                ? 'bg-[#D4AF37] text-[#111827] ring-4 ring-[#D4AF37]/40 scale-105 shadow-md font-bold'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
            }`}
          >
            IS 302-2-15 🎯
          </button>

          {/* Hotspot 2: Monogram */}
          <button
            onClick={() => setSelectedHotspot('monogram')}
            className={`w-28 h-20 rounded-2xl flex flex-col items-center justify-center font-serif font-black text-2xl tracking-tighter transition-all cursor-pointer ${
              selectedHotspot === 'monogram'
                ? 'bg-gradient-to-tr from-[#F5D77F] to-[#D4AF37] text-[#111827] ring-4 ring-[#D4AF37]/40 scale-105 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
            }`}
          >
            <span>🇮🇳 ISI</span>
            <span className="text-[9px] font-sans font-bold tracking-widest opacity-80 uppercase">Standard</span>
          </button>

          {/* Hotspot 3: CM/L Number */}
          <button
            onClick={() => setSelectedHotspot('cml')}
            className={`px-4 py-1.5 rounded-xl font-mono text-xs font-black transition-all cursor-pointer ${
              selectedHotspot === 'cml'
                ? 'bg-[#D4AF37] text-[#111827] ring-4 ring-[#D4AF37]/40 scale-105 shadow-md font-bold'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
            }`}
          >
            CM/L - 8400192 🎯
          </button>
        </div>

        {/* Inspection Details Card */}
        <div className="bg-[#FAFAF8] rounded-3xl p-6 border border-[#E5C066]/30 space-y-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-[#111827]">
              {inspectionPoints[selectedHotspot].title}
            </span>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-gray-200 space-y-1 shadow-2xs">
            <span className="font-bold text-[#996515] flex items-center gap-1.5 text-[11px]">
              <Check className="w-3.5 h-3.5 text-[#996515]" />
              Statutory Requirement:
            </span>
            <p className="text-[#374151] leading-relaxed font-medium">
              {inspectionPoints[selectedHotspot].rule}
            </p>
          </div>

          <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 space-y-1">
            <span className="font-bold text-rose-700 flex items-center gap-1.5 text-[11px]">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              How to Spot Counterfeits:
            </span>
            <p className="text-rose-800 leading-relaxed font-medium">
              {inspectionPoints[selectedHotspot].fakeTell}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
