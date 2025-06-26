
import { RouteObject } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FullPageLoader } from '@/components/FullPageLoader';

// Pages principales
const HomePage = lazy(() => import('@/pages/HomePage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));

// Pages B2C
const B2CLoginPage = lazy(() => import('@/pages/b2c/LoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/b2c/RegisterPage'));
const B2CDashboardPage = lazy(() => import('@/pages/b2c/DashboardPage'));

// Pages B2B - Utilisation des pages qui existent réellement
const B2BSelectionPage = lazy(() => import('@/pages/b2b/B2BSelectionPage'));
const B2BUserLoginPage = lazy(() => import('@/pages/b2b/B2BUserLoginPage'));
const B2BUserDashboard = lazy(() => import('@/pages/b2b/B2BUserDashboard'));
const B2BAdminLoginPage = lazy(() => import('@/pages/b2b/B2BAdminLoginPage'));
const B2BAdminDashboard = lazy(() => import('@/pages/b2b/B2BAdminDashboard'));

// Pages fonctionnelles
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));
const VRPage = lazy(() => import('@/pages/VRPage'));
const PreferencesPage = lazy(() => import('@/pages/PreferencesPage'));
const GamificationPage = lazy(() => import('@/pages/GamificationPage'));
const SocialCoconPage = lazy(() => import('@/pages/SocialCoconPage'));

// Pages admin
const TeamsPage = lazy(() => import('@/pages/admin/TeamsPage'));
const ReportsPage = lazy(() => import('@/pages/admin/ReportsPage'));
const EventsPage = lazy(() => import('@/pages/EventsPage'));
const OptimisationPage = lazy(() => import('@/pages/OptimisationPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));

// Pages supplémentaires
const MeditationPage = lazy(() => import('@/pages/MeditationPage'));
const SecurityPage = lazy(() => import('@/pages/SecurityPage'));
const AccessibilityPage = lazy(() => import('@/pages/AccessibilityPage'));
const SystemAuditPage = lazy(() => import('@/pages/SystemAuditPage'));
const InnovationLabPage = lazy(() => import('@/pages/InnovationLabPage'));
const PrivacyDashboardPage = lazy(() => import('@/pages/PrivacyDashboardPage'));
const HelpCenterPage = lazy(() => import('@/pages/HelpCenterPage'));
const FeedbackPage = lazy(() => import('@/pages/FeedbackPage'));

// Pages fonctionnalités
const BreathworkPage = lazy(() => import('@/pages/features/BreathworkPage'));
const ARFiltersPage = lazy(() => import('@/pages/features/ARFiltersPage'));

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<FullPageLoader />}>
    {children}
  </Suspense>
);

export const buildUnifiedRoutes = (): RouteObject[] => [
  {
    path: '/',
    element: (
      <SuspenseWrapper>
        <HomePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/choose-mode',
    element: (
      <SuspenseWrapper>
        <ChooseModePage />
      </SuspenseWrapper>
    ),
  },
  // Routes B2C
  {
    path: '/b2c/login',
    element: (
      <SuspenseWrapper>
        <B2CLoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/b2c/register',
    element: (
      <SuspenseWrapper>
        <B2CRegisterPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/b2c/dashboard',
    element: (
      <ProtectedRoute requiredRole="b2c">
        <SuspenseWrapper>
          <B2CDashboardPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  // Routes B2B
  {
    path: '/b2b/selection',
    element: (
      <SuspenseWrapper>
        <B2BSelectionPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/b2b/user/login',
    element: (
      <SuspenseWrapper>
        <B2BUserLoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/b2b/user/dashboard',
    element: (
      <ProtectedRoute requiredRole="b2b_user">
        <SuspenseWrapper>
          <B2BUserDashboard />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2b/admin/login',
    element: (
      <SuspenseWrapper>
        <B2BAdminLoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/b2b/admin/dashboard',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        <SuspenseWrapper>
          <B2BAdminDashboard />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  // Routes fonctionnalités communes
  {
    path: '/scan',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <ScanPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/music',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <MusicPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/coach',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <CoachPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/journal',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <JournalPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/vr',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <VRPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/preferences',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <PreferencesPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/gamification',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <GamificationPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/social-cocon',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <SocialCoconPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  // Routes admin
  {
    path: '/teams',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        <SuspenseWrapper>
          <TeamsPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        <SuspenseWrapper>
          <ReportsPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/events',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <EventsPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/optimisation',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        <SuspenseWrapper>
          <OptimisationPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <SettingsPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  // Pages supplémentaires
  {
    path: '/meditation',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <MeditationPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/security',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <SecurityPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/accessibility',
    element: (
      <SuspenseWrapper>
        <AccessibilityPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/system-audit',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        <SuspenseWrapper>
          <SystemAuditPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/innovation-lab',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <InnovationLabPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/privacy-dashboard',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <PrivacyDashboardPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/help-center',
    element: (
      <SuspenseWrapper>
        <HelpCenterPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/feedback',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <FeedbackPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  // Pages fonctionnalités
  {
    path: '/breathwork',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <BreathworkPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/ar-filters',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <ARFiltersPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
];
