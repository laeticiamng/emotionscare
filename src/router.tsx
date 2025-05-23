
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VRPage from './pages/VRPage';
import ScanPage from './pages/ScanPage';
import Social from './pages/Social';
import DashboardRedirect from './pages/DashboardRedirect';

// Pour les composants dashboard manquants, créons des versions temporaires
const B2CDashboard = () => <div className="p-8"><h1 className="text-3xl font-bold">Dashboard B2C</h1></div>;
const B2BUserDashboard = () => <div className="p-8"><h1 className="text-3xl font-bold">Dashboard B2B User</h1></div>;
const B2BAdminDashboard = () => <div className="p-8"><h1 className="text-3xl font-bold">Dashboard B2B Admin</h1></div>;

const AppRouter = () => {
  return (
    <Routes>
      {/* Page d'accueil principale */}
      <Route path="/" element={<HomePage />} />
      
      {/* Redirection dashboard */}
      <Route path="/dashboard" element={<DashboardRedirect />} />
      
      {/* Routes B2C */}
      <Route path="/b2c">
        <Route path="dashboard" element={<B2CDashboard />} />
        <Route path="scan" element={<ScanPage />} />
        <Route path="vr" element={<VRPage />} />
        <Route path="social" element={<Social />} />
      </Route>
      
      {/* Routes B2B User */}
      <Route path="/b2b/user">
        <Route path="dashboard" element={<B2BUserDashboard />} />
        <Route path="scan" element={<ScanPage />} />
        <Route path="vr" element={<VRPage />} />
        <Route path="social" element={<Social />} />
      </Route>
      
      {/* Routes B2B Admin */}
      <Route path="/b2b/admin">
        <Route path="dashboard" element={<B2BAdminDashboard />} />
        <Route path="social" element={<Social />} />
      </Route>
      
      {/* Accès direct aux fonctionnalités principales */}
      <Route path="/scan" element={<ScanPage />} />
      <Route path="/vr" element={<VRPage />} />
      <Route path="/social" element={<Social />} />
    </Routes>
  );
};

export default AppRouter;
