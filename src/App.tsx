
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

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userMode, setUserMode } = useUserMode();

  // Redirect root path to homepage
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/home');
    }
  }, [location.pathname, navigate]);

  // Debug logging
  useEffect(() => {
    console.log('Current path:', location.pathname);
    console.log('Current user mode:', userMode);
  }, [location.pathname, userMode]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/index" element={<Index />} />
      <Route path="/business" element={<BusinessPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin-login" element={<LoginPage />} />
      
      {/* Protected routes - user needs to be logged in to access */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* B2C user routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/predictive" element={<PredictiveDashboardPage />} />
          
          {/* B2B admin routes */}
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/premium" element={<AdminPremiumDashboard />} />
          <Route path="/admin/organization" element={<OrganizationPage />} />
          <Route path="/admin/burnout" element={<PredictiveBurnoutPage />} />
          <Route path="/admin/reports" element={<CustomReportsPage />} />
        </Route>
      </Route>

      {/* Fallback route for unmatched paths */}
      <Route path="*" element={<HomePage />} />
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
