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
import { createBrowserRouter, Navigate, Link } from 'react-router-dom';
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
const HomePage = lazy(() => import('@/components/home/HomePage'));
const UnifiedLoginPage = lazy(() => import('@/pages/UnifiedLoginPage'));
const HomeB2CPage = lazy(() => import('@/pages/HomeB2CPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const HelpPage = lazy(() => import('@/pages/HelpPage'));
const DemoPage = lazy(() => import('@/pages/DemoPage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
const FeaturesPage = lazy(() => import('@/pages/features/FeaturesPage'));
const DashboardSettingsPage = lazy(() => import('@/pages/settings/DashboardSettingsPage'));

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
const B2BCollabDashboard = lazy(() => import('@/pages/b2b/B2BCollabDashboard'));
const B2BRHDashboard = lazy(() => import('@/pages/b2b/B2BRHDashboard'));
const AppGatePage = lazy(() => import('@/pages/AppGatePage'));

// Modules fonctionnels
const B2CScanPage = lazy(() => import('@/pages/b2c/B2CScanPage'));
const B2CMusicEnhanced = lazy(() => import('@/pages/b2c/B2CMusicEnhanced'));
const MusicTherapyPage = lazy(() => import('@/pages/music/MusicTherapyPage'));
const MusicAnalyticsPage = lazy(() => import('@/pages/music/MusicAnalyticsPage'));
const MusicProfilePage = lazy(() => import('@/pages/music/MusicProfilePage'));
const CollaborativePlaylistPage = lazy(() => import('@/pages/music/CollaborativePlaylistPage'));
const AdvancedAnalyticsPage = lazy(() => import('@/pages/AdvancedAnalyticsPage'));
// EmotionMusicPage supprimé - utiliser MusicTherapyPage ou B2CMusicEnhanced
const B2CAICoachPage = lazy(() => import('@/pages/b2c/B2CAICoachPage'));
const ClinicalAssessmentsPage = lazy(() => import('@/pages/assessments/ClinicalAssessmentsPage'));
const B2CJournalPage = lazy(() => import('@/pages/b2c/B2CJournalPage'));
const EmotionalJournalPage = lazy(() => import('@/pages/journal/EmotionalJournalPage'));
const B2CVoiceJournalPage = lazy(() => import('@/pages/b2c/B2CVoiceJournalPage'));
const EmotionSessionNewPage = lazy(() => import('@/pages/EmotionSessionNewPage'));
const EmotionSessionHistoryPage = lazy(() => import('@/pages/EmotionSessionHistoryPage'));
const B2CVRBreathGuidePage = lazy(() => import('@/pages/b2c/B2CVRBreathGuidePage'));
const B2CVRGalaxyPage = lazy(() => import('@/pages/b2c/B2CVRGalaxyPage'));
// VRBreathPage supprimé - utiliser B2CVRBreathGuidePage

// Modules Fun-First
const B2CFlashGlowPage = lazy(() => import('@/pages/b2c/B2CFlashGlowPage'));
const B2CBreathworkPage = lazy(() => import('@/pages/b2c/B2CBreathworkPage'));
const B2CARFiltersPage = lazy(() => import('@/pages/b2c/B2CARFiltersPage'));
const B2CBubbleBeatPage = lazy(() => import('@/pages/b2c/B2CBubbleBeatPage'));
const B2CScreenSilkBreakPage = lazy(() => import('@/pages/b2c/B2CScreenSilkBreakPage'));
const MeditationPage = lazy(() => import('@/pages/MeditationPage'));
const SeuilPage = lazy(() => import('@/pages/SeuilPage'));

// Analytics - nettoyage (pages non utilisées dans registry)

// Paramètres
const B2CSettingsPage = lazy(() => import('@/pages/b2c/B2CSettingsPage'));
const B2CProfileSettingsPage = lazy(() => import('@/pages/b2c/B2CProfileSettingsPage'));
const DataSettingsPage = lazy(() => import('@/pages/DataSettingsPage'));
const B2CPrivacyTogglesPage = lazy(() => import('@/pages/b2c/B2CPrivacyTogglesPage'));
const B2CNotificationsPage = lazy(() => import('@/pages/b2c/B2CNotificationsPage'));
const HowItAdaptsPage = lazy(() => import('@/pages/HowItAdaptsPage'));

// B2B Features - use dedicated pages
const B2BTeamsPage = lazy(() => import('@/pages/b2b/B2BTeamsPage'));
const B2BSocialCoconPage = lazy(() => import('@/pages/b2b/B2BSocialCoconPage'));
const B2BReportsPage = lazy(() => import('@/pages/b2b/B2BReportsPage'));
const B2BReportDetailPage = lazy(() => import('@/pages/b2b/B2BReportDetailPage'));
const B2BReportsHeatmapPage = lazy(() => import('@/pages/b2b/reports'));
const B2BEventsPage = lazy(() => import('@/pages/b2b/B2BEventsPage'));
const B2BAlertsPage = lazy(() => import('@/pages/b2b/B2BAlertsPage'));
const B2BAnalyticsPageReal = lazy(() => import('@/pages/b2b/B2BAnalyticsPage'));

// Additional B2B pages - use correct paths
const B2BOptimisationPage = lazy(() => import('@/pages/b2b/B2BOptimisationPage'));
const B2BSecurityPage = lazy(() => import('@/pages/b2b/B2BSecurityPage'));
const B2BAuditPage = lazy(() => import('@/pages/b2b/B2BAuditPage'));
const B2BAccessibilityPage = lazy(() => import('@/pages/b2b/B2BAccessibilityPage'));

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
const B2CAmbitionArcadePage = lazy(() => import('@/pages/b2c/B2CAmbitionArcadePage'));
const B2CBossLevelGritPage = lazy(() => import('@/pages/b2c/B2CBossLevelGritPage'));
const B2CBounceBackBattlePage = lazy(() => import('@/pages/b2c/B2CBounceBackBattlePage'));
const B2CMoodMixerPage = lazy(() => import('@/pages/b2c/B2CMoodMixerPage'));
const MoodPresetsAdminPage = lazy(() => import('@/pages/MoodPresetsAdminPage'));
const B2CSocialCoconPage = lazy(() => import('@/pages/b2c/B2CSocialCoconPage'));
const B2CStorySynthLabPage = lazy(() => import('@/pages/b2c/B2CStorySynthLabPage'));
const B2CCommunautePage = lazy(() => import('@/pages/b2c/B2CCommunautePage'));
const GroupSessionsPage = lazy(() => import('@/pages/social/GroupSessionsPage'));
const BuddiesPage = lazy(() => import('@/pages/social/BuddiesPage'));
const B2BSelectionPage = lazy(() => import('@/pages/b2b/B2BSelectionPage'));

// B2B Enterprise
const B2BEntreprisePage = lazy(() => import('@/pages/b2b/B2BEntreprisePage'));

// B2B Institutional (nouvelles pages)
const InstitutionalLandingPage = lazy(() => import('@/pages/b2b/InstitutionalLandingPage'));
const InstitutionalAccessPage = lazy(() => import('@/pages/b2b/InstitutionalAccessPage'));
const WellnessHubPage = lazy(() => import('@/pages/b2b/WellnessHubPage'));
const B2BModuleWrapperPage = lazy(() => import('@/pages/b2b/B2BModuleWrapperPage'));
const OrgDashboardPage = lazy(() => import('@/pages/b2b/admin/OrgDashboardPage'));
const B2BSettingsPage = lazy(() => import('@/pages/b2b/admin/SettingsPage'));
const B2BInstitutionalReportsPage = lazy(() => import('@/pages/b2b/reports/ReportsPage'));

// TIMECRAFT - Module de design du temps
const TimeCraftPage = lazy(() => import('@/pages/timecraft/TimeCraftPage'));
const TimeCraftB2BPage = lazy(() => import('@/pages/timecraft/TimeCraftB2BPage'));

const B2CMusicTherapyPremiumPage = lazy(() => import('@/pages/b2c/B2CMusicTherapyPremiumPage'));
const B2CAICoachMicroPage = lazy(() => import('@/pages/b2c/B2CAICoachMicroPage'));
const B2CActivitePage = lazy(() => import('@/pages/b2c/B2CActivitePage'));
const SubscribePage = lazy(() => import('@/pages/SubscribePage'));
const B2CNyveeCoconPage = lazy(() => import('@/pages/b2c/B2CNyveeCoconPage'));
const NyveeTestPage = lazy(() => import('@/pages/NyveeTestPage'));
const ValidationPage = lazy(() => import('@/pages/ValidationPage'));

// Legal pages - SUPPRIMÉ car doublons, voir lignes 45-50

// Pages nouvellement créées
// CoachChatPage supprimé - utiliser B2CAICoachPage
// VRSessionsPage supprimé - fonctionnalité dans B2CVRBreathGuidePage
const JournalNewPage = lazy(() => import('@/pages/JournalNewPage'));
const JournalSettingsPage = lazy(() => import('@/pages/journal/JournalSettingsPage'));
const ReportingPage = lazy(() => import('@/pages/ReportingPage'));
const ExportPage = lazy(() => import('@/pages/ExportPage'));

// Journal sub-pages
const JournalActivityPage = lazy(() => import('@/pages/journal/JournalActivityPage'));
const JournalAnalyticsPage = lazy(() => import('@/pages/journal/JournalAnalyticsPage'));
const JournalArchivePage = lazy(() => import('@/pages/journal/JournalArchivePage'));
const JournalFavoritesPage = lazy(() => import('@/pages/journal/JournalFavoritesPage'));
const JournalGoalsPage = lazy(() => import('@/pages/journal/JournalGoalsPage'));
const JournalNotesPage = lazy(() => import('@/pages/journal/JournalNotesPage'));
const JournalSearchPage = lazy(() => import('@/pages/journal/JournalSearchPage'));
const LeaderboardPage = lazy(() => import('@/pages/AurasLeaderboardPage'));
const GuildListPage = lazy(() => import('@/pages/gamification/GuildListPage'));
const GuildPage = lazy(() => import('@/pages/gamification/GuildPage'));
const PremiumRewardsPage = lazy(() => import('@/pages/PremiumRewardsPage'));
const TournamentsPage = lazy(() => import('@/pages/gamification/TournamentsPage'));
const MatchSpectatorPage = lazy(() => import('@/pages/MatchSpectatorPage'));
const CompetitiveSeasonsPage = lazy(() => import('@/pages/CompetitiveSeasonsPage'));
const DailyChallengesPage = lazy(() => import('@/pages/gamification/DailyChallengesPage'));
const B2CGamificationPage = lazy(() => import('@/pages/b2c/B2CGamificationPage'));
const ScoresPage = lazy(() => import('@/pages/gamification/ScoresPage'));
const PricingPageWorking = lazy(() => import('@/pages/PricingPageWorking'));
const ScannerEmotionnelPage = lazy(() => import('@/pages/ScannerEmotionnelPage'));
const B2BDashboardAnalytics = lazy(() => import('@/pages/b2b/B2BDashboardAnalytics'));

// Pages existantes à consolider
const MessagesPage = lazy(() => import('@/pages/social/MessagesPage'));
const CalendarPage = lazy(() => import('@/pages/CalendarPage'));
const Point20Page = lazy(() => import('@/pages/Point20Page'));
const TestPage = lazy(() => import('@/pages/TestPage'));
// EmotionsPage supprimé - utiliser B2CScanPage
// GeneralPage supprimé - doublon de B2CSettingsPage
// PrivacyPage supprimé - doublon de B2CPrivacyTogglesPage, utiliser LegalPrivacyPage pour /privacy

// Import des nouveaux modules optimisés
const FlashGlowPage = lazy(() => import('@/pages/flash-glow/index'));
// JournalPage supprimé - utiliser B2CJournalPage
const ScanPage = lazy(() => import('@/pages/b2c/B2CScanPage'));
const CoachPage = lazy(() => import('@/pages/b2c/B2CAICoachPage'));
const MoodMixerPage = lazy(() => import('@/pages/b2c/B2CMoodMixerPage'));
const BossGritPage = lazy(() => import('@/modules/boss-grit/BossGritPage'));
const BubbleBeatPage = lazy(() => import('@/pages/b2c/B2CBubbleBeatPage'));
const StorySynthPage = lazy(() => import('@/pages/b2c/B2CStorySynthLabPage'));

// Pages DEV uniquement
const ComprehensiveSystemAuditPage = lazy(() => import('@/pages/ComprehensiveSystemAuditPage'));
const ErrorBoundaryTestPage = lazy(() => import('@/pages/dev/ErrorBoundaryTestPage'));
const TestAccountsPage = lazy(() => import('@/pages/TestAccountsPage'));
const SEOAuditPage = lazy(() => import('@/pages/admin/SEOAuditPage'));

// Pages supplémentaires existantes
const PublicAPIPage = lazy(() => import('@/pages/PublicAPIPage'));
const SupportChatbotPage = lazy(() => import('@/pages/SupportChatbotPage'));
const RecommendationEngineAdminPage = lazy(() => import('@/pages/RecommendationEngineAdminPage'));
const ActivityLogsPage = lazy(() => import('@/pages/ActivityLogsPage'));

// Analytics & Weekly Bars
const B2CWeeklyBarsPage = lazy(() => import('@/pages/b2c/B2CWeeklyBarsPage'));
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
// Pages Scan spécialisées
const ScanFacialPage = lazy(() => import('@/pages/app/ScanFacialPage'));
const ScanVoicePage = lazy(() => import('@/pages/app/ScanVoicePage'));
const ScanTextPage = lazy(() => import('@/pages/app/ScanTextPage'));
const VoiceScanPage = lazy(() => import('@/pages/VoiceScanPage'));
const TextScanPage = lazy(() => import('@/pages/TextScanPage'));
const QuestionnaireScannerPage = lazy(() => import('@/pages/scanner/QuestionnaireScannerPage'));
const BreathingPage = lazy(() => import('@/pages/breathing/BreathingPage'));
// MusicGeneratePage supprimé - fonctionnalité dans B2CMusicEnhanced
// MusicLibraryPage supprimé - fonctionnalité dans B2CMusicEnhanced
const ModeSelectionPage = lazy(() => import('@/pages/ModeSelectionPage'));
const B2CDashboardPage = lazy(() => import('@/pages/b2c/B2CDashboardPage'));
// B2CMoodPage supprimé - fonctionnalité intégrée dans B2CScanPage
// B2CMusicPage supprimé - utiliser B2CMusicEnhanced
const EmotionalPark = lazy(() => import('@/pages/EmotionalPark'));
const ParkJourney = lazy(() => import('@/pages/ParkJourney'));
const EmotionAtlasPage = lazy(() => import('@/modules/emotion-atlas/pages/EmotionAtlasPage'));
const DiscoveryPage = lazy(() => import('@/modules/discovery/pages/DiscoveryPage'));
const CoachProgramsPage = lazy(() => import('@/pages/coach/CoachProgramsPage'));
const CoachProgramDetailPage = lazy(() => import('@/pages/coach/CoachProgramDetailPage'));
const CoachSessionsPage = lazy(() => import('@/pages/coach/CoachSessionsPage'));
const CoachAnalyticsPage = lazy(() => import('@/pages/coach/CoachAnalyticsPage'));
const ParcoursXL = lazy(() => import('@/pages/ParcoursXL'));

// Nouvelles pages créées
const SessionsPage = lazy(() => import('@/pages/SessionsPage'));
const SessionDetailPage = lazy(() => import('@/pages/SessionDetailPage'));
const GoalsPage = lazy(() => import('@/pages/GoalsPage'));
const GoalDetailPage = lazy(() => import('@/pages/GoalDetailPage'));
const GoalNewPage = lazy(() => import('@/pages/GoalNewPage'));
const AchievementsPage = lazy(() => import('@/pages/gamification/AchievementsPage'));
const BadgesPage = lazy(() => import('@/pages/gamification/BadgesPage'));
const RewardsPage = lazy(() => import('@/pages/gamification/RewardsPage'));
const ChallengesPage = lazy(() => import('@/pages/gamification/ChallengesPage'));
const ChallengeDetailPage = lazy(() => import('@/pages/gamification/ChallengeDetailPage'));
const ChallengeCreatePage = lazy(() => import('@/pages/gamification/ChallengeCreatePage'));
const NotificationsCenterPage = lazy(() => import('@/pages/NotificationsCenterPage'));
const PremiumPage = lazy(() => import('@/pages/PremiumPage'));
const PaymentSuccessPage = lazy(() => import('@/pages/PaymentSuccess'));
const BillingPage = lazy(() => import('@/pages/BillingPage'));
const SupportPage = lazy(() => import('@/pages/SupportPage'));
const FAQPage = lazy(() => import('@/pages/FAQPage'));
const TicketsPage = lazy(() => import('@/pages/TicketsPage'));
const InsightsPage = lazy(() => import('@/pages/InsightsPage'));
const TrendsPage = lazy(() => import('@/pages/TrendsPage'));
// JournalAudioPage supprimé - fonctionnalité dans B2CJournalPage
const VoiceAnalysisPage = lazy(() => import('@/pages/VoiceAnalysisPage'));
const FriendsPage = lazy(() => import('@/pages/social/FriendsPage'));
const GroupsPage = lazy(() => import('@/pages/social/GroupsPage'));
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

// Settings pages
const LanguageSettingsPage = lazy(() => import('@/pages/settings/LanguageSettingsPage'));
const SecuritySettingsPage = lazy(() => import('@/pages/settings/SecuritySettingsPage'));

// Exchange Hub V2.0
const ExchangeHubPage = lazy(() => import('@/pages/ExchangeHubPage'));

// Entraide - Module Social Unifié
const EntraidePage = lazy(() => import('@/pages/EntraidePage'));

// Nouvelles fonctionnalités V2.1 - Community, Wearables, Export
const DataExportPage = lazy(() => import('@/pages/DataExportPage'));
const CommunityPage = lazy(() => import('@/pages/social/CommunityPage'));
const WearablesPage = lazy(() => import('@/pages/WearablesPage'));
const NotificationSettingsPage = lazy(() => import('@/pages/NotificationSettingsPage'));

// Context Lens - Module 8 EmotionsCare 2.0
const ContextLensPage = lazy(() => import('@/pages/ContextLensPage'));

// Pages manquantes - ajoutées pour cohérence registry
const HumeAIRealtimePage = lazy(() => import('@/pages/HumeAIRealtimePage'));
const SunoMusicGeneratorPage = lazy(() => import('@/pages/music/SunoMusicGeneratorPage'));
const AurasLeaderboardPage = lazy(() => import('@/pages/AurasLeaderboardPage'));
const ConsentManagementPage = lazy(() => import('@/pages/ConsentManagementPage'));
const AccountDeletionPage = lazy(() => import('@/pages/AccountDeletionPage'));

// PWA Install Page
const InstallPage = lazy(() => import('@/pages/InstallPage'));

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
  FeaturesPage,
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
  
  // B2B Institutional
  InstitutionalLandingPage,
  InstitutionalAccessPage,
  WellnessHubPage,
  B2BModuleWrapperPage,
  OrgDashboardPage,
  B2BSettingsPage,
  B2BInstitutionalReportsPage,
  
  // Modules
  B2CScanPage,
  ScanFacialPage,
  ScanVoicePage,
  ScanTextPage,
  B2CMusicEnhanced,
  MusicTherapyPage,
  MusicAnalyticsPage,
  MusicProfilePage,
  AdvancedAnalyticsPage,
  // EmotionMusicPage supprimé - utiliser MusicTherapyPage
  B2CAICoachPage,
  B2CJournalPage,
  B2CVoiceJournalPage,
  EmotionSessionNewPage,
  EmotionSessionHistoryPage,
  B2CVRBreathGuidePage,
  B2CVRGalaxyPage,
  // VRBreathPage supprimé
  
  // TIMECRAFT
  TimeCraftPage,
  TimeCraftB2BPage,
  
  B2CFlashGlowPage,
  B2CBreathworkPage,
  B2CARFiltersPage,
  B2CBubbleBeatPage,
  B2CScreenSilkBreakPage,
  MeditationPage,
  SeuilPage,
  
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
  B2CSettingsPage,
  B2CProfileSettingsPage,
  DataSettingsPage,
  B2CPrivacyTogglesPage,
  B2CNotificationsPage,
  HowItAdaptsPage,
  PaymentSuccessPage,
  
  // B2B
  B2BTeamsPage,
  B2BSocialCoconPage,
  B2BReportsPage,
  B2BReportDetailPage,
  B2BReportsHeatmapPage,
  B2BEventsPage,
  B2BAlertsPage,
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
  GroupSessionsPage,
  BuddiesPage,
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
  JournalActivityPage,
  JournalAnalyticsPage,
  JournalArchivePage,
  JournalFavoritesPage,
  JournalGoalsPage,
  JournalNotesPage,
  JournalSearchPage,
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
  EmotionAtlasPage,
  DiscoveryPage,

  // Dev-only pages
  ComprehensiveSystemAuditPage,
  ErrorBoundaryTestPage,
  TestAccountsPage,
  SEOAuditPage,
  
  // Analytics & Weekly Bars
  B2CWeeklyBarsPage,
  AnalyticsPage,
  
  // Composants de redirection
  RedirectToScan,
  RedirectToScanPage: RedirectToScan, // Alias pour registry
  RedirectToJournal, 
  RedirectToJournalPage: RedirectToJournal, // Alias pour registry
  RedirectToSocialCocon,
  RedirectToEntreprise,
  RedirectToEntreprisePage: RedirectToEntreprise, // Alias pour registry
  RedirectToMusic,
  
  // Pages Dashboard modules
  ModulesDashboard,
  ModulesDashboardPage: ModulesDashboard, // Alias pour registry
  // FacialScanPage - redirigé vers B2CScanPage
  FacialScanPage: B2CScanPage,
  EmojiScanPage: B2CScanPage, // Alias pour registry
  VoiceScanPage,
  TextScanPage,
  
  // Dashboard core modules - NOUVELLEMENT AJOUTÉS
  QuestionnaireScannerPage,
  BreathingPage,
  EmotionalJournalPage,
  ClinicalAssessmentsPage,
  DashboardSettingsPage,
  // MusicGeneratePage supprimé
  // MusicLibraryPage supprimé
  PricingPageWorking,
  PricingPageWorkingPage: PricingPageWorking, // Alias pour registry
  ScannerEmotionnelPage,
  B2BDashboardAnalytics,
  ModeSelectionPage,
  B2CDashboardPage,
  // B2CMusicEnhancedPage - alias pour registry
  B2CMusicEnhancedPage: B2CMusicEnhanced,
  CollaborativePlaylistPage,
  // B2BCollabDashboardPage et B2BRHDashboardPage - alias pour registry
  B2BCollabDashboardPage: B2BCollabDashboard,
  B2BRHDashboardPage: B2BRHDashboard,
  EmotionalPark,
  EmotionalParkPage: EmotionalPark, // Alias pour registry
  ParkJourney,
  ParkJourneyPage: ParkJourney, // Alias pour registry
  ParcoursXL,
  ParcoursXLPage: ParcoursXL, // Alias pour registry
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
  
  // Settings pages
  LanguageSettingsPage,
  SecuritySettingsPage,
  
  // Exchange Hub V2.0
  ExchangeHubPage,
  
  // Entraide - Module Social Unifié
  EntraidePage,
  
  // Nouvelles fonctionnalités V2.1
  DataExportPage,
  CommunityPage,
  WearablesPage,
  NotificationSettingsPage,
  
  // Context Lens - Module 8 EmotionsCare 2.0
  ContextLensPage,
  
  // Pages manquantes - cohérence registry
  HumeAIRealtimePage,
  SunoMusicGeneratorPage,
  AurasLeaderboardPage,
  ConsentManagementPage,
  AccountDeletionPage,
  
  // PWA Install Page
  InstallPage,
  
  // GDPR & Compliance - avec alias pour registry
  UnifiedGDPRDashboard,
  UnifiedGDPRDashboardPage: UnifiedGDPRDashboard,
  APIMonitoringDashboard,
  APIMonitoringDashboardPage: APIMonitoringDashboard,
  AIMonitoringDashboard,
  AIMonitoringDashboardPage: AIMonitoringDashboard,
  AlertConfigurationPage,
  AlertAnalyticsDashboard,
  AlertAnalyticsDashboardPage: AlertAnalyticsDashboard,
  AlertTemplatesPage,
  AlertTemplatePlayground,
  AlertTemplatePlaygroundPage: AlertTemplatePlayground,
  ScheduledReportsPage,
  AlertEscalationConfig,
  AlertEscalationConfigPage: AlertEscalationConfig,
  AITemplateSuggestions,
  AITemplateSuggestionsPage: AITemplateSuggestions,
  EscalationMonitoringDashboard,
  EscalationMonitoringDashboardPage: EscalationMonitoringDashboard,
  TicketIntegrationConfig,
  ABTestManager,
  GamificationCronMonitoring,
  GamificationCronMonitoringPage: GamificationCronMonitoring,
  MusicQueueAdminPage,
  MusicQueueMetricsPage,
  UserRolesPage,
  ChallengesHistory,
  ChallengesHistoryPage: ChallengesHistory,
  CreateCustomChallenge,
  CreateCustomChallengePage: CreateCustomChallenge,
  EditCustomChallenge,
  EditCustomChallengePage: EditCustomChallenge,
  ChallengesDashboard,
  ChallengesDashboardPage: ChallengesDashboard,
  MusicAnalyticsDashboard,
  MusicAnalyticsDashboardPage: MusicAnalyticsDashboard,
  Achievements,
  CronMonitoring,
  CronMonitoringPage: CronMonitoring,
  BlockchainBackups,
  BlockchainBackupsPage: BlockchainBackups,
  MonitoringDashboard,
  MonitoringDashboardPage: MonitoringDashboard,
  
  // System Health & Analytics
  SystemHealthPage,
  AdminSystemHealthPage,
  K6AnalyticsDashboard,
  K6AnalyticsDashboardPage: K6AnalyticsDashboard, // Alias pour registry
  
  // Admin - alias supplémentaires pour registry
  TicketIntegrationConfigPage: TicketIntegrationConfig,
  ABTestManagerPage: ABTestManager,
  NotificationWebhooksConfigPage: NotificationWebhooksConfig,
  SystemHealthDashboardPage: SystemHealthDashboard,
  ExecutiveDashboardPage: ExecutiveDashboard,
  UnifiedAdminDashboardPage: UnifiedAdminDashboard,
  
  // Pages réelles - corrigées
  RecommendationEngineAdminPage,
  SupportChatbotPage,
  PublicAPIPage,
  ActivityLogsPage,
  
  // Alias fallback pour pages non créées
  B2BAnalyticsPage: B2BAnalyticsPageReal,
  B2BUserCoachPage: B2CAICoachPage,
  UnifiedDashboardPage: B2CDashboardPage,
  UnifiedHomePage: HomePage,
  B2CImmersivePage: B2CVRGalaxyPage,
  
  // Alias pour chooseMode
  ChooseModePage: ModeSelectionPage,
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

// Marketing layout for non-homepage marketing pages
const MarketingLayout = lazy(() => import('@/components/layout/MarketingLayout'));

const LayoutWrapper: React.FC<{ 
  children: React.ReactNode; 
  layout?: 'marketing' | 'app' | 'simple' | 'app-sidebar'
}> = ({ children, layout = 'app' }) => {
  if (layout === 'simple') {
    return <>{children}</>;
  }
  
  if (layout === 'marketing') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <MarketingLayout>{children}</MarketingLayout>
      </Suspense>
    );
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

// Routes actives : ni deprecated, ni hidden en production
const canonicalRoutes = ROUTES_REGISTRY.filter(route => 
  !route.deprecated && 
  route.path !== '*' &&
  !(route.hidden && !import.meta.env.DEV)
);

// Routes deprecated avec redirectTo → génèrent des <Navigate>
const deprecatedRoutes = ROUTES_REGISTRY.filter(route => route.deprecated && route.redirectTo);

logger.debug('Creating router', { 
  canonicalRoutes: canonicalRoutes.length,
  hasTestNyveeRoute: !!ROUTES_REGISTRY.find(r => r.path === '/test-nyvee'),
  nyveeTestPageLoaded: !!NyveeTestPage 
}, 'SYSTEM');

export const router = createBrowserRouter([
  // Route de test Nyvée - DEV uniquement
  ...(import.meta.env.DEV ? [{
    path: '/test-nyvee',
    element: (
      <SuspenseWrapper>
        <NyveeTestPage />
      </SuspenseWrapper>
    ),
  }] : []),

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

  // Redirections automatiques des routes deprecated
  ...deprecatedRoutes.map(route => ({
    path: route.path,
    element: <Navigate to={route.redirectTo!} replace />,
  })),

  // Aliases des routes deprecated (aussi rediriger)
  ...deprecatedRoutes.flatMap(route =>
    (route.aliases || []).map(alias => ({
      path: alias,
      element: <Navigate to={route.redirectTo!} replace />,
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
  basename: import.meta.env.BASE_URL,
  future: {
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_relativeSplatPath: true,
    v7_skipActionErrorRevalidation: true,
  },
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
