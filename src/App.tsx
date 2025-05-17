
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AudioProvider } from '@/contexts/AudioContext';
import { Toaster } from '@/components/ui/sonner';
import { routes } from './router';

function App() {
  const routeElement = useRoutes(routes);

  return (
    <ThemeProvider>
      <AudioProvider>
        <React.Suspense fallback={<div>Chargement...</div>}>
          {routeElement}
        </React.Suspense>
        <Toaster />
      </AudioProvider>
    </ThemeProvider>
  );
}

export default App;
