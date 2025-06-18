
import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import B2CLayout from '@/layouts/B2CLayout';
import B2BLayout from '@/layouts/B2BLayout';

// Pages publiques
import ImmersiveHome from '@/pages/ImmersiveHome';
import ChooseModePage from '@/pages/ChooseModePage';
import B2BSelectionPage from '@/pages/B2BSelectionPage';

// Pages d'authentification
import B2CLoginPage from '@/pages/auth/B2CLoginPage';
import B2CRegisterPage from '@/pages/auth/B2CRegisterPage';
import B2BUserLoginPage from '@/pages/auth/B2BUserLoginPage';
import B2BUserRegisterPage from '@/pages/auth/B2BUserRegisterPage';
import B2BAdminLoginPage from '@/pages/auth/B2BAdminLoginPage';

// Pages de tableau de bord
import B2CDashboardPage from '@/pages/dashboard/B2CDashboardPage';
import B2BUserDashboardPage from '@/pages/dashboard/B2BUserDashboardPage';
import B2BAdminDashboardPage from '@/pages/dashboard/B2BAdminDashboardPage';

// Pages de fonctionnalités communes (routes uniques)
import ScanPage from '@/pages/ScanPage';
import MusicPage from '@/pages/MusicPage';
import CoachPage from '@/pages/CoachPage';
import CoachChatPage from '@/pages/CoachChatPage';
import JournalPage from '@/pages/JournalPage';
import VRPage from '@/pages/VRPage';
import SettingsPage from '@/pages/SettingsPage';
import PreferencesPage from '@/pages/PreferencesPage';
import GamificationPage from '@/pages/GamificationPage';
import SocialCoconPage from '@/pages/SocialCoconPage';

// Pages administrateur uniquement
import TeamsPage from '@/pages/TeamsPage';
import ReportsPage from '@/pages/ReportsPage';
import EventsPage from '@/pages/EventsPage';
import OptimisationPage from '@/pages/OptimisationPage';

export const router = createBrowserRouter([
  // Routes publiques
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ImmersiveHome />
      },
      {
        path: 'choose-mode',
        element: <ChooseModePage />
      },
      {
        path: 'b2b/selection',
        element: <B2BSelectionPage />
      }
    ]
  },
  
  // Routes d'authentification B2C
  {
    path: '/b2c',
    children: [
      {
        path: 'login',
        element: <B2CLoginPage />
      },
      {
        path: 'register',
        element: <B2CRegisterPage />
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute requiredRole="b2c">
            <B2CLayout>
              <B2CDashboardPage />
            </B2CLayout>
          </ProtectedRoute>
        )
      }
    ]
  },
  
  // Routes d'authentification B2B User
  {
    path: '/b2b/user',
    children: [
      {
        path: 'login',
        element: <B2BUserLoginPage />
      },
      {
        path: 'register',
        element: <B2BUserRegisterPage />
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute requiredRole="b2b_user">
            <B2BLayout>
              <B2BUserDashboardPage />
            </B2BLayout>
          </ProtectedRoute>
        )
      }
    ]
  },
  
  // Routes d'authentification B2B Admin
  {
    path: '/b2b/admin',
    children: [
      {
        path: 'login',
        element: <B2BAdminLoginPage />
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute requiredRole="b2b_admin">
            <B2BLayout>
              <B2BAdminDashboardPage />
            </B2BLayout>
          </ProtectedRoute>
        )
      }
    ]
  },
  
  // ROUTES COMMUNES - CHEMINS UNIQUES POUR TOUTES LES FONCTIONNALITÉS
  {
    path: '/scan',
    element: (
      <ProtectedRoute>
        <Layout>
          <ScanPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/music',
    element: (
      <ProtectedRoute>
        <Layout>
          <MusicPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/coach',
    element: (
      <ProtectedRoute>
        <Layout>
          <CoachPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/coach-chat',
    element: (
      <ProtectedRoute>
        <Layout>
          <CoachChatPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/journal',
    element: (
      <ProtectedRoute>
        <Layout>
          <JournalPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/vr',
    element: (
      <ProtectedRoute>
        <Layout>
          <VRPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <Layout>
          <SettingsPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/preferences',
    element: (
      <ProtectedRoute>
        <Layout>
          <PreferencesPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/gamification',
    element: (
      <ProtectedRoute>
        <Layout>
          <GamificationPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/social-cocon',
    element: (
      <ProtectedRoute>
        <Layout>
          <SocialCoconPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  
  // ROUTES ADMINISTRATEUR UNIQUEMENT
  {
    path: '/teams',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        <Layout>
          <TeamsPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/reports',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        <Layout>
          <ReportsPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/events',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        <Layout>
          <EventsPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/optimisation',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        <Layout>
          <OptimisationPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  
  // Route de fallback
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

export default router;
