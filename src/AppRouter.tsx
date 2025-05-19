
import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from './pages/HomePage';
import B2BSelectionPage from './pages/b2b/Selection';
import B2BAdminDashboard from './pages/b2b/admin/Dashboard';
import B2BUserDashboard from './pages/b2b/user/Dashboard';
import B2CPage from './pages/b2c/Home';
import B2CLoginPage from './pages/b2c/Login';
import B2CRegisterPage from './pages/b2c/Register';
import B2CForgotPasswordPage from './pages/b2c/ForgotPassword';
import B2CResetPasswordPage from './pages/b2c/ResetPassword';
import ProfilePage from './pages/Profile';
import Unauthorized from './pages/common/Unauthorized';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/b2b/selection" element={<B2BSelectionPage />} />
      <Route path="/b2b/admin/dashboard" element={<B2BAdminDashboard />} />
      <Route path="/b2b/user/dashboard" element={<B2BUserDashboard />} />
      <Route path="/b2c" element={<B2CPage />} />
      <Route path="/b2c/login" element={<B2CLoginPage />} />
      <Route path="/b2c/register" element={<B2CRegisterPage />} />
      <Route path="/b2c/forgot-password" element={<B2CForgotPasswordPage />} />
      <Route path="/b2c/reset-password" element={<B2CResetPasswordPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
