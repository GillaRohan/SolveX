import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Shell, NavPage } from './components/Shell';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { AuthModal } from './components/AuthModal';
import { FloatingAIAgent } from './components/FloatingAIAgent';

import { Dashboard } from './pages/Dashboard';
import { AIAssistant } from './pages/AIAssistant';
import { ScanProduct } from './pages/ScanProduct';
import { NaturalTerms } from './pages/NaturalTerms';
import { BISInfoHub } from './pages/BISInfoHub';
import { DocumentsHub } from './pages/DocumentsHub';
import { StandardsCatalog } from './pages/StandardsCatalog';
import { LaboratoriesFinder } from './pages/LaboratoriesFinder';
import { ComplianceCenter } from './pages/ComplianceCenter';
import { AlertsUpdates } from './pages/AlertsUpdates';
import { ImpactBenefits } from './pages/ImpactBenefits';
import { Settings } from './pages/Settings';
import { AdminPanel } from './pages/AdminPanel';

export const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<NavPage>('dashboard');
  const [navData, setNavData] = useState<any>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const handleNavigate = (page: NavPage, data?: any) => {
    setCurrentPage(page);
    setNavData(data || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            onNavigateToCompliance={() => handleNavigate('compliance')}
            onNavigateToLabs={() => handleNavigate('laboratories')}
          />
        );
      case 'scan-product':
        return <ScanProduct onNavigate={handleNavigate} />;
      case 'natural-terms':
        return <NaturalTerms onNavigate={handleNavigate} />;
      case 'bis-info':
        return <BISInfoHub onNavigate={handleNavigate} />;
      case 'documents':
        return <DocumentsHub onNavigate={handleNavigate} />;
      case 'standards':
        return (
          <StandardsCatalog 
            onNavigate={handleNavigate}
            initialSearch={navData?.search || ''}
          />
        );
      case 'laboratories':
        return <LaboratoriesFinder />;
      case 'compliance':
        return <ComplianceCenter />;
      case 'alerts':
        return <AlertsUpdates />;
      case 'impact':
        return <ImpactBenefits onNavigate={handleNavigate} />;
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
