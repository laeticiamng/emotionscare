
import { lazy, Suspense } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { dashboardRoutes } from './routes/dashboardRoutes';
import OptimizedErrorBoundary from '@/components/ErrorBoundary/OptimizedErrorBoundary';

// Lazy load components - 52 ROUTES OFFICIELLES
const HomePage = lazy(() => import('@/pages/HomePage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const B2BSelectionPage = lazy(() => import('@/pages/b2b/B2BSelectionPage'));

// Auth pages (6)
const B2CLoginPage = lazy(() => import('@/pages/b2c/auth/B2CLoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/b2c/auth/B2CRegisterPage'));
const B2BUserLoginPage = lazy(() => import('@/pages/b2b/user/auth/B2BUserLoginPage'));
const B2BUserRegisterPage = lazy(() => import('@/pages/b2b/user/auth/B2BUserRegisterPage'));
const B2BAdminLoginPage = lazy(() => import('@/pages/b2b/admin/auth/B2BAdminLoginPage'));

// Feature pages principales (8)
const ScanPage = lazy(() => import('@/pages/features/ScanPage'));
const MusicPage = lazy(() => import('@/pages/features/MusicPage'));
const CoachPage = lazy(() => import('@/pages/features/CoachPage'));
const JournalPage = lazy(() => import('@/pages/features/JournalPage'));
const VRPage = lazy(() => import('@/pages/features/VRPage'));
const PreferencesPage = lazy(() => import('@/pages/features/PreferencesPage'));
const GamificationPage = lazy(() => import('@/pages/features/GamificationPage'));
const SocialCoconPage = lazy(() => import('@/pages/features/SocialCoconPage'));

// Modules fun-first avec IA (11)
const BossLevelGritPage = lazy(() => import('@/pages/BossLevelGritPage'));
const MoodMixerPage = lazy(() => import('@/pages/MoodMixerPage'));
const AmbitionArcadePage = lazy(() => import('@/pages/AmbitionArcadePage'));
const BounceBackBattlePage = lazy(() => import('@/pages/BounceBackBattlePage'));
const StorySynthLabPage = lazy(() => import('@/pages/StorySynthLabPage'));
const FlashGlowPage = lazy(() => import('@/pages/FlashGlowPage'));
const ARFiltersPage = lazy(() => import('@/pages/ARFiltersPage'));
const BubbleBeatPage = lazy(() => import('@/pages/BubbleBeatPage'));
const ScreenSilkBreakPage = lazy(() => import('@/pages/ScreenSilkBreakPage'));
const VRGalactiquePage = lazy(() => import('@/pages/VRGalactiquePage'));
const InstantGlowPage = lazy(() => import('@/pages/InstantGlowPage'));

// Analytics & data (3)
const WeeklyBarsPage = lazy(() => import('@/pages/WeeklyBarsPage'));
const HeatmapVibesPage = lazy(() => import('@/pages/HeatmapVibesPage'));
const BreathworkPage = lazy(() => import('@/pages/BreathworkPage'));

// Paramètres & compte (7)
const PrivacyTogglesPage = lazy(() => import('@/pages/PrivacyTogglesPage'));
const ExportCSVPage = lazy(() => import('@/pages/ExportCSVPage'));
const AccountDeletePage = lazy(() => import('@/pages/AccountDeletePage'));
const HealthCheckBadgePage = lazy(() => import('@/pages/HealthCheckBadgePage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const HelpCenterPage = lazy(() => import('@/pages/HelpCenterPage'));
const ProfileSettingsPage = lazy(() => import('@/pages/ProfileSettingsPage'));

// Historique & feedback (2)
const ActivityHistoryPage = lazy(() => import('@/pages/ActivityHistoryPage'));
const FeedbackPage = lazy(() => import('@/pages/FeedbackPage'));

// B2B Admin pages (8)
const TeamsPage = lazy(() => import('@/pages/b2b/admin/TeamsPage'));
const ReportsPage = lazy(() => import('@/pages/b2b/admin/ReportsPage'));
const EventsPage = lazy(() => import('@/pages/b2b/admin/EventsPage'));
const OptimisationPage = lazy(() => import('@/pages/b2b/admin/OptimisationPage'));
const SettingsPage = lazy(() => import('@/pages/b2b/admin/SettingsPage'));
const SecurityPage = lazy(() => import('@/pages/SecurityPage'));
const AuditPage = lazy(() => import('@/pages/AuditPage'));
const AccessibilityPage = lazy(() => import('@/pages/AccessibilityPage'));

// Wrapper component for Suspense
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <OptimizedErrorBoundary>
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      {children}
    </Suspense>
  </OptimizedErrorBoundary>
);

export const buildUnifiedRoutes = (): RouteObject[] => {
  return [
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: (
            <SuspenseWrapper>
              <HomePage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'choose-mode',
          element: (
            <SuspenseWrapper>
              <ChooseModePage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'onboarding',
          element: (
            <SuspenseWrapper>
              <OnboardingPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'auth',
          element: (
            <SuspenseWrapper>
              <AuthPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'b2b',
          element: <Navigate to="/b2b/selection" replace />,
        },
        {
          path: 'b2b/selection',
          element: (
            <SuspenseWrapper>
              <B2BSelectionPage />
            </SuspenseWrapper>
          ),
        },
        
        // B2C Auth Routes
        {
          path: 'b2c/login',
          element: (
            <SuspenseWrapper>
              <B2CLoginPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'b2c/register',
          element: (
            <SuspenseWrapper>
              <B2CRegisterPage />
            </SuspenseWrapper>
          ),
        },
        
        // B2B Auth Routes
        {
          path: 'b2b/user/login',
          element: (
            <SuspenseWrapper>
              <B2BUserLoginPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'b2b/user/register',
          element: (
            <SuspenseWrapper>
              <B2BUserRegisterPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'b2b/admin/login',
          element: (
            <SuspenseWrapper>
              <B2BAdminLoginPage />
            </SuspenseWrapper>
          ),
        },
        
        // Protected Dashboard Routes  
        ...dashboardRoutes,
        
        // Feature Routes (accessible to all authenticated users)
        {
          path: 'scan',
          element: (
            <SuspenseWrapper>
              <ScanPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'music',
          element: (
            <SuspenseWrapper>
              <MusicPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'coach',
          element: (
            <SuspenseWrapper>
              <CoachPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'journal',
          element: (
            <SuspenseWrapper>
              <JournalPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'vr',
          element: (
            <SuspenseWrapper>
              <VRPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'preferences',
          element: (
            <SuspenseWrapper>
              <PreferencesPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'gamification',
          element: (
            <SuspenseWrapper>
              <GamificationPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'social-cocon',
          element: (
            <SuspenseWrapper>
              <SocialCoconPage />
            </SuspenseWrapper>
          ),
        },
        
        // Modules fun-first avec IA (11 routes)
        {
          path: 'boss-level-grit',
          element: (
            <SuspenseWrapper>
              <BossLevelGritPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'mood-mixer',
          element: (
            <SuspenseWrapper>
              <MoodMixerPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'ambition-arcade',
          element: (
            <SuspenseWrapper>
              <AmbitionArcadePage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'bounce-back-battle',
          element: (
            <SuspenseWrapper>
              <BounceBackBattlePage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'story-synth-lab',
          element: (
            <SuspenseWrapper>
              <StorySynthLabPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'flash-glow',
          element: (
            <SuspenseWrapper>
              <FlashGlowPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'ar-filters',
          element: (
            <SuspenseWrapper>
              <ARFiltersPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'bubble-beat',
          element: (
            <SuspenseWrapper>
              <BubbleBeatPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'screen-silk-break',
          element: (
            <SuspenseWrapper>
              <ScreenSilkBreakPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'vr-galactique',
          element: (
            <SuspenseWrapper>
              <VRGalactiquePage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'instant-glow',
          element: (
            <SuspenseWrapper>
              <InstantGlowPage />
            </SuspenseWrapper>
          ),
        },

        // Analytics & data (3 routes)
        {
          path: 'weekly-bars',
          element: (
            <SuspenseWrapper>
              <WeeklyBarsPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'heatmap-vibes',
          element: (
            <SuspenseWrapper>
              <HeatmapVibesPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'breathwork',
          element: (
            <SuspenseWrapper>
              <BreathworkPage />
            </SuspenseWrapper>
          ),
        },

        // Paramètres & compte (7 routes)
        {
          path: 'privacy-toggles',
          element: (
            <SuspenseWrapper>
              <PrivacyTogglesPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'export-csv',
          element: (
            <SuspenseWrapper>
              <ExportCSVPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'account/delete',
          element: (
            <SuspenseWrapper>
              <AccountDeletePage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'health-check-badge',
          element: (
            <SuspenseWrapper>
              <HealthCheckBadgePage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'notifications',
          element: (
            <SuspenseWrapper>
              <NotificationsPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'help-center',
          element: (
            <SuspenseWrapper>
              <HelpCenterPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'profile-settings',
          element: (
            <SuspenseWrapper>
              <ProfileSettingsPage />
            </SuspenseWrapper>
          ),
        },

        // Historique & feedback (2 routes)
        {
          path: 'activity-history',
          element: (
            <SuspenseWrapper>
              <ActivityHistoryPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'feedback',
          element: (
            <SuspenseWrapper>
              <FeedbackPage />
            </SuspenseWrapper>
          ),
        },
        
        // B2B Admin Features (8 routes)
        {
          path: 'teams',
          element: (
            <ProtectedRoute requiredRole="b2b_admin">
              <SuspenseWrapper>
                <TeamsPage />
              </SuspenseWrapper>
            </ProtectedRoute>
          ),
        },
        {
          path: 'reports',
          element: (
            <ProtectedRoute requiredRole="b2b_admin">
              <SuspenseWrapper>
                <ReportsPage />
              </SuspenseWrapper>
            </ProtectedRoute>
          ),
        },
        {
          path: 'events',
          element: (
            <ProtectedRoute requiredRole="b2b_admin">
              <SuspenseWrapper>
                <EventsPage />
              </SuspenseWrapper>
            </ProtectedRoute>
          ),
        },
        {
          path: 'optimisation',
          element: (
            <ProtectedRoute requiredRole="b2b_admin">
              <SuspenseWrapper>
                <OptimisationPage />
              </SuspenseWrapper>
            </ProtectedRoute>
          ),
        },
        {
          path: 'settings',
          element: (
            <ProtectedRoute requiredRole="b2b_admin">
              <SuspenseWrapper>
                <SettingsPage />
              </SuspenseWrapper>
            </ProtectedRoute>
          ),
        },
        {
          path: 'security',
          element: (
            <ProtectedRoute requiredRole="b2b_admin">
              <SuspenseWrapper>
                <SecurityPage />
              </SuspenseWrapper>
            </ProtectedRoute>
          ),
        },
        {
          path: 'audit',
          element: (
            <ProtectedRoute requiredRole="b2b_admin">
              <SuspenseWrapper>
                <AuditPage />
              </SuspenseWrapper>
            </ProtectedRoute>
          ),
        },
        {
          path: 'accessibility',
          element: (
            <ProtectedRoute requiredRole="b2b_admin">
              <SuspenseWrapper>
                <AccessibilityPage />
              </SuspenseWrapper>
            </ProtectedRoute>
          ),
        },
        
        // Catch all route
        {
          path: '*',
          element: <Navigate to="/" replace />,
        },
      ],
    },
  ];
};
