import * as React from 'react';
import { LoadingIllustration } from '@/components/ui/loading-illustration';
import ProtectedRoute from '@/components/ProtectedRoute';

// Lazy loading des composants B2C manquants
const B2COnboarding = React.lazy(() => import('@/pages/b2c/onboarding/OnboardingPage'));
const B2CGamification = React.lazy(() => import('@/pages/b2c/GamificationPage'));
const B2CSocial = React.lazy(() => import('@/pages/b2c/SocialPage'));
const B2CResetPassword = React.lazy(() => import('@/pages/b2c/ResetPasswordPage'));

const withSuspense = (Component: React.ComponentType) => {
  return (props: any) => (
    <React.Suspense fallback={<LoadingIllustration />}>
      <Component {...props} />
    </React.Suspense>
  );
};

export const b2cMissingRoutes = [
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
];