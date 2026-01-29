/**
 * Context Lens Feature Module
 * MODULE 8 - EmotionsCare 2.0
 * 
 * Fonctionnalités :
 * - Moteur NLP multilingue (sentiment, 6 émotions, entités)
 * - Détection de patterns temporels et corrélations
 * - 30+ templates d'insights personnalisés
 * - Rapport hebdomadaire automatique
 * - Intégration coach IA
 */

// Types
export * from './types';

// Hooks
export {
  useContextLens,
  useContextLensInsights,
  useEmotionPatterns,
  useNLPAnalysis,
  useEmotionHistory,
  useCurrentEmotions,
  useWeeklyReport,
} from './hooks/useContextLens';

// Services
export { contextLensApi } from './services/contextLensApi';

// Components
export { default as ContextLensDashboard } from './components/ContextLensDashboard';
export { default as InsightCard } from './components/InsightCard';
export { default as EmotionGauge } from './components/EmotionGauge';
export { default as PatternCard } from './components/PatternCard';
export { default as EmotionHistoryChart, EmotionHistoryWithTabs } from './components/EmotionHistoryChart';
