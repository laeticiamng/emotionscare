
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import SessionTimeoutAlert from '@/components/SessionTimeoutAlert';

const App: React.FC = () => {
  useEffect(() => {
    // Preload sound files if needed
    const preloadAudio = new Audio('/sounds/welcome.mp3');
    preloadAudio.preload = 'auto';
  }, []);

  return (
    <>
      <ThemeProvider>
        <Outlet />
        <SessionTimeoutAlert />
      </ThemeProvider>
    </>
  );
};

export default App;
