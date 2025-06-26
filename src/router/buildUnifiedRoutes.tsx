import { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import AuthGuard from '@/components/auth/AuthGuard';
import { OFFICIAL_ROUTES } from '@/routesManifest';

// Import des pages existantes
const HomePage = lazy(() => import('@/pages/HomePage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const B2BSelectionPage = lazy(() => import('@/pages/B2BSelectionPage'));
const HelpCenterPage = lazy(() => import('@/pages/HelpCenterPage'));

// Pages d'authentification
const B2CLoginPage = lazy(() => import('@/pages/auth/B2CLoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/auth/B2CRegisterPage'));
const B2BUserLoginPage = lazy(() => import('@/pages/auth/B2BUserLoginPage'));
const B2BUserRegisterPage = lazy(() => import('@/pages/auth/B2BUserRegisterPage'));
const B2BAdminLoginPage = lazy(() => import('@/pages/auth/B2BAdminLoginPage'));

// Dashboards
const B2CDashboardPage = lazy(() => import('@/pages/dashboards/B2CDashboardPage'));
const B2BUserDashboardPage = lazy(() => import('@/pages/dashboards/B2BUserDashboardPage'));
const B2BAdminDashboardPage = lazy(() => import('@/pages/dashboards/B2BAdminDashboardPage'));

// Pages fonctionnelles principales
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));
const VRPage = lazy(() => import('@/pages/VRPage'));
const GamificationPage = lazy(() => import('@/pages/GamificationPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));

// Nouvelles pages complétées
const PreferencesPage = lazy(() => import('@/pages/PreferencesPage'));
const SocialCoconPage = lazy(() => import('@/pages/SocialCoconPage'));
const TeamsPage = lazy(() => import('@/pages/admin/TeamsPage'));
const ReportsPage = lazy(() => import('@/pages/admin/ReportsPage'));
const BreathworkPage = lazy(() => import('@/pages/features/BreathworkPage'));
const ARFiltersPage = lazy(() => import('@/pages/features/ARFiltersPage'));

// Page 404
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export const ROUTE_MANIFEST = Object.values(OFFICIAL_ROUTES);

export function buildUnifiedRoutes(): RouteObject[] {
  return [
    {
      path: '/',
      element: <Layout />,
      children: [
        // Routes publiques
        { 
          path: OFFICIAL_ROUTES.HOME, 
          element: <HomePage /> 
        },
        { 
          path: OFFICIAL_ROUTES.CHOOSE_MODE, 
          element: <ChooseModePage /> 
        },
        {
          path: OFFICIAL_ROUTES.B2B,
          element: <Navigate to={OFFICIAL_ROUTES.B2B_SELECTION} replace />
        },
        { 
          path: OFFICIAL_ROUTES.B2B_SELECTION, 
          element: <B2BSelectionPage /> 
        },
        { 
          path: OFFICIAL_ROUTES.HELP_CENTER, 
          element: <HelpCenterPage /> 
        },

        // Pages d'authentification
        { 
          path: OFFICIAL_ROUTES.B2C_LOGIN, 
          element: <B2CLoginPage /> 
        },
        { 
          path: OFFICIAL_ROUTES.B2C_REGISTER, 
          element: <B2CRegisterPage /> 
        },
        { 
          path: OFFICIAL_ROUTES.B2B_USER_LOGIN, 
          element: <B2BUserLoginPage /> 
        },
        { 
          path: OFFICIAL_ROUTES.B2B_USER_REGISTER, 
          element: <B2BUserRegisterPage /> 
        },
        { 
          path: OFFICIAL_ROUTES.B2B_ADMIN_LOGIN, 
          element: <B2BAdminLoginPage /> 
        },

        // Routes protégées - Dashboards
        {
          path: OFFICIAL_ROUTES.B2C_DASHBOARD,
          element: (
            <AuthGuard>
              <B2CDashboardPage />
            </AuthGuard>
          )
        },
        {
          path: OFFICIAL_ROUTES.B2B_USER_DASHBOARD,
          element: (
            <AuthGuard>
              <B2BUserDashboardPage />
            </AuthGuard>
          )
        },
        {
          path: OFFICIAL_ROUTES.B2B_ADMIN_DASHBOARD,
          element: (
            <AuthGuard>
              <B2BAdminDashboardPage />
            </AuthGuard>
          )
        },

        // Routes protégées - Fonctionnalités principales
        {
          path: OFFICIAL_ROUTES.SCAN,
          element: (
            <AuthGuard>
              <ScanPage />
            </AuthGuard>
          )
        },
        {
          path: OFFICIAL_ROUTES.MUSIC,
          element: (
            <AuthGuard>
              <MusicPage />
            </AuthGuard>
          )
        },
        {
          path: '/coach',
          element: (
            <AuthGuard>
              <CoachPage />
            </AuthGuard>
          )
        },
        {
          path: '/journal',
          element: (
            <AuthGuard>
              <JournalPage />
            </AuthGuard>
          )
        },
        {
          path: OFFICIAL_ROUTES.VR,
          element: (
            <AuthGuard>
              <VRPage />
            </AuthGuard>
          )
        },
        {
          path: OFFICIAL_ROUTES.GAMIFICATION,
          element: (
            <AuthGuard>
              <GamificationPage />
            </AuthGuard>
          )
        },

        // Routes protégées - Profil et paramètres
        {
          path: '/profile',
          element: (
            <AuthGuard>
              <ProfilePage />
            </AuthGuard>
          )
        },
        {
          path: OFFICIAL_ROUTES.SETTINGS,
          element: (
            <AuthGuard>
              <SettingsPage />
            </AuthGuard>
          )
        },
        {
          path: OFFICIAL_ROUTES.NOTIFICATIONS,
          element: (
            <AuthGuard>
              <NotificationsPage />
            </AuthGuard>
          )
        },
        {
          path: OFFICIAL_ROUTES.PREFERENCES,
          element: (
            <AuthGuard>
              <PreferencesPage />
            </AuthGuard>
          )
        },
        {
          path: OFFICIAL_ROUTES.SOCIAL_COCON,
          element: (
            <AuthGuard>
              <SocialCoconPage />
            </AuthGuard>
          )
        },

        // Routes protégées - Administration B2B
        {
          path: OFFICIAL_ROUTES.TEAMS,
          element: (
            <AuthGuard>
              <TeamsPage />
            </AuthGuard>
          )
        },
        {
          path: OFFICIAL_ROUTES.REPORTS,
          element: (
            <AuthGuard>
              <ReportsPage />
            </AuthGuard>
          )
        },
        {
          path: OFFICIAL_ROUTES.EVENTS,
          element: (
            <AuthGuard>
              <div className="min-h-screen flex items-center justify-center" data-testid="page-root">
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-4">Gestion des Événements</h1>
                  <p className="text-muted-foreground">Page en cours de développement</p>
                </div>
              </div>
            </AuthGuard>
          )
        },
        {
          path: OFFICIAL_ROUTES.OPTIMISATION,
          element: (
            <AuthGuard>
              <div className="min-h-screen flex items-center justify-center" data-testid="page-root">
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-4">Optimisation Système</h1>
                  <p className="text-muted-foreground">Page en cours de développement</p>
                </div>
              </div>
            </AuthGuard>
          )
        },

        // Routes protégées - Fonctionnalités spécialisées
        {
          path: OFFICIAL_ROUTES.BREATHWORK,
          element: (
            <AuthGuard>
              <BreathworkPage />
            </AuthGuard>
          )
        },
        {
          path: OFFICIAL_ROUTES.AR_FILTERS,
          element: (
            <AuthGuard>
              <ARFiltersPage />
            </AuthGuard>
          )
        },
        {
          path: OFFICIAL_ROUTES.MOOD_MIXER,
          element: (
            <AuthGuard>
              <div className="min-h-screen flex items-center justify-center" data-testid="page-root">
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-4">Mélangeur d'Humeurs</h1>
                  <p className="text-muted-foreground">Fonctionnalité en cours de développement</p>
                </div>
              </div>
            </AuthGuard>
          )
        },
        {
          path: OFFICIAL_ROUTES.FLASH_GLOW,
          element: (
            <AuthGuard>
              <div className="min-h-screen flex items-center justify-center" data-testid="page-root">
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-4">Flash Glow</h1>
                  <p className="text-muted-foreground">Expérience flash en cours de développement</p>
                </div>
              </div>
            </AuthGuard>
          )
        },
        {
          path: OFFICIAL_ROUTES.INSTANT_GLOW,
          element: (
            <AuthGuard>
              <div className="min-h-screen flex items-center justify-center" data-testid="page-root">
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-4">Instant Glow</h1>
                  <p className="text-muted-foreground">Bien-être instantané en cours de développement</p>
                </div>
              </div>
            </AuthGuard>
          )
        }
      ]
    },
    {
      path: '*',
      element: <NotFoundPage />
    }
  ];
}
