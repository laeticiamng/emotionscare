
import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { ComponentLoadingFallback } from '@/components/ui/loading-fallback';
import { UniversalErrorBoundary } from '@/components/ErrorBoundary/UniversalErrorBoundary';

// Lazy load all pages for optimal performance
const HomePage = lazy(() => import('@/pages/HomePage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const B2BSelectionPage = lazy(() => import('@/pages/B2BSelectionPage'));
const Point20Page = lazy(() => import('@/pages/Point20Page'));

// Auth pages
const B2CLoginPage = lazy(() => import('@/pages/B2CLoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/B2CRegisterPage'));
const B2BUserLoginPage = lazy(() => import('@/pages/B2BUserLoginPage'));
const B2BUserRegisterPage = lazy(() => import('@/pages/B2BUserRegisterPage'));
const B2BAdminLoginPage = lazy(() => import('@/pages/B2BAdminLoginPage'));

// Dashboard pages
const B2CDashboardPage = lazy(() => import('@/pages/B2CDashboardPage'));
const B2BUserDashboardPage = lazy(() => import('@/pages/B2BUserDashboardPage'));
const B2BAdminDashboardPage = lazy(() => import('@/pages/B2BAdminDashboardPage'));

// Feature pages
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));
const VRPage = lazy(() => import('@/pages/VRPage'));
const MeditationPage = lazy(() => import('@/pages/MeditationPage'));
const PreferencesPage = lazy(() => import('@/pages/PreferencesPage'));
const GamificationPage = lazy(() => import('@/pages/GamificationPage'));
const SocialCoconPage = lazy(() => import('@/pages/SocialCoconPage'));

// Admin-only pages
const TeamsPage = lazy(() => import('@/pages/TeamsPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const EventsPage = lazy(() => import('@/pages/EventsPage'));
const OptimisationPage = lazy(() => import('@/pages/OptimisationPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const SecurityPage = lazy(() => import('@/pages/SecurityPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const AuditPage = lazy(() => import('@/pages/AuditPage'));
const AccessibilityPage = lazy(() => import('@/pages/AccessibilityPage'));
const InnovationPage = lazy(() => import('@/pages/InnovationPage'));
const FeedbackPage = lazy(() => import('@/pages/FeedbackPage'));

// Additional pages
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
const AccessDiagnosticPage = lazy(() => import('@/pages/AccessDiagnosticPage'));

// 404 Error page
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Wrapper with suspense and error boundary
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <UniversalErrorBoundary>
    <Suspense fallback={<ComponentLoadingFallback />}>
      {children}
    </Suspense>
  </UniversalErrorBoundary>
);

// Route manifest for validation and testing
export const ROUTES_MANIFEST = [
  { path: "/", auth: "public", module: "home", component: "HomePage" },
  { path: "/choose-mode", auth: "public", module: "auth", component: "ChooseModePage" },
  { path: "/b2b/selection", auth: "public", module: "b2b", component: "B2BSelectionPage" },
  { path: "/point20", auth: "public", module: "public", component: "Point20Page" },
  { path: "/b2c/login", auth: "public", module: "auth", component: "B2CLoginPage" },
  { path: "/b2c/register", auth: "public", module: "auth", component: "B2CRegisterPage" },
  { path: "/b2b/user/login", auth: "public", module: "auth", component: "B2BUserLoginPage" },
  { path: "/b2b/user/register", auth: "public", module: "auth", component: "B2BUserRegisterPage" },
  { path: "/b2b/admin/login", auth: "public", module: "auth", component: "B2BAdminLoginPage" },
  { path: "/b2c/dashboard", auth: "b2c", module: "dashboard", component: "B2CDashboardPage" },
  { path: "/b2b/user/dashboard", auth: "b2b_user", module: "dashboard", component: "B2BUserDashboardPage" },
  { path: "/b2b/admin/dashboard", auth: "b2b_admin", module: "dashboard", component: "B2BAdminDashboardPage" },
  { path: "/scan", auth: "b2c", module: "emotion", component: "ScanPage" },
  { path: "/music", auth: "b2c", module: "music", component: "MusicPage" },
  { path: "/coach", auth: "b2c", module: "coach", component: "CoachPage" },
  { path: "/journal", auth: "b2c", module: "journal", component: "JournalPage" },
  { path: "/vr", auth: "b2c", module: "vr", component: "VRPage" },
  { path: "/meditation", auth: "b2c", module: "vr", component: "MeditationPage" },
  { path: "/preferences", auth: "b2c", module: "settings", component: "PreferencesPage" },
  { path: "/gamification", auth: "b2c", module: "gamification", component: "GamificationPage" },
  { path: "/social-cocon", auth: "b2c", module: "social", component: "SocialCoconPage" },
  { path: "/teams", auth: "b2b_admin", role: "b2b_admin", module: "admin", component: "TeamsPage" },
  { path: "/reports", auth: "b2b_admin", role: "b2b_admin", module: "admin", component: "ReportsPage" },
  { path: "/events", auth: "b2b_admin", role: "b2b_admin", module: "admin", component: "EventsPage" },
  { path: "/optimisation", auth: "b2b_admin", role: "b2b_admin", module: "admin", component: "OptimisationPage" },
  { path: "/settings", auth: "b2b_admin", role: "b2b_admin", module: "admin", component: "SettingsPage" },
  { path: "/notifications", auth: "b2b_admin", role: "b2b_admin", module: "admin", component: "NotificationsPage" },
  { path: "/security", auth: "b2b_admin", role: "b2b_admin", module: "security", component: "SecurityPage" },
  { path: "/privacy", auth: "b2b_admin", role: "b2b_admin", module: "privacy", component: "PrivacyPage" },
  { path: "/audit", auth: "b2b_admin", role: "b2b_admin", module: "audit", component: "AuditPage" },
  { path: "/accessibility", auth: "b2b_admin", role: "b2b_admin", module: "accessibility", component: "AccessibilityPage" },
  { path: "/innovation", auth: "b2b_admin", role: "b2b_admin", module: "innovation", component: "InnovationPage" },
  { path: "/feedback", auth: "b2b_admin", role: "b2b_admin", module: "feedback", component: "FeedbackPage" },
  { path: "/onboarding", auth: "b2c", module: "onboarding", component: "OnboardingPage" },
  { path: "/access-diagnostic", auth: "b2c", module: "accessibility", component: "AccessDiagnosticPage" }
];

export const ROUTE_MANIFEST = ROUTES_MANIFEST.map(route => route.path);

// Build unified routes configuration
export function buildUnifiedRoutes(): RouteObject[] {
  return [
    {
      path: "/",
      element: <PageWrapper><HomePage /></PageWrapper>,
    },
    {
      path: "/choose-mode",
      element: <PageWrapper><ChooseModePage /></PageWrapper>,
    },
    {
      path: "/b2b/selection",
      element: <PageWrapper><B2BSelectionPage /></PageWrapper>,
    },
    {
      path: "/point20",
      element: <PageWrapper><Point20Page /></PageWrapper>,
    },
    // Auth routes
    {
      path: "/b2c/login",
      element: <PageWrapper><B2CLoginPage /></PageWrapper>,
    },
    {
      path: "/b2c/register",
      element: <PageWrapper><B2CRegisterPage /></PageWrapper>,
    },
    {
      path: "/b2b/user/login",
      element: <PageWrapper><B2BUserLoginPage /></PageWrapper>,
    },
    {
      path: "/b2b/user/register",
      element: <PageWrapper><B2BUserRegisterPage /></PageWrapper>,
    },
    {
      path: "/b2b/admin/login",
      element: <PageWrapper><B2BAdminLoginPage /></PageWrapper>,
    },
    // Dashboard routes
    {
      path: "/b2c/dashboard",
      element: <PageWrapper><B2CDashboardPage /></PageWrapper>,
    },
    {
      path: "/b2b/user/dashboard",
      element: <PageWrapper><B2BUserDashboardPage /></PageWrapper>,
    },
    {
      path: "/b2b/admin/dashboard",
      element: <PageWrapper><B2BAdminDashboardPage /></PageWrapper>,
    },
    // Feature routes
    {
      path: "/scan",
      element: <PageWrapper><ScanPage /></PageWrapper>,
    },
    {
      path: "/music",
      element: <PageWrapper><MusicPage /></PageWrapper>,
    },
    {
      path: "/coach",
      element: <PageWrapper><CoachPage /></PageWrapper>,
    },
    {
      path: "/journal",
      element: <PageWrapper><JournalPage /></PageWrapper>,
    },
    {
      path: "/vr",
      element: <PageWrapper><VRPage /></PageWrapper>,
    },
    {
      path: "/meditation",
      element: <PageWrapper><MeditationPage /></PageWrapper>,
    },
    {
      path: "/preferences",
      element: <PageWrapper><PreferencesPage /></PageWrapper>,
    },
    {
      path: "/gamification",
      element: <PageWrapper><GamificationPage /></PageWrapper>,
    },
    {
      path: "/social-cocon",
      element: <PageWrapper><SocialCoconPage /></PageWrapper>,
    },
    // Admin routes
    {
      path: "/teams",
      element: <PageWrapper><TeamsPage /></PageWrapper>,
    },
    {
      path: "/reports",
      element: <PageWrapper><ReportsPage /></PageWrapper>,
    },
    {
      path: "/events",
      element: <PageWrapper><EventsPage /></PageWrapper>,
    },
    {
      path: "/optimisation",
      element: <PageWrapper><OptimisationPage /></PageWrapper>,
    },
    {
      path: "/settings",
      element: <PageWrapper><SettingsPage /></PageWrapper>,
    },
    {
      path: "/notifications",
      element: <PageWrapper><NotificationsPage /></PageWrapper>,
    },
    {
      path: "/security",
      element: <PageWrapper><SecurityPage /></PageWrapper>,
    },
    {
      path: "/privacy",
      element: <PageWrapper><PrivacyPage /></PageWrapper>,
    },
    {
      path: "/audit",
      element: <PageWrapper><AuditPage /></PageWrapper>,
    },
    {
      path: "/accessibility",
      element: <PageWrapper><AccessibilityPage /></PageWrapper>,
    },
    {
      path: "/innovation",
      element: <PageWrapper><InnovationPage /></PageWrapper>,
    },
    {
      path: "/feedback",
      element: <PageWrapper><FeedbackPage /></PageWrapper>,
    },
    {
      path: "/onboarding",
      element: <PageWrapper><OnboardingPage /></PageWrapper>,
    },
    {
      path: "/access-diagnostic",
      element: <PageWrapper><AccessDiagnosticPage /></PageWrapper>,
    },
    // 404 - MUST BE LAST
    {
      path: "*",
      element: <PageWrapper><NotFoundPage /></PageWrapper>,
    },
  ];
}

export function validateRoutesManifest() {
  const paths = ROUTES_MANIFEST.map(route => route.path);
  const uniquePaths = new Set(paths);
  
  return {
    valid: paths.length === uniquePaths.size,
    errors: paths.length !== uniquePaths.size ? ['Duplicate paths found in manifest'] : [],
    totalRoutes: paths.length
  };
}
