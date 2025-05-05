
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Index from '@/pages/Index';
import LoginPage from '@/pages/LoginPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import DashboardPage from '@/pages/DashboardPage';
import ScanPage from '@/pages/ScanPage';
import VRSessionPage from '@/pages/VRSessionPage';
import CommunityFeed from '@/pages/CommunityFeed';
import GroupListPage from '@/pages/GroupListPage';
import BuddyPage from '@/pages/BuddyPage';
import JournalPage from '@/pages/JournalPage';
import JournalEntryPage from '@/pages/JournalEntryPage';
import JournalNewPage from '@/pages/JournalNewPage';
import GamificationPage from '@/pages/GamificationPage';
import MusicDrawer from '@/components/music/MusicDrawer';
import { MusicProvider } from '@/contexts/MusicContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <MusicProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/vr-session" element={<VRSessionPage />} />
            <Route path="/community" element={<CommunityFeed />} />
            <Route path="/community/groups" element={<GroupListPage />} />
            <Route path="/community/buddies" element={<BuddyPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/journal/:entryId" element={<JournalEntryPage />} />
            <Route path="/journal/new" element={<JournalNewPage />} />
            <Route path="/gamification" element={<GamificationPage />} />
          </Route>
        </Routes>
        <MusicDrawer />
        <Toaster />
      </MusicProvider>
    </AuthProvider>
  );
}

export default App;
