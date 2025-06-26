
import React, { Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';
import LoadingAnimation from '@/components/ui/loading-animation';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

// Lazy load all components for better performance
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const ChooseModePage = React.lazy(() => import('@/pages/ChooseModePage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const HelpPage = React.lazy(() => import('@/pages/HelpPage'));
const NotificationsPage = React.lazy(() => import('@/pages/NotificationsPage'));
const OnboardingPage = React.lazy(() => import('@/pages/OnboardingPage'));
const ForgotPasswordPage = React.lazy(() => import('@/pages/ForgotPasswordPage'));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'));

// B2C Pages
const B2CLoginPage = React.lazy(() => import('@/pages/b2c/LoginPage'));
const B2CRegisterPage = React.lazy(() => import('@/pages/b2c/RegisterPage'));
const B2CDashboardPage = React.lazy(() => import('@/pages/b2c/DashboardPage'));

// B2B Pages
const B2BUserLoginPage = React.lazy(() => import('@/pages/b2b/user/LoginPage'));
const B2BUserRegisterPage = React.lazy(() => import('@/pages/b2b/user/RegisterPage'));
const B2BUserDashboardPage = React.lazy(() => import('@/pages/b2b/user/DashboardPage'));
const B2BAdminLoginPage = React.lazy(() => import('@/pages/b2b/admin/LoginPage'));
const B2BAdminDashboardPage = React.lazy(() => import('@/pages/b2b/admin/DashboardPage'));
const B2BSelectionPage = React.lazy(() => import('@/pages/b2b/B2BSelectionPage'));

// Feature Pages
const ScanPage = React.lazy(() => import('@/pages/ScanPage'));
const MusicPage = React.lazy(() => import('@/pages/MusicPage'));
const CoachPage = React.lazy(() => import('@/pages/CoachPage'));
const JournalPage = React.lazy(() => import('@/pages/JournalPage'));
const VRPage = React.lazy(() => import('@/pages/VRPage'));
const GamificationPage = React.lazy(() => import('@/pages/GamificationPage'));
const SocialPage = React.lazy(() => import('@/pages/SocialPage'));
const ReportsPage = React.lazy(() => import('@/pages/ReportsPage'));

const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<LoadingAnimation text="Chargement de la page..." />}>
    {children}
  </Suspense>
);

export const buildUnifiedRoutes = (): RouteObject[] => [
  {
    path: UNIFIED_ROUTES.HOME,
    element: (
      <Layout>
        <SuspenseWrapper>
          <HomePage />
        </SuspenseWrapper>
      </Layout>
    ),
  },
  {
    path: UNIFIED_ROUTES.CHOOSE_MODE,
    element: (
      <SuspenseWrapper>
        <ChooseModePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: UNIFIED_ROUTES.B2B_SELECTION,
    element: (
      <SuspenseWrapper>
        <B2BSelectionPage />
      </SuspenseWrapper>
    ),
  },
  
  // Authentication Routes
  {
    path: UNIFIED_ROUTES.B2C_LOGIN,
    element: (
      <SuspenseWrapper>
        <B2CLoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: UNIFIED_ROUTES.B2C_REGISTER,
    element: (
      <SuspenseWrapper>
        <B2CRegisterPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: UNIFIED_ROUTES.B2B_USER_LOGIN,
    element: (
      <SuspenseWrapper>
        <B2BUserLoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: UNIFIED_ROUTES.B2B_USER_REGISTER,
    element: (
      <SuspenseWrapper>
        <B2BUserRegisterPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: UNIFIED_ROUTES.B2B_ADMIN_LOGIN,
    element: (
      <SuspenseWrapper>
        <B2BAdminLoginPage />
      </SuspenseWrapper>
    ),
  },
  
  // New Authentication Pages
  {
    path: '/forgot-password',
    element: (
      <SuspenseWrapper>
        <ForgotPasswordPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <SuspenseWrapper>
        <ForgotPasswordPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <OnboardingPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  
  // Dashboard Routes
  {
    path: UNIFIED_ROUTES.B2C_DASHBOARD,
    element: (
      <ProtectedRoute requiredRole="b2c">
        <Layout>
          <SuspenseWrapper>
            <B2CDashboardPage />
          </SuspenseWrapper>
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: UNIFIED_ROUTES.B2B_USER_DASHBOARD,
    element: (
      <ProtectedRoute requiredRole="b2b_user">
        <Layout>
          <SuspenseWrapper>
            <B2BUserDashboardPage />
          </SuspenseWrapper>
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: UNIFIED_ROUTES.B2B_ADMIN_DASHBOARD,
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        <Layout>
          <SuspenseWrapper>
            <B2BAdminDashboardPage />
          </SuspenseWrapper>
        </Layout>
      </ProtectedRoute>
    ),
  },
  
  // Feature Routes - Available to all authenticated users
  {
    path: UNIFIED_ROUTES.SCAN,
    element: (
      <ProtectedRoute>
        <Layout>
          <SuspenseWrapper>
            <ScanPage />
          </SuspenseWrapper>
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: UNIFIED_ROUTES.MUSIC,
    element: (
      <ProtectedRoute>
        <Layout>
          <SuspenseWrapper>
            <MusicPage />
          </SuspenseWrapper>
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: UNIFIED_ROUTES.COACH,
    element: (
      <ProtectedRoute>
        <Layout>
          <SuspenseWrapper>
            <CoachPage />
          </SuspenseWrapper>
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: UNIFIED_ROUTES.JOURNAL,
    element: (
      <ProtectedRoute>
        <Layout>
          <SuspenseWrapper>
            <JournalPage />
          </SuspenseWrapper>
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: UNIFIED_ROUTES.VR,
    element: (
      <ProtectedRoute>
        <Layout>
          <SuspenseWrapper>
            <VRPage />
          </SuspenseWrapper>
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: UNIFIED_ROUTES.GAMIFICATION,
    element: (
      <ProtectedRoute>
        <Layout>
          <SuspenseWrapper>
            <GamificationPage />
          </SuspenseWrapper>
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: UNIFIED_ROUTES.SOCIAL_COCON,
    element: (
      <ProtectedRoute>
        <Layout>
          <SuspenseWrapper>
            <SocialPage />
          </SuspenseWrapper>
        </Layout>
      </ProtectedRoute>
    ),
  },
  
  // System Pages - Available to all authenticated users
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Layout>
          <SuspenseWrapper>
            <ProfilePage />
          </SuspenseWrapper>
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/help',
    element: (
      <Layout>
        <SuspenseWrapper>
          <HelpPage />
        </SuspenseWrapper>
      </Layout>
    ),
  },
  {
    path: '/notifications',
    element: (
      <ProtectedRoute>
        <Layout>
          <SuspenseWrapper>
            <NotificationsPage />
          </SuspenseWrapper>
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: UNIFIED_ROUTES.SETTINGS,
    element: (
      <ProtectedRoute>
        <Layout>
          <SuspenseWrapper>
            <SettingsPage />
          </SuspenseWrapper>
        </Layout>
      </ProtectedRoute>
    ),
  },
  
  // Admin Routes
  {
    path: UNIFIED_ROUTES.REPORTS,
    element: (
      <ProtectedRoute allowedRoles={['b2b_admin']}>
        <Layout>
          <SuspenseWrapper>
            <ReportsPage />
          </SuspenseWrapper>
        </Layout>
      </ProtectedRoute>
    ),
  },
  
  // Catch-all route for 404
  {
    path: '*',
    element: (
      <Layout>
        <div className="container mx-auto p-6 text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-muted-foreground mb-4">Page non trouvée</p>
          <a href="/" className="text-blue-500 hover:underline">
            Retour à l'accueil
          </a>
        </div>
      </Layout>
    ),
  },
];
