/**
 * Motion Design Tokens — Centralized animation system
 *
 * Rhythm hierarchy:
 *   micro   — hover, press, focus feedback (instant feel)
 *   fast    — UI state changes, toggles (responsive)
 *   normal  — section reveals, card entries (smooth)
 *   slow    — hero reveals, cinematic entries (dramatic)
 *   epic    — page transitions, opening shots (memorable)
 *
 * Easing language:
 *   snappy  — UI interactions (cubic-bezier with overshoot)
 *   smooth  — content reveals (ease-out dominant)
 *   cinema  — hero/cinematic (slow start, strong finish)
 *   breath  — breathing module (sine-based organic)
 */

/* ── Duration tokens (ms) ────────────────────────────────── */

export const DURATION = {
  micro: 0.12,
  fast: 0.2,
  normal: 0.4,
  slow: 0.8,
  epic: 1.2,
  breath: 2.0,
} as const;

/* ── Easing curves ────────────────────────────────────────── */

export const EASE = {
  /** Snappy UI feedback — slight overshoot */
  snappy: [0.25, 0.46, 0.45, 1.0] as [number, number, number, number],
  /** Smooth content reveal — ease-out dominant */
  smooth: [0.22, 1, 0.36, 1] as [number, number, number, number],
  /** Cinematic entry — slow start, strong finish */
  cinema: [0.16, 1, 0.3, 1] as [number, number, number, number],
  /** Gentle deceleration */
  out: [0, 0, 0.2, 1] as [number, number, number, number],
  /** Standard ease-in-out */
  inOut: [0.42, 0, 0.58, 1] as [number, number, number, number],
} as const;

/* ── Stagger presets ──────────────────────────────────────── */

export const STAGGER = {
  /** Fast list items (dashboard cards) */
  fast: 0.05,
  /** Normal section items */
  normal: 0.1,
  /** Dramatic hero sequence */
  hero: 0.2,
  /** Epic opening shot elements */
  epic: 0.25,
} as const;

/* ── Framer Motion variant presets ────────────────────────── */

/** Fade up — standard content reveal */
export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, delay, ease: EASE.smooth },
  }),
};

/** Fade up slow — hero/cinematic reveals */
export const fadeUpSlow = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, delay, ease: EASE.cinema },
  }),
};

/** Scale in — cards, panels, modals */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.normal, delay, ease: EASE.smooth },
  }),
};

/** Stagger container — wraps children with stagger */
export const staggerContainer = (staggerDelay = STAGGER.normal) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.1,
    },
  },
});

/** Stagger item — child of stagger container */
export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE.smooth },
  },
};

/** Page transition — for route-level AnimatePresence */
export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE.smooth },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: DURATION.fast, ease: EASE.out },
  },
};

/** Dashboard card entry — fast, professional */
export const dashboardCard = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: DURATION.normal,
      delay: index * STAGGER.fast,
      ease: EASE.smooth,
    },
  }),
};

/* ── Scene Transition Presets (T5 — emotional coherence) ────── */

/** Scene entry — immersive 3D module entrance */
export const sceneEntry = {
  initial: { opacity: 0, scale: 0.97 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.slow, ease: EASE.cinema },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    transition: { duration: DURATION.fast, ease: EASE.out },
  },
};

/** Section reveal within an immersive page */
export const sectionReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, delay, ease: EASE.cinema },
  }),
};
