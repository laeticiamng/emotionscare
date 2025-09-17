"use client";
import React from "react";
import { PageHeader, Card, Button, ProgressBar } from "@/COMPONENTS.reg";
import { GlowSurface } from "@/COMPONENTS.reg";
import { usePulseClock } from "@/COMPONENTS.reg";
import { ff } from "@/lib/flags/ff";
import { useSound } from "@/COMPONENTS.reg";       // si P5 dispo
import { recordEvent } from "@/lib/scores/events"; // si P6 dispo
import { supabase } from "@/integrations/supabase/client";
import { createFlashGlowJournalEntry } from "@/modules/flash-glow/journal";
import type { JournalEntry } from "@/modules/journal/journalService";
import { toast } from "@/hooks/use-toast";

type Theme = "cyan" | "violet" | "amber" | "emerald";
type PresetKey = "calme" | "focus" | "recovery";
type StageKey = "prepare" | "boost" | "radiate" | "integrate";

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

export default function FlashGlowUltraPage() {
  const [preset, setPreset] = React.useState<PresetKey>("calme");
  const [bpm, setBpm] = React.useState(PRESETS.calme.bpm);
  const [intensity, setInt] = React.useState(PRESETS.calme.intensity);
  const [theme, setTheme] = React.useState<Theme>(PRESETS.calme.theme);
  const [shape, setShape] = React.useState<"ring" | "full">(PRESETS.calme.shape);
  const [running, setRunning] = React.useState(false);
  const [isSessionActive, setSessionActive] = React.useState(false);
  const [durationMin, setDur] = React.useState(2);
  const [sessionTargetMinutes, setSessionTargetMinutes] = React.useState<number>(2);
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0);
  const [sessionStartedAt, setSessionStartedAt] = React.useState<number | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = React.useState<
    "idle" | "saving" | "saved" | "error" | "unauthenticated"
  >("idle");
  const [autoSaveError, setAutoSaveError] = React.useState<string | null>(null);
  const [sessionRecordId, setSessionRecordId] = React.useState<string | null>(null);
  const [lastSessionReason, setLastSessionReason] = React.useState<"manual_stop" | "auto_complete" | null>(null);
  const [moodBaseline, setMoodBaseline] = React.useState<number>(50);
  const [moodAfterSession, setMoodAfterSession] = React.useState<number | null>(null);
  const [moodDelta, setMoodDelta] = React.useState<number | null>(null);

  const reduced =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const SAFE_BPM = Math.min(Math.max(1, bpm), 12);
  const rawPhase = usePulseClock(SAFE_BPM, running);
  const phase01 = Math.min(1, rawPhase * Math.max(1, SAFE_BPM / 6));

  const useNewAudio = ff?.("new-audio-engine") ?? false;
  const tick = useNewAudio ? (useSound?.("/audio/tick.mp3") ?? null) : null;

  const lastZone = React.useRef<number>(-1);
  const eventLoggedRef = React.useRef(false);
  const sessionActiveRef = React.useRef(isSessionActive);

  React.useEffect(() => {
    if (!running) {
      lastZone.current = -1;
      return;
    }

    const zone = phase01 < 0.1 ? 0 : phase01 > 0.9 ? 1 : -1;
    if (zone !== -1 && zone !== lastZone.current) {
      lastZone.current = zone;
      if (tick?.play) tick.play().catch(() => {});
      if ("vibrate" in navigator && !reduced) navigator.vibrate?.(8);
    }
  }, [phase01, running, tick, reduced]);

  React.useEffect(() => {
    if (!running) return;
    const targetSeconds = Math.max(1, Math.round(sessionTargetMinutes * 60));
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => {
        if (!isSessionActive) return prev;
        if (prev >= targetSeconds) return targetSeconds;
        return Math.min(prev + 1, targetSeconds);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, sessionTargetMinutes, isSessionActive]);
  const finalizeSession = React.useCallback(
    async (reason: "manual_stop" | "auto_complete") => {
      if (!sessionStartedAt) return;

      const actualDurationSec = elapsedSeconds;
      const targetMinutes = sessionTargetMinutes || durationMin;
      const targetSeconds = Math.max(1, Math.round(targetMinutes * 60));
      const safeBpm = Math.min(Math.max(1, bpm), 12);

      const normalizedBaseline = Math.max(0, Math.min(100, Math.round(moodBaseline)));
      const normalizedAfter = typeof moodAfterSession === "number"
        ? Math.max(0, Math.min(100, Math.round(moodAfterSession)))
        : normalizedBaseline;
      const computedMoodDelta = normalizedAfter !== null ? normalizedAfter - normalizedBaseline : null;
      setMoodAfterSession(normalizedAfter);
      setMoodDelta(computedMoodDelta);

      const moodLabel: "gain" | "léger" | "incertain" = computedMoodDelta !== null
        ? computedMoodDelta >= 10
          ? "gain"
          : computedMoodDelta >= 3
            ? "léger"
            : "incertain"
        : "incertain";

      const recommendationMessage = computedMoodDelta !== null
        ? computedMoodDelta >= 10
          ? "Progression spectaculaire ! Gardez ce rythme lumineux."
          : computedMoodDelta >= 3
            ? "Belle progression, continuez sur cette cadence."
            : "Les micro-changements nourrissent votre constance, respirez profondément."
        : "Prenez un instant pour écouter vos ressentis avant de consigner la séance.";

      let journalEntry: JournalEntry | null = null;
      try {
        journalEntry = await createFlashGlowJournalEntry({
          label: moodLabel,
          duration: actualDurationSec,
          intensity: Math.round(Math.max(0, Math.min(1, intensity)) * 100),
          glowType: preset,
          recommendation: recommendationMessage,
          context: "Flash Glow Ultra",
          moodBefore: normalizedBaseline,
          moodAfter: normalizedAfter,
          moodDelta: computedMoodDelta
        });
      } catch (err) {
        console.warn("flash-glow-ultra journal", err);
      }

      if (!eventLoggedRef.current) {
        try {
          recordEvent?.({
            module: "flash-glow-ultra",
            startedAt: new Date(sessionStartedAt).toISOString(),
            endedAt: new Date().toISOString(),
            durationSec: actualDurationSec,
            score: Math.min(10, 2 + Math.round(actualDurationSec / 120)),
            meta: {
              preset,
              bpm,
              intensity,
              theme,
              shape,
              targetMinutes,
              reason
            }
          });
        } catch (err) {
          console.warn("flash-glow-ultra event", err);
        }
        eventLoggedRef.current = true;
      }

      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError) {
          setAutoSaveStatus("error");
          setAutoSaveError(userError.message || "Erreur d'authentification Supabase");
          return;
        }

        if (!userData?.user) {
          setAutoSaveStatus("unauthenticated");
          setAutoSaveError("Connectez-vous pour enregistrer vos sessions Flash Glow Ultra.");
          return;
        }

        setAutoSaveStatus("saving");
        setAutoSaveError(null);

        const summaries = buildStageSummaries(actualDurationSec, targetSeconds);

        const satisfactionScore = computedMoodDelta !== null
          ? computedMoodDelta >= 10
            ? 5
            : computedMoodDelta >= 3
              ? 4
              : computedMoodDelta >= 0
                ? 3
                : computedMoodDelta >= -3
                  ? 2
                  : 1
          : null;

        const { data, error } = await supabase
          .from("user_activity_sessions")
          .insert({
            user_id: userData.user.id,
            activity_type: "flash_glow_ultra",
            duration_seconds: actualDurationSec,
            completed_at: new Date().toISOString(),
            mood_before: normalizedBaseline.toString(),
            mood_after: normalizedAfter !== null ? normalizedAfter.toString() : null,
            satisfaction_score: satisfactionScore ?? undefined,
            session_data: {
              preset,
              bpm,
              intensity,
              theme,
              shape,
              target_minutes: targetMinutes,
              actual_minutes: Number((actualDurationSec / 60).toFixed(2)),
              stages: summaries.map((stage) => ({
                key: stage.key,
                label: stage.label,
                planned_seconds: stage.plannedSeconds,
                actual_seconds: stage.actualSeconds,
                portion: stage.portion
              })),
              safe_bpm: safeBpm,
              reason,
              started_at: new Date(sessionStartedAt).toISOString(),
              mood: {
                before: normalizedBaseline,
                after: normalizedAfter,
                delta: computedMoodDelta
              },
              journal_entry_id: journalEntry?.id || null
            }
          })
          .select("id")
          .single();

        if (error) {
          setAutoSaveStatus("error");
          setAutoSaveError(error.message ?? "Erreur lors de l'enregistrement Supabase");
          return;
        }

        setSessionRecordId(data?.id ?? null);
        if (journalEntry) {
          toast({
            title: "Journal mis à jour ✨",
            description: recommendationMessage
          });
        }
        setAutoSaveStatus("saved");
      } catch (err: any) {
        console.error("Auto-save Flash Glow Ultra session failed", err);
        setAutoSaveStatus("error");
        setAutoSaveError(err?.message ?? "Erreur inattendue lors de l'enregistrement de la session");
      }
    },
    [sessionStartedAt, elapsedSeconds, sessionTargetMinutes, durationMin, bpm, preset, intensity, theme, shape]
  );

  React.useEffect(() => {
    if (!isSessionActive || !running) return;
    const targetSeconds = Math.max(1, Math.round(sessionTargetMinutes * 60));
    if (elapsedSeconds >= targetSeconds) {
      setRunning(false);
      setSessionActive(false);
    }
  }, [elapsedSeconds, running, isSessionActive, sessionTargetMinutes]);

  React.useEffect(() => {
    if (!isSessionActive && sessionActiveRef.current) {
      const targetMinutes = sessionTargetMinutes || durationMin;
      const targetSeconds = Math.max(1, Math.round(targetMinutes * 60));
      const reason: "manual_stop" | "auto_complete" =
        elapsedSeconds >= targetSeconds ? "auto_complete" : "manual_stop";
      setLastSessionReason(reason);
      finalizeSession(reason);
    }
    sessionActiveRef.current = isSessionActive;
  }, [isSessionActive, finalizeSession, elapsedSeconds, sessionTargetMinutes, durationMin]);

  React.useEffect(() => {
    if (!isSessionActive && elapsedSeconds === 0 && sessionTargetMinutes !== durationMin) {
      setSessionTargetMinutes(durationMin);
    }
  }, [durationMin, isSessionActive, elapsedSeconds, sessionTargetMinutes]);

  const targetSecondsForSession = Math.max(1, Math.round(sessionTargetMinutes * 60));
  const previewSeconds = Math.max(1, Math.round(durationMin * 60));
  const displayTotalSeconds =
    isSessionActive || elapsedSeconds > 0 ? targetSecondsForSession : previewSeconds;
  const progress = displayTotalSeconds ? Math.min(1, elapsedSeconds / displayTotalSeconds) : 0;
  const progressPercent = Math.min(100, Math.max(0, Math.round(progress * 100)));

  const stageSummaries = React.useMemo(
    () => buildStageSummaries(elapsedSeconds, displayTotalSeconds),
    [elapsedSeconds, displayTotalSeconds]
  );

  const currentStageIndex = React.useMemo(() => {
    if (stageSummaries.length === 0) return 0;
    if (progress >= 1) return stageSummaries.length - 1;
    const idx = stageSummaries.findIndex((stage) => elapsedSeconds < stage.endSeconds);
    return idx === -1 ? stageSummaries.length - 1 : idx;
  }, [stageSummaries, progress, elapsedSeconds]);

  const currentStage = stageSummaries[currentStageIndex] ?? stageSummaries[0];
  const stageRemainingSeconds = currentStage
    ? Math.max(0, currentStage.plannedSeconds - currentStage.actualSeconds)
    : 0;
  const totalRemainingSeconds = Math.max(
    0,
    displayTotalSeconds - Math.min(elapsedSeconds, displayTotalSeconds)
  );
  const stageProgressValues = stageSummaries.map((stage) =>
    stage.plannedSeconds ? Math.min(1, stage.actualSeconds / stage.plannedSeconds) : 0
  );

  function applyPreset(k: PresetKey) {
    const p = PRESETS[k];
    setPreset(k);
    setBpm(p.bpm);
    setInt(p.intensity);
    setTheme(p.theme);
    setShape(p.shape);
  }
  function onPrimaryAction() {
    const now = Date.now();

    if (!isSessionActive) {
      setElapsedSeconds(0);
      setSessionTargetMinutes(durationMin);
      setSessionStartedAt(now);
      setAutoSaveStatus("idle");
      setAutoSaveError(null);
      setSessionRecordId(null);
      setLastSessionReason(null);
      setMoodAfterSession(moodBaseline);
      setMoodDelta(null);
      eventLoggedRef.current = false;
      lastZone.current = -1;
      setSessionActive(true);
      setRunning(true);

      try {
        recordEvent?.({
          module: "flash-glow-ultra",
          startedAt: new Date(now).toISOString(),
          meta: { preset, bpm, intensity, theme, shape, durationMin }
        });
      } catch (err) {
        console.warn("flash-glow-ultra start", err);
      }

      return;
    }

    if (!running) {
      setRunning(true);
      return;
    }

    setRunning(false);
    setSessionActive(false);
  }

  const retrySave = React.useCallback(() => {
    if (lastSessionReason) {
      finalizeSession(lastSessionReason);
    }
  }, [lastSessionReason, finalizeSession]);

  const primaryLabel = !isSessionActive ? "Démarrer" : running ? "Terminer" : "Reprendre";

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
              <select value={preset} onChange={(e) => applyPreset(e.target.value as PresetKey)}>
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
                onChange={(e) => setInt(parseFloat(e.target.value))}
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
                onChange={(e) => setDur(parseInt(e.target.value, 10))}
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
                onChange={(e) => setMoodBaseline(parseInt(e.target.value, 10))}
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
                onChange={(e) => setMoodAfterSession(parseInt(e.target.value, 10))}
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
              <span>Écoulé : {formatTime(elapsedSeconds)}</span>
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

          <div style={{ display: "flex", gap: 8 }}>
            <Button onClick={onPrimaryAction} data-ui="primary-cta">
              {primaryLabel}
            </Button>
            {isSessionActive && running && (
              <Button onClick={() => setRunning(false)} type="button">
                Pause
              </Button>
            )}
          </div>

          <small style={{ opacity: 0.75 }}>
            Sécurité anti-flash activée (≤3 Hz). Si tu utilises “Réduction des animations” sur ton appareil,
            l’animation devient très douce.
          </small>

          {autoSaveStatus !== "idle" && (
            <div style={{ fontSize: 12, lineHeight: 1.5 }}>
              {autoSaveStatus === "saving" && (
                <span style={{ color: "var(--accent, #f97316)" }}>
                  Enregistrement automatique en cours...
                </span>
              )}
              {autoSaveStatus === "saved" && (
                <span style={{ color: "var(--success, #22c55e)" }}>
                  Session enregistrée automatiquement
                  {sessionRecordId ? ` (#${sessionRecordId.slice(0, 8)})` : ""}.
                  {moodDelta !== null && (
                    <span style={{ marginLeft: 4 }}>
                      Δ humeur {moodDelta > 0 ? `+${moodDelta}` : moodDelta}
                    </span>
                  )}
                </span>
              )}
              {autoSaveStatus === "unauthenticated" && (
                <span style={{ color: "var(--warning, #facc15)" }}>
                  Connectez-vous pour enregistrer vos sessions Flash Glow Ultra.
                </span>
              )}
              {autoSaveStatus === "error" && (
                <span style={{ color: "var(--destructive, #ef4444)" }}>
                  Enregistrement impossible{autoSaveError ? ` : ${autoSaveError}` : ""}.
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
                </span>
              )}
            </div>
          )}
        </section>
      </Card>
    </main>
  );
}
