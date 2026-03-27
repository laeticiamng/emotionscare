// @ts-nocheck
/**
 * Experience Layer — Immersion Registry
 * Maps each route pattern to its immersion level (0-3) and transition type.
 *
 * 0 = Utilitarian — pure 2D premium, no effects
 * 1 = Micro-immersion — CSS depth, parallax, micro-animations
 * 2 = Moderate immersion — lightweight 3D or advanced CSS, audio-reactive
 * 3 = Signature scene — full 3D experience
 */

import type { ImmersionLevel, TransitionType, PageExperienceConfig } from '../types';

interface RouteExperienceEntry {
  level: ImmersionLevel;
  transition: TransitionType;
  transitionDuration?: number;
  ambientAudio?: string;
  sceneType?: 'hero' | 'breathing' | 'galaxy' | 'nebula';
}

const REGISTRY: Record<string, RouteExperienceEntry> = {
  /* ── PUBLIC / MARKETING ──────────────────────────────────── */
  '/': { level: 2, transition: 'fade-through', sceneType: 'hero' },
  '/pricing': { level: 1, transition: 'fade-through' },
  '/about': { level: 1, transition: 'fade-through' },
  '/demo': { level: 2, transition: 'reveal' },
  '/onboarding': { level: 3, transition: 'reveal', sceneType: 'nebula' },
  '/login': { level: 1, transition: 'fade-through' },
  '/signup': { level: 1, transition: 'fade-through' },
  '/b2c': { level: 2, transition: 'fade-through', sceneType: 'hero' },
  '/b2b': { level: 1, transition: 'fade-through' },
  '/parcours-xl': { level: 2, transition: 'reveal' },
  '/unified-home': { level: 2, transition: 'fade-through', sceneType: 'hero' },

  /* ── LEGAL (Level 0) ─────────────────────────────────────── */
  '/privacy': { level: 0, transition: 'cut' },
  '/legal/mentions': { level: 0, transition: 'cut' },
  '/legal/privacy': { level: 0, transition: 'cut' },
  '/legal/terms': { level: 0, transition: 'cut' },
  '/legal/sales': { level: 0, transition: 'cut' },
  '/legal/cookies': { level: 0, transition: 'cut' },
  '/legal/licenses': { level: 0, transition: 'cut' },
  '/compliance/securite-sante': { level: 0, transition: 'cut' },
  '/help': { level: 0, transition: 'cut' },
  '/faq': { level: 0, transition: 'cut' },
  '/contact': { level: 0, transition: 'cut' },

  /* ── CORE B2C DASHBOARD ──────────────────────────────────── */
  '/app': { level: 1, transition: 'reveal' },
  '/app/consumer/home': { level: 2, transition: 'ambient-morph' },
  '/app/home': { level: 2, transition: 'ambient-morph' },
  '/app/modules': { level: 1, transition: 'fade-through' },
  '/app/unified': { level: 2, transition: 'ambient-morph' },

  /* ── EMOTION SCANNING ────────────────────────────────────── */
  '/app/scan': { level: 2, transition: 'ambient-morph' },
  '/app/scan/facial': { level: 2, transition: 'depth-shift' },
  '/app/scan/voice': { level: 2, transition: 'depth-shift' },
  '/app/scan/text': { level: 1, transition: 'depth-shift' },
  '/app/scan/emoji': { level: 1, transition: 'depth-shift' },

  /* ── BREATHING & MEDITATION ──────────────────────────────── */
  '/app/breathing': { level: 2, transition: 'ambient-morph', sceneType: 'breathing' },
  '/app/breath': { level: 2, transition: 'ambient-morph', sceneType: 'breathing' },
  '/app/meditation': { level: 2, transition: 'ambient-morph', sceneType: 'breathing' },
  '/app/vr-breath-guide': { level: 3, transition: 'reveal', sceneType: 'breathing' },
  '/dashboard/breathing': { level: 2, transition: 'ambient-morph', sceneType: 'breathing' },

  /* ── MUSIC & AUDIO ───────────────────────────────────────── */
  '/app/music': { level: 2, transition: 'ambient-morph' },
  '/app/music-premium': { level: 2, transition: 'ambient-morph' },
  '/app/suno': { level: 2, transition: 'depth-shift' },

  /* ── JOURNAL ─────────────────────────────────────────────── */
  '/app/journal': { level: 1, transition: 'depth-shift' },
  '/app/journal-new': { level: 1, transition: 'depth-shift' },
  '/app/voice-journal': { level: 1, transition: 'depth-shift' },
  '/dashboard/journal': { level: 1, transition: 'depth-shift' },

  /* ── AI COACH ────────────────────────────────────────────── */
  '/app/coach': { level: 1, transition: 'ambient-morph' },
  '/app/coach-micro': { level: 1, transition: 'fade-through' },

  /* ── IMMERSIVE EXPERIENCES (Level 3) ─────────────────────── */
  '/app/emotional-park': { level: 3, transition: 'reveal', sceneType: 'nebula' },
  '/app/park-journey': { level: 3, transition: 'reveal', sceneType: 'nebula' },
  '/app/vr-galaxy': { level: 3, transition: 'reveal', sceneType: 'galaxy' },
  '/app/vr': { level: 2, transition: 'depth-shift' },
  '/app/immersive': { level: 3, transition: 'reveal' },
  '/app/brain-viewer': { level: 3, transition: 'reveal' },
  '/app/emotion-atlas': { level: 3, transition: 'reveal', sceneType: 'nebula' },

  /* ── FUN-FIRST / MINI-GAMES ──────────────────────────────── */
  '/app/flash-glow': { level: 2, transition: 'depth-shift' },
  '/app/bubble-beat': { level: 2, transition: 'depth-shift' },
  '/app/mood-mixer': { level: 2, transition: 'depth-shift' },
  '/app/boss-grit': { level: 2, transition: 'depth-shift' },
  '/app/bounce-back': { level: 2, transition: 'depth-shift' },
  '/app/story-synth': { level: 1, transition: 'fade-through' },
  '/app/ambition-arcade': { level: 2, transition: 'depth-shift' },
  '/app/face-ar': { level: 2, transition: 'depth-shift' },
  '/app/screen-silk': { level: 1, transition: 'fade-through' },
  '/app/timecraft': { level: 2, transition: 'depth-shift' },

  /* ── GAMIFICATION ────────────────────────────────────────── */
  '/gamification': { level: 2, transition: 'ambient-morph' },
  '/app/badges': { level: 2, transition: 'depth-shift' },
  '/app/leaderboard': { level: 1, transition: 'fade-through' },
  '/app/challenges': { level: 1, transition: 'fade-through' },
  '/app/daily-challenges': { level: 1, transition: 'fade-through' },
  '/app/achievements': { level: 2, transition: 'reveal' },
  '/app/rewards': { level: 2, transition: 'reveal' },
  '/app/competitive-seasons': { level: 2, transition: 'ambient-morph' },
  '/app/guilds': { level: 1, transition: 'fade-through' },
  '/app/tournaments': { level: 2, transition: 'depth-shift' },

  /* ── COMMUNITY ───────────────────────────────────────────── */
  '/app/entraide': { level: 1, transition: 'fade-through' },
  '/app/buddies': { level: 1, transition: 'fade-through' },
  '/app/group-sessions': { level: 1, transition: 'fade-through' },

  /* ── ANALYTICS ───────────────────────────────────────────── */
  '/app/analytics': { level: 1, transition: 'fade-through' },
  '/app/scores': { level: 1, transition: 'fade-through' },
  '/app/trends': { level: 1, transition: 'fade-through' },
  '/app/insights': { level: 1, transition: 'fade-through' },
  '/app/weekly-bars': { level: 1, transition: 'fade-through' },

  /* ── B2B MANAGER ─────────────────────────────────────────── */
  '/app/rh': { level: 1, transition: 'fade-through' },
  '/app/collab': { level: 1, transition: 'fade-through' },
  '/b2b/team-wellbeing': { level: 1, transition: 'fade-through' },
  '/b2b/admin/timecraft': { level: 2, transition: 'depth-shift' },
  '/app/reports': { level: 0, transition: 'cut' },
  '/b2b/reports': { level: 0, transition: 'cut' },
  '/b2b/alerts': { level: 0, transition: 'cut' },

  /* ── SETTINGS (Level 0) ──────────────────────────────────── */
  '/settings/general': { level: 0, transition: 'cut' },
  '/settings/profile': { level: 0, transition: 'cut' },
  '/settings/privacy': { level: 0, transition: 'cut' },
  '/settings/notifications': { level: 0, transition: 'cut' },
  '/settings/accessibility': { level: 0, transition: 'cut' },
  '/settings/language': { level: 0, transition: 'cut' },
  '/settings/security': { level: 0, transition: 'cut' },
  '/settings/journal': { level: 0, transition: 'cut' },
  '/dashboard/settings': { level: 0, transition: 'cut' },

  /* ── SUPPORT (Level 0) ───────────────────────────────────── */
  '/app/support': { level: 0, transition: 'cut' },
  '/app/consent': { level: 0, transition: 'cut' },
  '/app/data-export': { level: 0, transition: 'cut' },
  '/app/delete-account': { level: 0, transition: 'cut' },

  /* ── ADMIN (Level 0) ─────────────────────────────────────── */
  '/admin/system-health': { level: 0, transition: 'cut' },
  '/admin/monitoring': { level: 0, transition: 'cut' },
  '/admin/gdpr': { level: 0, transition: 'cut' },
  '/admin/user-roles': { level: 0, transition: 'cut' },
  '/admin/unified': { level: 0, transition: 'cut' },
  '/admin/executive': { level: 0, transition: 'cut' },

  /* ── BILLING ─────────────────────────────────────────────── */
  '/app/premium': { level: 1, transition: 'fade-through' },
  '/app/billing': { level: 0, transition: 'cut' },
  '/subscribe': { level: 1, transition: 'fade-through' },
  '/payment-success': { level: 2, transition: 'reveal' },

  /* ── ERROR PAGES ─────────────────────────────────────────── */
  '/401': { level: 0, transition: 'cut' },
  '/403': { level: 0, transition: 'cut' },
  '/404': { level: 0, transition: 'cut' },
  '/500': { level: 0, transition: 'cut' },
};

/**
 * Resolve the experience config for a given route path.
 * Tries exact match first, then prefix match (longest wins).
 */
export function getRouteExperienceConfig(pathname: string): PageExperienceConfig {
  // Exact match
  const exact = REGISTRY[pathname];
  if (exact) {
    return {
      immersionLevel: exact.level,
      transition: {
        type: exact.transition,
        duration: exact.transitionDuration ?? getDefaultDuration(exact.transition),
      },
      ambientAudio: exact.ambientAudio,
      sceneType: exact.sceneType,
    };
  }

  // Prefix match (longest wins)
  let bestMatch: RouteExperienceEntry | null = null;
  let bestLength = 0;
  for (const [pattern, entry] of Object.entries(REGISTRY)) {
    if (pathname.startsWith(pattern) && pattern.length > bestLength) {
      bestMatch = entry;
      bestLength = pattern.length;
    }
  }

  if (bestMatch) {
    return {
      immersionLevel: bestMatch.level,
      transition: {
        type: bestMatch.transition,
        duration: bestMatch.transitionDuration ?? getDefaultDuration(bestMatch.transition),
      },
      ambientAudio: bestMatch.ambientAudio,
      sceneType: bestMatch.sceneType,
    };
  }

  // Default: utilitarian
  return {
    immersionLevel: 0,
    transition: { type: 'cut', duration: 0 },
  };
}

function getDefaultDuration(type: TransitionType): number {
  switch (type) {
    case 'fade-through': return 400;
    case 'depth-shift': return 450;
    case 'ambient-morph': return 600;
    case 'reveal': return 500;
    case 'cut': return 0;
  }
}
