import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  demoLogin: (role: UserRole) => Promise<void>;
  switchRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('CONSUMER');
  const [token, setToken] = useState<string | null>(localStorage.getItem('solvex_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const savedRole = (localStorage.getItem('solvex_demo_role') as UserRole) || 'CONSUMER';
    setRole(savedRole);

    const checkAuth = async () => {
      if (token) {
        try {
          const res = await api.getMe();
          if (res.user) {
            setUser(res.user);
            setRole(res.user.role);
          }
        } catch (e) {
          console.warn('Token verification failed, using demo session');
          setDemoUser(savedRole);
        }
      } else {
        setDemoUser(savedRole);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [token]);

  const setDemoUser = (targetRole: UserRole) => {
    const names: Record<UserRole, string> = {
      CONSUMER: 'Priya Sharma (Consumer)',
      MANUFACTURER: 'Rajesh Verma (AeroTech Appliances MSME)',
      STUDENT: 'Ananya Deshmukh (IIT Roorkee)',
      ADMIN: 'Dr. A. K. Sundaram (Director - BIS Technical Cell)'
    };
    setUser({
      id: `demo-${targetRole.toLowerCase()}`,
      name: names[targetRole],
      email: `${targetRole.toLowerCase()}@solvex.in`,
      role: targetRole,
      language: 'en'
    });
    setRole(targetRole);
    localStorage.setItem('solvex_demo_role', targetRole);
  };

  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    setToken(res.token);
    setUser(res.user);
    setRole(res.user.role);
    localStorage.setItem('solvex_token', res.token);
    localStorage.setItem('solvex_demo_role', res.user.role);
    setIsAuthModalOpen(false);
  };

  const register = async (data: any) => {
    const res = await api.register(data);
    setToken(res.token);
    setUser(res.user);
    setRole(res.user.role);
    localStorage.setItem('solvex_token', res.token);
    localStorage.setItem('solvex_demo_role', res.user.role);
    setIsAuthModalOpen(false);
  };

  const demoLogin = async (targetRole: UserRole) => {
    try {
      const res = await api.demoLogin(targetRole);
      setToken(res.token);
      setUser(res.user);
      setRole(res.user.role);
      localStorage.setItem('solvex_token', res.token);
      localStorage.setItem('solvex_demo_role', res.user.role);
    } catch (e) {
      // Fallback
      setDemoUser(targetRole);
    }
    setIsAuthModalOpen(false);
  };

  const switchRole = (newRole: UserRole) => {
    setDemoUser(newRole);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('solvex_token');
    setDemoUser('CONSUMER');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        login,
        register,
        demoLogin,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
