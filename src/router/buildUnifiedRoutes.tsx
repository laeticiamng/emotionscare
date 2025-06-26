
import React from 'react';
import { RouteObject } from 'react-router-dom';
import OptimizedLayout from '@/components/layout/OptimizedLayout';
import AuthGuard from '@/components/auth/AuthGuard';

// Import des pages
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const ChooseModePage = React.lazy(() => import('@/pages/ChooseModePage'));
const B2BSelectionPage = React.lazy(() => import('@/pages/B2BSelectionPage'));
const B2CLoginPage = React.lazy(() => import('@/pages/auth/B2CLoginPage'));
const B2CRegisterPage = React.lazy(() => import('@/pages/auth/B2CRegisterPage'));
const B2BUserLoginPage = React.lazy(() => import('@/pages/auth/B2BUserLoginPage'));
const B2BUserRegisterPage = React.lazy(() => import('@/pages/auth/B2BUserRegisterPage'));
const B2BAdminLoginPage = React.lazy(() => import('@/pages/auth/B2BAdminLoginPage'));
const B2CDashboardPage = React.lazy(() => import('@/pages/dashboards/B2CDashboardPage'));
const B2BUserDashboardPage = React.lazy(() => import('@/pages/dashboards/B2BUserDashboardPage'));
const B2BAdminDashboardPage = React.lazy(() => import('@/pages/dashboards/B2BAdminDashboardPage'));
const HelpCenterPage = React.lazy(() => import('@/pages/HelpCenterPage'));
const ScanPage = React.lazy(() => import('@/pages/ScanPage'));
const MusicPage = React.lazy(() => import('@/pages/MusicPage'));
const CoachPage = React.lazy(() => import('@/pages/CoachPage'));
const JournalPage = React.lazy(() => import('@/pages/JournalPage'));
const VRPage = React.lazy(() => import('@/pages/VRPage'));
const GamificationPage = React.lazy(() => import('@/pages/GamificationPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'));
const NotificationsPage = React.lazy(() => import('@/pages/NotificationsPage'));

// 404 Page
const NotFoundPage = () => (
  <div data-testid="page-root" className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page introuvable</h1>
      <p className="text-gray-600 mb-8">La page que vous recherchez n'existe pas.</p>
      <a href="/" className="text-blue-600 hover:text-blue-700 underline">
        Retour à l'accueil
      </a>
    </div>
  </div>
);

// Manifeste des routes pour les tests
export const ROUTE_MANIFEST = [
  '/',
  '/choose-mode',
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
  '/gamification',
  '/profile',
  '/settings',
  '/notifications',
  '/help-center'
];

export const buildUnifiedRoutes = (): RouteObject[] => {
  return [
    {
      path: '/',
      element: (
        <AuthGuard>
          <OptimizedLayout />
        </AuthGuard>
      ),
      children: [
        {
          index: true,
          element: <HomePage />
        },
        {
          path: 'choose-mode',
          element: <ChooseModePage />
        },
        {
          path: 'b2c/login',
          element: <B2CLoginPage />
        },
        {
          path: 'b2c/register',
          element: <B2CRegisterPage />
        },
        {
          path: 'b2c/dashboard',
          element: <B2CDashboardPage />
        },
        {
          path: 'b2b/selection',
          element: <B2BSelectionPage />
        },
        {
          path: 'b2b/user/login',
          element: <B2BUserLoginPage />
        },
        {
          path: 'b2b/user/register',
          element: <B2BUserRegisterPage />
        },
        {
          path: 'b2b/user/dashboard',
          element: <B2BUserDashboardPage />
        },
        {
          path: 'b2b/admin/login',
          element: <B2BAdminLoginPage />
        },
        {
          path: 'b2b/admin/dashboard',
          element: <B2BAdminDashboardPage />
        },
        {
          path: 'scan',
          element: <ScanPage />
        },
        {
          path: 'music',
          element: <MusicPage />
        },
        {
          path: 'coach',
          element: <CoachPage />
        },
        {
          path: 'journal',
          element: <JournalPage />
        },
        {
          path: 'vr',
          element: <VRPage />
        },
        {
          path: 'gamification',
          element: <GamificationPage />
        },
        {
          path: 'profile',
          element: <ProfilePage />
        },
        {
          path: 'settings',
          element: <SettingsPage />
        },
        {
          path: 'notifications',
          element: <NotificationsPage />
        },
        {
          path: 'help-center',
          element: <HelpCenterPage />
        },
        {
          path: '*',
          element: <NotFoundPage />
        }
      ]
    }
  ];
};
