
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ImmersiveHome from '@/pages/ImmersiveHome';
import Selection from '@/pages/common/Selection';
import B2BSelection from '@/pages/common/B2BSelection';
import B2CLogin from '@/pages/b2c/Login';
import B2CRegister from '@/pages/b2c/Register';
import B2CDashboard from '@/pages/b2c/Dashboard';
import B2BUserLogin from '@/pages/b2b/user/Login';
import B2BAdminLogin from '@/pages/b2b/admin/Login';
import ProtectedRoute from '@/components/ProtectedRoute';
import B2CLayout from '@/layouts/B2CLayout';
import './App.css';

function App() {
  useEffect(() => {
    console.log('App mounted');
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<ImmersiveHome />} />
      <Route path="/selection" element={<Selection />} />
      <Route path="/b2b/selection" element={<B2BSelection />} />
      
      {/* B2C Routes */}
      <Route path="/b2c/login" element={<B2CLogin />} />
      <Route path="/b2c/register" element={<B2CRegister />} />
      <Route path="/b2c" element={
        <ProtectedRoute role="b2c" redirectTo="/b2c/login">
          <B2CLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/b2c/dashboard" replace />} />
        <Route path="dashboard" element={<B2CDashboard />} />
      </Route>
      
      {/* B2B User Routes */}
      <Route path="/b2b/user/login" element={<B2BUserLogin />} />
      
      {/* B2B Admin Routes */}
      <Route path="/b2b/admin/login" element={<B2BAdminLogin />} />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
