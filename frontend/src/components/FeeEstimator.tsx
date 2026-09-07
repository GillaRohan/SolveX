import React, { useState } from 'react';
import { Calculator, Sparkles, Building2, Check, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export const FeeEstimator: React.FC = () => {
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
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              MSME Certification Cost & Timeline Estimator
            </h2>
            <p className="text-xs text-slate-500">
              Calculate official BIS fees, laboratory testing charges, and Atmanirbhar MSME concessions
            </p>
          </div>
        </div>

        {isMsmeConcession && (
          <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> 50% MSME Concession Active
          </span>
        )}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
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
                className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  scale === s.id
                    ? 'bg-bis-600 text-white font-bold shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Product Domain / Standard
          </label>
          <select
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value as any)}
            className="w-full px-4 py-3 text-xs border border-slate-300 rounded-2xl bg-white font-semibold text-slate-800 outline-none focus:border-bis-600 shadow-sm"
          >
            <option value="ELECTRICAL">Electric Kettles / Appliances (IS 302-2-15)</option>
            <option value="AUTOMOTIVE">Two-Wheeler Helmets (IS 4151)</option>
            <option value="WATER">Packaged Drinking Water (IS 14543)</option>
            <option value="ELECTRONICS">Electronics / Power Banks (CRS - IS 16046)</option>
            <option value="METALLURGY">Domestic Pressure Cookers (IS 2347)</option>
          </select>

          <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-bis-600" />
              Est. Certification Timeline:
            </span>
            <span className="font-extrabold text-slate-900">
              ~{currentBase.timelineDays} Working Days
            </span>
          </div>
        </div>
      </div>

      {/* Cost Breakdown Grid */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="space-y-0.5">
          <span className="text-slate-400 font-medium text-[11px]">Application Fee</span>
          <div className="font-black text-slate-800 text-sm sm:text-base">₹{currentBase.appFee}</div>
          <span className="text-[10px] text-slate-400">Fixed statutory filing</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-slate-400 font-medium text-[11px]">Factory Audit Charges</span>
          <div className="font-black text-slate-800 text-sm sm:text-base">₹{currentBase.auditFee}</div>
          <span className="text-[10px] text-slate-400">Inspection officer manday</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-slate-400 font-medium text-[11px]">Laboratory Type Testing</span>
          <div className="font-black text-slate-800 text-sm sm:text-base">₹{currentBase.testFee}</div>
          <span className="text-[10px] text-slate-400">Accredited testing sample</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-slate-400 font-medium text-[11px]">Annual Marking Fee</span>
          <div className="font-black text-emerald-700 text-sm sm:text-base">
            ₹{effectiveMarkingFee}
            {isMsmeConcession && <span className="text-[10px] text-emerald-600 ml-1 font-bold">(-50%)</span>}
          </div>
          <span className="text-[10px] text-slate-400">Standard usage license</span>
        </div>
      </div>

      {/* Total Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#071D33] to-[#0A2540] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div>
          <span className="text-[10px] uppercase font-bold text-cyan-300 tracking-wider">
            Total Estimated First-Year Investment
          </span>
          <div className="text-2xl font-black text-white">
            ₹{totalEstimatedCost.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="text-xs text-slate-300 text-left sm:text-right">
          <div>*Subject to laboratory test volume and travel expenses</div>
          <div className="text-cyan-300 font-medium">Eligible under Credit Linked Capital Subsidy Scheme (CLCSS)</div>
        </div>
      </div>
    </div>
  );
};
