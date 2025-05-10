
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ImmersiveSettingsPage from './pages/ImmersiveSettingsPage';
import AdminPremiumDashboard from './pages/AdminPremiumDashboard';
import OnboardingPage from './pages/OnboardingPage';
import OnboardingModePage from './pages/OnboardingModePage';
import UserPreferencesPage from './pages/UserPreferences';
import Shell from './components/Shell';
import ScanPage from './pages/ScanPage';
import AdminLoginPage from './pages/AdminLoginPage';
import { AuthProvider } from './contexts/AuthContext';
import { UserModeProvider } from './contexts/UserModeContext';
import Index from './pages/Index';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedLayout from './components/ProtectedLayout';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserModeProvider>
          <Routes>
            {/* Pages publiques */}
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/choose-mode" element={<OnboardingModePage />} />
            
            {/* Pages protégées (nécessitent une authentification) */}
            <Route element={<ProtectedLayout />}>
              <Route path="/admin/premium" element={<AdminPremiumDashboard />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/scan" element={<ScanPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/immersive-settings" element={<ImmersiveSettingsPage />} />
              <Route path="/preferences" element={<UserPreferencesPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
            </Route>
            
            {/* Page d'accueil */}
            <Route path="/" element={<Shell />}>
              <Route index element={<Index />} />
            </Route>
            
            {/* Redirect any unmatched routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </UserModeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
