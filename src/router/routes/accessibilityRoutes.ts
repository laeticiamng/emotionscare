
import { RouteObject } from 'react-router-dom';

export const accessibilityRoutes: RouteObject[] = [
  {
    path: '/accessibility',
    element: <div data-testid="page-root"><h1>Accessibilité - Page en construction</h1></div>,
  },
  {
    path: '/teams',
    element: <div data-testid="page-root"><h1>Équipes - Page en construction</h1></div>,
  },
  {
    path: '/events',
    element: <div data-testid="page-root"><h1>Événements - Page en construction</h1></div>,
  },
  {
    path: '/optimisation',
    element: <div data-testid="page-root"><h1>Optimisation - Page en construction</h1></div>,
  },
];
