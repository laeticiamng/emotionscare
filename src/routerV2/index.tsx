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
import FloatingActionMenu from '@/components/layout/FloatingActionMenu';

// RouterV2 est maintenant activé par défaut - plus de feature flag
const FF_ROUTER_V2 = true;

// ═══════════════════════════════════════════════════════════
// LAZY IMPORTS DES PAGES
// ═══════════════════════════════════════════════════════════

// Pages publiques
const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const HelpPage = lazy(() => import('@/pages/HelpPage'));
const DemoPage = lazy(() => import('@/pages/DemoPage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));

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
const B2CMusicEnhanced = lazy(() => import('@/pages/B2CMusicEnhanced'));
const B2CAICoachPage = lazy(() => import('@/pages/B2CAICoachPage'));
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
const B2CDataPrivacyPage = lazy(() => import('@/pages/B2CDataPrivacyPage'));

// B2B Features - use dedicated pages
const B2BTeamsPage = lazy(() => import('@/pages/B2BTeamsPage'));
const B2BSocialCoconPage = lazy(() => import('@/pages/B2BSocialCoconPage'));
const B2BReportsPage = lazy(() => import('@/pages/B2BReportsPage'));
const B2BEventsPage = lazy(() => import('@/pages/B2BEventsPage'));

// Additional B2B pages - use correct paths
const B2BOptimisationPage = lazy(() => import('@/pages/B2BOptimisationPage'));
const B2BSecurityPage = lazy(() => import('@/pages/B2BSecurityPage'));  
const B2BAuditPage = lazy(() => import('@/pages/B2BAuditPage'));
const B2BAccessibilityPage = lazy(() => import('@/pages/B2BAccessibilityPage'));

// Pages orphelines à intégrer
const ApiMonitoringPage = lazy(() => import('@/pages/ApiMonitoringPage'));
const B2CAmbitionArcadePage = lazy(() => import('@/pages/B2CAmbitionArcadePage'));
const B2CBossLevelGritPage = lazy(() => import('@/pages/B2CBossLevelGritPage'));
const B2CBounceBackBattlePage = lazy(() => import('@/pages/B2CBounceBackBattlePage'));
const B2CMoodMixerPage = lazy(() => import('@/pages/B2CMoodMixerPage'));
const B2CSocialCoconPage = lazy(() => import('@/pages/B2CSocialCoconPage'));
const B2CStorySynthLabPage = lazy(() => import('@/pages/B2CStorySynthLabPage'));
const B2CEmotionScanPage = lazy(() => import('@/pages/B2CEmotionScanPage'));
const B2CVoiceJournalPage = lazy(() => import('@/pages/B2CVoiceJournalPage'));
const B2CEmotionsPage = lazy(() => import('@/pages/B2CEmotionsPage'));
const B2CCommunityPage = lazy(() => import('@/pages/B2CCommunityPage'));
const CompleteNavigationMenu = lazy(() => import('@/components/navigation/CompleteNavigationMenu'));
const NavigationPage = lazy(() => import('@/pages/NavigationPage'));
const CompleteFeatureMatrix = lazy(() => import('@/pages/CompleteFeatureMatrix'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const B2BLandingPage = lazy(() => import('@/pages/B2BLandingPage'));
const B2BSelectionPage = lazy(() => import('@/pages/B2BSelectionPage'));

// Pages nouvelles créées
const B2CBreathVRPage = lazy(() => import('@/pages/B2CBreathVRPage'));
const B2CActivityHistoryPage = lazy(() => import('@/pages/B2CActivityHistoryPage'));
const B2BEntreprisePage = lazy(() => import('@/pages/B2BEntreprisePage'));
const B2BCollabDashboard = lazy(() => import('@/pages/B2BCollabDashboard'));
const B2BRHDashboard = lazy(() => import('@/pages/B2BRHDashboard'));
const SubscribePage = lazy(() => import('@/pages/SubscribePage'));
const ValidationStatusPage = lazy(() => import('@/pages/ValidationStatusPage'));
const DiagnosticPage = lazy(() => import('@/pages/DiagnosticPage'));
const SystemRepairPage = lazy(() => import('@/pages/SystemRepairPage'));

// Legal pages
const LegalTermsPage = lazy(() => import('@/pages/LegalTermsPage'));
const LegalPrivacyPage = lazy(() => import('@/pages/LegalPrivacyPage'));

// Pages système
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'));
const ForbiddenPage = lazy(() => import('@/pages/ForbiddenPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const ServerErrorPage = lazy(() => import('@/pages/ServerErrorPage'));

// ═══════════════════════════════════════════════════════════
// MAPPING DES COMPOSANTS
// ═══════════════════════════════════════════════════════════

const DebugDashboard = lazy(() => import('@/pages/DebugDashboard'));

const componentMap: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  // Public
  HomePage,
  HomeB2C: HomeB2CPage,
  HomeB2B: HomeB2BPage,
  AboutPage,
  ContactPage,
  HelpPage,
  DemoPage,
  OnboardingPage,
  LoginPage,
  SignupPage,
  
  // App
  DebugDashboard,
  AppGatePage,
  B2CDashboardPage,
  B2BUserDashboardPage,
  B2BAdminDashboardPage,
  
  // Modules
  B2CScanPage,
  B2CMusicEnhanced,
  B2CAICoachPage,
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
  B2CDataPrivacyPage,
  
  // B2B
  B2BTeamsPage,
  B2BSocialCoconPage,
  B2BReportsPage,
  B2BEventsPage,
  B2BOptimisationPage,
  B2BSecurityPage,
  B2BAuditPage,
  B2BAccessibilityPage,
  B2BLandingPage,
  B2BSelectionPage,
  
  // Pages orphelines intégrées
  ApiMonitoringPage,
  B2CAmbitionArcadePage,
  B2CBossLevelGritPage,
  B2CBounceBackBattlePage,
  B2CMoodMixerPage,
  B2CSocialCoconPage,
  B2CStorySynthLabPage,
  B2CEmotionScanPage,
  B2CVoiceJournalPage,
  B2CEmotionsPage,
  B2CCommunityPage,
  CompleteNavigationMenu,
  NavigationPage,
  CompleteFeatureMatrix,
  PrivacyPage,
  
  // Pages nouvelles 
  B2CBreathVRPage,
  B2CActivityHistoryPage,
  B2BEntreprisePage,
  B2BCollabDashboard,
  B2BRHDashboard,
  SubscribePage,
  ValidationStatusPage,
  DiagnosticPage,
  SystemRepairPage,
  
  // Legal pages
  LegalTermsPage,
  LegalPrivacyPage,
  
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
      <FloatingActionMenu />
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