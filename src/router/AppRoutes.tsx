
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NotFoundPage from '@/pages/NotFoundPage';
import LandingPage from '@/pages/LandingPage';
import ChooseModeV2 from '@/pages/common/ChooseModeV2';
import ProtectedRouteWithMode from '@/components/ProtectedRouteWithMode';
import ProtectedRoute from '@/components/ProtectedRoute';

// Layouts
import B2CLayout from '@/layouts/B2CLayout';
import B2BUserLayout from '@/layouts/B2BUserLayout';
import B2BAdminLayout from '@/layouts/B2BAdminLayout';

// Pages communes
import LoginPage from '@/pages/common/Login';

// Pages B2C
import B2CDashboard from '@/pages/b2c/DashboardPage';

// Pages B2B User
import B2BUserDashboard from '@/pages/b2b/user/Dashboard';

// Pages B2B Admin
import B2BAdminDashboard from '@/pages/b2b/admin/Dashboard';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Pages publiques */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/choose-mode" element={<ChooseModeV2 />} />
      
      {/* Routes d'authentification */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/b2c/login" element={<LoginPage />} />
      <Route path="/b2b/user/login" element={<LoginPage />} />
      <Route path="/b2b/admin/login" element={<LoginPage />} />
      
      {/* Routes B2C */}
      <Route path="/b2c" element={<B2CLayout />}>
        <Route path="dashboard" element={<B2CDashboard />} />
        <Route index element={<B2CDashboard />} />
      </Route>
      
      {/* Routes B2B User */}
      <Route path="/b2b/user" element={<B2BUserLayout />}>
        <Route path="dashboard" element={<B2BUserDashboard />} />
        <Route index element={<B2BUserDashboard />} />
      </Route>
      
      {/* Routes B2B Admin */}
      <Route path="/b2b/admin" element={<B2BAdminLayout />}>
        <Route path="dashboard" element={<B2BAdminDashboard />} />
        <Route index element={<B2BAdminDashboard />} />
      </Route>
      
      {/* Routes protégées avec mode utilisateur */}
      <Route path="/protected">
        <Route path="b2c" element={
          <ProtectedRouteWithMode requiredMode="b2c">
            <B2CLayout />
          </ProtectedRouteWithMode>
        }>
          <Route index element={<B2CDashboard />} />
        </Route>
        
        <Route path="b2b/user" element={
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <B2BUserLayout />
          </ProtectedRouteWithMode>
        }>
          <Route index element={<B2BUserDashboard />} />
        </Route>
        
        <Route path="b2b/admin" element={
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <B2BAdminLayout />
          </ProtectedRouteWithMode>
        }>
          <Route index element={<B2BAdminDashboard />} />
        </Route>
      </Route>
      
      {/* Page 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
