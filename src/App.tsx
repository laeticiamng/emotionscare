
import React, { Suspense, useEffect } from 'react';
import AppProviders from '@/providers/AppProviders';
import AppRouter from '@/AppRouter';
import LoadingAnimation from '@/components/ui/loading-animation';
import { PerformanceProvider } from '@/components/performance/PerformanceProvider';
import { preloadCriticalChunks } from '@/utils/bundleOptimization';

function App() {
  useEffect(() => {
    // Preload des chunks critiques après le premier render
    const timer = setTimeout(() => {
      preloadCriticalChunks();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <PerformanceProvider>
      <AppProviders>
        <Suspense fallback={
          <div className="flex h-screen items-center justify-center">
            <LoadingAnimation text="Chargement de l'application..." />
          </div>
        }>
          <AppRouter />
        </Suspense>
      </AppProviders>
    </PerformanceProvider>
  );
}

export default App;
