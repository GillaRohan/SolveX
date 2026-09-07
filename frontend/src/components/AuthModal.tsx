import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ShieldCheck, ArrowRight, Award } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0A2540] text-white p-6 relative">
          <button 
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-bis-600 to-cyan-400 flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-lg">SolveX Portal</span>
          </div>

          <h3 className="text-xl font-bold">
            {mode === 'login' ? 'Sign In to Your Workspace' : 'Create an Account'}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Indian Standards & BIS Compliance Assistant
          </p>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-bis-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Persona / Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-bis-600 outline-none bg-white font-medium"
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.in"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-bis-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-bis-600 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-bis-600 hover:bg-bis-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-bis-600/20 disabled:opacity-50"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle between login & register */}
          <div className="text-center text-xs text-slate-500 pt-1">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button onClick={() => setMode('register')} className="text-bis-600 font-bold hover:underline">
                  Register here
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="text-bis-600 font-bold hover:underline">
                  Sign In
                </button>
              </span>
            )}
          </div>

          {/* One-Click Demo Personas */}
          <div className="pt-3 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5">
              Or Explore Instantly with 1-Click Demo
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemo('MANUFACTURER')}
                className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100 text-left transition-colors"
              >
                <div className="text-xs font-bold text-blue-900">MSME Manufacturer</div>
                <div className="text-[10px] text-blue-700">Roadmap & Testing</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemo('CONSUMER')}
                className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 text-left transition-colors"
              >
                <div className="text-xs font-bold text-emerald-900">Consumer</div>
                <div className="text-[10px] text-emerald-700">Product Scanning</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemo('STUDENT')}
                className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100 text-left transition-colors"
              >
                <div className="text-xs font-bold text-amber-900">Student/Researcher</div>
                <div className="text-[10px] text-amber-700">Clauses & Standards</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemo('ADMIN')}
                className="p-2.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100 text-left transition-colors"
              >
                <div className="text-xs font-bold text-purple-900">Admin Command</div>
                <div className="text-[10px] text-purple-700">Analytics & Registry</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
