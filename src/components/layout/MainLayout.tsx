import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import GlobalNavigation from '@/components/navigation/GlobalNavigation';
import BreadcrumbNavigation from '@/components/navigation/BreadcrumbNavigation';
import QuickAccessPanel from '@/components/navigation/QuickAccessPanel';
import FloatingQuickActions from '@/components/navigation/FloatingQuickActions';
import MainNavigationMenu from '@/components/navigation/MainNavigationMenu';
import UnifiedHeader from '@/components/unified/UnifiedHeader';
import SkipToContent from '@/components/accessibility/SkipToContent';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to content pour l'accessibilité */}
      <SkipToContent />
      
      {/* Header unifié */}
      <UnifiedHeader onMenuToggle={toggleSidebar} />
      
      {/* Navigation principale (sidebar) */}
      <MainNavigationMenu isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* Navigation globale (menu hamburger) */}
      <GlobalNavigation />
      
      {/* Fil d'Ariane */}
      <BreadcrumbNavigation />
      
      {/* Contenu principal */}
      <main 
        id="main-content" 
        className="flex-1 pt-16 transition-all duration-200"
        style={{ marginLeft: sidebarOpen ? '0' : '0' }}
      >
        <Outlet />
      </main>
      
      {/* Panneaux d'accès rapide */}
      <QuickAccessPanel />
      <FloatingQuickActions />
    </div>
  );
};

export default MainLayout;