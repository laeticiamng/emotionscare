
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import ImmersiveHome from './pages/ImmersiveHome';
import DashboardLayout from './components/DashboardLayout';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<ImmersiveHome />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/b2c/login" element={<LoginPage />} />
      <Route path="/b2b/user/login" element={<LoginPage />} />
      <Route path="/b2b/admin/login" element={<LoginPage />} />
      
      {/* B2C (Individual) Routes */}
      <Route path="/b2c" element={<DashboardLayout />}>
        <Route path="dashboard" element={<div>B2C Dashboard (Placeholder)</div>} />
        <Route path="journal" element={<div>B2C Journal (Placeholder)</div>} />
        <Route path="coaching" element={<div>B2C Coaching (Placeholder)</div>} />
      </Route>
      
      {/* B2B User Routes */}
      <Route path="/b2b/user" element={<DashboardLayout />}>
        <Route path="dashboard" element={<div>B2B User Dashboard (Placeholder)</div>} />
        <Route path="sessions" element={<div>B2B User Sessions (Placeholder)</div>} />
        <Route path="resources" element={<div>B2B User Resources (Placeholder)</div>} />
      </Route>
      
      {/* B2B Admin Routes */}
      <Route path="/b2b/admin" element={<DashboardLayout />}>
        <Route path="dashboard" element={<div>B2B Admin Dashboard (Placeholder)</div>} />
        <Route path="users" element={<div>B2B Admin Users Management (Placeholder)</div>} />
        <Route path="analytics" element={<div>B2B Admin Analytics (Placeholder)</div>} />
        <Route path="settings" element={<div>B2B Admin Settings (Placeholder)</div>} />
      </Route>
      
      {/* B2B Selection Page */}
      <Route path="/b2b/selection" element={<div>B2B Selection Page (Placeholder)</div>} />
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}

export default App;
