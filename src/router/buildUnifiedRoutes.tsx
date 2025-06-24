import React, { Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { ComponentLoadingFallback } from '@/components/ui/loading-fallback';
import OptimizedErrorBoundary from '@/components/ErrorBoundary/OptimizedErrorBoundary';
import Layout from '@/components/layout/Layout';

// Lazy loading des pages
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const ChooseModePage = React.lazy(() => import('@/pages/ChooseModePage'));
const B2BSelectionPage = React.lazy(() => import('@/pages/B2BSelectionPage'));
const Point20Page = React.lazy(() => import('@/pages/Point20Page'));
const B2CLoginPage = React.lazy(() => import('@/pages/B2CLoginPage'));
const B2CRegisterPage = React.lazy(() => import('@/pages/B2CRegisterPage'));
const B2BUserLoginPage = React.lazy(() => import('@/pages/B2BUserLoginPage'));
const B2BUserRegisterPage = React.lazy(() => import('@/pages/B2BUserRegisterPage'));
const B2BAdminLoginPage = React.lazy(() => import('@/pages/B2BAdminLoginPage'));
const B2CDashboardPage = React.lazy(() => import('@/pages/B2CDashboardPage'));
const B2BUserDashboardPage = React.lazy(() => import('@/pages/B2BUserDashboardPage'));
const B2BAdminDashboardPage = React.lazy(() => import('@/pages/B2BAdminDashboardPage'));
const ScanPage = React.lazy(() => import('@/pages/ScanPage'));
const MusicPage = React.lazy(() => import('@/pages/MusicPage'));
const CoachPage = React.lazy(() => import('@/pages/CoachPage'));
const JournalPage = React.lazy(() => import('@/pages/JournalPage'));
const VRPage = React.lazy(() => import('@/pages/VRPage'));
const MeditationPage = React.lazy(() => import('@/pages/MeditationPage'));
const PreferencesPage = React.lazy(() => import('@/pages/PreferencesPage'));
const GamificationPage = React.lazy(() => import('@/pages/GamificationPage'));
const SocialCoconPage = React.lazy(() => import('@/pages/SocialCoconPage'));
const TeamsPage = React.lazy(() => import('@/pages/TeamsPage'));
const ReportsPage = React.lazy(() => import('@/pages/ReportsPage'));
const EventsPage = React.lazy(() => import('@/pages/EventsPage'));
const OptimisationPage = React.lazy(() => import('@/pages/OptimisationPage'));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'));
const NotificationsPage = React.lazy(() => import('@/pages/NotificationsPage'));
const SecurityPage = React.lazy(() => import('@/pages/SecurityPage'));
const PrivacyPage = React.lazy(() => import('@/pages/PrivacyPage'));
const AuditPage = React.lazy(() => import('@/pages/AuditPage'));
const AccessibilityPage = React.lazy(() => import('@/pages/AccessibilityPage'));
const InnovationPage = React.lazy(() => import('@/pages/InnovationPage'));
const FeedbackPage = React.lazy(() => import('@/pages/FeedbackPage'));
const OnboardingPage = React.lazy(() => import('@/pages/OnboardingPage'));
const AccessDiagnosticPage = React.lazy(() => import('@/pages/AccessDiagnosticPage'));

// Routes manifest pour validation
export const ROUTES_MANIFEST = [
  { path: '/', auth: 'public', module: 'home', component: 'HomePage' },
  { path: '/choose-mode', auth: 'public', module: 'auth', component: 'ChooseModePage' },
  { path: '/b2b/selection', auth: 'public', module: 'b2b', component: 'B2BSelectionPage' },
  { path: '/point20', auth: 'public', module: 'public', component: 'Point20Page' },
  { path: '/b2c/login', auth: 'public', module: 'auth', component: 'B2CLoginPage' },
  { path: '/b2c/register', auth: 'public', module: 'auth', component: 'B2CRegisterPage' },
  { path: '/b2b/user/login', auth: 'public', module: 'auth', component: 'B2BUserLoginPage' },
  { path: '/b2b/user/register', auth: 'public', module: 'auth', component: 'B2BUserRegisterPage' },
  { path: '/b2b/admin/login', auth: 'public', module: 'auth', component: 'B2BAdminLoginPage' },
  { path: '/b2c/dashboard', auth: 'b2c', module: 'dashboard', component: 'B2CDashboardPage' },
  { path: '/b2b/user/dashboard', auth: 'b2b_user', module: 'dashboard', component: 'B2BUserDashboardPage' },
  { path: '/b2b/admin/dashboard', auth: 'b2b_admin', module: 'dashboard', component: 'B2BAdminDashboardPage' },
  { path: '/scan', auth: 'b2c', module: 'emotion', component: 'ScanPage' },
  { path: '/music', auth: 'b2c', module: 'music', component: 'MusicPage' },
  { path: '/coach', auth: 'b2c', module: 'coach', component: 'CoachPage' },
  { path: '/journal', auth: 'b2c', module: 'journal', component: 'JournalPage' },
  { path: '/vr', auth: 'b2c', module: 'vr', component: 'VRPage' },
  { path: '/meditation', auth: 'b2c', module: 'vr', component: 'MeditationPage' },
  { path: '/preferences', auth: 'b2c', module: 'settings', component: 'PreferencesPage' },
  { path: '/gamification', auth: 'b2c', module: 'gamification', component: 'GamificationPage' },
  { path: '/social-cocon', auth: 'b2c', module: 'social', component: 'SocialCoconPage' },
  { path: '/teams', auth: 'b2b_admin', role: 'b2b_admin', module: 'admin', component: 'TeamsPage' },
  { path: '/reports', auth: 'b2b_admin', role: 'b2b_admin', module: 'admin', component: 'ReportsPage' },
  { path: '/events', auth: 'b2b_admin', role: 'b2b_admin', module: 'admin', component: 'EventsPage' },
  { path: '/optimisation', auth: 'b2b_admin', role: 'b2b_admin', module: 'admin', component: 'OptimisationPage' },
  { path: '/settings', auth: 'b2b_admin', role: 'b2b_admin', module: 'admin', component: 'SettingsPage' },
  { path: '/notifications', auth: 'b2b_admin', role: 'b2b_admin', module: 'admin', component: 'NotificationsPage' },
  { path: '/security', auth: 'b2b_admin', role: 'b2b_admin', module: 'security', component: 'SecurityPage' },
  { path: '/privacy', auth: 'b2b_admin', role: 'b2b_admin', module: 'privacy', component: 'PrivacyPage' },
  { path: '/audit', auth: 'b2b_admin', role: 'b2b_admin', module: 'audit', component: 'AuditPage' },
  { path: '/accessibility', auth: 'b2b_admin', role: 'b2b_admin', module: 'accessibility', component: 'AccessibilityPage' },
  { path: '/innovation', auth: 'b2b_admin', role: 'b2b_admin', module: 'innovation', component: 'InnovationPage' },
  { path: '/feedback', auth: 'b2b_admin', role: 'b2b_admin', module: 'feedback', component: 'FeedbackPage' },
  { path: '/onboarding', auth: 'b2c', module: 'onboarding', component: 'OnboardingPage' },
  { path: '/access-diagnostic', auth: 'b2c', module: 'accessibility', component: 'AccessDiagnosticPage' }
];

export interface RouteManifestEntry {
  path: string;
  auth: string;
  module: string;
  component: string;
  role?: string;
}

export function validateRoutesManifest(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const paths = new Set<string>();
  
  ROUTES_MANIFEST.forEach((route, index) => {
    if (!route.path) errors.push(`Route ${index}: missing path`);
    if (!route.component) errors.push(`Route ${index}: missing component`);
    if (paths.has(route.path)) errors.push(`Duplicate path: ${route.path}`);
    paths.add(route.path);
  });
  
  return { valid: errors.length === 0, errors };
}

function withSuspenseAndErrorBoundary(Component: React.LazyExoticComponent<React.ComponentType<any>>) {
  return (
    <OptimizedErrorBoundary>
      <Suspense fallback={<ComponentLoadingFallback />}>
        <Component />
      </Suspense>
    </OptimizedErrorBoundary>
  );
}

export function buildUnifiedRoutes(): RouteObject[] {
  return [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: withSuspenseAndErrorBoundary(HomePage),
        },
        {
          path: 'choose-mode',
          element: withSuspenseAndErrorBoundary(ChooseModePage),
        },
        {
          path: 'b2b/selection',
          element: withSuspenseAndErrorBoundary(B2BSelectionPage),
        },
        {
          path: 'point20',
          element: withSuspenseAndErrorBoundary(Point20Page),
        },
        {
          path: '/b2c/login',
          element: withSuspenseAndErrorBoundary(B2CLoginPage),
        },
        {
          path: '/b2c/register',
          element: withSuspenseAndErrorBoundary(B2CRegisterPage),
        },
        {
          path: '/b2b/user/login',
          element: withSuspenseAndErrorBoundary(B2BUserLoginPage),
        },
        {
          path: '/b2b/user/register',
          element: withSuspenseAndErrorBoundary(B2BUserRegisterPage),
        },
        {
          path: '/b2b/admin/login',
          element: withSuspenseAndErrorBoundary(B2BAdminLoginPage),
        },
        {
          path: '/b2c/dashboard',
          element: withSuspenseAndErrorBoundary(B2CDashboardPage),
        },
        {
          path: '/b2b/user/dashboard',
          element: withSuspenseAndErrorBoundary(B2BUserDashboardPage),
        },
        {
          path: '/b2b/admin/dashboard',
          element: withSuspenseAndErrorBoundary(B2BAdminDashboardPage),
        },
        {
          path: '/scan',
          element: withSuspenseAndErrorBoundary(ScanPage),
        },
        {
          path: '/music',
          element: withSuspenseAndErrorBoundary(MusicPage),
        },
        {
          path: '/coach',
          element: withSuspenseAndErrorBoundary(CoachPage),
        },
        {
          path: '/journal',
          element: withSuspenseAndErrorBoundary(JournalPage),
        },
        {
          path: '/vr',
          element: withSuspenseAndErrorBoundary(VRPage),
        },
        {
          path: '/meditation',
          element: withSuspenseAndErrorBoundary(MeditationPage),
        },
        {
          path: '/preferences',
          element: withSuspenseAndErrorBoundary(PreferencesPage),
        },
        {
          path: '/gamification',
          element: withSuspenseAndErrorBoundary(GamificationPage),
        },
        {
          path: '/social-cocon',
          element: withSuspenseAndErrorBoundary(SocialCoconPage),
        },
        {
          path: '/teams',
          element: withSuspenseAndErrorBoundary(TeamsPage),
        },
        {
          path: '/reports',
          element: withSuspenseAndErrorBoundary(ReportsPage),
        },
        {
          path: '/events',
          element: withSuspenseAndErrorBoundary(EventsPage),
        },
        {
          path: '/optimisation',
          element: withSuspenseAndErrorBoundary(OptimisationPage),
        },
        {
          path: '/settings',
          element: withSuspenseAndErrorBoundary(SettingsPage),
        },
        {
          path: '/notifications',
          element: withSuspenseAndErrorBoundary(NotificationsPage),
        },
        {
          path: '/security',
          element: withSuspenseAndErrorBoundary(SecurityPage),
        },
        {
          path: '/privacy',
          element: withSuspenseAndErrorBoundary(PrivacyPage),
        },
        {
          path: '/audit',
          element: withSuspenseAndErrorBoundary(AuditPage),
        },
        {
          path: '/accessibility',
          element: withSuspenseAndErrorBoundary(AccessibilityPage),
        },
        {
          path: '/innovation',
          element: withSuspenseAndErrorBoundary(InnovationPage),
        },
        {
          path: '/feedback',
          element: withSuspenseAndErrorBoundary(FeedbackPage),
        },
        {
          path: '/onboarding',
          element: withSuspenseAndErrorBoundary(OnboardingPage),
        },
        {
          path: '/access-diagnostic',
          element: withSuspenseAndErrorBoundary(AccessDiagnosticPage),
        },
        // Catch-all route pour les pages non trouvées
        {
          path: '*',
          element: (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-muted-foreground">Page non trouvée</p>
              </div>
            </div>
          ),
        },
      ],
    },
  ];
}
