
import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ROUTE_MANIFEST } from '../../scripts/route-manifest';
import Shell from '../Shell';
import { ComponentLoadingFallback } from '@/components/ui/loading-fallback';

// Import des pages existantes
const HomePage = lazy(() => import('@/pages/HomePage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const B2BSelectionPage = lazy(() => import('@/pages/B2BSelectionPage'));
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Import des nouvelles pages générées
const OnboardingFlowPage = lazy(() => import('@/pages/OnboardingFlowPage'));
const B2CLoginPage = lazy(() => import('@/pages/B2CLoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/B2CRegisterPage'));
const B2CDashboardPage = lazy(() => import('@/pages/B2CDashboardPage'));
const B2BUserLoginPage = lazy(() => import('@/pages/B2BUserLoginPage'));
const B2BUserRegisterPage = lazy(() => import('@/pages/B2BUserRegisterPage'));
const B2BUserDashboardPage = lazy(() => import('@/pages/B2BUserDashboardPage'));
const B2BAdminLoginPage = lazy(() => import('@/pages/B2BAdminLoginPage'));
const B2BAdminDashboardPage = lazy(() => import('@/pages/B2BAdminDashboardPage'));
const B2BLandingPage = lazy(() => import('@/pages/B2BLandingPage'));
const EmotionScanPage = lazy(() => import('@/pages/EmotionScanPage'));
const MusicotherapiePage = lazy(() => import('@/pages/MusicotherapiePage'));
const AICoachPage = lazy(() => import('@/pages/AICoachPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));
const VRHubPage = lazy(() => import('@/pages/VRHubPage'));
const UserPreferencesPage = lazy(() => import('@/pages/UserPreferencesPage'));
const GamificationPage = lazy(() => import('@/pages/GamificationPage'));
const SocialCoconPage = lazy(() => import('@/pages/SocialCoconPage'));
const BossLevelGritPage = lazy(() => import('@/pages/BossLevelGritPage'));
const MoodMixerPage = lazy(() => import('@/pages/MoodMixerPage'));
const AmbitionArcadePage = lazy(() => import('@/pages/AmbitionArcadePage'));
const BounceBackBattlePage = lazy(() => import('@/pages/BounceBackBattlePage'));
const StorySynthLabPage = lazy(() => import('@/pages/StorySynthLabPage'));
const FlashGlowPage = lazy(() => import('@/pages/FlashGlowPage'));
const ARFiltersPage = lazy(() => import('@/pages/ARFiltersPage'));
const BubbleBeatPage = lazy(() => import('@/pages/BubbleBeatPage'));
const ScreenSilkBreakPage = lazy(() => import('@/pages/ScreenSilkBreakPage'));
const VRGalactiquePage = lazy(() => import('@/pages/VRGalactiquePage'));
const InstantGlowWidgetPage = lazy(() => import('@/pages/InstantGlowWidgetPage'));
const WeeklyBarsPage = lazy(() => import('@/pages/WeeklyBarsPage'));
const HeatmapVibesPage = lazy(() => import('@/pages/HeatmapVibesPage'));
const BreathworkPage = lazy(() => import('@/pages/BreathworkPage'));
const PrivacyTogglesPage = lazy(() => import('@/pages/PrivacyTogglesPage'));
const DataExportPage = lazy(() => import('@/pages/DataExportPage'));
const AccountDeletionPage = lazy(() => import('@/pages/AccountDeletionPage'));
const PlatformStatusPage = lazy(() => import('@/pages/PlatformStatusPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const HelpCenterPage = lazy(() => import('@/pages/HelpCenterPage'));
const ProfileSettingsPage = lazy(() => import('@/pages/ProfileSettingsPage'));
const ActivityHistoryPage = lazy(() => import('@/pages/ActivityHistoryPage'));
const InAppFeedbackPage = lazy(() => import('@/pages/InAppFeedbackPage'));
const TeamsPage = lazy(() => import('@/pages/TeamsPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const EventsPage = lazy(() => import('@/pages/EventsPage'));
const OptimisationPage = lazy(() => import('@/pages/OptimisationPage'));
const PlatformSettingsPage = lazy(() => import('@/pages/PlatformSettingsPage'));
const SecurityDashboardPage = lazy(() => import('@/pages/SecurityDashboardPage'));
const SystemAuditPage = lazy(() => import('@/pages/SystemAuditPage'));
const AccessibilityPage = lazy(() => import('@/pages/AccessibilityPage'));

// Mapping des composants par chemin
const componentMap: Record<string, React.ComponentType> = {
  '/': HomePage,
  '/choose-mode': ChooseModePage,
  '/onboarding': OnboardingFlowPage,
  '/b2b/selection': B2BSelectionPage,
  '/b2c/login': B2CLoginPage,
  '/b2c/register': B2CRegisterPage,
  '/b2c/dashboard': B2CDashboardPage,
  '/b2b/user/login': B2BUserLoginPage,
  '/b2b/user/register': B2BUserRegisterPage,
  '/b2b/user/dashboard': B2BUserDashboardPage,
  '/b2b/admin/login': B2BAdminLoginPage,
  '/b2b/admin/dashboard': B2BAdminDashboardPage,
  '/b2b': B2BLandingPage,
  '/scan': EmotionScanPage,
  '/music': MusicotherapiePage,
  '/coach': AICoachPage,
  '/journal': JournalPage,
  '/vr': VRHubPage,
  '/preferences': UserPreferencesPage,
  '/gamification': GamificationPage,
  '/social-cocon': SocialCoconPage,
  '/boss-level-grit': BossLevelGritPage,
  '/mood-mixer': MoodMixerPage,
  '/ambition-arcade': AmbitionArcadePage,
  '/bounce-back-battle': BounceBackBattlePage,
  '/story-synth-lab': StorySynthLabPage,
  '/flash-glow': FlashGlowPage,
  '/ar-filters': ARFiltersPage,
  '/bubble-beat': BubbleBeatPage,
  '/screen-silk-break': ScreenSilkBreakPage,
  '/vr-galactique': VRGalactiquePage,
  '/instant-glow': InstantGlowWidgetPage,
  '/weekly-bars': WeeklyBarsPage,
  '/heatmap-vibes': HeatmapVibesPage,
  '/breathwork': BreathworkPage,
  '/privacy-toggles': PrivacyTogglesPage,
  '/export-csv': DataExportPage,
  '/account/delete': AccountDeletionPage,
  '/health-check-badge': PlatformStatusPage,
  '/notifications': NotificationsPage,
  '/help-center': HelpCenterPage,
  '/profile-settings': ProfileSettingsPage,
  '/activity-history': ActivityHistoryPage,
  '/feedback': InAppFeedbackPage,
  '/teams': TeamsPage,
  '/reports': ReportsPage,
  '/events': EventsPage,
  '/optimisation': OptimisationPage,
  '/settings': PlatformSettingsPage,
  '/security': SecurityDashboardPage,
  '/audit': SystemAuditPage,
  '/accessibility': AccessibilityPage,
};

export function buildUnifiedRoutes(): RouteObject[] {
  console.log('🔧 Building unified routes with', ROUTE_MANIFEST.length, 'entries');

  // Génération automatique des routes depuis le manifeste
  const routes: RouteObject[] = ROUTE_MANIFEST.map(routePath => {
    const Component = componentMap[routePath];
    
    if (!Component) {
      console.warn(`⚠️ Component not found for route: ${routePath}`);
      return {
        path: routePath,
        element: (
          <div data-testid="page-root" className="min-h-screen bg-background p-8">
            <h1 className="text-2xl font-bold text-red-600">
              Route non implémentée: {routePath}
            </h1>
          </div>
        ),
      };
    }

    return {
      path: routePath,
      element: (
        <React.Suspense fallback={<ComponentLoadingFallback />}>
          <Component />
        </React.Suspense>
      ),
    };
  });

  // Route 404 en fallback
  routes.push({
    path: '*',
    element: (
      <React.Suspense fallback={<ComponentLoadingFallback />}>
        <NotFoundPage />
      </React.Suspense>
    ),
  });

  console.log('✅ Unified routes built:', routes.length, 'total routes');
  return [
    {
      path: '/',
      element: <Shell />,
      children: routes,
    },
  ];
}

// Export du manifeste pour les audits
export const ROUTES_MANIFEST = ROUTE_MANIFEST;
export type RouteManifestEntry = string;

// Fonction de validation
export function validateRoutesManifest(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Vérification des doublons
  const duplicates = ROUTE_MANIFEST.filter((route, index) => 
    ROUTE_MANIFEST.indexOf(route) !== index
  );
  
  if (duplicates.length > 0) {
    errors.push(`Doublons détectés: ${duplicates.join(', ')}`);
  }
  
  // Vérification des routes manquantes dans le componentMap
  const missingComponents = ROUTE_MANIFEST.filter(route => !componentMap[route]);
  if (missingComponents.length > 0) {
    errors.push(`Composants manquants pour: ${missingComponents.join(', ')}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

console.log('📊 Route coverage validation:', validateRoutesManifest());
