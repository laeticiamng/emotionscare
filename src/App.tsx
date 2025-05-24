
import React, { Suspense } from 'react';
import AppProviders from '@/providers/AppProviders';
import AppRouter from '@/AppRouter';
import LoadingAnimation from '@/components/ui/loading-animation';

function App() {
  return (
    <AppProviders>
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center">
          <LoadingAnimation text="Chargement de l'application..." />
        </div>
      }>
        <AppRouter />
      </Suspense>
    </AppProviders>
  );
}

export default App;
