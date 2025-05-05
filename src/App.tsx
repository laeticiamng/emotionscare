
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import Layout from './components/Layout';
import Index from './pages/Index';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import DashboardPage from './pages/DashboardPage';
import ScanPage from './pages/ScanPage';
import ScanDetailPage from './pages/ScanDetailPage';
import JournalPage from './pages/JournalPage';
import JournalNewPage from './pages/JournalNewPage';
import JournalEntryPage from './pages/JournalEntryPage';
import BuddyPage from './pages/BuddyPage';
import CommunityFeed from './pages/CommunityFeed';
import GroupListPage from './pages/GroupListPage';
import VRSessionPage from './pages/VRSessionPage';
import MusicWellbeingPage from './pages/MusicWellbeingPage';
import GamificationPage from './pages/GamificationPage';
import OnboardingPage from './pages/OnboardingPage';
import NotFound from './pages/NotFound';
import NotImplementedPage from './pages/NotImplementedPage';
import { MusicProvider } from './contexts/MusicContext';
import { ThemeProvider } from './contexts/ThemeContext';
import UserPreferences from './pages/UserPreferences';
import AccountSettings from './pages/AccountSettings';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MusicProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            
            <Route path="/" element={<Layout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="scan" element={<ScanPage />} />
              <Route path="scan/:id" element={<ScanDetailPage />} />
              <Route path="journal" element={<JournalPage />} />
              <Route path="journal/new" element={<JournalNewPage />} />
              <Route path="journal/:id" element={<JournalEntryPage />} />
              <Route path="buddy" element={<BuddyPage />} />
              <Route path="community" element={<CommunityFeed />} />
              <Route path="groups" element={<GroupListPage />} />
              <Route path="vr-sessions" element={<VRSessionPage />} />
              <Route path="music-wellbeing" element={<MusicWellbeingPage />} />
              <Route path="gamification" element={<GamificationPage />} />
              <Route path="preferences" element={<UserPreferences />} />
              <Route path="account-settings" element={<AccountSettings />} />
              <Route path="*" element={<NotImplementedPage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </MusicProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
