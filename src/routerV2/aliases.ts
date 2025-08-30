/**
 * RouterV2 Aliases - Redirections de compatibilité
 * TICKET: FE/BE-Router-Cleanup-01
 * 
 * Liste minimale de redirections pour maintenir la compatibilité
 * avec les anciens liens tout en redirigeant vers les routes canoniques
 */

export const ROUTE_ALIASES = [
  // ═══════════════════════════════════════════════════════════
  // AUTHENTIFICATION
  // ═══════════════════════════════════════════════════════════
  { from: '/b2c/login', to: '/login?segment=b2c' },
  { from: '/b2b/user/login', to: '/login?segment=b2b' },
  { from: '/b2b/admin/login', to: '/login?segment=b2b' },
  { from: '/auth', to: '/login' },
  { from: '/b2c/register', to: '/signup?segment=b2c' },
  { from: '/b2b/user/register', to: '/signup?segment=b2b' },
  { from: '/register', to: '/signup' },

  // ═══════════════════════════════════════════════════════════
  // LANDING PAGES
  // ═══════════════════════════════════════════════════════════
  { from: '/choose-mode', to: '/b2c' },
  { from: '/b2b', to: '/entreprise' },
  { from: '/b2b/selection', to: '/entreprise' },
  { from: '/help-center', to: '/help' },

  // ═══════════════════════════════════════════════════════════
  // DASHBOARDS
  // ═══════════════════════════════════════════════════════════
  { from: '/b2c/dashboard', to: '/app/home' },
  { from: '/dashboard', to: '/app/home' },
  { from: '/b2b/user/dashboard', to: '/app/collab' },
  { from: '/b2b/admin/dashboard', to: '/app/rh' },

  // ═══════════════════════════════════════════════════════════
  // MODULES FONCTIONNELS
  // ═══════════════════════════════════════════════════════════
  { from: '/scan', to: '/app/scan' },
  { from: '/emotions', to: '/app/scan' }, // Redirection pour l'ancienne route emotions
  { from: '/emotion-scan', to: '/app/scan' }, // Redirection pour l'ancienne route emotion-scan
  { from: '/music', to: '/app/music' },
  { from: '/coach', to: '/app/coach' },
  { from: '/journal', to: '/app/journal' },
  { from: '/voice-journal', to: '/app/journal' }, // Redirection pour l'ancienne route voice-journal
  { from: '/vr', to: '/app/vr' },
  { from: '/community', to: '/app/social-cocon' }, // Redirection pour l'ancienne route community

  // ═══════════════════════════════════════════════════════════
  // MODULES FUN-FIRST
  // ═══════════════════════════════════════════════════════════
  { from: '/flash-glow', to: '/app/flash-glow' },
  { from: '/instant-glow', to: '/app/flash-glow' },
  { from: '/breathwork', to: '/app/breath' },
  { from: '/ar-filters', to: '/app/face-ar' },
  { from: '/bubble-beat', to: '/app/bubble-beat' },
  { from: '/screen-silk-break', to: '/app/screen-silk' },
  { from: '/vr-galactique', to: '/app/vr-galaxy' },
  { from: '/boss-level-grit', to: '/app/boss-grit' },
  { from: '/mood-mixer', to: '/app/mood-mixer' },
  { from: '/ambition-arcade', to: '/app/ambition-arcade' },
  { from: '/bounce-back-battle', to: '/app/bounce-back' },
  { from: '/story-synth-lab', to: '/app/story-synth' },

  // ═══════════════════════════════════════════════════════════
  // ANALYTICS & DATA
  // ═══════════════════════════════════════════════════════════
  { from: '/gamification', to: '/app/leaderboard' },
  { from: '/weekly-bars', to: '/app/activity' },
  { from: '/activity-history', to: '/app/activity' },
  { from: '/heatmap-vibes', to: '/app/heatmap' },

  // ═══════════════════════════════════════════════════════════
  // PARAMÈTRES
  // ═══════════════════════════════════════════════════════════
  { from: '/settings', to: '/settings/general' },
  { from: '/preferences', to: '/settings/general' },
  { from: '/profile-settings', to: '/settings/profile' },
  { from: '/privacy-toggles', to: '/settings/privacy' },
  { from: '/notifications', to: '/settings/notifications' },

  // ═══════════════════════════════════════════════════════════
  // B2B FEATURES
  // ═══════════════════════════════════════════════════════════
  { from: '/teams', to: '/app/teams' },
  { from: '/social-cocon', to: '/app/social' },
  { from: '/reports', to: '/app/reports' },
  { from: '/events', to: '/app/events' },
  { from: '/optimisation', to: '/app/optimization' },
  { from: '/security', to: '/app/security' },
  { from: '/audit', to: '/app/audit' },
  { from: '/accessibility', to: '/app/accessibility' },
] as const;

export type RouteAlias = typeof ROUTE_ALIASES[number];

/**
 * Trouve la redirection pour un chemin donné
 */
export function findRedirectFor(path: string): string | null {
  const alias = ROUTE_ALIASES.find(a => a.from === path);
  return alias?.to || null;
}

/**
 * Vérifie si un chemin est un alias obsolète
 */
export function isDeprecatedPath(path: string): boolean {
  return ROUTE_ALIASES.some(a => a.from === path);
}