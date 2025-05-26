
import { RouteObject } from 'react-router-dom';
import React from 'react';

// Lazy load B2C components
const LoginPage = React.lazy(() => import('../pages/b2c/LoginPage'));

export const b2cRoutes: RouteObject[] = [
  {
    path: '/b2c',
    children: [
      {
        path: 'login',
        element: React.createElement(LoginPage),
      },
      {
        path: 'register',
        element: React.createElement(LoginPage),
      },
      {
        path: 'dashboard',
        element: React.createElement(() => 
          React.createElement('div', { className: 'p-8' }, 
            React.createElement('h1', { className: 'text-2xl font-bold' }, 'Tableau de bord B2C'),
            React.createElement('p', { className: 'text-muted-foreground' }, 'Bienvenue dans votre espace personnel')
          )
        ),
      }
    ]
  }
];
