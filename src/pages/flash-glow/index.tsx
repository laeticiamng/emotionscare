// @ts-nocheck
"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { captureException } from '@/lib/ai-monitoring';
import { Link } from 'react-router-dom';
import * as Sentry from '@/lib/errors/sentry-compat';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { useConsent } from '@/features/clinical-optin/ConsentProvider';
import { useAssessment } from '@/features/assess/useAssessment';
import { computeFlashGlowActions } from '@/features/orchestration/flashGlow.orchestrator';
import { useToast } from '@/hooks/use-toast';
import { useMotionPrefs } from '@/hooks/useMotionPrefs';
import { useSessionClock } from '@/hooks/useSessionClock';
import { GlowSurface } from '@/ui/GlowSurface';
import { WallOfLights } from '@/components/flashglow/WallOfLights';
import { useFlashPhases } from '@/modules/flash-glow/useFlashPhases';
import {
  computeMoodDelta,
  getCurrentMoodSnapshot,
  logAndJournal,
  type MoodSnapshot,
} from '@/modules/flash-glow/sessionService';
import useCurrentMood from '@/hooks/useCurrentMood';
import { ff } from '@/lib/flags/ff';
import { useClinicalHints } from '@/hooks/useClinicalHints';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';

const completionToastMessage = 'ça vient';
const BASE_DURATION_MS = 90_000;
const EXTENSION_DURATION_MS = 60_000;
const SUDS_COOLDOWN_MS = 24 * 60 * 60 * 1000;

const PHASE_APPEARANCE: Record<string, { theme: 'cyan' | 'violet' | 'amber' | 'emerald'; shape: 'ring' | 'full'; intensity: number }> = {
  warmup: { theme: 'emerald', shape: 'ring', intensity: 0.45 },
  glow: { theme: 'amber', shape: 'full', intensity: 0.9 },
  settle: { theme: 'violet', shape: 'ring', intensity: 0.35 },
};

const primaryButtonLabels: Record<string, string> = {
  idle: 'Lancer la lueur',
  running: 'Mettre en pause',
  paused: 'Reprendre la lueur',
  completed: 'Relancer la bulle',
};

const statusLabels: Record<string, string> = {
  idle: 'Prête à démarrer',
  running: 'La lumière enveloppe',
  paused: 'Moment en suspens',
  completed: 'Séance terminée en douceur',
};

const SUDS_LEVELS = [
  {
    id: 'velours',
    score: 0,
    label: 'Velours apaisé',
    detail: 'Respiration fluide et présence tranquille.',
  },
  {
    id: 'souffle-doux',
    score: 2,
    label: 'Souffle doux',
    detail: 'Petit remous intérieur mais tout reste stable.',
  },
  {
    id: 'frisson',
    score: 4,
    label: 'Frémissement',
    detail: 'Une vibration légère à accompagner.',
  },
  {
    id: 'ondulation',
    score: 7,
    label: 'Tension présente',
    detail: 'Le corps reste un peu en alerte.',
  },
  {
    id: 'orage',
    score: 9,
    label: 'Tension forte',
    detail: 'Besoin de rester dans la bulle un peu plus longtemps.',
  },
] as const;

const SUDS_THRESHOLD_SCORE = 7;

const getSudsEntry = (index: number) => {
  const safeIndex = Math.max(0, Math.min(SUDS_LEVELS.length - 1, Math.round(index)));
  return SUDS_LEVELS[safeIndex];
};

type SudsStage = 'pre' | 'post';

type SudsRecord = {
  stage: SudsStage;
  entry: typeof SUDS_LEVELS[number];
  recordedAt: string;
  levelIndex: number;
  decision?: 'extend' | 'complete';
};

const describeMoodDeltaText = (delta: number | null): string => {
  if (delta == null) {
    return 'Je reste à l’écoute de ce qui émerge.';
  }

  if (delta >= 8) {
    return 'La détente se répand clairement.';
  }

  if (delta >= 3) {
    return 'Ça descend doucement, la lumière a bien aidé.';
  }

  if (delta > 0) {
    return 'Une légère éclaircie apparaît déjà.';
  }

  if (delta === 0) {
    return 'Sensation stable, la présence reste douce.';
  }

  if (delta <= -6) {
    return 'Encore un peu tendu, on prend soin de soi.';
  }

  return 'Les tensions restent présentes mais accompagnées.';
};

const buildProgressMessage = (state: string, progress: number): string => {
  if (state === 'idle') {
    return 'La séance est prête, prenez le temps avant de plonger dans la lumière.';
  }

  if (state === 'completed') {
    return 'La lumière se pose doucement, respirez à votre rythme.';
  }

  if (progress < 0.33) {
    return 'La lumière s’installe délicatement.';
  }

  if (progress < 0.66) {
    return 'Le halo enveloppe, il reste un petit moment.';
  }

  return 'On arrive vers la sortie douce, laissez-vous porter.';
};

const getPhaseNarrative = (label: string, description: string, next?: string | null) => {
  if (!next) {
    return `${label}. ${description}`;
  }
  return `${label}. ${description} Ensuite : ${next}.`;
};

const storeCooldown = (timestamp: number) => {
  try {
    window.localStorage.setItem('flash_glow_suds_cooldown', String(timestamp));
  } catch (error) {
    logger.error('Impossible de sauvegarder le cooldown SUDS', error as Error, 'SYSTEM');
  }
};

const getCooldown = (): number | null => {
  try {
    const raw = window.localStorage.getItem('flash_glow_suds_cooldown');
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  } catch (error) {
    logger.error('Impossible de lire le cooldown SUDS', error as Error, 'SYSTEM');
    return null;
  }
};

const storeOptIn = (value: boolean) => {
  try {
    window.localStorage.setItem('flash_glow_suds_opt_in', value ? 'true' : 'false');
  } catch (error) {
    logger.error('Impossible de stocker la préférence SUDS', error as Error, 'SYSTEM');
  }
};

const readOptIn = (): boolean | null => {
  try {
    const raw = window.localStorage.getItem('flash_glow_suds_opt_in');
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    return null;
  } catch (error) {
    logger.error('Impossible de lire la préférence SUDS', error as Error, 'SYSTEM');
    return null;
  }
};

const FlashGlowView: React.FC = () => {
  const flashEnabled = ff('FF_FLASH');
  const sudsEnabled = ff('FF_ASSESS_SUDS');
  const orchestratorEnabled = ff('FF_ORCH_FLASHGLOW');

  const { toast } = useToast();
  const motion = useMotionPrefs();
  const currentMood = useCurrentMood();
  const clinicalHints = useClinicalHints('flash_glow');
  const flashHints = {
    extendDuration: clinicalHints.hints.includes('extend_duration'),
  };
  const consent = useConsent();
  const { start: startSudsStage, submit: submitSudsStage } = useAssessment('SUDS');
  const [softEffects, setSoftEffects] = useState(motion.prefersReducedMotion);

  const beforeMoodRef = useRef<MoodSnapshot | null>(getCurrentMoodSnapshot());
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [extraDurationMs, setExtraDurationMs] = useState(0);
  const [hasExtended, setHasExtended] = useState(false);
  const [extensionActive, setExtensionActive] = useState(false);
  useEffect(() => {
    const shouldExtend = flashHints?.extendDuration ?? false;
    if (!shouldExtend && !hasExtended) {
      return;
    }

    if (shouldExtend && !hasExtended) {
      setExtraDurationMs(EXTENSION_DURATION_MS);
      setHasExtended(true);
      setExtensionActive(true);
    }

    if (!shouldExtend && hasExtended) {
      setExtraDurationMs(0);
      setHasExtended(false);
      setExtensionActive(false);
    }
  }, [flashHints?.extendDuration, hasExtended]);

  const [showSudsCard, setShowSudsCard] = useState(false);
  const [sudsOptIn, setSudsOptIn] = useState(false);
  const [preSudsLevel, setPreSudsLevel] = useState(2);
  const [postSudsLevel, setPostSudsLevel] = useState(2);
  const [preSudsRecorded, setPreSudsRecorded] = useState(false);
  const preSudsRecordRef = useRef<SudsRecord | null>(null);
  const [postRecords, setPostRecords] = useState<SudsRecord[]>([]);
  const [needsPostSuds, setNeedsPostSuds] = useState(false);
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const [pendingCompletionElapsed, setPendingCompletionElapsed] = useState<number | null>(null);
  const [isSubmittingSud, setIsSubmittingSud] = useState(false);
  const [pendingAction, setPendingAction] = useState<'extend_60s' | 'soft_exit' | 'cta_screen_silk' | null>(null);
  const [intendedVisuals, setIntendedVisuals] = useState<'baseline' | 'lowered'>('baseline');
  const [intendedBreath, setIntendedBreath] = useState<'steady' | 'exhale_longer'>('steady');
  const [intendedAudio, setIntendedAudio] = useState<'gentle' | 'slow'>('gentle');
  const [intendedHaptics, setIntendedHaptics] = useState<'default' | 'calm' | 'off'>('default');

  const totalDuration = BASE_DURATION_MS + extraDurationMs;

  const { snapshot, update } = useFlashPhases(totalDuration, {
    onPhaseChange: (phase) => {
      Sentry.addBreadcrumb({
        category: 'flash',
        level: 'info',
        message: 'flash:phase_change',
        data: { module: 'flash_glow', phase },
      });
    },
  });

  const session = useSessionClock({
    durationMs: totalDuration,
    tickMs: 1000,
    onTick: update,
  });

  const progressMessage = useMemo(
    () => buildProgressMessage(session.state, session.progress ?? 0),
    [session.state, session.progress],
  );

  const phaseNarrative = useMemo(
    () => getPhaseNarrative(snapshot.phase.label, snapshot.phase.description, snapshot.nextPhase?.label ?? null),
    [snapshot.phase.label, snapshot.phase.description, snapshot.nextPhase?.label],
  );

  useEffect(() => {
    if (motion.prefersReducedMotion) {
      setSoftEffects(true);
      setIntendedVisuals('lowered');
      setIntendedHaptics('off');
    }
  }, [motion.prefersReducedMotion]);

  useEffect(() => {
    if (!sudsEnabled) {
      return;
    }

    if (!consent.clinicalAccepted) {
      setShowSudsCard(false);
      setSudsOptIn(false);
      return;
    }

    const storedOptIn = readOptIn();
    if (storedOptIn === true) {
      setSudsOptIn(true);
      setShowSudsCard(false);
      return;
    }

    const cooldown = getCooldown();
    const now = Date.now();
    if (storedOptIn === false && cooldown && now - cooldown < SUDS_COOLDOWN_MS) {
      setShowSudsCard(false);
      return;
    }

    setShowSudsCard(true);
  }, [sudsEnabled, consent.clinicalAccepted]);

  useEffect(() => {
    if (sudsEnabled && showSudsCard && consent.clinicalAccepted) {
      Sentry.addBreadcrumb({
        category: 'orchestration',
        level: 'info',
        message: 'orch:flash_glow:pre_shown',
      });
    }
  }, [sudsEnabled, showSudsCard, consent.clinicalAccepted]);

  useEffect(() => {
    if (postDialogOpen && sudsEnabled && sudsOptIn && consent.clinicalAccepted) {
      Sentry.addBreadcrumb({
        category: 'orchestration',
        level: 'info',
        message: 'orch:flash_glow:post_shown',
      });
      void startSudsStage('post');
    }
  }, [postDialogOpen, sudsEnabled, sudsOptIn, consent.clinicalAccepted, startSudsStage]);

  const submitSudsMeasurement = async (
    stage: SudsStage,
    entry: typeof SUDS_LEVELS[number],
    levelIndex: number,
    decision?: 'extend' | 'complete',
  ) => {
    if (!sudsEnabled || !sudsOptIn || !consent.clinicalAccepted) {
      return true;
    }

    try {
      await startSudsStage(stage);
      const result = await submitSudsStage(
        stage,
        { '1': entry.score },
        { ts: new Date().toISOString() },
      );

      if (!result) {
        return false;
      }

      Sentry.addBreadcrumb({
        category: 'orchestration',
        level: 'info',
        message: stage === 'pre' ? 'orch:flash_glow:pre_submitted' : 'orch:flash_glow:post_submitted',
        data: {
          stage,
          decision: stage === 'post' ? decision ?? 'complete' : 'pre_measure',
          level: entry.id,
        },
      });

      const record: SudsRecord = {
        stage,
        entry,
        recordedAt: new Date().toISOString(),
        levelIndex,
        decision,
      };

      if (stage === 'pre') {
        preSudsRecordRef.current = record;
      } else {
        setPostRecords((prev) => [...prev, record]);
      }

      return true;
    } catch (error) {
      logger.error('Error submitting SUDS measure', error as Error, 'SYSTEM');
      toast({
        title: 'Mesure indisponible',
        description: 'Impossible de transmettre le ressenti pour le moment.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const applyOrchestratorIntent = (postLevelIndex: number) => {
    if (!orchestratorEnabled) {
      return;
    }

    const actions = computeFlashGlowActions({
      preLevel: preSudsRecordRef.current?.levelIndex ?? null,
      postLevel: postLevelIndex,
      prefersReducedMotion: motion.prefersReducedMotion,
      optedIn: sudsOptIn && consent.clinicalAccepted,
    });

    if (actions.extend_session) {
      setPendingAction('extend_60s');
    } else if (actions.soft_exit) {
      setPendingAction('soft_exit');
    } else if (actions.post_cta === 'screen_silk') {
      setPendingAction('cta_screen_silk');
    } else {
      setPendingAction(null);
    }

    setIntendedVisuals(
      actions.set_visuals_intensity ?? (motion.prefersReducedMotion ? 'lowered' : 'baseline'),
    );
    setIntendedBreath(actions.set_breath_pattern ?? 'steady');
    setIntendedAudio(actions.set_audio_fade ?? 'gentle');
    setIntendedHaptics(actions.set_haptics ?? (motion.prefersReducedMotion ? 'off' : 'default'));

    if (actions.toast_text === 'gratitude') {
      setFeedback('Merci pour ce partage, sortie douce préparée.');
    }
  };

  const handleStart = () => {
    beforeMoodRef.current = getCurrentMoodSnapshot();
    setFeedback(null);
    setHasExtended(false);
    setExtensionActive(false);
    setNeedsPostSuds(false);
    setPostRecords([]);
    setPendingCompletionElapsed(null);
    setExtraDurationMs(0);
    setPendingAction(null);
    setIntendedVisuals(motion.prefersReducedMotion ? 'lowered' : 'baseline');
    setIntendedBreath('steady');
    setIntendedAudio('gentle');
    setIntendedHaptics(motion.prefersReducedMotion ? 'off' : 'default');
    Sentry.addBreadcrumb({
      category: 'session',
      level: 'info',
      message: 'session:start',
      data: {
        module: 'flash_glow',
        duration_ms: totalDuration,
      },
    });
    update(0);
    session.start();

    if (sudsEnabled && sudsOptIn && consent.clinicalAccepted) {
      const entry = getSudsEntry(preSudsLevel);
      void submitSudsMeasurement('pre', entry, preSudsLevel).then((success) => {
        if (success) {
          setPreSudsRecorded(true);
        }
      });
    }
  };

  const handlePause = () => {
    Sentry.addBreadcrumb({
      category: 'session',
      level: 'info',
      message: 'session:pause',
      data: {
        module: 'flash_glow',
        elapsed_ms: session.elapsedMs,
      },
    });
    session.pause();
  };

  const handleResume = () => {
    Sentry.addBreadcrumb({
      category: 'session',
      level: 'info',
      message: 'session:resume',
      data: {
        module: 'flash_glow',
        elapsed_ms: session.elapsedMs,
      },
    });
    session.resume();
  };

  const handleRestart = () => {
    setExtraDurationMs(0);
    setHasExtended(false);
    setExtensionActive(false);
    setNeedsPostSuds(false);
    setPostRecords([]);
    setPendingCompletionElapsed(null);
    setPreSudsRecorded(false);
    preSudsRecordRef.current = null;
    setPostSudsLevel(preSudsLevel);
    session.reset();
    update(0);
    setPendingAction(null);
    setIntendedVisuals(motion.prefersReducedMotion ? 'lowered' : 'baseline');
    setIntendedBreath('steady');
    setIntendedAudio('gentle');
    setIntendedHaptics(motion.prefersReducedMotion ? 'off' : 'default');
    handleStart();
  };

  const finalizeSession = async (finalElapsed: number, action: 'extend_session' | 'soft_exit') => {
    if (isSaving) {
      return;
    }

    Sentry.addBreadcrumb({
      category: 'session',
      level: 'info',
      message: 'session:complete',
      data: {
        module: 'flash_glow',
        elapsed_ms: finalElapsed,
        action,
      },
    });

    session.complete(finalElapsed);

    const moodBefore = beforeMoodRef.current;
    const moodAfter = getCurrentMoodSnapshot();
    const delta = computeMoodDelta(moodBefore, moodAfter);
    const moodDeltaText = describeMoodDeltaText(delta);

    setIsSaving(true);

    try {
      await logAndJournal({
        type: 'flash_glow',
        duration_sec: Math.max(1, Math.round(finalElapsed / 1000)),
        mood_delta: delta,
        journalText: `Micro-séance Flash Glow. ${moodDeltaText}`,
        moodBefore,
        moodAfter,
        metadata: {
          timestamp: new Date().toISOString(),
          narrative: moodDeltaText,
          completion_mode: action === 'extend_session' ? 'prolongée' : 'sortie_douce',
          extension_used: hasExtended,
          phase_focus: snapshot.phase.key,
          suds: sudsOptIn
            ? {
                opt_in: true,
                pre: preSudsRecordRef.current
                  ? {
                      level: preSudsRecordRef.current.entry.id,
                      label: preSudsRecordRef.current.entry.label,
                      detail: preSudsRecordRef.current.entry.detail,
                    }
                  : null,
                post: postRecords.map((record) => ({
                  level: record.entry.id,
                  label: record.entry.label,
                  detail: record.entry.detail,
                  decision: record.decision ?? 'complete',
                })),
              }
            : { opt_in: false },
        },
      });

      setFeedback('Micro-séance enregistrée et ajoutée au journal.');
      toast({
        description: completionToastMessage,
      });
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Impossible d’enregistrer la séance pour le moment.';
      setFeedback(message);
      toast({
        title: 'Sauvegarde indisponible',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
      setExtensionActive(false);
      setPendingCompletionElapsed(null);
    }
  };

  const handleComplete = () => {
    if (isSaving) {
      return;
    }

    const finalElapsed = session.elapsedMs;

    if (sudsEnabled && sudsOptIn && (!preSudsRecorded || needsPostSuds || postRecords.length === 0)) {
      if (session.state === 'running') {
        session.pause();
      }
      setPendingCompletionElapsed(finalElapsed);
      setPostDialogOpen(true);
      return;
    }

    void finalizeSession(finalElapsed, hasExtended ? 'extend_session' : 'soft_exit');
  };

  const handlePrimary = () => {
    switch (session.state) {
      case 'idle':
        handleStart();
        break;
      case 'running':
        handlePause();
        break;
      case 'paused':
        handleResume();
        break;
      case 'completed':
        handleRestart();
        break;
      default:
        handleStart();
    }
  };

  const handleSudsDecline = () => {
    setSudsOptIn(false);
    setShowSudsCard(false);
    setPreSudsRecorded(false);
    preSudsRecordRef.current = null;
    setPostRecords([]);
    setNeedsPostSuds(false);
    storeOptIn(false);
    storeCooldown(Date.now());
    setPendingAction(null);
    setIntendedVisuals(motion.prefersReducedMotion ? 'lowered' : 'baseline');
    setIntendedBreath('steady');
    setIntendedAudio('gentle');
    setIntendedHaptics(motion.prefersReducedMotion ? 'off' : 'default');
  };

  const handleSudsOptIn = () => {
    setSudsOptIn(true);
    setShowSudsCard(false);
    setPreSudsRecorded(false);
    preSudsRecordRef.current = null;
    setPostRecords([]);
    setNeedsPostSuds(false);
    setPostSudsLevel(preSudsLevel);
    storeOptIn(true);
    setPendingAction(null);
    setIntendedVisuals(motion.prefersReducedMotion ? 'lowered' : 'baseline');
    setIntendedBreath('steady');
    setIntendedAudio('gentle');
    setIntendedHaptics(motion.prefersReducedMotion ? 'off' : 'default');
    try {
      window.localStorage.removeItem('flash_glow_suds_cooldown');
    } catch (error) {
      logger.error('Impossible de nettoyer le cooldown SUDS', error as Error, 'SYSTEM');
    }
  };

  const handlePostDialogChange = (open: boolean) => {
    setPostDialogOpen(open);
    if (!open) {
      setPendingCompletionElapsed(null);
      if (session.state === 'paused') {
        session.resume();
      }
    }
  };

  const completeWithoutSuds = () => {
    setPostDialogOpen(false);
    const elapsedForCompletion = pendingCompletionElapsed ?? session.elapsedMs;
    setPendingCompletionElapsed(null);
    setNeedsPostSuds(false);
    if (orchestratorEnabled) {
      setPendingAction('soft_exit');
    }
    void finalizeSession(elapsedForCompletion, hasExtended ? 'extend_session' : 'soft_exit');
  };

  const handlePostDecision = async (decision: 'extend' | 'complete') => {
    if (!sudsEnabled || !sudsOptIn) {
      completeWithoutSuds();
      return;
    }

    setIsSubmittingSud(true);

    const entry = getSudsEntry(postSudsLevel);
    const success = await submitSudsMeasurement(
      'post',
      entry,
      postSudsLevel,
      decision === 'extend' ? 'extend' : 'complete',
    );

    if (!success) {
      setIsSubmittingSud(false);
      return;
    }

    if (decision === 'extend') {
      setHasExtended(true);
      setNeedsPostSuds(true);
      setPostDialogOpen(false);
      setPendingCompletionElapsed(null);
      setExtraDurationMs((prev) => prev + EXTENSION_DURATION_MS);
      setExtensionActive(true);
      setFeedback('Encore un peu de lumière pour accompagner la tension.');
      toast({
        title: 'On prolonge un instant',
        description: 'La bulle reste ouverte un court moment.',
      });
      if (session.state === 'paused') {
        session.resume();
      }
      applyOrchestratorIntent(postSudsLevel);
      setIsSubmittingSud(false);
      return;
    }

    setNeedsPostSuds(false);
    setPostDialogOpen(false);
    const elapsedForCompletion = pendingCompletionElapsed ?? session.elapsedMs;
    applyOrchestratorIntent(postSudsLevel);
    void finalizeSession(elapsedForCompletion, hasExtended ? 'extend_session' : 'soft_exit');
    setIsSubmittingSud(false);
  };

  if (!flashEnabled) {
    return (
      <ConsentGate>
        <main className="mx-auto max-w-3xl space-y-6 p-6" data-testid="flash-glow-view">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Flash Glow</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Cette expérience lumineuse est momentanément indisponible.
              </p>
            </CardContent>
          </Card>
        </main>
      </ConsentGate>
    );
  }

  return (
    <ConsentGate>
      <main
        className="mx-auto max-w-3xl space-y-6 p-6"
        data-testid="flash-glow-view"
        data-visuals-intent={intendedVisuals}
        data-breath-intent={intendedBreath}
        data-audio-intent={intendedAudio}
        data-haptics-intent={intendedHaptics}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Flash Glow</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Cette expérience lumineuse est momentanément indisponible.
            </p>
          </CardContent>
        </Card>
      </main>
    </ConsentGate>
  );

  const appearance = PHASE_APPEARANCE[snapshot.phase.key] ?? PHASE_APPEARANCE.warmup;

  const phaseSurface = (
    <WallOfLights
      phase={snapshot.phase.key as 'warmup' | 'glow' | 'settle'}
      progress={snapshot.progress ?? 0}
      theme={appearance.theme}
      intensity={appearance.intensity}
    />
  );

  const progressValue = Math.max(0, Math.min(1, session.progress ?? 0));
  const ringStyle = {
    background: `conic-gradient(var(--primary) ${progressValue * 360}deg, var(--muted) ${progressValue * 360}deg)`
  } as React.CSSProperties;

  const primaryLabel = primaryButtonLabels[session.state] ?? primaryButtonLabels.idle;
  const stateLabel = statusLabels[session.state] ?? statusLabels.idle;

  return (
    <ConsentGate>
      <main
        className="mx-auto max-w-3xl space-y-6 p-6"
        data-testid="flash-glow-view"
        data-visuals-intent={intendedVisuals}
        data-breath-intent={intendedBreath}
      data-audio-intent={intendedAudio}
      data-haptics-intent={intendedHaptics}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Flash Glow apaisant</CardTitle>
          <p className="text-muted-foreground">
            Séance très courte pour réveiller un halo d’énergie sans sur-stimulation.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {motion.prefersReducedMotion && (
            <p className="text-xs text-muted-foreground" aria-live="polite">
              Indice accessibilité : mode « réduire le mouvement » actif, la lueur reste douce.
            </p>
          )}
          <section
            aria-live="polite"
            className="rounded-lg border p-4"
            style={{
              background: `linear-gradient(135deg, ${currentMood.palette.surface}, ${currentMood.palette.glow})`,
              borderColor: currentMood.palette.border,
              color: currentMood.palette.text,
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2 text-sm">
                <p className="text-xs uppercase tracking-wide" style={{ color: 'rgba(15, 23, 42, 0.55)' }}>
                  Aligné sur votre humeur
                </p>
                <p className="text-lg font-semibold">{currentMood.summary}</p>
                <p>{currentMood.microGesture}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  aria-label={`Vibe ${currentMood.label}`}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full shadow-lg"
                  style={{ background: currentMood.palette.base, color: currentMood.palette.text }}
                >
                  <span aria-hidden="true" className="text-2xl">
                    {currentMood.emoji}
                  </span>
                </span>
                <span className="text-xs font-medium uppercase tracking-wide">
                  {currentMood.label}
                </span>
              </div>
            </div>
          </section>

          <section aria-live="polite" className="rounded-lg bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">Statut de la séance</p>
            <p className="text-lg font-medium">{stateLabel}</p>
          </section>

          <section className="flex items-center gap-4" aria-live="polite">
            <div className="relative h-24 w-24" role="img" aria-label={progressMessage}>
              <div className="absolute inset-0 rounded-full bg-muted" />
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  ...ringStyle,
                  mask: 'radial-gradient(circle 55% at 50% 50%, transparent 56%, black 57%)',
                  WebkitMask: 'radial-gradient(circle 55% at 50% 50%, transparent 56%, black 57%)',
                }}
              />
              <span className="sr-only">{progressMessage}</span>
            </div>
            <p className="text-sm text-muted-foreground">{progressMessage}</p>
          </section>

          <section className="space-y-2" aria-live="polite">
            <h2 className="text-xl font-semibold">{snapshot.phase.label}</h2>
            <p className="text-muted-foreground">{phaseNarrative}</p>
          </section>

          {sudsEnabled && consent.clinicalAccepted && (showSudsCard || sudsOptIn) && (
            <section className="rounded-lg border border-border/50 p-4 space-y-4" aria-live="polite">
              <div>
                <p className="text-sm font-medium">Partager mon ressenti intérieur</p>
                <p className="text-xs text-muted-foreground">
                  Optionnel : aide à ajuster la sortie douce selon votre tension.
                </p>
              </div>
              <div className="space-y-3">
                <Slider
                  value={[preSudsLevel]}
                  onValueChange={([value]) => {
                    setPreSudsLevel(Math.max(0, Math.min(SUDS_LEVELS.length - 1, Math.round(value))));
                    setPostSudsLevel(Math.max(0, Math.min(SUDS_LEVELS.length - 1, Math.round(value))));
                  }}
                  min={0}
                  max={SUDS_LEVELS.length - 1}
                  step={1}
                  aria-valuetext={getSudsEntry(preSudsLevel).label}
                  disabled={sudsOptIn && session.state !== 'idle'}
                />
                <div className="text-sm">
                  <p className="font-medium">{getSudsEntry(preSudsLevel).label}</p>
                  <p className="text-xs text-muted-foreground">{getSudsEntry(preSudsLevel).detail}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {!sudsOptIn ? (
                  <>
                    <Button onClick={handleSudsOptIn} type="button">
                      Je partage ce ressenti
                    </Button>
                    <Button variant="ghost" onClick={handleSudsDecline} type="button">
                      Je préfère sans suivi
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" onClick={handleSudsDecline} type="button">
                    Désactiver ce suivi
                  </Button>
                )}
              </div>
            </section>
          )}

          {sudsEnabled && consent.clinicalAccepted && !sudsOptIn && !showSudsCard && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => {
                  setShowSudsCard(true);
                  try {
                    window.localStorage.removeItem('flash_glow_suds_cooldown');
                  } catch (error) {
                    logger.error('Impossible de supprimer le cooldown SUDS', error as Error, 'SYSTEM');
                  }
                }}
              >
                Activer le partage du ressenti
              </Button>
            </div>
          )}

          {phaseSurface}

          {orchestratorEnabled && (
            <section className="space-y-1 rounded-lg bg-muted/30 p-3" aria-live="polite">
              <p className="text-sm font-medium">Actions cliniques prévues</p>
              <p className="text-xs text-muted-foreground">
                {pendingAction === 'extend_60s'
                  ? 'Intention : prolonger la bulle lumineuse.'
                  : pendingAction === 'soft_exit'
                    ? 'Intention : guider vers une sortie très douce.'
                    : pendingAction === 'cta_screen_silk'
                      ? 'Intention : suggérer un passage vers Screen Silk.'
                      : 'Intention : en attente de votre ressenti final.'}
              </p>
              <p className="text-xs text-muted-foreground">
                Halo : {intendedVisuals === 'lowered' ? 'adouci' : 'neutre'} · Souffle : {intendedBreath === 'exhale_longer' ? 'allongé' : 'stable'} · Audio : {intendedAudio === 'slow' ? 'fondu prolongé' : 'fondu léger'} · Toucher : {
                  intendedHaptics === 'off' ? 'désactivé' : intendedHaptics === 'calm' ? 'calmé' : 'standard'
                }.
              </p>
            </section>
          )}

          <div className="flex flex-wrap items-center gap-3" role="group" aria-label="Contrôles de séance">
            <Button onClick={handlePrimary} disabled={isSaving} type="button">
              {primaryLabel}
            </Button>
            <Button
              variant="outline"
              onClick={handleComplete}
              disabled={session.state === 'idle' || isSaving}
              type="button"
            >
              Sortie douce
            </Button>
            <Button
              variant={softEffects ? 'secondary' : 'ghost'}
              onClick={() => setSoftEffects((prev) => !prev)}
              type="button"
              aria-pressed={softEffects}
            >
              Effets doux
            </Button>
            {flashHints?.exitMode === 'soft' && (
              <Button asChild variant="ghost" type="button">
                <Link to={flashHints.companionPath}>Screen Silk</Link>
              </Button>
            )}
          </div>

          {extensionActive && (
            <p className="rounded-md bg-amber-100/10 p-3 text-sm text-amber-600" aria-live="polite">
              Extension active : on reste ensemble un peu plus longtemps.
            </p>
          )}

          {feedback && (
            <p className="rounded-md bg-muted/30 p-3 text-sm text-muted-foreground" aria-live="polite">
              {feedback}
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={postDialogOpen} onOpenChange={handlePostDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comment ça atterrit&nbsp;?</DialogTitle>
            <DialogDescription>
              Ajustez la glissière pour décrire votre tension actuelle.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Slider
              value={[postSudsLevel]}
              onValueChange={([value]) => setPostSudsLevel(Math.max(0, Math.min(SUDS_LEVELS.length - 1, Math.round(value))))}
              min={0}
              max={SUDS_LEVELS.length - 1}
              step={1}
              aria-valuetext={getSudsEntry(postSudsLevel).label}
            />
            <div className="space-y-1 text-sm">
              <p className="font-medium">{getSudsEntry(postSudsLevel).label}</p>
              <p className="text-muted-foreground">{getSudsEntry(postSudsLevel).detail}</p>
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-2 pt-4 sm:flex-row sm:justify-between">
            <div className="flex gap-2">
              <Button variant="ghost" type="button" onClick={completeWithoutSuds}>
                Ignorer pour cette fois
              </Button>
              <Button
                onClick={() => handlePostDecision('complete')}
                disabled={isSubmittingSud}
                type="button"
              >
                Sortie douce
              </Button>
            </div>
            {getSudsEntry(postSudsLevel).score >= SUDS_THRESHOLD_SCORE && (
              <Button
                variant="outline"
                onClick={() => handlePostDecision('extend')}
                disabled={isSubmittingSud}
                type="button"
              >
                Prolonger un instant
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </main>
    </ConsentGate>
  );
};

export default FlashGlowView;
