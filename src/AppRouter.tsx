
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingAnimation from '@/components/ui/loading-animation';

// Import des pages principales
import ImmersiveHome from '@/pages/ImmersiveHome';
import B2BSelectionPage from '@/pages/b2b/SelectionPage';
import PhilosophyJourney from '@/pages/common/PhilosophyJourney';
import AboutPage from '@/pages/common/AboutPage';
import ContactPage from '@/pages/common/ContactPage';
import FaqPage from '@/pages/common/FaqPage';
import NotFoundPage from '@/pages/common/NotFoundPage';

// Import des pages B2C
import B2CLoginPage from '@/pages/b2c/LoginPage';

// Import des composants lazy
import {
  B2CRegisterPage,
  B2CDashboardPage,
  B2COnboardingPage,
  B2CJournalPage,
  B2CMusicPage,
  B2CScanPage,
  B2CCoachPage,
  B2CVRPage,
  B2CGamificationPage,
  B2CSocialPage,
  B2CSettingsPage,
  B2BUserLoginPage,
  B2BUserRegisterPage,
  B2BUserDashboardPage,
  B2BUserScanPage,
  B2BUserCoachPage,
  B2BUserMusicPage,
  B2BAdminLoginPage,
  B2BAdminDashboardPage
} from '@/utils/lazyComponents';

import ProtectedRoute from '@/components/ProtectedRoute';

const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement de la page..." />
      </div>
    }>
      <Routes>
        {/* Routes communes */}
        <Route path="/" element={<ImmersiveHome />} />
        <Route path="/philosophy" element={<PhilosophyJourney />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/choose-mode" element={<ImmersiveHome />} />
        
        {/* Routes B2B */}
        <Route path="/b2b/selection" element={<B2BSelectionPage />} />
        
        {/* Routes B2B User */}
        <Route path="/b2b/user/login" element={<B2BUserLoginPage />} />
        <Route path="/b2b/user/register" element={<B2BUserRegisterPage />} />
        <Route 
          path="/b2b/user/dashboard" 
          element={
            <ProtectedRoute requiredRole="b2b_user">
              <B2BUserDashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/b2b/user/scan" 
          element={
            <ProtectedRoute requiredRole="b2b_user">
              <B2BUserScanPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/b2b/user/coach" 
          element={
            <ProtectedRoute requiredRole="b2b_user">
              <B2BUserCoachPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/b2b/user/music" 
          element={
            <ProtectedRoute requiredRole="b2b_user">
              <B2BUserMusicPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Routes B2B Admin */}
        <Route path="/b2b/admin/login" element={<B2BAdminLoginPage />} />
        <Route 
          path="/b2b/admin/dashboard" 
          element={
            <ProtectedRoute requiredRole="b2b_admin">
              <B2BAdminDashboardPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Routes B2C */}
        <Route path="/b2c/login" element={<B2CLoginPage />} />
        <Route path="/b2c/register" element={<B2CRegisterPage />} />
        <Route 
          path="/b2c/onboarding" 
          element={
            <ProtectedRoute requiredRole="b2c">
              <B2COnboardingPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/b2c/dashboard" 
          element={
            <ProtectedRoute requiredRole="b2c">
              <B2CDashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/b2c/journal" 
          element={
            <ProtectedRoute requiredRole="b2c">
              <B2CJournalPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/b2c/music" 
          element={
            <ProtectedRoute requiredRole="b2c">
              <B2CMusicPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/b2c/scan" 
          element={
            <ProtectedRoute requiredRole="b2c">
              <B2CScanPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/b2c/coach" 
          element={
            <ProtectedRoute requiredRole="b2c">
              <B2CCoachPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/b2c/vr" 
          element={
            <ProtectedRoute requiredRole="b2c">
              <B2CVRPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/b2c/gamification" 
          element={
            <ProtectedRoute requiredRole="b2c">
              <B2CGamificationPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/b2c/social" 
          element={
            <ProtectedRoute requiredRole="b2c">
              <B2CSocialPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/b2c/settings" 
          element={
            <ProtectedRoute requiredRole="b2c">
              <B2CSettingsPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Route 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
