export type BreathStepKind = 'in' | 'hold' | 'out';

export interface Step {
  /** Kind of respiratory step. */
  kind: BreathStepKind;
  /** Duration of the step in milliseconds. */
  ms: number;
}

export type ProtocolPreset = '478' | 'coherence';

export interface ProtocolOverrides {
  /** Override for inhale phase duration in milliseconds. */
  inMs?: number;
  /** Override for hold phase duration in milliseconds (4-7-8 only). */
  holdMs?: number;
  /** Override for exhale phase duration in milliseconds. */
  outMs?: number;
}

export interface ProtocolConfig extends ProtocolOverrides {
  /** Total duration in minutes. */
  minutes?: number;
}

const clampDuration = (value: number | undefined, fallback: number): number => {
  if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
    return fallback;
  }
  return Math.round(value);
};

const DEFAULT_CYCLES: Record<ProtocolPreset, Step[]> = {
  '478': [
    { kind: 'in', ms: 4_000 },
    { kind: 'hold', ms: 7_000 },
    { kind: 'out', ms: 8_000 },
  ],
  coherence: [
    { kind: 'in', ms: 5_000 },
    { kind: 'out', ms: 5_000 },
  ],
};

const clampMinutes = (minutes: number | undefined): number => {
  if (typeof minutes !== 'number' || Number.isNaN(minutes)) {
    return 5;
  }

  const bounded = Math.max(0.5, Math.min(60, minutes));
  return Math.round(bounded * 100) / 100;
};

const applyOverrides = (preset: ProtocolPreset, overrides?: ProtocolOverrides): Step[] => {
  const base = DEFAULT_CYCLES[preset];
  if (!overrides) {
    return base.map(step => ({ ...step }));
  }

  return base.map(step => {
    switch (step.kind) {
      case 'in':
        return { kind: 'in', ms: clampDuration(overrides.inMs, step.ms) };
      case 'hold':
        return { kind: 'hold', ms: clampDuration(overrides.holdMs, step.ms) };
      case 'out':
        return { kind: 'out', ms: clampDuration(overrides.outMs, step.ms) };
      default:
        return { ...step };
    }
  });
};

export function makeProtocol(
  preset: ProtocolPreset,
  minutesOrConfig: number | ProtocolConfig = 5,
  maybeOverrides?: ProtocolOverrides,
): Step[] {
  const config = typeof minutesOrConfig === 'number'
    ? { minutes: minutesOrConfig, ...maybeOverrides }
    : minutesOrConfig;

  const minutes = clampMinutes(config.minutes);
  const totalMs = Math.round(minutes * 60_000);
  const cycle = applyOverrides(preset, config);

  const steps: Step[] = [];
  let elapsed = 0;

  if (totalMs <= 0 || cycle.length === 0) {
    return steps;
  }

  while (elapsed < totalMs) {
    for (const template of cycle) {
      if (elapsed >= totalMs) {
        break;
      }

      const remaining = totalMs - elapsed;
      const duration = Math.min(template.ms, remaining);
      steps.push({ kind: template.kind, ms: duration });
      elapsed += duration;
    }
  }

  return steps;
}

export const getTotalDuration = (steps: Step[]): number =>
  steps.reduce((acc, step) => acc + Math.max(0, step.ms), 0);

export const getCycleDuration = (preset: ProtocolPreset, overrides?: ProtocolOverrides): number =>
  applyOverrides(preset, overrides).reduce((acc, step) => acc + step.ms, 0);
