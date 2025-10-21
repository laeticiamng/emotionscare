"use client";

import React from "react";
import * as Sentry from "@sentry/react";
import PageHeader from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/ui/ProgressBar";
import { GlowSurface } from "@/ui/GlowSurface";
import { usePulseClock } from "@/ui/hooks/usePulseClock";
import { ff } from "@/lib/flags/ff";
import { useSound } from "@/ui/hooks/useSound"; // si P5 dispo
import { recordEvent } from "@/lib/scores/events"; // si P6 dispo
import { createFlashGlowJournalEntry } from "@/modules/flash-glow/journal";
import type { JournalEntry } from "@/modules/journal/journalService";
import { toast } from "@/hooks/use-toast";
import { flashGlowService } from "@/modules/flash-glow/flash-glowService";
import type { FlashGlowSession } from "@/modules/flash-glow/flash-glowService";
import { routes } from "@/routerV2/routes";
import { useSessionClock } from "@/modules/sessions/hooks/useSessionClock";
import { logAndJournal } from "@/services/sessions/sessionsApi";
import { computeMoodDelta } from "@/services/sessions/moodDelta";
import { logger } from '@/lib/logger';

type Theme = "cyan" | "violet" | "amber" | "emerald";
type PresetKey = "calme" | "focus" | "recovery";
type StageKey = "prepare" | "boost" | "radiate" | "integrate";

type LogStatus = "idle" | "saving" | "saved" | "error" | "unauthenticated";

interface StageDefinition {
  key: StageKey;
  label: string;
  description: string;
  portion: number;
}

interface StageSummary extends StageDefinition {
  startSeconds: number;
  endSeconds: number;
  plannedSeconds: number;
  actualSeconds: number;
}

const PRESETS: Record<PresetKey, { bpm: number; intensity: number; theme: Theme; shape: "ring" | "full" }> = {
  calme: { bpm: 6, intensity: 0.6, theme: "emerald", shape: "ring" },
  focus: { bpm: 8, intensity: 0.7, theme: "cyan", shape: "ring" },
  recovery: { bpm: 4, intensity: 0.8, theme: "violet", shape: "full" }
};

const STAGE_DEFINITIONS: StageDefinition[] = [
  {
    key: "prepare",
    label: "Ancrage",
    description: "Stabilisez votre respiration et trouvez votre rythme de base.",
    portion: 0.2
  },
  {
    key: "boost",
    label: "Impulsion",
    description: "Augmentez progressivement l'intensité lumineuse.",
    portion: 0.3
  },
  {
    key: "radiate",
    label: "Rayonnement",
    description: "Diffusez l'énergie dans tout le corps.",
    portion: 0.3
  },
  {
    key: "integrate",
    label: "Intégration",
    description: "Revenez en douceur et ancrez les sensations.",
    portion: 0.2
  }
];

const formatTime = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

const buildStageSummaries = (elapsedSeconds: number, totalSeconds: number): StageSummary[] => {
  const safeTotal = Math.max(1, totalSeconds);
  let cumulative = 0;

  return STAGE_DEFINITIONS.map((stage) => {
    const start = cumulative;
    cumulative += stage.portion;
    const startSeconds = Math.round(start * safeTotal);
    const endSeconds = Math.round(cumulative * safeTotal);
    const plannedSeconds = Math.max(0, endSeconds - startSeconds);
    const clampedElapsed = Math.min(elapsedSeconds, safeTotal);
    const actualSeconds = Math.max(0, Math.min(clampedElapsed, endSeconds) - startSeconds);

    return {
      ...stage,
      startSeconds,
      endSeconds,
      plannedSeconds,
      actualSeconds
    };
  });
};

const clampMoodValue = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

const buildJournalSummary = (
  label: "gain" | "léger" | "incertain",
  moodDelta: number | null,
  preset: PresetKey
) => {
  const base =
    label === "gain"
      ? "FlashGlow Ultra terminée, je me sens plus rayonnant·e."
      : label === "léger"
        ? "FlashGlow Ultra terminée, je reste enveloppé·e d'une douceur lumineuse."
        : "FlashGlow Ultra terminée, j'intègre calmement les sensations ressenties.";

  const presetNote =
    preset === "focus"
      ? "Je garde ce cap lumineux pour soutenir ma concentration."
      : preset === "recovery"
        ? "Je laisse la lumière réparer et apaiser mon corps."
        : "Je demeure ancré·e dans cette clarté paisible.";

  const deltaNote =
    moodDelta == null
      ? "Je reste à l'écoute des sensations qui émergent."
      : moodDelta > 0
        ? "Je perçois plus d'espace intérieur qu'au départ."
        : moodDelta < 0
          ? "J'accueille ce qui se présente avec bienveillance."
          : "Je sens une stabilité douce, sans contraste marqué.";

  return `${base} ${presetNote} ${deltaNote}`.trim();
};

type FinalizationSnapshot = {
  reason: "manual_stop" | "auto_complete";
  elapsedSec: number;
  targetSeconds: number;
  safeBpm: number;
  preset: PresetKey;
  intensity: number;
  intensityPercent: number;
  theme: Theme;
  shape: "ring" | "full";
  targetMinutes: number;
  moodBaseline: number;
  moodAfter: number;
  rawMoodDelta: number;
  aggregatedMoodDelta: number | null;
  moodLabel: "gain" | "léger" | "incertain";
  recommendation: string;
  startedAtIso: string;
  endedAtIso: string;
  stageSummaries: StageSummary[];
  satisfactionScore: number | null;
  summaryText: string;
};

export default function FlashGlowUltraPage() {
  const [preset, setPreset] = React.useState<PresetKey>("calme");
  const [bpm, setBpm] = React.useState(PRESETS.calme.bpm);
  const [intensity, setIntensity] = React.useState(PRESETS.calme.intensity);
  const [theme, setTheme] = React.useState<Theme>(PRESETS.calme.theme);
  const [shape, setShape] = React.useState<"ring" | "full">(PRESETS.calme.shape);
  const [durationMin, setDurationMin] = React.useState(2);
  const [sessionTargetMinutes, setSessionTargetMinutes] = React.useState<number>(2);
  const [moodBaseline, setMoodBaseline] = React.useState<number>(50);
  const [moodAfterSession, setMoodAfterSession] = React.useState<number | null>(null);
  const [moodDelta, setMoodDelta] = React.useState<number | null>(null);
  const [logStatus, setLogStatus] = React.useState<LogStatus>("idle");
  const [logError, setLogError] = React.useState<string | null>(null);
  const [sessionRecordId, setSessionRecordId] = React.useState<string | null>(null);
  const [lastSessionReason, setLastSessionReason] = React.useState<"manual_stop" | "auto_complete" | null>(null);
  const [statusAnnouncement, setStatusAnnouncement] = React.useState<string>("Séance prête.");

  const reduced =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const clock = useSessionClock({
    durationMs: sessionTargetMinutes > 0 ? sessionTargetMinutes * 60_000 : undefined
  });
  const isRunning = clock.state === "running";
  const isSessionActive = clock.state === "running" || clock.state === "paused";

  const SAFE_BPM = Math.min(Math.max(1, bpm), 12);
  const rawPhase = usePulseClock(SAFE_BPM, isRunning);
  const phase01 = Math.min(1, rawPhase * Math.max(1, SAFE_BPM / 6));

  const useNewAudio = ff?.("new-audio-engine") ?? false;
  const tick = useNewAudio ? (useSound?.("/audio/tick.mp3") ?? null) : null;

  const lastZone = React.useRef<number>(-1);
  const eventLoggedRef = React.useRef(false);
  const primaryButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const sessionStartRef = React.useRef<number | null>(null);
  const completionReasonRef = React.useRef<"manual_stop" | "auto_complete" | null>(null);
  const finalizingRef = React.useRef(false);
  const lastCompletionRef = React.useRef<FinalizationSnapshot | null>(null);

  React.useEffect(() => {
    if (!isSessionActive && clock.state === "idle") {
      setSessionTargetMinutes(durationMin);
    }
  }, [durationMin, isSessionActive, clock.state]);

  React.useEffect(() => {
    if ((clock.progress ?? 0) >= 0.999 && isSessionActive && completionReasonRef.current == null) {
      completionReasonRef.current = "auto_complete";
    }
  }, [clock.progress, isSessionActive]);

  React.useEffect(() => {
    if (logStatus === "saving") {
      setStatusAnnouncement("Enregistrement automatique en cours…");
      return;
    }
    if (logStatus === "saved") {
      setStatusAnnouncement("Session enregistrée automatiquement.");
      return;
    }
    if (logStatus === "error" || logStatus === "unauthenticated") {
      setStatusAnnouncement("Enregistrement de la séance indisponible.");
      return;
    }

    switch (clock.state) {
      case "running":
        setStatusAnnouncement("Séance en cours…");
        break;
      case "paused":
        setStatusAnnouncement("Séance en pause.");
        break;
      case "completed":
        setStatusAnnouncement("Séance terminée.");
        break;
      default:
        setStatusAnnouncement("Séance prête.");
        break;
    }
  }, [clock.state, logStatus]);

  React.useEffect(() => {
    if (!isRunning) {
      lastZone.current = -1;
      return;
    }

    const zone = phase01 < 0.1 ? 0 : phase01 > 0.9 ? 1 : -1;
    if (zone !== -1 && zone !== lastZone.current) {
      lastZone.current = zone;
      if (tick?.play) tick.play().catch(() => {});
      if ("vibrate" in navigator && !reduced) navigator.vibrate?.(8);
    }
  }, [phase01, isRunning, tick, reduced]);

  const persistSession = React.useCallback(
    async (snapshot: FinalizationSnapshot) => {
      setLogStatus("saving");
      setLogError(null);

      let journalEntry: JournalEntry | null = null;
      try {
        journalEntry = await createFlashGlowJournalEntry({
          label: snapshot.moodLabel,
          duration: snapshot.elapsedSec,
          intensity: snapshot.intensityPercent,
          glowType: snapshot.preset,
          recommendation: snapshot.recommendation,
          context: "Flash Glow Ultra",
          moodBefore: snapshot.moodBaseline,
          moodAfter: snapshot.moodAfter,
          moodDelta: snapshot.rawMoodDelta
        });
      } catch (error) {
        logger.warn("flash-glow-ultra journal", error, 'MUSIC');
      }

      try {
        const sessionPayload: FlashGlowSession = {
          duration_s: snapshot.elapsedSec,
          label: snapshot.moodLabel,
          glow_type: snapshot.preset,
          intensity: snapshot.intensityPercent,
          result: snapshot.reason === "auto_complete" ? "completed" : "interrupted",
          metadata: {
            preset: snapshot.preset,
            bpm: snapshot.safeBpm,
            theme: snapshot.theme,
            shape: snapshot.shape,
            mode: "ultra",
            context: "Flash Glow Ultra",
            target_minutes: snapshot.targetMinutes,
            actual_minutes: Number((snapshot.elapsedSec / 60).toFixed(2)),
            stages: snapshot.stageSummaries.map((stage) => ({
              key: stage.key,
              label: stage.label,
              planned_seconds: stage.plannedSeconds,
              actual_seconds: stage.actualSeconds,
              portion: stage.portion
            })),
            safe_bpm: snapshot.safeBpm,
            reason: snapshot.reason,
            started_at: snapshot.startedAtIso,
            ended_at: snapshot.endedAtIso,
            recommendation: snapshot.recommendation,
            satisfactionScore: snapshot.satisfactionScore,
            journalEntryId: journalEntry?.id ?? null,
            moodBefore: snapshot.moodBaseline,
            moodAfter: snapshot.moodAfter,
            moodDelta: snapshot.rawMoodDelta
          }
        };

        const response = await flashGlowService.endSession(sessionPayload);

        const sessionRecord = await logAndJournal({
          type: "flash_glow",
          duration_sec: snapshot.elapsedSec,
          mood_delta: snapshot.aggregatedMoodDelta ?? null,
          journalText: snapshot.summaryText,
          meta: {
            preset: snapshot.preset,
            theme: snapshot.theme,
            shape: snapshot.shape,
            bpm: snapshot.safeBpm,
            intensity_percent: snapshot.intensityPercent,
            target_minutes: snapshot.targetMinutes,
            reason: snapshot.reason,
            started_at: snapshot.startedAtIso,
            ended_at: snapshot.endedAtIso,
            satisfaction_score: snapshot.satisfactionScore,
            mood_before: snapshot.moodBaseline,
            mood_after: snapshot.moodAfter,
            mood_delta_raw: snapshot.rawMoodDelta,
            mood_delta_index: snapshot.aggregatedMoodDelta,
            journal_entry_id: journalEntry?.id ?? null,
            recommendation: snapshot.recommendation,
            flash_glow_mode: "ultra",
            stage_summaries: snapshot.stageSummaries.map((stage) => ({
              key: stage.key,
              planned_seconds: stage.plannedSeconds,
              actual_seconds: stage.actualSeconds
            })),
            service_session_id: response?.activity_session_id ?? null
          }
        });

        if (response?.activity_session_id) {
          setSessionRecordId(response.activity_session_id);
        } else if (sessionRecord?.id) {
          setSessionRecordId(sessionRecord.id);
        } else {
          setSessionRecordId(null);
        }

        if (typeof response?.mood_delta === "number") {
          setMoodDelta(response.mood_delta);
        } else {
          setMoodDelta(snapshot.rawMoodDelta);
        }

        toast({
          title: "Session terminée ! ✨",
          description: [
            snapshot.recommendation,
            snapshot.aggregatedMoodDelta == null
              ? null
              : `Δ humeur : ${snapshot.aggregatedMoodDelta > 0 ? "+" : ""}${snapshot.aggregatedMoodDelta}`,
            "📝 Votre expérience a été ajoutée automatiquement au journal."
          ]
            .filter(Boolean)
            .join("\n")
        });

        setLogStatus("saved");
        Sentry.addBreadcrumb({
          category: "session",
          message: "session:complete",
          level: "info",
          data: { module: "flash_glow_ultra", duration_sec: snapshot.elapsedSec, reason: snapshot.reason }
        });
      } catch (error: any) {
        const message = error?.message ?? "Erreur inattendue lors de l'enregistrement de la session";
        const isAuthError = /auth/i.test(message) || /unauthor/i.test(message) || /401/.test(message);
        setLogStatus(isAuthError ? "unauthenticated" : "error");
        setLogError(message);
        Sentry.captureException(error);
        toast({
          title: "Enregistrement impossible",
          description: message,
          variant: "destructive"
        });
        throw error;
      }
    },
    [flashGlowService, logAndJournal, toast, createFlashGlowJournalEntry]
  );

  const finalizeSession = React.useCallback(
    async (reason: "manual_stop" | "auto_complete") => {
      if (!sessionStartRef.current) {
        return;
      }

      const startedAt = new Date(sessionStartRef.current);
      sessionStartRef.current = null;
      const endedAt = new Date();

      const elapsedSec = Math.max(1, Math.round(clock.elapsedMs / 1000));
      const targetMinutes = sessionTargetMinutes || durationMin;
      const targetSeconds = Math.max(1, Math.round(targetMinutes * 60));
      const safeBpm = Math.min(Math.max(1, bpm), 12);
      const safeIntensity = Math.max(0, Math.min(1, intensity));

      const baseline = clampMoodValue(moodBaseline);
      const resolvedAfter = typeof moodAfterSession === "number" ? clampMoodValue(moodAfterSession) : baseline;

      setMoodAfterSession(resolvedAfter);

      const rawMoodDelta = resolvedAfter - baseline;
      setMoodDelta(rawMoodDelta);

      const baselineSnapshot = { valence: baseline / 50 - 1, arousal: 0 };
      const afterSnapshot = { valence: resolvedAfter / 50 - 1, arousal: 0 };
      const aggregatedMoodDelta = computeMoodDelta(baselineSnapshot, afterSnapshot);

      const moodLabel: "gain" | "léger" | "incertain" = rawMoodDelta >= 10
        ? "gain"
        : rawMoodDelta >= 3
          ? "léger"
          : "incertain";

      const recommendation = rawMoodDelta >= 10
        ? "Progression spectaculaire ! Gardez ce rythme lumineux."
        : rawMoodDelta >= 3
          ? "Belle progression, continuez sur cette cadence."
          : "Les micro-changements nourrissent votre constance, respirez profondément.";

      const satisfactionScore = rawMoodDelta >= 10
        ? 5
        : rawMoodDelta >= 3
          ? 4
          : rawMoodDelta >= 0
            ? 3
            : rawMoodDelta >= -3
              ? 2
              : 1;

      const stageSummaries = buildStageSummaries(elapsedSec, targetSeconds);

      const snapshot: FinalizationSnapshot = {
        reason,
        elapsedSec,
        targetSeconds,
        safeBpm,
        preset,
        intensity: safeIntensity,
        intensityPercent: Math.round(safeIntensity * 100),
        theme,
        shape,
        targetMinutes,
        moodBaseline: baseline,
        moodAfter: resolvedAfter,
        rawMoodDelta,
        aggregatedMoodDelta,
        moodLabel,
        recommendation,
        startedAtIso: startedAt.toISOString(),
        endedAtIso: endedAt.toISOString(),
        stageSummaries,
        satisfactionScore,
        summaryText: buildJournalSummary(moodLabel, aggregatedMoodDelta, preset)
      };

      lastCompletionRef.current = snapshot;
      setLastSessionReason(reason);

      if (!eventLoggedRef.current) {
        try {
          recordEvent?.({
            module: "flash-glow-ultra",
            startedAt: snapshot.startedAtIso,
            endedAt: snapshot.endedAtIso,
            durationSec: snapshot.elapsedSec,
            meta: {
              preset,
              bpm,
              intensity: safeIntensity,
              theme,
              shape,
              targetMinutes,
              reason
            }
          });
        } catch (error) {
          logger.warn("flash-glow-ultra event", error, 'MUSIC');
        }
        eventLoggedRef.current = true;
      }

      await persistSession(snapshot).finally(() => {
        primaryButtonRef.current?.focus({ preventScroll: true });
      });
    },
    [clock.elapsedMs, sessionTargetMinutes, durationMin, bpm, intensity, theme, shape, preset, moodBaseline, moodAfterSession, persistSession, recordEvent]
  );

  React.useEffect(() => {
    if (clock.state !== "completed") {
      return;
    }
    if (finalizingRef.current) {
      return;
    }
    if (!sessionStartRef.current) {
      return;
    }

    finalizingRef.current = true;
    const reason = completionReasonRef.current ?? "auto_complete";
    finalizeSession(reason)
      .catch((error) => {
        logger.error("Auto-save Flash Glow Ultra session failed", error as Error, 'MUSIC');
      })
      .finally(() => {
        completionReasonRef.current = null;
        finalizingRef.current = false;
      });
  }, [clock.state, finalizeSession]);

  const startSession = React.useCallback(() => {
    sessionStartRef.current = Date.now();
    completionReasonRef.current = null;
    finalizingRef.current = false;
    lastCompletionRef.current = null;
    eventLoggedRef.current = false;
    setSessionTargetMinutes(durationMin);
    setMoodDelta(null);
    setMoodAfterSession(moodBaseline);
    setLogStatus("idle");
    setLogError(null);
    setSessionRecordId(null);
    setLastSessionReason(null);
    lastZone.current = -1;

    Sentry.addBreadcrumb({
      category: "session",
      message: "session:start",
      level: "info",
      data: { module: "flash_glow_ultra", duration_min: durationMin, bpm }
    });

    try {
      recordEvent?.({
        module: "flash-glow-ultra",
        startedAt: new Date(sessionStartRef.current).toISOString(),
        meta: { preset, bpm, intensity, theme, shape, durationMin }
      });
    } catch (error) {
      logger.warn("flash-glow-ultra start", error, 'MUSIC');
    }

    clock.reset();
    clock.start();
  }, [clock, durationMin, moodBaseline, bpm, preset, intensity, theme, shape, recordEvent]);

  const handlePause = React.useCallback(() => {
    if (!isRunning) return;
    clock.pause();
    Sentry.addBreadcrumb({
      category: "session",
      message: "session:pause",
      level: "info",
      data: { module: "flash_glow_ultra" }
    });
    primaryButtonRef.current?.focus({ preventScroll: true });
  }, [clock, isRunning]);

  const handlePrimaryAction = React.useCallback(() => {
    if (clock.state === "idle" || clock.state === "completed") {
      startSession();
      return;
    }

    if (clock.state === "running") {
      completionReasonRef.current = "manual_stop";
      setStatusAnnouncement("Clôture de la séance…");
      clock.complete();
      return;
    }

    if (clock.state === "paused") {
      clock.resume();
      Sentry.addBreadcrumb({
        category: "session",
        message: "session:resume",
        level: "info",
        data: { module: "flash_glow_ultra" }
      });
      primaryButtonRef.current?.focus({ preventScroll: true });
    }
  }, [clock, startSession]);

  const retrySave = React.useCallback(() => {
    const snapshot = lastCompletionRef.current;
    if (!snapshot) return;
    persistSession(snapshot).catch(() => {});
  }, [persistSession]);

  const clockElapsedSeconds = Math.max(0, Math.round(clock.elapsedMs / 1000));
  const targetSecondsForSession = Math.max(1, Math.round(sessionTargetMinutes * 60));
  const previewSeconds = Math.max(1, Math.round(durationMin * 60));
  const displayTotalSeconds =
    isSessionActive || clock.state === "completed" || clockElapsedSeconds > 0
      ? targetSecondsForSession
      : previewSeconds;
  const progress = displayTotalSeconds
    ? Math.min(1, (clock.progress ?? clockElapsedSeconds / displayTotalSeconds))
    : 0;
  const progressPercent = Math.min(100, Math.max(0, Math.round(progress * 100)));

  const stageSummaries = React.useMemo(
    () => buildStageSummaries(clockElapsedSeconds, displayTotalSeconds),
    [clockElapsedSeconds, displayTotalSeconds]
  );

  const currentStageIndex = React.useMemo(() => {
    if (stageSummaries.length === 0) return 0;
    if (progress >= 1) return stageSummaries.length - 1;
    const idx = stageSummaries.findIndex((stage) => clockElapsedSeconds < stage.endSeconds);
    return idx === -1 ? stageSummaries.length - 1 : idx;
  }, [stageSummaries, progress, clockElapsedSeconds]);

  const currentStage = stageSummaries[currentStageIndex] ?? stageSummaries[0];
  const stageRemainingSeconds = currentStage
    ? Math.max(0, currentStage.plannedSeconds - currentStage.actualSeconds)
    : 0;
  const totalRemainingSeconds = Math.max(
    0,
    displayTotalSeconds - Math.min(clockElapsedSeconds, displayTotalSeconds)
  );
  const stageProgressValues = stageSummaries.map((stage) =>
    stage.plannedSeconds ? Math.min(1, stage.actualSeconds / stage.plannedSeconds) : 0
  );

  const primaryLabel = clock.state === "running"
    ? "Terminer"
    : clock.state === "paused"
      ? "Reprendre"
      : "Démarrer";

  return (
    <main aria-label="Flash Glow Ultra">
      <PageHeader
        title="Flash Glow Ultra"
        subtitle="Glow respiratoire avancé, sûr et personnalisable"
      />
      <Card>
        <section style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "grid", gap: 8 }}>
            <label>
              Preset
              <select value={preset} onChange={(e) => {
                const key = e.target.value as PresetKey;
                const next = PRESETS[key];
                setPreset(key);
                setBpm(next.bpm);
                setIntensity(next.intensity);
                setTheme(next.theme);
                setShape(next.shape);
              }}>
                <option value="calme">Calme (6 bpm, emerald)</option>
                <option value="focus">Focus (8 bpm, cyan)</option>
                <option value="recovery">Recovery (4 bpm, violet)</option>
              </select>
            </label>

            <label>
              BPM visuel : {bpm}
              <input
                type="range"
                min={2}
                max={12}
                step={1}
                value={bpm}
                onChange={(e) => setBpm(parseInt(e.target.value, 10))}
              />
            </label>

            <label>
              Intensité : {Math.round(intensity * 100)}%
              <input
                type="range"
                min={0.2}
                max={1}
                step={0.05}
                value={intensity}
                onChange={(e) => setIntensity(parseFloat(e.target.value))}
              />
            </label>

            <label>
              Thème
              <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
                <option value="emerald">Émeraude</option>
                <option value="cyan">Cyan</option>
                <option value="violet">Violet</option>
                <option value="amber">Ambre</option>
              </select>
            </label>

            <label>
              Forme
              <select value={shape} onChange={(e) => setShape(e.target.value as any)}>
                <option value="ring">Anneau</option>
                <option value="full">Plein</option>
              </select>
            </label>

            <label>
              Durée (min) : {durationMin}
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={durationMin}
                onChange={(e) => setDurationMin(parseInt(e.target.value, 10))}
              />
            </label>
          </div>

          <div style={{ display: "grid", gap: 8, background: "rgba(255,255,255,0.02)", borderRadius: 16, padding: 16 }}>
            <label>
              Humeur avant séance : {moodBaseline}/100
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={moodBaseline}
                onChange={(e) => setMoodBaseline(clampMoodValue(parseInt(e.target.value, 10)))}
                disabled={isSessionActive}
              />
            </label>
            <label>
              Humeur après séance : {moodAfterSession ?? moodBaseline}/100
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={moodAfterSession ?? moodBaseline}
                onChange={(e) => setMoodAfterSession(clampMoodValue(parseInt(e.target.value, 10)))}
              />
            </label>
            {moodDelta !== null && (
              <span style={{ fontSize: 12, color: moodDelta >= 0 ? "var(--success, #22c55e)" : "var(--accent, #f97316)" }}>
                Δ humeur {moodDelta > 0 ? `+${moodDelta}` : moodDelta}
              </span>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gap: 12,
              background: "rgba(255,255,255,0.04)",
              borderRadius: 16,
              padding: 16
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: 12
              }}
            >
              <div style={{ minWidth: 140 }}>
                <div style={{ fontSize: 12, opacity: 0.7 }}>Phase active</div>
                <div style={{ fontWeight: 600 }}>{currentStage?.label ?? "Ancrage"}</div>
              </div>
              <div style={{ minWidth: 140 }}>
                <div style={{ fontSize: 12, opacity: 0.7 }}>Phase restante</div>
                <div style={{ fontWeight: 600 }}>{formatTime(stageRemainingSeconds)}</div>
              </div>
              <div style={{ minWidth: 140 }}>
                <div style={{ fontSize: 12, opacity: 0.7 }}>Session restante</div>
                <div style={{ fontWeight: 600 }}>{formatTime(totalRemainingSeconds)}</div>
              </div>
            </div>

            <ProgressBar value={progressPercent} max={100} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                opacity: 0.8
              }}
            >
              <span>Écoulé : {formatTime(clockElapsedSeconds)}</span>
              <span>{progressPercent}%</span>
              <span>Objectif : {formatTime(displayTotalSeconds)}</span>
            </div>

            <div
              style={{
                display: "grid",
                gap: 8,
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))"
              }}
            >
              {stageSummaries.map((stage, index) => {
                const stageProgress = stageProgressValues[index];
                const isActive = index === currentStageIndex && progress < 1;
                const isComplete =
                  stageProgress >= 1 && (index < stageSummaries.length - 1 || progress >= 1);

                return (
                  <div
                    key={stage.key}
                    style={{
                      padding: 12,
                      borderRadius: 14,
                      border: isActive
                        ? "1px solid var(--accent, #f97316)"
                        : "1px solid rgba(255,255,255,0.08)",
                      background: isActive
                        ? "rgba(249, 115, 22, 0.12)"
                        : "rgba(255,255,255,0.04)",
                      transition: "all .3s ease"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 8
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 600 }}>
                        {index + 1}. {stage.label}
                      </span>
                      <span style={{ fontSize: 12, opacity: 0.7 }}>
                        {formatTime(stage.plannedSeconds)}
                      </span>
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        height: 4,
                        borderRadius: 4,
                        background: "rgba(255,255,255,0.12)",
                        overflow: "hidden"
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(100, Math.round(stageProgress * 100))}%`,
                          height: "100%",
                          background: "var(--accent, #f97316)",
                          opacity: isActive || isComplete ? 1 : 0.5,
                          transition: "width .4s ease"
                        }}
                      />
                    </div>
                    <p
                      style={{
                        marginTop: 8,
                        fontSize: 12,
                        lineHeight: 1.4,
                        opacity: 0.7
                      }}
                    >
                      {stage.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <GlowSurface phase01={phase01} theme={theme} intensity={intensity} shape={shape} />

          <div style={{ display: "grid", gap: 4 }}>
            <div
              role="status"
              aria-live="polite"
              style={{ fontSize: 12, opacity: 0.85 }}
            >
              {statusAnnouncement}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                ref={primaryButtonRef}
                onClick={handlePrimaryAction}
                data-ui="primary-cta"
              >
                {primaryLabel}
              </Button>
              {isSessionActive && isRunning && (
                <Button onClick={handlePause} type="button">
                  Pause
                </Button>
              )}
            </div>
          </div>

          <small style={{ opacity: 0.75 }}>
            Sécurité anti-flash activée (≤3 Hz). Si tu utilises “Réduction des animations” sur ton appareil,
            l’animation devient très douce.
          </small>

          {logStatus !== "idle" && (
            <div
              role="status"
              aria-live="polite"
              style={{ display: "grid", gap: 8, fontSize: 12, lineHeight: 1.5 }}
            >
              {logStatus === "saving" && (
                <div style={{ color: "var(--accent, #f97316)" }}>
                  Enregistrement automatique en cours...
                </div>
              )}
              {logStatus === "saved" && (
                <div style={{ color: "var(--success, #22c55e)" }}>
                  Session enregistrée automatiquement
                  {sessionRecordId ? ` (#${sessionRecordId.slice(0, 8)})` : ""}.
                  {moodDelta !== null && (
                    <span style={{ marginLeft: 4 }}>
                      Δ humeur {moodDelta > 0 ? `+${moodDelta}` : moodDelta}
                    </span>
                  )}
                </div>
              )}
              {logStatus === "unauthenticated" && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "1px solid rgba(250, 204, 21, 0.35)",
                    background: "rgba(250, 204, 21, 0.08)",
                    color: "var(--warning, #facc15)"
                  }}
                >
                  <span style={{ flex: "1 1 240px" }}>
                    {logError ?? "Connectez-vous pour enregistrer vos sessions Flash Glow Ultra."}
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    <Button asChild variant="warning" size="sm" data-ui="login-cta">
                      <a href={routes.auth.login()}>
                        Se connecter
                      </a>
                    </Button>
                    {lastSessionReason && (
                      <Button variant="ghost" size="sm" onClick={retrySave}>
                        Réessayer l'enregistrement
                      </Button>
                    )}
                  </div>
                </div>
              )}
              {logStatus === "error" && (
                <div style={{ color: "var(--destructive, #ef4444)" }}>
                  Enregistrement impossible{logError ? ` : ${logError}` : ""}.
                  {lastSessionReason && (
                    <button
                      type="button"
                      onClick={retrySave}
                      style={{
                        marginLeft: 8,
                        color: "inherit",
                        textDecoration: "underline",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: 0
                      }}
                    >
                      Réessayer
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </Card>
    </main>
  );
}
