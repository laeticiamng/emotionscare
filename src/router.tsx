
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VRPage from './pages/VRPage';
import ScanPage from './pages/ScanPage';
import Social from './pages/Social';
import DashboardRedirect from './pages/DashboardRedirect';
import ProtectedLayout from './components/ProtectedLayout';
import ProtectedRouteWithMode from './components/ProtectedRouteWithMode';
import ChooseModePage from './pages/ChooseModePage';

// Pages B2C
import B2CDashboard from './pages/b2c/Dashboard';
import B2CLogin from './pages/b2c/Login';
import B2CRegister from './pages/b2c/Register';
import B2CResetPassword from './pages/b2c/ResetPassword';
import B2COnboarding from './pages/b2c/Onboarding';

// Pages B2B User
import B2BUserDashboard from './pages/b2b/user/DashboardPage';
import B2BUserLogin from './pages/b2b/user/Login';
import B2BUserRegister from './pages/b2b/user/Register';

// Pages B2B Admin
import B2BAdminDashboard from './pages/b2b/admin/DashboardPage';
import B2BAdminLogin from './pages/b2b/admin/Login';

// Page de sélection B2B
import B2BSelection from './pages/b2b/Selection';

// Page d'erreur 404
import NotFoundPage from './pages/NotFoundPage';

const AppRouter = () => {
  return (
    <Routes>
      {/* Page d'accueil principale */}
      <Route path="/" element={<HomePage />} />
      
      {/* Redirection dashboard */}
      <Route path="/dashboard" element={<DashboardRedirect />} />
      
      {/* Choix du mode utilisateur */}
      <Route path="/choose-mode" element={<ChooseModePage />} />
      
      {/* Routes B2C */}
      <Route path="/b2c">
        <Route path="login" element={<B2CLogin />} />
        <Route path="register" element={<B2CRegister />} />
        <Route path="reset-password" element={<B2CResetPassword />} />
        <Route path="dashboard" element={
          <ProtectedRouteWithMode requiredMode="b2c" redirectTo="/choose-mode">
            <B2CDashboard />
          </ProtectedRouteWithMode>
        } />
        <Route path="onboarding" element={
          <ProtectedRouteWithMode requiredMode="b2c" redirectTo="/choose-mode">
            <B2COnboarding />
          </ProtectedRouteWithMode>
        } />
        <Route path="scan" element={<ScanPage />} />
        <Route path="vr" element={<VRPage />} />
        <Route path="social" element={<Social />} />
      </Route>
      
      {/* Routes B2B User */}
      <Route path="/b2b/user">
        <Route path="login" element={<B2BUserLogin />} />
        <Route path="register" element={<B2BUserRegister />} />
        <Route path="dashboard" element={
          <ProtectedRouteWithMode requiredMode="b2b_user" redirectTo="/choose-mode">
            <B2BUserDashboard />
          </ProtectedRouteWithMode>
        } />
        <Route path="scan" element={<ScanPage />} />
        <Route path="vr" element={<VRPage />} />
        <Route path="social" element={<Social />} />
      </Route>
      
      {/* Routes B2B Admin */}
      <Route path="/b2b/admin">
        <Route path="login" element={<B2BAdminLogin />} />
        <Route path="dashboard" element={
          <ProtectedRouteWithMode requiredMode="b2b_admin" redirectTo="/choose-mode">
            <B2BAdminDashboard />
          </ProtectedRouteWithMode>
        } />
        <Route path="social" element={<Social />} />
      </Route>
      
      {/* Page de sélection B2B */}
      <Route path="/b2b/selection" element={<B2BSelection />} />
      
      {/* Accès direct aux fonctionnalités principales */}
      <Route path="/scan" element={<ScanPage />} />
      <Route path="/vr" element={<VRPage />} />
      <Route path="/social" element={<Social />} />
      
      {/* Page 404 pour les routes non trouvées */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRouter;
