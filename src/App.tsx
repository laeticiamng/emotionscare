
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import DashboardPage from '@/pages/DashboardPage';
import ScanPage from '@/pages/ScanPage';
import VRSessionPage from '@/pages/VRSessionPage';
import CommunityFeed from '@/pages/CommunityFeed';
import GroupListPage from '@/pages/GroupListPage';
import BuddyPage from '@/pages/BuddyPage';
import MusicDrawer from '@/components/music/MusicDrawer';
import { MusicProvider } from '@/contexts/MusicContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <MusicProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/vr-session" element={<VRSessionPage />} />
            <Route path="/community" element={<CommunityFeed />} />
            <Route path="/community/groups" element={<GroupListPage />} />
            <Route path="/community/buddies" element={<BuddyPage />} />
          </Routes>
        </Layout>
        <MusicDrawer />
        <Toaster />
      </MusicProvider>
    </AuthProvider>
  );
}

export default App;
