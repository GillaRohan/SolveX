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
  const { language, setLanguage } = useLanguage();

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
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Settings & Preferences</h1>
        <p className="text-xs text-slate-500">
          Manage language preferences, AI engine keys, demo persona, and notification preferences
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Language & Regional Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe className="w-5 h-5 text-bis-600" />
            <h2 className="font-bold text-slate-900 text-sm">Language & Multilingual Experience</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  language === l.code
                    ? 'bg-bis-50 border-bis-600 text-bis-900 shadow-sm font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                }`}
              >
                <div className="text-sm font-semibold">{l.nativeLabel}</div>
                <div className="text-[11px] text-slate-400">{l.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* User Role / Persona Switcher */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-bis-600" />
            <h2 className="font-bold text-slate-900 text-sm">Demo Persona & Role Switcher</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(['CONSUMER', 'MANUFACTURER', 'STUDENT', 'ADMIN'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => switchRole(r)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  role === r
                    ? 'bg-bis-600 text-white font-bold shadow-md'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-white'
                }`}
              >
                <div className="font-bold text-xs">{r}</div>
                <div className={`text-[11px] mt-0.5 ${role === r ? 'text-slate-200' : 'text-slate-500'}`}>
                  {r === 'CONSUMER' && 'Camera scanning, consumer rights, hallmark purity check'}
                  {r === 'MANUFACTURER' && 'Roadmaps, testing schedules, checklist, lab recommendations'}
                  {r === 'STUDENT' && 'Standards research, clause extraction, natural terms'}
                  {r === 'ADMIN' && 'Officer dashboard, analytics, gazette management'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* AI Engine Keys (Optional) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Key className="w-5 h-5 text-bis-600" />
            <h2 className="font-bold text-slate-900 text-sm">Custom AI Provider Keys (Optional)</h2>
          </div>

          <p className="text-xs text-slate-500">
            SolveX has a high-fidelity Grounded BIS Intelligence Engine built-in that functions out-of-the-box. You can optionally attach personal OpenAI or Google Gemini keys.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Google Gemini API Key
              </label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-bis-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                OpenAI API Key
              </label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-bis-600 outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-bis-600 hover:bg-bis-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-bis-600/20 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Preferences
        </button>
      </form>
    </div>
  );
};
