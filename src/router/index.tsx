
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NotFoundPage from '@/pages/NotFoundPage';
import LandingPage from '@/pages/LandingPage';

// Login pages
import LoginPage from '@/pages/common/Login';
import RegisterPage from '@/pages/common/Register';
import OnboardingPage from '@/pages/common/Onboarding';
import B2BSelectionPage from '@/pages/b2b/Selection';

// B2C pages
import B2CLayout from '@/layouts/B2CLayout';
import B2CDashboard from '@/pages/b2c/Dashboard';
import B2CJournal from '@/pages/b2c/Journal';
import B2CMusic from '@/pages/b2c/Music';
import B2CMusicCreate from '@/pages/b2c/MusicCreate';
import B2CMusicPreferences from '@/pages/b2c/MusicPreferences';
import B2CScan from '@/pages/b2c/Scan';
import B2CCoach from '@/pages/b2c/Coach';
import B2CCoachChat from '@/pages/b2c/CoachChat';
import B2CVR from '@/pages/b2c/VR';
import B2CGamification from '@/pages/b2c/Gamification';
import B2CPreferences from '@/pages/b2c/Preferences';
import B2CCocon from '@/pages/b2c/Cocon';
import B2CSettings from '@/pages/b2c/Settings';

// B2B User pages
import B2BUserLayout from '@/layouts/B2BUserLayout';
import B2BUserDashboard from '@/pages/b2b/user/Dashboard';
import B2BUserJournal from '@/pages/b2b/user/Journal';
import B2BUserMusic from '@/pages/b2b/user/Music';
import B2BUserMusicCreate from '@/pages/b2b/user/MusicCreate';
import B2BUserMusicPreferences from '@/pages/b2b/user/MusicPreferences';
import B2BUserScan from '@/pages/b2b/user/Scan';
import B2BUserCoach from '@/pages/b2b/user/Coach';
import B2BUserCoachChat from '@/pages/b2b/user/CoachChat';
import B2BUserVR from '@/pages/b2b/user/VR';
import B2BUserGamification from '@/pages/b2b/user/Gamification';
import B2BUserPreferences from '@/pages/b2b/user/Preferences';
import B2BUserCocon from '@/pages/b2b/user/Cocon';
import B2BUserSettings from '@/pages/b2b/user/Settings';

// B2B Admin pages
import B2BAdminLayout from '@/layouts/B2BAdminLayout';
import B2BAdminDashboard from '@/pages/b2b/admin/Dashboard';
import B2BAdminJournal from '@/pages/b2b/admin/Journal';
import B2BAdminScan from '@/pages/b2b/admin/Scan';
import B2BAdminMusic from '@/pages/b2b/admin/Music';
import B2BAdminTeams from '@/pages/b2b/admin/Teams';
import B2BAdminReports from '@/pages/b2b/admin/Reports';
import B2BAdminEvents from '@/pages/b2b/admin/Events';
import B2BAdminSettings from '@/pages/b2b/admin/Settings';
import B2BAdminCoachAnalytics from '@/pages/b2b/admin/CoachAnalytics';

// Create a placeholder component for routes that aren't implemented yet
const NotImplemented = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <h1 className="text-2xl font-bold mb-4">Page en cours de développement</h1>
    <p className="text-muted-foreground">Cette fonctionnalité sera disponible prochainement.</p>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root route - single home page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Auth routes */}
      <Route path="/b2c/login" element={<LoginPage />} />
      <Route path="/b2b/user/login" element={<LoginPage />} />
      <Route path="/b2b/admin/login" element={<LoginPage />} />
      <Route path="/b2c/register" element={<RegisterPage />} />
      <Route path="/b2c/onboarding" element={<OnboardingPage />} />
      <Route path="/b2b/selection" element={<B2BSelectionPage />} />

      {/* B2C Routes */}
      <Route path="/b2c" element={<B2CLayout />}>
        <Route path="dashboard" element={<B2CDashboard />} />
        <Route path="journal" element={<B2CJournal />} />
        <Route path="music" element={<B2CMusic />} />
        <Route path="music/create" element={<B2CMusicCreate />} />
        <Route path="music/preferences" element={<B2CMusicPreferences />} />
        <Route path="scan" element={<B2CScan />} />
        <Route path="coach" element={<B2CCoach />} />
        <Route path="coach-chat" element={<B2CCoachChat />} />
        <Route path="vr" element={<B2CVR />} />
        <Route path="gamification" element={<B2CGamification />} />
        <Route path="preferences" element={<B2CPreferences />} />
        <Route path="cocon" element={<B2CCocon />} />
        <Route path="settings" element={<B2CSettings />} />
        <Route path="settings/security" element={<NotImplemented />} />
        <Route path="settings/notifications" element={<NotImplemented />} />
        <Route path="settings/accessibility" element={<NotImplemented />} />
        <Route path="settings/preferences" element={<NotImplemented />} />
      </Route>

      {/* B2B User Routes */}
      <Route path="/b2b/user" element={<B2BUserLayout />}>
        <Route path="dashboard" element={<B2BUserDashboard />} />
        <Route path="journal" element={<B2BUserJournal />} />
        <Route path="music" element={<B2BUserMusic />} />
        <Route path="music/create" element={<B2BUserMusicCreate />} />
        <Route path="music/preferences" element={<B2BUserMusicPreferences />} />
        <Route path="scan" element={<B2BUserScan />} />
        <Route path="coach" element={<B2BUserCoach />} />
        <Route path="coach-chat" element={<B2BUserCoachChat />} />
        <Route path="vr" element={<B2BUserVR />} />
        <Route path="gamification" element={<B2BUserGamification />} />
        <Route path="preferences" element={<B2BUserPreferences />} />
        <Route path="cocon" element={<B2BUserCocon />} />
        <Route path="settings" element={<B2BUserSettings />} />
        <Route path="settings/security" element={<NotImplemented />} />
        <Route path="settings/notifications" element={<NotImplemented />} />
        <Route path="settings/accessibility" element={<NotImplemented />} />
        <Route path="settings/preferences" element={<NotImplemented />} />
      </Route>

      {/* B2B Admin Routes */}
      <Route path="/b2b/admin" element={<B2BAdminLayout />}>
        <Route path="dashboard" element={<B2BAdminDashboard />} />
        <Route path="journal" element={<B2BAdminJournal />} />
        <Route path="scan" element={<B2BAdminScan />} />
        <Route path="music" element={<B2BAdminMusic />} />
        <Route path="teams" element={<B2BAdminTeams />} />
        <Route path="reports" element={<B2BAdminReports />} />
        <Route path="events" element={<B2BAdminEvents />} />
        <Route path="settings" element={<B2BAdminSettings />} />
        <Route path="coach-analytics" element={<B2BAdminCoachAnalytics />} />
      </Route>
      
      {/* Catch all - 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
