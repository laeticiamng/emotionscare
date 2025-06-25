
import React, { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';
import LoadingAnimation from '@/components/ui/loading-animation';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';

// Lazy loading des pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const B2BSelectionPage = lazy(() => import('@/pages/B2BSelectionPage'));

// Pages B2C
const B2CLoginPage = lazy(() => import('@/pages/b2c/LoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/b2c/RegisterPage'));
const B2CDashboardPage = lazy(() => import('@/pages/b2c/DashboardPage'));

// Pages B2B User
const B2BUserLoginPage = lazy(() => import('@/pages/b2b/user/LoginPage'));
const B2BUserRegisterPage = lazy(() => import('@/pages/b2b/user/RegisterPage'));
const B2BUserDashboardPage = lazy(() => import('@/pages/b2b/user/DashboardPage'));

// Pages B2B Admin
const B2BAdminLoginPage = lazy(() => import('@/pages/b2b/admin/LoginPage'));
const B2BAdminDashboardPage = lazy(() => import('@/pages/b2b/admin/DashboardPage'));

// Pages de fonctionnalités
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));
const VRPage = lazy(() => import('@/pages/VRPage'));
const PreferencesPage = lazy(() => import('@/pages/PreferencesPage'));
const GamificationPage = lazy(() => import('@/pages/GamificationPage'));
const SocialCoconPage = lazy(() => import('@/pages/SocialCoconPage'));
const TeamsPage = lazy(() => import('@/pages/TeamsPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const EventsPage = lazy(() => import('@/pages/EventsPage'));
const OptimisationPage = lazy(() => import('@/pages/OptimisationPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));

// Pages spéciales
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const HelpCenterPage = lazy(() => import('@/pages/HelpCenterPage'));
const AuditTicketP0Page = lazy(() => import('@/pages/AuditTicketP0Page'));

// Composant de chargement
const PageLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <LoadingAnimation text="Chargement de la page..." />
  </div>
);

// Wrapper avec Suspense et ErrorBoundary
const withSuspenseAndErrorBoundary = (Component: React.ComponentType) => () => (
  <EnhancedErrorBoundary>
    <Suspense fallback={<PageLoadingFallback />}>
      <Component />
    </Suspense>
  </EnhancedErrorBoundary>
);

// Configuration des routes unifiées
export const unifiedRoutes: RouteObject[] = [
  // Routes publiques
  {
    path: UNIFIED_ROUTES.HOME,
    Component: withSuspenseAndErrorBoundary(HomePage),
  },
  {
    path: UNIFIED_ROUTES.CHOOSE_MODE,
    Component: withSuspenseAndErrorBoundary(ChooseModePage),
  },
  {
    path: UNIFIED_ROUTES.B2B_SELECTION,
    Component: withSuspenseAndErrorBoundary(B2BSelectionPage),
  },

  // Routes B2C
  {
    path: UNIFIED_ROUTES.B2C_LOGIN,
    Component: withSuspenseAndErrorBoundary(B2CLoginPage),
  },
  {
    path: UNIFIED_ROUTES.B2C_REGISTER,
    Component: withSuspenseAndErrorBoundary(B2CRegisterPage),
  },
  {
    path: UNIFIED_ROUTES.B2C_DASHBOARD,
    Component: withSuspenseAndErrorBoundary(B2CDashboardPage),
  },

  // Routes B2B User
  {
    path: UNIFIED_ROUTES.B2B_USER_LOGIN,
    Component: withSuspenseAndErrorBoundary(B2BUserLoginPage),
  },
  {
    path: UNIFIED_ROUTES.B2B_USER_REGISTER,
    Component: withSuspenseAndErrorBoundary(B2BUserRegisterPage),
  },
  {
    path: UNIFIED_ROUTES.B2B_USER_DASHBOARD,
    Component: withSuspenseAndErrorBoundary(B2BUserDashboardPage),
  },

  // Routes B2B Admin
  {
    path: UNIFIED_ROUTES.B2B_ADMIN_LOGIN,
    Component: withSuspenseAndErrorBoundary(B2BAdminLoginPage),
  },
  {
    path: UNIFIED_ROUTES.B2B_ADMIN_DASHBOARD,
    Component: withSuspenseAndErrorBoundary(B2BAdminDashboardPage),
  },

  // Routes de fonctionnalités communes
  {
    path: UNIFIED_ROUTES.SCAN,
    Component: withSuspenseAndErrorBoundary(ScanPage),
  },
  {
    path: UNIFIED_ROUTES.MUSIC,
    Component: withSuspenseAndErrorBoundary(MusicPage),
  },
  {
    path: UNIFIED_ROUTES.COACH,
    Component: withSuspenseAndErrorBoundary(CoachPage),
  },
  {
    path: UNIFIED_ROUTES.JOURNAL,
    Component: withSuspenseAndErrorBoundary(JournalPage),
  },
  {
    path: UNIFIED_ROUTES.VR,
    Component: withSuspenseAndErrorBoundary(VRPage),
  },
  {
    path: UNIFIED_ROUTES.PREFERENCES,
    Component: withSuspenseAndErrorBoundary(PreferencesPage),
  },
  {
    path: UNIFIED_ROUTES.GAMIFICATION,
    Component: withSuspenseAndErrorBoundary(GamificationPage),
  },
  {
    path: UNIFIED_ROUTES.SOCIAL_COCON,
    Component: withSuspenseAndErrorBoundary(SocialCoconPage),
  },

  // Routes administrateur
  {
    path: UNIFIED_ROUTES.TEAMS,
    Component: withSuspenseAndErrorBoundary(TeamsPage),
  },
  {
    path: UNIFIED_ROUTES.REPORTS,
    Component: withSuspenseAndErrorBoundary(ReportsPage),
  },
  {
    path: UNIFIED_ROUTES.EVENTS,
    Component: withSuspenseAndErrorBoundary(EventsPage),
  },
  {
    path: UNIFIED_ROUTES.OPTIMISATION,
    Component: withSuspenseAndErrorBoundary(OptimisationPage),
  },
  {
    path: UNIFIED_ROUTES.SETTINGS,
    Component: withSuspenseAndErrorBoundary(SettingsPage),
  },

  // Pages spéciales
  {
    path: '/notifications',
    Component: withSuspenseAndErrorBoundary(NotificationsPage),
  },
  {
    path: '/help-center',
    Component: withSuspenseAndErrorBoundary(HelpCenterPage),
  },
  {
    path: '/audit-ticket-p0',
    Component: withSuspenseAndErrorBoundary(AuditTicketP0Page),
  },
];
