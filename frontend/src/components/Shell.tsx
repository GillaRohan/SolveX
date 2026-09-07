import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  ScanLine, 
  BookOpen, 
  Info, 
  FileText, 
  Award, 
  FlaskConical, 
  CheckCircle2, 
  Mic, 
  Bell, 
  Sparkles, 
  Settings as SettingsIcon, 
  ShieldAlert, 
  LogOut, 
  Search, 
  Globe, 
  Menu, 
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { UserRole } from '../types';

export type NavPage = 
  | 'dashboard'
  | 'ai-assistant'
  | 'scan-product'
  | 'natural-terms'
  | 'bis-info'
  | 'documents'
  | 'standards'
  | 'laboratories'
  | 'compliance'
  | 'voice-assistant'
  | 'alerts'
  | 'impact'
  | 'settings'
  | 'admin';

interface ShellProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage, data?: any) => void;
  children: React.ReactNode;
  onOpenVoiceModal: () => void;
}

export const Shell: React.FC<ShellProps> = ({ 
  currentPage, 
  onNavigate, 
  children, 
  onOpenVoiceModal 
}) => {
  const { user, role, switchRole, logout, openAuthModal } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai-assistant', label: 'AI BIS Assistant', icon: Bot, badge: 'AI' },
    { id: 'scan-product', label: 'Scan Product', icon: ScanLine },
    { id: 'natural-terms', label: 'Natural Terms', icon: BookOpen },
    { id: 'bis-info', label: 'BIS Information', icon: Info },
    { id: 'documents', label: 'Documents & Analysis', icon: FileText },
    { id: 'standards', label: 'Standards Catalog', icon: Award },
    { id: 'laboratories', label: 'Testing & Laboratories', icon: FlaskConical },
    { id: 'compliance', label: 'Compliance Center', icon: CheckCircle2, badge: 'Roadmap' },
    { id: 'voice-assistant', label: 'Voice Assistant', icon: Mic, isVoiceAction: true },
    { id: 'alerts', label: 'Alerts & Updates', icon: Bell },
    { id: 'impact', label: 'Impact & Benefits', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  if (role === 'ADMIN') {
    navItems.push({ id: 'admin', label: 'Admin Command', icon: ShieldAlert, badge: 'Gov' });
  }

  const roleColors: Record<UserRole, { bg: string; text: string; border: string }> = {
    CONSUMER: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    MANUFACTURER: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    STUDENT: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    ADMIN: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  };

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('ai-assistant', { initialQuery: searchQuery.trim() });
      setSearchQuery('');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F7FB]">
      {/* ===================== DESKTOP SIDEBAR ===================== */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#0A2540] text-white border-r border-[#0D2E4E] z-30 shadow-xl select-none">
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#143B63] bg-[#071D33]">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-bis-600 to-cyan-400 flex items-center justify-center shadow-md shadow-bis-600/30">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight font-sans text-white">SolveX</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  National AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate max-w-[150px]">
                National BIS Standards & Compliance Assistant
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigation Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.isVoiceAction) {
                    onOpenVoiceModal();
                  } else {
                    onNavigate(item.id as NavPage);
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-bis-600 text-white font-semibold shadow-md shadow-bis-600/30 translate-x-1'
                    : 'text-slate-300 hover:bg-[#123659] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#15426E] text-cyan-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Role Card & Profile at bottom */}
        <div className="p-3 border-t border-[#143B63] bg-[#071D33]/70">
          <div className="p-2.5 rounded-xl bg-[#0D2E4E]/90 border border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-bis-500 to-bis-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate max-w-[120px]">{user?.name}</p>
                <span className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded border ${roleColors[role].bg} ${roleColors[role].text} ${roleColors[role].border}`}>
                  {role}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout / Reset Session"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ===================== MAIN WRAPPER ===================== */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* ===================== TOP HEADER ===================== */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between z-20 shrink-0 shadow-sm">
          {/* Mobile menu trigger & title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="font-bold text-bis-800">Bureau of Indian Standards</span>
              <span>•</span>
              <span className="text-slate-400 hidden md:inline">National Standards & Compliance Intelligence Portal</span>
            </div>
          </div>

          {/* Center Global Search */}
          <form onSubmit={handleGlobalSearch} className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Indian Standards (IS), clauses, testing labs, or ask AI..."
                className="w-full pl-10 pr-4 py-1.5 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-bis-600 rounded-full outline-none transition-all"
              />
            </div>
          </form>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            {/* Multilingual Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <Globe className="w-3.5 h-3.5 text-bis-600" />
                <span className="hidden sm:inline">
                  {LANGUAGES.find(l => l.code === language)?.nativeLabel || 'Language'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Language
                  </div>
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                        language === l.code ? 'text-bis-600 font-bold bg-bis-50' : 'text-slate-700'
                      }`}
                    >
                      <span>{l.nativeLabel}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${roleColors[role].bg} ${roleColors[role].text} ${roleColors[role].border}`}
              >
                <span>Role: {role}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Demo Persona
                  </div>
                  {(['CONSUMER', 'MANUFACTURER', 'STUDENT', 'ADMIN'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                        role === r ? 'font-bold text-bis-600 bg-bis-50' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{r}</div>
                        <div className="text-[10px] text-slate-400">
                          {r === 'CONSUMER' && 'Product scan & verification'}
                          {r === 'MANUFACTURER' && 'Compliance roadmap & lab finder'}
                          {r === 'STUDENT' && 'Clauses & standards research'}
                          {r === 'ADMIN' && 'Management & analytics'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Voice Assistant Quick Trigger */}
            <button
              onClick={onOpenVoiceModal}
              title="Open Voice Assistant"
              className="p-2 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100 transition-colors"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Notifications Trigger */}
            <button
              onClick={() => onNavigate('alerts')}
              title="BIS Gazette Alerts"
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>
          </div>
        </header>

        {/* ===================== MAIN CONTENT AREA ===================== */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* ===================== MOBILE SLIDE-OUT DRAWER ===================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-72 max-w-[80vw] bg-[#0A2540] text-white flex flex-col h-full z-10 shadow-2xl">
            <div className="h-16 px-5 flex items-center justify-between border-b border-[#143B63]">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-cyan-400" />
                <span className="font-extrabold text-lg">SolveX</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (item.isVoiceAction) {
                        onOpenVoiceModal();
                      } else {
                        onNavigate(item.id as NavPage);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm ${
                      isActive ? 'bg-bis-600 text-white font-semibold' : 'text-slate-300 hover:bg-[#123659]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 border-t border-[#143B63]">
              <div className="text-xs text-slate-400 mb-2">Logged in as {user?.name}</div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-600/20 text-red-300 text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
