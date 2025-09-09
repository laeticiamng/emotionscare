
import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BreadcrumbNav from './BreadcrumbNav';
import { logger } from '@/lib/logger';

const OptimizedLayout: React.FC = () => {
  React.useEffect(() => {
    logger.debug('OptimizedLayout mounted', null, 'UI');
    
    // Optimisation des polices avec protection renforcée
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      try {
        if ('fonts' in document && document.fonts) {
          document.fonts.ready.then(() => {
            logger.debug('Fonts loaded successfully', null, 'UI');
          }).catch((error) => {
            logger.warn('Fonts loading failed', error, 'UI');
          });
        }
      } catch (error) {
        logger.warn('Font loading setup failed', error, 'UI');
      }
    }

    // Nettoyage sécurisé des ressources
    return () => {
      try {
        logger.debug('OptimizedLayout unmounting', null, 'UI');
      } catch (error) {
        logger.warn('Cleanup failed', error, 'UI');
      }
    };
  }, []);

  return (
    <>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//yaincoxihiqdksxgrsrk.supabase.co" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="hidden">
          <BreadcrumbNav />
        </div>
        
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          <Outlet />
        </Suspense>
      </div>
    </>
  );
};

export default OptimizedLayout;
