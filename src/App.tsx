
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { MusicProvider } from './contexts/music/MusicContextProvider';
import { SessionProvider } from './contexts/SessionContext';
import { ThemeProvider } from './contexts/theme';

function App() {
  return (
    <ThemeProvider>
      <SessionProvider>
        <MusicProvider>
          <div className="min-h-screen bg-background">
            <Outlet />
            <Toaster position="top-right" />
          </div>
        </MusicProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

export default App;
