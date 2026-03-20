import { useCallback, useMemo, useState } from 'react';

import { addBreadcrumb } from '@/lib/obs/breadcrumb';

import { computeMusicActions, type MusicAction } from '@/features/orchestration/music.orchestrator';
import type { UseMusicEngine } from '@/features/music/useMusicEngine';
import { persistMusicSession } from '@/features/session/persistSession';

interface ApplyInputs {
  tensionLevel?: number;
  fatigueLevel?: number;
  vigorLevel?: number;
  consented: boolean;
  prm: boolean;
}

type SessionStatus = 'idle' | 'running' | 'completed';

type PostCta = 'nyvee' | 'encore_2min' | 'none';

type VisualizerMode = 'reduced' | 'standard';

const logBreadcrumb = (message: string, data?: Record<string, unknown>) => {
  addBreadcrumb('music', { message, data });
};

export interface MusicSessionState {
  status: SessionStatus;
  postCta: PostCta;
  visualizerMode: VisualizerMode;
  lastActions: MusicAction[];
}

export interface MusicSessionControls {
  state: MusicSessionState;
  apply: (inputs: ApplyInputs) => void;
  persist: (options?: { durationSec?: number }) => Promise<void>;
  markPreShown: () => void;
  markPreSubmitted: () => void;
  markPostSubmitted: () => void;
}

const applyAction = (engine: UseMusicEngine, action: MusicAction) => {
  switch (action.action) {
    case 'set_texture':
      engine.setTexture(action.key);
      break;
    case 'set_intensity':
      engine.setIntensity(action.key);
      break;
    case 'set_bpm_profile':
      engine.setBpmProfile(action.key);
      break;
    case 'set_crossfade':
      engine.setCrossfade(action.ms);
      break;
    default:
      break;
  }
};

export function useMusicSession(engine: UseMusicEngine): MusicSessionControls {
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [postCta, setPostCta] = useState<PostCta>('none');
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>('standard');
  const [lastActions, setLastActions] = useState<MusicAction[]>([]);

  const apply = useCallback(
    (inputs: ApplyInputs) => {
      const actions = computeMusicActions(inputs);
      setLastActions(actions);

      let cta: PostCta = postCta;
      let visualizer: VisualizerMode = visualizerMode;

      actions.forEach((action) => {
        if (action.action === 'post_cta') {
          cta = action.key;
          if (action.key === 'nyvee') {
            logBreadcrumb('music:cta:nyvee');
          } else if (action.key === 'encore_2min') {
            logBreadcrumb('music:cta:encore2min');
          }
          return;
        }

        if (action.action === 'visualizer_mode') {
          visualizer = action.key;
          return;
        }

        applyAction(engine, action);
      });

      setPostCta(cta);
      setVisualizerMode(visualizer);
      setStatus('running');
      logBreadcrumb('music:engine:applied_actions', { count: actions.length });
    },
    [engine, postCta, visualizerMode],
  );

  const persist = useCallback(
    async (options?: { durationSec?: number }) => {
      const payload = {
        module: 'music' as const,
        metadata: {
          texture: engine.state.texture,
          intensity: engine.state.intensity,
          bpm_profile: engine.state.bpmProfile,
          crossfade_ms: engine.state.crossfadeMs,
          post_cta: postCta,
        },
        durationSec: options?.durationSec,
      };

      try {
        await persistMusicSession(payload);
        setStatus('completed');
      } catch (error) {
        // Already reported in persistSession
      }
    },
    [engine.state.bpmProfile, engine.state.crossfadeMs, engine.state.intensity, engine.state.texture, postCta],
  );

  const markPreShown = useCallback(() => logBreadcrumb('music:pre:shown'), []);
  const markPreSubmitted = useCallback(() => logBreadcrumb('music:pre:submitted'), []);
  const markPostSubmitted = useCallback(() => logBreadcrumb('music:post:submitted'), []);

  return useMemo(
    () => ({
      state: { status, postCta, visualizerMode, lastActions },
      apply,
      persist,
      markPreShown,
      markPreSubmitted,
      markPostSubmitted,
    }),
    [apply, persist, status, postCta, visualizerMode, lastActions, markPreShown, markPreSubmitted, markPostSubmitted],
  );
}
