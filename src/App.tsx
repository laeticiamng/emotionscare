
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import DashboardPage from '@/pages/DashboardPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import AdminPremiumDashboard from '@/pages/AdminPremiumDashboard';
import OrganizationPage from '@/pages/admin/OrganizationPage';
import PredictiveBurnoutPage from '@/pages/admin/PredictiveBurnoutPage';
import CustomReportsPage from '@/pages/admin/CustomReportsPage';
import BusinessPage from '@/pages/BusinessPage';
import LoginPage from '@/pages/LoginPage';
import PredictiveDashboardPage from '@/pages/PredictiveDashboardPage';
import Index from '@/pages/Index';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { UserModeProvider, useUserMode } from '@/contexts/UserModeContext';
import { useToast } from '@/hooks/use-toast';

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userMode, setUserMode } = useUserMode();
  const { toast } = useToast();

  // Debug logging
  useEffect(() => {
    console.log('Current path:', location.pathname);
    console.log('Current user mode:', userMode);
  }, [location.pathname, userMode]);

  return (
    <Routes>
      {/* Route d'index explicite */}
      <Route path="/" element={<Index />} />
      
      {/* Autres routes publiques */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/index" element={<Index />} />
      <Route path="/business" element={<BusinessPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin-login" element={<LoginPage />} />
      
      {/* Routes protégées - l'utilisateur doit être connecté pour y accéder */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Routes utilisateur B2C */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/predictive" element={<PredictiveDashboardPage />} />
          
          {/* Routes admin B2B */}
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/premium" element={<AdminPremiumDashboard />} />
          <Route path="/admin/organization" element={<OrganizationPage />} />
          <Route path="/admin/burnout" element={<PredictiveBurnoutPage />} />
          <Route path="/admin/reports" element={<CustomReportsPage />} />
        </Route>
      </Route>

      {/* Route par défaut pour les chemins non correspondants */}
      <Route path="*" element={<Index />} />
    </Routes>
  );
};

const App: React.FC = () => {
  console.log('App component rendering');
  
  return (
    <UserModeProvider>
      <AppRoutes />
    </UserModeProvider>
  );
};

export default App;
