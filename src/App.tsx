
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import DashboardPage from '@/pages/DashboardPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import BusinessPage from '@/pages/BusinessPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import Index from '@/pages/Index';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { AuthProvider } from '@/contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/business" element={<BusinessPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Routes protégées */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* Tableaux de bord */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
