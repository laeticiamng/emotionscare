
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Pages publiques
import HomePage from '@/pages/HomePage';
import ChooseModePage from '@/pages/ChooseModePage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import NotFoundPage from '@/pages/NotFoundPage';
import TestPage from '@/pages/TestPage';
import Point20Page from '@/pages/Point20Page';
import RouteDiagnosticPage from '@/pages/RouteDiagnosticPage';

// Pages B2B principales
import B2BPage from '@/pages/B2BPage';
import B2BSelectionPage from '@/pages/b2b/SelectionPage';

// Pages B2C
import B2CLoginPage from '@/pages/b2c/LoginPage';
import B2CRegisterPage from '@/pages/b2c/RegisterPage';
import B2CDashboardPage from '@/pages/b2c/DashboardPage';

// Pages B2B User
import B2BUserLoginPage from '@/pages/b2b/user/LoginPage';
import B2BUserRegisterPage from '@/pages/b2b/user/RegisterPage';
import B2BUserDashboardPage from '@/pages/b2b/user/DashboardPage';

// Pages B2B Admin
import B2BAdminLoginPage from '@/pages/b2b/admin/LoginPage';
import B2BAdminDashboardPage from '@/pages/b2b/admin/DashboardPage';

// Pages fonctionnelles
import ScanPage from '@/pages/ScanPage';
import MusicPage from '@/pages/MusicPage';
import CoachPage from '@/pages/CoachPage';
import JournalPage from '@/pages/JournalPage';
import VRPage from '@/pages/VRPage';
import GamificationPage from '@/pages/GamificationPage';
import PreferencesPage from '@/pages/PreferencesPage';
import SocialCoconPage from '@/pages/SocialCoconPage';

// Pages admin
import TeamsPage from '@/pages/TeamsPage';
import ReportsPage from '@/pages/ReportsPage';
import EventsPage from '@/pages/EventsPage';

export const router = createBrowserRouter([
  // Route principale
  {
    path: '/',
    element: <HomePage />,
  },
  
  // Routes publiques de base
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
  
  // Routes B2B principales
  {
    path: '/b2b',
    element: <B2BPage />,
  },
  {
    path: '/b2b/selection',
    element: <B2BSelectionPage />,
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
  
  // Routes B2B User
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
  
  // Routes B2B Admin
  {
    path: '/b2b/admin/login',
    element: <B2BAdminLoginPage />,
  },
  {
    path: '/b2b/admin/dashboard',
    element: <B2BAdminDashboardPage />,
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
  {
    path: '/preferences',
    element: <PreferencesPage />,
  },
  {
    path: '/social-cocon',
    element: <SocialCoconPage />,
  },
  
  // Pages admin
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
  
  // Pages utilitaires
  {
    path: '/test',
    element: <TestPage />,
  },
  {
    path: '/point20',
    element: <Point20Page />,
  },
  {
    path: '/route-diagnostic',
    element: <RouteDiagnosticPage />,
  },
  
  // Route 404 - doit être en dernier
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
