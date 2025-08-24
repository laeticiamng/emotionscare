import React from 'react';
import { RouteObject } from 'react-router-dom';
import { OFFICIAL_ROUTES } from '../routesManifest';
import AppShell from '../components/layout/AppShell';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Lazy load all pages for the 52 official routes
const HomePage = React.lazy(() => import('../pages/HomePage'));
const NotFoundPage = React.lazy(() => import('../pages/NotFoundPage'));

// Mesure émotionnelle et biométrie (9 routes)
const EmotionScanPage = React.lazy(() => import('../pages/EmotionScanPage'));
const ARFiltersPage = React.lazy(() => import('../pages/ARFiltersPage'));
const BubbleBeatPage = React.lazy(() => import('../pages/BubbleBeatPage'));
const ScreenSilkBreakPage = React.lazy(() => import('../pages/ScreenSilkBreakPage'));
const VRGalactiquePage = React.lazy(() => import('../pages/VRGalactiquePage'));
const VRHubPage = React.lazy(() => import('../pages/VRHubPage'));
const BreathworkPage = React.lazy(() => import('../pages/BreathworkPage'));
const InstantGlowPage = React.lazy(() => import('../pages/InstantGlowPage'));
const PlatformStatusPage = React.lazy(() => import('../pages/PlatformStatusPage'));

// Résilience et rebond (5 routes)
const BossLevelGritPage = React.lazy(() => import('../pages/BossLevelGritPage'));
const BounceBackBattlePage = React.lazy(() => import('../pages/BounceBackBattlePage'));
const FlashGlowPage = React.lazy(() => import('../pages/FlashGlowPage'));
const WeeklyBarsPage = React.lazy(() => import('../pages/WeeklyBarsPage'));
const HeatmapVibesPage = React.lazy(() => import('../pages/HeatmapVibesPage'));

// Ambition, motivation, progression (4 routes)
const AmbitionArcadePage = React.lazy(() => import('../pages/AmbitionArcadePage'));
const MoodMixerPage = React.lazy(() => import('../pages/MoodMixerPage'));
const MusicTherapyPage = React.lazy(() => import('../pages/MusicTherapyPage'));
const GamificationPage = React.lazy(() => import('../pages/GamificationPage'));

// Journal et insights (4 routes)
const JournalPage = React.lazy(() => import('../pages/JournalPage'));
const DataExportPage = React.lazy(() => import('../pages/DataExportPage'));
const ActivityHistoryPage = React.lazy(() => import('../pages/ActivityHistoryPage'));
const InAppFeedbackPage = React.lazy(() => import('../pages/InAppFeedbackPage'));

// Onboarding, accès, préférences (9 routes)
const OnboardingPage = React.lazy(() => import('../pages/OnboardingPage'));
const ChooseModePage = React.lazy(() => import('../pages/ChooseModePage'));
const ProfileSettingsPage = React.lazy(() => import('../pages/ProfileSettingsPage'));
const UserPreferencesPage = React.lazy(() => import('../pages/UserPreferencesPage'));
const PrivacyTogglesPage = React.lazy(() => import('../pages/PrivacyTogglesPage'));
const NotificationsPage = React.lazy(() => import('../pages/NotificationsPage'));
const HelpCenterPage = React.lazy(() => import('../pages/HelpCenterPage'));
const AccountDeletionPage = React.lazy(() => import('../pages/AccountDeletionPage'));

// B2C (3 routes)
const B2CLoginPage = React.lazy(() => import('../pages/B2CLoginPage'));
const B2CRegisterPage = React.lazy(() => import('../pages/B2CRegisterPage'));
const B2CDashboardPage = React.lazy(() => import('../pages/B2CDashboardPage'));

// B2B (6 routes)
const B2BSelectionPage = React.lazy(() => import('../pages/B2BSelectionPage'));
const B2BUserLoginPage = React.lazy(() => import('../pages/B2BUserLoginPage'));
const B2BUserRegisterPage = React.lazy(() => import('../pages/B2BUserRegisterPage'));
const B2BUserDashboardPage = React.lazy(() => import('../pages/B2BUserDashboardPage'));
const B2BAdminLoginPage = React.lazy(() => import('../pages/B2BAdminLoginPage'));
const B2BAdminDashboardPage = React.lazy(() => import('../pages/B2BAdminDashboardPage'));

// B2B Admin (12 routes)
const TeamsPage = React.lazy(() => import('../pages/TeamsPage'));
const ReportsPage = React.lazy(() => import('../pages/ReportsPage'));
const EventsPage = React.lazy(() => import('../pages/EventsPage'));
const OptimisationPage = React.lazy(() => import('../pages/OptimisationPage'));
const SettingsPage = React.lazy(() => import('../pages/SettingsPage'));
const SecurityDashboardPage = React.lazy(() => import('../pages/SecurityDashboardPage'));
const SystemAuditPage = React.lazy(() => import('../pages/SystemAuditPage'));
const AccessibilityPage = React.lazy(() => import('../pages/AccessibilityPage'));
const InnovationLabPage = React.lazy(() => import('../pages/InnovationLabPage'));

// Additional required pages
const CoachPage = React.lazy(() => import('../pages/CoachPage'));

// Suspense wrapper component
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <React.Suspense fallback={<LoadingSpinner />}>
    {children}
  </React.Suspense>
);

export const buildUnifiedRoutes = (): RouteObject[] => {
  return [
    {
      path: '/',
      element: <AppShell />,
      children: [
        // Home (1 route)
        { 
          path: OFFICIAL_ROUTES.HOME, 
          element: <SuspenseWrapper><HomePage /></SuspenseWrapper> 
        },
        
        // Mesure émotionnelle et biométrie (8 routes)
        { 
          path: OFFICIAL_ROUTES.SCAN, 
          element: <SuspenseWrapper><EmotionScanPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.MUSIC, 
          element: <SuspenseWrapper><MusicTherapyPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.FLASH_GLOW, 
          element: <SuspenseWrapper><FlashGlowPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.BOSS_LEVEL_GRIT, 
          element: <SuspenseWrapper><BossLevelGritPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.MOOD_MIXER, 
          element: <SuspenseWrapper><MoodMixerPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.BOUNCE_BACK_BATTLE, 
          element: <SuspenseWrapper><BounceBackBattlePage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.BREATHWORK, 
          element: <SuspenseWrapper><BreathworkPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.INSTANT_GLOW, 
          element: <SuspenseWrapper><InstantGlowPage /></SuspenseWrapper> 
        },
        
        // Expériences immersives (6 routes)
        { 
          path: OFFICIAL_ROUTES.VR, 
          element: <SuspenseWrapper><VRHubPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.VR_GALACTIQUE, 
          element: <SuspenseWrapper><VRGalactiquePage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.SCREEN_SILK_BREAK, 
          element: <SuspenseWrapper><ScreenSilkBreakPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.STORY_SYNTH_LAB, 
          element: <SuspenseWrapper><CoachPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.AR_FILTERS, 
          element: <SuspenseWrapper><ARFiltersPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.BUBBLE_BEAT, 
          element: <SuspenseWrapper><BubbleBeatPage /></SuspenseWrapper> 
        },
        
        // Ambition & progression (4 routes)
        { 
          path: OFFICIAL_ROUTES.AMBITION_ARCADE, 
          element: <SuspenseWrapper><AmbitionArcadePage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.GAMIFICATION, 
          element: <SuspenseWrapper><GamificationPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.WEEKLY_BARS, 
          element: <SuspenseWrapper><WeeklyBarsPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.HEATMAP_VIBES, 
          element: <SuspenseWrapper><HeatmapVibesPage /></SuspenseWrapper> 
        },
        
        // Espaces utilisateur (16 routes)
        { 
          path: OFFICIAL_ROUTES.CHOOSE_MODE, 
          element: <SuspenseWrapper><ChooseModePage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.ONBOARDING, 
          element: <SuspenseWrapper><OnboardingPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.B2C_LOGIN, 
          element: <SuspenseWrapper><B2CLoginPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.B2C_REGISTER, 
          element: <SuspenseWrapper><B2CRegisterPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.B2C_DASHBOARD, 
          element: <SuspenseWrapper><B2CDashboardPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.PREFERENCES, 
          element: <SuspenseWrapper><UserPreferencesPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.SOCIAL_COCON, 
          element: <SuspenseWrapper><CoachPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.PROFILE_SETTINGS, 
          element: <SuspenseWrapper><ProfileSettingsPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.ACTIVITY_HISTORY, 
          element: <SuspenseWrapper><ActivityHistoryPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.NOTIFICATIONS, 
          element: <SuspenseWrapper><NotificationsPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.FEEDBACK, 
          element: <SuspenseWrapper><InAppFeedbackPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.ACCOUNT_DELETE, 
          element: <SuspenseWrapper><AccountDeletionPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.EXPORT_CSV, 
          element: <SuspenseWrapper><DataExportPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.PRIVACY_TOGGLES, 
          element: <SuspenseWrapper><PrivacyTogglesPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.HEALTH_CHECK_BADGE, 
          element: <SuspenseWrapper><PlatformStatusPage /></SuspenseWrapper> 
        },
        
        // B2B espaces (18 routes)
        { 
          path: OFFICIAL_ROUTES.B2B, 
          element: <SuspenseWrapper><B2BSelectionPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.B2B_SELECTION, 
          element: <SuspenseWrapper><B2BSelectionPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.B2B_USER_LOGIN, 
          element: <SuspenseWrapper><B2BUserLoginPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.B2B_USER_REGISTER, 
          element: <SuspenseWrapper><B2BUserRegisterPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.B2B_USER_DASHBOARD, 
          element: <SuspenseWrapper><B2BUserDashboardPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.B2B_ADMIN_LOGIN, 
          element: <SuspenseWrapper><B2BAdminLoginPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.B2B_ADMIN_DASHBOARD, 
          element: <SuspenseWrapper><B2BAdminDashboardPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.TEAMS, 
          element: <SuspenseWrapper><TeamsPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.REPORTS, 
          element: <SuspenseWrapper><ReportsPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.EVENTS, 
          element: <SuspenseWrapper><EventsPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.OPTIMISATION, 
          element: <SuspenseWrapper><OptimisationPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.SETTINGS, 
          element: <SuspenseWrapper><SettingsPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.SECURITY, 
          element: <SuspenseWrapper><SecurityDashboardPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.AUDIT, 
          element: <SuspenseWrapper><SystemAuditPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.ACCESSIBILITY, 
          element: <SuspenseWrapper><AccessibilityPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.INNOVATION, 
          element: <SuspenseWrapper><InnovationLabPage /></SuspenseWrapper> 
        },
        { 
          path: OFFICIAL_ROUTES.HELP_CENTER, 
          element: <SuspenseWrapper><HelpCenterPage /></SuspenseWrapper> 
        },
        
        // 404 catch-all
        { 
          path: '*', 
          element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper> 
        }
      ]
    }
  ];
};

// Export route manifest for testing and auditing
export const ROUTE_MANIFEST = Object.values(OFFICIAL_ROUTES);

console.log(`✅ Unified Router: ${ROUTE_MANIFEST.length}/52 routes configured`);