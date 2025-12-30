/**
 * Bounce Back Module - Résilience et stratégies de coping
 */

export * from './types';
export * as bounceBackService from './bounceBackService';
export { useBounceBackMachine } from './useBounceBackMachine';

// Re-export components
export * from '@/components/bounce-back';

// Re-export hook
export { useBounceBattle } from '@/hooks/useBounceBattle';

// Re-export store
export { useBounceStore } from '@/store/bounce.store';
export type { StimulusSpec, CopingAnswer, HRVSummary, BattleEvent } from '@/store/bounce.store';
