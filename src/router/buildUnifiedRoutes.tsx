import React from 'react';
import { RouteObject } from 'react-router-dom';
import OptimizedLayout from '@/components/layout/OptimizedLayout';
import AuthGuard from '@/components/auth/AuthGuard';

// Pages principales avec lazy loading sécurisé
const HomePage = React.lazy(() => import('@/pages/HomePage').catch(error => {
  console.error('Failed to load HomePage:', error);
  return { default: () => <div>Erreur de chargement de la page d'accueil</div> };
}));

const PreferencesPage = React.lazy(() => import('@/pages/PreferencesPage').catch(error => {
  console.error('Failed to load PreferencesPage:', error);
  return { default: () => <div>Erreur de chargement des préférences</div> };
}));

// Pages existantes
const ScanPage = React.lazy(() => import('@/pages/ScanPage').catch(error => {
  console.error('Failed to load ScanPage:', error);
  return { default: () => <div>Erreur de chargement de la page Scan</div> };
}));

const MusicPage = React.lazy(() => import('@/pages/MusicPage').catch(error => {
  console.error('Failed to load MusicPage:', error);
  return { default: () => <div>Erreur de chargement de la page Musique</div> };
}));

const JournalPage = React.lazy(() => import('@/pages/JournalPage').catch(error => {
  console.error('Failed to load JournalPage:', error);
  return { default: () => <div>Erreur de chargement de la page Journal</div> };
}));

const CoachPage = React.lazy(() => import('@/pages/CoachPage').catch(error => {
  console.error('Failed to load CoachPage:', error);
  return { default: () => <div>Erreur de chargement de la page Coach</div> };
}));

const VRPage = React.lazy(() => import('@/pages/VRPage').catch(error => {
  console.error('Failed to load VRPage:', error);
  return { default: () => <div>Erreur de chargement de la page VR</div> };
}));

// Nouvelles pages critiques
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage').catch(error => {
  console.error('Failed to load ProfilePage:', error);
  return { default: () => <div>Erreur de chargement de la page Profil</div> };
}));

const NotificationsPage = React.lazy(() => import('@/pages/NotificationsPage').catch(error => {
  console.error('Failed to load NotificationsPage:', error);
  return { default: () => <div>Erreur de chargement des Notifications</div> };
}));

const SupportPage = React.lazy(() => import('@/pages/SupportPage').catch(error => {
  console.error('Failed to load SupportPage:', error);
  return { default: () => <div>Erreur de chargement de la page Support</div> };
}));

const SecurityPage = React.lazy(() => import('@/pages/SecurityPage').catch(error => {
  console.error('Failed to load SecurityPage:', error);
  return { default: () => <div>Erreur de chargement de la page Sécurité</div> };
}));

const StatsPage = React.lazy(() => import('@/pages/StatsPage').catch(error => {
  console.error('Failed to load StatsPage:', error);
  return { default: () => <div>Erreur de chargement de la page Stats</div> };
}));

// Pages spécialisées
const B2CPage = React.lazy(() => import('@/pages/B2CPage').catch(error => {
  console.error('Failed to load B2CPage:', error);
  return { default: () => <div>Erreur de chargement de la page B2C</div> };
}));

const B2BSelectionPage = React.lazy(() => import('@/pages/B2BSelectionPage').catch(error => {
  console.error('Failed to load B2BSelectionPage:', error);
  return { default: () => <div>Erreur de chargement de la page B2B Sélection</div> };
}));

const BossLevelGritPage = React.lazy(() => import('@/pages/BossLevelGritPage').catch(error => {
  console.error('Failed to load BossLevelGritPage:', error);
  return { default: () => <div>Erreur de chargement de la page Boss Level Grit</div> };
}));

const BounceBackBattlePage = React.lazy(() => import('@/pages/BounceBackBattlePage').catch(error => {
  console.error('Failed to load BounceBackBattlePage:', error);
  return { default: () => <div>Erreur de chargement de la page Bounce Back Battle</div> };
}));

const StorySynthLabPage = React.lazy(() => import('@/pages/StorySynthLabPage').catch(error => {
  console.error('Failed to load StorySynthLabPage:', error);
  return { default: () => <div>Erreur de chargement de la page Story Synth Lab</div> };
}));

const ScreenSilkBreakPage = React.lazy(() => import('@/pages/ScreenSilkBreakPage').catch(error => {
  console.error('Failed to load ScreenSilkBreakPage:', error);
  return { default: () => <div>Erreur de chargement de la page Screen Silk Break</div> };
}));

const FlashGlowPage = React.lazy(() => import('@/pages/FlashGlowPage').catch(error => {
  console.error('Failed to load FlashGlowPage:', error);
  return { default: () => <div>Erreur de chargement de la page Flash Glow</div> };
}));

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
  try {
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
  } catch (error) {
    console.error('Failed to build unified routes:', error);
    return [];
  }
}
