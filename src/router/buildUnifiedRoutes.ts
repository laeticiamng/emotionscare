import React, { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

export interface RouteManifestEntry {
  path: string;
  auth: 'public' | 'b2c' | 'b2b_user' | 'b2b_admin';
  module: string;
  component: string;
}

export const ROUTES_MANIFEST: RouteManifestEntry[] = [
  { path: '/', auth: 'public', module: 'home', component: 'HomePage' },
  { path: '/app', auth: 'b2c', module: 'dashboard', component: 'AppHome' },
  { path: '/scan', auth: 'public', module: 'scan', component: 'ScanPage' },
  { path: '/music', auth: 'b2c', module: 'music', component: 'MusicPage' },
  { path: '/coach', auth: 'b2c', module: 'coach', component: 'CoachPage' },
];

export function validateRoutesManifest() {
  const errors: string[] = [];
  const paths = new Set<string>();
  
  for (const route of ROUTES_MANIFEST) {
    if (!route.path.startsWith('/')) {
      errors.push(`Invalid path: ${route.path} (must start with /)`);
    }
    
    if (paths.has(route.path)) {
      errors.push(`Duplicate path: ${route.path}`);
    }
    paths.add(route.path);
    
    if (!['public', 'b2c', 'b2b_user', 'b2b_admin'].includes(route.auth)) {
      errors.push(`Invalid auth level: ${route.auth}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export function buildUnifiedRoutes(): RouteObject[] {
  return ROUTES_MANIFEST.map(route => ({
    path: route.path,
    element: React.createElement('div', { children: `Route: ${route.path}` })
  }));
}