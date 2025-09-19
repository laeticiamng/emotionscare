"use client";

import React, { useMemo, useRef, useState } from 'react';
import * as Sentry from '@sentry/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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

const completionMessage = 'FlashGlow terminé. Respiration plus douce.';

const FlashGlowView: React.FC = () => {
  const { toast } = useToast();
  const motion = useMotionPrefs();
  const beforeMoodRef = useRef<MoodSnapshot | null>(getCurrentMoodSnapshot());
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { phases, snapshot, update, totalDuration } = useFlashPhases(undefined, {
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
    session.reset();
    update(0);
    handleStart();
  };

  const handleComplete = async () => {
    if (isSaving) {
      return;
    }

    const finalElapsed = session.state === 'running' ? session.elapsedMs : session.elapsedMs;

    Sentry.addBreadcrumb({
      category: 'session',
      level: 'info',
      message: 'session:complete',
      data: {
        module: 'flash-glow',
        elapsed_ms: finalElapsed,
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
    }
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

          {feedback && (
            <p className="rounded-md bg-muted/30 p-3 text-sm text-muted-foreground" aria-live="polite">
              {feedback}
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default FlashGlowView;

