// @ts-nocheck
import { describe, it, expect } from 'vitest';
import {
  validateScanConfig,
  validateEmotionResult,
  isScanModeSupported,
  calculateScanQuality,
  sanitizeScanData,
  compareEmotionResults,
} from '../scanValidation';
import { EmotionResult, EmotionAnalysisConfig } from '@/types/emotion';

describe('scanValidation', () => {
  describe('validateScanConfig', () => {
    it('should validate a correct config', () => {
      const config: EmotionAnalysisConfig = {
        duration: 15,
        sensitivity: 75,
        sources: ['facial'],
        realTimeUpdates: true,
        biometricTracking: true,
        confidenceThreshold: 70,
        noiseReduction: true,
        smoothingFactor: 0.3,
        predictiveMode: true,
      };

      const result = validateScanConfig(config);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject config with duration too short', () => {
      const config: EmotionAnalysisConfig = {
        duration: 3,
        sensitivity: 75,
        sources: ['facial'],
        realTimeUpdates: true,
        biometricTracking: true,
      };

      const result = validateScanConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('La durée du scan doit être d\'au moins 5 secondes');
    });

    it('should reject config with duration too long', () => {
      const config: EmotionAnalysisConfig = {
        duration: 400,
        sensitivity: 75,
        sources: ['facial'],
        realTimeUpdates: true,
        biometricTracking: true,
      };

      const result = validateScanConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('La durée du scan ne peut pas dépasser 5 minutes (300 secondes)');
    });

    it('should warn on short duration', () => {
      const config: EmotionAnalysisConfig = {
        duration: 7,
        sensitivity: 75,
        sources: ['facial'],
        realTimeUpdates: true,
        biometricTracking: true,
      };

      const result = validateScanConfig(config);
      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should reject invalid sensitivity', () => {
      const config: EmotionAnalysisConfig = {
        duration: 15,
        sensitivity: 150,
        sources: ['facial'],
        realTimeUpdates: true,
        biometricTracking: true,
      };

      const result = validateScanConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('La sensibilité doit être comprise entre 0 et 100');
    });

    it('should reject config with no sources', () => {
      const config: EmotionAnalysisConfig = {
        duration: 15,
        sensitivity: 75,
        sources: [],
        realTimeUpdates: true,
        biometricTracking: true,
      };

      const result = validateScanConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Au moins une source d\'analyse doit être sélectionnée');
    });
  });

  describe('validateEmotionResult', () => {
    it('should validate a correct emotion result', () => {
      const result: EmotionResult = {
        emotion: 'happy',
        confidence: 85,
        valence: 0.7,
        arousal: 0.6,
        timestamp: new Date(),
      };

      const validation = validateEmotionResult(result);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should reject empty emotion', () => {
      const result: EmotionResult = {
        emotion: '',
        confidence: 85,
        valence: 0.7,
        arousal: 0.6,
        timestamp: new Date(),
      };

      const validation = validateEmotionResult(result);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('L\'émotion détectée ne peut pas être vide');
    });

    it('should reject invalid confidence', () => {
      const result: EmotionResult = {
        emotion: 'happy',
        confidence: 150,
        valence: 0.7,
        arousal: 0.6,
        timestamp: new Date(),
      };

      const validation = validateEmotionResult(result);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('La confiance doit être comprise entre 0 et 100');
    });

    it('should warn on low confidence', () => {
      const result: EmotionResult = {
        emotion: 'happy',
        confidence: 40,
        valence: 0.7,
        arousal: 0.6,
        timestamp: new Date(),
      };

      const validation = validateEmotionResult(result);
      expect(validation.isValid).toBe(true);
      expect(validation.warnings).toContain('Confiance faible: les résultats peuvent ne pas être fiables');
    });

    it('should reject future timestamp', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const result: EmotionResult = {
        emotion: 'happy',
        confidence: 85,
        valence: 0.7,
        arousal: 0.6,
        timestamp: futureDate,
      };

      const validation = validateEmotionResult(result);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Le timestamp ne peut pas être dans le futur');
    });
  });

  describe('isScanModeSupported', () => {
    it('should return true for supported modes', () => {
      expect(isScanModeSupported('text')).toBe(true);
      expect(isScanModeSupported('voice')).toBe(true);
      expect(isScanModeSupported('facial')).toBe(true);
      expect(isScanModeSupported('combined')).toBe(true);
      expect(isScanModeSupported('realtime')).toBe(true);
    });

    it('should return false for unsupported modes', () => {
      expect(isScanModeSupported('invalid')).toBe(false);
      expect(isScanModeSupported('audio')).toBe(false);
    });
  });

  describe('calculateScanQuality', () => {
    it('should calculate quality score correctly', () => {
      const result: EmotionResult = {
        emotion: 'happy',
        confidence: 90,
        valence: 0.8,
        arousal: 0.6,
        timestamp: new Date(),
        biometrics: {
          heartRate: 70,
        },
        predictions: {
          nextEmotionLikely: 'calm',
        },
      };

      const config: EmotionAnalysisConfig = {
        duration: 30,
        sensitivity: 75,
        sources: ['facial', 'voice', 'text'],
        realTimeUpdates: true,
        biometricTracking: true,
        predictiveMode: true,
      };

      const quality = calculateScanQuality(result, config);
      expect(quality).toBeGreaterThan(0);
      expect(quality).toBeLessThanOrEqual(100);
    });

    it('should give higher score for multi-source scans', () => {
      const result: EmotionResult = {
        emotion: 'happy',
        confidence: 90,
        valence: 0.8,
        arousal: 0.6,
        timestamp: new Date(),
      };

      const singleSourceConfig: EmotionAnalysisConfig = {
        duration: 30,
        sensitivity: 75,
        sources: ['facial'],
        realTimeUpdates: true,
        biometricTracking: false,
        predictiveMode: false,
      };

      const multiSourceConfig: EmotionAnalysisConfig = {
        duration: 30,
        sensitivity: 75,
        sources: ['facial', 'voice', 'text'],
        realTimeUpdates: true,
        biometricTracking: true,
        predictiveMode: true,
      };

      const singleScore = calculateScanQuality(result, singleSourceConfig);
      const multiScore = calculateScanQuality(result, multiSourceConfig);

      expect(multiScore).toBeGreaterThan(singleScore);
    });
  });

  describe('sanitizeScanData', () => {
    it('should sanitize emotion result', () => {
      const result: EmotionResult = {
        emotion: '  Happy  ',
        confidence: 85,
        valence: 1.5, // Out of range
        arousal: -0.2, // Out of range
        timestamp: new Date(),
      };

      const sanitized = sanitizeScanData(result);
      expect(sanitized.emotion).toBe('happy');
      expect(sanitized.valence).toBe(1);
      expect(sanitized.arousal).toBe(0);
    });
  });

  describe('compareEmotionResults', () => {
    it('should detect emotion change', () => {
      const previous: EmotionResult = {
        emotion: 'happy',
        confidence: 80,
        valence: 0.7,
        arousal: 0.6,
        timestamp: new Date(),
      };

      const current: EmotionResult = {
        emotion: 'sad',
        confidence: 75,
        valence: -0.5,
        arousal: 0.3,
        timestamp: new Date(),
      };

      const comparison = compareEmotionResults(previous, current);
      expect(comparison.emotionChanged).toBe(true);
      expect(comparison.isSignificantChange).toBe(true);
    });

    it('should detect no significant change', () => {
      const previous: EmotionResult = {
        emotion: 'happy',
        confidence: 80,
        valence: 0.7,
        arousal: 0.6,
        timestamp: new Date(),
      };

      const current: EmotionResult = {
        emotion: 'happy',
        confidence: 82,
        valence: 0.72,
        arousal: 0.62,
        timestamp: new Date(),
      };

      const comparison = compareEmotionResults(previous, current);
      expect(comparison.emotionChanged).toBe(false);
      expect(comparison.isSignificantChange).toBe(false);
    });
  });
});
