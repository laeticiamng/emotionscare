
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { MusicProvider } from './contexts/music/MusicContext';
import NotFoundPage from './pages/NotFoundPage';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <ThemeProvider>
      <MusicProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster />
      </MusicProvider>
    </ThemeProvider>
  );
};

export default App;
