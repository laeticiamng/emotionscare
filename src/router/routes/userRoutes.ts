
import React from 'react';
import { RouteObject } from 'react-router-dom';

export const userRoutes: RouteObject[] = [
  {
    path: '/login',
    element: React.createElement('div', { 'data-testid': 'page-root' }, 
      React.createElement('h1', null, 'Login général - Page en construction')
    ),
  },
  {
    path: '/reset-password',
    element: React.createElement('div', { 'data-testid': 'page-root' }, 
      React.createElement('h1', null, 'Reset Password - Page en construction')
    ),
  },
  {
    path: '/auth/callback',
    element: React.createElement('div', { 'data-testid': 'page-root' }, 
      React.createElement('h1', null, 'Auth Callback - Page en construction')
    ),
  },
];
