/**
 * Module Emotion Scan
 * Scan émotionnel multi-modal (texte, voix, image, facial)
 * @version 1.0.0
 */

// ============================================================================
// SERVICE
// ============================================================================

export {
  EmotionScanService,
  emotionScanService,
  default as emotionScanServiceDefault
} from './emotionScanService';

// ============================================================================
// HOOKS
// ============================================================================

export { useEmotionScan } from './useEmotionScan';

// ============================================================================
// TYPES
// ============================================================================

export type {
  ScanMode,
  ScanSource,
  EmotionType,
  EmotionScore,
  EmotionVector,
  EmotionResult,
  EmotionAnalysisResult,
  FacialAnalysisResult,
  FacialLandmarks,
  BiometricData,
  EmotionScanSession,
  EmotionScanDB,
  CreateEmotionScan,
  UpdateEmotionScan,
  EmotionAnalysisConfig,
  EmotionScanStats,
  EmotionTrend,
  RealtimeScanState,
  ScanPermissions
} from './types';

// ============================================================================
// SCHEMAS (Zod)
// ============================================================================

export {
  ScanMode as ScanModeSchema,
  ScanSource as ScanSourceSchema,
  EmotionType as EmotionTypeSchema,
  EmotionScore as EmotionScoreSchema,
  EmotionVector as EmotionVectorSchema,
  EmotionResult as EmotionResultSchema,
  EmotionAnalysisResult as EmotionAnalysisResultSchema,
  FacialAnalysisResult as FacialAnalysisResultSchema,
  FacialLandmarks as FacialLandmarksSchema,
  BiometricData as BiometricDataSchema,
  EmotionScanSession as EmotionScanSessionSchema,
  EmotionScanDB as EmotionScanDBSchema,
  EmotionAnalysisConfig as EmotionAnalysisConfigSchema
} from './types';
