/**
 * 🚀 EMOTIONSCARE PLATFORM - EXPORTS PRINCIPAUX
 * Point d'entrée unifié pour tous les composants et services
 */

// Services unifiés
export { emotionsCareUnified } from '@/services/EmotionsCareUnifiedPlatform';
export { useEmotionsCarePlatform } from '@/hooks/useEmotionsCarePlatform';

// Composants premium
export { EmotionsCareMusicPlayer } from '@/components/music/EmotionsCareMusicPlayer';
export { EmotionScannerPremium } from '@/components/emotion/EmotionScannerPremium';
export { EnhancedAccessibility } from '@/components/accessibility/EnhancedAccessibility';

// Types unifiés
export * from '@/types/unified-emotions';

// Contexte musical (legacy support)
export { MusicProvider, useMusic } from '@/contexts/MusicContext';