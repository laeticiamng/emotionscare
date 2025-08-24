import React from 'react';
import { Outlet } from 'react-router-dom';
import GlobalNavigation from '@/components/navigation/GlobalNavigation';
import BreadcrumbNavigation from '@/components/navigation/BreadcrumbNavigation';
import QuickAccessPanel from '@/components/navigation/QuickAccessPanel';
import SkipToContent from '@/components/accessibility/SkipToContent';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Skip to content pour l'accessibilité */}
      <SkipToContent />
      
      {/* Navigation globale (menu hamburger) */}
      <GlobalNavigation />
      
      {/* Fil d'Ariane */}
      <BreadcrumbNavigation />
      
      {/* Contenu principal */}
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      
      {/* Panneau d'accès rapide */}
      <QuickAccessPanel />
    </div>
  );
};

export default MainLayout;