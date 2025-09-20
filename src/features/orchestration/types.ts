export type TextProgressKey = 'doucement' | 'sur la bonne voie' | 'presque là';

export interface SetTextProgressAction {
  action: 'set_text_progress';
  key: TextProgressKey;
}

export interface InjectMicroLeversAction {
  action: 'inject_micro_levers';
  items: string[];
}

export type AmbitionOrchestrationAction = SetTextProgressAction | InjectMicroLeversAction;

export interface SetChallengeDurationAction {
  action: 'set_challenge_duration';
  ms: number;
}

export interface EnableCompassionStreakAction {
  action: 'enable_compassion_streak';
  enabled: boolean;
}

export type BossGritOrchestrationAction = SetChallengeDurationAction | EnableCompassionStreakAction;

export type PathVariantKey = 'hr' | 'default';

export interface SetPathVariantAction {
  action: 'set_path_variant';
  key: PathVariantKey;
}

export interface SetPathDurationAction {
  action: 'set_path_duration';
  ms: number;
}

export interface PostCtaAction {
  action: 'post_cta';
  key: 'nyvee_suggest';
}

export type BubbleBeatOrchestrationAction =
  | SetPathVariantAction
  | SetPathDurationAction
  | PostCtaAction;

export interface AmbitionOrchestratorInput {
  gasLevel: number;
}

export interface BossGritOrchestratorInput {
  gritLevel: number;
  brsLevel: number;
}

export interface BubbleBeatOrchestratorInput {
  pss10Level: number;
}
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
