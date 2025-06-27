
import React from 'react';
import { RouteObject } from 'react-router-dom';
import { ComponentLoadingFallback } from '@/components/ui/loading-fallback';
import Layout from '@/components/layout/Layout';

// Lazy imports for all pages
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const ChooseModePage = React.lazy(() => import('@/pages/ChooseModePage'));
const AuthPage = React.lazy(() => import('@/pages/AuthPage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));

// Feature pages
const ScanPage = React.lazy(() => import('@/pages/ScanPage'));
const MusicPage = React.lazy(() => import('@/pages/MusicPage'));
const JournalPage = React.lazy(() => import('@/pages/JournalPage'));
const CoachPage = React.lazy(() => import('@/pages/CoachPage'));
const VRPage = React.lazy(() => import('@/pages/VRPage'));
const MeditationPage = React.lazy(() => import('@/pages/MeditationPage'));
const GamificationPage = React.lazy(() => import('@/pages/GamificationPage'));
const PreferencesPage = React.lazy(() => import('@/pages/PreferencesPage'));
const EmotionsPage = React.lazy(() => import('@/pages/EmotionsPage'));
const NotificationsPage = React.lazy(() => import('@/pages/NotificationsPage'));

// B2C pages
const B2CHomePage = React.lazy(() => import('@/pages/b2c/B2CHomePage'));
const B2CLoginPage = React.lazy(() => import('@/pages/b2c/B2CLoginPage'));
const B2CRegisterPage = React.lazy(() => import('@/pages/b2c/B2CRegisterPage'));
const B2CDashboardPage = React.lazy(() => import('@/pages/b2c/B2CDashboardPage'));

// B2B pages
const B2BSelectionPage = React.lazy(() => import('@/pages/b2b/B2BSelectionPage'));
const B2BUserLoginPage = React.lazy(() => import('@/pages/b2b/B2BUserLoginPage'));
const B2BAdminLoginPage = React.lazy(() => import('@/pages/b2b/B2BAdminLoginPage'));
const B2BUserDashboard = React.lazy(() => import('@/pages/b2b/B2BUserDashboard'));
const B2BAdminDashboard = React.lazy(() => import('@/pages/b2b/B2BAdminDashboard'));

// Wrapper component for Suspense
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <React.Suspense fallback={<ComponentLoadingFallback />}>
    {children}
  </React.Suspense>
);

export const buildUnifiedRoutes = (): RouteObject[] => {
  console.log('🚀 Building unified routes...');
  
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <Layout />,
      children: [
        // Home routes
        {
          index: true,
          element: (
            <SuspenseWrapper>
              <HomePage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'choose-mode',
          element: (
            <SuspenseWrapper>
              <ChooseModePage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'auth',
          element: (
            <SuspenseWrapper>
              <AuthPage />
            </SuspenseWrapper>
          ),
        },

        // Feature routes
        {
          path: 'scan',
          element: (
            <SuspenseWrapper>
              <ScanPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'music',
          element: (
            <SuspenseWrapper>
              <MusicPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'journal',
          element: (
            <SuspenseWrapper>
              <JournalPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'coach',
          element: (
            <SuspenseWrapper>
              <CoachPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'vr',
          element: (
            <SuspenseWrapper>
              <VRPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'meditation',
          element: (
            <SuspenseWrapper>
              <MeditationPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'gamification',
          element: (
            <SuspenseWrapper>
              <GamificationPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'preferences',
          element: (
            <SuspenseWrapper>
              <PreferencesPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'emotions',
          element: (
            <SuspenseWrapper>
              <EmotionsPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'notifications',
          element: (
            <SuspenseWrapper>
              <NotificationsPage />
            </SuspenseWrapper>
          ),
        },

        // B2C routes
        {
          path: 'b2c',
          element: (
            <SuspenseWrapper>
              <B2CHomePage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'b2c/login',
          element: (
            <SuspenseWrapper>
              <B2CLoginPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'b2c/register',
          element: (
            <SuspenseWrapper>
              <B2CRegisterPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'b2c/dashboard',
          element: (
            <SuspenseWrapper>
              <B2CDashboardPage />
            </SuspenseWrapper>
          ),
        },

        // B2B routes
        {
          path: 'b2b',
          element: (
            <SuspenseWrapper>
              <B2BSelectionPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'b2b/selection',
          element: (
            <SuspenseWrapper>
              <B2BSelectionPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'b2b/user/login',
          element: (
            <SuspenseWrapper>
              <B2BUserLoginPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'b2b/admin/login',
          element: (
            <SuspenseWrapper>
              <B2BAdminLoginPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'b2b/user/dashboard',
          element: (
            <SuspenseWrapper>
              <B2BUserDashboard />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'b2b/admin/dashboard',
          element: (
            <SuspenseWrapper>
              <B2BAdminDashboard />
            </SuspenseWrapper>
          ),
        },
      ],
    },
    
    // Catch-all route for 404
    {
      path: '*',
      element: (
        <SuspenseWrapper>
          <NotFoundPage />
        </SuspenseWrapper>
      ),
    },
  ];

  console.log('✅ Unified routes built successfully:', routes.length, 'routes');
  return routes;
};
