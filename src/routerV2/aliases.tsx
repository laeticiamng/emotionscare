// @ts-nocheck
/**
 * RouterV2 Aliases - Redirections de compatibilité
 * Map des anciens chemins vers les routes canoniques.
 */

import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Sentry } from '@/lib/errors/sentry-compat';
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
  '/choose-mode': '/mode-selection',
  '/feed': '/app/communaute',
  '/b2b': '/entreprise',
  '/b2b/selection': '/entreprise',
  '/help-center': '/help',
  '/tarifs': '/pricing',
  '/terms': '/legal/terms',
  '/legal/accessibility': '/app/accessibility',
  '/modules': '/app/modules',

  // ═══════════════════════════════════════════════════════════
  // DASHBOARDS
  // ═══════════════════════════════════════════════════════════
  '/b2c/dashboard': '/app/consumer/home',
  '/dashboard': '/app/consumer/home',
  '/home': '/app/consumer/home',
  '/app/home': '/app/consumer/home',
  '/app/dashboard': '/app/consumer/home',
  '/b2b/user/dashboard': '/app/collab',
  '/b2b/admin/dashboard': '/app/rh',

  // ═══════════════════════════════════════════════════════════
  // MODULES FONCTIONNELS
  // ═══════════════════════════════════════════════════════════
  '/emotions': '/app/scan',
  '/scan': '/app/scan',
  '/emotion-scan': '/app/scan',
  '/modules/emotion-scan': '/app/scan',
  '/app/emotion-scan': '/app/scan',
  // Routes scan spécialisées - ne PAS rediriger (pages dédiées existantes)
  '/music': '/app/music',
  '/coaching': '/app/coach',
  '/app/coaching': '/app/coach',
  '/emotion-music': '/app/music',
  '/emotion-music-library': '/app/music',
  '/app/music/library': '/app/music',
  '/app/particulier/music': '/app/music',
  '/coach': '/app/coach',
  '/coach-chat': '/app/coach',
  '/journal': '/app/journal',
  '/modules/journal': '/app/journal',
  '/app/journal/audio': '/app/journal',
  '/vr-sessions': '/app/breath',
  '/breath': '/app/breath',
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
  // B2B FEATURES
  // ═══════════════════════════════════════════════════════════
  '/teams': '/app/teams',
  '/b2b-teams': '/app/teams',
  '/b2b/teams': '/app/teams',
  '/social-cocon': '/app/social',
  '/reports': '/app/reports',
  '/events': '/app/events',
  '/optimisation': '/app/optimization',
  '/security': '/app/security',
  '/audit': '/app/audit',
  '/accessibility': '/app/accessibility',
  '/reporting': '/app/reports',
  '/export': '/app/reports',
  '/logout': '/',
  '/profile': '/settings/profile',
  '/aide': '/help',
  '/support': '/help',
  '/meditation': '/app/meditation',
  '/app/grounding': '/app/meditation',
  '/grounding': '/app/meditation',
  '/settings': '/settings/general',
  '/preferences': '/settings/general',
  '/notifications': '/settings/notifications',
  '/app/settings': '/settings/general',
  '/app/settings/general': '/settings/general',
  '/app/settings/profile': '/settings/profile',
  '/app/settings/privacy': '/settings/privacy',
  '/app/settings/notifications': '/settings/notifications',
  '/app/resources': '/app/modules',
  '/app/gamification': '/gamification',
  '/app/aura': '/app/activity',
  '/aura': '/app/activity',
  '/store': '/store',
  '/boutique': '/store',
  '/contact': '/contact',
  '/app/park': '/app/emotional-park',
  '/park': '/app/emotional-park',
  '/app/social-b2c': '/app/social-cocon',
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
