import React, { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { homeRoutes } from './routes/homeRoutes';
import { authRoutes } from './routes/authRoutes';
import { userRoutes } from './routes/userRoutes';
import { securityRoutes } from './routes/securityRoutes';
import { notificationRoutes } from './routes/notificationRoutes';
import { accessRoutes } from './routes/accessRoutes';
import { feedbackRoutes } from './routes/feedbackRoutes';
import { innovationRoutes } from './routes/innovationRoutes';
import { privacyRoutes } from './routes/privacyRoutes';
import { legalRoutes } from './routes/legalRoutes';
import { scanRoutes } from './routes/scanRoutes';
import { musicRoutes } from './routes/musicRoutes';
import { vrRoutes } from './routes/vrRoutes';
import { gamificationRoutes } from './routes/gamificationRoutes';
import { onboardingRoutes } from './routes/onboardingRoutes';
import { b2bRedirectRoutes } from './routes/b2bRedirectRoutes';
import { coachRoutes } from './routes/coachRoutes';
import { rhRoutes } from './routes/rhRoutes';
import { settingsRoutes } from './routes/settingsRoutes';
import { journalRoutes } from './routes/journalRoutes';
import { emotionRoutes } from './routes/emotionRoutes';
import { wellnessRoutes } from './routes/wellnessRoutes';
import { auditRoutes } from './routes/auditRoutes';
import { accessibilityRoutes } from './routes/accessibilityRoutes';
import { reportsRoutes } from './routes/reportsRoutes';
import { auditCompleteRoutes } from './routes/auditCompleteRoutes';
import Shell from '@/Shell';
import LoadingAnimation from '@/components/ui/loading-animation';
import ErrorBoundary from '@/components/ErrorBoundary';
import NotFoundPage from '@/pages/NotFoundPage';
import B2CLoginPage from '@/pages/B2CLoginPage';
import B2CRegisterPage from '@/pages/B2CRegisterPage';
import B2CPage from '@/pages/B2CPage';
import B2CDashboardPage from '@/pages/B2CDashboardPage';
import B2BSelectionPage from '@/pages/B2BSelectionPage';
import B2BUserLoginPage from '@/pages/B2BUserLoginPage';
import B2BUserRegisterPage from '@/pages/B2BUserRegisterPage';
import B2BAdminLoginPage from '@/pages/B2BAdminLoginPage';
import B2BUserDashboardPage from '@/pages/B2BUserDashboardPage';
import B2BAdminDashboardPage from '@/pages/B2BAdminDashboardPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import PreferencesPage from '@/pages/PreferencesPage';
import NotificationsPage from '@/pages/NotificationsPage';
import SocialCoconPage from '@/pages/SocialCoconPage';
import BreathworkPage from '@/pages/BreathworkPage';
import ARFiltersPage from '@/pages/ARFiltersPage';
import EventsPage from '@/pages/EventsPage';
import OptimisationPage from '@/pages/OptimisationPage';
import HelpCenterPage from '@/pages/HelpCenterPage';
import FeedbackPage from '@/pages/FeedbackPage';

interface RouteDefinition {
  path: string;
  component: string;
}

// Manifest complet de toutes les routes - 40 pages
export const ROUTE_MANIFEST = [
  // Pages publiques (3)
  '/',
  '/choose-mode',
  '/auth',

  // Pages d'authentification B2C (3)
  '/b2c',
  '/b2c/login',
  '/b2c/register',

  // Pages B2B (5)
  '/b2b/selection',
  '/b2b/user/login',
  '/b2b/user/register',
  '/b2b/admin/login',

  // Dashboards (3)
  '/b2c/dashboard',
  '/b2b/user/dashboard',
  '/b2b/admin/dashboard',

  // Fonctionnalités principales (8)
  '/scan',
  '/music',
  '/coach',
  '/journal',
  '/vr',
  '/meditation',
  '/gamification',
  '/breathwork',

  // Pages utilisateur (5)
  '/profile',
  '/settings', 
  '/preferences',
  '/notifications',
  '/social-cocon',

  // Pages administration (4)
  '/teams',
  '/reports',
  '/events',
  '/optimisation',

  // Pages système et support (6)
  '/security',
  '/audit',
  '/accessibility',
  '/innovation',
  '/privacy-toggles',
  '/ar-filters',

  // Pages support et feedback (4)
  '/help-center',
  '/feedback',
  '/complete-audit',
  '/access-diagnostic'
];

export function buildUnifiedRoutes(): RouteObject[] {
  return [
    {
      path: '/',
      element: (
        <ErrorBoundary>
          <Suspense fallback={<LoadingAnimation text="Chargement de la page d'accueil..." />}>
            <Shell>
              <React.Suspense fallback={<LoadingAnimation text="Chargement..." />}>
                {homeRoutes[0].element}
              </React.Suspense>
            </Shell>
          </Suspense>
        </ErrorBoundary>
      ),
      children: homeRoutes,
    },
    {
      path: '/choose-mode',
      element: (
        <ErrorBoundary>
          <Suspense fallback={<LoadingAnimation text="Chargement de la page de choix du mode..." />}>
            <Shell>
              <React.Suspense fallback={<LoadingAnimation text="Chargement..." />}>
                {homeRoutes[1].element}
              </React.Suspense>
            </Shell>
          </Suspense>
        </ErrorBoundary>
      ),
    },
    {
      path: '/auth',
      element: (
        <ErrorBoundary>
          <Suspense fallback={<LoadingAnimation text="Chargement de la page d'authentification..." />}>
            <Shell>
              <React.Suspense fallback={<LoadingAnimation text="Chargement..." />}>
                {homeRoutes[2].element}
              </React.Suspense>
            </Shell>
          </Suspense>
        </ErrorBoundary>
      ),
    },
    {
      path: '/b2c',
      element: <B2CPage />,
    },
    {
      path: '/b2c/login',
      element: <B2CLoginPage />,
    },
    {
      path: '/b2c/register',
      element: <B2CRegisterPage />,
    },
    {
      path: '/b2b/selection',
      element: <B2BSelectionPage />,
    },
    {
      path: '/b2b/user/login',
      element: <B2BUserLoginPage />,
    },
    {
      path: '/b2b/user/register',
      element: <B2BUserRegisterPage />,
    },
    {
      path: '/b2b/admin/login',
      element: <B2BAdminLoginPage />,
    },
    {
      path: '/b2c/dashboard',
      element: (
        <Suspense fallback={<LoadingAnimation text="Chargement du tableau de bord..." />}>
          <Shell>
            <B2CDashboardPage />
          </Shell>
        </Suspense>
      ),
    },
    {
      path: '/b2b/user/dashboard',
      element: (
        <Suspense fallback={<LoadingAnimation text="Chargement du tableau de bord utilisateur..." />}>
          <Shell>
            <B2BUserDashboardPage />
          </Shell>
        </Suspense>
      ),
    },
    {
      path: '/b2b/admin/dashboard',
      element: (
        <Suspense fallback={<LoadingAnimation text="Chargement du tableau de bord administrateur..." />}>
          <Shell>
            <B2BAdminDashboardPage />
          </Shell>
        </Suspense>
      ),
    },
    {
      path: '/profile',
      element: (
        <Suspense fallback={<LoadingAnimation text="Chargement du profil..." />}>
          <Shell>
            <ProfilePage />
          </Shell>
        </Suspense>
      ),
    },
    {
      path: '/settings',
      element: (
        <Suspense fallback={<LoadingAnimation text="Chargement des paramètres..." />}>
          <Shell>
            <SettingsPage />
          </Shell>
        </Suspense>
      ),
    },
    {
      path: '/preferences',
      element: (
        <Suspense fallback={<LoadingAnimation text="Chargement des préférences..." />}>
          <Shell>
            <PreferencesPage />
          </Shell>
        </Suspense>
      ),
    },
    {
      path: '/notifications',
      element: (
        <Suspense fallback={<LoadingAnimation text="Chargement des notifications..." />}>
          <Shell>
            <NotificationsPage />
          </Shell>
        </Suspense>
      ),
    },
    {
      path: '/social-cocon',
      element: (
        <Suspense fallback={<LoadingAnimation text="Chargement de l'espace social..." />}>
          <Shell>
            <SocialCoconPage />
          </Shell>
        </Suspense>
      ),
    },
    {
      path: '/breathwork',
      element: (
        <Suspense fallback={<LoadingAnimation text="Chargement des exercices de respiration..." />}>
          <Shell>
            <BreathworkPage />
          </Shell>
        </Suspense>
      ),
    },
    {
      path: '/ar-filters',
      element: (
        <Suspense fallback={<LoadingAnimation text="Chargement des filtres AR..." />}>
          <Shell>
            <ARFiltersPage />
          </Shell>
        </Suspense>
      ),
    },
    {
      path: '/scan',
      element: (
        <Suspense fallback={<LoadingAnimation text="Chargement du scanner..." />}>
          <Shell>
            {scanRoutes[0].element}
          </Shell>
        </Suspense>
      ),
    },
    {
      path: '/music',
      element: (
        <Suspense fallback={<LoadingAnimation text="Chargement de la musicothérapie..." />}>
          <Shell>
            {musicRoutes[0].element}
          </Shell>
        </Suspense>
      ),
    },
    {
      path: '/vr',
      element: (
        <Suspense fallback={<LoadingAnimation text="Chargement de la VR..." />}>
          <Shell>
            {vrRoutes[0].element}
          </Shell>
        </Suspense>
      ),
    },
    {
      path: '/meditation',
      element: (
        <Suspense fallback={<LoadingAnimation text="Chargement de la méditation..." />}>
          <Shell>
            {vrRoutes[1].element}
          </Shell>
        </Suspense>
      ),
    },
    {
      path: '/gamification',
      element: (
        <Suspense fallback={<LoadingAnimation text="Chargement de la gamification..." />}>
          <Shell>
            <GamificationPage />
          </Shell>
        </Suspense>
      ),
    },
    {
      path: '/teams',
      element: (
        <Suspense fallback={<LoadingAnimation text="Chargement de la gestion des équipes..." />} >
          <Shell>
            <div>Teams</div>
          </Shell>
        </Suspense>
      ),
    },
    {
      path: '/reports',
      element: (
        <Suspense fallback={<LoadingAnimation text="Chargement des rapports..." />} >
          <Shell>
            <div>Reports</div>
          </Shell>
        </Suspense>
      ),
    },
    {
      path: '/security',
      element: (
        <Suspense fallback={<LoadingAnimation text="Chargement de la sécurité..." />} >
          <Shell>
            {securityRoutes[0].element}
          </Shell>
        </Suspense>
      ),
    },
    {
      path: '/audit',
      element: (
        <Suspense fallback={<LoadingAnimation text="Chargement de l'audit..." />} >
          <Shell>
            <div>Audit</div>
          </Shell>
        </Suspense>
      ),
    },
    {
      path: '/accessibility',
      element: (
        <Suspense fallback={<LoadingAnimation text="Chargement de l'accessibilité..." />} >
          <Shell>
            <div>Accessibility</div>
          </Shell>
        </Suspense>
      ),
    },
    {
      path: '/innovation',
      element: (
        <Suspense fallback={<LoadingAnimation text="Chargement de l'innovation..." />} >
          <Shell>
            <div>Innovation</div>
          </Shell>
        </Suspense>
      ),
    },
    {
      path: '/privacy-toggles',
      element: (
        <Suspense fallback={<LoadingAnimation text="Chargement de la confidentialité..." />} >
          <Shell>
            <div>Privacy Toggles</div>
          </Shell>
        </Suspense>
      ),
    },
    {
      path: '/complete-audit',
      element: (
        <Suspense fallback={<LoadingAnimation text="Chargement de l'audit complet..." />} >
          <Shell>
            <div>Complete Audit</div>
          </Shell>
        </Suspense>
      ),
    },
    {
      path: '/access-diagnostic',
      element: (
        <Suspense fallback={<LoadingAnimation text="Chargement du diagnostic d'accès..." />} >
          <Shell>
            <div>Access Diagnostic</div>
          </Shell>
        </Suspense>
      ),
    },
    {
      path: '/events',
      element: (
        <ProtectedRoute>
          <EventsPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/optimisation',
      element: (
        <ProtectedRoute>
          <OptimisationPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/help-center',
      element: <HelpCenterPage />,
    },
    {
      path: '/feedback',
      element: (
        <ProtectedRoute>
          <FeedbackPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '*',
      element: (
        <ErrorBoundary>
          <Shell>
            <NotFoundPage />
          </Shell>
        </ErrorBoundary>
      ),
    },
  ];
}

// Validation automatique de la cohérence du manifeste
export const validateRoutesManifest = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Vérifier que chaque route du manifeste a une définition dans buildUnifiedRoutes
  ROUTE_MANIFEST.forEach(route => {
    const routeExists = buildUnifiedRoutes().some(r => r.path === route);
    if (!routeExists) {
      errors.push(`Route "${route}" du manifeste n'est pas définie dans buildUnifiedRoutes`);
    }
  });
  
  // Vérifier qu'il n'y a pas de routes orphelines dans buildUnifiedRoutes
  buildUnifiedRoutes().forEach(route => {
    if (route.path) {
      const routeInManifest = ROUTE_MANIFEST.includes(route.path);
      if (!routeInManifest) {
        errors.push(`Route "${route.path}" définie dans buildUnifiedRoutes n'est pas dans le manifeste`);
      }
    }
  });
  
  if (new Set(ROUTE_MANIFEST).size !== ROUTE_MANIFEST.length) {
    errors.push('Le manifeste contient des routes dupliquées');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
};
