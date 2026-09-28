import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, Award, Building2, GraduationCap, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register, demoLogin } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState<UserRole>('CONSUMER');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ name, email, mobile, password, role });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (targetRole: UserRole) => {
    setError(null);
    setLoading(true);
    try {
      await demoLogin(targetRole);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/50 overflow-hidden text-[#1F2937]">
        {/* Header */}
        <div className="bg-[#FAFAF8] p-6 relative border-b border-[#E5C066]/30">
          <button 
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 text-[#6B7280] hover:text-[#111827] rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-xs"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #996515)' }}
            >
              <Award className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-lg text-[#111827]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              SolveX Portal
            </span>
          </div>

          <h3 className="text-xl font-bold text-[#111827]">
            {mode === 'login' ? 'Sign In to Your Workspace' : 'Create an Account'}
          </h3>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Indian Standards &amp; BIS Compliance Assistant
          </p>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-[#374151] mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAFAF8] border border-gray-200 rounded-xl text-[#111827] placeholder-[#9CA3AF] focus:border-[#C9A227] focus:bg-white outline-none shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#374151] mb-1">Select Persona / Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-gray-200 rounded-xl text-[#111827] focus:border-[#C9A227] focus:bg-white outline-none font-medium shadow-2xs"
                  >
                    <option value="CONSUMER">Consumer (Product verification & guidance)</option>
                    <option value="MANUFACTURER">Manufacturer / MSME (Testing & Certification)</option>
                    <option value="STUDENT">Student / Professional (Standards & clauses)</option>
                    <option value="ADMIN">Admin / Officer (System management)</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.in"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAFAF8] border border-gray-200 rounded-xl text-[#111827] placeholder-[#9CA3AF] focus:border-[#C9A227] focus:bg-white outline-none shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAFAF8] border border-gray-200 rounded-xl text-[#111827] placeholder-[#9CA3AF] focus:border-[#C9A227] focus:bg-white outline-none shadow-2xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 btn-primary justify-center text-xs font-bold disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle between login & register */}
          <div className="text-center text-xs text-[#6B7280] pt-1">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button onClick={() => setMode('register')} className="text-[#996515] font-bold hover:underline cursor-pointer">
                  Register here
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="text-[#996515] font-bold hover:underline cursor-pointer">
                  Sign In
                </button>
              </span>
            )}
          </div>

          {/* One-Click Demo Personas */}
          <div className="pt-3 border-t border-gray-100">
            <div className="text-[11px] font-bold text-[#996515] uppercase tracking-wider text-center mb-2.5">
              ⚡ Instant 1-Click Demo Personas
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemo('MANUFACTURER')}
                className="p-2.5 rounded-xl border border-[#D4AF37]/35 bg-[#FAFAF8] hover:bg-[#FEF9C3]/50 text-left transition-all cursor-pointer shadow-2xs"
              >
                <div className="text-xs font-bold text-[#111827]">MSME Manufacturer</div>
                <div className="text-[10px] text-[#6B7280]">Roadmap & Testing</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemo('CONSUMER')}
                className="p-2.5 rounded-xl border border-[#D4AF37]/35 bg-[#FAFAF8] hover:bg-[#FEF9C3]/50 text-left transition-all cursor-pointer shadow-2xs"
              >
                <div className="text-xs font-bold text-[#111827]">Consumer</div>
                <div className="text-[10px] text-[#6B7280]">Product Guidance</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemo('STUDENT')}
                className="p-2.5 rounded-xl border border-[#D4AF37]/35 bg-[#FAFAF8] hover:bg-[#FEF9C3]/50 text-left transition-all cursor-pointer shadow-2xs"
              >
                <div className="text-xs font-bold text-[#111827]">Student / Academic</div>
                <div className="text-[10px] text-[#6B7280]">Standards Research</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemo('ADMIN')}
                className="p-2.5 rounded-xl border border-[#D4AF37]/35 bg-[#FAFAF8] hover:bg-[#FEF9C3]/50 text-left transition-all cursor-pointer shadow-2xs"
              >
                <div className="text-xs font-bold text-[#111827]">BIS Officer</div>
                <div className="text-[10px] text-[#6B7280]">System Command</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
