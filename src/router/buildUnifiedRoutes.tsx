
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Import des layouts
const Layout = lazy(() => import('@/components/layout/Layout'));
const ResponsiveShell = lazy(() => import('@/components/layout/ResponsiveShell'));

// Import des pages publiques
const HomePage = lazy(() => import('@/pages/HomePage'));
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));

// Import des pages d'authentification
const B2CLoginPage = lazy(() => import('@/pages/B2CLoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/B2CRegisterPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));

// Import des pages de dashboard
const B2CDashboardPage = lazy(() => import('@/pages/B2CDashboardPage'));
const B2BUserDashboardPage = lazy(() => import('@/pages/B2BUserDashboardPage'));
const B2BAdminDashboardPage = lazy(() => import('@/pages/B2BAdminDashboardPage'));

// Import des pages fonctionnelles
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));

// Page 404
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

/**
 * Manifeste des routes - VERSION UNIFIÉE
 * Chaque route a un chemin unique absolu
 */
export const ROUTE_MANIFEST = [
  '/',
  '/about',
  '/contact',
  '/b2c/login',
  '/b2c/register',
  '/reset-password',
  '/b2c/dashboard',
  '/b2b/user/dashboard',
  '/b2b/admin/dashboard',
  '/scan',
  '/music',
  '/coach',
  '/journal'
];

/**
 * Fonction utilitaire pour créer un fallback de page
 */
const createPageFallback = (pageName: string) => {
  return () => (
    <div data-testid="page-root" className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">{pageName}</h1>
        <p className="text-muted-foreground">Page en cours de chargement...</p>
      </div>
    </div>
  );
};

/**
 * Configuration des routes unifiées
 */
export function buildUnifiedRoutes(): RouteObject[] {
  return [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <LandingPage />,
        },
        {
          path: 'about',
          element: <AboutPage />,
        },
        {
          path: 'contact',
          element: <ContactPage />,
        },
        {
          path: 'b2c/login',
          element: <B2CLoginPage />,
        },
        {
          path: 'b2c/register',
          element: <B2CRegisterPage />,
        },
        {
          path: 'reset-password',
          element: <ResetPasswordPage />,
        },
      ],
    },
    {
      path: '/b2c',
      element: <ResponsiveShell />,
      children: [
        {
          path: 'dashboard',
          element: <B2CDashboardPage />,
        },
      ],
    },
    {
      path: '/b2b/user',
      element: <ResponsiveShell />,
      children: [
        {
          path: 'dashboard',
          element: <B2BUserDashboardPage />,
        },
      ],
    },
    {
      path: '/b2b/admin',
      element: <ResponsiveShell />,
      children: [
        {
          path: 'dashboard',
          element: <B2BAdminDashboardPage />,
        },
      ],
    },
    {
      path: '/scan',
      element: <ResponsiveShell />,
      children: [
        {
          index: true,
          element: <ScanPage />,
        },
      ],
    },
    {
      path: '/music',
      element: <ResponsiveShell />,
      children: [
        {
          index: true,
          element: <MusicPage />,
        },
      ],
    },
    {
      path: '/coach',
      element: <ResponsiveShell />,
      children: [
        {
          index: true,
          element: <CoachPage />,
        },
      ],
    },
    {
      path: '/journal',
      element: <ResponsiveShell />,
      children: [
        {
          index: true,
          element: <JournalPage />,
        },
      ],
    },
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ];
}

/**
 * Validation du manifeste de routes
 */
export function validateRoutesManifest() {
  const duplicates = ROUTE_MANIFEST.filter((route, index) => 
    ROUTE_MANIFEST.indexOf(route) !== index
  );
  
  return {
    valid: duplicates.length === 0,
    errors: duplicates.length > 0 ? [`Doublons détectés: ${duplicates.join(', ')}`] : [],
    totalRoutes: ROUTE_MANIFEST.length
  };
}
