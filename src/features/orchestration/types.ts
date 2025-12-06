export type AuraKey = 'cool_gentle' | 'neutral' | 'warm_soft';

export type TextProgressKey = 'doucement' | 'sur la bonne voie' | 'presque là';

export interface SetAuraAction {
  action: 'set_aura';
  key: AuraKey;
}

export interface SetProgressTextAction {
  action: 'set_progress_text';
  key: TextProgressKey;
}

export interface InjectMicroLeversAction {
  action: 'inject_micro_levers';
  items: readonly string[];
}

export interface SetChallengeDurationAction {
  action: 'set_challenge_duration';
  ms: number;
}

export interface EnableCompassionStreakAction {
  action: 'enable_compassion_streak';
  enabled: boolean;
}

export type PathVariantKey = 'default' | 'hr';

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
  key: 'nyvee' | 'flash_glow';
}

export type AmbitionOrchestrationAction = SetProgressTextAction | InjectMicroLeversAction;

export type BossGritOrchestrationAction = SetChallengeDurationAction | EnableCompassionStreakAction;

export type BubbleBeatOrchestrationAction =
  | SetPathVariantAction
  | SetPathDurationAction
  | PostCtaAction;
export type PostCtaAction =
  | { action: 'post_cta'; key: 'nyvee_suggest' }
  | { action: 'post_cta'; key: 'screen_silk' }
  | { action: 'post_cta'; key: 'flash_glow' };

export type BubbleBeatOrchestrationAction = SetPathVariantAction | SetPathDurationAction | PostCtaAction;

export type AurasOrchestrationAction = SetAuraAction;

export interface AmbitionOrchestratorInput {
  gasLevel?: number;
}

export interface BossGritOrchestratorInput {
  gritLevel?: number;
  brsLevel?: number;
}

export interface BubbleBeatOrchestratorInput {
  pssLevel?: number;
}

export type AssessmentLevel = 0 | 1 | 2 | 3 | 4;

export interface SetStoryBedAction {
  action: 'set_story_bed';
  key: 'cocon';
}

export interface SetStoryVoiceAction {
  action: 'set_story_voice';
  key: 'slow';
}

export interface ShortenSceneAction {
  action: 'shorten_scene';
  ms: number;
}

export interface ShowHighlightsAction {
  action: 'show_highlights';
  items: string[];
}

export interface SetBlinkReminderAction {
  action: 'set_blink_reminder';
  key: 'gentle';
}

export interface SetBlurOpacityAction {
  action: 'set_blur_opacity';
  key: 'low' | 'very_low';
}

export interface ShowBarsTextAction {
  action: 'show_bars_text';
  items: string[];
}

export type UIHint =
  | { action: 'show_banner'; key: 'listen_two_minutes' }
  | { action: 'pin_card'; key: 'social_cocon' }
  | { action: 'show_empathic_replies' }
  | { action: 'promote_cta'; key: 'schedule_break' }
  | { action: 'highlight_rooms_private' }
  | { action: 'none' }
  | SetAuraAction
  | SetProgressTextAction
  | InjectMicroLeversAction
  | SetChallengeDurationAction
  | EnableCompassionStreakAction
  | SetPathVariantAction
  | SetPathDurationAction
  | { action: 'set_aura'; key: 'cool_gentle' | 'neutral' | 'warm_soft' }
  | SetStoryBedAction
  | SetStoryVoiceAction
  | ShortenSceneAction
  | ShowHighlightsAction
  | SetBlinkReminderAction
  | SetBlurOpacityAction
  | ShowBarsTextAction
  | PostCtaAction;

export interface CommunityLevels {
  uclaLevel?: number;
  mspssLevel?: number;
  consented: boolean;
}

export interface SocialCoconLevels {
  mspssLevel?: number;
  consented: boolean;
}

export interface AurasLevels {
  who5Level?: number;
}

export type Orchestrator<TInput, THint extends UIHint = UIHint> = (input: TInput) => THint[];

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
