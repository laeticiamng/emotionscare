/**
 * Marketplace Créateurs - Module 6 EmotionsCare 2.0
 * 
 * Plateforme permettant aux créateurs certifiés de publier
 * du contenu thérapeutique (audio, vidéo, programmes)
 */

// Types
export * from './types';

// Hooks
export { useMarketplace } from './hooks/useMarketplace';
export { useCreatorDashboard } from './hooks/useCreatorDashboard';
export { usePrograms } from './hooks/usePrograms';

// Services
export { marketplaceApi } from './services/marketplaceApi';

// Components
export { default as MarketplaceBrowser } from './components/MarketplaceBrowser';
export { default as CreatorDashboard } from './components/CreatorDashboard';
export { default as ProgramCard } from './components/ProgramCard';
export { default as CreatorProfile } from './components/CreatorProfile';
