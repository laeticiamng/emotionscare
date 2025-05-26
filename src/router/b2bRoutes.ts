
import { RouteObject } from 'react-router-dom';
import React from 'react';

export const b2bRoutes: RouteObject[] = [
  {
    path: '/b2b',
    children: [
      {
        path: 'user',
        children: [
          {
            path: 'login',
            element: React.createElement(() => 
              React.createElement('div', { className: 'min-h-screen flex items-center justify-center' }, 
                React.createElement('div', { className: 'text-center' },
                  React.createElement('h1', { className: 'text-2xl font-bold mb-4' }, 'Connexion Collaborateur'),
                  React.createElement('p', { className: 'text-muted-foreground' }, 'Page de connexion pour les collaborateurs')
                )
              )
            ),
          },
          {
            path: 'dashboard',
            element: React.createElement(() => 
              React.createElement('div', { className: 'p-8' }, 
                React.createElement('h1', { className: 'text-2xl font-bold' }, 'Tableau de bord Collaborateur'),
                React.createElement('p', { className: 'text-muted-foreground' }, 'Espace de travail pour les collaborateurs')
              )
            ),
          }
        ]
      },
      {
        path: 'admin',
        children: [
          {
            path: 'login',
            element: React.createElement(() => 
              React.createElement('div', { className: 'min-h-screen flex items-center justify-center' }, 
                React.createElement('div', { className: 'text-center' },
                  React.createElement('h1', { className: 'text-2xl font-bold mb-4' }, 'Connexion Administrateur'),
                  React.createElement('p', { className: 'text-muted-foreground' }, 'Page de connexion pour les administrateurs')
                )
              )
            ),
          },
          {
            path: 'dashboard',
            element: React.createElement(() => 
              React.createElement('div', { className: 'p-8' }, 
                React.createElement('h1', { className: 'text-2xl font-bold' }, 'Tableau de bord Administrateur'),
                React.createElement('p', { className: 'text-muted-foreground' }, 'Interface d\'administration complète')
              )
            ),
          }
        ]
      }
    ]
  }
];
