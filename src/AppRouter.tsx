
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import B2CPage from './pages/b2c/Home';
import B2BSelectionPage from './pages/b2b/Selection';
import B2BSelectionPremium from './pages/common/B2BSelectionPremium';
import Index from './pages/Index';
import ImmersiveHome from './pages/ImmersiveHome';
import ChooseMode from './pages/common/ChooseMode';
import PageNotFound from './pages/errors/PageNotFound';
import { useUserMode } from './contexts/UserModeContext';
import B2BUserPremiumLogin from './pages/b2b/user/PremiumLogin';
import B2BAdminPremiumLogin from './pages/b2b/admin/PremiumLogin';
import B2BUserPremiumDashboard from './pages/b2b/user/PremiumDashboard';
import B2CLoginPage from './pages/b2c/Login';
import B2CRegisterPage from './pages/b2c/Register';
import B2CForgotPasswordPage from './pages/b2c/ForgotPasswordPage';
import PostLoginTransition from './components/auth/PostLoginTransition';

const AppRouter: React.FC = () => {
  const { userMode, isLoading } = useUserMode();
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="mt-2 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }
  
  return (
    <Router>
      <Routes>
        {/* Page d'accueil immersive (nouvelle version premium) */}
        <Route path="/" element={<ImmersiveHome />} />
        
        {/* Pages publiques */}
        <Route path="/old-home" element={<Index />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/b2c" element={<B2CPage />} />
        <Route path="/b2b/selection" element={<B2BSelectionPremium />} />
        <Route path="/choose-mode" element={<ChooseMode />} />
        
        {/* Pages B2C */}
        <Route path="/b2c/login" element={<B2CLoginPage />} />
        <Route path="/b2c/register" element={<B2CRegisterPage />} />
        <Route path="/b2c/forgot-password" element={<B2CForgotPasswordPage />} />
        
        {/* Pages B2B avec design premium */}
        <Route path="/b2b/user/login" element={<B2BUserPremiumLogin />} />
        <Route path="/b2b/admin/login" element={<B2BAdminPremiumLogin />} />
        <Route path="/b2b/user/dashboard" element={<B2BUserPremiumDashboard />} />
        
        {/* Autres routes */}
        <Route path="/b2b/components" element={<B2BComponentsPage />} />
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
