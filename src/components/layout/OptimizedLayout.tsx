
import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BreadcrumbNav from './BreadcrumbNav';

const OptimizedLayout: React.FC = () => {
  React.useEffect(() => {
    console.log('✅ OptimizedLayout mounted');
    
    // Optimisation des polices avec protection renforcée
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      try {
        if ('fonts' in document && document.fonts) {
          document.fonts.ready.then(() => {
            console.log('✅ Fonts loaded successfully');
          }).catch((error) => {
            console.log('⚠️ Fonts loading failed:', error);
          });
        }
      } catch (error) {
        console.log('⚠️ Font loading setup failed:', error);
      }
    }

    // Nettoyage sécurisé des ressources
    return () => {
      try {
        console.log('🧹 OptimizedLayout unmounting');
      } catch (error) {
        console.log('⚠️ Cleanup failed:', error);
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
