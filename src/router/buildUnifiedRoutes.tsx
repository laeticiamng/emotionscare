
import React from 'react';
import { RouteObject } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import OptimizedLayout from '@/components/layout/OptimizedLayout';
import ProtectedLayout from '@/components/ProtectedLayout';

// Pages principales
import HomePage from '@/pages/HomePage';
import PreferencesPage from '@/pages/PreferencesPage';
import GamificationPage from '@/pages/GamificationPage';
import SocialCoconPage from '@/pages/SocialCoconPage';

// Pages existantes
import ScanPage from '@/pages/ScanPage';
import MusicPage from '@/pages/MusicPage';
import JournalPage from '@/pages/JournalPage';
import CoachPage from '@/pages/CoachPage';
import VRPage from '@/pages/VRPage';

// Nouvelles pages critiques
import ProfilePage from '@/pages/ProfilePage';
import NotificationsPage from '@/pages/NotificationsPage';
import SupportPage from '@/pages/SupportPage';
import SecurityPage from '@/pages/SecurityPage';
import StatsPage from '@/pages/StatsPage';

// Pages spécialisées
import B2CPage from '@/pages/B2CPage';
import B2BSelectionPage from '@/pages/B2BSelectionPage';
import BossLevelGritPage from '@/pages/BossLevelGritPage';
import BounceBackBattlePage from '@/pages/BounceBackBattlePage';
import StorySynthLabPage from '@/pages/StorySynthLabPage';
import ScreenSilkBreakPage from '@/pages/ScreenSilkBreakPage';
import FlashGlowPage from '@/pages/FlashGlowPage';

export const ROUTE_MANIFEST = [
  '/',
  '/scan',
  '/music',
  '/journal',
  '/coach',
  '/vr',
  '/preferences',
  '/gamification',
  '/social-cocon',
  '/profile',
  '/notifications',
  '/support',
  '/security',
  '/stats',
  '/b2c',
  '/b2b-selection',
  '/boss-level-grit',
  '/bounce-back-battle',
  '/story-synth-lab',
  '/screen-silk-break',
  '/flash-glow'
];

export function buildUnifiedRoutes(): RouteObject[] {
  return [
    {
      path: '/',
      element: <OptimizedLayout />,
      children: [
        {
          index: true,
          element: <HomePage />
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
          path: 'journal',
          element: <JournalPage />
        },
        {
          path: 'coach',
          element: <CoachPage />
        },
        {
          path: 'vr',
          element: <VRPage />
        },
        {
          path: 'preferences',
          element: <PreferencesPage />
        },
        {
          path: 'gamification',
          element: <GamificationPage />
        },
        {
          path: 'social-cocon',
          element: <SocialCoconPage />
        },
        {
          path: 'profile',
          element: <ProfilePage />
        },
        {
          path: 'notifications',
          element: <NotificationsPage />
        },
        {
          path: 'support',
          element: <SupportPage />
        },
        {
          path: 'security',
          element: <SecurityPage />
        },
        {
          path: 'stats',
          element: <StatsPage />
        },
        {
          path: 'b2c',
          element: <B2CPage />
        },
        {
          path: 'b2b-selection',
          element: <B2BSelectionPage />
        },
        {
          path: 'boss-level-grit',
          element: <BossLevelGritPage />
        },
        {
          path: 'bounce-back-battle',
          element: <BounceBackBattlePage />
        },
        {
          path: 'story-synth-lab',
          element: <StorySynthLabPage />
        },
        {
          path: 'screen-silk-break',
          element: <ScreenSilkBreakPage />
        },
        {
          path: 'flash-glow',
          element: <FlashGlowPage />
        }
      ]
    }
  ];
}
