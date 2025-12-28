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

// Profile & Requests Components
export { default as TimeExchangeRequests } from './components/TimeExchangeRequests';
export { default as ExchangeProfileCard } from './components/ExchangeProfileCard';
export { default as MatchingPanel } from './components/MatchingPanel';

// New Components
export { default as ExchangeNotifications } from './components/ExchangeNotifications';
export { default as MarketTrendChart } from './components/MarketTrendChart';
export { default as EmotionPortfolioPanel } from './components/EmotionPortfolioPanel';
export { default as EmotionTransactionHistory } from './components/EmotionTransactionHistory';
export { default as ExchangeDataExport } from './components/ExchangeDataExport';
export { default as ImprovementProgressChart } from './components/ImprovementProgressChart';
export { default as TrustActivityFeed } from './components/TrustActivityFeed';

// Hooks
export * from './hooks/useExchangeData';
export * from './hooks/useExchangeMatching';

// Types
export * from './types';
