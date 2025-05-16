
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { MusicProvider } from '@/contexts/music/MusicContext';
import { DEFAULT_THEME } from './constants/defaults';

const App = () => {
  // Apply default theme and load preferences from localStorage
  useEffect(() => {
    const theme = localStorage.getItem('theme') || DEFAULT_THEME;
    const root = window.document.documentElement;

    // Remove all theme classes
    root.classList.remove('light', 'dark', 'system', 'pastel');
    // Add current theme class
    root.classList.add(theme);
  }, []);

  return (
    <>
      <MusicProvider>
        <Outlet />
      </MusicProvider>

      {/* UI Notifications */}
      <Toaster />
      <SonnerToaster position="bottom-right" expand={true} richColors />
    </>
  );
};

export default App;
