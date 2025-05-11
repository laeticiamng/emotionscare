
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Shell from './Shell';
import HomePage from '@/pages/Home';
import Dashboard from '@/pages/DashboardPage';
import JournalPage from '@/pages/JournalPage';
import Login from '@/pages/LoginPage';
import Register from '@/pages/RegisterPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotFound from '@/pages/NotFound';
import ResetPassword from '@/pages/ResetPasswordPage';
import Profile from '@/pages/Profile';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
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
import OnboardingModePage from '@/pages/OnboardingModePage';
import OnboardingPage from '@/pages/OnboardingPage';
import OnboardingExperiencePage from '@/pages/OnboardingExperiencePage';
import PredictiveDashboardPage from '@/pages/PredictiveDashboardPage';
import BusinessPage from '@/pages/BusinessPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import Index from '@/pages/Index';

import './App.css';

const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ResetPassword />} />
        <Route path="/onboarding-mode" element={<OnboardingModePage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/onboarding-experience" element={<OnboardingExperiencePage />} />
        
        {/* New B2B Routes */}
        <Route path="/business" element={<BusinessPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
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
          <Route path="/predictive" element={<PredictiveDashboardPage />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
