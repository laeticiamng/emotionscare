import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import DashboardPage from '@/pages/DashboardPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import AdminPremiumDashboard from '@/pages/AdminPremiumDashboard';
import OrganizationPage from '@/pages/admin/OrganizationPage';
import PredictiveBurnoutPage from '@/pages/admin/PredictiveBurnoutPage';
import CustomReportsPage from '@/pages/admin/CustomReportsPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/premium" element={<AdminPremiumDashboard />} />
      <Route path="/admin/organization" element={<OrganizationPage />} />
      <Route path="/admin/burnout" element={<PredictiveBurnoutPage />} />
      <Route path="/admin/reports" element={<CustomReportsPage />} />
      {/* Add additional routes as needed */}
    </Routes>
  );
};

export default App;
