
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Toaster } from './components/ui/toaster';
import Layout from './components/Layout';
import ProtectedLayout from './components/ProtectedLayout';
import LoadingAnimation from './components/ui/loading-animation';

// Lazy-loaded pages for better performance
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const JournalPage = lazy(() => import('./pages/JournalPage'));
const JournalEntryPage = lazy(() => import('./pages/JournalEntryPage'));
const JournalNewPage = lazy(() => import('./pages/JournalNewPage'));
const ScanPage = lazy(() => import('./pages/ScanPage'));
const ScanDetailPage = lazy(() => import('./pages/ScanDetailPage'));
const VRSessionsPage = lazy(() => import('./pages/VRSessionsPage'));
const VRSessionPage = lazy(() => import('./pages/VRSessionPage'));
const VRAnalyticsPage = lazy(() => import('./pages/VRAnalyticsPage'));
const SocialCocoonPage = lazy(() => import('./pages/SocialCocoonPage'));
const CommunityFeed = lazy(() => import('./pages/CommunityFeed'));
const GroupsPage = lazy(() => import('./pages/GroupsPage'));
const GroupListPage = lazy(() => import('./pages/GroupListPage'));
const BuddyPage = lazy(() => import('./pages/BuddyPage'));
const CommunityAdminPage = lazy(() => import('./pages/CommunityAdminPage'));
const CoachPage = lazy(() => import('./pages/CoachPage'));
const AccountSettings = lazy(() => import('./pages/AccountSettings'));
const UserPreferences = lazy(() => import('./pages/UserPreferences'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const GamificationPage = lazy(() => import('./pages/GamificationPage'));
const CompliancePage = lazy(() => import('./pages/CompliancePage'));
const NotImplementedPage = lazy(() => import('./pages/NotImplementedPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Index = lazy(() => import('./pages/Index'));
const MusicWellbeingPage = lazy(() => import('./pages/MusicWellbeingPage'));

// Nouvelles pages
const MyDataPage = lazy(() => import('./pages/MyDataPage'));

// Fallback loading component
const Loading = () => <LoadingAnimation />;

function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Auth routes (no navigation) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          
          {/* Landing page */}
          <Route path="/" element={<Layout><Index /></Layout>} />
          
          {/* Protected routes (require authentication) */}
          <Route element={<ProtectedLayout><Layout /></ProtectedLayout>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Journal */}
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/journal/new" element={<JournalNewPage />} />
            <Route path="/journal/:id" element={<JournalEntryPage />} />
            
            {/* Emotion Scan */}
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/scan/:id" element={<ScanDetailPage />} />
            
            {/* VR */}
            <Route path="/vr" element={<VRSessionsPage />} />
            <Route path="/vr/:id" element={<VRSessionPage />} />
            <Route path="/vr/analytics" element={<VRAnalyticsPage />} />
            
            {/* Community */}
            <Route path="/community" element={<SocialCocoonPage />} />
            <Route path="/community/feed" element={<CommunityFeed />} />
            <Route path="/community/groups" element={<GroupsPage />} />
            <Route path="/community/groups/list" element={<GroupListPage />} />
            <Route path="/community/buddy" element={<BuddyPage />} />
            <Route path="/community/admin" element={<CommunityAdminPage />} />
            
            {/* Music */}
            <Route path="/music" element={<MusicWellbeingPage />} />
            
            {/* Coach */}
            <Route path="/coach" element={<CoachPage />} />
            
            {/* Gamification */}
            <Route path="/gamification" element={<GamificationPage />} />
            
            {/* Account & Settings */}
            <Route path="/account" element={<AccountSettings />} />
            <Route path="/preferences" element={<UserPreferences />} />
            <Route path="/my-data" element={<MyDataPage />} />
            
            {/* Compliance */}
            <Route path="/compliance" element={<CompliancePage />} />
            
            {/* Placeholder for not implemented pages */}
            <Route path="/not-implemented/:feature" element={<NotImplementedPage />} />
          </Route>
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
