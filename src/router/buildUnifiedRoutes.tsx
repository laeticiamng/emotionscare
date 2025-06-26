import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { homeRoutes } from './routes/homeRoutes';
import { userRoutes } from './routes/userRoutes';

// Lazy load pages
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));
const VRPage = lazy(() => import('@/pages/VRPage'));
const PreferencesPage = lazy(() => import('@/pages/PreferencesPage'));
const GamificationPage = lazy(() => import('@/pages/GamificationPage'));
const SocialCoconPage = lazy(() => import('@/pages/SocialCoconPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const AuthCallbackPage = lazy(() => import('@/pages/AuthCallbackPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const B2BSelectionPage = lazy(() => import('@/pages/B2BSelectionPage'));

// B2C Pages
const B2CLoginPage = lazy(() => import('@/pages/b2c/LoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/b2c/RegisterPage'));
const B2CDashboardPage = lazy(() => import('@/pages/b2c/DashboardPage'));

// B2B Pages
const B2BUserLoginPage = lazy(() => import('@/pages/b2b/user/LoginPage'));
const B2BUserRegisterPage = lazy(() => import('@/pages/b2b/user/RegisterPage'));
const B2BUserDashboardPage = lazy(() => import('@/pages/b2b/user/DashboardPage'));
const B2BAdminLoginPage = lazy(() => import('@/pages/b2b/admin/LoginPage'));
const B2BAdminDashboardPage = lazy(() => import('@/pages/b2b/admin/DashboardPage'));

// Add new lazy loaded pages
const BreathworkPage = lazy(() => import('@/pages/BreathworkPage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
const FlashGlowPage = lazy(() => import('@/pages/FlashGlowPage'));
const ProfileSettingsPage = lazy(() => import('@/pages/ProfileSettingsPage'));

export function buildUnifiedRoutes(): RouteObject[] {
  return [
    // Home routes
    ...homeRoutes,
    
    // User routes (B2C, B2B)
    ...userRoutes,
    
    // B2C routes
    {
      path: '/b2c/login',
      element: <B2CLoginPage />,
    },
    {
      path: '/b2c/register',
      element: <B2CRegisterPage />,
    },
    {
      path: '/b2c/dashboard',
      element: <B2CDashboardPage />,
    },
    
    // B2B Selection
    {
      path: '/b2b/selection',
      element: <B2BSelectionPage />,
    },
    
    // B2B User routes
    {
      path: '/b2b/user/login',
      element: <B2BUserLoginPage />,
    },
    {
      path: '/b2b/user/register',
      element: <B2BUserRegisterPage />,
    },
    {
      path: '/b2b/user/dashboard',
      element: <B2BUserDashboardPage />,
    },
    
    // B2B Admin routes
    {
      path: '/b2b/admin/login',
      element: <B2BAdminLoginPage />,
    },
    {
      path: '/b2b/admin/dashboard',
      element: <B2BAdminDashboardPage />,
    },
    
    // Feature routes
    {
      path: '/scan',
      element: <ScanPage />,
    },
    {
      path: '/music',
      element: <MusicPage />,
    },
    {
      path: '/coach',
      element: <CoachPage />,
    },
    {
      path: '/journal',
      element: <JournalPage />,
    },
    {
      path: '/vr',
      element: <VRPage />,
    },
    {
      path: '/preferences',
      element: <PreferencesPage />,
    },
    {
      path: '/gamification',
      element: <GamificationPage />,
    },
    {
      path: '/social-cocon',
      element: <SocialCoconPage />,
    },
    
    // New feature routes
    {
      path: '/breathwork',
      element: <BreathworkPage />,
    },
    {
      path: '/onboarding',
      element: <OnboardingPage />,
    },
    {
      path: '/flash-glow',
      element: <FlashGlowPage />,
    },
    {
      path: '/profile-settings',
      element: <ProfileSettingsPage />,
    },
    
    // System routes
    {
      path: '/auth/callback',
      element: <AuthCallbackPage />,
    },
    {
      path: '/reset-password',
      element: <ResetPasswordPage />,
    },
    
    // Catch all 404
    {
      path: '*',
      element: <NotFoundPage />,
    }
  ];
}

// Export route manifest for testing
export const ROUTE_MANIFEST = [
  '/',
  '/choose-mode',
  '/auth',
  '/onboarding',
  '/b2c/login',
  '/b2c/register',
  '/b2c/dashboard',
  '/b2b/selection',
  '/b2b/user/login',
  '/b2b/user/register',
  '/b2b/user/dashboard',
  '/b2b/admin/login',
  '/b2b/admin/dashboard',
  '/scan',
  '/music',
  '/coach',
  '/journal',
  '/vr',
  '/preferences',
  '/gamification',
  '/social-cocon',
  '/breathwork',
  '/flash-glow',
  '/profile-settings',
  '/auth/callback',
  '/reset-password'
];
