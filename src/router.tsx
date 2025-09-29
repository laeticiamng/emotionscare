import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '@/components/HomePage';
import AppDashboard from '@/components/app/AppDashboard';
import EmotionScanner from '@/components/app/EmotionScanner';
import MusicTherapy from '@/components/app/MusicTherapy';
import AppSettings from '@/components/app/AppSettings';
import EnhancedDashboard from '@/components/modern-features/EnhancedDashboard';
import SmartNotificationCenter from '@/components/modern-features/SmartNotificationCenter';
import AdvancedSettings from '@/components/modern-features/AdvancedSettings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/app',
    element: <AppDashboard />
  },
  {
    path: '/app/dashboard',
    element: <EnhancedDashboard />
  },
  {
    path: '/app/scan',
    element: <EmotionScanner />
  },
  {
    path: '/app/music',
    element: <MusicTherapy />
  },
  {
    path: '/app/notifications',
    element: <SmartNotificationCenter />
  },
  {
    path: '/app/settings',
    element: <AppSettings />
  },
  {
    path: '/settings',
    element: <AdvancedSettings />
  }
]);

export default router;