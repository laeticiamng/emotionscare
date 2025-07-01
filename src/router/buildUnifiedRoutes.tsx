
import React, { Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import LoadingAnimation from '@/components/ui/loading-animation';
import MainLayout from '@/components/layout/MainLayout';

// Lazy loading des pages principales
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const ChooseModePage = React.lazy(() => import('@/pages/ChooseModePage'));

// Pages B2C
const B2CHomePage = React.lazy(() => import('@/pages/b2c/B2CHomePage'));
const B2CLoginPage = React.lazy(() => import('@/pages/b2c/B2CLoginPage'));
const B2CRegisterPage = React.lazy(() => import('@/pages/b2c/B2CRegisterPage'));
const B2CDashboardPage = React.lazy(() => import('@/pages/b2c/B2CDashboardPage'));

// Pages B2B
const B2BSelectionPage = React.lazy(() => import('@/pages/b2b/B2BSelectionPage'));
const B2BUserLoginPage = React.lazy(() => import('@/pages/b2b/B2BUserLoginPage'));
const B2BAdminLoginPage = React.lazy(() => import('@/pages/b2b/B2BAdminLoginPage'));
const B2BUserDashboard = React.lazy(() => import('@/pages/b2b/B2BUserDashboard'));
const B2BAdminDashboard = React.lazy(() => import('@/pages/b2b/B2BAdminDashboard'));

// Fonctionnalités communes
const ScanPage = React.lazy(() => import('@/pages/features/ScanPage'));
const MusicPage = React.lazy(() => import('@/pages/features/MusicPage'));
const CoachPage = React.lazy(() => import('@/pages/features/CoachPage'));
const JournalPage = React.lazy(() => import('@/pages/features/JournalPage'));
const VRPage = React.lazy(() => import('@/pages/features/VRPage'));
const PreferencesPage = React.lazy(() => import('@/pages/features/PreferencesPage'));
const GamificationPage = React.lazy(() => import('@/pages/features/GamificationPage'));
const SocialCoconPage = React.lazy(() => import('@/pages/features/SocialCoconPage'));

// Fonctionnalités B2B Admin uniquement
const TeamsPage = React.lazy(() => import('@/pages/b2b/admin/TeamsPage'));
const ReportsPage = React.lazy(() => import('@/pages/b2b/admin/ReportsPage'));
const EventsPage = React.lazy(() => import('@/pages/b2b/admin/EventsPage'));
const OptimisationPage = React.lazy(() => import('@/pages/b2b/admin/OptimisationPage'));
const SettingsPage = React.lazy(() => import('@/pages/b2b/admin/SettingsPage'));

// Wrapper avec Suspense
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingAnimation text="Chargement..." />}>
    {children}
  </Suspense>
);

export function buildUnifiedRoutes(): RouteObject[] {
  return [
    // Routes publiques
    {
      path: '/',
      element: <SuspenseWrapper><HomePage /></SuspenseWrapper>,
    },
    {
      path: '/choose-mode',
      element: <SuspenseWrapper><ChooseModePage /></SuspenseWrapper>,
    },
    
    // Routes B2C
    {
      path: '/b2c',
      children: [
        {
          path: '',
          element: <SuspenseWrapper><B2CHomePage /></SuspenseWrapper>,
        },
        {
          path: 'login',
          element: <SuspenseWrapper><B2CLoginPage /></SuspenseWrapper>,
        },
        {
          path: 'register',
          element: <SuspenseWrapper><B2CRegisterPage /></SuspenseWrapper>,
        },
        {
          path: 'dashboard',
          element: (
            <ProtectedRoute requiredRole="b2c">
              <MainLayout>
                <SuspenseWrapper><B2CDashboardPage /></SuspenseWrapper>
              </MainLayout>
            </ProtectedRoute>
          ),
        },
        // Fonctionnalités B2C
        {
          path: 'scan',
          element: (
            <ProtectedRoute requiredRole="b2c">
              <MainLayout>
                <SuspenseWrapper><ScanPage /></SuspenseWrapper>
              </MainLayout>
            </ProtectedRoute>
          ),
        },
        {
          path: 'music',
          element: (
            <ProtectedRoute requiredRole="b2c">
              <MainLayout>
                <SuspenseWrapper><MusicPage /></SuspenseWrapper>
              </MainLayout>
            </ProtectedRoute>
          ),
        },
        {
          path: 'coach',
          element: (
            <ProtectedRoute requiredRole="b2c">
              <MainLayout>
                <SuspenseWrapper><CoachPage /></SuspenseWrapper>
              </MainLayout>
            </ProtectedRoute>
          ),
        },
        {
          path: 'journal',
          element: (
            <ProtectedRoute requiredRole="b2c">
              <MainLayout>
                <SuspenseWrapper><JournalPage /></SuspenseWrapper>
              </MainLayout>
            </ProtectedRoute>
          ),
        },
        {
          path: 'vr',
          element: (
            <ProtectedRoute requiredRole="b2c">
              <MainLayout>
                <SuspenseWrapper><VRPage /></SuspenseWrapper>
              </MainLayout>
            </ProtectedRoute>
          ),
        },
        {
          path: 'preferences',
          element: (
            <ProtectedRoute requiredRole="b2c">
              <MainLayout>
                <SuspenseWrapper><PreferencesPage /></SuspenseWrapper>
              </MainLayout>
            </ProtectedRoute>
          ),
        },
        {
          path: 'gamification',
          element: (
            <ProtectedRoute requiredRole="b2c">
              <MainLayout>
                <SuspenseWrapper><GamificationPage /></SuspenseWrapper>
              </MainLayout>
            </ProtectedRoute>
          ),
        },
        {
          path: 'social-cocon',
          element: (
            <ProtectedRoute requiredRole="b2c">
              <MainLayout>
                <SuspenseWrapper><SocialCoconPage /></SuspenseWrapper>
              </MainLayout>
            </ProtectedRoute>
          ),
        },
      ],
    },

    // Routes B2B
    {
      path: '/b2b',
      children: [
        {
          path: 'selection',
          element: <SuspenseWrapper><B2BSelectionPage /></SuspenseWrapper>,
        },
        // Routes B2B User
        {
          path: 'user',
          children: [
            {
              path: 'login',
              element: <SuspenseWrapper><B2BUserLoginPage /></SuspenseWrapper>,
            },
            {
              path: 'dashboard',
              element: (
                <ProtectedRoute requiredRole="b2b_user">
                  <MainLayout>
                    <SuspenseWrapper><B2BUserDashboard /></SuspenseWrapper>
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            // Fonctionnalités B2B User
            {
              path: 'scan',
              element: (
                <ProtectedRoute requiredRole="b2b_user">
                  <MainLayout>
                    <SuspenseWrapper><ScanPage /></SuspenseWrapper>
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: 'music',
              element: (
                <ProtectedRoute requiredRole="b2b_user">
                  <MainLayout>
                    <SuspenseWrapper><MusicPage /></SuspenseWrapper>
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: 'coach',
              element: (
                <ProtectedRoute requiredRole="b2b_user">
                  <MainLayout>
                    <SuspenseWrapper><CoachPage /></SuspenseWrapper>
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: 'journal',
              element: (
                <ProtectedRoute requiredRole="b2b_user">
                  <MainLayout>
                    <SuspenseWrapper><JournalPage /></SuspenseWrapper>
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: 'vr',
              element: (
                <ProtectedRoute requiredRole="b2b_user">
                  <MainLayout>
                    <SuspenseWrapper><VRPage /></SuspenseWrapper>
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: 'preferences',
              element: (
                <ProtectedRoute requiredRole="b2b_user">
                  <MainLayout>
                    <SuspenseWrapper><PreferencesPage /></SuspenseWrapper>
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: 'gamification',
              element: (
                <ProtectedRoute requiredRole="b2b_user">
                  <MainLayout>
                    <SuspenseWrapper><GamificationPage /></SuspenseWrapper>
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: 'social-cocon',
              element: (
                <ProtectedRoute requiredRole="b2b_user">
                  <MainLayout>
                    <SuspenseWrapper><SocialCoconPage /></SuspenseWrapper>
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
          ],
        },
        // Routes B2B Admin
        {
          path: 'admin',
          children: [
            {
              path: 'login',
              element: <SuspenseWrapper><B2BAdminLoginPage /></SuspenseWrapper>,
            },
            {
              path: 'dashboard',
              element: (
                <ProtectedRoute requiredRole="b2b_admin">
                  <MainLayout>
                    <SuspenseWrapper><B2BAdminDashboard /></SuspenseWrapper>
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            // Fonctionnalités communes B2B Admin
            {
              path: 'scan',
              element: (
                <ProtectedRoute requiredRole="b2b_admin">
                  <MainLayout>
                    <SuspenseWrapper><ScanPage /></SuspenseWrapper>
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: 'music',
              element: (
                <ProtectedRoute requiredRole="b2b_admin">
                  <MainLayout>
                    <SuspenseWrapper><MusicPage /></SuspenseWrapper>
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: 'coach',
              element: (
                <ProtectedRoute requiredRole="b2b_admin">
                  <MainLayout>
                    <SuspenseWrapper><CoachPage /></SuspenseWrapper>
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: 'journal',
              element: (
                <ProtectedRoute requiredRole="b2b_admin">
                  <MainLayout>
                    <SuspenseWrapper><JournalPage /></SuspenseWrapper>
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: 'vr',
              element: (
                <ProtectedRoute requiredRole="b2b_admin">
                  <MainLayout>
                    <SuspenseWrapper><VRPage /></SuspenseWrapper>
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: 'preferences',
              element: (
                <ProtectedRoute requiredRole="b2b_admin">
                  <MainLayout>
                    <SuspenseWrapper><PreferencesPage /></SuspenseWrapper>
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: 'gamification',
              element: (
                <ProtectedRoute requiredRole="b2b_admin">
                  <MainLayout>
                    <SuspenseWrapper><GamificationPage /></SuspenseWrapper>
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: 'social-cocon',
              element: (
                <ProtectedRoute requiredRole="b2b_admin">
                  <MainLayout>
                    <SuspenseWrapper><SocialCoconPage /></SuspenseWrapper>
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            // Fonctionnalités spécifiques B2B Admin
            {
              path: 'teams',
              element: (
                <ProtectedRoute requiredRole="b2b_admin">
                  <MainLayout>
                    <SuspenseWrapper><TeamsPage /></SuspenseWrapper>
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: 'reports',
              element: (
                <ProtectedRoute requiredRole="b2b_admin">
                  <MainLayout>
                    <SuspenseWrapper><ReportsPage /></SuspenseWrapper>
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: 'events',
              element: (
                <ProtectedRoute requiredRole="b2b_admin">
                  <MainLayout>
                    <SuspenseWrapper><EventsPage /></SuspenseWrapper>
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: 'optimisation',
              element: (
                <ProtectedRoute requiredRole="b2b_admin">
                  <MainLayout>
                    <SuspenseWrapper><OptimisationPage /></SuspenseWrapper>
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: 'settings',
              element: (
                <ProtectedRoute requiredRole="b2b_admin">
                  <MainLayout>
                    <SuspenseWrapper><SettingsPage /></SuspenseWrapper>
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
          ],
        },
      ],
    },

    // Route catch-all pour rediriger vers la page de choix de mode
    {
      path: '*',
      element: <SuspenseWrapper><ChooseModePage /></SuspenseWrapper>,
    },
  ];
}
