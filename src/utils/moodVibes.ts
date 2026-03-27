// @ts-nocheck
export type MoodVibe = 'calm' | 'focus' | 'bright' | 'reset';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function resolveZone(value: number, thresholds: { low: number; high: number }): 'low' | 'medium' | 'high' {
  if (value <= thresholds.low) {
    return 'low';
  }
  if (value >= thresholds.high) {
    return 'high';
  }
  return 'medium';
}

/**
 * Convertit un couple valence/arousal en vibe simplifiée.
 * Les bornes sont volontairement larges pour garder une lecture qualitative.
 */
export function mapMoodToVibe(valence: number, arousal: number): MoodVibe {
  const clampedValence = clamp(valence, -100, 100);
  const clampedArousal = clamp(arousal, 0, 100);

  const valenceZone = resolveZone(clampedValence, { low: -25, high: 25 });
  const arousalZone = resolveZone(clampedArousal, { low: 40, high: 60 });

  if (valenceZone === 'high' && arousalZone === 'high') {
    return 'bright';
  }

  if (valenceZone === 'high') {
    return 'calm';
  }

  if (valenceZone === 'low' && arousalZone === 'low') {
    return 'reset';
  }

  if (arousalZone === 'high') {
    return 'focus';
  }

  if (valenceZone === 'low') {
    return 'reset';
  }

  return arousalZone === 'low' ? 'calm' : 'focus';
}

const VIBE_LABELS: Record<MoodVibe, string> = {
  calm: 'Calme',
  focus: 'Focus',
  bright: 'Bright',
  reset: 'Reset',
};

const VIBE_EMOJIS: Record<MoodVibe, string> = {
  calm: '😌',
  focus: '🎯',
  bright: '🌟',
  reset: '🌙',
};

export function getVibeLabel(vibe: MoodVibe): string {
  return VIBE_LABELS[vibe];
}

export function getVibeEmoji(vibe: MoodVibe): string {
  return VIBE_EMOJIS[vibe];
}
