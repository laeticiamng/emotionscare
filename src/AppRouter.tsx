
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar/SidebarContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MusicProvider } from '@/contexts/MusicContext';

// Layouts
import DashboardLayout from '@/components/DashboardLayout';

// Pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ScanPage from '@/pages/ScanPage';
import JournalPage from '@/pages/JournalPage';
import MusicTherapyPage from '@/pages/MusicTherapyPage';
import CoachPage from '@/pages/CoachPage';
import GamificationPage from '@/pages/GamificationPage';
import SettingsPage from '@/pages/SettingsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import OnboardingPage from '@/pages/OnboardingPage';
import ReportsPage from '@/pages/ReportsPage';
import SessionsPage from '@/pages/SessionsPage';

// Contexte d'authentification pour les routes protégées
import { AuthProvider } from '@/contexts/AuthContext';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <SidebarProvider>
            <MusicProvider>
              <Routes>
                {/* Routes d'authentification et d'onboarding */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                
                {/* Routes de l'application */}
                <Route path="/" element={<DashboardLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="scan" element={<ScanPage />} />
                  <Route path="journal" element={<JournalPage />} />
                  <Route path="music" element={<MusicTherapyPage />} />
                  <Route path="coach" element={<CoachPage />} />
                  <Route path="gamification" element={<GamificationPage />} />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="sessions" element={<SessionsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
                
                {/* Page 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </MusicProvider>
          </SidebarProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default AppRouter;
