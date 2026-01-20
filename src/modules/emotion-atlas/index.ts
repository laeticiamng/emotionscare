/**
 * Module Emotion Atlas - Cartographie émotionnelle interactive
 * Exploration visuelle de l'univers émotionnel de l'utilisateur
 */

// ============================================================================
// PAGE
// ============================================================================

export { EmotionAtlasPage } from './pages/EmotionAtlasPage';

// ============================================================================
// COMPONENTS
// ============================================================================

export { AtlasMap } from './components/AtlasMap';
export { AtlasEmotionNode } from './components/AtlasEmotionNode';
export { AtlasTimeline } from './components/AtlasTimeline';
export { AtlasFilters } from './components/AtlasFilters';
export { AtlasInsights } from './components/AtlasInsights';
export { AtlasLegend } from './components/AtlasLegend';

// ============================================================================
// SERVICE
// ============================================================================

export { EmotionAtlasService, emotionAtlasService } from './emotionAtlasService';
export type { EmotionAtlasStats } from './emotionAtlasService';

// ============================================================================
// HOOK
// ============================================================================

export { useEmotionAtlas } from './useEmotionAtlas';
export type { UseEmotionAtlasReturn } from './useEmotionAtlas';

// ============================================================================
// TYPES
// ============================================================================

export type {
  EmotionNode,
  EmotionConnection,
  AtlasData,
  AtlasFilter,
  AtlasInsight,
} from './types';

export { EMOTION_COLORS, EMOTION_CATEGORIES } from './types';
