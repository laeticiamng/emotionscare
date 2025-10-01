// @ts-nocheck
import { describe, expect, it } from 'vitest';

import {
  PresetInsertSchema,
  PresetRecordSchema,
  PresetUpdateSchema,
  SlidersSchema,
  mapRecordToPreset,
} from '../types';

const baseSliders = { energy: 40, calm: 55, focus: 60, light: 50 };

describe('Mood mixer schemas', () => {
  it('validates slider ranges between 0 and 100', () => {
    expect(() => SlidersSchema.parse(baseSliders)).not.toThrow();
    expect(() => SlidersSchema.parse({ ...baseSliders, energy: 101 })).toThrow();
    expect(() => SlidersSchema.parse({ ...baseSliders, calm: -1 })).toThrow();
  });

  it('accepts valid preset insert payloads and rejects long names', () => {
    expect(() =>
      PresetInsertSchema.parse({ name: 'Respiration douce', sliders: baseSliders, userId: '00000000-0000-0000-0000-000000000000' })
    ).not.toThrow();

    expect(() =>
      PresetInsertSchema.parse({ name: '', sliders: baseSliders, userId: '00000000-0000-0000-0000-000000000000' })
    ).toThrow();

    expect(() =>
      PresetInsertSchema.parse({
        name: 'A'.repeat(41),
        sliders: baseSliders,
        userId: '00000000-0000-0000-0000-000000000000',
      })
    ).toThrow();
  });

  it('parses database records and maps to UI models', () => {
    const record = PresetRecordSchema.parse({
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Brise matinale',
      sliders: baseSliders,
      created_at: '2025-01-01T10:00:00.000Z',
      updated_at: '2025-01-01T10:05:00.000Z',
    });

    const preset = mapRecordToPreset(record);
    expect(preset).toMatchObject({
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Brise matinale',
      sliders: baseSliders,
      createdAt: '2025-01-01T10:00:00.000Z',
      updatedAt: '2025-01-01T10:05:00.000Z',
    });
  });

  it('accepts partial preset updates', () => {
    expect(() => PresetUpdateSchema.parse({ name: 'Nouvelle douceur' })).not.toThrow();
    expect(() => PresetUpdateSchema.parse({ sliders: { ...baseSliders, light: 80 } })).not.toThrow();
    expect(() => PresetUpdateSchema.parse({ sliders: { ...baseSliders, energy: 200 } })).toThrow();
  });
});
