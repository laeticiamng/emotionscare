
import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { UniversalErrorBoundary } from '@/components/ErrorBoundary/UniversalErrorBoundary';

console.log('🚀 App component rendering - VERSION UNIFIÉE ROUTER AVEC PROVIDERS...');

// Loader avec data-testid pour les tests
const UniversalLoader = () => (
  <div 
    data-testid="page-loading" 
    className="min-h-screen bg-background flex items-center justify-center"
  >
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p className="text-lg font-medium">Chargement EmotionsCare...</p>
      <p className="text-sm text-muted-foreground">Initialisation du router unifié</p>
    </div>
  </div>
);

function App() {
  console.log('🚀 App function called - Router unifié avec providers');
  
  React.useEffect(() => {
    console.log('🚀 App mounted - VERSION ROUTER UNIFIÉ AVEC PROVIDERS');
    console.log('🚀 Current location:', window.location.href);
    console.log('🚀 Router object:', router);
    
    // Log de navigation pour debug
    const handleRouteChange = () => {
      console.info('%c[Route] mounted', 'color:lime', window.location.pathname);
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
        <RouterProvider router={router} />
      </Suspense>
    </UniversalErrorBoundary>
  );
}

export default App;
