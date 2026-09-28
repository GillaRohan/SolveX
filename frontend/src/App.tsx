import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Shell, NavPage } from './components/Shell';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { AuthModal } from './components/AuthModal';
import { FloatingAIAgent } from './components/FloatingAIAgent';

import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { AIAssistant } from './pages/AIAssistant';
import { NaturalTerms } from './pages/NaturalTerms';
import { BISInfoHub } from './pages/BISInfoHub';
import { StandardsCatalog } from './pages/StandardsCatalog';
import { ImpactBenefits } from './pages/ImpactBenefits';
import { LaboratoriesFinder } from './pages/LaboratoriesFinder';
import { DocumentsHub } from './pages/DocumentsHub';
import { Settings } from './pages/Settings';
import { AdminPanel } from './pages/AdminPanel';

export const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<NavPage>('dashboard');
  const [navData, setNavData] = useState<any>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const handleNavigate = (page: NavPage, data?: any) => {
    setCurrentPage(page);
    setNavData(data || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F8F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#113235] border-t-[#C99738] animate-spin" />
          <p className="text-xs font-semibold text-[#113235]">Initializing BIS Compliance Assistant...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, display dedicated Login Page
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => handleNavigate('dashboard')} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard 
            onNavigate={handleNavigate}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          />
        );
      case 'ai-assistant':
        return (
          <AIAssistant 
            initialQuery={navData?.initialQuery}
            onNavigateToStandard={(std) => handleNavigate('standards', { search: std })}
            onNavigateToLabs={() => handleNavigate('laboratories')}
          />
        );
      case 'natural-terms':
        return <NaturalTerms onNavigate={handleNavigate} />;
      case 'bis-info':
        return <BISInfoHub onNavigate={handleNavigate} />;
      case 'standards':
        return (
          <StandardsCatalog 
            onNavigate={handleNavigate}
            initialSearch={navData?.search || ''}
          />
        );
      case 'impact':
        return <ImpactBenefits onNavigate={handleNavigate} />;
      case 'laboratories':
        return <LaboratoriesFinder />;
      case 'documents':
        return <DocumentsHub onNavigate={handleNavigate} />;
      case 'settings':
        return <Settings />;
      case 'admin':
        return <AdminPanel />;
      default:
        return (
          <Dashboard 
            onNavigate={handleNavigate}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          />
        );
    }
  };

  return (
    <Shell 
      currentPage={currentPage} 
      onNavigate={handleNavigate}
      onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
    >
      {renderPage()}

      <VoiceAssistantModal 
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onNavigateToAssistant={(query) => {
          handleNavigate('ai-assistant', { initialQuery: query });
        }}
      />

      {/* Floating AI Agent in Bottom Right */}
      <FloatingAIAgent 
        onOpenFullAssistant={(query) => {
          handleNavigate('ai-assistant', { initialQuery: query });
        }}
        onOpenVoice={() => setIsVoiceModalOpen(true)}
      />

      <AuthModal />
    </Shell>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
