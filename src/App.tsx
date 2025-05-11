
import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
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
    </Routes>
  );
};

export default App;
