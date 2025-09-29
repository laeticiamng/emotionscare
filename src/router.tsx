import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@/components/HomePage';
import ScanPage from '@/pages/modules/ScanPage';
import MusicPage from '@/pages/modules/MusicPage';
import CoachPage from '@/pages/modules/CoachPage';
import JournalPage from '@/pages/modules/JournalPage';
import VRPage from '@/pages/modules/VRPage';
import AnalyticsPage from '@/pages/modules/AnalyticsPage';
import SocialPage from '@/pages/modules/SocialPage';
import BreathworkPage from '@/pages/modules/BreathworkPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/app',
    element: <HomePage />
  },
  {
    path: '/scan',
    element: <ScanPage />
  },
  {
    path: '/music',
    element: <MusicPage />
  },
  {
    path: '/coach',
    element: <CoachPage />
  },
  {
    path: '/journal',
    element: <JournalPage />
  },
  {
    path: '/vr',
    element: <VRPage />
  },
  {
    path: '/analytics',
    element: <AnalyticsPage />
  },
  {
    path: '/social',
    element: <SocialPage />
  },
  {
    path: '/breathwork',
    element: <BreathworkPage />
  }
]);

export default router;