// @ts-nocheck
/**
 * MarketingLayout - Layout partagé pour les pages marketing (hors homepage)
 * Utilise SharedHeader pour éviter la duplication
 */

import React, { lazy, Suspense } from 'react';
import SharedHeader from '@/components/layout/SharedHeader';

const Footer = lazy(() => import('@/components/home/Footer'));

const MarketingLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:outline-none"
      >
        Aller au contenu principal
      </a>

      <SharedHeader />

      <main id="main-content" role="main" className="pt-16">
        {children}
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default MarketingLayout;
