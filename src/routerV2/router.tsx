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
const UnifiedLoginPage = lazy(() => import('@/pages/UnifiedLoginPage'));
const HomeB2CPage = lazy(() => import('@/pages/HomeB2CPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const HelpPage = lazy(() => import('@/pages/HelpPage'));
const DemoPage = lazy(() => import('@/pages/DemoPage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));

// Pages légales
const MentionsLegalesPage = lazy(() => import('@/pages/legal/MentionsLegalesPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/legal/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('@/pages/legal/TermsPage'));
const SalesTermsPage = lazy(() => import('@/pages/legal/SalesTermsPage'));
const LicensesPage = lazy(() => import('@/pages/legal/LicensesPage'));
const CookiesPage = lazy(() => import('@/pages/legal/CookiesPage'));

// Store Shopify
const StorePage = lazy(() => import('@/pages/StorePage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));

// Auth & Landing unifiées
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const ExamModePage = lazy(() => import('@/pages/ExamModePage'));

// Dashboards B2B
const B2BCollabDashboard = lazy(() => import('@/pages/B2BCollabDashboard'));
const B2BRHDashboard = lazy(() => import('@/pages/B2BRHDashboard'));
const AppGatePage = lazy(() => import('@/pages/AppGatePage'));

// Modules fonctionnels
const B2CScanPage = lazy(() => import('@/pages/B2CScanPage'));
// const B2CMusicEnhanced = lazy(() => import('@/pages/B2CMusicEnhanced')); // Removed - file deleted
const MusicAnalyticsPage = lazy(() => import('@/pages/MusicAnalyticsPage'));
const MusicProfilePage = lazy(() => import('@/pages/MusicProfilePage'));
const AdvancedAnalyticsPage = lazy(() => import('@/pages/AdvancedAnalyticsPage'));
// EmotionMusicPage supprimé - utiliser B2CMusicEnhanced
// EmotionMusicLibraryPage supprimé - utiliser B2CMusicEnhanced
const B2CAICoachPage = lazy(() => import('@/pages/B2CAICoachPage'));
const B2CJournalPage = lazy(() => import('@/pages/B2CJournalPage'));
const B2CVRBreathGuidePage = lazy(() => import('@/pages/B2CVRBreathGuidePage'));
const B2CVRGalaxyPage = lazy(() => import('@/pages/B2CVRGalaxyPage'));
// VRBreathPage supprimé - utiliser B2CVRBreathGuidePage

// Modules Fun-First
const B2CFlashGlowPage = lazy(() => import('@/pages/B2CFlashGlowPage'));
const B2CBreathworkPage = lazy(() => import('@/pages/B2CBreathworkPage'));
const B2CARFiltersPage = lazy(() => import('@/pages/B2CARFiltersPage'));
const B2CBubbleBeatPage = lazy(() => import('@/pages/B2CBubbleBeatPage'));
const B2CScreenSilkBreakPage = lazy(() => import('@/pages/B2CScreenSilkBreakPage'));
const MeditationPage = lazy(() => import('@/pages/MeditationPage'));

// Analytics - nettoyage (pages non utilisées dans registry)

// Paramètres
// const B2CSettingsPage = lazy(() => import('@/pages/B2CSettingsPage')); // Removed
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

// GDPR & Compliance pages
const UnifiedGDPRDashboard = lazy(() => import('@/pages/admin/UnifiedGDPRDashboard'));
const APIMonitoringDashboard = lazy(() => import('@/pages/admin/APIMonitoringDashboard'));
const AIMonitoringDashboard = lazy(() => import('@/pages/admin/AIMonitoringDashboard'));
const AlertConfigurationPage = lazy(() => import('@/pages/admin/AlertConfigurationPage'));
const AlertAnalyticsDashboard = lazy(() => import('@/pages/admin/AlertAnalyticsDashboard'));
const AlertTemplatesPage = lazy(() => import('@/pages/admin/AlertTemplatesPage'));
const AlertTemplatePlayground = lazy(() => import('@/pages/admin/AlertTemplatePlayground'));
const ScheduledReportsPage = lazy(() => import('@/pages/admin/ScheduledReportsPage'));
const AlertEscalationConfig = lazy(() => import('@/pages/admin/AlertEscalationConfig'));
const AITemplateSuggestions = lazy(() => import('@/pages/admin/AITemplateSuggestions'));
const EscalationMonitoringDashboard = lazy(() => import('@/pages/admin/EscalationMonitoringDashboard'));
const TicketIntegrationConfig = lazy(() => import('@/pages/admin/TicketIntegrationConfig'));
const ABTestManager = lazy(() => import('@/pages/admin/ABTestManager'));
const NotificationWebhooksConfig = lazy(() => import('@/pages/admin/NotificationWebhooksConfig'));
const SystemHealthDashboard = lazy(() => import('@/pages/admin/SystemHealthDashboard'));
const ExecutiveDashboard = lazy(() => import('@/pages/admin/ExecutiveDashboard'));
const IncidentReportsPage = lazy(() => import('@/pages/admin/IncidentReportsPage'));
const UnifiedAdminDashboard = lazy(() => import('@/pages/admin/UnifiedAdminDashboard'));
const CronJobsSetupPage = lazy(() => import('@/pages/admin/CronJobsSetupPage'));
const AlertTesterPage = lazy(() => import('@/pages/admin/AlertTesterPage'));
const MLAssignmentRulesPage = lazy(() => import('@/pages/admin/MLAssignmentRulesPage'));
const TeamMemberSkillsPage = lazy(() => import('@/pages/admin/TeamMemberSkillsPage'));
const GamificationCronMonitoring = lazy(() => import('@/pages/admin/GamificationCronMonitoring'));
const MusicQueueAdminPage = lazy(() => import('@/pages/admin/MusicQueueAdminPage'));
const MusicQueueMetricsPage = lazy(() => import('@/pages/admin/MusicQueueMetricsPage'));
const UserRolesPage = lazy(() => import('@/pages/admin/UserRolesPage'));
const ChallengesHistory = lazy(() => import('@/pages/app/ChallengesHistory'));
const CreateCustomChallenge = lazy(() => import('@/pages/admin/CreateCustomChallenge'));
const EditCustomChallenge = lazy(() => import('@/pages/admin/EditCustomChallenge'));
const ChallengesDashboard = lazy(() => import('@/pages/admin/ChallengesDashboard'));
const MusicAnalyticsDashboard = lazy(() => import('@/pages/admin/MusicAnalyticsDashboard'));
const Achievements = lazy(() => import('@/pages/app/Achievements'));
const CronMonitoring = lazy(() => import('@/pages/CronMonitoring'));
const BlockchainBackups = lazy(() => import('@/pages/BlockchainBackups'));
const MonitoringDashboard = lazy(() => import('@/pages/admin/MonitoringDashboard'));

// System Health & Analytics
const SystemHealthPage = lazy(() => import('@/pages/SystemHealthPage'));
const AdminSystemHealthPage = lazy(() => import('@/pages/AdminSystemHealthPage'));
const K6AnalyticsDashboard = lazy(() => import('@/pages/K6AnalyticsDashboard'));

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

// Legal pages - SUPPRIMÉ car doublons, voir lignes 45-50

// Pages nouvellement créées
// CoachChatPage supprimé - utiliser B2CAICoachPage
// VRSessionsPage supprimé - fonctionnalité dans B2CVRBreathGuidePage
const JournalNewPage = lazy(() => import('@/pages/JournalNewPage'));
const JournalSettingsPage = lazy(() => import('@/pages/JournalSettings'));
const ReportingPage = lazy(() => import('@/pages/ReportingPage'));
const ExportPage = lazy(() => import('@/pages/ExportPage'));
const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage'));
const GuildListPage = lazy(() => import('@/pages/GuildListPage'));
const GuildPage = lazy(() => import('@/pages/GuildPage'));
const PremiumRewardsPage = lazy(() => import('@/pages/PremiumRewardsPage'));
const TournamentsPage = lazy(() => import('@/pages/TournamentsPage'));
const MatchSpectatorPage = lazy(() => import('@/pages/MatchSpectatorPage'));
const CompetitiveSeasonsPage = lazy(() => import('@/pages/CompetitiveSeasonsPage'));
const DailyChallengesPage = lazy(() => import('@/pages/DailyChallengesPage'));
const B2CGamificationPage = lazy(() => import('@/pages/B2CGamificationPage'));
const ScoresPage = lazy(() => import('@/pages/ScoresPage'));
const PricingPageWorking = lazy(() => import('@/pages/PricingPageWorking'));

// Pages existantes à consolider
const MessagesPage = lazy(() => import('@/pages/MessagesPage'));
const CalendarPage = lazy(() => import('@/pages/CalendarPage'));
const Point20Page = lazy(() => import('@/pages/Point20Page'));
const TestPage = lazy(() => import('@/pages/TestPage'));
// EmotionsPage supprimé - utiliser B2CScanPage
// GeneralPage supprimé - doublon de B2CSettingsPage
// PrivacyPage supprimé - doublon de B2CPrivacyTogglesPage, utiliser LegalPrivacyPage pour /privacy

// Import des nouveaux modules optimisés
const FlashGlowPage = lazy(() => import('@/pages/flash-glow/index'));
// JournalPage supprimé - utiliser B2CJournalPage
const ScanPage = lazy(() => import('@/pages/B2CScanPage'));
const CoachPage = lazy(() => import('@/pages/B2CAICoachPage'));
const MoodMixerPage = lazy(() => import('@/pages/B2CMoodMixerPage'));
const BossGritPage = lazy(() => import('@/modules/boss-grit/BossGritPage'));
const BubbleBeatPage = lazy(() => import('@/pages/B2CBubbleBeatPage'));
const StorySynthPage = lazy(() => import('@/pages/B2CStorySynthLabPage'));

// Pages DEV uniquement
const ComprehensiveSystemAuditPage = lazy(() => import('@/pages/ComprehensiveSystemAuditPage'));
const ErrorBoundaryTestPage = lazy(() => import('@/pages/dev/ErrorBoundaryTestPage'));
const TestAccountsPage = lazy(() => import('@/pages/TestAccountsPage'));

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
const RedirectToScan = lazy(() => import('@/pages/RedirectToScan'));
const RedirectToJournal = lazy(() => import('@/pages/RedirectToJournal'));
const RedirectToSocialCocon = lazy(() => import('@/components/redirects/RedirectToSocialCocon'));
const RedirectToEntreprise = lazy(() => import('@/pages/RedirectToEntreprise'));
const RedirectToMusic = lazy(() => import('@/components/redirects/RedirectToMusic'));

// Pages Dashboard modules
const ModulesDashboard = lazy(() => import('@/pages/ModulesDashboard'));
// FacialScanPage supprimé - fusionné dans B2CScanPage
const VoiceScanPage = lazy(() => import('@/pages/VoiceScanPage'));
const TextScanPage = lazy(() => import('@/pages/TextScanPage'));
// MusicGeneratePage supprimé - fonctionnalité dans B2CMusicEnhanced
// MusicLibraryPage supprimé - fonctionnalité dans B2CMusicEnhanced
const ModeSelectionPage = lazy(() => import('@/pages/ModeSelectionPage'));
const B2CDashboardPage = lazy(() => import('@/pages/B2CDashboardPage'));
// B2CMoodPage supprimé - fonctionnalité intégrée dans B2CScanPage
// B2CMusicPage supprimé - utiliser B2CMusicEnhanced
const EmotionalPark = lazy(() => import('@/pages/EmotionalPark'));
const ParkJourney = lazy(() => import('@/pages/ParkJourney'));
const CoachProgramsPage = lazy(() => import('@/pages/CoachProgramsPage'));
const CoachProgramDetailPage = lazy(() => import('@/pages/CoachProgramDetailPage'));
const CoachSessionsPage = lazy(() => import('@/pages/CoachSessionsPage'));
const CoachAnalyticsPage = lazy(() => import('@/pages/CoachAnalyticsPage'));
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
// JournalAudioPage supprimé - fonctionnalité dans B2CJournalPage
const VoiceAnalysisPage = lazy(() => import('@/pages/VoiceAnalysisPage'));
const FriendsPage = lazy(() => import('@/pages/FriendsPage'));
const GroupsPage = lazy(() => import('@/pages/GroupsPage'));
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
const NavigationPage = lazy(() => import('@/pages/NavigationPage'));

// ═══════════════════════════════════════════════════════════
// MAPPING DES COMPOSANTS
// ═══════════════════════════════════════════════════════════

const componentMap: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  // Public unifiées
  HomePage,
  HomeB2CPage,
  AboutPage,
  ContactPage,
  HelpPage,
  DemoPage,
  OnboardingPage,
  UnifiedLoginPage,
  SignupPage,
  ExamModePage,

  // Pages légales
  MentionsLegalesPage,
  PrivacyPolicyPage,
  SalesTermsPage,
  LicensesPage,
  CookiesPage,
  TermsPage,
  // PrivacyPage supprimé - utiliser LegalPrivacyPage
  
  // Store Shopify
  StorePage,
  ProductDetailPage,
  
  // App & B2B Enterprise
  AppGatePage,
  B2BEntreprisePage,
  B2BSelectionPage,
  B2BCollabDashboard,
  B2BRHDashboard,
  
  // Modules
  B2CScanPage,
  // B2CMusicEnhanced, // Removed
  MusicAnalyticsPage,
  MusicProfilePage,
  AdvancedAnalyticsPage,
  // EmotionMusicPage supprimé
  // EmotionMusicLibraryPage supprimé
  B2CAICoachPage,
  B2CJournalPage,
  B2CVRBreathGuidePage,
  B2CVRGalaxyPage,
  // VRBreathPage supprimé
  
  // Fun-First
  B2CFlashGlowPage,
  B2CBreathworkPage,
  B2CARFiltersPage,
  B2CBubbleBeatPage,
  B2CScreenSilkBreakPage,
  MeditationPage,
  
  // Analytics & Gamification
  B2CGamificationPage,
  LeaderboardPage,
  GuildListPage,
  GuildPage,
  PremiumRewardsPage,
  TournamentsPage,
  MatchSpectatorPage,
  CompetitiveSeasonsPage,
  DailyChallengesPage,
  ScoresPage,
  
  // Admin Escalation & Monitoring
  NotificationWebhooksConfig,
  SystemHealthDashboard,
  ExecutiveDashboard,
  IncidentReportsPage,
  UnifiedAdminDashboard,
  CronJobsSetupPage,
  AlertTesterPage,
  MLAssignmentRulesPage,
  TeamMemberSkillsPage,
  
  // Settings
  // B2CSettingsPage, // Removed
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
  // ChooseModePage supprimé - utiliser ModeSelectionPage
  // CoachChatPage supprimé
  // VRSessionsPage supprimé
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
  // EmotionsPage supprimé
  // ProfilePage supprimé - utiliser B2CProfileSettingsPage
  // GeneralPage supprimé - doublon
  // PrivacyPage supprimé - doublon
  
  // Legal pages - déjà définis plus haut lignes 275-280
  // Ajouter alias pour compatibilité registry.ts
  PrivacyPage: PrivacyPolicyPage,
  LegalTermsPage: TermsPage,
  LegalPrivacyPage: PrivacyPolicyPage,
  LegalMentionsPage: MentionsLegalesPage,
  LegalSalesPage: SalesTermsPage,
  LegalCookiesPage: CookiesPage,
  
  // System unifiées
  UnauthorizedPage,
  ForbiddenPage,
  UnifiedErrorPage,
  NotFoundPage,
  ServerErrorPage,
  
  // Import des nouveaux modules optimisés
  FlashGlowPage,
  // JournalPage supprimé
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
  ModulesDashboard,
  // UnifiedModulesDashboard supprimé - wrapper inutile
  // FacialScanPage supprimé
  VoiceScanPage,
  TextScanPage,
  // MusicGeneratePage supprimé
  // MusicLibraryPage supprimé
  PricingPageWorking,
  ModeSelectionPage,
  B2CDashboardPage,
  // B2CMoodPage supprimé - fonctionnalité intégrée dans B2CScanPage
  // B2CMusicPage supprimé
  EmotionalPark,
  ParkJourney,
  ParcoursXL,
  CoachProgramsPage,
  CoachProgramDetailPage,
  CoachSessionsPage,
  CoachAnalyticsPage,
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
  // JournalAudioPage supprimé
  VoiceAnalysisPage,
  FriendsPage,
  GroupsPage,
  // FeedPage supprimé - utiliser B2CCommunautePage
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
  NavigationPage,
  
  // GDPR & Compliance
  UnifiedGDPRDashboard,
  APIMonitoringDashboard,
  AIMonitoringDashboard,
  AlertConfigurationPage,
  AlertAnalyticsDashboard,
  AlertTemplatesPage,
  AlertTemplatePlayground,
  ScheduledReportsPage,
  AlertEscalationConfig,
  AITemplateSuggestions,
  EscalationMonitoringDashboard,
  TicketIntegrationConfig,
  ABTestManager,
  GamificationCronMonitoring,
  MusicQueueAdminPage,
  MusicQueueMetricsPage,
  UserRolesPage,
  ChallengesHistory,
  CreateCustomChallenge,
  EditCustomChallenge,
  ChallengesDashboard,
  MusicAnalyticsDashboard,
  Achievements,
  CronMonitoring,
  BlockchainBackups,
  MonitoringDashboard,
  
  // System Health & Analytics
  SystemHealthPage,
  AdminSystemHealthPage,
  K6AnalyticsDashboard,

  // ═══════════════════════════════════════════════════════════
  // ALIASES FOR REGISTRY COMPATIBILITY
  // Registry uses "Page" suffix that may differ from lazy import names
  // ═══════════════════════════════════════════════════════════

  // Dashboard aliases
  B2BCollabDashboardPage: B2BCollabDashboard,
  B2BRHDashboardPage: B2BRHDashboard,
  ModulesDashboardPage: ModulesDashboard,

  // Page suffix aliases
  PricingPageWorkingPage: PricingPageWorking,
  ParcoursXLPage: ParcoursXL,
  CronMonitoringPage: CronMonitoring,
  BlockchainBackupsPage: BlockchainBackups,

  // Admin pages aliases
  UnifiedGDPRDashboardPage: UnifiedGDPRDashboard,
  APIMonitoringDashboardPage: APIMonitoringDashboard,
  AIMonitoringDashboardPage: AIMonitoringDashboard,
  AlertConfigurationPagePage: AlertConfigurationPage,
  AlertAnalyticsDashboardPage: AlertAnalyticsDashboard,
  AlertTemplatePlaygroundPage: AlertTemplatePlayground,
  AlertEscalationConfigPage: AlertEscalationConfig,
  AITemplateSuggestionsPage: AITemplateSuggestions,
  EscalationMonitoringDashboardPage: EscalationMonitoringDashboard,
  TicketIntegrationConfigPage: TicketIntegrationConfig,
  ABTestManagerPage: ABTestManager,
  NotificationWebhooksConfigPage: NotificationWebhooksConfig,
  SystemHealthDashboardPage: SystemHealthDashboard,
  ExecutiveDashboardPage: ExecutiveDashboard,
  UnifiedAdminDashboardPage: UnifiedAdminDashboard,
  GamificationCronMonitoringPage: GamificationCronMonitoring,
  // MusicQueueMetricsPage already defined above
  MusicAnalyticsDashboardPage: MusicAnalyticsDashboard,
  MonitoringDashboardPage: MonitoringDashboard,

  // Challenges aliases
  ChallengesHistoryPage: ChallengesHistory,
  CreateCustomChallengePage: CreateCustomChallenge,
  EditCustomChallengePage: EditCustomChallenge,
  ChallengesDashboardPage: ChallengesDashboard,

  // Settings alias - map to profile settings since B2CSettingsPage was removed
  B2CSettingsPage: B2CProfileSettingsPage,

  // Music alias - B2CMusicEnhanced was removed, redirect to MusicAnalyticsPage
  B2CMusicEnhancedPage: MusicAnalyticsPage,

  // Redirect page aliases
  RedirectToEntreprisePage: RedirectToEntreprise,
  RedirectToScanPage: RedirectToScan,
  RedirectToJournalPage: RedirectToJournal,

  // Park pages aliases
  EmotionalParkPage: EmotionalPark,
  ParkJourneyPage: ParkJourney,

  // System health alias
  K6AnalyticsDashboardPage: K6AnalyticsDashboard,

  // Scan pages - FacialScanPage doesn't exist, use B2CScanPage
  FacialScanPage: B2CScanPage,
  EmojiScanPage: B2CScanPage,

  // Journal sub-pages - map to main journal
  JournalActivityPage: B2CJournalPage,
  JournalAnalyticsPage: B2CJournalPage,
  JournalArchivePage: B2CJournalPage,
  JournalFavoritesPage: B2CJournalPage,
  JournalGoalsPage: B2CJournalPage,
  JournalNotesPage: B2CJournalPage,
  JournalSearchPage: B2CJournalPage,

  // Missing admin pages - stub to existing pages
  RecommendationEngineAdminPage: UnifiedAdminDashboard,
  SupportChatbotPage: SupportPage,
  PublicAPIPage: HelpPage,
  B2BAnalyticsPage: B2BReportsPage,
  B2BUserCoachPage: B2CAICoachPage,
  UnifiedDashboardPage: B2CDashboardPage,
  UnifiedHomePage: HomePage,
  B2CImmersivePage: B2CVRGalaxyPage,
  ActivityLogsPage: AnalyticsPage,
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

  // Logger.error désactivé pour éviter la pollution des logs en développement
  // Les composants manquants sont des erreurs non bloquantes qui seront détectées lors de la navigation
  if (missingComponents.length > 0 && !window.__routerV2Logged) {
    logger.debug('RouterV2: composants manquants', { missingComponents }, 'SYSTEM');
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