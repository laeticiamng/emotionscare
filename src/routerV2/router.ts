/**
 * RouterV2 - Configuration du routeur principal
 * Point d'entrée unifié pour toute la navigation de l'application
 */

import { createBrowserRouter } from 'react-router-dom';
import { ROUTES_REGISTRY } from './registry';
import * as Sentry from '@sentry/react';
import React, { lazy } from 'react';

// Import des composants principaux
const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const HelpPage = lazy(() => import('@/pages/HelpPage'));
const DemoPage = lazy(() => import('@/pages/DemoPage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
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

// ComponentMap étendu avec les pages existantes
const componentMap: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  HomePage,
  AboutPage,
  ContactPage,
  HelpPage,
  DemoPage,
  OnboardingPage,
  PrivacyPage,
  B2CDashboardPage,
  B2CScanPage,
  B2CMusicEnhanced,
  B2CAICoachPage,
  B2CJournalPage,
  B2CVRBreathGuidePage,
  LoginPage,
  SignupPage,
  NotFound,
  UnifiedErrorPage,
  AppGatePage,
  // Alias pour les composants de redirect manquants
  UnifiedLoginPage: LoginPage,
  HomeB2CPage: HomePage,
  B2BEntreprisePage: HomePage,
};

/**
 * Crée une route React Router à partir d'une configuration de registre
 */
function createRouteFromRegistry(route: any) {
  const Component = componentMap[route.component];
  
  if (!Component) {
    // Fallback vers NotFound si le composant n'existe pas
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