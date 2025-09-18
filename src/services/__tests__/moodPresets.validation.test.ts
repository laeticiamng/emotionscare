import { describe, expect, it } from 'vitest';
import { moodPresetPayloadSchema } from '@/services/moodPresetsService';

describe('moodPresetPayloadSchema', () => {
  const basePayload = {
    name: 'Calm Evening',
    description: 'Ambiance douce pour se détendre',
    blend: { joy: 0.3, calm: 0.8, energy: 0.4, focus: 0.6 },
    softness: 70,
    clarity: 45,
    userId: '00000000-0000-0000-0000-000000000001',
  };

  it('validates a complete payload', () => {
    const result = moodPresetPayloadSchema.safeParse(basePayload);
    expect(result.success).toBe(true);
  });

  it('rejects payloads with invalid blend values', () => {
    const result = moodPresetPayloadSchema.safeParse({
      ...basePayload,
      blend: { joy: 1.5, calm: -0.2, energy: 0.4, focus: 0.6 },
    });

    expect(result.success).toBe(false);
  });

  it('rejects payloads with too short names', () => {
    const result = moodPresetPayloadSchema.safeParse({
      ...basePayload,
      name: 'A',
    });

    expect(result.success).toBe(false);
  });
});
