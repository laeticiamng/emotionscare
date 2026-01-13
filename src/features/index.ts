/**
 * Features Registry - Index central des features
 * 
 * Chaque feature est autonome avec ses hooks, components, types, stores
 * Usage: import { useScan, ScanResult } from '@/features/scan';
 */

// Core Features (existants)
export * as scan from './scan';
export * as journal from './journal';
export * as coach from './coach';
export * as breath from './breath';
export * as gamification from './gamification';

// Community & Social (existants)
export * as socialCocon from './social-cocon';
export * as leaderboard from './leaderboard';

// Specialized (existants)
export * as orchestration from './orchestration';

// Note: Les autres features seront ajoutées progressivement
// lors de la migration complète de l'architecture
