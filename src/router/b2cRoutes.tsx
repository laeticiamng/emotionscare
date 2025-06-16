import * as React from 'react';
import { LoadingIllustration } from '@/components/ui/loading-illustration';
import ProtectedRoute from '@/components/ProtectedRoute';

// Lazy loading des composants B2C existants
const B2COnboarding = React.lazy(() => import('@/pages/OnboardingPage'));
const B2CGamification = React.lazy(() => import('@/pages/GamificationPage'));
const B2CSocial = React.lazy(() => import('@/pages/SocialPage'));
const B2CResetPassword = React.lazy(() => import('@/pages/ResetPasswordPage'));

// Nouvelles pages pour l'audit de couverture
const BreathWeeklyPage = React.lazy(() => import('@/pages/stats/BreathWeeklyPage'));
const ScanWeeklyPage = React.lazy(() => import('@/pages/stats/ScanWeeklyPage'));
const VRWeeklyPage = React.lazy(() => import('@/pages/stats/VRWeeklyPage'));
const GamificationWeeklyPage = React.lazy(() => import('@/pages/stats/GamificationWeeklyPage'));
const PrivacyDashboardPage = React.lazy(() => import('@/pages/privacy/PrivacyDashboardPage'));

const withSuspense = (Component: React.ComponentType) => {
  return (props: any) => (
    <React.Suspense fallback={<LoadingIllustration />}>
      <Component {...props} />
    </React.Suspense>
  );
};

export const b2cRoutes = [
  // Routes B2C existantes
  {
    path: '/b2c/onboarding',
    element: (
      <ProtectedRoute requiredRole="b2c">
        {withSuspense(B2COnboarding)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2c/gamification',
    element: (
      <ProtectedRoute requiredRole="b2c">
        {withSuspense(B2CGamification)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2c/social',
    element: (
      <ProtectedRoute requiredRole="b2c">
        {withSuspense(B2CSocial)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2c/reset-password',
    element: withSuspense(B2CResetPassword)(),
  },
  // Nouvelles routes pour l'audit de couverture
  {
    path: '/b2c/stats/breath-weekly',
    element: (
      <ProtectedRoute requiredRole="b2c">
        {withSuspense(BreathWeeklyPage)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2c/stats/scan-weekly',
    element: (
      <ProtectedRoute requiredRole="b2c">
        {withSuspense(ScanWeeklyPage)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2c/stats/vr-weekly',
    element: (
      <ProtectedRoute requiredRole="b2c">
        {withSuspense(VRWeeklyPage)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2c/stats/gamification-weekly',
    element: (
      <ProtectedRoute requiredRole="b2c">
        {withSuspense(GamificationWeeklyPage)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2c/privacy-dashboard',
    element: (
      <ProtectedRoute requiredRole="b2c">
        {withSuspense(PrivacyDashboardPage)()}
      </ProtectedRoute>
    ),
  },
];

// Alias pour compatibilité
export const b2cMissingRoutes = b2cRoutes;