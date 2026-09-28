import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Globe, 
  Check, 
  AlertCircle,
  Building2,
  Users,
  Award,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { UserRole } from '../types';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { login, demoLogin, error: authError } = useAuth();
  const { language, setLanguage, t, currentLanguage } = useLanguage();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!username.trim()) {
      setErrorMessage(t('usernameRequired'));
      return;
    }
    if (!password || password.length < 4) {
      setErrorMessage(t('passwordRequired'));
      return;
    }

    setIsLoading(true);
    const success = await login(username.trim(), password, rememberMe);
    setIsLoading(false);

    if (success) {
      setSuccessMessage(t('loginSuccess'));
      setTimeout(() => {
        onLoginSuccess();
      }, 500);
    } else {
      setErrorMessage(authError || t('invalidCredentials'));
    }
  };

  const handleQuickDemo = (role: UserRole) => {
    setIsLoading(true);
    demoLogin(role);
    setSuccessMessage(t('loginSuccess'));
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F5] flex flex-col justify-between text-[#192425]">
      {/* Top Simple Bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#E2E6DF] bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C99738] to-[#E0B45C] flex items-center justify-center text-[#0D282A] shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#0D282A]" />
          </div>
          <div>
            <span className="font-bold text-base text-[#113235] font-serif-heading">SolveX</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#C99738]/20 text-[#A47720] ml-2 border border-[#C99738]/30">
              BIS Intelligence
            </span>
          </div>
        </div>

        {/* Language selector in top right of login screen */}
        <div className="relative">
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F3F4F0] hover:bg-[#EAECE6] border border-[#E2E6DF] text-xs font-semibold text-[#192425] cursor-pointer transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-[#C99738]" />
            <span>{currentLanguage.nativeLabel}</span>
            <span className="text-[10px] text-[#8B9798]">({currentLanguage.label})</span>
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-60 bg-white border border-[#E2E6DF] rounded-2xl shadow-xl z-50 p-1.5 space-y-1 max-h-60 overflow-y-auto">
              <div className="px-3 py-1 text-[10px] font-bold text-[#8B9798] uppercase tracking-wider">
                {t('selectLanguage')}
              </div>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left cursor-pointer transition-colors ${
                    language === l.code
                      ? 'bg-[#113235] text-white font-semibold'
                      : 'text-[#192425] hover:bg-[#F3F4F0]'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-bold">{l.nativeLabel}</span>
                    <span className="text-[10px] text-gray-500">{l.label}</span>
                  </div>
                  {language === l.code && <Check className="w-3.5 h-3.5 text-[#E0B45C]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Login Card Center Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Main Card */}
          <div className="bg-white border border-[#E2E6DF] rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-[#0D282A] text-[#E0B45C] shadow-sm mb-1">
                <ShieldCheck className="w-8 h-8 text-[#E0B45C]" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[#113235] font-serif-heading">
                {t('loginTitle')}
              </h1>
              <p className="text-xs text-[#5C6768]">
                {t('loginSubtitle')}
              </p>
            </div>

            {/* Error & Success Messages */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#192425]">
                  {t('usernameOrEmail')}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8B9798] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t('usernamePlaceholder')}
                    className="saas-input w-full pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#192425]">
                  {t('password')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8B9798] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('passwordPlaceholder')}
                    className="saas-input w-full pl-9 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B9798] hover:text-[#192425] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-[#5C6768] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#E2E6DF] text-[#113235] focus:ring-[#113235]"
                  />
                  <span>{t('rememberMe')}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-semibold text-[#113235] hover:text-[#C99738] transition-colors cursor-pointer"
                >
                  {t('forgotPassword')}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-teal w-full py-3 text-sm cursor-pointer"
              >
                {isLoading ? t('signingIn') : t('loginButton')}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {/* Quick Demo Logins */}
            <div className="pt-2 border-t border-[#E2E6DF] space-y-2">
              <p className="text-[11px] font-bold text-[#8B9798] text-center uppercase tracking-wider">
                {t('demoLoginsTitle')}
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('MANUFACTURER')}
                  className="p-2.5 rounded-xl border border-[#E2E6DF] hover:border-[#113235] bg-[#F7F8F5] hover:bg-white text-center transition-all cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-[#C99738] mx-auto mb-1" />
                  <span className="block text-[10px] font-bold text-[#113235] truncate">
                    {t('demoManufacturer')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('ADMIN')}
                  className="p-2.5 rounded-xl border border-[#E2E6DF] hover:border-[#113235] bg-[#F7F8F5] hover:bg-white text-center transition-all cursor-pointer"
                >
                  <Award className="w-4 h-4 text-[#113235] mx-auto mb-1" />
                  <span className="block text-[10px] font-bold text-[#113235] truncate">
                    {t('demoAdmin')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('CONSUMER')}
                  className="p-2.5 rounded-xl border border-[#E2E6DF] hover:border-[#113235] bg-[#F7F8F5] hover:bg-white text-center transition-all cursor-pointer"
                >
                  <Users className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <span className="block text-[10px] font-bold text-[#113235] truncate">
                    {t('demoConsumer')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E2E6DF] rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#113235]">
              {t('forgotModalTitle')}
            </h3>
            <p className="text-xs text-[#5C6768]">
              {t('forgotModalDesc')}
            </p>

            {forgotSubmitted ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs space-y-2">
                <p className="font-semibold">Reset link dispatched!</p>
                <p className="text-[11px]">Check your inbox for OTP instructions to reset your account password.</p>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSubmitted(false);
                    setForgotEmail('');
                  }}
                  className="btn-teal w-full text-xs py-2 mt-2"
                >
                  {t('close')}
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setForgotSubmitted(true); }} className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="saas-input w-full"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="btn-outline flex-1 text-xs py-2"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="btn-teal flex-1 text-xs py-2"
                  >
                    {t('sendResetLink')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Bottom Footer Note */}
      <footer className="py-4 text-center text-xs text-[#8B9798] border-t border-[#E2E6DF] bg-white">
        {t('poweredBy')}
      </footer>
    </div>
  );
};
