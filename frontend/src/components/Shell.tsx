import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  BookOpen, 
  Info, 
  Award, 
  GraduationCap, 
  Mic, 
  LogOut, 
  Search, 
  Globe, 
  Menu, 
  X,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Check,
  Sparkles,
  User,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { UserRole } from '../types';

export type NavPage = 
  | 'dashboard'
  | 'ai-assistant'
  | 'standards'
  | 'natural-terms'
  | 'bis-info'
  | 'impact'
  | 'voice-assistant'
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
  const { user, role, switchRole, logout } = useAuth();
  const { language, setLanguage, t, currentLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'dashboard' as NavPage, label: t('overview') || 'Overview', icon: LayoutDashboard },
    { id: 'ai-assistant' as NavPage, label: t('aiAssistant') || 'AI Assistant', icon: Bot, badge: 'AI' },
    { id: 'standards' as NavPage, label: t('productStandards') || 'Product Standards', icon: Award },
    { id: 'natural-terms' as NavPage, label: t('naturalTerms') || 'Natural Terms', icon: BookOpen },
    { id: 'bis-info' as NavPage, label: t('bisInfo') || 'BIS Information', icon: Info },
    { id: 'impact' as NavPage, label: t('standardsTraining') || 'Standards & Training', icon: GraduationCap },
  ];

  const roleLabels: Record<UserRole, { title: string; subtitle: string; initials: string; badge: string }> = {
    CONSUMER: { title: user?.name || 'Rahul Sharma', subtitle: 'Consumer / Citizen', initials: 'RS', badge: 'Citizen' },
    MANUFACTURER: { title: user?.name || 'Vikramaditya Rao', subtitle: 'MSME Manufacturer', initials: 'VR', badge: 'MSME' },
    STUDENT: { title: user?.name || 'Priya Nair', subtitle: 'Student / Researcher', initials: 'PN', badge: 'Research' },
    ADMIN: { title: user?.name || 'Dr. K. S. Murthy', subtitle: 'BIS Admin Officer', initials: 'KM', badge: 'Gov' }
  };

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('ai-assistant', { initialQuery: searchQuery.trim() });
      setSearchQuery('');
    }
  };

  const currentRoleInfo = roleLabels[role] || roleLabels.MANUFACTURER;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0D282A] text-[#E1E8E8] select-none border-r border-[#153B3E]">
      {/* ── Brand Header ─────────────────────────────── */}
      <div 
        className="px-5 py-5 border-b border-[#1A4447] cursor-pointer"
        onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }}
      >
        <div className="flex items-center gap-3">
          {/* Gold Logo Badge */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#C99738] to-[#E0B45C] flex items-center justify-center text-[#0D282A] shadow-md shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#0D282A]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white font-serif-heading">
                SolveX
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#C99738]/20 text-[#E0B45C] border border-[#C99738]/30">
                BIS
              </span>
            </div>
            <p className="text-[10px] text-[#8AA4A6] tracking-wider uppercase font-medium mt-0.5 truncate">
              {t('portalSubtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* ── Mode / Status Info Widget ───────────────── */}
      <div className="px-4 py-3 border-b border-[#1A4447]">
        <div className="bg-[#133437] border border-[#1E4D51] rounded-xl p-3 text-xs">
          <div className="flex items-center gap-2 text-[#E0B45C] font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#E0B45C] animate-pulse" />
            <span>AI Compliance Active</span>
          </div>
          <p className="text-[11px] text-[#A2BABB] mt-1 leading-relaxed">
            Statutory guidance grounded in Gazette QCOs &amp; BIS standards.
          </p>
        </div>
      </div>

      {/* ── Navigation Links ─────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-[#184245] text-white font-semibold shadow-xs border-l-3 border-[#C99738]'
                  : 'text-[#9AB3B5] hover:bg-[#133639] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#E0B45C]' : 'text-[#7D999B]'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#C99738]/25 text-[#E0B45C] border border-[#C99738]/40">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Voice Assistant Trigger */}
        <button
          onClick={() => {
            onOpenVoiceModal();
            setMobileMenuOpen(false);
          }}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-[#9AB3B5] hover:bg-[#133639] hover:text-white transition-all text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Mic className="w-4 h-4 text-[#E0B45C] shrink-0" />
            <span>{t('voiceAssistant')}</span>
          </div>
          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Voice
          </span>
        </button>
      </div>

      {/* ── Language Switcher in Sidebar ────────────── */}
      <div className="px-3 pt-2 pb-1 border-t border-[#1A4447]">
        <div className="relative">
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#133437] hover:bg-[#184245] border border-[#1E4D51] text-xs text-[#E1E8E8] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-[#E0B45C]" />
              <span className="font-medium">{currentLanguage.nativeLabel}</span>
              <span className="text-[10px] text-[#8AA4A6]">({currentLanguage.label})</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-[#8AA4A6] transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {langDropdownOpen && (
            <div className="absolute bottom-full mb-1 left-0 right-0 bg-[#0F2D30] border border-[#1E4D51] rounded-xl shadow-xl z-50 p-1 space-y-0.5 max-h-56 overflow-y-auto">
              <div className="px-2 py-1 text-[10px] font-bold text-[#8AA4A6] uppercase tracking-wider">
                {t('selectLanguage')}
              </div>
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left cursor-pointer transition-colors ${
                    language === lang.code
                      ? 'bg-[#184245] text-white font-bold'
                      : 'text-[#B4C7C8] hover:bg-[#133639] hover:text-white'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-xs text-white">{lang.nativeLabel}</span>
                    <span className="text-[10px] text-[#8AA4A6]">{lang.label} • {lang.region}</span>
                  </div>
                  {language === lang.code && <Check className="w-3.5 h-3.5 text-[#E0B45C]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── User Profile & Logout in Sidebar ────────── */}
      <div className="p-3 border-t border-[#1A4447]">
        <div className="flex items-center justify-between bg-[#133437] rounded-xl p-2.5 border border-[#1E4D51]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#1A4B4E] border border-[#C99738]/50 text-[#E0B45C] font-bold text-xs flex items-center justify-center shrink-0">
              {currentRoleInfo.initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {currentRoleInfo.title}
              </p>
              <p className="text-[10px] text-[#8AA4A6] truncate">
                {currentRoleInfo.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            title={t('logout')}
            className="p-1.5 text-[#8AA4A6] hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer shrink-0 ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F7F8F5] text-[#192425]">
      {/* Desktop Left Sidebar (Fixed 260px) */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 fixed inset-y-0 left-0 z-30 shadow-xl">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 shadow-2xl">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* ── Main Content Area ───────────────────────── */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        {/* Top App Header */}
        <header className="sticky top-0 z-20 bg-[#FFFFFF] border-b border-[#E2E6DF] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-[#5C6768] hover:bg-[#F3F4F0] rounded-xl cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Top Path */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#5C6768]">
              <span 
                className="hover:text-[#113235] cursor-pointer font-medium"
                onClick={() => onNavigate('dashboard')}
              >
                BIS Portal
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#8B9798]" />
              <span className="font-semibold text-[#113235] capitalize">
                {t(currentPage === 'dashboard' ? 'overview' : currentPage) || currentPage}
              </span>
            </div>
          </div>

          {/* Center Search Bar */}
          <form onSubmit={handleGlobalSearch} className="flex-1 max-w-lg mx-2 hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8B9798] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-[#F3F4F0] focus:bg-white text-xs text-[#192425] placeholder-[#8B9798] pl-9 pr-4 py-2 rounded-xl border border-[#E2E6DF] focus:border-[#113235] focus:outline-none focus:ring-2 focus:ring-[#113235]/10 transition-all"
              />
            </div>
          </form>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5">
            {/* Quick Voice Trigger */}
            <button
              onClick={onOpenVoiceModal}
              className="p-2 text-[#5C6768] hover:text-[#113235] hover:bg-[#F3F4F0] rounded-xl transition-colors cursor-pointer"
              title={t('voiceAssistant')}
            >
              <Mic className="w-4 h-4 text-[#C99738]" />
            </button>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E2E6DF] hover:border-[#113235]/30 bg-[#FFFFFF] text-xs font-semibold text-[#192425] cursor-pointer transition-all shadow-2xs"
              >
                <User className="w-3.5 h-3.5 text-[#C99738]" />
                <span className="hidden sm:inline">{currentRoleInfo.badge}</span>
                <ChevronDown className="w-3 h-3 text-[#8B9798]" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E2E6DF] rounded-2xl shadow-xl z-50 p-1.5 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-[#8B9798] uppercase tracking-wider border-b border-gray-100">
                    {t('switchRole')}
                  </div>
                  {(['MANUFACTURER', 'ADMIN', 'CONSUMER', 'STUDENT'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left cursor-pointer transition-colors ${
                        role === r ? 'bg-[#113235] text-white font-semibold' : 'text-[#192425] hover:bg-[#F3F4F0]'
                      }`}
                    >
                      <span>{roleLabels[r].subtitle}</span>
                      {role === r && <Check className="w-3.5 h-3.5 text-[#E0B45C]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sign Out Button */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200/80 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('logout')}</span>
            </button>
          </div>
        </header>

        {/* ── Main Workspace Body ─────────────────────── */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* ── Clean Footer ────────────────────────────── */}
        <footer className="border-t border-[#E2E6DF] bg-white px-6 py-4 text-center text-xs text-[#8B9798]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span>{t('officialDisclaimer')}</span>
            <span>{t('allRightsReserved')}</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
