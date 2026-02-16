/**
 * Routes B2C - pages utilisateur connecté (bien-être, scan, journal, musique, etc.)
 * Segment: b2c
 */
import { lazy } from 'react';

// Dashboard & Navigation
const B2CDashboardPage = lazy(() => import('@/pages/b2c/B2CDashboardPage'));
const ModeSelectionPage = lazy(() => import('@/pages/ModeSelectionPage'));
const ModulesDashboard = lazy(() => import('@/pages/ModulesDashboard'));
const AppGatePage = lazy(() => import('@/pages/AppGatePage'));
const NavigationPage = lazy(() => import('@/pages/NavigationPage'));

// Scan
const B2CScanPage = lazy(() => import('@/pages/b2c/B2CScanPage'));
const ScanFacialPage = lazy(() => import('@/pages/app/ScanFacialPage'));
const ScanVoicePage = lazy(() => import('@/pages/app/ScanVoicePage'));
const ScanTextPage = lazy(() => import('@/pages/app/ScanTextPage'));
const VoiceScanPage = lazy(() => import('@/pages/VoiceScanPage'));
const TextScanPage = lazy(() => import('@/pages/TextScanPage'));
const QuestionnaireScannerPage = lazy(() => import('@/pages/scanner/QuestionnaireScannerPage'));
const ScannerEmotionnelPage = lazy(() => import('@/pages/ScannerEmotionnelPage'));
const HumeAIRealtimePage = lazy(() => import('@/pages/HumeAIRealtimePage'));

// Music
const B2CMusicEnhanced = lazy(() => import('@/pages/b2c/B2CMusicEnhanced'));
const MusicTherapyPage = lazy(() => import('@/pages/music/MusicTherapyPage'));
const MusicAnalyticsPage = lazy(() => import('@/pages/music/MusicAnalyticsPage'));
const MusicProfilePage = lazy(() => import('@/pages/music/MusicProfilePage'));
const CollaborativePlaylistPage = lazy(() => import('@/pages/music/CollaborativePlaylistPage'));
const SunoMusicGeneratorPage = lazy(() => import('@/pages/music/SunoMusicGeneratorPage'));
const B2CMusicTherapyPremiumPage = lazy(() => import('@/pages/b2c/B2CMusicTherapyPremiumPage'));

// Coach
const B2CAICoachPage = lazy(() => import('@/pages/b2c/B2CAICoachPage'));
const B2CAICoachMicroPage = lazy(() => import('@/pages/b2c/B2CAICoachMicroPage'));
const CoachProgramsPage = lazy(() => import('@/pages/coach/CoachProgramsPage'));
const CoachProgramDetailPage = lazy(() => import('@/pages/coach/CoachProgramDetailPage'));
const CoachSessionsPage = lazy(() => import('@/pages/coach/CoachSessionsPage'));
const CoachAnalyticsPage = lazy(() => import('@/pages/coach/CoachAnalyticsPage'));

// Journal
const B2CJournalPage = lazy(() => import('@/pages/b2c/B2CJournalPage'));
const EmotionalJournalPage = lazy(() => import('@/pages/journal/EmotionalJournalPage'));
const B2CVoiceJournalPage = lazy(() => import('@/pages/b2c/B2CVoiceJournalPage'));
const JournalNewPage = lazy(() => import('@/pages/JournalNewPage'));
const JournalSettingsPage = lazy(() => import('@/pages/journal/JournalSettingsPage'));
const JournalActivityPage = lazy(() => import('@/pages/journal/JournalActivityPage'));
const JournalAnalyticsPage = lazy(() => import('@/pages/journal/JournalAnalyticsPage'));
const JournalArchivePage = lazy(() => import('@/pages/journal/JournalArchivePage'));
const JournalFavoritesPage = lazy(() => import('@/pages/journal/JournalFavoritesPage'));
const JournalGoalsPage = lazy(() => import('@/pages/journal/JournalGoalsPage'));
const JournalNotesPage = lazy(() => import('@/pages/journal/JournalNotesPage'));
const JournalSearchPage = lazy(() => import('@/pages/journal/JournalSearchPage'));

// Assessments
const ClinicalAssessmentsPage = lazy(() => import('@/pages/assessments/ClinicalAssessmentsPage'));

// Sessions & Emotions
const EmotionSessionNewPage = lazy(() => import('@/pages/EmotionSessionNewPage'));
const EmotionSessionHistoryPage = lazy(() => import('@/pages/EmotionSessionHistoryPage'));
const SessionsPage = lazy(() => import('@/pages/SessionsPage'));
const SessionDetailPage = lazy(() => import('@/pages/SessionDetailPage'));

// VR & Immersive
const B2CVRBreathGuidePage = lazy(() => import('@/pages/b2c/B2CVRBreathGuidePage'));
const B2CVRGalaxyPage = lazy(() => import('@/pages/b2c/B2CVRGalaxyPage'));
const VRPage = lazy(() => import('@/pages/app/VRPage'));
const BrainViewerPage = lazy(() => import('@/pages/BrainViewerPage'));

// Fun-First modules
const B2CFlashGlowPage = lazy(() => import('@/pages/b2c/B2CFlashGlowPage'));
const B2CBreathworkPage = lazy(() => import('@/pages/b2c/B2CBreathworkPage'));
const B2CARFiltersPage = lazy(() => import('@/pages/b2c/B2CARFiltersPage'));
const B2CBubbleBeatPage = lazy(() => import('@/pages/b2c/B2CBubbleBeatPage'));
const B2CScreenSilkBreakPage = lazy(() => import('@/pages/b2c/B2CScreenSilkBreakPage'));
const B2CAmbitionArcadePage = lazy(() => import('@/pages/b2c/B2CAmbitionArcadePage'));
const B2CBossLevelGritPage = lazy(() => import('@/pages/b2c/B2CBossLevelGritPage'));
const B2CBounceBackBattlePage = lazy(() => import('@/pages/b2c/B2CBounceBackBattlePage'));
const B2CMoodMixerPage = lazy(() => import('@/pages/b2c/B2CMoodMixerPage'));
const B2CStorySynthLabPage = lazy(() => import('@/pages/b2c/B2CStorySynthLabPage'));
const MeditationPage = lazy(() => import('@/pages/MeditationPage'));
const SeuilPage = lazy(() => import('@/pages/SeuilPage'));
const BreathingPage = lazy(() => import('@/pages/breathing/BreathingPage'));
const FlashGlowPage = lazy(() => import('@/pages/flash-glow/index'));
const BossGritPage = lazy(() => import('@/modules/boss-grit/BossGritPage'));

// Parcours & Discovery
const EmotionalPark = lazy(() => import('@/pages/EmotionalPark'));
const ParkJourney = lazy(() => import('@/pages/ParkJourney'));
const EmotionAtlasPage = lazy(() => import('@/modules/emotion-atlas/pages/EmotionAtlasPage'));
const DiscoveryPage = lazy(() => import('@/modules/discovery/pages/DiscoveryPage'));
const ParcoursXL = lazy(() => import('@/pages/ParcoursXL'));
const ContextLensPage = lazy(() => import('@/pages/ContextLensPage'));

// Gamification
const B2CGamificationPage = lazy(() => import('@/pages/b2c/B2CGamificationPage'));
const LeaderboardPage = lazy(() => import('@/pages/AurasLeaderboardPage'));
const AurasLeaderboardPage = lazy(() => import('@/pages/AurasLeaderboardPage'));
const GuildListPage = lazy(() => import('@/pages/gamification/GuildListPage'));
const GuildPage = lazy(() => import('@/pages/gamification/GuildPage'));
const PremiumRewardsPage = lazy(() => import('@/pages/PremiumRewardsPage'));
const TournamentsPage = lazy(() => import('@/pages/gamification/TournamentsPage'));
const MatchSpectatorPage = lazy(() => import('@/pages/MatchSpectatorPage'));
const CompetitiveSeasonsPage = lazy(() => import('@/pages/CompetitiveSeasonsPage'));
const DailyChallengesPage = lazy(() => import('@/pages/gamification/DailyChallengesPage'));
const ScoresPage = lazy(() => import('@/pages/gamification/ScoresPage'));
const AchievementsPage = lazy(() => import('@/pages/gamification/AchievementsPage'));
const BadgesPage = lazy(() => import('@/pages/gamification/BadgesPage'));
const RewardsPage = lazy(() => import('@/pages/gamification/RewardsPage'));
const ChallengesPage = lazy(() => import('@/pages/gamification/ChallengesPage'));
const ChallengeDetailPage = lazy(() => import('@/pages/gamification/ChallengeDetailPage'));
const ChallengeCreatePage = lazy(() => import('@/pages/gamification/ChallengeCreatePage'));
const ChallengesHistory = lazy(() => import('@/pages/app/ChallengesHistory'));
const Achievements = lazy(() => import('@/pages/app/Achievements'));

// Social
const B2CSocialCoconPage = lazy(() => import('@/pages/b2c/B2CSocialCoconPage'));
const B2CCommunautePage = lazy(() => import('@/pages/b2c/B2CCommunautePage'));
const GroupSessionsPage = lazy(() => import('@/pages/social/GroupSessionsPage'));
const BuddiesPage = lazy(() => import('@/pages/social/BuddiesPage'));
const MessagesPage = lazy(() => import('@/pages/social/MessagesPage'));
const FriendsPage = lazy(() => import('@/pages/social/FriendsPage'));
const GroupsPage = lazy(() => import('@/pages/social/GroupsPage'));
const CommunityPage = lazy(() => import('@/pages/social/CommunityPage'));
const ExchangeHubPage = lazy(() => import('@/pages/ExchangeHubPage'));
const EntraidePage = lazy(() => import('@/pages/EntraidePage'));

// Nyvée AI Avatar
const B2CNyveeCoconPage = lazy(() => import('@/pages/b2c/B2CNyveeCoconPage'));
const NyveeTestPage = lazy(() => import('@/pages/NyveeTestPage'));
const ValidationPage = lazy(() => import('@/pages/ValidationPage'));

// Settings & Profile
const B2CSettingsPage = lazy(() => import('@/pages/b2c/B2CSettingsPage'));
const B2CProfileSettingsPage = lazy(() => import('@/pages/b2c/B2CProfileSettingsPage'));
const DataSettingsPage = lazy(() => import('@/pages/DataSettingsPage'));
const B2CPrivacyTogglesPage = lazy(() => import('@/pages/b2c/B2CPrivacyTogglesPage'));
const B2CNotificationsPage = lazy(() => import('@/pages/b2c/B2CNotificationsPage'));
const DashboardSettingsPage = lazy(() => import('@/pages/settings/DashboardSettingsPage'));
const LanguageSettingsPage = lazy(() => import('@/pages/settings/LanguageSettingsPage'));
const SecuritySettingsPage = lazy(() => import('@/pages/settings/SecuritySettingsPage'));
const NotificationSettingsPage = lazy(() => import('@/pages/NotificationSettingsPage'));
const AccessibilitySettingsPage = lazy(() => import('@/pages/AccessibilitySettingsPage'));
const ThemesPage = lazy(() => import('@/pages/ThemesPage'));
const CustomizationPage = lazy(() => import('@/pages/CustomizationPage'));
const WidgetsPage = lazy(() => import('@/pages/WidgetsPage'));
const ShortcutsPage = lazy(() => import('@/pages/ShortcutsPage'));

// Analytics & Reports
const AdvancedAnalyticsPage = lazy(() => import('@/pages/AdvancedAnalyticsPage'));
const B2CWeeklyBarsPage = lazy(() => import('@/pages/b2c/B2CWeeklyBarsPage'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));
const InsightsPage = lazy(() => import('@/pages/InsightsPage'));
const TrendsPage = lazy(() => import('@/pages/TrendsPage'));
const WeeklyReportPage = lazy(() => import('@/pages/WeeklyReportPage'));
const MonthlyReportPage = lazy(() => import('@/pages/MonthlyReportPage'));
const ReportingPage = lazy(() => import('@/pages/ReportingPage'));

// Export & Data
const ExportPage = lazy(() => import('@/pages/ExportPage'));
const ExportPDFPage = lazy(() => import('@/pages/ExportPDFPage'));
const ExportCSVPage = lazy(() => import('@/pages/ExportCSVPage'));
const ShareDataPage = lazy(() => import('@/pages/ShareDataPage'));
const DataExportPage = lazy(() => import('@/pages/DataExportPage'));

// Goals
const GoalsPage = lazy(() => import('@/pages/GoalsPage'));
const GoalDetailPage = lazy(() => import('@/pages/GoalDetailPage'));
const GoalNewPage = lazy(() => import('@/pages/GoalNewPage'));

// Misc
const B2CActivitePage = lazy(() => import('@/pages/b2c/B2CActivitePage'));
const SubscribePage = lazy(() => import('@/pages/SubscribePage'));
const NotificationsCenterPage = lazy(() => import('@/pages/NotificationsCenterPage'));
const PremiumPage = lazy(() => import('@/pages/PremiumPage'));
const PaymentSuccessPage = lazy(() => import('@/pages/PaymentSuccess'));
const BillingPage = lazy(() => import('@/pages/BillingPage'));
const TicketsPage = lazy(() => import('@/pages/TicketsPage'));
const VoiceAnalysisPage = lazy(() => import('@/pages/VoiceAnalysisPage'));
const EventsCalendarPage = lazy(() => import('@/pages/EventsCalendarPage'));
const WorkshopsPage = lazy(() => import('@/pages/WorkshopsPage'));
const WebinarsPage = lazy(() => import('@/pages/WebinarsPage'));
const IntegrationsPage = lazy(() => import('@/pages/IntegrationsPage'));
const APIKeysPage = lazy(() => import('@/pages/APIKeysPage'));
const WebhooksPage = lazy(() => import('@/pages/WebhooksPage'));
const CalendarPage = lazy(() => import('@/pages/CalendarPage'));
const Point20Page = lazy(() => import('@/pages/Point20Page'));
const WearablesPage = lazy(() => import('@/pages/WearablesPage'));
const ConsentManagementPage = lazy(() => import('@/pages/ConsentManagementPage'));
const AccountDeletionPage = lazy(() => import('@/pages/AccountDeletionPage'));
const MarketplacePage = lazy(() => import('@/pages/MarketplacePage'));
const CreatorDashboardPage = lazy(() => import('@/pages/CreatorDashboardPage'));
const ActivityLogsPage = lazy(() => import('@/pages/ActivityLogsPage'));
const SystemHealthPage = lazy(() => import('@/pages/SystemHealthPage'));

// TIMECRAFT
const TimeCraftPage = lazy(() => import('@/pages/timecraft/TimeCraftPage'));

// Compliance
const HDSCompliancePage = lazy(() => import('@/pages/compliance/HDSCompliancePage'));

export const b2cComponentMap = {
  // Dashboard
  B2CDashboardPage,
  ModeSelectionPage,
  ChooseModePage: ModeSelectionPage,
  ModulesDashboard,
  ModulesDashboardPage: ModulesDashboard,
  AppGatePage,
  NavigationPage,

  // Scan
  B2CScanPage,
  ScanFacialPage,
  ScanVoicePage,
  ScanTextPage,
  FacialScanPage: B2CScanPage,
  EmojiScanPage: B2CScanPage,
  VoiceScanPage,
  TextScanPage,
  QuestionnaireScannerPage,
  ScannerEmotionnelPage,
  ScanPage: B2CScanPage,
  HumeAIRealtimePage,

  // Music
  B2CMusicEnhanced,
  B2CMusicEnhancedPage: B2CMusicEnhanced,
  MusicTherapyPage,
  MusicAnalyticsPage,
  MusicProfilePage,
  CollaborativePlaylistPage,
  SunoMusicGeneratorPage,
  B2CMusicTherapyPremiumPage,

  // Coach
  B2CAICoachPage,
  B2CAICoachMicroPage,
  CoachPage: B2CAICoachPage,
  CoachProgramsPage,
  CoachProgramDetailPage,
  CoachSessionsPage,
  CoachAnalyticsPage,

  // Journal
  B2CJournalPage,
  EmotionalJournalPage,
  B2CVoiceJournalPage,
  JournalNewPage,
  JournalSettingsPage,
  JournalActivityPage,
  JournalAnalyticsPage,
  JournalArchivePage,
  JournalFavoritesPage,
  JournalGoalsPage,
  JournalNotesPage,
  JournalSearchPage,

  // Assessments
  ClinicalAssessmentsPage,

  // Sessions
  EmotionSessionNewPage,
  EmotionSessionHistoryPage,
  SessionsPage,
  SessionDetailPage,

  // VR
  B2CVRBreathGuidePage,
  B2CVRGalaxyPage,
  B2CImmersivePage: B2CVRGalaxyPage,
  VRPage,
  BrainViewerPage,

  // Fun-First
  B2CFlashGlowPage,
  B2CBreathworkPage,
  B2CARFiltersPage,
  B2CBubbleBeatPage,
  B2CScreenSilkBreakPage,
  B2CAmbitionArcadePage,
  B2CBossLevelGritPage,
  B2CBounceBackBattlePage,
  B2CMoodMixerPage,
  B2CStorySynthLabPage,
  MeditationPage,
  SeuilPage,
  BreathingPage,
  FlashGlowPage,
  BossGritPage,
  BubbleBeatPage: B2CBubbleBeatPage,
  MoodMixerPage: B2CMoodMixerPage,
  StorySynthPage: B2CStorySynthLabPage,

  // Parcours
  EmotionalPark,
  EmotionalParkPage: EmotionalPark,
  ParkJourney,
  ParkJourneyPage: ParkJourney,
  EmotionAtlasPage,
  DiscoveryPage,
  ParcoursXL,
  ParcoursXLPage: ParcoursXL,
  ContextLensPage,

  // Gamification
  B2CGamificationPage,
  LeaderboardPage,
  AurasLeaderboardPage,
  GuildListPage,
  GuildPage,
  PremiumRewardsPage,
  TournamentsPage,
  MatchSpectatorPage,
  CompetitiveSeasonsPage,
  DailyChallengesPage,
  ScoresPage,
  AchievementsPage,
  BadgesPage,
  RewardsPage,
  ChallengesPage,
  ChallengeDetailPage,
  ChallengeCreatePage,
  ChallengesHistory,
  ChallengesHistoryPage: ChallengesHistory,
  Achievements,

  // Social
  B2CSocialCoconPage,
  B2CCommunautePage,
  GroupSessionsPage,
  BuddiesPage,
  MessagesPage,
  FriendsPage,
  GroupsPage,
  CommunityPage,
  ExchangeHubPage,
  EntraidePage,

  // Nyvée
  B2CNyveeCoconPage,
  NyveeTestPage,
  ValidationPage,

  // Settings
  B2CSettingsPage,
  B2CProfileSettingsPage,
  DataSettingsPage,
  B2CPrivacyTogglesPage,
  B2CNotificationsPage,
  DashboardSettingsPage,
  LanguageSettingsPage,
  SecuritySettingsPage,
  NotificationSettingsPage,
  AccessibilitySettingsPage,
  ThemesPage,
  CustomizationPage,
  WidgetsPage,
  ShortcutsPage,
  PaymentSuccessPage,

  // Analytics
  AdvancedAnalyticsPage,
  B2CWeeklyBarsPage,
  AnalyticsPage,
  InsightsPage,
  TrendsPage,
  WeeklyReportPage,
  MonthlyReportPage,
  ReportingPage,

  // Export
  ExportPage,
  ExportPDFPage,
  ExportCSVPage,
  ShareDataPage,
  DataExportPage,

  // Goals
  GoalsPage,
  GoalDetailPage,
  GoalNewPage,

  // Misc
  B2CActivitePage,
  SubscribePage,
  NotificationsCenterPage,
  PremiumPage,
  BillingPage,
  TicketsPage,
  VoiceAnalysisPage,
  EventsCalendarPage,
  WorkshopsPage,
  WebinarsPage,
  IntegrationsPage,
  APIKeysPage,
  WebhooksPage,
  CalendarPage,
  Point20Page,
  WearablesPage,
  ConsentManagementPage,
  AccountDeletionPage,
  MarketplacePage,
  CreatorDashboardPage,
  ActivityLogsPage,
  SystemHealthPage,
  UnifiedDashboardPage: B2CDashboardPage,

  // TIMECRAFT
  TimeCraftPage,

  // Compliance
  HDSCompliancePage,
} as const;
