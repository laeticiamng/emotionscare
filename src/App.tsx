
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MusicProvider } from '@/contexts/MusicContext';
import { Toaster } from "@/components/ui/toaster";
import MusicDrawer from '@/components/music/MusicDrawer';
import Layout from '@/components/Layout';
import IndexPage from '@/pages/Index';
import LoginPage from '@/pages/LoginPage';
import OnboardingPage from '@/pages/OnboardingPage';
import DashboardPage from '@/pages/DashboardPage';
import ScanPage from '@/pages/ScanPage';
import ScanDetailPage from '@/pages/ScanDetailPage';
import JournalPage from '@/pages/JournalPage';
import JournalNewPage from '@/pages/JournalNewPage';
import JournalEntryPage from '@/pages/JournalEntryPage';
import CommunityFeed from '@/pages/CommunityFeed';
import GroupListPage from '@/pages/GroupListPage';
import BuddyPage from '@/pages/BuddyPage';
import GamificationPage from '@/pages/GamificationPage';
import VRSessionPage from '@/pages/VRSessionPage';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <MusicProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        
        <Route element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="scan" element={<ScanPage />} />
          <Route path="scan/:id" element={<ScanDetailPage />} />
          <Route path="journal" element={<JournalPage />} />
          <Route path="journal/new" element={<JournalNewPage />} />
          <Route path="journal/:id" element={<JournalEntryPage />} />
          <Route path="community" element={<CommunityFeed />} />
          <Route path="community/groups" element={<GroupListPage />} />
          <Route path="community/buddy" element={<BuddyPage />} />
          <Route path="gamification" element={<GamificationPage />} />
          <Route path="vr" element={<VRSessionPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      
      {/* Music Drawer - globally accessible */}
      <MusicDrawer />
      
      {/* Toast notifications */}
      <Toaster />
    </MusicProvider>
  );
}

export default App;
