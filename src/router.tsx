import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '@/components/HomePage';
import AppHome from '@/pages/app/AppHome';
import AdvancedSettings from '@/components/modern-features/AdvancedSettings';

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
  }
]);

export default router;