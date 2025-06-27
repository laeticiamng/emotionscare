import React from 'react';
import { RouteObject } from 'react-router-dom';

// Import des composants de page
import HomePage from '@/pages/HomePage';
import ChooseModePage from '@/pages/ChooseModePage';
import HelpCenterPage from '@/pages/HelpCenterPage';

// B2C pages
import B2CLoginPage from '@/pages/b2c/B2CLoginPage';
import B2CRegisterPage from '@/pages/b2c/B2CRegisterPage';
import B2CDashboardPage from '@/pages/b2c/B2CDashboardPage';

// B2B User pages
import B2BUserLoginPage from '@/pages/b2b/user/B2BUserLoginPage';
import B2BUserRegisterPage from '@/pages/b2b/user/B2BUserRegisterPage';
import B2BUserDashboardPage from '@/pages/b2b/user/B2BUserDashboardPage';

// B2B Admin pages
import B2BAdminLoginPage from '@/pages/b2b/admin/B2BAdminLoginPage';
import B2BAdminDashboardPage from '@/pages/b2b/admin/B2BAdminDashboardPage';

// Feature pages
import ScanPage from '@/pages/ScanPage';
import MusicPage from '@/pages/MusicPage';
import VRPage from '@/pages/VRPage';
import FlashGlowPage from '@/pages/FlashGlowPage';
import BossLevelGritPage from '@/pages/BossLevelGritPage';
import MoodMixerPage from '@/pages/MoodMixerPage';
import BounceBackBattlePage from '@/pages/BounceBackBattlePage';
import BreathworkPage from '@/pages/BreathworkPage';
import InstantGlowPage from '@/pages/InstantGlowPage';

// Settings pages
import PreferencesPage from '@/pages/PreferencesPage';
import NotificationsPage from '@/pages/NotificationsPage';

// Components
import { ProtectedRoute } from '@/components/ProtectedRoute';

export interface RouteManifestEntry {
  path: string;
  pageName: string;
  category: string;
  completion: number;
}

export const buildUnifiedRoutes = (): RouteObject[] => {
  const routes: RouteObject[] = [
    // Public routes
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '/choose-mode',
      element: <ChooseModePage />,
    },
    {
      path: '/help-center',
      element: <HelpCenterPage />,
    },

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
      element: (
        <ProtectedRoute>
          <B2CDashboardPage />
        </ProtectedRoute>
      ),
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
      element: (
        <ProtectedRoute>
          <B2BUserDashboardPage />
        </ProtectedRoute>
      ),
    },

    // B2B Admin routes
    {
      path: '/b2b/admin/login',
      element: <B2BAdminLoginPage />,
    },
    {
      path: '/b2b/admin/dashboard',
      element: (
        <ProtectedRoute>
          <B2BAdminDashboardPage />
        </ProtectedRoute>
      ),
    },

    // Measure & Adaptation routes
    {
      path: '/scan',
      element: (
        <ProtectedRoute>
          <ScanPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/music',
      element: (
        <ProtectedRoute>
          <MusicPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/flash-glow',
      element: (
        <ProtectedRoute>
          <FlashGlowPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/boss-level-grit',
      element: (
        <ProtectedRoute>
          <BossLevelGritPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/mood-mixer',
      element: (
        <ProtectedRoute>
          <MoodMixerPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/bounce-back-battle',
      element: (
        <ProtectedRoute>
          <BounceBackBattlePage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/breathwork',
      element: (
        <ProtectedRoute>
          <BreathworkPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/instant-glow',
      element: (
        <ProtectedRoute>
          <InstantGlowPage />
        </ProtectedRoute>
      ),
    },

    // Immersive experiences
    {
      path: '/vr',
      element: (
        <ProtectedRoute>
          <VRPage />
        </ProtectedRoute>
      ),
    },

    // User settings
    {
      path: '/preferences',
      element: (
        <ProtectedRoute>
          <PreferencesPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/notifications',
      element: (
        <ProtectedRoute>
          <NotificationsPage />
        </ProtectedRoute>
      ),
    }
  ];

  return routes;
};

export const ROUTES_MANIFEST: RouteManifestEntry[] = [
  // User Spaces (11 routes)
  { path: '/', pageName: 'HomePage', category: 'user_spaces', completion: 100 },
  { path: '/choose-mode', pageName: 'ChooseModePage', category: 'user_spaces', completion: 100 },
  { path: '/help-center', pageName: 'HelpCenterPage', category: 'user_spaces', completion: 100 },
  { path: '/b2c/login', pageName: 'B2CLoginPage', category: 'user_spaces', completion: 100 },
  { path: '/b2c/register', pageName: 'B2CRegisterPage', category: 'user_spaces', completion: 100 },
  { path: '/b2c/dashboard', pageName: 'B2CDashboardPage', category: 'user_spaces', completion: 100 },
  { path: '/b2b/user/login', pageName: 'B2BUserLoginPage', category: 'user_spaces', completion: 100 },
  { path: '/b2b/user/register', pageName: 'B2BUserRegisterPage', category: 'user_spaces', completion: 100 },
  { path: '/b2b/user/dashboard', pageName: 'B2BUserDashboardPage', category: 'user_spaces', completion: 100 },
  { path: '/b2b/admin/login', pageName: 'B2BAdminLoginPage', category: 'user_spaces', completion: 100 },
  { path: '/b2b/admin/dashboard', pageName: 'B2BAdminDashboardPage', category: 'user_spaces', completion: 100 },

  // Measure & Adaptation (8 routes - all completed)
  { path: '/scan', pageName: 'ScanPage', category: 'measure_adaptation', completion: 100 },
  { path: '/music', pageName: 'MusicPage', category: 'measure_adaptation', completion: 100 },
  { path: '/flash-glow', pageName: 'FlashGlowPage', category: 'measure_adaptation', completion: 100 },
  { path: '/boss-level-grit', pageName: 'BossLevelGritPage', category: 'measure_adaptation', completion: 100 },
  { path: '/mood-mixer', pageName: 'MoodMixerPage', category: 'measure_adaptation', completion: 100 },
  { path: '/bounce-back-battle', pageName: 'BounceBackBattlePage', category: 'measure_adaptation', completion: 100 },
  { path: '/breathwork', pageName: 'BreathworkPage', category: 'measure_adaptation', completion: 100 },
  { path: '/instant-glow', pageName: 'InstantGlowPage', category: 'measure_adaptation', completion: 100 },

  // Immersive Experiences (1 route)
  { path: '/vr', pageName: 'VRPage', category: 'immersive_experiences', completion: 95 },

  // Settings (2 routes)
  { path: '/preferences', pageName: 'PreferencesPage', category: 'settings', completion: 90 },
  { path: '/notifications', pageName: 'NotificationsPage', category: 'settings', completion: 100 },

  // Routes restantes à créer (30 routes pour atteindre 52 total)
  // Community Features
  { path: '/community', pageName: 'CommunityPage', category: 'community', completion: 0 },
  { path: '/community/groups', pageName: 'GroupsPage', category: 'community', completion: 0 },
  { path: '/community/challenges', pageName: 'ChallengesPage', category: 'community', completion: 0 },
  { path: '/community/leaderboard', pageName: 'LeaderboardPage', category: 'community', completion: 0 },
  
  // Wellness Programs
  { path: '/programs', pageName: 'ProgramsPage', category: 'wellness_programs', completion: 0 },
  { path: '/programs/mindfulness', pageName: 'MindfulnessPage', category: 'wellness_programs', completion: 0 },
  { path: '/programs/stress-management', pageName: 'StressManagementPage', category: 'wellness_programs', completion: 0 },
  { path: '/programs/sleep-optimization', pageName: 'SleepOptimizationPage', category: 'wellness_programs', completion: 0 },
  
  // Analytics & Reports
  { path: '/analytics', pageName: 'AnalyticsPage', category: 'analytics', completion: 0 },
  { path: '/reports', pageName: 'ReportsPage', category: 'analytics', completion: 0 },
  { path: '/insights', pageName: 'InsightsPage', category: 'analytics', completion: 0 },
  
  // Training & Education
  { path: '/training', pageName: 'TrainingPage', category: 'education', completion: 0 },
  { path: '/courses', pageName: 'CoursesPage', category: 'education', completion: 0 },
  { path: '/certifications', pageName: 'CertificationsPage', category: 'education', completion: 0 },
  
  // Support & Resources
  { path: '/resources', pageName: 'ResourcesPage', category: 'support', completion: 0 },
  { path: '/tutorials', pageName: 'TutorialsPage', category: 'support', completion: 0 },
  { path: '/faq', pageName: 'FAQPage', category: 'support', completion: 0 },
  
  // Integration Features
  { path: '/integrations', pageName: 'IntegrationsPage', category: 'integrations', completion: 0 },
  { path: '/api-docs', pageName: 'APIDocsPage', category: 'integrations', completion: 0 },
  { path: '/webhooks', pageName: 'WebhooksPage', category: 'integrations', completion: 0 },
  
  // Advanced Features
  { path: '/ai-coach', pageName: 'AICoachPage', category: 'ai_features', completion: 0 },
  { path: '/predictive-analytics', pageName: 'PredictiveAnalyticsPage', category: 'ai_features', completion: 0 },
  { path: '/personalization', pageName: 'PersonalizationPage', category: 'ai_features', completion: 0 },
  
  // Mobile & Wearables
  { path: '/mobile-sync', pageName: 'MobileSyncPage', category: 'mobile', completion: 0 },
  { path: '/wearables', pageName: 'WearablesPage', category: 'mobile', completion: 0 },
  
  // Enterprise Features
  { path: '/enterprise', pageName: 'EnterprisePage', category: 'enterprise', completion: 0 },
  { path: '/compliance', pageName: 'CompliancePage', category: 'enterprise', completion: 0 },
  { path: '/security', pageName: 'SecurityPage', category: 'enterprise', completion: 0 },
  
  // Wellness Tracking
  { path: '/journal', pageName: 'JournalPage', category: 'tracking', completion: 0 },
  { path: '/goals', pageName: 'GoalsPage', category: 'tracking', completion: 0 },
  { path: '/habits', pageName: 'HabitsPage', category: 'tracking', completion: 0 }
];

export const validateRoutesManifest = () => {
  const errors: string[] = [];
  
  if (!Array.isArray(ROUTES_MANIFEST)) {
    errors.push('ROUTES_MANIFEST must be an array.');
  } else {
    ROUTES_MANIFEST.forEach((route, index) => {
      if (typeof route !== 'object' || route === null) {
        errors.push(`Route at index ${index} is not an object.`);
        return;
      }
      
      if (typeof route.path !== 'string') {
        errors.push(`Path for route "${route.pageName || 'unknown'}" at index ${index} is not a string.`);
      }
      
      if (typeof route.pageName !== 'string') {
        errors.push(`PageName for route "${route.path || 'unknown'}" at index ${index} is not a string.`);
      }
      
      if (typeof route.category !== 'string') {
        errors.push(`Category for route "${route.pageName || 'unknown'}" at index ${index} is not a string.`);
      }

      if (typeof route.completion !== 'number') {
        errors.push(`Completion for route "${route.pageName || 'unknown'}" at index ${index} is not a number.`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
};
