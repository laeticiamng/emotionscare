
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Shell from './Shell';
import DashboardLayout from './components/DashboardLayout';
import NotFound from './pages/NotFound';

// Import additional pages that exist in the project
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
import GdprPortal from './pages/GdprPortal'; // Import the new GDPR portal page

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Dashboard and protected routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="scan" element={<ScanPage />} />
        <Route path="journal" element={<JournalPage />} />
        <Route path="music" element={<MusicPage />} />
        <Route path="musicotherapy" element={<MusicTherapyPage />} />
        <Route path="audio" element={<AudioPage />} />
        <Route path="video" element={<VideoTherapyPage />} />
        <Route path="ar" element={<ARPage />} />
        <Route path="mindfulness" element={<DashboardPage />} />
        <Route path="marketplace" element={<MarketplacePage />} />
        <Route path="compliance" element={<CompliancePage />} />
        <Route path="gdpr-portal" element={<GdprPortal />} /> {/* Add new GDPR portal route */}
      </Route>

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
