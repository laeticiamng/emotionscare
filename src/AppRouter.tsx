
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Shell from './Shell';
import DashboardLayout from './components/DashboardLayout';
import NotFound from './pages/NotFound';

// Import additional pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ScanPage from './pages/ScanPage';
import JournalPage from './pages/JournalPage';
import MusicPage from './pages/MusicPage';
import MusicTherapyPage from './pages/MusicTherapyPage';
import AudioPage from './pages/AudioPage';
import VideoTherapyPage from './pages/VideoTherapyPage';
import ARPage from './pages/ARPage';
import MarketplacePage from './pages/MarketplacePage';
import CompliancePage from './pages/CompliancePage';
import GdprPortal from './pages/GdprPortal';
import GamificationPage from './pages/GamificationPage';
import CoachPage from './pages/CoachPage';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Protected routes with DashboardLayout */}
      <Route path="/" element={<DashboardLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="scan" element={<ScanPage />} />
        <Route path="journal" element={<JournalPage />} />
        <Route path="music" element={<MusicPage />} />
        <Route path="musicotherapy" element={<MusicTherapyPage />} />
        <Route path="audio" element={<AudioPage />} />
        <Route path="video" element={<VideoTherapyPage />} />
        <Route path="ar" element={<ARPage />} />
        <Route path="marketplace" element={<MarketplacePage />} />
        <Route path="compliance" element={<CompliancePage />} />
        <Route path="gdpr-portal" element={<GdprPortal />} />
        <Route path="gamification" element={<GamificationPage />} />
        <Route path="coach" element={<CoachPage />} />
        <Route path="coach-chat" element={<CoachPage />} /> {/* Alias for coach */}
      </Route>

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
