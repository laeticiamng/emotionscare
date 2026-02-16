/**
 * Routes B2B - pages entreprise, RH, institutional
 * Segment: b2b
 */
import { lazy } from 'react';

// B2B Dashboards
const B2BCollabDashboard = lazy(() => import('@/pages/b2b/B2BCollabDashboard'));
const B2BRHDashboard = lazy(() => import('@/pages/b2b/B2BRHDashboard'));
const B2BEntreprisePage = lazy(() => import('@/pages/b2b/B2BEntreprisePage'));
const B2BSelectionPage = lazy(() => import('@/pages/b2b/B2BSelectionPage'));
const B2BDashboardAnalytics = lazy(() => import('@/pages/b2b/B2BDashboardAnalytics'));

// B2B Features
const B2BTeamsPage = lazy(() => import('@/pages/b2b/B2BTeamsPage'));
const B2BSocialCoconPage = lazy(() => import('@/pages/b2b/B2BSocialCoconPage'));
const B2BReportsPage = lazy(() => import('@/pages/b2b/B2BReportsPage'));
const B2BReportDetailPage = lazy(() => import('@/pages/b2b/B2BReportDetailPage'));
const B2BReportsHeatmapPage = lazy(() => import('@/pages/b2b/reports'));
const B2BEventsPage = lazy(() => import('@/pages/b2b/B2BEventsPage'));
const B2BAlertsPage = lazy(() => import('@/pages/b2b/B2BAlertsPage'));
const B2BOptimisationPage = lazy(() => import('@/pages/b2b/B2BOptimisationPage'));
const B2BSecurityPage = lazy(() => import('@/pages/b2b/B2BSecurityPage'));
const B2BAuditPage = lazy(() => import('@/pages/b2b/B2BAuditPage'));
const B2BAccessibilityPage = lazy(() => import('@/pages/b2b/B2BAccessibilityPage'));
const B2BAnalyticsPageReal = lazy(() => import('@/pages/b2b/B2BAnalyticsPage'));

// B2B Institutional
const InstitutionalLandingPage = lazy(() => import('@/pages/b2b/InstitutionalLandingPage'));
const InstitutionalAccessPage = lazy(() => import('@/pages/b2b/InstitutionalAccessPage'));
const WellnessHubPage = lazy(() => import('@/pages/b2b/WellnessHubPage'));
const B2BModuleWrapperPage = lazy(() => import('@/pages/b2b/B2BModuleWrapperPage'));
const OrgDashboardPage = lazy(() => import('@/pages/b2b/admin/OrgDashboardPage'));
const B2BSettingsPage = lazy(() => import('@/pages/b2b/admin/SettingsPage'));
const B2BInstitutionalReportsPage = lazy(() => import('@/pages/b2b/reports/ReportsPage'));

// B2B Specialized modules
const B2BPreventionProgramPage = lazy(() => import('@/pages/b2b/B2BPreventionProgramPage'));
const B2BVisioPage = lazy(() => import('@/pages/b2b/B2BVisioPage'));

// TIMECRAFT B2B
const TimeCraftB2BPage = lazy(() => import('@/pages/timecraft/TimeCraftB2BPage'));

export const b2bComponentMap = {
  // Dashboards
  B2BCollabDashboard,
  B2BCollabDashboardPage: B2BCollabDashboard,
  B2BRHDashboard,
  B2BRHDashboardPage: B2BRHDashboard,
  B2BEntreprisePage,
  B2BSelectionPage,
  B2BDashboardAnalytics,

  // Features
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
  B2BAnalyticsPage: B2BAnalyticsPageReal,
  B2BUserCoachPage: lazy(() => import('@/pages/b2c/B2CAICoachPage')),

  // Institutional
  InstitutionalLandingPage,
  InstitutionalAccessPage,
  WellnessHubPage,
  B2BModuleWrapperPage,
  OrgDashboardPage,
  B2BSettingsPage,
  B2BInstitutionalReportsPage,

  // Specialized
  B2BPreventionProgramPage,
  B2BVisioPage,

  // TIMECRAFT
  TimeCraftB2BPage,
} as const;
