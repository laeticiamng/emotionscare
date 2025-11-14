import { describe, it, expect } from 'vitest';
import {
  humeToEmotionResult,
  voiceToEmotionResult,
  textToEmotionResult,
  samToEmotionResult,
  emojiToEmotionResult,
  legacyToEmotionResult,
  valenceArousalToEmotion,
  emotionToValenceArousal,
  mergeEmotionResults,
} from '../emotionConverters';
import type {
  HumeAnalysisResponse,
  VoiceAnalysisResponse,
  TextAnalysisResponse,
} from '@/types/emotion-unified';

describe('emotionConverters', () => {
  describe('humeToEmotionResult', () => {
    it('should convert Hume response to EmotionResult', () => {
      const humeResponse: HumeAnalysisResponse = {
        bucket: 'positif',
        label: 'joie',
        confidence: 0.9,
        advice: 'Continuez ainsi!',
        emotions: { joie: 0.9, bonheur: 0.7 },
      };

      const result = humeToEmotionResult(humeResponse);

      expect(result.emotion).toBe('joie');
      expect(result.source).toBe('facial');
      expect(result.confidence).toBe(90);
      expect(result.valence).toBe(75);
      expect(result.arousal).toBe(65);
      expect(result.feedback).toBe('Continuez ainsi!');
      expect(result.emotions).toEqual({ joie: 0.9, bonheur: 0.7 });
    });

    it('should handle different buckets correctly', () => {
      const buckets: Array<HumeAnalysisResponse['bucket']> = [
        'positif',
        'calme',
        'neutre',
        'tendu',
      ];

      buckets.forEach((bucket) => {
        const result = humeToEmotionResult({
          bucket,
          label: 'test',
          confidence: 0.8,
        });

        expect(result.valence).toBeGreaterThanOrEqual(0);
        expect(result.valence).toBeLessThanOrEqual(100);
        expect(result.arousal).toBeGreaterThanOrEqual(0);
        expect(result.arousal).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('voiceToEmotionResult', () => {
    it('should convert voice response to EmotionResult', () => {
      const voiceResponse: VoiceAnalysisResponse = {
        emotion: 'calme',
        valence: 65,
        arousal: 30,
        confidence: 85,
        emotions: { calme: 0.85, serein: 0.6 },
        latency_ms: 150,
      };

      const result = voiceToEmotionResult(voiceResponse);

      expect(result.emotion).toBe('calme');
      expect(result.source).toBe('voice');
      expect(result.valence).toBe(65);
      expect(result.arousal).toBe(30);
      expect(result.confidence).toBe(85);
      expect(result.metadata?.latency_ms).toBe(150);
    });
  });

  describe('textToEmotionResult', () => {
    it('should convert text response to EmotionResult', () => {
      const textResponse: TextAnalysisResponse = {
        emotion: 'inquiétude',
        valence: 35,
        arousal: 65,
        confidence: 78,
        summary: 'Sentiment général anxieux',
        emotions: { inquiétude: 0.78, stress: 0.45 },
        latency_ms: 200,
      };

      const result = textToEmotionResult(textResponse);

      expect(result.emotion).toBe('inquiétude');
      expect(result.source).toBe('text');
      expect(result.summary).toBe('Sentiment général anxieux');
      expect(result.metadata?.latency_ms).toBe(200);
    });
  });

  describe('samToEmotionResult', () => {
    it('should create EmotionResult from SAM values', () => {
      const result = samToEmotionResult(75, 60);

      expect(result.valence).toBe(75);
      expect(result.arousal).toBe(60);
      expect(result.source).toBe('sliders');
      expect(result.confidence).toBe(100); // User is certain
      expect(result.emotion).toBe('joie'); // Based on valence/arousal
    });

    it('should normalize out-of-bounds values', () => {
      const result = samToEmotionResult(150, -10);

      expect(result.valence).toBe(100);
      expect(result.arousal).toBe(0);
    });
  });

  describe('emojiToEmotionResult', () => {
    it('should convert emoji to EmotionResult', () => {
      const emojis = ['😊', '😢', '😠', '😌'];

      emojis.forEach((emoji) => {
        const result = emojiToEmotionResult(emoji);

        expect(result.source).toBe('emoji');
        expect(result.confidence).toBe(100);
        expect(result.emotion).toBeDefined();
        expect(result.valence).toBeGreaterThanOrEqual(0);
        expect(result.valence).toBeLessThanOrEqual(100);
      });
    });

    it('should handle unknown emoji with default values', () => {
      const result = emojiToEmotionResult('🤷');

      expect(result.emotion).toBe('neutre');
      expect(result.valence).toBe(50);
      expect(result.arousal).toBe(50);
    });
  });

  describe('legacyToEmotionResult', () => {
    it('should convert legacy format with score to confidence', () => {
      const legacy = {
        id: 'old-1',
        emotion: 'happy',
        score: 0.85,
        date: '2023-01-01',
        user_id: 'user123',
      };

      const result = legacyToEmotionResult(legacy);

      expect(result.id).toBe('old-1');
      expect(result.emotion).toBe('happy');
      expect(result.confidence).toBe(85); // score * 100
      expect(result.userId).toBe('user123');
      expect(result.metadata?.migrated).toBe(true);
    });

    it('should handle various timestamp formats', () => {
      const formats = [
        { timestamp: '2023-01-01T10:00:00Z' },
        { date: '2023-01-01' },
        { created_at: '2023-01-01' },
      ];

      formats.forEach((format) => {
        const result = legacyToEmotionResult({ emotion: 'test', ...format });
        expect(result.timestamp).toBeDefined();
      });
    });

    it('should handle object confidence', () => {
      const legacy = {
        emotion: 'test',
        confidence: { overall: 75, emotion: 80 },
      };

      const result = legacyToEmotionResult(legacy);
      expect(result.confidence).toBe(75);
    });
  });

  describe('valenceArousalToEmotion', () => {
    it('should map to correct emotions in circumplex model', () => {
      // High valence, high arousal -> excitation
      expect(valenceArousalToEmotion(80, 70)).toBe('excitation');

      // High valence, low arousal -> contentement
      expect(valenceArousalToEmotion(70, 30)).toBe('contentement');

      // Low valence, high arousal -> colère
      expect(valenceArousalToEmotion(25, 75)).toBe('colère');

      // Low valence, low arousal -> tristesse
      expect(valenceArousalToEmotion(25, 30)).toBe('tristesse');

      // Neutral
      expect(valenceArousalToEmotion(50, 50)).toBe('neutre');
    });

    it('should handle edge cases', () => {
      expect(valenceArousalToEmotion(0, 0)).toBe('tristesse');
      expect(valenceArousalToEmotion(100, 100)).toBe('excitation');
      expect(valenceArousalToEmotion(50, 0)).toBe('calme');
    });

    it('should clamp values to 0-100', () => {
      expect(() => valenceArousalToEmotion(-10, 50)).not.toThrow();
      expect(() => valenceArousalToEmotion(150, 50)).not.toThrow();
    });
  });

  describe('emotionToValenceArousal', () => {
    it('should map emotions to valence/arousal coordinates', () => {
      const joie = emotionToValenceArousal('joie');
      expect(joie.valence).toBeGreaterThan(60);
      expect(joie.arousal).toBeGreaterThan(50);

      const tristesse = emotionToValenceArousal('tristesse');
      expect(tristesse.valence).toBeLessThan(40);
      expect(tristesse.arousal).toBeLessThan(50);

      const colère = emotionToValenceArousal('colère');
      expect(colère.valence).toBeLessThan(30);
      expect(colère.arousal).toBeGreaterThan(70);

      const calme = emotionToValenceArousal('calme');
      expect(calme.valence).toBeGreaterThan(50);
      expect(calme.arousal).toBeLessThan(40);
    });

    it('should handle unknown emotions with default', () => {
      const result = emotionToValenceArousal('emotion_inconnue');
      expect(result.valence).toBe(50);
      expect(result.arousal).toBe(50);
    });

    it('should be case insensitive', () => {
      const lower = emotionToValenceArousal('joie');
      const upper = emotionToValenceArousal('JOIE');
      const mixed = emotionToValenceArousal('Joie');

      expect(lower).toEqual(upper);
      expect(lower).toEqual(mixed);
    });
  });

  describe('mergeEmotionResults', () => {
    const result1 = samToEmotionResult(80, 60); // High valence, medium arousal
    const result2 = samToEmotionResult(40, 70); // Low valence, high arousal
    const result3 = samToEmotionResult(60, 40); // Medium valence, low arousal

    it('should merge results with equal weights by default', () => {
      const merged = mergeEmotionResults([result1, result2, result3]);

      // Average: (80+40+60)/3 = 60
      expect(merged.valence).toBeCloseTo(60, 1);
      // Average: (60+70+40)/3 = 56.67
      expect(merged.arousal).toBeCloseTo(56.67, 1);
      expect(merged.metadata?.merged).toBe(true);
      expect(merged.metadata?.source_count).toBe(3);
    });

    it('should merge with custom weights', () => {
      const merged = mergeEmotionResults(
        [result1, result2],
        [0.7, 0.3] // 70% result1, 30% result2
      );

      // Weighted: 80*0.7 + 40*0.3 = 68
      expect(merged.valence).toBeCloseTo(68, 1);
      // Weighted: 60*0.7 + 70*0.3 = 63
      expect(merged.arousal).toBeCloseTo(63, 1);
    });

    it('should throw if results array is empty', () => {
      expect(() => mergeEmotionResults([])).toThrow();
    });

    it('should return single result if only one provided', () => {
      const merged = mergeEmotionResults([result1]);
      expect(merged).toEqual(result1);
    });

    it('should throw if weights length does not match results', () => {
      expect(() => mergeEmotionResults([result1, result2], [0.5])).toThrow();
    });

    it('should normalize weights that do not sum to 1', () => {
      const merged = mergeEmotionResults(
        [result1, result2],
        [2, 1] // Sum = 3, normalized to [0.67, 0.33]
      );

      // Check that weights were normalized
      expect(merged.metadata?.weights).toEqual([2 / 3, 1 / 3]);
    });

    it('should merge emotions from all results', () => {
      const r1 = samToEmotionResult(70, 50);
      r1.emotions = { joie: 0.7 };

      const r2 = samToEmotionResult(30, 60);
      r2.emotions = { anxiété: 0.6 };

      const merged = mergeEmotionResults([r1, r2]);

      expect(merged.emotions).toEqual({
        joie: 0.7,
        anxiété: 0.6,
      });
    });

    it('should merge different confidence formats', () => {
      const r1 = samToEmotionResult(70, 50);
      r1.confidence = 80;

      const r2 = samToEmotionResult(30, 60);
      r2.confidence = { overall: 90, emotion: 85 };

      const merged = mergeEmotionResults([r1, r2]);

      // Average: (80 + 90) / 2 = 85
      expect(merged.confidence).toBeCloseTo(85, 1);
    });
  });
});
