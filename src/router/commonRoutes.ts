
import { RouteObject } from 'react-router-dom';
import { ImmersiveHomeWrapper } from '@/utils/lazyRoutes';

export const commonRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ImmersiveHomeWrapper />,
  },
  {
    path: '/choose-mode',
    element: <ImmersiveHomeWrapper />,
  },
];
