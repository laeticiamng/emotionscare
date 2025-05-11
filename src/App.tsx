
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages
import HomePage from '@/pages/Home';
import Dashboard from '@/pages/DashboardPage';
import JournalPage from '@/pages/JournalPage';
import Login from '@/pages/LoginPage';
import Register from '@/pages/RegisterPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotFound from '@/pages/NotFound';
import ResetPassword from '@/pages/ResetPassword';
import Profile from '@/pages/Profile';
import AdminDashboardPage from '@/pages/AdminDashboard';
import ScanPage from '@/pages/ScanPage';
import MusicPage from '@/pages/MusicPage';
import AccountSettingsPage from '@/pages/AccountSettings';
import TeamPage from '@/pages/TeamPage';
import CoachPage from '@/pages/CoachPage';
import CoachChatPage from '@/pages/CoachChatPage';
import DocsPage from '@/pages/Docs';
import BuddyPage from '@/pages/BuddyPage';
import VRPage from '@/pages/VRPage';
import UserSettingsPage from '@/pages/UserSettingsPage';
import SupportPage from '@/pages/Support';

import ProtectedLayoutWrapper from '@/components/ProtectedLayoutWrapper';

// Import styles
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ResetPassword />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedLayoutWrapper><ProtectedRoute /></ProtectedLayoutWrapper>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/account" element={<AccountSettingsPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/coach" element={<CoachPage />} />
          <Route path="/coach-chat" element={<CoachChatPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/buddy" element={<BuddyPage />} />
          <Route path="/vr" element={<VRPage />} />
          <Route path="/settings" element={<UserSettingsPage />} />
          <Route path="/support" element={<SupportPage />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
