import React, { useState } from 'react';
import { Calculator, Sparkles, Building2, Check, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export const FeeEstimator: React.FC<{ onNavigate?: any }> = ({ onNavigate }) => {
  const [scale, setScale] = useState<'MICRO' | 'SMALL' | 'MEDIUM' | 'LARGE'>('MICRO');
  const [productCategory, setProductCategory] = useState<'ELECTRICAL' | 'AUTOMOTIVE' | 'WATER' | 'ELECTRONICS' | 'METALLURGY'>('ELECTRICAL');

  const baseCosts = {
    ELECTRICAL: { appFee: 1000, auditFee: 7000, testFee: 25000, markingFee: 42000, timelineDays: 45 },
    AUTOMOTIVE: { appFee: 1000, auditFee: 7000, testFee: 32000, markingFee: 48000, timelineDays: 50 },
    WATER: { appFee: 1000, auditFee: 7000, testFee: 28000, markingFee: 50000, timelineDays: 40 },
    ELECTRONICS: { appFee: 1000, auditFee: 0, testFee: 35000, markingFee: 22000, timelineDays: 25 },
    METALLURGY: { appFee: 1000, auditFee: 7000, testFee: 20000, markingFee: 38000, timelineDays: 45 },
  };

  const currentBase = baseCosts[productCategory];
  const isMsmeConcession = scale === 'MICRO' || scale === 'SMALL';
  const markingFeeDiscount = isMsmeConcession ? 0.5 : 1.0;
  const effectiveMarkingFee = Math.round(currentBase.markingFee * markingFeeDiscount);
  const totalEstimatedCost = currentBase.appFee + currentBase.auditFee + currentBase.testFee + effectiveMarkingFee;

  return (
    <div className="card p-6 sm:p-8 space-y-6 bg-white border border-[#D4AF37]/35 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FEF9C3] text-[#996515] border border-[#D4AF37]/40 flex items-center justify-center shadow-xs">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#111827]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              MSME Certification Cost &amp; Timeline Estimator
            </h2>
            <p className="text-xs text-[#6B7280]">
              Calculate official BIS fees, laboratory testing charges, and Atmanirbhar MSME concessions
            </p>
          </div>
        </div>

        {isMsmeConcession && (
          <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-[#FEF9C3] text-[#854D0E] border border-[#D4AF37]/40 self-start sm:self-auto flex items-center gap-1.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" /> 50% MSME Concession Active
          </span>
        )}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
            Enterprise Classification
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'MICRO', label: 'Micro Enterprise' },
              { id: 'SMALL', label: 'Small Enterprise' },
              { id: 'MEDIUM', label: 'Medium Enterprise' },
              { id: 'LARGE', label: 'Large Corporate' }
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setScale(s.id as any)}
                className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  scale === s.id
                    ? 'bg-[#FEF9C3] text-[#996515] font-bold shadow-xs border-[#D4AF37]'
                    : 'bg-[#FAFAF8] border-gray-200 text-[#4B5563] hover:bg-gray-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
            Product Domain / Standard
          </label>
          <select
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value as any)}
            className="w-full px-4 py-3 text-xs border border-[#D4AF37]/40 rounded-2xl bg-[#FAFAF8] focus:bg-white font-semibold text-[#111827] outline-none focus:border-[#C9A227] shadow-2xs transition-all"
          >
            <option value="ELECTRICAL">Electric Kettles / Appliances (IS 302-2-15)</option>
            <option value="AUTOMOTIVE">Two-Wheeler Helmets (IS 4151)</option>
            <option value="WATER">Packaged Drinking Water (IS 14543)</option>
            <option value="ELECTRONICS">Electronics / Power Banks (CRS - IS 16046)</option>
            <option value="METALLURGY">Domestic Pressure Cookers (IS 2347)</option>
          </select>

          <div className="mt-2.5 p-3 rounded-xl bg-[#FAFAF8] border border-gray-200 text-xs flex items-center justify-between">
            <span className="text-[#6B7280] flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#996515]" />
              Est. Certification Timeline:
            </span>
            <span className="font-extrabold text-[#111827]">
              ~{currentBase.timelineDays} Working Days
            </span>
          </div>
        </div>
      </div>

      {/* Cost Breakdown Grid */}
      <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-[#E5C066]/30 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="space-y-0.5">
          <span className="text-[#6B7280] font-medium text-[11px]">Application Fee</span>
          <div className="font-black text-[#111827] text-sm sm:text-base">₹{currentBase.appFee.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-[#9CA3AF]">Fixed statutory filing</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[#6B7280] font-medium text-[11px]">Factory Audit Charges</span>
          <div className="font-black text-[#111827] text-sm sm:text-base">₹{currentBase.auditFee.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-[#9CA3AF]">Inspection officer manday</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[#6B7280] font-medium text-[11px]">Laboratory Type Testing</span>
          <div className="font-black text-[#111827] text-sm sm:text-base">₹{currentBase.testFee.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-[#9CA3AF]">Accredited testing sample</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[#6B7280] font-medium text-[11px]">Annual Marking Fee</span>
          <div className="font-black text-[#996515] text-sm sm:text-base">
            ₹{effectiveMarkingFee.toLocaleString('en-IN')}
            {isMsmeConcession && <span className="text-[10px] text-[#854D0E] ml-1 font-bold">(-50%)</span>}
          </div>
          <span className="text-[10px] text-[#9CA3AF]">Standard usage license</span>
        </div>
      </div>

      {/* Total Banner */}
      <div 
        className="p-5 rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-[#D4AF37]/50"
        style={{ background: 'linear-gradient(135deg, #1C180A 0%, #2D240E 100%)' }}
      >
        <div>
          <span className="text-[10px] uppercase font-extrabold text-[#F5D77F] tracking-wider">
            Total Estimated First-Year Investment
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white mt-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
            ₹{totalEstimatedCost.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="text-xs text-[#D1D5DB] text-left sm:text-right">
          <div>*Subject to laboratory test volume and travel expenses</div>
          <div className="text-[#F5D77F] font-semibold mt-0.5">Eligible under Credit Linked Capital Subsidy Scheme (CLCSS)</div>
        </div>
      </div>
    </div>
  );
};
