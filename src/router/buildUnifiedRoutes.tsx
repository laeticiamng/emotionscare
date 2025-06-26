
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
const B2CDashboardPage = React.lazy(() => import('@/pages/dashboards/B2CDashboardPage'));
const HelpCenterPage = React.lazy(() => import('@/pages/HelpCenterPage'));
const ScanPage = React.lazy(() => import('@/pages/ScanPage'));
const MusicPage = React.lazy(() => import('@/pages/MusicPage'));
const CoachPage = React.lazy(() => import('@/pages/CoachPage'));
const JournalPage = React.lazy(() => import('@/pages/JournalPage'));
const VRPage = React.lazy(() => import('@/pages/VRPage'));
const GamificationPage = React.lazy(() => import('@/pages/GamificationPage'));

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
  '/b2b/admin/login',
  '/scan',
  '/music',
  '/coach',
  '/journal',
  '/vr',
  '/gamification',
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
          element: <div data-testid="page-root" className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Connexion Collaborateur B2B</h1>
            <p>Page en construction - Utilisez l'espace particulier pour tester l'application</p>
          </div>
        },
        {
          path: 'b2b/user/register',
          element: <div data-testid="page-root" className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Inscription Collaborateur B2B</h1>
            <p>Page en construction - Utilisez l'espace particulier pour tester l'application</p>
          </div>
        },
        {
          path: 'b2b/admin/login',
          element: <div data-testid="page-root" className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Connexion Administrateur B2B</h1>
            <p>Page en construction - Utilisez l'espace particulier pour tester l'application</p>
          </div>
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
