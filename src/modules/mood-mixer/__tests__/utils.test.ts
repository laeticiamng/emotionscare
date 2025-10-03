import { describe, expect, it } from 'vitest';

import { buildMoodSummary, computeGradient, describeLevel, presetEmoji, sortPresetsByFreshness } from '../utils';

const sliders = { energy: 82, calm: 48, focus: 63, light: 90 };

describe('Mood mixer utils', () => {
  it('returns soft descriptors based on slider intensity', () => {
    expect(describeLevel('energy', 5)).toMatch(/repos/);
    expect(describeLevel('energy', 92)).toMatch(/flamme/);
    expect(describeLevel('light', 90)).toMatch(/rayon/);
  });

  it('builds a readable mood summary without numbers', () => {
    const summary = buildMoodSummary(sliders);
    expect(summary).toContain('Énergie');
    expect(summary).not.toMatch(/\d/);
  });

  it('computes a gradient string suitable for CSS backgrounds', () => {
    const gradient = computeGradient(sliders);
    expect(gradient).toMatch(/linear-gradient/);
    expect(gradient).toMatch(/hsla/);
  });

  it('generates a deterministic emoji for preset names', () => {
    const emojiA = presetEmoji('Brise Lagon');
    const emojiB = presetEmoji('Brise Lagon');
    const emojiC = presetEmoji('Éclat Solaire');
    expect(emojiA).toBe(emojiB);
    expect(emojiA).not.toBe(emojiC);
  });

  it('sorts presets by creation date descending', () => {
    const sorted = sortPresetsByFreshness([
      { id: 'b', createdAt: '2025-01-02T10:00:00.000Z' },
      { id: 'a', createdAt: '2025-01-05T10:00:00.000Z' },
      { id: 'c', createdAt: undefined },
    ]);

    expect(sorted.map((item) => item.id)).toEqual(['a', 'b', 'c']);
  });
});
