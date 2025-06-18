import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import GuestRoute from '@/components/auth/GuestRoute';

// Layouts
const Shell = lazy(() => import('@/Shell'));

// Pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const UserDashboard = lazy(() => import('@/pages/dashboard/UserDashboard'));
const B2BAdminDashboard = lazy(() => import('@/pages/dashboard/B2BAdminDashboard'));
const AuditPage = lazy(() => import('@/pages/audit/AuditPage'));
const PreferencesPage = lazy(() => import('@/pages/preferences/PreferencesPage'));
const ScanPage = lazy(() => import('@/pages/scan/ScanPage'));
const MusicPage = lazy(() => import('@/pages/music/MusicPage'));
const JournalPage = lazy(() => import('@/pages/journal/JournalPage'));
const CoachPage = lazy(() => import('@/pages/coach/CoachPage'));
const VRPage = lazy(() => import('@/pages/vr/VRPage'));
const CommunityPage = lazy(() => import('@/pages/community/CommunityPage'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));
const AccountPage = lazy(() => import('@/pages/settings/AccountPage'));
const SecurityPage = lazy(() => import('@/pages/settings/SecurityPage'));
const NotificationsPage = lazy(() => import('@/pages/settings/NotificationsPage'));
const AppearancePage = lazy(() => import('@/pages/settings/AppearancePage'));
const Error404Page = lazy(() => import('@/pages/errors/Error404Page'));
const ErrorBoundaryPage = lazy(() => import('@/pages/errors/ErrorBoundaryPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage'));
const TermsOfServicePage = lazy(() => import('@/pages/legal/TermsOfServicePage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/legal/PrivacyPolicyPage'));
const PricingPage = lazy(() => import('@/pages/pricing/PricingPage'));
const ContactPage = lazy(() => import('@/pages/contact/ContactPage'));
const AboutPage = lazy(() => import('@/pages/about/AboutPage'));
const B2BUserDashboard = lazy(() => import('@/pages/dashboard/B2BUserDashboard'));

import { gamificationRoutes } from './routes/gamificationRoutes';

export const createAppRoutes = (): RouteObject[] => [
  {
    path: '/',
    element: <Shell />,
    children: [
      // Public routes
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      {
        path: 'pricing',
        element: <PricingPage />,
      },
      {
        path: 'terms',
        element: <TermsOfServicePage />,
      },
      {
        path: 'privacy',
        element: <PrivacyPolicyPage />,
      },

      // Auth routes
      {
        path: '',
        element: <GuestRoute />,
        children: [
          {
            path: 'login',
            element: <LoginPage />,
          },
          {
            path: 'register',
            element: <RegisterPage />,
          },
          {
            path: 'forgot-password',
            element: <ForgotPasswordPage />,
          },
          {
            path: 'reset-password',
            element: <ResetPasswordPage />,
          },
          {
            path: 'verify-email',
            element: <VerifyEmailPage />,
          },
        ],
      },
      
      // Protected routes
      {
        path: '',
        element: <ProtectedRoute />,
        children: [
          // Dashboard routes
          {
            path: 'dashboard',
            element: <DashboardPage />,
            children: [
              {
                index: true,
                element: <UserDashboard />,
              },
              {
                path: 'b2b/user',
                element: <B2BUserDashboard />,
              },
              {
                path: 'b2b/admin/dashboard',
                element: <B2BAdminDashboard />,
              },
            ],
          },

          // Module routes
          {
            path: 'scan',
            element: <ScanPage />,
          },
          {
            path: 'music',
            element: <MusicPage />,
          },
          {
            path: 'journal',
            element: <JournalPage />,
          },
          {
            path: 'coach',
            element: <CoachPage />,
          },
          {
            path: 'vr',
            element: <VRPage />,
          },
          {
            path: 'community',
            element: <CommunityPage />,
          },
          {
            path: 'audit',
            element: <AuditPage />,
          },
          {
            path: 'preferences',
            element: <PreferencesPage />,
          },
          
          // Gamification routes
          ...gamificationRoutes,
          
          // Settings routes
          {
            path: 'settings',
            element: <SettingsPage />,
            children: [
              {
                index: true,
                element: <AccountPage />,
              },
              {
                path: 'security',
                element: <SecurityPage />,
              },
              {
                path: 'notifications',
                element: <NotificationsPage />,
              },
              {
                path: 'appearance',
                element: <AppearancePage />,
              },
            ],
          },
        ]
      },
      
      // Error routes
      {
        path: 'error',
        element: <ErrorBoundaryPage />,
      },
      {
        path: '*',
        element: <Error404Page />,
      },
    ]
  }
];
