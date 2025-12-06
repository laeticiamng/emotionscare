// @ts-nocheck
export type CoachAction =
  | { action: 'set_response_mode'; key: 'micro' | 'brief' }
  | { action: 'queue_microcards'; keys: string[] }
  | { action: 'set_tone'; key: 'soft' | 'neutral' }
  | { action: 'suggest_next'; key: 'breath_1min' | 'walk_2min' | 'note_thought' | 'nyvee' | 'none' }
  | { action: 'llm_guardrails'; enabled: boolean };

export interface ComputeCoachActionsInputs {
  aaqLevel: 0 | 1 | 2 | 3 | 4;
  distressHint?: 'low' | 'mid' | 'high';
}

export function computeCoachActions({ aaqLevel, distressHint }: ComputeCoachActionsInputs): CoachAction[] {
  const acts: CoachAction[] = [
    { action: 'set_tone', key: 'soft' },
    { action: 'llm_guardrails', enabled: true },
  ];

  if (aaqLevel >= 3) {
    acts.push(
      { action: 'set_response_mode', key: 'micro' },
      { action: 'queue_microcards', keys: ['defusion_observe', 'label_thought', 'ground_body'] },
      { action: 'suggest_next', key: distressHint === 'high' ? 'nyvee' : 'breath_1min' },
    );
  } else if (aaqLevel === 2) {
    acts.push(
      { action: 'set_response_mode', key: 'brief' },
      { action: 'queue_microcards', keys: ['defusion_observe'] },
      { action: 'suggest_next', key: 'note_thought' },
    );
  } else {
    acts.push(
      { action: 'set_response_mode', key: 'brief' },
      { action: 'queue_microcards', keys: [] },
      { action: 'suggest_next', key: 'walk_2min' },
    );
  }

  return acts;
}
