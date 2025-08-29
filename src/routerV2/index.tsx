/**
 * RouterV2 - Router unifié principal
 * TICKET: FE/BE-Router-Cleanup-01
 */

import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { ROUTES_REGISTRY } from './registry';
import { ROUTE_ALIASES, findRedirectFor } from './aliases';
import { RouteGuard } from './guards';
import LoadingAnimation from '@/components/ui/loading-animation';
import EnhancedShell from '@/components/layout/EnhancedShell';

// RouterV2 est maintenant activé par défaut - plus de feature flag
const FF_ROUTER_V2 = true;

// ═══════════════════════════════════════════════════════════
// LAZY IMPORTS DES PAGES
// ═══════════════════════════════════════════════════════════

// Pages publiques
const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/GenericPage'));
const HelpPage = lazy(() => import('@/pages/HelpPage'));

// Auth & Landing  
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const HomeB2CPage = lazy(() => import('@/pages/HomeB2CPage'));
const HomeB2BPage = lazy(() => import('@/pages/HomeB2BPage'));

// Dashboards
const B2CDashboardPage = lazy(() => import('@/pages/B2CDashboardPage'));
const B2BUserDashboardPage = lazy(() => import('@/pages/B2BUserDashboardPage'));
const B2BAdminDashboardPage = lazy(() => import('@/pages/B2BAdminDashboardPage'));
const AppGatePage = lazy(() => import('@/pages/AppGatePage'));

// Modules fonctionnels
const B2CScanPage = lazy(() => import('@/pages/B2CScanPage'));
const B2CMusicPage = lazy(() => import('@/pages/B2CMusicPage'));
const B2CCoachPage = lazy(() => import('@/pages/B2CCoachPage'));
const B2CJournalPage = lazy(() => import('@/pages/B2CJournalPage'));
const B2CVRPage = lazy(() => import('@/pages/B2CVRPage'));

// Modules Fun-First
const B2CFlashGlowPage = lazy(() => import('@/pages/B2CFlashGlowPage'));
const B2CBreathworkPage = lazy(() => import('@/pages/B2CBreathworkPage'));
const B2CARFiltersPage = lazy(() => import('@/pages/B2CARFiltersPage'));
const B2CBubbleBeatPage = lazy(() => import('@/pages/B2CBubbleBeatPage'));
const B2CScreenSilkBreakPage = lazy(() => import('@/pages/B2CScreenSilkBreakPage'));
const B2CVRGalactiquePage = lazy(() => import('@/pages/B2CVRGalactiquePage'));

// Analytics
const B2CGamificationPage = lazy(() => import('@/pages/B2CGamificationPage'));
const B2CWeeklyBarsPage = lazy(() => import('@/pages/B2CWeeklyBarsPage'));
const B2CHeatmapVibesPage = lazy(() => import('@/pages/B2CHeatmapVibesPage'));

// Paramètres
const B2CSettingsPage = lazy(() => import('@/pages/B2CSettingsPage'));
const B2CProfileSettingsPage = lazy(() => import('@/pages/B2CProfileSettingsPage'));
const B2CPrivacyTogglesPage = lazy(() => import('@/pages/B2CPrivacyTogglesPage'));
const B2CNotificationsPage = lazy(() => import('@/pages/B2CNotificationsPage'));

// B2B Features - use new dedicated page for Teams, GenericPage for others
const B2BTeamsPage = lazy(() => import('@/pages/B2BTeamsPage'));
const B2BSocialCoconPage = lazy(() => import('@/pages/GenericPage').then(m => ({ default: m.B2BAdminSocialCoconPage })));
const B2BReportsPage = lazy(() => import('@/pages/GenericPage').then(m => ({ default: m.B2BAdminReportsPage })));
const B2BEventsPage = lazy(() => import('@/pages/GenericPage').then(m => ({ default: m.B2BAdminEventsPage })));

// Additional B2B pages - use existing ones
const B2BOptimisationPage = lazy(() => import('@/pages/OptimisationPage'));
const B2BSecurityPage = lazy(() => import('@/pages/SecurityPage'));  
const B2BAuditPage = lazy(() => import('@/pages/AuditPage'));
const B2BAccessibilityPage = lazy(() => import('@/pages/AccessibilityPage'));

// Pages système
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'));
const ForbiddenPage = lazy(() => import('@/pages/ForbiddenPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const ServerErrorPage = lazy(() => import('@/pages/ServerErrorPage'));

// ═══════════════════════════════════════════════════════════
// MAPPING DES COMPOSANTS
// ═══════════════════════════════════════════════════════════

const componentMap: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  // Public
  HomePage,
  HomeB2C: HomeB2CPage,
  HomeB2B: HomeB2BPage,
  AboutPage,
  ContactPage,
  HelpPage,
  LoginPage,
  SignupPage,
  
  // App
  AppGatePage,
  B2CDashboardPage,
  B2BUserDashboardPage,
  B2BAdminDashboardPage,
  
  // Modules
  B2CScanPage,
  B2CMusicPage,
  B2CCoachPage,
  B2CJournalPage,
  B2CVRPage,
  
  // Fun-First
  B2CFlashGlowPage,
  B2CBreathworkPage,
  B2CARFiltersPage,
  B2CBubbleBeatPage,
  B2CScreenSilkBreakPage,
  B2CVRGalactiquePage,
  
  // Analytics
  B2CGamificationPage,
  B2CWeeklyBarsPage,
  B2CHeatmapVibesPage,
  
  // Settings
  B2CSettingsPage,
  B2CProfileSettingsPage,
  B2CPrivacyTogglesPage,
  B2CNotificationsPage,
  
  // B2B
  B2BTeamsPage,
  B2BSocialCoconPage,
  B2BReportsPage,
  B2BEventsPage,
  B2BOptimisationPage,
  B2BSecurityPage,
  B2BAuditPage,
  B2BAccessibilityPage,
  
  // System
  UnauthorizedPage,
  ForbiddenPage,
  NotFoundPage,
  ServerErrorPage,
};

// ═══════════════════════════════════════════════════════════
// WRAPPER COMPONENTS
// ═══════════════════════════════════════════════════════════

const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingAnimation text="Chargement..." />
      </div>
    }
  >
    {children}
  </Suspense>
);

const LayoutWrapper: React.FC<{ 
  children: React.ReactNode; 
  layout?: 'marketing' | 'app' 
}> = ({ children, layout = 'app' }) => {
  if (layout === 'marketing') {
    return <>{children}</>;
  }
  
  return (
    <EnhancedShell>
      {children}
    </EnhancedShell>
  );
};

// ═══════════════════════════════════════════════════════════
// GÉNÉRATION DES ROUTES
// ═══════════════════════════════════════════════════════════

function createRouteElement(routeMeta: typeof ROUTES_REGISTRY[0]) {
  const Component = componentMap[routeMeta.component];
  
  if (!Component) {
    console.warn(`⚠️ Composant manquant: ${routeMeta.component} pour route ${routeMeta.name}`);
    return <Navigate to="/404" replace />;
  }

  const element = (
    <SuspenseWrapper>
      <LayoutWrapper layout={routeMeta.layout}>
        <Component />
      </LayoutWrapper>
    </SuspenseWrapper>
  );

  // Appliquer les guards si nécessaire
  if (routeMeta.guard || routeMeta.role) {
    return (
      <RouteGuard 
        requiredRole={routeMeta.role} 
        requireAuth={routeMeta.guard}
      >
        {element}
      </RouteGuard>
    );
  }

  return element;
}

// ═══════════════════════════════════════════════════════════
// CRÉATION DU ROUTER
// ═══════════════════════════════════════════════════════════

// Export des routes helpers et du router
export { routes } from './routes';
export const routerV2 = createBrowserRouter([
  // Routes principales du registry
  ...ROUTES_REGISTRY.map(route => ({
    path: route.path,
    element: createRouteElement(route),
  })),

  // Aliases de compatibilité (seulement si FF_ROUTER_V2 est activé)
  ...(FF_ROUTER_V2 ? ROUTE_ALIASES.map(alias => ({
    path: alias.from,
    element: <Navigate to={alias.to} replace />,
  })) : []),

  // Fallback 404 pour toutes les autres routes
  {
    path: '*',
    element: (
      <SuspenseWrapper>
        <NotFoundPage />
      </SuspenseWrapper>
    ),
  },
], {
  basename: import.meta.env.BASE_URL ?? '/',
});

// ═══════════════════════════════════════════════════════════
// VALIDATION AU DÉMARRAGE (DEV ONLY)
// ═══════════════════════════════════════════════════════════

if (import.meta.env.DEV) {
  // Vérifier que tous les composants sont mappés
  const missingComponents = ROUTES_REGISTRY
    .filter(route => !componentMap[route.component])
    .map(route => `${route.name}: ${route.component}`);

  if (missingComponents.length > 0) {
    console.warn('⚠️ RouterV2: Composants manquants:', missingComponents);
  }

  console.log(`✅ RouterV2 initialisé: ${ROUTES_REGISTRY.length} routes, FF_ROUTER_V2=${FF_ROUTER_V2}`);
}