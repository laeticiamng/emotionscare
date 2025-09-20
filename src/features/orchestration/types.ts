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
