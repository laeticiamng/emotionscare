
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedLayout from './components/ProtectedLayout';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import Index from './pages/Index';
import NotFoundPage from './pages/NotFound';
import SocialCocoonPage from './pages/SocialCocoonPage';
import CommunityAdminPage from './pages/CommunityAdminPage';
import CompliancePage from './pages/CompliancePage';
import DashboardPage from './pages/DashboardPage';
import ScanPage from './pages/ScanPage';
import JournalPage from './pages/JournalPage';
import GamificationPage from './pages/GamificationPage';
import MusicWellbeingPage from './pages/MusicWellbeingPage';
import BuddyPage from './pages/BuddyPage';

// Import VR pages
import VRSessionsPage from './pages/VRSessionsPage';
import VRSessionPage from './pages/VRSessionPage';
import VRAnalyticsPage from './pages/VRAnalyticsPage';

function App() {
  const { user } = useAuth();
  
  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedLayout>
            <DashboardPage />
          </ProtectedLayout>
        } />
        
        {/* Scan Route */}
        <Route path="/scan" element={
          <ProtectedLayout>
            <ScanPage />
          </ProtectedLayout>
        } />
        
        {/* Journal Route */}
        <Route path="/journal" element={
          <ProtectedLayout>
            <JournalPage />
          </ProtectedLayout>
        } />
        
        {/* Social Cocoon Routes */}
        <Route path="/social-cocoon" element={
          <ProtectedLayout>
            <SocialCocoonPage />
          </ProtectedLayout>
        } />
        
        <Route path="/community" element={
          <ProtectedLayout>
            <SocialCocoonPage />
          </ProtectedLayout>
        } />
        
        <Route path="/community/admin" element={
          <ProtectedLayout requireRole="admin">
            <CommunityAdminPage />
          </ProtectedLayout>
        } />
        
        {/* Buddy Route */}
        <Route path="/buddy" element={
          <ProtectedLayout>
            <BuddyPage />
          </ProtectedLayout>
        } />
        
        {/* VR Session Routes */}
        <Route path="/vr-sessions" element={
          <ProtectedLayout>
            <VRSessionsPage />
          </ProtectedLayout>
        } />
        
        <Route path="/vr-sessions/:id" element={
          <ProtectedLayout>
            <VRSessionPage />
          </ProtectedLayout>
        } />
        
        <Route path="/vr-analytics" element={
          <ProtectedLayout requireRole="admin">
            <VRAnalyticsPage />
          </ProtectedLayout>
        } />
        
        {/* Gamification Route */}
        <Route path="/gamification" element={
          <ProtectedLayout>
            <GamificationPage />
          </ProtectedLayout>
        } />
        
        {/* Music Wellbeing Route */}
        <Route path="/music-wellbeing" element={
          <ProtectedLayout>
            <MusicWellbeingPage />
          </ProtectedLayout>
        } />
        
        <Route path="/compliance" element={<CompliancePage />} />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
