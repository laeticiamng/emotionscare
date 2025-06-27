import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import PageAccessGuard from '@/components/access/PageAccessGuard';

// Lazy load pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));

// B2C Pages
const B2CLoginPage = lazy(() => import('@/pages/b2c/B2CLoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/b2c/B2CRegisterPage'));
const B2CDashboardPage = lazy(() => import('@/pages/b2c/B2CDashboardPage'));

// B2B Pages
const B2BSelectionPage = lazy(() => import('@/pages/b2b/B2BSelectionPage'));
const B2BUserLoginPage = lazy(() => import('@/pages/b2b/B2BUserLoginPage'));
const B2BAdminLoginPage = lazy(() => import('@/pages/b2b/B2BAdminLoginPage'));
const B2BUserDashboard = lazy(() => import('@/pages/b2b/B2BUserDashboard'));
const B2BAdminDashboard = lazy(() => import('@/pages/b2b/B2BAdminDashboard'));

// Feature Pages
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const VRPage = lazy(() => import('@/pages/VRPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));
const PreferencesPage = lazy(() => import('@/pages/PreferencesPage'));
const GamificationPage = lazy(() => import('@/pages/GamificationPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));

// New Ambition & Progression Pages
const AmbitionArcadePage = lazy(() => import('@/pages/AmbitionArcadePage'));
const WeeklyBarsPage = lazy(() => import('@/pages/WeeklyBarsPage'));
const HeatmapVibesPage = lazy(() => import('@/pages/HeatmapVibesPage'));

// New User Spaces Pages
const SocialCoconPage = lazy(() => import('@/pages/SocialCoconPage'));
const ProfileSettingsPage = lazy(() => import('@/pages/ProfileSettingsPage'));
const ActivityHistoryPage = lazy(() => import('@/pages/ActivityHistoryPage'));

// Admin Pages
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const SecurityPage = lazy(() => import('@/pages/SecurityPage'));
const SystemAuditPage = lazy(() => import('@/pages/SystemAuditPage'));
const AccessibilityPage = lazy(() => import('@/pages/AccessibilityPage'));
const InnovationLabPage = lazy(() => import('@/pages/InnovationLabPage'));
const FeedbackPage = lazy(() => import('@/pages/FeedbackPage'));
const PrivacyDashboardPage = lazy(() => import('@/pages/PrivacyDashboardPage'));

export const buildUnifiedRoutes = (): RouteObject[] => {
  console.log('🔧 Building unified routes...');

  return [
    // Layout wrapper
    {
      path: '/',
      element: <Layout />,
      children: [
        // Public routes
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'choose-mode',
          element: <ChooseModePage />,
        },
        {
          path: 'auth',
          element: <AuthPage />,
        },
        {
          path: 'onboarding',
          element: <OnboardingPage />,
        },

        // B2C Routes
        {
          path: 'b2c/login',
          element: <B2CLoginPage />,
        },
        {
          path: 'b2c/register',
          element: <B2CRegisterPage />,
        },
        {
          path: 'b2c/dashboard',
          element: (
            <ProtectedRoute>
              <B2CDashboardPage />
            </ProtectedRoute>
          ),
        },

        // B2B Routes
        {
          path: 'b2b/selection',
          element: <B2BSelectionPage />,
        },
        {
          path: 'b2b/user/login',
          element: <B2BUserLoginPage />,
        },
        {
          path: 'b2b/admin/login',
          element: <B2BAdminLoginPage />,
        },
        {
          path: 'b2b/user/dashboard',
          element: (
            <ProtectedRoute>
              <B2BUserDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: 'b2b/admin/dashboard',
          element: (
            <ProtectedRoute allowedRoles={['b2b_admin']}>
              <B2BAdminDashboard />
            </ProtectedRoute>
          ),
        },

        // Feature Routes
        {
          path: 'scan',
          element: (
            <ProtectedRoute>
              <ScanPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'music',
          element: (
            <ProtectedRoute>
              <MusicPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'vr',
          element: (
            <ProtectedRoute>
              <VRPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'coach',
          element: (
            <ProtectedRoute>
              <CoachPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'journal',
          element: (
            <ProtectedRoute>
              <JournalPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'preferences',
          element: (
            <ProtectedRoute>
              <PreferencesPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'gamification',
          element: (
            <ProtectedRoute>
              <GamificationPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'notifications',
          element: (
            <ProtectedRoute>
              <PageAccessGuard>
                <NotificationsPage />
              </PageAccessGuard>
            </ProtectedRoute>
          ),
        },

        // New Ambition & Progression routes
        {
          path: 'ambition-arcade',
          element: (
            <ProtectedRoute>
              <AmbitionArcadePage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'weekly-bars', 
          element: (
            <ProtectedRoute>
              <WeeklyBarsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'heatmap-vibes',
          element: (
            <ProtectedRoute>
              <HeatmapVibesPage />
            </ProtectedRoute>
          ),
        },

        // New User Spaces routes
        {
          path: 'social-cocon',
          element: (
            <ProtectedRoute>
              <SocialCoconPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'profile-settings',
          element: (
            <ProtectedRoute>
              <ProfileSettingsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'activity-history',
          element: (
            <ProtectedRoute>
              <ActivityHistoryPage />
            </ProtectedRoute>
          ),
        },

        // Admin Routes
        {
          path: 'reports',
          element: (
            <ProtectedRoute>
              <PageAccessGuard>
                <ReportsPage />
              </PageAccessGuard>
            </ProtectedRoute>
          ),
        },
        {
          path: 'security',
          element: (
            <ProtectedRoute>
              <SecurityPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'audit',
          element: (
            <ProtectedRoute allowedRoles={['b2b_admin']}>
              <PageAccessGuard>
                <SystemAuditPage />
              </PageAccessGuard>
            </ProtectedRoute>
          ),
        },
        {
          path: 'accessibility',
          element: (
            <ProtectedRoute>
              <PageAccessGuard>
                <AccessibilityPage />
              </PageAccessGuard>
            </ProtectedRoute>
          ),
        },
        {
          path: 'innovation',
          element: (
            <ProtectedRoute>
              <PageAccessGuard>
                <InnovationLabPage />
              </PageAccessGuard>
            </ProtectedRoute>
          ),
        },
        {
          path: 'feedback',
          element: (
            <ProtectedRoute>
              <PageAccessGuard>
                <FeedbackPage />
              </PageAccessGuard>
            </ProtectedRoute>
          ),
        },
        {
          path: 'privacy',
          element: (
            <ProtectedRoute>
              <PageAccessGuard>
                <PrivacyDashboardPage />
              </PageAccessGuard>
            </ProtectedRoute>
          ),
        },

        // Catch-all route
        {
          path: '*',
          element: <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Page non trouvée</h1>
              <p className="text-gray-600">Cette route n'existe pas encore.</p>
            </div>
          </div>,
        },
      ],
    },
  ];
};
