
import React, { lazy, Suspense } from 'react';
import { createRoutesFromElements, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { ComponentLoadingFallback } from '@/components/ui/loading-fallback';
import EmergencyPage from '@/pages/EmergencyPage';

// Import des pages principales
const HomePage = lazy(() => import('@/pages/HomePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));

// Import des pages de fonctionnalités
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const VRPage = lazy(() => import('@/pages/VRPage'));
const MeditationPage = lazy(() => import('@/pages/MeditationPage'));
const GamificationPage = lazy(() => import('@/pages/GamificationPage'));
const PreferencesPage = lazy(() => import('@/pages/PreferencesPage'));
const EmotionsPage = lazy(() => import('@/pages/EmotionsPage'));

// Import des pages B2B
const B2BSelectionPage = lazy(() => import('@/pages/b2b/B2BSelectionPage'));
const B2BUserLoginPage = lazy(() => import('@/pages/b2b/B2BUserLoginPage'));

const PageLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <ComponentLoadingFallback />
  </div>
);

console.log('🛠️ buildUnifiedRoutes - Building unified routes...');

export const buildUnifiedRoutes = () => {
  console.log('📋 buildUnifiedRoutes - Creating comprehensive route elements...');
  
  const routes = createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<EmergencyPage />}>
      {/* Routes principales */}
      <Route 
        index 
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <HomePage />
          </Suspense>
        } 
      />
      <Route 
        path="choose-mode" 
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <ChooseModePage />
          </Suspense>
        } 
      />
      <Route 
        path="auth" 
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <AuthPage />
          </Suspense>
        } 
      />

      {/* Routes de fonctionnalités */}
      <Route 
        path="scan" 
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <ScanPage />
          </Suspense>
        } 
      />
      <Route 
        path="music" 
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <MusicPage />
          </Suspense>
        } 
      />
      <Route 
        path="journal" 
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <JournalPage />
          </Suspense>
        } 
      />
      <Route 
        path="coach" 
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <CoachPage />
          </Suspense>
        } 
      />
      <Route 
        path="vr" 
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <VRPage />
          </Suspense>
        } 
      />
      <Route 
        path="meditation" 
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <MeditationPage />
          </Suspense>
        } 
      />
      <Route 
        path="gamification" 
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <GamificationPage />
          </Suspense>
        } 
      />
      <Route 
        path="preferences" 
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <PreferencesPage />
          </Suspense>
        } 
      />
      <Route 
        path="emotions" 
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <EmotionsPage />
          </Suspense>
        } 
      />

      {/* Routes B2B */}
      <Route 
        path="b2b" 
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <B2BSelectionPage />
          </Suspense>
        } 
      />
      <Route 
        path="b2b/selection" 
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <B2BSelectionPage />
          </Suspense>
        } 
      />
      <Route 
        path="b2b/user/login" 
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <B2BUserLoginPage />
          </Suspense>
        } 
      />
      
      {/* Route d'urgence */}
      <Route 
        path="emergency" 
        element={<EmergencyPage />} 
      />
      
      {/* Route 404 */}
      <Route 
        path="*" 
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <NotFoundPage />
          </Suspense>
        } 
      />
    </Route>
  );

  console.log('✅ buildUnifiedRoutes - Comprehensive routes created successfully');
  return routes;
};
