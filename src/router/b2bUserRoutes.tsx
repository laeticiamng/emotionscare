import * as React from 'react';
import { LoadingIllustration } from '@/components/ui/loading-illustration';
import ProtectedRoute from '@/components/ProtectedRoute';

// Lazy loading des composants B2B User
const B2BUserJournal = React.lazy(() => import('@/pages/b2b/user/Journal'));
const B2BUserMusic = React.lazy(() => import('@/pages/b2b/user/Music'));
const B2BUserScan = React.lazy(() => import('@/pages/b2b/user/Scan'));
const B2BUserCoach = React.lazy(() => import('@/pages/b2b/user/Coach'));
const B2BUserVR = React.lazy(() => import('@/pages/b2b/user/VR'));
const B2BUserGamification = React.lazy(() => import('@/pages/b2b/user/Gamification'));
const B2BUserCocon = React.lazy(() => import('@/pages/b2b/user/Cocon'));
const B2BUserSettings = React.lazy(() => import('@/pages/b2b/user/Settings'));
const B2BUserSocial = React.lazy(() => import('@/pages/b2b/user/social/SocialPage'));
const B2BUserTeamChallenges = React.lazy(() => import('@/pages/b2b/user/TeamChallenges'));

const withSuspense = (Component: React.ComponentType) => {
  return (props: any) => (
    <React.Suspense fallback={<LoadingIllustration />}>
      <Component {...props} />
    </React.Suspense>
  );
};

export const b2bUserRoutes = [
  {
    path: '/b2b/user/journal',
    element: (
      <ProtectedRoute requiredRole="b2b_user">
        {withSuspense(B2BUserJournal)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2b/user/music',
    element: (
      <ProtectedRoute requiredRole="b2b_user">
        {withSuspense(B2BUserMusic)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2b/user/scan',
    element: (
      <ProtectedRoute requiredRole="b2b_user">
        {withSuspense(B2BUserScan)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2b/user/coach',
    element: (
      <ProtectedRoute requiredRole="b2b_user">
        {withSuspense(B2BUserCoach)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2b/user/vr',
    element: (
      <ProtectedRoute requiredRole="b2b_user">
        {withSuspense(B2BUserVR)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2b/user/gamification',
    element: (
      <ProtectedRoute requiredRole="b2b_user">
        {withSuspense(B2BUserGamification)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2b/user/cocon',
    element: (
      <ProtectedRoute requiredRole="b2b_user">
        {withSuspense(B2BUserCocon)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2b/user/settings',
    element: (
      <ProtectedRoute requiredRole="b2b_user">
        {withSuspense(B2BUserSettings)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2b/user/social',
    element: (
      <ProtectedRoute requiredRole="b2b_user">
        {withSuspense(B2BUserSocial)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2b/user/team-challenges',
    element: (
      <ProtectedRoute requiredRole="b2b_user">
        {withSuspense(B2BUserTeamChallenges)()}
      </ProtectedRoute>
    ),
  },
];