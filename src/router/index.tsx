import React from 'react';
import ProtectedRoute from '@/guards/ProtectedRoute';

export interface LegacyRoute {
  path: string;
  element: React.ReactElement;
  children?: LegacyRoute[];
}

function buildChildren(paths: string[]): LegacyRoute[] {
  return paths.map(path => ({ path, element: <div /> }));
}

export const routes: LegacyRoute[] = [
  {
    path: 'b2c',
    element: (
      <ProtectedRoute requiredRole="b2c">
        <div />
      </ProtectedRoute>
    ),
    children: buildChildren([
      'dashboard',
      'journal',
      'scan',
      'music',
      'coach',
      'coach-chat',
      'vr',
      'preferences',
      'settings',
      'cocon',
      'social-cocon',
      'gamification'
    ]),
  },
  {
    path: 'b2b/user',
    element: (
      <ProtectedRoute requiredRole="b2b_user">
        <div />
      </ProtectedRoute>
    ),
    children: buildChildren([
      'dashboard',
      'journal',
      'scan',
      'music',
      'coach',
      'vr',
      'preferences',
      'settings',
      'cocon',
      'social-cocon',
      'gamification'
    ]),
  },
  {
    path: 'b2b/admin',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        <div />
      </ProtectedRoute>
    ),
    children: buildChildren([
      'dashboard',
      'journal',
      'scan',
      'music',
      'teams',
      'reports',
      'events',
      'social-cocon',
      'optimisation',
      'settings'
    ]),
  }
];
