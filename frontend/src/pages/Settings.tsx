import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Globe, 
  ShieldCheck, 
  Key, 
  Bell, 
  User, 
  Save, 
  CheckCircle,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { AppLanguage, UserRole } from '../types';

export const Settings: React.FC = () => {
  const { user, role, switchRole } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [openaiKey, setOpenaiKey] = useState(localStorage.getItem('solvex_custom_openai_key') || '');
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('solvex_custom_gemini_key') || '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('solvex_custom_openai_key', openaiKey);
    localStorage.setItem('solvex_custom_gemini_key', geminiKey);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in text-[#1F2937]">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-6 rounded-sm bg-[#D4AF37]" />
          <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Platform Settings &amp; Preferences
          </h1>
        </div>
        <p className="text-xs text-[#6B7280]">
          Manage language preferences, AI engine keys, demo persona, and notification preferences
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 shadow-2xs">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Language & Regional Settings */}
        <div className="card p-6 space-y-4 bg-white border border-[#D4AF37]/35 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <div className="p-1.5 rounded-lg bg-[#FEF9C3] text-[#996515] border border-[#D4AF37]/40 shadow-xs">
              <Globe className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-[#111827] text-sm sm:text-base" style={{ fontFamily: 'Outfit, sans-serif' }}>
              8 Regional Indian Languages Supported
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  language === l.code
                    ? 'bg-[#FEF9C3] border-[#D4AF37] text-[#111827] font-bold shadow-xs'
                    : 'bg-[#FAFAF8] border-gray-200 text-[#4B5563] hover:bg-gray-100'
                }`}
              >
                <div className="text-sm font-bold text-[#111827]">{l.nativeLabel}</div>
                <div className="text-[11px] text-[#6B7280] mt-0.5">{l.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* User Role / Persona Switcher */}
        <div className="card p-6 space-y-4 bg-white border border-[#D4AF37]/35 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <div className="p-1.5 rounded-lg bg-[#FEF9C3] text-[#996515] border border-[#D4AF37]/40 shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-[#111827] text-sm sm:text-base" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Demo Persona &amp; Role Switcher
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(['CONSUMER', 'MANUFACTURER', 'STUDENT', 'ADMIN'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => switchRole(r)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  role === r
                    ? 'bg-[#FEF9C3] border-[#D4AF37] text-[#111827] font-bold shadow-xs'
                    : 'bg-[#FAFAF8] border-gray-200 text-[#4B5563] hover:bg-gray-100'
                }`}
              >
                <div className="font-extrabold text-xs tracking-wider text-[#111827]">{r}</div>
                <div className={`text-[11px] mt-1 ${role === r ? 'text-[#854D0E]' : 'text-[#6B7280]'}`}>
                  {r === 'CONSUMER' && 'Product verification, consumer guidance, hallmark purity check'}
                  {r === 'MANUFACTURER' && 'Roadmaps, testing schedules, checklist, lab recommendations'}
                  {r === 'STUDENT' && 'Standards research, clause extraction, natural terms'}
                  {r === 'ADMIN' && 'Officer dashboard, analytics, gazette management'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* AI Engine Keys (Optional) */}
        <div className="card p-6 space-y-4 bg-white border border-[#D4AF37]/35 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <div className="p-1.5 rounded-lg bg-[#FEF9C3] text-[#996515] border border-[#D4AF37]/40 shadow-xs">
              <Key className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-[#111827] text-sm sm:text-base" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Custom AI Provider Keys (Optional)
            </h2>
          </div>

          <p className="text-xs text-[#6B7280]">
            SolveX has a high-fidelity Grounded BIS Intelligence Engine built-in that functions out-of-the-box. You can optionally attach personal OpenAI or Google Gemini keys.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1">
                Google Gemini API Key
              </label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-2.5 text-xs border border-[#D4AF37]/40 rounded-xl focus:border-[#C9A227] outline-none text-[#111827] bg-[#FAFAF8] focus:bg-white shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1">
                OpenAI API Key
              </label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full px-4 py-2.5 text-xs border border-[#D4AF37]/40 rounded-xl focus:border-[#C9A227] outline-none text-[#111827] bg-[#FAFAF8] focus:bg-white shadow-2xs"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 btn-primary text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4 text-white" />
          Save Preferences
        </button>
      </form>
    </div>
  );
};
