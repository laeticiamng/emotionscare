/**
 * Routes Admin - pages d'administration, monitoring, GDPR
 * Segment: admin
 */
import { lazy } from 'react';

// GDPR & Compliance
const UnifiedGDPRDashboard = lazy(() => import('@/pages/admin/UnifiedGDPRDashboard'));
const APIMonitoringDashboard = lazy(() => import('@/pages/admin/APIMonitoringDashboard'));
const AIMonitoringDashboard = lazy(() => import('@/pages/admin/AIMonitoringDashboard'));

// Alert System
const AlertConfigurationPage = lazy(() => import('@/pages/admin/AlertConfigurationPage'));
const AlertAnalyticsDashboard = lazy(() => import('@/pages/admin/AlertAnalyticsDashboard'));
const AlertTemplatesPage = lazy(() => import('@/pages/admin/AlertTemplatesPage'));
const AlertTemplatePlayground = lazy(() => import('@/pages/admin/AlertTemplatePlayground'));
const AlertEscalationConfig = lazy(() => import('@/pages/admin/AlertEscalationConfig'));
const AlertTesterPage = lazy(() => import('@/pages/admin/AlertTesterPage'));
const AITemplateSuggestions = lazy(() => import('@/pages/admin/AITemplateSuggestions'));

// Monitoring & Health
const EscalationMonitoringDashboard = lazy(() => import('@/pages/admin/EscalationMonitoringDashboard'));
const SystemHealthDashboard = lazy(() => import('@/pages/admin/SystemHealthDashboard'));
const ExecutiveDashboard = lazy(() => import('@/pages/admin/ExecutiveDashboard'));
const MonitoringDashboard = lazy(() => import('@/pages/admin/MonitoringDashboard'));
const AdminSystemHealthPage = lazy(() => import('@/pages/AdminSystemHealthPage'));
const K6AnalyticsDashboard = lazy(() => import('@/pages/K6AnalyticsDashboard'));

// Admin Tools
const TicketIntegrationConfig = lazy(() => import('@/pages/admin/TicketIntegrationConfig'));
const ABTestManager = lazy(() => import('@/pages/admin/ABTestManager'));
const NotificationWebhooksConfig = lazy(() => import('@/pages/admin/NotificationWebhooksConfig'));
const ScheduledReportsPage = lazy(() => import('@/pages/admin/ScheduledReportsPage'));
const IncidentReportsPage = lazy(() => import('@/pages/admin/IncidentReportsPage'));
const UnifiedAdminDashboard = lazy(() => import('@/pages/admin/UnifiedAdminDashboard'));
const CronJobsSetupPage = lazy(() => import('@/pages/admin/CronJobsSetupPage'));
const MLAssignmentRulesPage = lazy(() => import('@/pages/admin/MLAssignmentRulesPage'));
const TeamMemberSkillsPage = lazy(() => import('@/pages/admin/TeamMemberSkillsPage'));
const UserRolesPage = lazy(() => import('@/pages/admin/UserRolesPage'));
const RecommendationEngineAdminPage = lazy(() => import('@/pages/RecommendationEngineAdminPage'));
const PlatformAuditPage = lazy(() => import('@/pages/admin/PlatformAuditPage'));
const ModuleSyncPage = lazy(() => import('@/pages/admin/ModuleSyncPage'));
const SEOAuditPage = lazy(() => import('@/pages/admin/SEOAuditPage'));

// Music Admin
const GamificationCronMonitoring = lazy(() => import('@/pages/admin/GamificationCronMonitoring'));
const MusicQueueAdminPage = lazy(() => import('@/pages/admin/MusicQueueAdminPage'));
const MusicQueueMetricsPage = lazy(() => import('@/pages/admin/MusicQueueMetricsPage'));
const MusicAnalyticsDashboard = lazy(() => import('@/pages/admin/MusicAnalyticsDashboard'));
const MoodPresetsAdminPage = lazy(() => import('@/pages/MoodPresetsAdminPage'));

// Challenges Admin
const CreateCustomChallenge = lazy(() => import('@/pages/admin/CreateCustomChallenge'));
const EditCustomChallenge = lazy(() => import('@/pages/admin/EditCustomChallenge'));
const ChallengesDashboard = lazy(() => import('@/pages/admin/ChallengesDashboard'));

// System
const CronMonitoring = lazy(() => import('@/pages/CronMonitoring'));
const BlockchainBackups = lazy(() => import('@/pages/BlockchainBackups'));

// Dev-only
const ComprehensiveSystemAuditPage = lazy(() => import('@/pages/ComprehensiveSystemAuditPage'));
const SecurityAuditScorecard = lazy(() => import('@/pages/admin/SecurityAuditScorecard'));
const ErrorBoundaryTestPage = lazy(() => import('@/pages/dev/ErrorBoundaryTestPage'));
const TestAccountsPage = lazy(() => import('@/pages/TestAccountsPage'));
const TestPage = lazy(() => import('@/pages/TestPage'));

export const adminComponentMap = {
  // GDPR
  UnifiedGDPRDashboard,
  UnifiedGDPRDashboardPage: UnifiedGDPRDashboard,
  APIMonitoringDashboard,
  APIMonitoringDashboardPage: APIMonitoringDashboard,
  AIMonitoringDashboard,
  AIMonitoringDashboardPage: AIMonitoringDashboard,

  // Alerts
  AlertConfigurationPage,
  AlertAnalyticsDashboard,
  AlertAnalyticsDashboardPage: AlertAnalyticsDashboard,
  AlertTemplatesPage,
  AlertTemplatePlayground,
  AlertTemplatePlaygroundPage: AlertTemplatePlayground,
  AlertEscalationConfig,
  AlertEscalationConfigPage: AlertEscalationConfig,
  AlertTesterPage,
  AITemplateSuggestions,
  AITemplateSuggestionsPage: AITemplateSuggestions,

  // Monitoring
  EscalationMonitoringDashboard,
  EscalationMonitoringDashboardPage: EscalationMonitoringDashboard,
  NotificationWebhooksConfig,
  NotificationWebhooksConfigPage: NotificationWebhooksConfig,
  SystemHealthDashboard,
  SystemHealthDashboardPage: SystemHealthDashboard,
  ExecutiveDashboard,
  ExecutiveDashboardPage: ExecutiveDashboard,
  MonitoringDashboard,
  MonitoringDashboardPage: MonitoringDashboard,
  AdminSystemHealthPage,
  K6AnalyticsDashboard,
  K6AnalyticsDashboardPage: K6AnalyticsDashboard,

  // Admin Tools
  TicketIntegrationConfig,
  TicketIntegrationConfigPage: TicketIntegrationConfig,
  ABTestManager,
  ABTestManagerPage: ABTestManager,
  ScheduledReportsPage,
  IncidentReportsPage,
  UnifiedAdminDashboard,
  UnifiedAdminDashboardPage: UnifiedAdminDashboard,
  CronJobsSetupPage,
  MLAssignmentRulesPage,
  TeamMemberSkillsPage,
  UserRolesPage,
  RecommendationEngineAdminPage,
  PlatformAuditPage,
  ModuleSyncPage,
  SEOAuditPage,

  // Music Admin
  GamificationCronMonitoring,
  GamificationCronMonitoringPage: GamificationCronMonitoring,
  MusicQueueAdminPage,
  MusicQueueMetricsPage,
  MusicAnalyticsDashboard,
  MusicAnalyticsDashboardPage: MusicAnalyticsDashboard,
  MoodPresetsAdminPage,

  // Challenges Admin
  CreateCustomChallenge,
  CreateCustomChallengePage: CreateCustomChallenge,
  EditCustomChallenge,
  EditCustomChallengePage: EditCustomChallenge,
  ChallengesDashboard,
  ChallengesDashboardPage: ChallengesDashboard,

  // System
  CronMonitoring,
  CronMonitoringPage: CronMonitoring,
  BlockchainBackups,
  BlockchainBackupsPage: BlockchainBackups,
  Achievements: lazy(() => import('@/pages/app/Achievements')),

  // Dev-only
  ComprehensiveSystemAuditPage,
  SecurityAuditScorecard,
  SecurityAuditScorecardPage: SecurityAuditScorecard,
  ErrorBoundaryTestPage,
  TestAccountsPage,
  TestPage,
} as const;
