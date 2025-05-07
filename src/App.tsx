import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { MusicProvider } from './contexts/MusicContext';
import { Shell } from './components/Shell';
import ProtectedLayout from './components/ProtectedLayout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import ScanPage from './pages/ScanPage';
import VRTherapyPage from './pages/VRTherapyPage';
import JournalPage from './pages/JournalPage';
import SettingsPage from './pages/SettingsPage';
import MusicTherapyPage from './pages/MusicTherapyPage';
import MusicGenerationPage from './pages/MusicGenerationPage';

import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast"

function App() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast()

  useEffect(() => {
    if (user && isAuthenticated) {
      toast({
        title: "Bienvenue !",
        description: `Bonjour ${user.name}, ravi de vous revoir.`,
      })
    }
  }, [isAuthenticated, user, toast])

  return (
    <div className="app">
      <ThemeProvider>
        <AuthProvider>
          <MusicProvider>
            <Routes>
              <Route element={<Shell />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
                <Route path="/scan" element={<ProtectedLayout><ScanPage /></ProtectedLayout>} />
                <Route path="/vr" element={<ProtectedLayout><VRTherapyPage /></ProtectedLayout>} />
                <Route path="/journal" element={<ProtectedLayout><JournalPage /></ProtectedLayout>} />
                <Route path="/settings" element={<ProtectedLayout><SettingsPage /></ProtectedLayout>} />
                
                {/* Authentication Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/admin-login" element={<AdminLoginPage />} />
                
                {/* Admin Routes - accessible only to admins */}
                <Route path="/admin" element={<ProtectedLayout requireRole="admin"><AdminDashboardPage /></ProtectedLayout>} />
                
                {/* Music Therapy Routes */}
                <Route path="/music" element={<ProtectedLayout><MusicTherapyPage /></ProtectedLayout>} />
                <Route path="/music/create" element={<ProtectedLayout><MusicGenerationPage /></ProtectedLayout>} />
                
                {/* Not Found Route - fallback for all other routes */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </MusicProvider>
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
