"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as Sentry from '@sentry/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useMotionPrefs } from '@/hooks/useMotionPrefs';
import { useSessionClock } from '@/hooks/useSessionClock';
import { GlowSurface } from '@/ui/GlowSurface';
import { useFlashPhases } from '@/modules/flash/useFlashPhases';
import {
  computeMoodDelta,
  getCurrentMoodSnapshot,
  logAndJournal,
  type MoodSnapshot,
} from '@/modules/flash/sessionService';
import { clinicalScoringService } from '@/services/clinicalScoring';

const phaseThemes = {
  warmup: { theme: 'emerald' as const, intensity: 0.45, shape: 'ring' as const },
  glow: { theme: 'amber' as const, intensity: 0.9, shape: 'full' as const },
  settle: { theme: 'violet' as const, intensity: 0.35, shape: 'ring' as const },
};

const formatTime = (ms: number) => {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const statusLabels: Record<string, string> = {
  idle: 'Prête à démarrer',
  running: 'Séance en cours',
  paused: 'Séance en pause',
  completed: 'Séance terminée',
};

const primaryButtonLabels: Record<string, string> = {
  idle: 'Commencer la séance',
  running: 'Mettre en pause',
  paused: 'Reprendre',
  completed: 'Relancer',
};

const completionMessage = 'ça vient';
const BASE_DURATION_MS = 120_000;
const EXTENSION_DURATION_MS = 60_000;
const SUDS_THRESHOLD = 3;
const SUDS_MIN = 0;
const SUDS_MAX = 10;
const SUDS_DESCRIPTIONS: Record<number, string> = {
  0: 'Paisible',
  1: 'Très calme',
  2: 'Calme',
  3: 'Tension légère',
  4: 'Tension',
  5: 'Stress présent',
  6: 'Stress marqué',
  7: 'Détresse forte',
  8: 'Très intense',
  9: 'Presque à saturation',
  10: 'Maximum supportable',
};

const FlashGlowView: React.FC = () => {
  const { toast } = useToast();
  const motion = useMotionPrefs();
  const beforeMoodRef = useRef<MoodSnapshot | null>(getCurrentMoodSnapshot());
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [sudsOptIn, setSudsOptIn] = useState(false);
  const [preSuds, setPreSuds] = useState<number>(2);
  const [postSuds, setPostSuds] = useState<number>(2);
  const [postSudsValues, setPostSudsValues] = useState<number[]>([]);
  const [preSudsRecorded, setPreSudsRecorded] = useState(false);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isSubmittingSud, setIsSubmittingSud] = useState(false);
  const [pendingCompletionElapsed, setPendingCompletionElapsed] = useState<number | null>(null);
  const [hasExtended, setHasExtended] = useState(false);
  const [needsPostSuds, setNeedsPostSuds] = useState(false);
  const [extraDurationMs, setExtraDurationMs] = useState(0);
  const [extensionActive, setExtensionActive] = useState(false);

  const totalDuration = BASE_DURATION_MS + extraDurationMs;

  const { phases, snapshot, update } = useFlashPhases(totalDuration, {
    onPhaseChange: (phase) => {
      Sentry.addBreadcrumb({
        category: 'flash',
        level: 'info',
        message: 'flash:phase_change',
        data: { module: 'flash-glow', phase },
      });
    },
  });

  const session = useSessionClock({
    durationMs: totalDuration,
    tickMs: 1000,
    onTick: update,
  });

  const formattedElapsed = useMemo(() => formatTime(session.elapsedMs), [session.elapsedMs]);
  const formattedRemaining = useMemo(() => formatTime(session.remainingMs), [session.remainingMs]);

  const stateLabel = statusLabels[session.state] ?? statusLabels.idle;
  const primaryLabel = primaryButtonLabels[session.state] ?? primaryButtonLabels.idle;

  const currentTheme = phaseThemes[snapshot.phase.key];

  useEffect(() => {
    if (sudsOptIn && postSudsValues.length === 0) {
      setPostSuds(preSuds);
    }
  }, [preSuds, sudsOptIn, postSudsValues.length]);

  const submitSudsMeasurement = async (stage: 'pre' | 'post', value: number) => {
    try {
      await clinicalScoringService.submitResponse('SUDS', { '1': value }, {
        stage,
        module: 'flash_glow',
        extended: hasExtended,
        iteration: stage === 'post' ? postSudsValues.length + 1 : 0,
        recorded_at: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error('Error submitting SUDS measure:', error);
      toast({
        title: 'Mesure SUDS indisponible',
        description: "Impossible d'enregistrer la mesure pour le moment.",
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleStart = () => {
    beforeMoodRef.current = getCurrentMoodSnapshot();
    setFeedback(null);
    Sentry.addBreadcrumb({
      category: 'session',
      level: 'info',
      message: 'session:start',
      data: {
        module: 'flash-glow',
        duration_ms: totalDuration,
      },
    });
    update(0);
    session.start();

    if (sudsOptIn && !preSudsRecorded) {
      void submitSudsMeasurement('pre', preSuds).then((success) => {
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
        module: 'flash-glow',
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
        module: 'flash-glow',
        elapsed_ms: session.elapsedMs,
      },
    });
    session.resume();
  };

  const handleRestart = () => {
    setExtraDurationMs(0);
    setHasExtended(false);
    setNeedsPostSuds(false);
    setPostSudsValues([]);
    setPendingCompletionElapsed(null);
    setIsPostDialogOpen(false);
    setExtensionActive(false);
    setPreSudsRecorded(false);
    setPostSuds(preSuds);
    session.reset();
    update(0);
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
        module: 'flash-glow',
        elapsed_ms: finalElapsed,
        action,
      },
    });

    session.complete(finalElapsed);

    const moodBefore = beforeMoodRef.current;
    const moodAfter = getCurrentMoodSnapshot();
    const delta = computeMoodDelta(moodBefore, moodAfter);

    setIsSaving(true);

    try {
      await logAndJournal({
        type: 'flash_glow',
        duration_sec: Math.max(1, Math.round(finalElapsed / 1000)),
        mood_delta: delta,
        journalText: completionMessage,
        moodBefore,
        moodAfter,
        metadata: {
          current_phase: snapshot.phase.key,
          phase_progress: snapshot.progress,
          elapsed_ms: finalElapsed,
          total_ms: totalDuration,
          phases: phases.map((phase) => ({ key: phase.key, ms: phase.ms })),
          suds: sudsOptIn
            ? {
                opt_in: true,
                pre: preSudsRecorded ? preSuds : null,
                post_values: postSudsValues,
                action,
                extended_ms: extraDurationMs,
              }
            : { opt_in: false },
        },
      });

      setFeedback('Séance enregistrée et ajoutée à votre journal ✨');
      toast({
        title: 'Séance FlashGlow terminée',
        description: 'Journal mis à jour automatiquement.',
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

    if (sudsOptIn && (postSudsValues.length === 0 || needsPostSuds)) {
      if (session.state === 'running') {
        session.pause();
      }
      setPendingCompletionElapsed(finalElapsed);
      setIsPostDialogOpen(true);
      return;
    }

    void finalizeSession(finalElapsed, hasExtended ? 'extend_session' : 'soft_exit');
  };

  const handlePostDialogChange = (open: boolean) => {
    setIsPostDialogOpen(open);
    if (!open) {
      setPendingCompletionElapsed(null);
      if (session.state === 'paused') {
        session.resume();
      }
    }
  };

  const handlePostSudsSubmit = async () => {
    if (postSuds == null) {
      return;
    }

    setIsSubmittingSud(true);
    const value = Math.max(SUDS_MIN, Math.min(SUDS_MAX, Math.round(postSuds)));

    const success = await submitSudsMeasurement('post', value);

    if (!success) {
      setIsSubmittingSud(false);
      return;
    }

    setPostSudsValues((prev) => [...prev, value]);

    if (value >= SUDS_THRESHOLD && !hasExtended) {
      setHasExtended(true);
      setNeedsPostSuds(true);
      setIsPostDialogOpen(false);
      setPendingCompletionElapsed(null);
      setExtraDurationMs((prev) => prev + EXTENSION_DURATION_MS);
      setExtensionActive(true);
      setFeedback('Tension détectée, séance prolongée de 60 secondes.');
      toast({
        title: 'Encore 60 secondes',
        description: 'Nous prolongeons la séance pour mieux vous accompagner.',
      });
      if (session.state === 'paused') {
        session.resume();
      }
      setIsSubmittingSud(false);
      return;
    }

    setNeedsPostSuds(false);
    setIsPostDialogOpen(false);
    const elapsedForCompletion = pendingCompletionElapsed ?? session.elapsedMs;
    void finalizeSession(elapsedForCompletion, hasExtended ? 'extend_session' : 'soft_exit');
    setIsSubmittingSud(false);
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

  const surface = motion.prefersReducedMotion ? (
    <div
      aria-label="Surface lumineuse douce"
      className="h-64 w-full rounded-2xl border border-white/5"
      style={{
        background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.16), transparent 70%)',
        transition: 'opacity 240ms ease-in-out',
        opacity: 0.6 + snapshot.progress * 0.3,
      }}
    />
  ) : (
    <GlowSurface
      phase01={snapshot.progress}
      theme={currentTheme.theme}
      intensity={currentTheme.intensity}
      shape={currentTheme.shape}
    />
  );

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6" data-testid="flash-glow-view">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">FlashGlow apaisant</CardTitle>
          <p className="text-muted-foreground">
            Séance guidée de 2 minutes pour éveiller l’énergie sans sur-stimulation lumineuse.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <section aria-live="polite" className="rounded-lg bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">Statut de la séance</p>
            <p className="text-lg font-medium">{stateLabel}</p>
          </section>

          <div className="grid gap-4 sm:grid-cols-2" role="list">
            <div className="rounded-lg border border-border/50 p-4" role="listitem">
              <p className="text-sm text-muted-foreground">Temps écoulé</p>
              <p className="font-mono text-2xl" aria-live="polite">{formattedElapsed}</p>
            </div>
            <div className="rounded-lg border border-border/50 p-4" role="listitem">
              <p className="text-sm text-muted-foreground">Temps restant</p>
              <p className="font-mono text-2xl" aria-live="polite">{formattedRemaining}</p>
            </div>
          </div>

          <Progress value={session.progress * 100} aria-label="Progression de la séance" />

          <section className="space-y-2" aria-live="polite">
            <h2 className="text-xl font-semibold">{snapshot.phase.label}</h2>
            <p className="text-muted-foreground">{snapshot.phase.description}</p>
            {snapshot.nextPhase && (
              <p className="text-sm text-muted-foreground">
                Ensuite&nbsp;: <span className="font-medium text-foreground">{snapshot.nextPhase.label}</span>
              </p>
            )}
          </section>

          <section className="rounded-lg border border-border/50 p-4 space-y-4" aria-live="polite">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Partager mon niveau SUDS</p>
                <p className="text-xs text-muted-foreground">
                  Optionnel&nbsp;: aide à adapter la fin de séance selon votre ressenti.
                </p>
              </div>
              <Switch
                id="suds-opt-in"
                checked={sudsOptIn}
                disabled={session.state !== 'idle'}
                onCheckedChange={(checked) => {
                  setSudsOptIn(checked);
                  if (!checked) {
                    setPreSudsRecorded(false);
                    setPostSudsValues([]);
                    setNeedsPostSuds(false);
                    setHasExtended(false);
                    setExtensionActive(false);
                  }
                }}
                aria-label="Activer le suivi SUDS"
              />
            </div>

            {sudsOptIn && (
              <div className="space-y-3" aria-live="polite">
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="suds-pre-slider" className="font-medium">SUDS avant séance</label>
                  <span className="text-muted-foreground">{preSuds}/10</span>
                </div>
                <Slider
                  id="suds-pre-slider"
                  value={[preSuds]}
                  onValueChange={([value]) => setPreSuds(Math.max(SUDS_MIN, Math.min(SUDS_MAX, Math.round(value))))}
                  min={SUDS_MIN}
                  max={SUDS_MAX}
                  step={1}
                  aria-valuetext={`${preSuds} sur 10`}
                  disabled={session.state !== 'idle'}
                />
                <p className="text-xs text-muted-foreground">
                  {SUDS_DESCRIPTIONS[preSuds]}
                </p>
              </div>
            )}
          </section>

          {surface}

          <div className="flex flex-wrap items-center gap-3" role="group" aria-label="Contrôles de séance">
            <Button onClick={handlePrimary} disabled={isSaving}>
              {primaryLabel}
            </Button>
            <Button
              variant="outline"
              onClick={handleComplete}
              disabled={session.state === 'idle' || isSaving}
            >
              Terminer en douceur
            </Button>
          </div>

          {extensionActive && (
            <p className="rounded-md bg-amber-100/10 p-3 text-sm text-amber-600" aria-live="polite">
              Extension active&nbsp;: 60 secondes supplémentaires en cours.
            </p>
          )}

          {feedback && (
            <p className="rounded-md bg-muted/30 p-3 text-sm text-muted-foreground" aria-live="polite">
              {feedback}
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isPostDialogOpen} onOpenChange={handlePostDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comment vous sentez-vous maintenant&nbsp;?</DialogTitle>
            <DialogDescription>
              Sélectionnez votre niveau SUDS pour décider si l’on prolonge la séance.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">SUDS après séance</span>
              <span className="text-muted-foreground">{postSuds}/10</span>
            </div>
            <Slider
              id="suds-post-slider"
              value={[postSuds]}
              onValueChange={([value]) => setPostSuds(Math.max(SUDS_MIN, Math.min(SUDS_MAX, Math.round(value))))}
              min={SUDS_MIN}
              max={SUDS_MAX}
              step={1}
              aria-valuetext={`${postSuds} sur 10`}
            />
            <p className="text-xs text-muted-foreground">
              {SUDS_DESCRIPTIONS[postSuds]}
            </p>
            <p className="text-xs text-muted-foreground">
              0 = calme, {SUDS_THRESHOLD}+ = tension notable nécessitant un peu plus de temps.
            </p>
          </div>

          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => handlePostDialogChange(false)}
              type="button"
            >
              Continuer sans valider
            </Button>
            <Button onClick={handlePostSudsSubmit} disabled={isSubmittingSud}>
              {isSubmittingSud ? 'Enregistrement...' : 'Valider'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default FlashGlowView;

