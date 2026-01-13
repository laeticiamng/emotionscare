/**
 * Feature: Emotion Scan
 * Analyse émotionnelle via caméra, voix, texte
 */

// Components
export { default as CameraSampler } from './CameraSampler';
export { default as MicroGestes } from './MicroGestes';
export { default as SamSliders } from './SamSliders';

// Hooks (re-exports depuis hooks racine pour rétrocompatibilité)
export { useScan } from '@/hooks/useScan';
export { useScanHistory } from '@/hooks/useScanHistory';
export { useScanSettings } from '@/hooks/useScanSettings';
export { useScanRealtime } from '@/hooks/useScanRealtime';
export { useEmotionScan } from '@/hooks/useEmotionScan';
export { useEnhancedEmotionScan } from '@/hooks/useEnhancedEmotionScan';
export { useMultiSourceScan } from '@/hooks/useMultiSourceScan';

// Types
export interface ScanResult {
  id: string;
  user_id: string;
  emotions: EmotionScore[];
  source: 'camera' | 'voice' | 'text' | 'multi';
  confidence: number;
  created_at: string;
}

export interface EmotionScore {
  emotion: string;
  score: number;
  confidence: number;
}

export interface ScanSettings {
  enableCamera: boolean;
  enableVoice: boolean;
  enableText: boolean;
  autoSave: boolean;
  privacyMode: boolean;
}
