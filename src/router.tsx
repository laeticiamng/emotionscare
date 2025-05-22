import React from 'react';
import { RouteObject } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import B2CLayout from '@/layouts/B2CLayout';
import B2BUserLayout from '@/layouts/B2BUserLayout';
import B2BAdminLayout from '@/layouts/B2BAdminLayout';
import ProtectedRouteWithMode from '@/components/ProtectedRouteWithMode';

// Public pages
import Home from './Home';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

// Page components
import ImmersiveHome from './pages/ImmersiveHome';
import ChooseModeFlow from './pages/auth/ChooseModeFlow';
import B2BSelectionPage from './pages/B2BSelectionPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import UnauthorizedPage from './pages/auth/UnauthorizedPage';
import DashboardPage from './pages/DashboardPage';
import ScanPage from './pages/ScanPage';
import JournalPage from './pages/JournalPage';
import MusicPage from './pages/MusicPage';
import AudioPage from './pages/AudioPage';
import CoachPage from './pages/CoachPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import TeamsPage from './pages/TeamsPage';
import EventsPage from './pages/EventsPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import PreferencesPage from './pages/PreferencesPage';
import OnboardingPage from './pages/OnboardingPage';
import VRPage from './pages/VRPage';
import SocialPage from './pages/SocialPage';
import ProgressPage from './pages/ProgressPage';
import GamificationPage from './pages/GamificationPage';

// These pages redirect to the appropriate page based on user mode
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import Music from './pages/Music';
import Audio from './pages/Audio';
import Coach from './pages/Coach';
import Progress from './pages/Progress';
import Social from './pages/Social';
import VR from './pages/VR';
import Gamification from './pages/Gamification';

export const routes: RouteObject[] = [
  // Public routes
  { path: '/', element: <ImmersiveHome /> },
  { path: '/home', element: <HomePage /> },
  { path: '/landing', element: <LandingPage /> },
  { path: '/welcome', element: <Home /> },
  { path: '/choose-mode', element: <ChooseModeFlow /> },
  { path: '/b2b/selection', element: <B2BSelectionPage /> },
  { path: '/unauthorized', element: <UnauthorizedPage /> },
  
  // Generic mode redirect routes
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/journal', element: <Journal /> },
  { path: '/music', element: <Music /> },
  { path: '/audio', element: <Audio /> },
  { path: '/coach', element: <Coach /> },
  { path: '/progress', element: <Progress /> },
  { path: '/vr', element: <VR /> },
  { path: '/social', element: <Social /> },
  { path: '/gamification', element: <Gamification /> },
  
  // Auth routes
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      // B2C Auth
      { path: 'b2c/login', element: <LoginPage mode="b2c" /> },
      { path: 'b2c/register', element: <RegisterPage mode="b2c" /> },
      { path: 'b2c/forgot-password', element: <ForgotPasswordPage mode="b2c" /> },
      { path: 'b2c/reset-password', element: <ResetPasswordPage mode="b2c" /> },
      
      // B2B User Auth
      { path: 'b2b/user/login', element: <LoginPage mode="b2b_user" /> },
      { path: 'b2b/user/register', element: <RegisterPage mode="b2b_user" /> },
      { path: 'b2b/user/forgot-password', element: <ForgotPasswordPage mode="b2b_user" /> },
      { path: 'b2b/user/reset-password', element: <ResetPasswordPage mode="b2b_user" /> },
      
      // B2B Admin Auth
      { path: 'b2b/admin/login', element: <LoginPage mode="b2b_admin" /> },
      { path: 'b2b/admin/register', element: <RegisterPage mode="b2b_admin" /> },
      { path: 'b2b/admin/forgot-password', element: <ForgotPasswordPage mode="b2b_admin" /> },
      { path: 'b2b/admin/reset-password', element: <ResetPasswordPage mode="b2b_admin" /> },
    ],
  },
  
  // B2C Routes
  {
    path: 'b2c',
    element: <B2CLayout />,
    children: [
      { path: '', element: <ProtectedRouteWithMode requiredMode="b2c" children={<DashboardPage />} /> },
      { path: 'dashboard', element: <ProtectedRouteWithMode requiredMode="b2c" children={<DashboardPage />} /> },
      { path: 'scan', element: <ProtectedRouteWithMode requiredMode="b2c" children={<ScanPage />} /> },
      { path: 'journal', element: <ProtectedRouteWithMode requiredMode="b2c" children={<JournalPage />} /> },
      { path: 'music', element: <ProtectedRouteWithMode requiredMode="b2c" children={<MusicPage />} /> },
      { path: 'audio', element: <ProtectedRouteWithMode requiredMode="b2c" children={<AudioPage />} /> },
      { path: 'coach', element: <ProtectedRouteWithMode requiredMode="b2c" children={<CoachPage />} /> },
      { path: 'settings', element: <ProtectedRouteWithMode requiredMode="b2c" children={<SettingsPage />} /> },
      { path: 'profile', element: <ProtectedRouteWithMode requiredMode="b2c" children={<ProfilePage />} /> },
      { path: 'notifications', element: <ProtectedRouteWithMode requiredMode="b2c" children={<NotificationsPage />} /> },
      { path: 'preferences', element: <ProtectedRouteWithMode requiredMode="b2c" children={<PreferencesPage />} /> },
      { path: 'onboarding', element: <ProtectedRouteWithMode requiredMode="b2c" children={<OnboardingPage />} /> },
      { path: 'vr', element: <ProtectedRouteWithMode requiredMode="b2c" children={<VRPage />} /> },
      { path: 'social', element: <ProtectedRouteWithMode requiredMode="b2c" children={<SocialPage />} /> },
      { path: 'progress', element: <ProtectedRouteWithMode requiredMode="b2c" children={<ProgressPage />} /> },
      { path: 'gamification', element: <ProtectedRouteWithMode requiredMode="b2c" children={<GamificationPage />} /> },
    ],
  },
  
  // B2B User Routes
  {
    path: 'b2b/user',
    element: <B2BUserLayout />,
    children: [
      { path: '', element: <ProtectedRouteWithMode requiredMode="b2b_user" children={<DashboardPage />} /> },
      { path: 'dashboard', element: <ProtectedRouteWithMode requiredMode="b2b_user" children={<DashboardPage />} /> },
      { path: 'scan', element: <ProtectedRouteWithMode requiredMode="b2b_user" children={<ScanPage />} /> },
      { path: 'journal', element: <ProtectedRouteWithMode requiredMode="b2b_user" children={<JournalPage />} /> },
      { path: 'music', element: <ProtectedRouteWithMode requiredMode="b2b_user" children={<MusicPage />} /> },
      { path: 'audio', element: <ProtectedRouteWithMode requiredMode="b2b_user" children={<AudioPage />} /> },
      { path: 'coach', element: <ProtectedRouteWithMode requiredMode="b2b_user" children={<CoachPage />} /> },
      { path: 'settings', element: <ProtectedRouteWithMode requiredMode="b2b_user" children={<SettingsPage />} /> },
      { path: 'profile', element: <ProtectedRouteWithMode requiredMode="b2b_user" children={<ProfilePage />} /> },
      { path: 'notifications', element: <ProtectedRouteWithMode requiredMode="b2b_user" children={<NotificationsPage />} /> },
      { path: 'preferences', element: <ProtectedRouteWithMode requiredMode="b2b_user" children={<PreferencesPage />} /> },
      { path: 'onboarding', element: <ProtectedRouteWithMode requiredMode="b2b_user" children={<OnboardingPage />} /> },
      { path: 'vr', element: <ProtectedRouteWithMode requiredMode="b2b_user" children={<VRPage />} /> },
      { path: 'social', element: <ProtectedRouteWithMode requiredMode="b2b_user" children={<SocialPage />} /> },
      { path: 'progress', element: <ProtectedRouteWithMode requiredMode="b2b_user" children={<ProgressPage />} /> },
      { path: 'gamification', element: <ProtectedRouteWithMode requiredMode="b2b_user" children={<GamificationPage />} /> },
    ],
  },
  
  // B2B Admin Routes
  {
    path: 'b2b/admin',
    element: <B2BAdminLayout />,
    children: [
      { path: '', element: <ProtectedRouteWithMode requiredMode="b2b_admin" children={<DashboardPage />} /> },
      { path: 'dashboard', element: <ProtectedRouteWithMode requiredMode="b2b_admin" children={<DashboardPage />} /> },
      { path: 'scan', element: <ProtectedRouteWithMode requiredMode="b2b_admin" children={<ScanPage />} /> },
      { path: 'journal', element: <ProtectedRouteWithMode requiredMode="b2b_admin" children={<JournalPage />} /> },
      { path: 'music', element: <ProtectedRouteWithMode requiredMode="b2b_admin" children={<MusicPage />} /> },
      { path: 'audio', element: <ProtectedRouteWithMode requiredMode="b2b_admin" children={<AudioPage />} /> },
      { path: 'coach', element: <ProtectedRouteWithMode requiredMode="b2b_admin" children={<CoachPage />} /> },
      { path: 'teams', element: <ProtectedRouteWithMode requiredMode="b2b_admin" children={<TeamsPage />} /> },
      { path: 'reports', element: <ProtectedRouteWithMode requiredMode="b2b_admin" children={<ReportsPage />} /> },
      { path: 'events', element: <ProtectedRouteWithMode requiredMode="b2b_admin" children={<EventsPage />} /> },
      { path: 'settings', element: <ProtectedRouteWithMode requiredMode="b2b_admin" children={<SettingsPage />} /> },
      { path: 'profile', element: <ProtectedRouteWithMode requiredMode="b2b_admin" children={<ProfilePage />} /> },
      { path: 'notifications', element: <ProtectedRouteWithMode requiredMode="b2b_admin" children={<NotificationsPage />} /> },
      { path: 'preferences', element: <ProtectedRouteWithMode requiredMode="b2b_admin" children={<PreferencesPage />} /> },
      { path: 'onboarding', element: <ProtectedRouteWithMode requiredMode="b2b_admin" children={<OnboardingPage />} /> },
      { path: 'vr', element: <ProtectedRouteWithMode requiredMode="b2b_admin" children={<VRPage />} /> },
      { path: 'social', element: <ProtectedRouteWithMode requiredMode="b2b_admin" children={<SocialPage />} /> },
      { path: 'progress', element: <ProtectedRouteWithMode requiredMode="b2b_admin" children={<ProgressPage />} /> },
      { path: 'gamification', element: <ProtectedRouteWithMode requiredMode="b2b_admin" children={<GamificationPage />} /> },
    ],
  },
  
  // 404 - Not Found
  { path: '*', element: <NotFoundPage /> },
];

export default routes;
