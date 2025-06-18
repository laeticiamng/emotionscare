
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));

export const onboardingRoutes: RouteObject[] = [
  {
    path: '/onboarding',
    element: <OnboardingPage />,
  },
];
