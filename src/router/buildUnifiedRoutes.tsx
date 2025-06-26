
import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Pages principales
const HomePage = lazy(() => import('@/pages/HomePage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));

// Pages d'authentification
const B2CLoginPage = lazy(() => import('@/pages/auth/B2CLoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/auth/B2CRegisterPage'));
const B2BUserLoginPage = lazy(() => import('@/pages/auth/B2BUserLoginPage'));
const B2BUserRegisterPage = lazy(() => import('@/pages/auth/B2BUserRegisterPage'));
const B2BAdminLoginPage = lazy(() => import('@/pages/auth/B2BAdminLoginPage'));

// Dashboards
const B2CDashboardPage = lazy(() => import('@/pages/dashboards/B2CDashboardPage'));
const B2BUserDashboardPage = lazy(() => import('@/pages/dashboards/B2BUserDashboardPage'));
const B2BAdminDashboardPage = lazy(() => import('@/pages/dashboards/B2BAdminDashboardPage'));

// Pages fonctionnelles
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));
const VRPage = lazy(() => import('@/pages/VRPage'));
const PreferencesPage = lazy(() => import('@/pages/PreferencesPage'));
const GamificationPage = lazy(() => import('@/pages/GamificationPage'));
const SocialCoconPage = lazy(() => import('@/pages/SocialCoconPage'));

// Pages admin
const TeamsPage = lazy(() => import('@/pages/TeamsPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const EventsPage = lazy(() => import('@/pages/EventsPage'));
const OptimisationPage = lazy(() => import('@/pages/OptimisationPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));

// Page 404
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export const ROUTE_MANIFEST = [
  '/',
  '/choose-mode',
  '/b2c/login',
  '/b2c/register',
  '/b2b/user/login',
  '/b2b/user/register',
  '/b2b/admin/login',
  '/b2c/dashboard',
  '/b2b/user/dashboard',
  '/b2b/admin/dashboard',
  '/scan',
  '/music',
  '/coach',
  '/journal',
  '/vr',
  '/preferences',
  '/gamification',
  '/social-cocon',
  '/teams',
  '/reports',
  '/events',
  '/optimisation',
  '/settings'
];

export function buildUnifiedRoutes(): RouteObject[] {
  return [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'choose-mode',
          element: <ChooseModePage />,
        },
        
        // Routes d'authentification
        {
          path: 'b2c/login',
          element: <B2CLoginPage />,
        },
        {
          path: 'b2c/register',
          element: <B2CRegisterPage />,
        },
        {
          path: 'b2b/user/login',
          element: <B2BUserLoginPage />,
        },
        {
          path: 'b2b/user/register',
          element: <B2BUserRegisterPage />,
        },
        {
          path: 'b2b/admin/login',
          element: <B2BAdminLoginPage />,
        },
        
        // Dashboards protégés
        {
          path: 'b2c/dashboard',
          element: (
            <ProtectedRoute requiredRole="b2c">
              <B2CDashboardPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'b2b/user/dashboard',
          element: (
            <ProtectedRoute requiredRole="b2b_user">
              <B2BUserDashboardPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'b2b/admin/dashboard',
          element: (
            <ProtectedRoute requiredRole="b2b_admin">
              <B2BAdminDashboardPage />
            </ProtectedRoute>
          ),
        },
        
        // Pages fonctionnelles protégées
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
          path: 'vr',
          element: (
            <ProtectedRoute>
              <VRPage />
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
          path: 'social-cocon',
          element: (
            <ProtectedRoute>
              <SocialCoconPage />
            </ProtectedRoute>
          ),
        },
        
        // Pages admin protégées
        {
          path: 'teams',
          element: (
            <ProtectedRoute requiredRole="b2b_admin">
              <TeamsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'reports',
          element: (
            <ProtectedRoute requiredRole="b2b_admin">
              <ReportsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'events',
          element: (
            <ProtectedRoute requiredRole="b2b_admin">
              <EventsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'optimisation',
          element: (
            <ProtectedRoute>
              <OptimisationPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'settings',
          element: (
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          ),
        },
        
        // Page 404
        {
          path: '*',
          element: <NotFoundPage />,
        },
      ],
    },
  ];
}
