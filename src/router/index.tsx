
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NotFoundPage from '@/pages/NotFoundPage';
import LandingPage from '@/pages/LandingPage';

// Login pages
import LoginPage from '@/pages/common/Login';
import RegisterPage from '@/pages/common/Register';
import B2BSelectionPage from '@/pages/B2BSelectionPage';

// B2C pages
import B2CLayout from '@/layouts/B2CLayout';
import B2CDashboard from '@/pages/b2c/Dashboard';
import B2CGamificationPage from '@/pages/b2c/Gamification';

// B2B User pages
import B2BUserLayout from '@/layouts/B2BUserLayout';
import B2BUserDashboard from '@/pages/b2b/user/Dashboard';
import B2BUserGamificationPage from '@/pages/b2b/user/Gamification';

// B2B Admin pages
import B2BAdminLayout from '@/layouts/B2BAdminLayout';
import B2BAdminDashboard from '@/pages/b2b/admin/Dashboard';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root route - Landing page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Auth routes */}
      <Route path="/b2c/login" element={<LoginPage />} />
      <Route path="/b2b/user/login" element={<LoginPage />} />
      <Route path="/b2b/admin/login" element={<LoginPage />} />
      <Route path="/b2c/register" element={<RegisterPage />} />
      <Route path="/b2b/selection" element={<B2BSelectionPage />} />

      {/* B2C Routes */}
      <Route path="/b2c" element={<B2CLayout />}>
        <Route path="dashboard" element={<B2CDashboard />} />
        <Route path="gamification" element={<B2CGamificationPage />} />
      </Route>

      {/* B2B User Routes */}
      <Route path="/b2b/user" element={<B2BUserLayout />}>
        <Route path="dashboard" element={<B2BUserDashboard />} />
        <Route path="gamification" element={<B2BUserGamificationPage />} />
      </Route>

      {/* B2B Admin Routes */}
      <Route path="/b2b/admin" element={<B2BAdminLayout />}>
        <Route path="dashboard" element={<B2BAdminDashboard />} />
      </Route>
      
      {/* Catch all - 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
