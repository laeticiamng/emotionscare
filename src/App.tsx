
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MusicProvider } from '@/contexts/music';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import Index from './pages/Index';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import SettingsPage from './pages/settings/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import AppLayout from './layouts/AppLayout';
import B2CDashboardPage from './pages/b2c/DashboardPage';
import AdminDashboardPage from './pages/admin/DashboardPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserPreferencesProvider>
          <MusicProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Routes protégées avec AppLayout */}
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/b2c/dashboard" element={<B2CDashboardPage />} />
                  <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                </Route>
                
                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Router>
          </MusicProvider>
        </UserPreferencesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
