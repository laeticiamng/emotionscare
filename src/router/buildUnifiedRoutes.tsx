
import React, { Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingAnimation from '@/components/ui/loading-animation';

// Lazy loading des pages
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const ChooseModePage = React.lazy(() => import('@/pages/ChooseModePage'));
const AuthPage = React.lazy(() => import('@/pages/AuthPage'));

// Pages B2C
const B2CHomePage = React.lazy(() => import('@/pages/b2c/B2CHomePage'));
const B2CLoginPage = React.lazy(() => import('@/pages/b2c/B2CLoginPage'));
const B2CRegisterPage = React.lazy(() => import('@/pages/b2c/B2CRegisterPage'));
const B2CDashboardPage = React.lazy(() => import('@/pages/b2c/B2CDashboardPage'));

// Pages B2B
const B2BSelectionPage = React.lazy(() => import('@/pages/b2b/B2BSelectionPage'));
const B2BUserLoginPage = React.lazy(() => import('@/pages/b2b/B2BUserLoginPage'));
const B2BUserRegisterPage = React.lazy(() => import('@/pages/b2b/B2BUserRegisterPage'));
const B2BAdminLoginPage = React.lazy(() => import('@/pages/b2b/B2BAdminLoginPage'));
const B2BUserDashboard = React.lazy(() => import('@/pages/b2b/B2BUserDashboard'));
const B2BAdminDashboard = React.lazy(() => import('@/pages/b2b/B2BAdminDashboard'));

// Pages de fonctionnalités
const ScanPage = React.lazy(() => import('@/pages/ScanPage'));
const MusicPage = React.lazy(() => import('@/pages/MusicPage'));
const CoachPage = React.lazy(() => import('@/pages/CoachPage'));
const JournalPage = React.lazy(() => import('@/pages/JournalPage'));
const VRPage = React.lazy(() => import('@/pages/VRPage'));
const MeditationPage = React.lazy(() => import('@/pages/MeditationPage'));
const GamificationPage = React.lazy(() => import('@/pages/GamificationPage'));
const PreferencesPage = React.lazy(() => import('@/pages/PreferencesPage'));
const SocialCoconPage = React.lazy(() => import('@/pages/SocialCoconPage'));
const BreathworkPage = React.lazy(() => import('@/pages/features/BreathworkPage'));
const ARFiltersPage = React.lazy(() => import('@/pages/features/ARFiltersPage'));

// Pages d'administration
const TeamsPage = React.lazy(() => import('@/pages/admin/TeamsPage'));
const ReportsPage = React.lazy(() => import('@/pages/admin/ReportsPage'));

// Pages système
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'));
const NotificationsPage = React.lazy(() => import('@/pages/NotificationsPage'));
const SecurityPage = React.lazy(() => import('@/pages/SecurityPage'));
const AccessibilityPage = React.lazy(() => import('@/pages/AccessibilityPage'));
const SystemAuditPage = React.lazy(() => import('@/pages/SystemAuditPage'));
const InnovationLabPage = React.lazy(() => import('@/pages/InnovationLabPage'));
const PrivacyDashboardPage = React.lazy(() => import('@/pages/PrivacyDashboardPage'));
const HelpCenterPage = React.lazy(() => import('@/pages/HelpCenterPage'));

// Page 404
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));

// Wrapper pour Suspense avec ErrorBoundary
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary>
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingAnimation text="Chargement..." />
      </div>
    }>
      {children}
    </Suspense>
  </ErrorBoundary>
);

export const ROUTE_MANIFEST = [
  '/',
  '/choose-mode',
  '/auth',
  '/b2c',
  '/b2c/login',
  '/b2c/register',
  '/b2c/dashboard',
  '/b2b/selection',
  '/b2b/user/login',
  '/b2b/user/register',
  '/b2b/user/dashboard',
  '/b2b/admin/login',
  '/b2b/admin/dashboard',
  '/scan',
  '/music',
  '/coach',
  '/journal',
  '/vr',
  '/meditation',
  '/gamification',
  '/preferences',
  '/social-cocon',
  '/breathwork',
  '/ar-filters',
  '/teams',
  '/reports',
  '/profile',
  '/settings',
  '/notifications',
  '/security',
  '/accessibility',
  '/audit',
  '/innovation',
  '/privacy',
  '/help-center'
];

export const validateRoutesManifest = () => {
  const duplicates = ROUTE_MANIFEST.filter((route, index) => 
    ROUTE_MANIFEST.indexOf(route) !== index
  );
  
  return {
    valid: duplicates.length === 0,
    errors: duplicates.length > 0 ? [`Duplicate routes found: ${duplicates.join(', ')}`] : []
  };
};

export function buildUnifiedRoutes(): RouteObject[] {
  const routes: RouteObject[] = [
    // Routes publiques
    {
      path: '/',
      element: <PageWrapper><HomePage /></PageWrapper>
    },
    {
      path: '/choose-mode',
      element: <PageWrapper><ChooseModePage /></PageWrapper>
    },
    {
      path: '/auth',
      element: <PageWrapper><AuthPage /></PageWrapper>
    },

    // Routes B2C
    {
      path: '/b2c',
      element: <PageWrapper><B2CHomePage /></PageWrapper>
    },
    {
      path: '/b2c/login',
      element: <PageWrapper><B2CLoginPage /></PageWrapper>
    },
    {
      path: '/b2c/register',
      element: <PageWrapper><B2CRegisterPage /></PageWrapper>
    },
    {
      path: '/b2c/dashboard',
      element: <PageWrapper><B2CDashboardPage /></PageWrapper>
    },

    // Routes B2B
    {
      path: '/b2b',
      element: <PageWrapper><B2BSelectionPage /></PageWrapper>
    },
    {
      path: '/b2b/selection',
      element: <PageWrapper><B2BSelectionPage /></PageWrapper>
    },
    {
      path: '/b2b/user/login',
      element: <PageWrapper><B2BUserLoginPage /></PageWrapper>
    },
    {
      path: '/b2b/user/register',
      element: <PageWrapper><B2BUserRegisterPage /></PageWrapper>
    },
    {
      path: '/b2b/user/dashboard',
      element: <PageWrapper><B2BUserDashboard /></PageWrapper>
    },
    {
      path: '/b2b/admin/login',
      element: <PageWrapper><B2BAdminLoginPage /></PageWrapper>
    },
    {
      path: '/b2b/admin/dashboard',
      element: <PageWrapper><B2BAdminDashboard /></PageWrapper>
    },

    // Routes de fonctionnalités
    {
      path: '/scan',
      element: <PageWrapper><ScanPage /></PageWrapper>
    },
    {
      path: '/music',
      element: <PageWrapper><MusicPage /></PageWrapper>
    },
    {
      path: '/coach',
      element: <PageWrapper><CoachPage /></PageWrapper>
    },
    {
      path: '/journal',
      element: <PageWrapper><JournalPage /></PageWrapper>
    },
    {
      path: '/vr',
      element: <PageWrapper><VRPage /></PageWrapper>
    },
    {
      path: '/meditation',
      element: <PageWrapper><MeditationPage /></PageWrapper>
    },
    {
      path: '/gamification',
      element: <PageWrapper><GamificationPage /></PageWrapper>
    },
    {
      path: '/preferences',
      element: <PageWrapper><PreferencesPage /></PageWrapper>
    },
    {
      path: '/social-cocon',
      element: <PageWrapper><SocialCoconPage /></PageWrapper>
    },
    {
      path: '/breathwork',
      element: <PageWrapper><BreathworkPage /></PageWrapper>
    },
    {
      path: '/ar-filters',
      element: <PageWrapper><ARFiltersPage /></PageWrapper>
    },

    // Routes d'administration
    {
      path: '/teams',
      element: <PageWrapper><TeamsPage /></PageWrapper>
    },
    {
      path: '/reports',
      element: <PageWrapper><ReportsPage /></PageWrapper>
    },

    // Routes système
    {
      path: '/profile',
      element: <PageWrapper><ProfilePage /></PageWrapper>
    },
    {
      path: '/settings',
      element: <PageWrapper><SettingsPage /></PageWrapper>
    },
    {
      path: '/notifications',
      element: <PageWrapper><NotificationsPage /></PageWrapper>
    },
    {
      path: '/security',
      element: <PageWrapper><SecurityPage /></PageWrapper>
    },
    {
      path: '/accessibility',
      element: <PageWrapper><AccessibilityPage /></PageWrapper>
    },
    {
      path: '/audit',
      element: <PageWrapper><SystemAuditPage /></PageWrapper>
    },
    {
      path: '/innovation',
      element: <PageWrapper><InnovationLabPage /></PageWrapper>
    },
    {
      path: '/privacy',
      element: <PageWrapper><PrivacyDashboardPage /></PageWrapper>
    },
    {
      path: '/help-center',
      element: <PageWrapper><HelpCenterPage /></PageWrapper>
    },

    // Route 404 - doit être en dernier
    {
      path: '*',
      element: <PageWrapper><NotFoundPage /></PageWrapper>
    }
  ];

  return routes;
}

export default buildUnifiedRoutes;
