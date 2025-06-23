
import { RouteObject } from 'react-router-dom';
import ScanPage from '@/pages/ScanPage';

export const scanRoutes: RouteObject[] = [
  {
    path: '/scan',
    element: <ScanPage />
  }
];
