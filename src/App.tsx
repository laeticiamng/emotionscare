
import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ErrorBoundary } from '@/components/ErrorBoundary';

console.log('🚀 App component rendering - VERSION DEBUG ULTRA-SIMPLE...');

// Fallback d'erreur simple
const ErrorFallback = ({ error }: { error: Error }) => (
  <div style={{color:'red', padding:20, fontSize:20}}>
    <h2>❌ Erreur détectée :</h2>
    <pre style={{fontSize:14, background:'#fee', padding:10}}>
      {error.message}
    </pre>
    <button onClick={() => window.location.reload()}>
      Recharger la page
    </button>
  </div>
);

// Loader simple
const SimpleLoader = () => (
  <div style={{
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '100vh',
    fontSize: '20px',
    color: 'blue'
  }}>
    🔄 Chargement de l'application...
  </div>
);

function App() {
  console.log('🚀 App function called');
  
  React.useEffect(() => {
    console.log('🚀 App mounted - VERSION ULTRA-SIMPLE');
    console.log('🚀 Current location:', window.location.href);
    console.log('🚀 Router object:', router);
    return () => console.log('🚀 App unmounted');
  }, []);

  return (
    <ErrorBoundary fallback={<ErrorFallback error={new Error('Erreur inconnue')} />}>
      <Suspense fallback={<SimpleLoader />}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
