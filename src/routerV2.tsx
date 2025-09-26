import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import { RootLayout } from '@/components/layout/RootLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]);