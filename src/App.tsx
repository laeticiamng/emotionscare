
import React, { Suspense, startTransition } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { UniversalErrorBoundary } from '@/components/ErrorBoundary/UniversalErrorBoundary';

console.log('🚀 App component rendering - VERSION UNIFIÉE CORRIGÉE...');

// Loader optimisé avec transition
const UniversalLoader = () => (
  <div 
    data-testid="page-loading" 
    className="min-h-screen bg-background flex items-center justify-center"
  >
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p className="text-lg font-medium">Chargement EmotionsCare...</p>
      <p className="text-sm text-muted-foreground">Initialisation sécurisée</p>
    </div>
  </div>
);

function App() {
  console.log('🚀 App function called - Router corrigé');
  
  React.useEffect(() => {
    console.log('🚀 App mounted - VERSION CORRIGÉE');
    console.log('🚀 Current location:', window.location.href);
    
    // Utilisation de startTransition pour les changements de route
    const handleRouteChange = () => {
      startTransition(() => {
        console.info('%c[Route] mounted', 'color:lime', window.location.pathname);
      });
    };
    
    window.addEventListener('popstate', handleRouteChange);
    handleRouteChange(); // Log initial
    
    return () => {
      console.log('🚀 App unmounted');
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <UniversalErrorBoundary>
      <Suspense fallback={<UniversalLoader />}>
        <RouterProvider 
          router={router}
          fallbackElement={<UniversalLoader />}
        />
      </Suspense>
    </UniversalErrorBoundary>
  );
}

export default App;
