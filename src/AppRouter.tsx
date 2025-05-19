
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import B2CPage from './pages/b2c/Home';
import B2BSelectionPage from './pages/b2b/Selection';
import B2BComponentsPage from './pages/b2b/Components';
import Index from './pages/Index';
import ImmersiveHome from './pages/ImmersiveHome';
import ChooseMode from './pages/common/ChooseMode';
import PageNotFound from './pages/errors/PageNotFound';
import { useUserMode } from './contexts/UserModeContext';

const AppRouter: React.FC = () => {
  const { userMode, isLoading } = useUserMode();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImmersiveHome />} />
        <Route path="/old-home" element={<Index />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/b2c" element={<B2CPage />} />
        <Route path="/b2b/selection" element={<B2BSelectionPage />} />
        <Route path="/b2b/components" element={<B2BComponentsPage />} />
        <Route path="/choose-mode" element={<ChooseMode />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
