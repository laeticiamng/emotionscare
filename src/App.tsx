
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { MusicProvider } from './contexts/music/MusicContext';
import SessionTimeoutAlert from './components/SessionTimeoutAlert';

function App() {
  return (
    <ThemeProvider>
      <MusicProvider>
        <SessionTimeoutAlert />
        <Outlet />
        <Toaster position="top-right" />
      </MusicProvider>
    </ThemeProvider>
  );
}

export default App;
