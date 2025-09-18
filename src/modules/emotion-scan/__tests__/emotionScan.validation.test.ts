import { describe, expect, it } from 'vitest';

import { emotionScanResponsesSchema } from '@/modules/emotion-scan/EmotionScanPage';

const buildValidPayload = () => ({
  active: 3,
  determined: 4,
  attentive: 3,
  inspired: 5,
  alert: 4,
  upset: 2,
  hostile: 1,
  ashamed: 2,
  nervous: 3,
  afraid: 2,
});

describe('emotionScanResponsesSchema', () => {
  it('accepts a fully completed questionnaire', () => {
    const result = emotionScanResponsesSchema.safeParse(buildValidPayload());

    expect(result.success).toBe(true);
  });

  it('rejects submissions with missing answers', () => {
    const invalid = { ...buildValidPayload() };
    delete invalid.alert;

    const result = emotionScanResponsesSchema.safeParse(invalid);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === 'alert')).toBe(true);
    }
  });

  it('rejects answers outside the Likert scale bounds', () => {
    const invalid = { ...buildValidPayload(), nervous: 6 };

    const result = emotionScanResponsesSchema.safeParse(invalid);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === 'nervous')).toBe(true);
    }
  });
});

