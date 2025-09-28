/**
 * RouterV2 Registry - Toutes les routes canoniques
 * TICKET: FE/BE-Router-Cleanup-01
 */

import { RouteMeta } from './schema';

export const ROUTES_REGISTRY: RouteMeta[] = [
  // ═══════════════════════════════════════════════════════════
  // ROUTES PUBLIQUES
  // ═══════════════════════════════════════════════════════════
  {
    name: 'home',
    path: '/',
    segment: 'public',
    layout: 'marketing',
    component: 'HomePage',
    guard: false, // Pas de guard - accessible à tous
  },
  // /home redirect supprimé - confus et inutile
  {
    name: 'about',
    path: '/about',
    segment: 'public',
    layout: 'marketing',
    component: 'AboutPage',
  },
  {
    name: 'contact',
    path: '/contact',
    segment: 'public',
    layout: 'marketing',
    component: 'ContactPage',
  },
  {
    name: 'help',
    path: '/help',
    segment: 'public',
    layout: 'marketing',
    component: 'HelpPage',
  },
  {
    name: 'demo',
    path: '/demo',
    segment: 'public',
    layout: 'marketing',
    component: 'DemoPage',
  },
  {
    name: 'onboarding',
    path: '/onboarding',
    segment: 'public',
    layout: 'marketing',
    component: 'OnboardingPage',
  },
  {
    name: 'privacy',
    path: '/privacy',
    segment: 'public',
    layout: 'marketing',
    component: 'PrivacyPage',
  },
  {
    name: 'b2c-landing',
    path: '/b2c',
    segment: 'public',
    layout: 'marketing',
    component: 'HomeB2CPage',
    aliases: ['/choose-mode'],
  },
  {
    name: 'b2b-landing',
    path: '/entreprise',
    segment: 'public', 
    layout: 'marketing',
    component: 'B2BEntreprisePage',
    aliases: ['/b2b'],
  },
  // /b2b/landing -> redirection vers /entreprise
  {
    name: 'b2b-landing-redirect',
    path: '/b2b/landing',
    segment: 'public',
    layout: 'marketing',
    component: 'RedirectToEntreprise',
    deprecated: true,
  },
  {
    name: 'b2b-selection',
    path: '/b2b/selection',
    segment: 'b2b',
    layout: 'app',
    guard: true,
    component: 'B2BSelectionPage',
  },
  {
    name: 'b2b-reports-heatmap',
    path: '/b2b/reports',
    segment: 'manager',
    role: 'manager',
    layout: 'app',
    guard: true,
    component: 'B2BReportsHeatmapPage',
  },
  {
    name: 'login',
    path: '/login',
    segment: 'public',
    layout: 'marketing',
    component: 'UnifiedLoginPage',
    aliases: ['/auth', '/b2c/login', '/b2b/user/login', '/b2b/admin/login'],
  },
  {
    name: 'signup',
    path: '/signup',
    segment: 'public',
    layout: 'marketing', 
    component: 'SignupPage',
    aliases: ['/register', '/b2c/register', '/b2b/user/register'],
  },

  // ═══════════════════════════════════════════════════════════
  // APP DISPATCHER & DASHBOARDS
  // ═══════════════════════════════════════════════════════════
  {
    name: 'app-gate',
    path: '/app',
    segment: 'consumer',
    layout: 'app',
    component: 'AppGatePage',
    guard: false,
  },
  {
    name: 'consumer-home',
    path: '/app/home',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'HomePage',
    guard: true,
    aliases: ['/b2c/dashboard', '/dashboard'],
  },
  {
    name: 'employee-home',
    path: '/app/collab',
    segment: 'employee',
    role: 'employee',
    layout: 'app',
    component: 'B2BCollabDashboard',
    guard: true,
    aliases: ['/b2b/user/dashboard'],
  },
  {
    name: 'manager-home',
    path: '/app/rh',
    segment: 'manager',
    role: 'manager',
    layout: 'app',
    component: 'B2BRHDashboard',
    guard: true,
    aliases: ['/b2b/admin/dashboard'],
  },

  // ═══════════════════════════════════════════════════════════
  // MODULES FONCTIONNELS (CONSUMER)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'scan',
    path: '/app/scan',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CScanPage',
    guard: true,
    aliases: ['/scan'],
  },
  {
    name: 'music',
    path: '/app/music',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CMusicEnhanced',
    guard: true,
    aliases: ['/music'],
  },
  {
    name: 'music-premium',
    path: '/app/music-premium',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CMusicTherapyPremiumPage',
    guard: true,
    aliases: ['/music-therapy-premium'],
  },
  {
    name: 'coach',
    path: '/app/coach',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CAICoachPage',
    guard: true,
    aliases: ['/coach'],
  },
  {
    name: 'coach-micro',
    path: '/app/coach-micro',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CAICoachMicroPage',
    guard: true,
    aliases: ['/coach-micro-decisions'],
  },
  {
    name: 'journal',
    path: '/app/journal',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CJournalPage',
    guard: true,
    aliases: ['/journal', '/voice-journal'],
  },
  {
    name: 'vr',
    path: '/app/vr',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CVRGalaxyPage',
    guard: true,
    aliases: ['/vr'],
  },
  
  // ═══════════════════════════════════════════════════════════
  // MODULES FUN-FIRST (CONSUMER)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'flash-glow',
    path: '/app/flash-glow',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CFlashGlowPage',
    guard: true,
    aliases: ['/flash-glow', '/instant-glow', '/b2c-flash-glow', '/flash-glow-advanced'],
  },
  {
    name: 'breath',
    path: '/app/breath',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CBreathworkPage',
    guard: true,
    aliases: ['/breathwork', '/breathwork-adaptive'],
  },
  {
    name: 'face-ar',
    path: '/app/face-ar',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CARFiltersPage',
    guard: true,
    aliases: ['/ar-filters'],
  },
  {
    name: 'bubble-beat',
    path: '/app/bubble-beat',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CBubbleBeatPage',
    guard: true,
    aliases: ['/bubble-beat'],
  },
  // Redirections vers routes principales (garder aliases pour 301)
  {
    name: 'emotion-scan-redirect',
    path: '/app/emotion-scan',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'RedirectToScan',
    guard: true,
    aliases: ['/emotion-scan'],
    deprecated: true,
  },
  {
    name: 'voice-journal-redirect',
    path: '/app/voice-journal',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'RedirectToJournal',
    guard: true,
    aliases: ['/voice-journal'],
    deprecated: true,
  },
  // emotions route obsolète - alias vers scan
  {
    name: 'emotions-redirect',
    path: '/app/emotions',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'RedirectToScan',
    guard: true,
    aliases: ['/emotions'],
    deprecated: true,
  },
  {
    name: 'community',
    path: '/app/community',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CCommunautePage',
    guard: true,
    aliases: ['/community'],
  },
  {
    name: 'screen-silk',
    path: '/app/screen-silk',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CScreenSilkBreakPage',
    guard: true,
    aliases: ['/screen-silk-break'],
  },
  {
    name: 'vr-breath-guide',
    path: '/app/vr-breath-guide',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CVRBreathGuidePage',
    guard: true,
    aliases: ['/vr-breath-ariane'],
  },
  {
    name: 'vr-galaxy',
    path: '/app/vr-galaxy',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CVRGalaxyPage',
    guard: true,
    aliases: ['/vr-galactique'],
  },
  {
    name: 'vr-breath',
    path: '/app/vr-breath',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'VRBreathPage',
    guard: true,
    aliases: ['/vr-respiration'],
  },
  {
    name: 'boss-grit',
    path: '/app/boss-grit',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CBossLevelGritPage',
    guard: true,
    aliases: ['/boss-level-grit'],
  },
  {
    name: 'mood-mixer',
    path: '/app/mood-mixer',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CMoodMixerPage',
    guard: true,
    aliases: ['/mood-mixer'],
  },
  {
    name: 'mood-presets-admin',
    path: '/app/mood-presets',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'MoodPresetsAdminPage',
    guard: true,
  },
  {
    name: 'ambition-arcade',
    path: '/app/ambition-arcade',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CAmbitionArcadePage',
    guard: true,
    aliases: ['/ambition-arcade'],
  },
  {
    name: 'bounce-back',
    path: '/app/bounce-back',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CBounceBackBattlePage',
    guard: true,
    aliases: ['/bounce-back-battle'],
  },
  {
    name: 'story-synth',
    path: '/app/story-synth',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CStorySynthLabPage',
    guard: true,
    aliases: ['/story-synth-lab'],
  },
  {
    name: 'social-cocon-b2c',
    path: '/app/social-cocon',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CSocialCoconPage',
    guard: true,
    aliases: ['/social-cocon'],
  },
  {
    name: 'communaute-b2c',
    path: '/app/communaute',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CCommunautePage',
    guard: true,
    aliases: ['/communaute'],
  },

  // ═══════════════════════════════════════════════════════════
  // ANALYTICS & DATA (CONSUMER)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'leaderboard',
    path: '/app/leaderboard',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'LeaderboardPage',
    guard: true,
    aliases: ['/leaderboard'],
  },
  {
    name: 'gamification',
    path: '/gamification',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'GamificationPage',
    guard: true,
  },
  {
    name: 'activity',
    path: '/app/activity',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CActivitePage',
    guard: true,
    aliases: ['/weekly-bars', '/activity-history'],
  },
  {
    name: 'heatmap',
    path: '/app/scores',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'ScoresPage',
    guard: true,
    aliases: ['/app/heatmap', '/heatmap-vibes'],
  },
  
  // Routes supplémentaires
  {
    name: 'coach-chat',
    path: '/coach-chat',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'CoachChatPage',
    guard: true,
  },
  {
    name: 'vr-sessions',
    path: '/vr-sessions',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'VRSessionsPage',
    guard: true,
  },
  {
    name: 'journal-new',
    path: '/journal/new',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'JournalNewPage',
    guard: true,
  },
  
  // ═══════════════════════════════════════════════════════════
  // PAGES EXISTANTES NON MAPPÉES (CONSOLIDATION)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'messages',
    path: '/messages',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'MessagesPage',
    guard: true,
    aliases: ['/chat', '/nyvee-chat'],
  },
  {
    name: 'calendar',
    path: '/calendar',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'CalendarPage',
    guard: true,
    aliases: ['/agenda'],
  },
  {
    name: 'point20',
    path: '/point20',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'Point20Page',
    guard: true,
    aliases: ['/recuperation-20'],
  },
  {
    name: 'test-page',
    path: '/test',
    segment: 'public',
    layout: 'simple',
    component: 'TestPage',
  },
  {
    name: 'journal-legacy',
    path: '/journal',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CJournalPage',
    guard: true,
    deprecated: true, // Redirection vers /app/journal
  },
  {
    name: 'music-legacy',
    path: '/music',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CMusicEnhanced',
    guard: true,
    deprecated: true, // Redirection vers /app/music
  },
  {
    name: 'emotions-legacy',
    path: '/emotions',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'EmotionsPage',
    guard: true,
    deprecated: true, // Redirection vers /app/scan
  },
  {
    name: 'profile-legacy',
    path: '/profile',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'ProfilePage',
    guard: true,
    deprecated: true, // Redirection vers /settings/profile
  },
  {
    name: 'settings-legacy',
    path: '/settings',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'GeneralPage',
    guard: true,
    deprecated: true, // Redirection vers /settings/general
  },
  {
    name: 'privacy-legacy',
    path: '/privacy',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'PrivacyPage',
    guard: true,
    deprecated: true, // Redirection vers /settings/privacy
  },
  {
    name: 'reporting',
    path: '/reporting',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'ReportingPage',
    guard: true,
  },
  {
    name: 'export',
    path: '/export',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'ExportPage',
    guard: true,
  },
  {
    name: 'navigation',
    path: '/navigation',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'NavigationPage',
    guard: true,
  },
  {
    name: 'choose-mode',
    path: '/choose-mode',
    segment: 'public',
    layout: 'simple',
    component: 'ChooseModePage',
  },
  {
    name: 'modules-journal',
    path: '/modules/journal',
    segment: 'public',
    layout: 'app',
    component: 'JournalPage',
    guard: false,
  },

  // ═══════════════════════════════════════════════════════════
  // PARAMÈTRES & COMPTE
  // ═══════════════════════════════════════════════════════════
  {
    name: 'settings-general',
    path: '/settings/general',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CSettingsPage',
    guard: true,
    aliases: ['/settings', '/preferences'],
  },
  {
    name: 'settings-profile',
    path: '/settings/profile',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CProfileSettingsPage',
    guard: true,
    aliases: ['/profile-settings'],
  },
  {
    name: 'settings-privacy',
    path: '/settings/privacy',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CPrivacyTogglesPage',
    guard: true,
    aliases: ['/privacy-toggles', '/settings/data-privacy'],
  },
  {
    name: 'settings-notifications',
    path: '/settings/notifications',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CNotificationsPage',
    guard: true,
    aliases: ['/notifications'],
  },

  // ═══════════════════════════════════════════════════════════
  // B2B FEATURES (EMPLOYEE)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'teams',
    path: '/app/teams',
    segment: 'employee',
    role: 'employee',
    layout: 'app',
    component: 'B2BTeamsPage',
    guard: true,
    aliases: ['/teams'],
  },
  {
    name: 'social-cocon-b2b',
    path: '/app/social',
    segment: 'employee',
    role: 'employee',
    layout: 'app',
    component: 'B2BSocialCoconPage',
    guard: true,
  },

  // ═══════════════════════════════════════════════════════════
  // B2B ADMIN (MANAGER)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'admin-reports',
    path: '/app/reports',
    segment: 'manager',
    role: 'manager',
    layout: 'app',
    component: 'B2BReportsPage',
    guard: true,
    aliases: ['/reports'],
  },
  {
    name: 'admin-reports-period',
    path: '/app/reports/:period',
    segment: 'manager',
    role: 'manager',
    layout: 'app',
    component: 'B2BReportDetailPage',
    guard: true,
  },
  {
    name: 'admin-events',
    path: '/app/events',
    segment: 'manager',
    role: 'manager',
    layout: 'app',
    component: 'B2BEventsPage',
    guard: true,
    aliases: ['/events'],
  },
  {
    name: 'admin-optimization',
    path: '/app/optimization',
    segment: 'manager',
    role: 'manager',
    layout: 'app',
    component: 'B2BOptimisationPage',
    guard: true,
    aliases: ['/optimisation'],
  },
  {
    name: 'admin-security',
    path: '/app/security',
    segment: 'manager',
    role: 'manager',
    layout: 'app',
    component: 'B2BSecurityPage',
    guard: true,
    aliases: ['/security'],
  },
  {
    name: 'admin-audit',
    path: '/app/audit',
    segment: 'manager',
    role: 'manager',
    layout: 'app',
    component: 'B2BAuditPage',
    guard: true,
    aliases: ['/audit'],
  },
  {
    name: 'admin-accessibility',
    path: '/app/accessibility',
    segment: 'manager',
    role: 'manager',
    layout: 'app',
    component: 'B2BAccessibilityPage',
    guard: true,
    aliases: ['/accessibility'],
  },

  
  // ═══════════════════════════════════════════════════════════
  // TOOLS & NAVIGATION PAGES
  // ═══════════════════════════════════════════════════════════
  // Routes supprimées (pages orphelines nettoyées)
  // - NavigationPage (supprimée)
  // - CompleteFeatureMatrix (supprimée) 
  // - MissingPagesManifest (supprimée)

  // ═══════════════════════════════════════════════════════════
  // DÉVELOPPEMENT (UNIQUEMENT SI DEBUG)
  // ═══════════════════════════════════════════════════════════
  ...(process.env.NODE_ENV === 'development' ? [
    {
      name: 'validation',
      path: '/validation',
      segment: 'public',
      layout: 'simple',
      component: 'ValidationPage',
    }
  ] : []),

  // ═══════════════════════════════════════════════════════════
  // DEV-ONLY ROUTES (Masquées en production)
  // ═══════════════════════════════════════════════════════════
  // Routes de développement masquées en production
  ...(import.meta.env.DEV ? [
    {
      name: 'nyvee-cocon',
      path: '/app/nyvee',
      segment: 'consumer',
      role: 'consumer',
      layout: 'app',
      component: 'B2CNyveeCoconPage',
      guard: true,
    },
    {
      name: 'comprehensive-system-audit',
      path: '/dev/system-audit',
      segment: 'public',
      layout: 'app',
      component: 'ComprehensiveSystemAuditPage',
      guard: false,
    },
    {
      name: 'dev-error-boundary',
      path: '/dev/error-boundary',
      segment: 'public',
      layout: 'marketing',
      component: 'ErrorBoundaryTestPage',
      guard: false,
    },
  // Routes de debug supprimées (pages orphelines nettoyées)
  // - DiagnosticPage (supprimée)
  // - SystemValidationPage (supprimée) 
  // - SystemRepairPage (supprimée)
  ] : []),

  // ═══════════════════════════════════════════════════════════
  // PAGES SYSTÈME
  // ═══════════════════════════════════════════════════════════
  {
    name: 'unauthorized',
    path: '/401',
    segment: 'public',
    layout: 'marketing',
    component: 'UnauthorizedPage',
  },
  {
    name: 'forbidden',
    path: '/403',
    segment: 'public',
    layout: 'marketing',
    component: 'ForbiddenPage',
  },
  {
    name: 'not-found',
    path: '/404',
    segment: 'public',
    layout: 'marketing',
    component: 'UnifiedErrorPage',
  },
  {
    name: 'server-error',
    path: '/500',
    segment: 'public',
    layout: 'marketing',
    component: 'ServerErrorPage',
  },
  
  // ═══════════════════════════════════════════════════════════
  // LEGAL & COMPLIANCE PAGES
  // ═══════════════════════════════════════════════════════════
  {
    name: 'legal-terms',
    path: '/legal/terms',
    segment: 'public',
    layout: 'marketing',
    component: 'LegalTermsPage',
    aliases: ['/terms', '/conditions'],
  },
  {
    name: 'legal-privacy',
    path: '/legal/privacy',
    segment: 'public',
    layout: 'marketing',
    component: 'LegalPrivacyPage',
    aliases: ['/privacy-policy'],
  },
  {
    name: 'legal-mentions',
    path: '/legal/mentions',
    segment: 'public',
    layout: 'marketing',
    component: 'LegalMentionsPage',
    aliases: ['/mentions-legales', '/legal'],
  },
  {
    name: 'legal-sales',
    path: '/legal/sales',
    segment: 'public',
    layout: 'marketing',
    component: 'LegalSalesPage',
    aliases: ['/cgv', '/conditions-ventes'],
  },
  {
    name: 'legal-cookies',
    path: '/legal/cookies',
    segment: 'public',
    layout: 'marketing',
    component: 'LegalCookiesPage',
    aliases: ['/cookies-policy', '/cookies'],
  },
  
  // ═══════════════════════════════════════════════════════════
  // BILLING & SUBSCRIPTION
  // ═══════════════════════════════════════════════════════════
  {
    name: 'subscribe',
    path: '/subscribe',
    segment: 'consumer',
    layout: 'app',
    component: 'SubscribePage',
    guard: true,
    aliases: ['/billing', '/plans'],
  },

  // ═══════════════════════════════════════════════════════════
  // 404 FALLBACK ROUTE (must be last)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'catch-all',
    path: '*',
    segment: 'public',
    layout: 'simple',
    component: 'UnifiedErrorPage',
    meta: {
      title: 'Page introuvable - EmotionsCare',
      description: 'Cette page n\'existe pas',
    },
  },
];