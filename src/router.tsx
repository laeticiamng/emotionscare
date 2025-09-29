import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '@/components/HomePage';
import AppHome from '@/pages/app/AppHome';
import AdvancedSettings from '@/components/modern-features/AdvancedSettings';
import ScanPage from '@/pages/modules/ScanPage';
import MusicPage from '@/pages/modules/MusicPage';
import CoachPage from '@/pages/modules/CoachPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/app',
    element: <AppHome />
  },
  {
    path: '/app/settings',
    element: <AdvancedSettings />
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
  }
]);

export default router;