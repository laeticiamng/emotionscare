/**
 * Flash Glow Module - Export principal
 */

// Hooks & Services
export { useFlashGlowMachine } from './useFlashGlowMachine';
export { flashGlowService } from './flash-glowService';

// UI Components
export { default as VelvetPulse } from './ui/VelvetPulse';
export { default as EndChoice } from './ui/EndChoice';
export { default as FlashGlowSettingsPanel } from './ui/FlashGlowSettingsPanel';
export { default as FlashGlowStatsPanel } from './ui/FlashGlowStatsPanel';
export { default as FlashGlowAchievements } from './ui/FlashGlowAchievements';
export { default as FlashGlowSessionHistory } from './ui/FlashGlowSessionHistory';

// Types
export type { FlashGlowSession, FlashGlowResponse, FlashGlowStats, FlashGlowAchievement } from './flash-glowService';