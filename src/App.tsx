
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import DashboardPage from '@/pages/DashboardPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import BusinessPage from '@/pages/BusinessPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import Index from '@/pages/Index';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import ScanPage from '@/pages/ScanPage';
import ImmersiveSettingsPage from '@/pages/ImmersiveSettingsPage';
import DesignSystemPage from '@/pages/DesignSystemPage';
import UserSettingsPage from '@/pages/UserSettingsPage';
import ARPage from './pages/ARPage';
import MusicTherapyPage from './pages/MusicTherapyPage';
import { MusicProvider } from '@/contexts/MusicContext';
import OnboardingPage from './pages/OnboardingPage';
import OnboardingModePage from './pages/OnboardingModePage';
import OnboardingExperiencePage from './pages/OnboardingExperiencePage';
import VideoTherapyPage from './pages/VideoTherapyPage';
import AudioPage from './pages/AudioPage';
import Profile from './pages/Profile';
import SettingsPage from './pages/SettingsPage';
import JournalPage from './pages/JournalPage';
import JournalNewPage from './pages/JournalNewPage';
import JournalEntryPage from './pages/JournalEntryPage';
import CustomReportsPage from './pages/admin/CustomReportsPage';
import PersonalActivityPage from './pages/PersonalActivityPage';

const App: React.FC = () => {
  console.log("Rendering App component");
  
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<Index />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/business" element={<BusinessPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/choose-mode" element={<OnboardingModePage />} />
      <Route path="/onboarding-experience" element={<OnboardingExperiencePage />} />
      
      {/* Routes protégées */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Tableaux de bord */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/reports" element={<CustomReportsPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/settings/design" element={<DesignSystemPage />} />
          <Route path="/settings/immersive" element={<ImmersiveSettingsPage />} />
          <Route path="/settings/user" element={<UserSettingsPage />} />
          
          {/* Pages principales */}
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/journal/new" element={<JournalNewPage />} />
          <Route path="/journal/:id" element={<JournalEntryPage />} />
          <Route path="/music" element={
            <MusicProvider>
              <MusicTherapyPage />
            </MusicProvider>
          } />
          <Route path="/audio" element={<AudioPage />} />
          <Route path="/video" element={<VideoTherapyPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/activity" element={<PersonalActivityPage />} />
        </Route>
      </Route>
      
      {/* Routes spéciales */}
      <Route path="/ar" element={<ARPage />} />
    </Routes>
  );
};

export default App;
