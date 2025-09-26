/**
 * RouterV2 - Configuration du routeur principal
 * Point d'entrée unifié pour toute la navigation de l'application
 */

import { createBrowserRouter } from 'react-router-dom';
import { ROUTES_REGISTRY } from './registry';
import * as Sentry from '@sentry/react';
import React, { lazy } from 'react';

// Import massif des composants principaux
const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const HelpPage = lazy(() => import('@/pages/HelpPage'));
const DemoPage = lazy(() => import('@/pages/DemoPage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const HomeB2CPage = lazy(() => import('@/pages/HomeB2CPage'));
const B2BEntreprisePage = lazy(() => import('@/pages/B2BEntreprisePage'));
const B2CDashboardPage = lazy(() => import('@/pages/B2CDashboardPage'));
const B2CScanPage = lazy(() => import('@/pages/B2CScanPage'));
const B2CMusicEnhanced = lazy(() => import('@/pages/B2CMusicEnhanced'));
const B2CAICoachPage = lazy(() => import('@/pages/B2CAICoachPage'));
const B2CJournalPage = lazy(() => import('@/pages/B2CJournalPage'));
const B2CVRBreathGuidePage = lazy(() => import('@/pages/B2CVRBreathGuidePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const UnifiedErrorPage = lazy(() => import('@/pages/errors/404/page'));
const AppGatePage = lazy(() => import('@/pages/AppGatePage'));
const MessagesPage = lazy(() => import('@/pages/MessagesPage'));
const CalendarPage = lazy(() => import('@/pages/CalendarPage'));
const Point20Page = lazy(() => import('@/pages/Point20Page'));
const TestPage = lazy(() => import('@/pages/TestPage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));

// Pages d'erreur
const UnauthorizedPage = lazy(() => import('@/pages/errors/UnauthorizedPage'));
const ForbiddenPage = lazy(() => import('@/pages/errors/ForbiddenPage'));
const ServerErrorPage = lazy(() => import('@/pages/ServerErrorPage'));

// Pages de redirection
const RedirectToScan = lazy(() => import('@/pages/redirects/RedirectToScan'));
const RedirectToJournal = lazy(() => import('@/pages/redirects/RedirectToJournal'));
const RedirectToEntreprise = lazy(() => import('@/pages/redirects/RedirectToEntreprise'));

// ComponentMap étendu avec tous les composants principaux
const componentMap: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  // Pages principales
  HomePage,
  AboutPage,
  ContactPage,
  HelpPage,
  DemoPage,
  OnboardingPage,
  PrivacyPage,
  HomeB2CPage,
  B2BEntreprisePage,
  
  // Auth pages
  LoginPage,
  SignupPage,
  UnifiedLoginPage: LoginPage, // Alias
  
  // App pages
  AppGatePage,
  B2CDashboardPage,
  B2CScanPage,
  B2CMusicEnhanced,
  B2CAICoachPage,
  B2CJournalPage,
  B2CVRBreathGuidePage,
  
  // Utility pages
  MessagesPage,
  CalendarPage,
  Point20Page,
  TestPage,
  ChooseModePage,
  
  // Error pages
  NotFound,
  UnifiedErrorPage,
  UnauthorizedPage,
  ForbiddenPage,
  ServerErrorPage,
  
  // Redirect pages
  RedirectToScan,
  RedirectToJournal,
  RedirectToEntreprise,
  
  // Fallback aliases pour composants manquants (temporaire)
  B2BSelectionPage: HomePage, // Temporaire
  B2BCollabDashboard: B2CDashboardPage, // Temporaire
  B2BRHDashboard: B2CDashboardPage, // Temporaire
};

/**
 * Crée une route React Router à partir d'une configuration de registre
 */
function createRouteFromRegistry(route: any) {
  const Component = componentMap[route.component];
  
  if (!Component) {
    // Log pour debug des composants manquants
    console.warn(`⚠️ RouterV2: Composant manquant '${route.component}' pour la route '${route.path}'`);
    
    // Fallback vers UnifiedErrorPage si le composant n'existe pas
    return {
      path: route.path,
      element: React.createElement(UnifiedErrorPage),
    };
  }

  return {
    path: route.path,
    element: Sentry.withErrorBoundary(Component, {
      tags: { route: route.path, component: route.component },
    }),
    loader: route.loader,
    errorElement: route.errorElement,
  };
}

/**
 * Configuration principale du routeur
 */
export const router = createBrowserRouter(
  ROUTES_REGISTRY.map(createRouteFromRegistry).filter(Boolean),
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

export type AppRouter = typeof router;

// Alias pour compatibilité
export const routerV2 = router;