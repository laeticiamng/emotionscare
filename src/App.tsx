
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AudioProvider } from '@/contexts/AudioContext';
import { Toaster } from '@/components/ui/toaster';
import ImmersiveHome from '@/pages/ImmersiveHome';

// Chargement paresseux pour optimiser le bundle
const Home = React.lazy(() => import('@/pages/Home'));

function App() {
  return (
    <ThemeProvider>
      <AudioProvider>
        <Router>
          <React.Suspense fallback={<div>Chargement...</div>}>
            <Routes>
              <Route path="/" element={<ImmersiveHome />} />
              <Route path="/home" element={<Home />} />
              {/* Autres routes à ajouter ici */}
            </Routes>
          </React.Suspense>
        </Router>
        <Toaster />
      </AudioProvider>
    </ThemeProvider>
  );
}

export default App;
