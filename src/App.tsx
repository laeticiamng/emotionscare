
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import { DEFAULT_THEME } from './constants/defaults';
import NotFoundPage from './pages/NotFoundPage';
import { useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
