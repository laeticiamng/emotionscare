import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import HomePage from '@/components/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '*',
    element: <div>Page non trouvée</div>
  }
]);

export default router;