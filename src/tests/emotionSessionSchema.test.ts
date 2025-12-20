import { describe, expect, it } from 'vitest';

import {
  emotionInputSchema,
  emotionAnalysisSchema,
  emotionPlanSchema,
} from '@/features/emotion-sessions/emotionSessionSchema';

describe('emotionSession schemas', () => {
  it('validates text input', () => {
    const result = emotionInputSchema.parse({
      inputType: 'text',
      text: 'Je me sens stressé mais motivé pour avancer.',
      intensity: 7,
      contextTags: ['travail'],
    });

    expect(result.inputType).toBe('text');
    expect(result.intensity).toBe(7);
  });

  it('validates analysis response', () => {
    const parsed = emotionAnalysisSchema.parse({
      sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      detectedEmotions: [
        { label: 'stress', intensity: 0.7, confidence: 0.9, valence: -0.4 },
      ],
      primaryEmotion: 'stress',
      valence: -0.4,
      arousal: 0.7,
      summary: 'Je détecte une tension élevée avec une motivation sous-jacente.',
      modelVersion: 'gpt-4.1',
    });

    expect(parsed.detectedEmotions[0].label).toBe('stress');
  });

  it('validates plan response', () => {
    const parsed = emotionPlanSchema.parse({
      planId: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
      sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      estimatedDurationMin: 12,
      recommendations: [
        { type: 'breathing', title: 'Respiration carrée', description: '4 cycles lents', priority: 1 },
        { type: 'music', title: 'Ambiance apaisante', description: 'Musique douce', priority: 2 },
        { type: 'light', title: 'Lumière chaude', description: 'Intensité douce', priority: 3 },
      ],
    });

    expect(parsed.recommendations).toHaveLength(3);
  });
});
