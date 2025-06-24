
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import Layout from '@/layouts/Layout';
import AuthTransition from '@/components/auth/AuthTransition';

// Public pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const B2BSelectionPage = lazy(() => import('@/pages/b2b/SelectionPage'));

// B2C Auth pages  
const B2CLoginPage = lazy(() => import('@/pages/b2c/LoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/b2c/RegisterPage'));
const B2CDashboardPage = lazy(() => import('@/pages/b2c/DashboardPage'));

// B2B User pages
const B2BUserLoginPage = lazy(() => import('@/pages/b2b/user/LoginPage'));
const B2BUserRegisterPage = lazy(() => import('@/pages/b2b/user/RegisterPage'));
const B2BUserDashboardPage = lazy(() => import('@/pages/b2b/user/DashboardPage'));

// B2B Admin pages
const B2BAdminLoginPage = lazy(() => import('@/pages/b2b/admin/LoginPage'));
const B2BAdminDashboardPage = lazy(() => import('@/pages/b2b/admin/DashboardPage'));

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

// Admin pages
const TeamsPage = lazy(() => import('@/pages/admin/TeamsPage'));
const ReportsPage = lazy(() => import('@/pages/admin/ReportsPage'));
const EventsPage = lazy(() => import('@/pages/admin/EventsPage'));
const OptimisationPage = lazy(() => import('@/pages/admin/OptimisationPage'));
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage'));
const NotificationsPage = lazy(() => import('@/pages/admin/NotificationsPage'));
const SecurityPage = lazy(() => import('@/pages/admin/SecurityPage'));
const PrivacyPage = lazy(() => import('@/pages/admin/PrivacyPage'));
const AuditPage = lazy(() => import('@/pages/admin/AuditPage'));
const AccessibilityPage = lazy(() => import('@/pages/admin/AccessibilityPage'));
const InnovationPage = lazy(() => import('@/pages/admin/InnovationPage'));
const FeedbackPage = lazy(() => import('@/pages/admin/FeedbackPage'));

// Additional pages
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
const Point20Page = lazy(() => import('@/pages/Point20Page'));
const AccessDiagnosticPage = lazy(() => import('@/pages/AccessDiagnosticPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export const ROUTE_MANIFEST = [
  '/',
  '/choose-mode',
  '/b2b/selection',
  '/point20',
  '/b2c/login',
  '/b2c/register',
  '/b2b/user/login',
  '/b2b/user/register',
  '/b2b/admin/login',
  '/b2c/dashboard',
  '/b2b/user/dashboard',
  '/b2b/admin/dashboard',
  '/scan',
  '/music',
  '/coach',
  '/journal',
  '/vr',
  '/meditation',
  '/preferences',
  '/gamification',
  '/social-cocon',
  '/teams',
  '/reports',
  '/events',
  '/optimisation',
  '/settings',
  '/notifications',
  '/security',
  '/privacy',
  '/audit',
  '/accessibility',
  '/innovation',
  '/feedback',
  '/onboarding',
  '/access-diagnostic'
];

export function buildUnifiedRoutes(): RouteObject[] {
  return [
    {
      path: '/',
      element: <Layout />,
      children: [
        // Public routes
        { index: true, element: <HomePage /> },
        { path: 'choose-mode', element: <ChooseModePage /> },
        { path: 'b2b/selection', element: <B2BSelectionPage /> },
        { path: 'point20', element: <Point20Page /> },
        
        // B2C Auth routes
        { path: 'b2c/login', element: <B2CLoginPage /> },
        { path: 'b2c/register', element: <B2CRegisterPage /> },
        
        // B2B User auth routes
        { path: 'b2b/user/login', element: <B2BUserLoginPage /> },
        { path: 'b2b/user/register', element: <B2BUserRegisterPage /> },
        
        // B2B Admin auth routes
        { path: 'b2b/admin/login', element: <B2BAdminLoginPage /> },
        
        // Protected dashboard routes
        { path: 'b2c/dashboard', element: <AuthTransition><B2CDashboardPage /></AuthTransition> },
        { path: 'b2b/user/dashboard', element: <AuthTransition><B2BUserDashboardPage /></AuthTransition> },
        { path: 'b2b/admin/dashboard', element: <AuthTransition><B2BAdminDashboardPage /></AuthTransition> },
        
        // Feature routes (accessible by all authenticated users)
        { path: 'scan', element: <AuthTransition><ScanPage /></AuthTransition> },
        { path: 'music', element: <AuthTransition><MusicPage /></AuthTransition> },
        { path: 'coach', element: <AuthTransition><CoachPage /></AuthTransition> },
        { path: 'journal', element: <AuthTransition><JournalPage /></AuthTransition> },
        { path: 'vr', element: <AuthTransition><VRPage /></AuthTransition> },
        { path: 'meditation', element: <AuthTransition><MeditationPage /></AuthTransition> },
        { path: 'preferences', element: <AuthTransition><PreferencesPage /></AuthTransition> },
        { path: 'gamification', element: <AuthTransition><GamificationPage /></AuthTransition> },
        { path: 'social-cocon', element: <AuthTransition><SocialCoconPage /></AuthTransition> },
        
        // Admin-only routes
        { path: 'teams', element: <AuthTransition><TeamsPage /></AuthTransition> },
        { path: 'reports', element: <AuthTransition><ReportsPage /></AuthTransition> },
        { path: 'events', element: <AuthTransition><EventsPage /></AuthTransition> },
        { path: 'optimisation', element: <AuthTransition><OptimisationPage /></AuthTransition> },
        { path: 'settings', element: <AuthTransition><SettingsPage /></AuthTransition> },
        { path: 'notifications', element: <AuthTransition><NotificationsPage /></AuthTransition> },
        { path: 'security', element: <AuthTransition><SecurityPage /></AuthTransition> },
        { path: 'privacy', element: <AuthTransition><PrivacyPage /></AuthTransition> },
        { path: 'audit', element: <AuthTransition><AuditPage /></AuthTransition> },
        { path: 'accessibility', element: <AuthTransition><AccessibilityPage /></AuthTransition> },
        { path: 'innovation', element: <AuthTransition><InnovationPage /></AuthTransition> },
        { path: 'feedback', element: <AuthTransition><FeedbackPage /></AuthTransition> },
        
        // Additional routes
        { path: 'onboarding', element: <AuthTransition><OnboardingPage /></AuthTransition> },
        { path: 'access-diagnostic', element: <AuthTransition><AccessDiagnosticPage /></AuthTransition> },
        
        // 404 fallback
        { path: '*', element: <NotFoundPage /> }
      ]
    }
  ];
}
