
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { MusicProvider } from './contexts/music/MusicContext';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import { StorytellingProvider } from './contexts/StorytellingContext';
import ImmersiveHome from './pages/ImmersiveHome';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MusicProvider>
          <StorytellingProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<Home />} />
              <Route path="/immersive" element={<ImmersiveHome />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Toaster />
          </StorytellingProvider>
        </MusicProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
