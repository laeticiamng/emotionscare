
import { lazy, Suspense } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { dashboardRoutes } from './routes/dashboardRoutes';
import OptimizedErrorBoundary from '@/components/ErrorBoundary/OptimizedErrorBoundary';

// Lazy load components to avoid build errors
const HomePage = lazy(() => import('@/pages/HomePage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const B2BSelectionPage = lazy(() => import('@/pages/b2b/B2BSelectionPage'));

// Auth pages
const B2CLoginPage = lazy(() => import('@/pages/b2c/auth/B2CLoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/b2c/auth/B2CRegisterPage'));
const B2BUserLoginPage = lazy(() => import('@/pages/b2b/user/auth/B2BUserLoginPage'));
const B2BUserRegisterPage = lazy(() => import('@/pages/b2b/user/auth/B2BUserRegisterPage'));
const B2BAdminLoginPage = lazy(() => import('@/pages/b2b/admin/auth/B2BAdminLoginPage'));

// Feature pages
const ScanPage = lazy(() => import('@/pages/features/ScanPage'));
const MusicPage = lazy(() => import('@/pages/features/MusicPage'));
const CoachPage = lazy(() => import('@/pages/features/CoachPage'));
const JournalPage = lazy(() => import('@/pages/features/JournalPage'));
const VRPage = lazy(() => import('@/pages/features/VRPage'));
const PreferencesPage = lazy(() => import('@/pages/features/PreferencesPage'));
const GamificationPage = lazy(() => import('@/pages/features/GamificationPage'));
const SocialCoconPage = lazy(() => import('@/pages/features/SocialCoconPage'));

// B2B Admin pages
const TeamsPage = lazy(() => import('@/pages/b2b/admin/TeamsPage'));
const ReportsPage = lazy(() => import('@/pages/b2b/admin/ReportsPage'));
const EventsPage = lazy(() => import('@/pages/b2b/admin/EventsPage'));
const OptimisationPage = lazy(() => import('@/pages/b2b/admin/OptimisationPage'));
const SettingsPage = lazy(() => import('@/pages/b2b/admin/SettingsPage'));

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
      element: <Layout />,
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
        
        // B2B Admin Features
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
        
        // Catch all route
        {
          path: '*',
          element: <Navigate to="/" replace />,
        },
      ],
    },
  ];
};
