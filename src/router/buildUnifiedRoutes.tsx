
import React, { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import AuthGuard from '@/components/auth/AuthGuard';
import OptimizedLayout from '@/components/layout/OptimizedLayout';
import LoadingAnimation from '@/components/ui/loading-animation';

// Lazy loading des pages avec protection renforcée
const HomePage = lazy(() => import('@/pages/HomePage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const B2CLoginPage = lazy(() => import('@/pages/b2c/B2CLoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/b2c/B2CRegisterPage'));
const B2BUserLoginPage = lazy(() => import('@/pages/b2b/B2BUserLoginPage'));
const B2BUserRegisterPage = lazy(() => import('@/pages/b2b/B2BUserRegisterPage'));
const B2BAdminLoginPage = lazy(() => import('@/pages/b2b/B2BAdminLoginPage'));
const HelpCenterPage = lazy(() => import('@/pages/HelpCenterPage'));

// Pages protégées
const B2CDashboardPage = lazy(() => import('@/pages/b2c/B2CDashboardPage'));
const B2BUserDashboard = lazy(() => import('@/pages/b2b/B2BUserDashboard'));
const B2BAdminDashboard = lazy(() => import('@/pages/b2b/B2BAdminDashboard'));
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));
const VRPage = lazy(() => import('@/pages/VRPage'));
const PreferencesPage = lazy(() => import('@/pages/PreferencesPage'));
const GamificationPage = lazy(() => import('@/pages/GamificationPage'));
const SocialCoconPage = lazy(() => import('@/pages/SocialCoconPage'));

// Wrapper pour le Suspense avec loading
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center">
      <LoadingAnimation text="Chargement..." size="lg" />
    </div>
  }>
    {children}
  </Suspense>
);

export const buildUnifiedRoutes = (): RouteObject[] => {
  return [
    {
      path: '/',
      element: (
        <AuthGuard>
          <OptimizedLayout />
        </AuthGuard>
      ),
      children: [
        // Routes publiques (whitelist)
        {
          index: true,
          element: (
            <SuspenseWrapper>
              <HomePage />
            </SuspenseWrapper>
          )
        },
        {
          path: 'choose-mode',
          element: (
            <SuspenseWrapper>
              <ChooseModePage />
            </SuspenseWrapper>
          )
        },
        {
          path: 'help-center',
          element: (
            <SuspenseWrapper>
              <HelpCenterPage />
            </SuspenseWrapper>
          )
        },

        // Routes d'authentification B2C (publiques)
        {
          path: 'b2c/login',
          element: (
            <SuspenseWrapper>
              <B2CLoginPage />
            </SuspenseWrapper>
          )
        },
        {
          path: 'b2c/register',
          element: (
            <SuspenseWrapper>
              <B2CRegisterPage />
            </SuspenseWrapper>
          )
        },

        // Routes d'authentification B2B (publiques)
        {
          path: 'b2b/user/login',
          element: (
            <SuspenseWrapper>
              <B2BUserLoginPage />
            </SuspenseWrapper>
          )
        },
        {
          path: 'b2b/user/register',
          element: (
            <SuspenseWrapper>
              <B2BUserRegisterPage />
            </SuspenseWrapper>
          )
        },
        {
          path: 'b2b/admin/login',
          element: (
            <SuspenseWrapper>
              <B2BAdminLoginPage />
            </SuspenseWrapper>
          )
        },

        // Toutes les autres routes sont PROTÉGÉES par AuthGuard
        // Dashboards
        {
          path: 'b2c/dashboard',
          element: (
            <SuspenseWrapper>
              <B2CDashboardPage />
            </SuspenseWrapper>
          )
        },
        {
          path: 'b2b/user/dashboard',
          element: (
            <SuspenseWrapper>
              <B2BUserDashboard />
            </SuspenseWrapper>
          )
        },
        {
          path: 'b2b/admin/dashboard',
          element: (
            <SuspenseWrapper>
              <B2BAdminDashboard />
            </SuspenseWrapper>
          )
        },

        // Fonctionnalités communes (TOUTES PROTÉGÉES)
        {
          path: 'scan',
          element: (
            <SuspenseWrapper>
              <ScanPage />
            </SuspenseWrapper>
          )
        },
        {
          path: 'music',
          element: (
            <SuspenseWrapper>
              <MusicPage />
            </SuspenseWrapper>
          )
        },
        {
          path: 'coach',
          element: (
            <SuspenseWrapper>
              <CoachPage />
            </SuspenseWrapper>
          )
        },
        {
          path: 'journal',
          element: (
            <SuspenseWrapper>
              <JournalPage />
            </SuspenseWrapper>
          )
        },
        {
          path: 'vr',
          element: (
            <SuspenseWrapper>
              <VRPage />
            </SuspenseWrapper>
          )
        },
        {
          path: 'preferences',
          element: (
            <SuspenseWrapper>
              <PreferencesPage />
            </SuspenseWrapper>
          )
        },
        {
          path: 'gamification',
          element: (
            <SuspenseWrapper>
              <GamificationPage />
            </SuspenseWrapper>
          )
        },
        {
          path: 'social-cocon',
          element: (
            <SuspenseWrapper>
              <SocialCoconPage />
            </SuspenseWrapper>
          )
        },

        // Redirections pour compatibilité
        {
          path: 'b2b',
          element: <Navigate to="/b2b/user/login" replace />
        }
      ]
    },

    // Route catch-all pour les 404
    {
      path: '*',
      element: <Navigate to="/" replace />
    }
  ];
};
