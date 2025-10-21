// @ts-nocheck
/**
 * RouterV2 Aliases - Redirections de compatibilité
 * Map des anciens chemins vers les routes canoniques.
 */

import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { routes } from '@/lib/routes';

export const ROUTE_ALIASES = {
  // ═══════════════════════════════════════════════════════════
  // AUTHENTIFICATION
  // ═══════════════════════════════════════════════════════════
  '/b2c/login': '/login?segment=b2c',
  '/b2b/user/login': '/login?segment=b2b',
  '/b2b/admin/login': '/login?segment=b2b',
  '/auth': '/login',
  '/b2c/register': '/signup?segment=b2c',
  '/b2b/user/register': '/signup?segment=b2b',
  '/register': '/signup',

  // ═══════════════════════════════════════════════════════════
  // LANDING PAGES
  // ═══════════════════════════════════════════════════════════
  '/choose-mode': '/b2c',
  '/b2b': '/entreprise',
  '/b2b/selection': '/entreprise',
  '/help-center': '/help',
  '/tarifs': '/pricing',

  // ═══════════════════════════════════════════════════════════
  // DASHBOARDS
  // ═══════════════════════════════════════════════════════════
  '/b2c/dashboard': '/app/home',
  '/dashboard': '/app/home',
  '/home': '/app/home',
  '/b2b/user/dashboard': '/app/collab',
  '/b2b/admin/dashboard': '/app/rh',

  // ═══════════════════════════════════════════════════════════
  // MODULES FONCTIONNELS
  // ═══════════════════════════════════════════════════════════
  '/emotions': '/app/scan',
  '/scan': '/app/scan',
  '/emotion-scan': '/app/scan',
  '/music': '/app/music',
  '/coach': '/app/coach',
  '/journal': '/app/journal',
  '/voice-journal': '/app/journal',
  '/vr': '/app/vr',
  '/community': '/app/social-cocon',

  // ═══════════════════════════════════════════════════════════
  // MODULES FUN-FIRST
  // ═══════════════════════════════════════════════════════════
  '/flash-glow': '/app/flash-glow',
  '/instant-glow': '/app/flash-glow',
  '/breathwork': '/app/breath',
  '/ar-filters': '/app/face-ar',
  '/bubble-beat': '/app/bubble-beat',
  '/screen-silk-break': '/app/screen-silk',
  '/vr-galactique': '/app/vr-galaxy',
  '/boss-level-grit': '/app/boss-grit',
  '/mood-mixer': '/app/mood-mixer',
  '/ambition-arcade': '/app/ambition-arcade',
  '/bounce-back-battle': '/app/bounce-back',
  '/story-synth-lab': '/app/story-synth',

  // ═══════════════════════════════════════════════════════════
  // ANALYTICS & DATA
  // ═══════════════════════════════════════════════════════════
  '/weekly-bars': '/app/activity',
  '/activity-history': '/app/activity',
  '/heatmap-vibes': '/app/scores',

  // ═══════════════════════════════════════════════════════════
  // PARAMÈTRES
  // ═══════════════════════════════════════════════════════════
  '/settings': '/settings/general',
  '/preferences': '/settings/general',
  '/profile-settings': '/settings/profile',
  '/privacy-toggles': '/settings/privacy',
  '/notifications': '/settings/notifications',

  // ═══════════════════════════════════════════════════════════
  // B2B FEATURES
  // ═══════════════════════════════════════════════════════════
  '/teams': '/app/teams',
  '/social-cocon': '/app/social',
  '/reports': '/app/reports',
  '/events': '/app/events',
  '/optimisation': '/app/optimization',
  '/security': '/app/security',
  '/audit': '/app/audit',
  '/accessibility': '/app/accessibility',
} as const;

export type LegacyPath = keyof typeof ROUTE_ALIASES;

export interface RouteAlias {
  from: LegacyPath;
  to: (typeof ROUTE_ALIASES)[LegacyPath];
}

export const ROUTE_ALIAS_ENTRIES: RouteAlias[] = Object.entries(ROUTE_ALIASES).map(([from, to]) => ({
  from: from as LegacyPath,
  to: to as (typeof ROUTE_ALIASES)[LegacyPath],
}));

export function findRedirectFor(path: string): string | null {
  return ROUTE_ALIASES[path as LegacyPath] ?? null;
}

export function isDeprecatedPath(path: string): boolean {
  return Boolean(findRedirectFor(path));
}

function logAliasUsage(from: string, to: string) {
  Sentry.addBreadcrumb({
    category: 'route:alias',
    message: `${from} → ${to}`,
    level: 'info',
    data: { from, to },
  });
}

function mergeQueryAndHash(target: string, search: string, hash: string) {
  const cleanSearch = search.startsWith('?') ? search.slice(1) : search;
  let next = target;

  if (cleanSearch) {
    next = target.includes('?')
      ? `${target}&${cleanSearch}`
      : `${target}?${cleanSearch}`;
  }

  if (hash) {
    next += hash;
  }

  return next;
}

interface LegacyRedirectProps {
  from?: string;
  to?: string;
}

export function LegacyRedirect({ from, to }: LegacyRedirectProps) {
  const location = useLocation();
  const source = from ?? location.pathname;
  const target = to ?? findRedirectFor(source);

  useEffect(() => {
    if (target) {
      logAliasUsage(source, target);
    }
  }, [source, target]);

  if (!target) {
    return <Navigate to={routes.special.notFound()} replace />;
  }

  const resolvedTarget = mergeQueryAndHash(target, location.search ?? '', location.hash ?? '');

  if (resolvedTarget === location.pathname) {
    return <Navigate to={resolvedTarget} replace />;
  }

  return <Navigate to={resolvedTarget} replace />;
}
