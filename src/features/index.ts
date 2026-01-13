/**
 * Features Registry - Index central des features
 * 
 * Chaque feature est autonome avec ses hooks, components, types, stores
 * Usage: import { useScan, ScanResult } from '@/features/scan';
 */

// ============================================================================
// CORE FEATURES
// ============================================================================

export * as scan from './scan';
export * as journal from './journal';
export * as coach from './coach';
export * as breath from './breath';
export * as dashboard from './dashboard';

// ============================================================================
// GAMIFICATION & ENGAGEMENT
// ============================================================================

export * as gamification from './gamification';
export * as challenges from './challenges';
export * as tournaments from './tournaments';
export * as guilds from './guilds';
export * as leaderboard from './leaderboard';

// ============================================================================
// COMMUNITY & SOCIAL
// ============================================================================

export * as community from './community';
export * as socialCocon from './social-cocon';

// ============================================================================
// SPECIALIZED
// ============================================================================

export * as orchestration from './orchestration';
export * as music from './music';
export * as b2b from './b2b';
