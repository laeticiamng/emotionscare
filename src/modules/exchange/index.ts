/**
 * EmotionsCare Exchange Module V2.0
 * 
 * The first global platform where emotions, time, trust, and personal progress
 * become interactive and exchangeable values.
 */

// Main Component
export { default as ExchangeHub } from './components/ExchangeHub';

// Market Components
export { default as ImprovementMarket } from './components/ImprovementMarket';
export { default as TrustMarket } from './components/TrustMarket';
export { default as TimeExchangeMarket } from './components/TimeExchangeMarket';
export { default as EmotionMarket } from './components/EmotionMarket';
export { default as ExchangeLeaderboard } from './components/ExchangeLeaderboard';

// Hooks
export * from './hooks/useExchangeData';

// Types
export * from './types';
