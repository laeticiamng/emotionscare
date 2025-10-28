/**
 * RouterV2 - Router unifié principal
 * TICKET: FE/BE-Router-Cleanup-01
 * VERSION: 2.1.0 - Test Nyvée Debug
 */

import { logger } from '@/lib/logger';

// Force reload timestamp
logger.debug('Router loaded', { timestamp: new Date().toISOString() }, 'SYSTEM');

// Type pour éviter les logs répétés
declare global {
  interface Window {
    __routerV2Logged?: boolean;
  }
}

import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES_REGISTRY } from './registry';
import { LegacyRedirect, ROUTE_ALIAS_ENTRIES } from './aliases';
import { AuthGuard, ModeGuard, RoleGuard } from './guards';
import type { RouteMeta } from './schema';
import { PageErrorBoundary } from '@/components/error/PageErrorBoundary';
import { LoadingState } from '@/components/loading/LoadingState';
import EnhancedShell from '@/components/layout/EnhancedShell';
import FloatingActionMenu from '@/components/layout/FloatingActionMenu';

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
const B2CMusicEnhanced = lazy(() => import('@/pages/B2CMusicEnhanced'));
const EmotionMusicPage = lazy(() => import('@/pages/EmotionMusic'));
const EmotionMusicLibraryPage = lazy(() => import('@/pages/EmotionMusicLibrary'));
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
const MeditationPage = lazy(() => import('@/pages/MeditationPage'));

// Analytics - nettoyage (pages non utilisées dans registry)

// Paramètres
const B2CSettingsPage = lazy(() => import('@/pages/B2CSettingsPage'));
const B2CProfileSettingsPage = lazy(() => import('@/pages/B2CProfileSettingsPage'));
const B2CPrivacyTogglesPage = lazy(() => import('@/pages/B2CPrivacyTogglesPage'));
const B2CNotificationsPage = lazy(() => import('@/pages/B2CNotificationsPage'));
const HowItAdaptsPage = lazy(() => import('@/pages/HowItAdaptsPage'));

// B2B Features - use dedicated pages
const B2BTeamsPage = lazy(() => import('@/pages/B2BTeamsPage'));
const B2BSocialCoconPage = lazy(() => import('@/pages/B2BSocialCoconPage'));
const B2BReportsPage = lazy(() => import('@/pages/B2BReportsPage'));
const B2BReportDetailPage = lazy(() => import('@/pages/B2BReportDetailPage'));
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
const NyveeTestPage = lazy(() => import('@/pages/NyveeTestPage'));
const ValidationPage = lazy(() => import('@/pages/ValidationPage'));

// Legal pages
const LegalTermsPage = lazy(() => import('@/pages/LegalTermsPage'));
const LegalPrivacyPage = lazy(() => import('@/pages/LegalPrivacyPage'));
const LegalMentionsPage = lazy(() => import('@/pages/LegalMentionsPage'));
const LegalSalesPage = lazy(() => import('@/pages/LegalSalesPage'));
const LegalCookiesPage = lazy(() => import('@/pages/LegalCookiesPage'));

// Pages nouvellement créées
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const CoachChatPage = lazy(() => import('@/pages/CoachChatPage'));
const VRSessionsPage = lazy(() => import('@/pages/VRSessionsPage'));
const JournalNewPage = lazy(() => import('@/pages/JournalNewPage'));
const JournalSettingsPage = lazy(() => import('@/pages/JournalSettings'));
const ReportingPage = lazy(() => import('@/pages/ReportingPage'));
const ExportPage = lazy(() => import('@/pages/ExportPage'));
const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage'));
const GamificationPage = lazy(() => import('@/pages/GamificationPage'));
const ScoresPage = lazy(() => import('@/pages/ScoresPage'));
const PricingPageWorking = lazy(() => import('@/pages/PricingPageWorking'));

// Pages existantes à consolider
const MessagesPage = lazy(() => import('@/pages/MessagesPage'));
const CalendarPage = lazy(() => import('@/pages/CalendarPage'));
const Point20Page = lazy(() => import('@/pages/Point20Page'));
const TestPage = lazy(() => import('@/pages/TestPage'));
const EmotionsPage = lazy(() => import('@/pages/EmotionsPage'));
const GeneralPage = lazy(() => import('@/pages/GeneralPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));

// Import des nouveaux modules optimisés
const FlashGlowPage = lazy(() => import('@/pages/flash-glow/index'));
const JournalPage = lazy(() => import('@/pages/B2CJournalPage'));
const ScanPage = lazy(() => import('@/pages/B2CScanPage'));
const CoachPage = lazy(() => import('@/pages/B2CAICoachPage'));
const MoodMixerPage = lazy(() => import('@/pages/B2CMoodMixerPage'));
const BossGritPage = lazy(() => import('@/modules/boss-grit/BossGritPage'));
const BubbleBeatPage = lazy(() => import('@/pages/B2CBubbleBeatPage'));
const StorySynthPage = lazy(() => import('@/pages/B2CStorySynthLabPage'));

// Pages DEV uniquement
const ComprehensiveSystemAuditPage = lazy(() => import('@/pages/ComprehensiveSystemAuditPage'));
const ErrorBoundaryTestPage = lazy(() => import('@/pages/dev/ErrorBoundaryTestPage'));
const TestAccountsPage = lazy(() => import('@/pages/dev/TestAccountsPage'));

// Analytics & Weekly Bars
const B2CWeeklyBarsPage = lazy(() => import('@/pages/B2CWeeklyBarsPage'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));

// Pages système unifiées
const UnauthorizedPage = lazy(() => import('@/pages/errors/401/page'));
const ForbiddenPage = lazy(() => import('@/pages/errors/403/page'));
const UnifiedErrorPage = lazy(() => import('@/pages/errors/404/page'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));
const ServerErrorPage = lazy(() => import('@/pages/errors/500/page'));



// Composants de redirection  
const RedirectToScan = lazy(() => import('@/components/redirects/RedirectToScan'));
const RedirectToJournal = lazy(() => import('@/components/redirects/RedirectToJournal'));
const RedirectToSocialCocon = lazy(() => import('@/components/redirects/RedirectToSocialCocon'));
const RedirectToEntreprise = lazy(() => import('@/components/redirects/RedirectToEntreprise'));
const RedirectToMusic = lazy(() => import('@/components/redirects/RedirectToMusic'));

// Pages Dashboard modules
const ModulesDashboardPage = lazy(() => import('@/pages/ModulesDashboard'));
const UnifiedModulesDashboardPage = lazy(() => import('@/pages/UnifiedModulesDashboard'));
const VoiceScanPage = lazy(() => import('@/pages/VoiceScanPage'));
const TextScanPage = lazy(() => import('@/pages/TextScanPage'));
const MusicGeneratePage = lazy(() => import('@/pages/MusicGeneratePage'));
const MusicLibraryPage = lazy(() => import('@/pages/MusicLibraryPage'));
const ModeSelectionPage = lazy(() => import('@/pages/ModeSelectionPage'));
const B2CDashboardPage = lazy(() => import('@/pages/B2CDashboardPage'));
const B2CMoodPage = lazy(() => import('@/pages/B2CMoodPage'));
const B2CMusicPage = lazy(() => import('@/pages/B2CMusicPage'));
const EmotionalPark = lazy(() => import('@/pages/EmotionalPark'));
const ParkJourney = lazy(() => import('@/pages/ParkJourney'));
const CoachProgramsPage = lazy(() => import('@/pages/CoachProgramsPage'));
const CoachSessionsPage = lazy(() => import('@/pages/CoachSessionsPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const ParcoursXL = lazy(() => import('@/pages/ParcoursXL'));

// Nouvelles pages créées
const SessionsPage = lazy(() => import('@/pages/SessionsPage'));
const SessionDetailPage = lazy(() => import('@/pages/SessionDetailPage'));
const GoalsPage = lazy(() => import('@/pages/GoalsPage'));
const GoalDetailPage = lazy(() => import('@/pages/GoalDetailPage'));
const GoalNewPage = lazy(() => import('@/pages/GoalNewPage'));
const AchievementsPage = lazy(() => import('@/pages/AchievementsPage'));
const BadgesPage = lazy(() => import('@/pages/BadgesPage'));
const RewardsPage = lazy(() => import('@/pages/RewardsPage'));
const ChallengesPage = lazy(() => import('@/pages/ChallengesPage'));
const ChallengeDetailPage = lazy(() => import('@/pages/ChallengeDetailPage'));
const ChallengeCreatePage = lazy(() => import('@/pages/ChallengeCreatePage'));
const NotificationsCenterPage = lazy(() => import('@/pages/NotificationsCenterPage'));
const PremiumPage = lazy(() => import('@/pages/PremiumPage'));
const BillingPage = lazy(() => import('@/pages/BillingPage'));
const SupportPage = lazy(() => import('@/pages/SupportPage'));
const FAQPage = lazy(() => import('@/pages/FAQPage'));
const TicketsPage = lazy(() => import('@/pages/TicketsPage'));
const InsightsPage = lazy(() => import('@/pages/InsightsPage'));
const TrendsPage = lazy(() => import('@/pages/TrendsPage'));
const JournalAudioPage = lazy(() => import('@/pages/JournalAudioPage'));
const VoiceAnalysisPage = lazy(() => import('@/pages/VoiceAnalysisPage'));
const FriendsPage = lazy(() => import('@/pages/FriendsPage'));
const GroupsPage = lazy(() => import('@/pages/GroupsPage'));
const FeedPage = lazy(() => import('@/pages/FeedPage'));
const ThemesPage = lazy(() => import('@/pages/ThemesPage'));
const CustomizationPage = lazy(() => import('@/pages/CustomizationPage'));
const WidgetsPage = lazy(() => import('@/pages/WidgetsPage'));
const EventsCalendarPage = lazy(() => import('@/pages/EventsCalendarPage'));
const WorkshopsPage = lazy(() => import('@/pages/WorkshopsPage'));
const WebinarsPage = lazy(() => import('@/pages/WebinarsPage'));
const ExportPDFPage = lazy(() => import('@/pages/ExportPDFPage'));
const ExportCSVPage = lazy(() => import('@/pages/ExportCSVPage'));
const ShareDataPage = lazy(() => import('@/pages/ShareDataPage'));
const IntegrationsPage = lazy(() => import('@/pages/IntegrationsPage'));
const APIKeysPage = lazy(() => import('@/pages/APIKeysPage'));
const WebhooksPage = lazy(() => import('@/pages/WebhooksPage'));
const AccessibilitySettingsPage = lazy(() => import('@/pages/AccessibilitySettingsPage'));
const ShortcutsPage = lazy(() => import('@/pages/ShortcutsPage'));
const WeeklyReportPage = lazy(() => import('@/pages/WeeklyReportPage'));
const MonthlyReportPage = lazy(() => import('@/pages/MonthlyReportPage'));

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
  B2CMusicEnhanced,
  EmotionMusicPage,
  EmotionMusicLibraryPage,
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
  MeditationPage,
  
  // Analytics & Gamification
  GamificationPage,
  LeaderboardPage,
  ScoresPage,
  
  // Settings
  B2CSettingsPage,
  B2CProfileSettingsPage,
  B2CPrivacyTogglesPage,
  B2CNotificationsPage,
  HowItAdaptsPage,
  
  // B2B
  B2BTeamsPage,
  B2BSocialCoconPage,
  B2BReportsPage,
  B2BReportDetailPage,
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
  NyveeTestPage,
  ValidationPage,
  
  // Pages nouvellement créées
  ChooseModePage,
  CoachChatPage,
  VRSessionsPage,
  JournalNewPage,
  JournalSettingsPage,
  ReportingPage,
  ExportPage,
  // PricingPageWorking,
  
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
  LegalMentionsPage,
  LegalSalesPage,
  LegalCookiesPage,
  
  // System unifiées
  UnauthorizedPage,
  ForbiddenPage,
  UnifiedErrorPage,
  NotFoundPage,
  ServerErrorPage,
  
  // Import des nouveaux modules optimisés
  FlashGlowPage,
  JournalPage,
  ScanPage,
  CoachPage,
  MoodMixerPage,
  BossGritPage,
  BubbleBeatPage,
  StorySynthPage,

  // Dev-only pages
  ComprehensiveSystemAuditPage,
  ErrorBoundaryTestPage,
  TestAccountsPage,
  
  // Analytics & Weekly Bars
  B2CWeeklyBarsPage,
  AnalyticsPage,
  
  // Composants de redirection
  RedirectToScan,
  RedirectToJournal, 
  RedirectToSocialCocon,
  RedirectToEntreprise,
  RedirectToMusic,
  
  // Pages Dashboard modules
  ModulesDashboardPage,
  UnifiedModulesDashboardPage,
  VoiceScanPage,
  TextScanPage,
  MusicGeneratePage,
  MusicLibraryPage,
  PricingPageWorking,
  ModeSelectionPage,
  B2CDashboardPage,
  B2CMoodPage,
  B2CMusicPage,
  EmotionalPark,
  ParkJourney,
  ParcoursXL,
  CoachProgramsPage,
  CoachSessionsPage,
  SessionsPage,
  SessionDetailPage,
  GoalsPage,
  GoalDetailPage,
  GoalNewPage,
  AchievementsPage,
  BadgesPage,
  RewardsPage,
  ChallengesPage,
  ChallengeDetailPage,
  ChallengeCreatePage,
  NotificationsCenterPage,
  PremiumPage,
  BillingPage,
  SupportPage,
  FAQPage,
  TicketsPage,
  InsightsPage,
  TrendsPage,
  JournalAudioPage,
  VoiceAnalysisPage,
  FriendsPage,
  GroupsPage,
  FeedPage,
  ThemesPage,
  CustomizationPage,
  WidgetsPage,
  EventsCalendarPage,
  WorkshopsPage,
  WebinarsPage,
  ExportPDFPage,
  ExportCSVPage,
  ShareDataPage,
  IntegrationsPage,
  APIKeysPage,
  WebhooksPage,
  AccessibilitySettingsPage,
  ShortcutsPage,
  WeeklyReportPage,
  MonthlyReportPage,
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

// Import AppLayout for sidebar - uses Outlet instead of children
const AppLayoutComponent = lazy(() => import('@/components/layout/AppLayout'));

const LayoutWrapper: React.FC<{ 
  children: React.ReactNode; 
  layout?: 'marketing' | 'app' | 'simple' | 'app-sidebar'
}> = ({ children, layout = 'app' }) => {
  if (layout === 'marketing' || layout === 'simple') {
    return <>{children}</>;
  }
  
  // Note: app-sidebar layout cannot be used here because AppLayout uses <Outlet />
  // Routes using app-sidebar should be defined with nested routes in the router
  if (layout === 'app-sidebar') {
    return (
      <EnhancedShell>
        {children}
        <FloatingActionMenu />
      </EnhancedShell>
    );
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

function applyRouteGuards(element: React.ReactNode, routeMeta: RouteMeta) {
  let guardedElement = element;

  if (routeMeta.segment && routeMeta.segment !== 'public') {
    guardedElement = (
      <ModeGuard segment={routeMeta.segment}>
        {guardedElement}
      </ModeGuard>
    );
  }

  if (routeMeta.role || (routeMeta.allowedRoles && routeMeta.allowedRoles.length > 0)) {
    guardedElement = (
      <RoleGuard requiredRole={routeMeta.role} allowedRoles={routeMeta.allowedRoles}>
        {guardedElement}
      </RoleGuard>
    );
  }

  if (routeMeta.guard || routeMeta.requireAuth || routeMeta.role || (routeMeta.allowedRoles && routeMeta.allowedRoles.length > 0)) {
    guardedElement = <AuthGuard>{guardedElement}</AuthGuard>;
  }

  return guardedElement;
}

function createRouteElement(routeMeta: RouteMeta) {
  const Component = componentMap[routeMeta.component];

  if (!Component) {
    return <Navigate to="/404" replace />;
  }

  const element = (
    <SuspenseWrapper>
      <LayoutWrapper layout={routeMeta.layout}>
        <PageErrorBoundary route={routeMeta.path} feature={routeMeta.name} resetKeys={[routeMeta.path]}>
          <Component />
        </PageErrorBoundary>
      </LayoutWrapper>
    </SuspenseWrapper>
  );

  return applyRouteGuards(element, routeMeta);
}

// ═══════════════════════════════════════════════════════════
// CRÉATION DU ROUTER
// ═══════════════════════════════════════════════════════════

const canonicalRoutes = ROUTES_REGISTRY.filter(route => !route.deprecated && route.path !== '*');

logger.debug('Creating router', { 
  canonicalRoutes: canonicalRoutes.length,
  hasTestNyveeRoute: !!ROUTES_REGISTRY.find(r => r.path === '/test-nyvee'),
  nyveeTestPageLoaded: !!NyveeTestPage 
}, 'SYSTEM');

export const router = createBrowserRouter([
  // Route de test directe HARDCODÉE pour Nyvée
  {
    path: '/test-nyvee',
    element: (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f0f0',
        padding: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#2563eb' }}>
            ✅ ROUTE FONCTIONNE !
          </h1>
          <p style={{ marginBottom: '1.5rem', color: '#666' }}>
            La route /test-nyvee est maintenant opérationnelle !
          </p>
          <a 
            href="/app/nyvee"
            style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              background: 'linear-gradient(to right, #2563eb, #9333ea)',
              color: 'white',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            🌿 Aller vers Nyvée
          </a>
        </div>
      </div>
    ),
  },

  // Routes principales du registry (hors routes dépréciées et wildcard)
  ...canonicalRoutes.map(route => ({
    path: route.path,
    element: createRouteElement(route),
  })),

  // Aliases du registry (créer des routes identiques pour chaque alias)
  ...canonicalRoutes.flatMap(route => 
    (route.aliases || []).map(alias => ({
      path: alias,
      element: createRouteElement(route),
    }))
  ),

  // Aliases de compatibilité (redirections)
  ...ROUTE_ALIAS_ENTRIES.map(alias => ({
    path: alias.from,
    element: <LegacyRedirect from={alias.from} to={alias.to} />,
  })),

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

logger.info('Router created', { totalRoutes: router.routes.length }, 'SYSTEM');

export const routerV2 = router;
export default router;
export type AppRouter = typeof router;

// ═══════════════════════════════════════════════════════════
// VALIDATION AU DÉMARRAGE (DEV ONLY)
// ═══════════════════════════════════════════════════════════

if (import.meta.env.DEV) {
  // Validation silencieuse pour éviter les boucles de logs
  const missingComponents = ROUTES_REGISTRY
    .filter(route => !componentMap[route.component])
    .map(route => `${route.name}: ${route.component}`);

  if (missingComponents.length > 0 && !window.__routerV2Logged) {
    logger.error('RouterV2: composants manquants', { missingComponents }, 'SYSTEM');
  }

  // Log unique au démarrage
  if (!window.__routerV2Logged) {
    logger.info(`RouterV2 initialisé: ${canonicalRoutes.length} routes canoniques`, undefined, 'SYSTEM');
    const testNyveeRoute = canonicalRoutes.find(r => r.path === '/test-nyvee');
    logger.debug('Route /test-nyvee trouvée', { found: !!testNyveeRoute }, 'SYSTEM');
    logger.debug('NyveeTestPage dans componentMap', { exists: !!componentMap['NyveeTestPage'] }, 'SYSTEM');
    window.__routerV2Logged = true;
  }
}