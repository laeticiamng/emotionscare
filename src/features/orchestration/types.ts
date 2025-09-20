export type UIHint =
  | { action: 'show_banner'; key: 'listen_two_minutes' }
  | { action: 'pin_card'; key: 'social_cocon' }
  | { action: 'suggest_replies'; key: 'empathic_templates' }
  | { action: 'prioritize_cta'; key: 'plan_pause' }
  | { action: 'promote_rooms_private'; enabled: boolean }
  | { action: 'set_aura'; key: 'cool_gentle' | 'neutral' | 'warm_soft' };

export interface CommunityLevels {
  ucla3Level?: number;
  mspssLevel?: number;
}

export interface SocialCoconLevels {
  mspssLevel?: number;
}

export interface AurasLevels {
  who5Level?: number;
}

export type Orchestrator<TInput> = (input: TInput) => UIHint[];

export const serializeHints = (hints: UIHint[]): string[] =>
  hints.map((hint) => {
    if ('key' in hint) {
      return `${hint.action}:${hint.key}`;
    }
    if ('enabled' in hint) {
      return `${hint.action}:${hint.enabled ? 'on' : 'off'}`;
    }
    return hint.action;
  });
