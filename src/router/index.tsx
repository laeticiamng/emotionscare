import { createBrowserRouter } from 'react-router-dom';

// Pages principales
import HomePage from '@/pages/HomePage';
import TestPage from '@/pages/TestPage';
import Point20Page from '@/pages/Point20Page';
import ScanPage from '@/pages/ScanPage';
import MusicPage from '@/pages/MusicPage';
import ChooseModePage from '@/pages/ChooseModePage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import CoachPage from '@/pages/CoachPage';
import JournalPage from '@/pages/JournalPage';
import VRPage from '@/pages/VRPage';
import GamificationPage from '@/pages/GamificationPage';

// Pages B2C
import B2CLoginPage from '@/pages/b2c/LoginPage';
import B2CRegisterPage from '@/pages/b2c/RegisterPage';
import B2CDashboardPage from '@/pages/b2c/DashboardPage';

// Pages B2B
import B2BSelectionPage from '@/pages/b2b/SelectionPage';
import B2BUserLoginPage from '@/pages/b2b/user/LoginPage';
import B2BUserRegisterPage from '@/pages/b2b/user/RegisterPage';
import B2BUserDashboardPage from '@/pages/b2b/user/DashboardPage';
import B2BAdminLoginPage from '@/pages/b2b/admin/LoginPage';
import B2BAdminDashboardPage from '@/pages/b2b/admin/DashboardPage';

// Pages Admin
import TeamsPage from '@/pages/TeamsPage';
import ReportsPage from '@/pages/ReportsPage';
import EventsPage from '@/pages/EventsPage';

console.log('%c[Router] Configuration UNIFIÉE - TOUTES les routes connectées', 'color:green; font-weight:bold');

// Page 404 améliorée
const NotFoundPage = () => (
  <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-red-600 to-orange-700 text-white flex flex-col items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page introuvable</h2>
      <p className="text-xl mb-8">La page que vous cherchez n'existe pas dans le système unifié.</p>
      <a href="/" className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
        Retour à l'accueil
      </a>
    </div>
  </div>
);

// Page de diagnostic
import RouteDiagnosticPage from '@/pages/RouteDiagnosticPage';

// CONFIGURATION UNIFIÉE - TOUTES LES ROUTES
export const router = createBrowserRouter([
  // Route principale
  {
    path: '/',
    element: <HomePage />,
  },
  
  // Pages publiques
  {
    path: '/choose-mode',
    element: <ChooseModePage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/contact',
    element: <ContactPage />,
  },
  
  // Pages de test et développement
  {
    path: '/test',
    element: <TestPage />,
  },
  {
    path: '/point20',
    element: <Point20Page />,
  },
  
  // Page de diagnostic
  {
    path: '/route-diagnostic',
    element: <RouteDiagnosticPage />,
  },
  
  // Fonctionnalités principales
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
    path: '/gamification',
    element: <GamificationPage />,
  },
  
  // Routes B2C
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
  
  // Routes B2B
  {
    path: '/b2b/selection',
    element: <B2BSelectionPage />,
  },
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
  {
    path: '/b2b/admin/login',
    element: <B2BAdminLoginPage />,
  },
  {
    path: '/b2b/admin/dashboard',
    element: <B2BAdminDashboardPage />,
  },
  
  // Routes Admin
  {
    path: '/teams',
    element: <TeamsPage />,
  },
  {
    path: '/reports',
    element: <ReportsPage />,
  },
  {
    path: '/events',
    element: <EventsPage />,
  },
  
  // Route 404 - TOUJOURS EN DERNIER
  {
    path: '*',
    element: <NotFoundPage />,
  }
], {
  basename: import.meta.env.BASE_URL || '/',
});

console.log('%c[Router] ✅ SYSTÈME UNIFIÉ - Routes configurées:', 'color:green; font-weight:bold');
console.log('%c[Router] Total routes:', 'color:blue', router.routes.length);
console.log('%c[Router] Base URL:', 'color:blue', import.meta.env.BASE_URL);
console.log('%c[Router] Routes principales actives:', 'color:purple', [
  '/', '/choose-mode', '/about', '/contact',
  '/scan', '/music', '/coach', '/journal', '/vr', '/gamification',
  '/b2c/login', '/b2c/register', '/b2c/dashboard',
  '/b2b/selection', '/b2b/user/login', '/b2b/user/register', '/b2b/user/dashboard',
  '/b2b/admin/login', '/b2b/admin/dashboard',
  '/teams', '/reports', '/events'
]);
