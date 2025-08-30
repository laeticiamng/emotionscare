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
    component: 'HomeB2C',
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
    name: 'login',
    path: '/login',
    segment: 'public',
    layout: 'marketing',
    component: 'LoginPage',
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
    component: 'DebugDashboard',
    guard: false,
  },
  {
    name: 'consumer-home',
    path: '/app/home',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CDashboardPage',
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
    name: 'journal',
    path: '/app/journal',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CJournalPage',
    guard: true,
    aliases: ['/journal'],
  },
  {
    name: 'vr',
    path: '/app/vr',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CVRPage',
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
    aliases: ['/flash-glow', '/instant-glow', '/b2c-flash-glow'],
  },
  {
    name: 'breath',
    path: '/app/breath',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CBreathworkPage',
    guard: true,
    aliases: ['/breathwork'],
  },
  {
    name: 'vr-breath',
    path: '/app/vr-breath',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CBreathVRPage',
    guard: true,
    aliases: ['/vr-respiration'],
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
  // community -> social-cocon
  {
    name: 'community-redirect',
    path: '/app/community',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'RedirectToSocialCocon',
    guard: true,
    aliases: ['/community'],
    deprecated: true,
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
    name: 'vr-galaxy',
    path: '/app/vr-galaxy',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CVRGalactiquePage',
    guard: true,
    aliases: ['/vr-galactique'],
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

  // ═══════════════════════════════════════════════════════════
  // ANALYTICS & DATA (CONSUMER)
  // ═══════════════════════════════════════════════════════════
  {
    name: 'leaderboard',
    path: '/app/leaderboard',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CGamificationPage',
    guard: true,
    aliases: ['/gamification'],
  },
  {
    name: 'activity',
    path: '/app/activity',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'B2CActivityHistoryPage',
    guard: true,
    aliases: ['/weekly-bars', '/activity-history'],
  },
  {
    name: 'heatmap',
    path: '/app/heatmap',
    segment: 'manager',
    role: 'manager',
    layout: 'app',
    component: 'B2CHeatmapVibesPage',
    guard: true,
    aliases: ['/heatmap-vibes'],
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
    name: 'feature-matrix',
    path: '/feature-matrix',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'CompleteFeatureMatrix',
    guard: true,
  },
  {
    name: 'missing-pages-manifest',
    path: '/missing-pages',
    segment: 'consumer',
    role: 'consumer',
    layout: 'app',
    component: 'MissingPagesManifest',
    guard: true,
  },

  // ═══════════════════════════════════════════════════════════
  // DEV-ONLY ROUTES (Masquées en production)
  // ═══════════════════════════════════════════════════════════
  // Routes de développement masquées en production
  ...(import.meta.env.DEV ? [
    {
      name: 'diagnostic',
      path: '/diagnostic',
      segment: 'public',
      layout: 'simple',
      component: 'DiagnosticPage',
    },
    {
      name: 'system-validation',
      path: '/system/validation',
      segment: 'public',
      layout: 'simple',
      component: 'SystemValidationPage',
    },
    {
      name: 'system-repair',
      path: '/system/repair',
      segment: 'public',
      layout: 'simple',
      component: 'SystemRepairPage',
    },
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
    component: 'NotFoundPage',
  },
  {
    name: 'catch-all',
    path: '*',
    segment: 'public',
    layout: 'marketing',
    component: 'NotFoundPage',
  },
  {
    name: 'server-error',
    path: '/503',
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
    name: 'not-found',
    path: '*',
    segment: 'public',
    layout: 'simple',
    component: 'NotFoundPage',
    meta: {
      title: 'Page introuvable - EmotionsCare',
      description: 'Cette page n\'existe pas',
    },
  },
];