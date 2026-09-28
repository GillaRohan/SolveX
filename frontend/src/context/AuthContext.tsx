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
  login: (email: string, pass: string, rememberMe?: boolean) => Promise<void>;
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const savedRole = (localStorage.getItem('solvex_demo_role') as UserRole) || 'CONSUMER';
    const isAuthSaved = localStorage.getItem('solvex_authenticated') === 'true' || !!localStorage.getItem('solvex_token');
    setRole(savedRole);

    const checkAuth = async () => {
      const storedToken = localStorage.getItem('solvex_token');
      if (storedToken) {
        try {
          const res = await api.getMe();
          if (res.user) {
            setUser(res.user);
            setRole(res.user.role);
            setIsAuthenticated(true);
          } else {
            setUser(createDemoUserData(savedRole));
            setIsAuthenticated(true);
          }
        } catch (e) {
          console.warn('Token check failed, using session auth if set');
          if (isAuthSaved) {
            setUser(createDemoUserData(savedRole));
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        }
      } else if (isAuthSaved) {
        setUser(createDemoUserData(savedRole));
        setIsAuthenticated(true);
      } else {
        // Default to logged in as demo consumer for initial pleasant experience if not explicitly logged out
        const hasLoggedOut = localStorage.getItem('solvex_has_logged_out') === 'true';
        if (!hasLoggedOut) {
          setUser(createDemoUserData(savedRole));
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [token]);

  const createDemoUserData = (targetRole: UserRole): User => {
    const names: Record<UserRole, string> = {
      CONSUMER: 'Priya Sharma (Consumer)',
      MANUFACTURER: 'Rajesh Verma (AeroTech MSME)',
      STUDENT: 'Ananya Deshmukh (IIT Roorkee)',
      ADMIN: 'Dr. A. K. Sundaram (Director - BIS Technical Cell)'
    };
    return {
      id: `demo-${targetRole.toLowerCase()}`,
      name: names[targetRole] || 'Verified User',
      email: `${targetRole.toLowerCase()}@solvex.in`,
      role: targetRole,
      language: 'en'
    };
  };

  const login = async (email: string, pass: string, rememberMe = true) => {
    try {
      const res = await api.login(email, pass);
      if (res?.token && res?.user) {
        setToken(res.token);
        setUser(res.user);
        setRole(res.user.role);
        if (rememberMe) {
          localStorage.setItem('solvex_token', res.token);
          localStorage.setItem('solvex_demo_role', res.user.role);
          localStorage.setItem('solvex_authenticated', 'true');
        }
      } else {
        // Demo fallback
        const detectedRole: UserRole = email.toLowerCase().includes('admin')
          ? 'ADMIN'
          : email.toLowerCase().includes('manuf') || email.toLowerCase().includes('msme')
          ? 'MANUFACTURER'
          : email.toLowerCase().includes('student') || email.toLowerCase().includes('edu')
          ? 'STUDENT'
          : 'CONSUMER';
        const demoUser = {
          ...createDemoUserData(detectedRole),
          email: email,
          name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        };
        setUser(demoUser);
        setRole(detectedRole);
        localStorage.setItem('solvex_demo_role', detectedRole);
        localStorage.setItem('solvex_authenticated', 'true');
      }
    } catch (e) {
      // Graceful fallback for demo auth if backend offline
      const detectedRole: UserRole = email.toLowerCase().includes('admin')
        ? 'ADMIN'
        : email.toLowerCase().includes('manuf') || email.toLowerCase().includes('msme')
        ? 'MANUFACTURER'
        : email.toLowerCase().includes('student') || email.toLowerCase().includes('edu')
        ? 'STUDENT'
        : 'CONSUMER';
      const demoUser = {
        ...createDemoUserData(detectedRole),
        email: email,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      };
      setUser(demoUser);
      setRole(detectedRole);
      localStorage.setItem('solvex_demo_role', detectedRole);
      localStorage.setItem('solvex_authenticated', 'true');
    }
    localStorage.removeItem('solvex_has_logged_out');
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  const register = async (data: any) => {
    try {
      const res = await api.register(data);
      if (res?.token && res?.user) {
        setToken(res.token);
        setUser(res.user);
        setRole(res.user.role);
        localStorage.setItem('solvex_token', res.token);
        localStorage.setItem('solvex_demo_role', res.user.role);
      } else {
        const newUser: User = {
          id: `u-${Date.now()}`,
          name: data.name || 'New User',
          email: data.email,
          role: data.role || 'CONSUMER',
          language: 'en'
        };
        setUser(newUser);
        setRole(data.role || 'CONSUMER');
        localStorage.setItem('solvex_demo_role', data.role || 'CONSUMER');
      }
    } catch (e) {
      const newUser: User = {
        id: `u-${Date.now()}`,
        name: data.name || 'New User',
        email: data.email,
        role: data.role || 'CONSUMER',
        language: 'en'
      };
      setUser(newUser);
      setRole(data.role || 'CONSUMER');
      localStorage.setItem('solvex_demo_role', data.role || 'CONSUMER');
    }
    localStorage.setItem('solvex_authenticated', 'true');
    localStorage.removeItem('solvex_has_logged_out');
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  const demoLogin = async (targetRole: UserRole) => {
    try {
      const res = await api.demoLogin(targetRole);
      if (res?.token && res?.user) {
        setToken(res.token);
        setUser(res.user);
        setRole(res.user.role);
        localStorage.setItem('solvex_token', res.token);
      } else {
        setUser(createDemoUserData(targetRole));
        setRole(targetRole);
      }
    } catch (e) {
      setUser(createDemoUserData(targetRole));
      setRole(targetRole);
    }
    localStorage.setItem('solvex_demo_role', targetRole);
    localStorage.setItem('solvex_authenticated', 'true');
    localStorage.removeItem('solvex_has_logged_out');
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  const switchRole = (newRole: UserRole) => {
    setUser(createDemoUserData(newRole));
    setRole(newRole);
    localStorage.setItem('solvex_demo_role', newRole);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('solvex_token');
    localStorage.removeItem('solvex_authenticated');
    localStorage.setItem('solvex_has_logged_out', 'true');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated,
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
