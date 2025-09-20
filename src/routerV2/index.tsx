export { router } from './router';
export type { AppRouter } from './router';

// Type pour éviter les logs répétés
declare global {
  interface Window {
    __routerV2Logged?: boolean;
  }
}

import React, { lazy, Suspense } from 'react';
import * as Sentry from '@sentry/react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES_REGISTRY } from './registry';
import { ROUTE_ALIASES } from './aliases';
import { RouteGuard } from './guards';
import { withErrorBoundary } from '@/contexts/ErrorContext';
import PageErrorFallback from '@/components/error/PageErrorFallback';
import { LoadingState } from '@/components/loading/LoadingState';
import EnhancedShell from '@/components/layout/EnhancedShell';
import FloatingActionMenu from '@/components/layout/FloatingActionMenu';

// RouterV2 est maintenant activé par défaut - plus de feature flag
const FF_ROUTER_V2 = true;

// ═══════════════════════════════════════════════════════════
// LAZY IMPORTS DES PAGES
// ═══════════════════════════════════════════════════════════

// Pages publiques unifiées 
const HomePage = lazy(() => import('@/components/HomePage'));
const UnifiedLoginPage = lazy(() => import('@/pages/unified/UnifiedLoginPage'));
const SimpleB2CPage = lazy(() => import('@/components/SimpleB2CPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const HelpPage = lazy(() => import('@/pages/HelpPage'));
const DemoPage = lazy(() => import('@/pages/DemoPage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));

// Auth & Landing unifiées
const SignupPage = lazy(() => import('@/pages/SignupPage'));

// Dashboards B2B
const B2BCollabDashboard = lazy(() => import('@/pages/B2BCollabDashboard'));
const B2BRHDashboard = lazy(() => import('@/pages/B2BRHDashboard'));
const AppGatePage = lazy(() => import('@/pages/AppGatePage'));

// Modules fonctionnels
const B2CScanPage = lazy(() => import('@/pages/B2CScanPage'));
const B2CAdaptiveMusicPage = lazy(() => import('@/modules/adaptive-music/AdaptiveMusicPage'));
const B2CAICoachPage = lazy(() => import('@/pages/B2CAICoachPage'));
const B2CJournalPage = lazy(() => import('@/pages/B2CJournalPage'));
const B2CVRBreathGuidePage = lazy(() => import('@/pages/B2CVRBreathGuidePage'));
const B2CVRGalaxyPage = lazy(() => import('@/pages/B2CVRGalaxyPage'));
const VRBreathPage = lazy(() => import('@/pages/VRBreathPage'));

// Modules Fun-First
const B2CFlashGlowPage = lazy(() => import('@/pages/B2CFlashGlowPage'));
const B2CBreathworkPage = lazy(() => import('@/pages/B2CBreathworkPage'));
const B2CARFiltersPage = lazy(() => import('@/pages/B2CARFiltersPage'));
const B2CBubbleBeatPage = lazy(() => import('@/pages/B2CBubbleBeatPage'));
const B2CScreenSilkBreakPage = lazy(() => import('@/pages/B2CScreenSilkBreakPage'));

// Analytics - nettoyage (pages non utilisées dans registry)

// Paramètres
const B2CSettingsPage = lazy(() => import('@/pages/B2CSettingsPage'));
const B2CProfileSettingsPage = lazy(() => import('@/pages/B2CProfileSettingsPage'));
const B2CPrivacyTogglesPage = lazy(() => import('@/pages/B2CPrivacyTogglesPage'));
const B2CNotificationsPage = lazy(() => import('@/pages/B2CNotificationsPage'));

// B2B Features - use dedicated pages
const B2BTeamsPage = lazy(() => import('@/pages/B2BTeamsPage'));
const B2BSocialCoconPage = lazy(() => import('@/pages/B2BSocialCoconPage'));
const B2BReportsPage = lazy(() => import('@/pages/B2BReportsPage'));
const B2BReportsHeatmapPage = lazy(() => import('@/pages/b2b/reports'));
const B2BEventsPage = lazy(() => import('@/pages/B2BEventsPage'));

// Additional B2B pages - use correct paths
const B2BOptimisationPage = lazy(() => import('@/pages/B2BOptimisationPage'));
const B2BSecurityPage = lazy(() => import('@/pages/B2BSecurityPage'));  
const B2BAuditPage = lazy(() => import('@/pages/B2BAuditPage'));
const B2BAccessibilityPage = lazy(() => import('@/pages/B2BAccessibilityPage'));

// Pages Fun-First intégrées
const B2CAmbitionArcadePage = lazy(() => import('@/pages/B2CAmbitionArcadePage'));
const B2CBossLevelGritPage = lazy(() => import('@/pages/B2CBossLevelGritPage'));
const B2CBounceBackBattlePage = lazy(() => import('@/pages/B2CBounceBackBattlePage'));
const B2CMoodMixerPage = lazy(() => import('@/pages/B2CMoodMixerPage'));
const MoodPresetsAdminPage = lazy(() => import('@/pages/MoodPresetsAdminPage'));
const B2CSocialCoconPage = lazy(() => import('@/pages/B2CSocialCoconPage'));
const B2CStorySynthLabPage = lazy(() => import('@/pages/B2CStorySynthLabPage'));
const B2CCommunautePage = lazy(() => import('@/pages/B2CCommunautePage'));
const B2BSelectionPage = lazy(() => import('@/pages/B2BSelectionPage'));

// B2B Enterprise
const B2BEntreprisePage = lazy(() => import('@/pages/B2BEntreprisePage'));

// Pages fonctionnelles avancées
const B2CMusicTherapyPremiumPage = lazy(() => import('@/pages/B2CMusicTherapyPremiumPage'));
const B2CAICoachMicroPage = lazy(() => import('@/pages/B2CAICoachMicroPage'));
const B2CActivitePage = lazy(() => import('@/pages/B2CActivitePage'));
const SubscribePage = lazy(() => import('@/pages/SubscribePage'));
const B2CNyveeCoconPage = lazy(() => import('@/pages/B2CNyveeCoconPage'));
const ValidationPage = lazy(() => import('@/pages/ValidationPage'));

// Legal pages
const LegalTermsPage = lazy(() => import('@/pages/LegalTermsPage'));
const LegalPrivacyPage = lazy(() => import('@/pages/LegalPrivacyPage'));

// Pages nouvellement créées
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const CoachChatPage = lazy(() => import('@/pages/CoachChatPage'));
const VRSessionsPage = lazy(() => import('@/pages/VRSessionsPage'));
const JournalNewPage = lazy(() => import('@/pages/JournalNewPage'));
const ReportingPage = lazy(() => import('@/pages/ReportingPage'));
const ExportPage = lazy(() => import('@/pages/ExportPage'));
const NavigationPage = lazy(() => import('@/pages/NavigationPage'));
const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage'));
const GamificationPage = lazy(() => import('@/pages/GamificationPage'));
const ScoresPage = lazy(() => import('@/pages/ScoresPage'));

// Pages existantes à consolider
const MessagesPage = lazy(() => import('@/pages/MessagesPage'));
const CalendarPage = lazy(() => import('@/pages/CalendarPage'));
const Point20Page = lazy(() => import('@/pages/Point20Page'));
const TestPage = lazy(() => import('@/pages/TestPage'));
const EmotionsPage = lazy(() => import('@/pages/EmotionsPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const GeneralPage = lazy(() => import('@/pages/GeneralPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));

// Import des nouveaux modules optimisés
const FlashGlowPage = lazy(() => import('@/pages/modules/FlashGlowPage'));
const JournalPage = lazy(() => import('@/pages/modules/JournalPage'));
const ScanPage = lazy(() => import('@/pages/modules/ScanPage'));
const CoachPage = lazy(() => import('@/pages/modules/CoachPage'));
const MoodMixerPage = lazy(() => import('@/pages/modules/MoodMixerPage'));
const BossGritPage = lazy(() => import('@/modules/boss-grit/BossGritPage'));
const BubbleBeatPage = lazy(() => import('@/pages/modules/BubbleBeatPage'));
const StorySynthPage = lazy(() => import('@/pages/modules/StorySynthPage'));
const ModulesShowcasePage = lazy(() => import('@/pages/ModulesShowcasePage'));
const EmotionScanPage = lazy(() => import('@/modules/emotion-scan/EmotionScanPage'));
const FlashGlowUltraPage = lazy(() => import('@/modules/flash-glow-ultra/FlashGlowUltraPage'));

// Pages DEV uniquement
const ComprehensiveSystemAuditPage = lazy(() => import('@/pages/ComprehensiveSystemAuditPage'));

// Pages système unifiées
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'));
const ForbiddenPage = lazy(() => import('@/pages/ForbiddenPage'));
const UnifiedErrorPage = lazy(() => import('@/pages/unified/UnifiedErrorPage'));
const ServerErrorPage = lazy(() => import('@/pages/ServerErrorPage'));



// Composants de redirection  
const RedirectToScan = lazy(() => import('@/components/redirects/RedirectToScan'));
const RedirectToJournal = lazy(() => import('@/components/redirects/RedirectToJournal'));
const RedirectToSocialCocon = lazy(() => import('@/components/redirects/RedirectToSocialCocon'));
const RedirectToEntreprise = lazy(() => import('@/components/redirects/RedirectToEntreprise'));
const RedirectToMusic = lazy(() => import('@/components/redirects/RedirectToMusic'));

// ═══════════════════════════════════════════════════════════
// MAPPING DES COMPOSANTS
// ═══════════════════════════════════════════════════════════

const componentMap: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  // Public unifiées
  HomePage,
  HomeB2CPage: SimpleB2CPage,
  AboutPage,
  ContactPage,
  HelpPage,
  DemoPage,
  OnboardingPage,
  UnifiedLoginPage,
  SignupPage,
  PrivacyPage,
  
  // App & B2B Enterprise
  AppGatePage,
  B2BEntreprisePage,
  B2BSelectionPage,
  B2BCollabDashboard,
  B2BRHDashboard,
  
  // Modules
  B2CScanPage,
  B2CMusicEnhanced: B2CAdaptiveMusicPage,
  B2CAICoachPage,
  B2CJournalPage,
  B2CVRBreathGuidePage,
  B2CVRGalaxyPage,
  VRBreathPage,
  
  // Fun-First
  B2CFlashGlowPage,
  B2CBreathworkPage,
  B2CARFiltersPage,
  B2CBubbleBeatPage,
  B2CScreenSilkBreakPage,
  
  // Analytics & Gamification
  GamificationPage,
  LeaderboardPage,
  ScoresPage,
  
  // Settings
  B2CSettingsPage,
  B2CProfileSettingsPage,
  B2CPrivacyTogglesPage,
  B2CNotificationsPage,
  
  // B2B
  B2BTeamsPage,
  B2BSocialCoconPage,
  B2BReportsPage,
  B2BReportsHeatmapPage,
  B2BEventsPage,
  B2BOptimisationPage,
  B2BSecurityPage,
  B2BAuditPage,
  B2BAccessibilityPage,
  
  // Pages Fun-First intégrées
  B2CAmbitionArcadePage,
  B2CBossLevelGritPage,
  B2CBounceBackBattlePage,
  B2CMoodMixerPage,
  MoodPresetsAdminPage,
  B2CSocialCoconPage,
  B2CStorySynthLabPage,
  B2CCommunautePage,
  SubscribePage,
  
  // Pages fonctionnelles avancées
  B2CMusicTherapyPremiumPage,
  B2CAICoachMicroPage,
  B2CActivitePage,
  B2CNyveeCoconPage,
  ValidationPage,
  
  // Pages nouvellement créées
  ChooseModePage,
  CoachChatPage,
  VRSessionsPage,
  JournalNewPage,
  ReportingPage,
  ExportPage,
  NavigationPage,
  
  // Pages existantes consolidées
  MessagesPage,
  CalendarPage,
  Point20Page,
  TestPage,
  EmotionsPage,
  ProfilePage,
  GeneralPage,
  
  // Legal pages
  LegalTermsPage,
  LegalPrivacyPage,
  
  // System unifiées
  UnauthorizedPage,
  ForbiddenPage,
  NotFoundPage: UnifiedErrorPage,
  ServerErrorPage,
  
  // Import des nouveaux modules optimisés
  FlashGlowPage,
  JournalPage: JournalPage,
  ScanPage,
  CoachPage,
  MoodMixerPage,
  BossGritPage,
  BubbleBeatPage,
  StorySynthPage,
  ModulesShowcasePage,
  EmotionScanPage,
  FlashGlowUltraPage,

  // Dev-only pages
  ComprehensiveSystemAuditPage,
  
  // Composants de redirection
  RedirectToScan,
  RedirectToJournal, 
  RedirectToSocialCocon,
  RedirectToEntreprise,
  RedirectToMusic,
};

const AliasRedirect: React.FC<{ from: string; to: string }> = ({ from, to }) => {
  React.useEffect(() => {
    const client = Sentry.getCurrentHub().getClient();
    if (client) {
      Sentry.addBreadcrumb({
        category: 'route',
        level: 'info',
        message: 'route:alias',
        data: { from, to },
      });
    }
  }, [from, to]);

  return <Navigate to={to} replace />;
};

// ═══════════════════════════════════════════════════════════
// WRAPPER COMPONENTS
// ═══════════════════════════════════════════════════════════

const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense
    fallback={
      <div className="bg-background">
        <LoadingState
          variant="page"
          text="Chargement de la page..."
          className="min-h-screen"
        />
      </div>
    }
  >
    {children}
  </Suspense>
);

const LayoutWrapper: React.FC<{ 
  children: React.ReactNode; 
  layout?: 'marketing' | 'app' | 'simple'
}> = ({ children, layout = 'app' }) => {
  if (layout === 'marketing' || layout === 'simple') {
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
    return <Navigate to="/404" replace />;
  }

  const ComponentWithBoundary = withErrorBoundary(Component, PageErrorFallback);

  const element = (
    <SuspenseWrapper>
      <LayoutWrapper layout={routeMeta.layout}>
        <ComponentWithBoundary />
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
export { ROUTE_ALIASES } from './aliases';
export type { RouteAlias } from './aliases';
const canonicalRoutes = ROUTES_REGISTRY.filter(route => !route.deprecated && route.path !== '*');

export const routerV2 = createBrowserRouter([
  // Routes principales du registry (hors routes dépréciées et wildcard)
  ...canonicalRoutes.map(route => ({
    path: route.path,
    element: createRouteElement(route),
  })),

  // Aliases de compatibilité (seulement si FF_ROUTER_V2 est activé)
  ...(FF_ROUTER_V2
    ? ROUTE_ALIASES.map(alias => ({
        path: alias.from,
        element: <AliasRedirect from={alias.from} to={alias.to} />,
      }))
    : []),

  // Fallback 404 pour toutes les autres routes
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
], {
  basename: import.meta.env.BASE_URL ?? '/',
});

// ═══════════════════════════════════════════════════════════
// VALIDATION AU DÉMARRAGE (DEV ONLY)
// ═══════════════════════════════════════════════════════════

if (import.meta.env.DEV) {
  // Validation silencieuse pour éviter les boucles de logs
  const missingComponents = ROUTES_REGISTRY
    .filter(route => !componentMap[route.component])
    .map(route => `${route.name}: ${route.component}`);

  if (missingComponents.length > 0 && !window.__routerV2Logged) {
    console.error('🚨 RouterV2: composants manquants', missingComponents);
  }

  // Log unique au démarrage
  if (!window.__routerV2Logged) {
    console.log(`✅ RouterV2 initialisé: ${canonicalRoutes.length} routes canoniques`);
    window.__routerV2Logged = true;
  }
}