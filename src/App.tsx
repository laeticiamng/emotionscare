import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedLayout } from './components/ProtectedLayout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { EmotionTracker } from './pages/EmotionTracker';
import { SocialCocoon } from './pages/SocialCocoon';
import { AdminDashboard } from './pages/AdminDashboard';
import { Journal } from './pages/Journal';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';
import { Onboarding } from './pages/Onboarding';
import { CoachDashboard } from './pages/CoachDashboard';
import { MusicPlayer } from './pages/MusicPlayer';
import { NotificationCenter } from './pages/NotificationCenter';

// Import VR pages
import VRSessionsPage from './pages/VRSessionsPage';
import VRSessionPage from './pages/VRSessionPage';
import VRAnalyticsPage from './pages/VRAnalyticsPage';

function App() {
  const { user } = useContext(AuthContext);
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={
          <ProtectedLayout>
            <Onboarding />
          </ProtectedLayout>
        } />
        <Route path="/dashboard" element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        } />
        <Route path="/profile" element={
          <ProtectedLayout>
            <Profile />
          </ProtectedLayout>
        } />
        <Route path="/emotion-tracker" element={
          <ProtectedLayout>
            <EmotionTracker />
          </ProtectedLayout>
        } />
        <Route path="/social-cocoon" element={
          <ProtectedLayout>
            <SocialCocoon />
          </ProtectedLayout>
        } />
        <Route path="/admin-dashboard" element={
          <ProtectedLayout requireRole="admin">
            <AdminDashboard />
          </ProtectedLayout>
        } />
        <Route path="/coach-dashboard" element={
          <ProtectedLayout requireRole="coach">
            <CoachDashboard />
          </ProtectedLayout>
        } />
        <Route path="/journal" element={
          <ProtectedLayout>
            <Journal />
          </ProtectedLayout>
        } />
        <Route path="/settings" element={
          <ProtectedLayout>
            <Settings />
          </ProtectedLayout>
        } />
        <Route path="/music-player" element={
          <ProtectedLayout>
            <MusicPlayer />
          </ProtectedLayout>
        } />
        <Route path="/notifications" element={
          <ProtectedLayout>
            <NotificationCenter />
          </ProtectedLayout>
        } />
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
          <ProtectedLayout>
            <VRAnalyticsPage />
          </ProtectedLayout>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
