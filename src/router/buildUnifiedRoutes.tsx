
import React from 'react';
import { RouteObject } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
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
      element: <Layout />,
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
