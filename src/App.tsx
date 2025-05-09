
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { MusicProvider } from './contexts/MusicContext';
import Shell from './components/Shell';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import ProtectedLayout from './components/ProtectedLayout';
import Index from './pages/Index';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import NotImplementedPage from './pages/NotImplementedPage';
import NotFoundPage from './pages/NotFound';
import ScanPage from './pages/ScanPage';
import JournalPage from './pages/JournalPage';
import SettingsPage from './pages/SettingsPage';
import MusicTherapyPage from './pages/MusicTherapyPage';
import MusicGenerationPage from './pages/MusicGenerationPage';
import MusicPreferencesPage from './pages/MusicPreferencesPage';
import CoachPage from './pages/CoachPage';
import CoachChatPage from './pages/CoachChatPage';
import VRPage from './pages/VRPage';
import MusicPage from './pages/MusicPage';

function App() {
  return (
    <div className="app">
      <ThemeProvider>
        <AuthProvider>
          <MusicProvider>
            <AppRoutes />
          </MusicProvider>
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}

// Separate routes component to properly use context hooks
function AppRoutes() {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  React.useEffect(() => {
    if (user && isAuthenticated) {
      toast({
        title: "Bienvenue !",
        description: `Bonjour ${user.name}, ravi de vous revoir.`,
      });
    }
  }, [isAuthenticated, user, toast]);

  return (
    <Routes>
      <Route path="/" element={<Shell />}>
        <Route index element={<Index />} />
        <Route path="/dashboard" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
        <Route path="/scan" element={<ProtectedLayout><ScanPage /></ProtectedLayout>} />
        <Route path="/vr" element={<ProtectedLayout><VRPage /></ProtectedLayout>} />
        <Route path="/journal" element={<ProtectedLayout><JournalPage /></ProtectedLayout>} />
        <Route path="/settings" element={<ProtectedLayout><SettingsPage /></ProtectedLayout>} />
        
        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        
        {/* Admin Routes - accessible only to admins */}
        <Route path="/admin" element={<ProtectedLayout requireRole="admin"><NotImplementedPage /></ProtectedLayout>} />
        
        {/* Music Therapy Routes */}
        <Route path="/music" element={<ProtectedLayout><MusicPage /></ProtectedLayout>} />
        <Route path="/music/create" element={<ProtectedLayout><MusicGenerationPage /></ProtectedLayout>} />
        <Route path="/music/preferences" element={<ProtectedLayout><MusicPreferencesPage /></ProtectedLayout>} />
        
        {/* Coach routes */}
        <Route path="/coach" element={<ProtectedLayout><CoachPage /></ProtectedLayout>} />
        <Route path="/coach-chat" element={<ProtectedLayout><CoachChatPage /></ProtectedLayout>} />
        
        {/* Not Found Route - fallback for all other routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
