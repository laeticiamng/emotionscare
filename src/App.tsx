
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import ImmersiveHome from './pages/ImmersiveHome';
import DashboardLayout from './components/DashboardLayout';
import B2CLogin from './pages/b2c/Login';
import B2BUserLogin from './pages/b2b/user/Login';
import B2BAdminLogin from './pages/b2b/admin/Login';
import B2BSelectionPage from './pages/b2b/Selection';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<ImmersiveHome />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      {/* Auth routes */}
      <Route path="/b2c/login" element={<B2CLogin />} />
      <Route path="/b2b/user/login" element={<B2BUserLogin />} />
      <Route path="/b2b/admin/login" element={<B2BAdminLogin />} />
      <Route path="/b2b/selection" element={<B2BSelectionPage />} />
      
      {/* B2C (Individual) Routes */}
      <Route path="/b2c" element={<DashboardLayout />}>
        <Route path="dashboard" element={<div>B2C Dashboard (Espace Particulier)</div>} />
        <Route path="journal" element={<div>B2C Journal Émotionnel (Placeholder)</div>} />
        <Route path="coaching" element={<div>B2C Coaching (Placeholder)</div>} />
        <Route path="socialcocon" element={<div>B2C SocialCocon (Placeholder)</div>} />
      </Route>
      
      {/* B2B User Routes */}
      <Route path="/b2b/user" element={<DashboardLayout />}>
        <Route path="dashboard" element={<div>B2B User Dashboard (Placeholder)</div>} />
        <Route path="sessions" element={<div>B2B User Sessions (Placeholder)</div>} />
        <Route path="resources" element={<div>B2B User Resources (Placeholder)</div>} />
        <Route path="socialcocon" element={<div>B2B User SocialCocon (Placeholder)</div>} />
      </Route>
      
      {/* B2B Admin Routes */}
      <Route path="/b2b/admin" element={<DashboardLayout />}>
        <Route path="dashboard" element={<div>B2B Admin Dashboard (Placeholder)</div>} />
        <Route path="users" element={<div>B2B Admin Users Management (Placeholder)</div>} />
        <Route path="analytics" element={<div>B2B Admin Analytics (Placeholder)</div>} />
        <Route path="settings" element={<div>B2B Admin Settings (Placeholder)</div>} />
      </Route>
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={<div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">404</h1>
          <p className="text-xl mb-6">Page introuvable</p>
          <a href="/" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
            Retour à l'accueil
          </a>
        </div>
      </div>} />
    </Routes>
  );
}

export default App;
