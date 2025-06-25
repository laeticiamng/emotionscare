
import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BreadcrumbNav from './BreadcrumbNav';
import { preloadCriticalResources } from '@/utils/performanceOptimizer';

const OptimizedLayout: React.FC = () => {
  React.useEffect(() => {
    // Préchargement des ressources critiques
    try {
      preloadCriticalResources();
    } catch (error) {
      console.log('Preload resources failed:', error);
    }
    
    // Optimisation des polices
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        console.log('✅ Fonts loaded');
      }).catch(() => {
        console.log('Fonts loading failed');
      });
    }
  }, []);

  return (
    <>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//api.emotionscare.com" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <BreadcrumbNav />
          
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default OptimizedLayout;
