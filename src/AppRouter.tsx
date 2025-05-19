
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import B2CPage from './pages/b2c/Home';
import B2BSelectionPage from './pages/b2b/Selection';
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

// B2B Components page component
const B2BComponentsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">B2B Components</h1>
      <p className="mb-4">This page showcases B2B components for the application.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example component cards would go here */}
        <div className="border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-medium">Component 1</h3>
          <p className="text-muted-foreground">Description of component 1</p>
        </div>
        <div className="border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-medium">Component 2</h3>
          <p className="text-muted-foreground">Description of component 2</p>
        </div>
        <div className="border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-medium">Component 3</h3>
          <p className="text-muted-foreground">Description of component 3</p>
        </div>
      </div>
    </div>
  );
};

export default AppRouter;
