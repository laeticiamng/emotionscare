
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImmersiveSettingsPage from './pages/ImmersiveSettingsPage';
import AdminPremiumDashboard from './pages/AdminPremiumDashboard';
import OnboardingPage from './pages/OnboardingPage';
import UserPreferencesPage from './pages/UserPreferences';
import Shell from './components/Shell';
import ScanPage from './pages/ScanPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AuthProvider from './contexts/AuthContext';
import Index from './pages/Index';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Shell />}>
            <Route index element={<Index />} />
            <Route path="/settings" element={<ImmersiveSettingsPage />} />
            <Route path="/admin/premium" element={<AdminPremiumDashboard />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/dashboard" element={<AdminPremiumDashboard />} />
            <Route path="/preferences" element={<UserPreferencesPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Route>
          <Route path="/admin/login" element={<AdminLoginPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
