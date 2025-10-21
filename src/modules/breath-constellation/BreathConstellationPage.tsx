"use client";

import React from "react";
import * as Sentry from "@sentry/react";
import { useReducedMotion } from "framer-motion";
import PageHeader from "@/components/ui/PageHeader";
import { logger } from '@/lib/logger';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConstellationCanvas } from "@/ui/ConstellationCanvas";
import { useBreathPattern, type Pattern, type Phase } from "@/ui/hooks/useBreathPattern";
import { useSound } from "@/ui/hooks/useSound";
import { ff } from "@/lib/flags/ff";
import { recordEvent } from "@/lib/scores/events";
import {
  logBreathworkSession,
  BreathworkSessionAuthError,
  BreathworkSessionPersistError,
} from "@/services/breathworkSessions.service";
import { useSessionClock } from "@/modules/sessions/hooks/useSessionClock";
import { logAndJournal } from "@/services/sessions/sessionsApi";

type BreathProtocolId = "coherence-5-5" | "4-7-8" | "box-4-4-4-4" | "triangle-4-6-8";

type BreathProtocolDefinition = {
  id: BreathProtocolId;
  label: string;
  description: string;
  focus: string;
  benefits: string[];
  recommendedCycles: number;
  recommendedDensity: number;
  pattern: Pattern;
};

type BreathProtocol = BreathProtocolDefinition & {
  cycleDuration: number;
  cadence: number;
};

type SaveStatus = "idle" | "saving" | "saved" | "error" | "unauthenticated";

const PHASE_LABELS: Record<Phase, string> = {
  inhale: "Inspiration",
  hold: "Rétention pleine",
  exhale: "Expiration",
  hold2: "Rétention basse",
};

const PHASE_DESCRIPTIONS: Record<Phase, string> = {
  inhale: "Soulevez doucement la cage thoracique et remplissez vos poumons.",
  hold: "Suspendez la respiration, épaules relâchées.",
  exhale: "Relâchez l'air sans effort, videz complètement.",
  hold2: "Gardez les poumons vides dans le calme avant le prochain cycle.",
};

const PROTOCOL_DEFINITIONS: BreathProtocolDefinition[] = [
  {
    id: "coherence-5-5",
    label: "Cohérence cardiaque 5-5",
    description: "6 respirations par minute pour réguler le système nerveux.",
    focus: "Équilibre & clarté",
    benefits: [
      "Stabilise la variabilité cardiaque",
      "Idéal pour une pause active ou avant une réunion",
    ],
    recommendedCycles: 10,
    recommendedDensity: 0.8,
    pattern: [
      { phase: "inhale", sec: 5 },
      { phase: "exhale", sec: 5 },
    ],
  },
  {
    id: "4-7-8",
    label: "Sommeil profond 4-7-8",
    description: "Allonge l'expiration pour apaiser le mental et préparer le repos.",
    focus: "Apaisement & lâcher-prise",
    benefits: [
      "Réduit rapidement la tension accumulée",
      "Facilite l'endormissement et calme les ruminations",
    ],
    recommendedCycles: 6,
    recommendedDensity: 0.7,
    pattern: [
      { phase: "inhale", sec: 4 },
      { phase: "hold", sec: 7 },
      { phase: "exhale", sec: 8 },
    ],
  },
  {
    id: "box-4-4-4-4",
    label: "Carré 4-4-4-4",
    description: "Rythme symétrique pour la concentration et la préparation mentale.",
    focus: "Focus & préparation",
    benefits: [
      "Améliore la clarté d'esprit",
      "Structure la respiration avant un effort cognitif",
    ],
    recommendedCycles: 12,
    recommendedDensity: 0.9,
    pattern: [
      { phase: "inhale", sec: 4 },
      { phase: "hold", sec: 4 },
      { phase: "exhale", sec: 4 },
      { phase: "hold2", sec: 4 },
    ],
  },
  {
    id: "triangle-4-6-8",
    label: "Triangle 4-6-8",
    description: "Progression douce vers une expiration allongée pour relâcher les tensions.",
    focus: "Décompression & ancrage",
    benefits: [
      "Déverrouille la respiration abdominale",
      "Idéal après une journée dense ou avant un soin",
    ],
    recommendedCycles: 9,
    recommendedDensity: 0.75,
    pattern: [
      { phase: "inhale", sec: 4 },
      { phase: "hold", sec: 6 },
      { phase: "exhale", sec: 8 },
    ],
  },
];

const toProtocol = (definition: BreathProtocolDefinition): BreathProtocol => {
  const cycleDuration = definition.pattern.reduce((total, step) => total + Math.max(0, step.sec), 0);
  const cadence = cycleDuration > 0 ? Number.parseFloat((60 / cycleDuration).toFixed(2)) : 0;
  return {
    ...definition,
    cycleDuration,
    cadence,
  };
};

const PROTOCOLS_BY_ID = PROTOCOL_DEFINITIONS.reduce<Record<BreathProtocolId, BreathProtocol>>(
  (acc, definition) => {
    acc[definition.id] = toProtocol(definition);
    return acc;
  },
  {} as Record<BreathProtocolId, BreathProtocol>,
);

const PROTOCOL_SEQUENCE = PROTOCOL_DEFINITIONS.map(definition => PROTOCOLS_BY_ID[definition.id]);

const DEFAULT_PROTOCOL_ID: BreathProtocolId = "coherence-5-5";

const PROTOCOL_JOURNAL_SUMMARY: Record<BreathProtocolId, string> = {
  "coherence-5-5": "Respiration cohérence cardiaque terminée, souffle plus stable.",
  "4-7-8": "Respiration sommeil profond terminée, esprit apaisé.",
  "box-4-4-4-4": "Respiration carré terminée, concentration renforcée.",
  "triangle-4-6-8": "Respiration triangle terminée, tensions relâchées."
};

const formatDuration = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0 s";
  if (seconds >= 120) {
    return `${(seconds / 60).toFixed(1)} min`;
  }
  if (seconds >= 60) {
    return `${(seconds / 60).toFixed(1)} min`;
  }
  return `${Math.round(seconds)} s`;
};

export default function BreathConstellationPage() {
  const prefersReducedMotion = useReducedMotion();
  const isReducedMotion = Boolean(prefersReducedMotion);

  const [patternKey, setPatternKey] = React.useState<BreathProtocolId>(DEFAULT_PROTOCOL_ID);
  const protocol = PROTOCOLS_BY_ID[patternKey] ?? PROTOCOLS_BY_ID[DEFAULT_PROTOCOL_ID];

  const [cycles, setCycles] = React.useState(() => protocol.recommendedCycles);
  const [density, setDensity] = React.useState(() => protocol.recommendedDensity);
  const [soundCues, setSoundCues] = React.useState(() => (ff?.("new-audio-engine") ?? false));
  const [hapticsEnabled, setHapticsEnabled] = React.useState(() => !isReducedMotion);
  const [saveStatus, setSaveStatus] = React.useState<SaveStatus>("idle");
  const [saveMessage, setSaveMessage] = React.useState<string | null>(null);

  const clock = useSessionClock({ durationMs: cycles > 0 ? cycles * protocol.cycleDuration * 1000 : undefined });
  const bp = useBreathPattern(protocol.pattern, cycles);
  const { current, phaseProgress, running, cycle, start, stop, toggle } = bp;
  const phaseDuration = bp.phaseDuration;

  const audioEnabled = ff?.("new-audio-engine") ?? false;
  const cue = useSound?.("/audio/tick.mp3", { volume: 0.45 }) ?? null;

  const sessionStartRef = React.useRef<Date | null>(null);
  const primaryButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const lastPhaseRef = React.useRef<Phase | null>(null);

  const clockState = clock.state;
  const clockElapsedSeconds = Math.max(0, Math.round(clock.elapsedMs / 1000));
  const plannedSeconds = cycles > 0 ? cycles * protocol.cycleDuration : 0;
  const clockProgress = plannedSeconds > 0
    ? Math.min(1, clock.progress ?? clockElapsedSeconds / plannedSeconds)
    : undefined;
  const sessionStatusMessage = React.useMemo(() => {
    if (running) return "Séance en cours.";
    if (clockState === "paused") return "Séance en pause.";
    if (clockState === "completed") return "Séance terminée.";
    return "Séance prête à démarrer.";
  }, [clockState, running]);

  const resetFeedback = React.useCallback(() => {
    setSaveStatus("idle");
    setSaveMessage(null);
  }, []);

  React.useEffect(() => {
    if (isReducedMotion) {
      setHapticsEnabled(false);
      setDensity(prev => {
        const capped = Math.min(prev, 0.6);
        return Number.parseFloat(capped.toFixed(2));
      });
    }
  }, [isReducedMotion]);

  React.useEffect(() => {
    const phase = current.phase;
    if (phase !== lastPhaseRef.current) {
      lastPhaseRef.current = phase;
      if (audioEnabled && soundCues && cue?.play) {
        cue.play().catch(() => {});
      }
      if (hapticsEnabled && !isReducedMotion && "vibrate" in navigator) {
        navigator.vibrate?.(8);
      }
    }
  }, [current.phase, audioEnabled, soundCues, cue, hapticsEnabled, isReducedMotion]);

  const logSession = React.useCallback(
    async (cyclesCompleted: number, completed: boolean) => {
      const startedAt = sessionStartRef.current ?? new Date();
      const endedAt = new Date();
      const durationSec = Math.max(1, clockElapsedSeconds || 0);
      const normalizedCycles = Math.max(0, cyclesCompleted);
      const cadence = durationSec > 0
        ? Number.parseFloat(((normalizedCycles * 60) / durationSec).toFixed(2))
        : protocol.cadence;

      try {
        recordEvent?.({
          module: "breath-constellation",
          startedAt: startedAt.toISOString(),
          endedAt: endedAt.toISOString(),
          durationSec,
          score: Math.min(10, Math.round((completed ? cycles : normalizedCycles) * 1.25)),
          meta: {
            pattern: patternKey,
            density,
            cyclesPlanned: cycles,
            cyclesCompleted: normalizedCycles,
            cadence,
            completed,
            soundCues,
            haptics: hapticsEnabled && !isReducedMotion,
          },
        });
      } catch (error) {
        logger.warn("breath-constellation event", error, 'SYSTEM');
      }

      setSaveStatus("saving");
      setSaveMessage("Enregistrement de la session...");

      try {
        await logBreathworkSession({
          technique: patternKey,
          durationSec,
          startedAt: startedAt.toISOString(),
          endedAt: endedAt.toISOString(),
          cyclesPlanned: cycles,
          cyclesCompleted: normalizedCycles,
          density,
          completed,
          cadence,
          soundCues,
          haptics: hapticsEnabled && !isReducedMotion,
        });
        await logAndJournal({
          type: "breath",
          duration_sec: durationSec,
          mood_delta: null,
          journalText: PROTOCOL_JOURNAL_SUMMARY[patternKey] ?? "Respiration terminée, souffle plus fluide.",
          meta: {
            protocol: patternKey,
            density,
            cycles_planned: cycles,
            cycles_completed: normalizedCycles,
            cadence,
            completed,
            soundCues,
            haptics: hapticsEnabled && !isReducedMotion,
            reduced_motion: isReducedMotion
          }
        });
        setSaveStatus("saved");
        setSaveMessage("Session enregistrée et ajoutée automatiquement au journal.");
        Sentry.addBreadcrumb({
          category: "session",
          message: "session:complete",
          level: "info",
          data: { module: "breath_constellation", duration_sec: durationSec, completed }
        });
      } catch (error) {
        if (error instanceof BreathworkSessionAuthError) {
          setSaveStatus("unauthenticated");
          setSaveMessage("Connectez-vous pour enregistrer automatiquement vos séances de respiration.");
        } else if (error instanceof BreathworkSessionPersistError) {
          setSaveStatus("error");
          setSaveMessage(error.message);
        } else {
          logger.error("Breathwork session logging failed", error as Error, 'SYSTEM');
          setSaveStatus("error");
          setSaveMessage("Impossible d'enregistrer la session pour le moment.");
        }
        Sentry.captureException(error);
      } finally {
        sessionStartRef.current = null;
        clock.reset();
      }
    },
    [
      cycles,
      density,
      patternKey,
      protocol.cadence,
      soundCues,
      hapticsEnabled,
      isReducedMotion,
      logBreathworkSession,
      clock,
      clockElapsedSeconds,
      logAndJournal,
    ],
  );

  const finalizeSession = React.useCallback(
    (cyclesCompleted: number, completed: boolean) => {
      clock.complete();
      void logSession(cyclesCompleted, completed);
    },
    [clock, logSession],
  );

  React.useEffect(() => {
    if (running && cycles > 0 && cycle >= cycles && sessionStartRef.current) {
      const completedCycles = Math.min(cycle, cycles);
      finalizeSession(completedCycles, true);
      stop();
    }
  }, [running, cycle, cycles, finalizeSession, stop]);

  const handlePatternChange = React.useCallback(
    (next: BreathProtocolId) => {
      const nextProtocol = PROTOCOLS_BY_ID[next] ?? PROTOCOLS_BY_ID[DEFAULT_PROTOCOL_ID];
      setPatternKey(next);
      setCycles(nextProtocol.recommendedCycles);
      setDensity(nextProtocol.recommendedDensity);
      sessionStartRef.current = null;
      clock.reset();
      resetFeedback();
    },
    [clock, resetFeedback],
  );

  const handleCycleChange = React.useCallback(
    (value: number) => {
      setCycles(value);
      clock.reset();
      resetFeedback();
    },
    [clock, resetFeedback],
  );

  const handleDensityChange = React.useCallback(
    (value: number) => {
      setDensity(Number.parseFloat(value.toFixed(2)));
      resetFeedback();
    },
    [resetFeedback],
  );

  const handleToggle = React.useCallback(() => {
    if (!running) {
      if (clockState === "idle" || clockState === "completed") {
        sessionStartRef.current = new Date();
        clock.reset();
        clock.start();
        Sentry.addBreadcrumb({
          category: "session",
          message: "session:start",
          level: "info",
          data: { module: "breath_constellation" }
        });
      } else if (clockState === "paused") {
        clock.resume();
        Sentry.addBreadcrumb({
          category: "session",
          message: "session:resume",
          level: "info",
          data: { module: "breath_constellation" }
        });
      }
      resetFeedback();
    } else {
      clock.pause();
      Sentry.addBreadcrumb({
        category: "session",
        message: "session:pause",
        level: "info",
        data: { module: "breath_constellation" }
      });
    }
    toggle();
    primaryButtonRef.current?.focus({ preventScroll: true });
  }, [running, clockState, clock, toggle, resetFeedback]);

  const handleResume = React.useCallback(() => {
    sessionStartRef.current = new Date();
    clock.reset();
    clock.start();
    Sentry.addBreadcrumb({
      category: "session",
      message: "session:start",
      level: "info",
      data: { module: "breath_constellation" }
    });
    resetFeedback();
    start();
    primaryButtonRef.current?.focus({ preventScroll: true });
  }, [clock, start, resetFeedback]);

  const handleStop = React.useCallback(() => {
    const completedCycles = Math.min(cycle, cycles);
    const completed = cycles > 0 && completedCycles >= cycles;
    clock.complete();
    if (sessionStartRef.current) {
      finalizeSession(completedCycles, completed);
    }
    stop();
    sessionStartRef.current = null;
    primaryButtonRef.current?.focus({ preventScroll: true });
  }, [cycle, cycles, finalizeSession, stop, clock]);

  const phaseLabel = PHASE_LABELS[current.phase];
  const phaseDescription = PHASE_DESCRIPTIONS[current.phase];
  const phasePercent = Math.round(Math.min(1, Math.max(0, phaseProgress)) * 100);
  const phaseRemaining = Math.max(0, Math.round((phaseDuration ?? 0) * (1 - phaseProgress)));

  const sessionProgress = React.useMemo(() => {
    if (typeof clockProgress === "number") {
      return clockProgress;
    }
    if (cycles <= 0) return 0;
    const effective = Math.min(cycle, cycles) + Math.min(1, Math.max(0, phaseProgress));
    return Math.min(1, Math.max(0, effective / cycles));
  }, [clockProgress, cycle, cycles, phaseProgress]);

  const sessionEstimate = React.useMemo(() => {
    const expectedSeconds = cycles * protocol.cycleDuration;
    return {
      expected: formatDuration(expectedSeconds),
      cycle: formatDuration(protocol.cycleDuration),
    };
  }, [cycles, protocol.cycleDuration]);

  const saveTone = React.useMemo(() => {
    switch (saveStatus) {
      case "saving":
        return "#1d4ed8";
      case "saved":
        return "#047857";
      case "unauthenticated":
        return "#9d174d";
      case "error":
        return "#b91c1c";
      default:
        return "#64748b";
    }
  }, [saveStatus]);

  return (
    <main aria-label="Breath Constellation" style={{ position: "relative" }}>
      <div
        role="status"
        aria-live="polite"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {sessionStatusMessage}
      </div>
      <PageHeader
        title="Breath Constellation"
        subtitle="Respiration guidée par une constellation vivante"
      />
      <Card>
        <section style={{ display: "grid", gap: 20 }}>
          <div style={{ display: "grid", gap: 12 }}>
            <label style={{ display: "grid", gap: 4 }}>
              <span style={{ fontWeight: 600 }}>Protocole respiratoire</span>
              <select
                value={patternKey}
                onChange={event => handlePatternChange(event.target.value as BreathProtocolId)}
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #1f2937" }}
              >
                {PROTOCOL_SEQUENCE.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <div style={{ display: "grid", gap: 6 }}>
              <p style={{ margin: 0, fontSize: 14, color: "#94a3b8" }}>{protocol.description}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <span
                  style={{
                    padding: "4px 8px",
                    background: "rgba(59,130,246,0.16)",
                    borderRadius: 999,
                    fontSize: 12,
                    color: "#60a5fa",
                  }}
                >
                  {protocol.focus}
                </span>
                <span
                  style={{
                    padding: "4px 8px",
                    background: "rgba(96,165,250,0.12)",
                    borderRadius: 999,
                    fontSize: 12,
                    color: "#93c5fd",
                  }}
                >
                  {protocol.cadence} cycles/min
                </span>
                <span
                  style={{
                    padding: "4px 8px",
                    background: "rgba(56,189,248,0.12)",
                    borderRadius: 999,
                    fontSize: 12,
                    color: "#22d3ee",
                  }}
                >
                  Cycle {sessionEstimate.cycle}
                </span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, color: "#cbd5f5", fontSize: 13 }}>
                {protocol.benefits.map(benefit => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            <label>
              Cycles planifiés : {cycles}
              <input
                type="range"
                min={4}
                max={18}
                step={1}
                value={cycles}
                onChange={event => handleCycleChange(Number.parseInt(event.target.value, 10))}
              />
            </label>

            <label>
              Densité visuelle : {Math.round(density * 100)}%
              <input
                type="range"
                min={0.3}
                max={isReducedMotion ? 0.6 : 1}
                step={0.05}
                value={density}
                onChange={event => handleDensityChange(Number.parseFloat(event.target.value))}
              />
            </label>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
                <input
                  type="checkbox"
                  checked={soundCues}
                  onChange={event => {
                    setSoundCues(event.target.checked);
                    resetFeedback();
                  }}
                />
                Signal sonore
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
                <input
                  type="checkbox"
                  checked={hapticsEnabled}
                  disabled={isReducedMotion}
                  onChange={event => {
                    setHapticsEnabled(event.target.checked);
                    resetFeedback();
                  }}
                />
                Vibrations douces
              </label>
              {isReducedMotion && (
                <span style={{ fontSize: 12, color: "#94a3b8" }}>
                  Options adaptées à votre préférence « réduire les animations ».
                </span>
              )}
            </div>
          </div>

          <ConstellationCanvas
            phase={current.phase}
            phaseProgress={phaseProgress}
            phaseDuration={phaseDuration}
            reduced={isReducedMotion}
            density={density}
          />

          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 4 }}>
              <strong style={{ fontSize: 16 }}>{phaseLabel}</strong>
              <span style={{ fontSize: 14, color: "#cbd5f5" }}>{phaseDescription}</span>
              <span style={{ fontSize: 13, color: "#94a3b8" }}>
                {phasePercent}% du segment – {formatDuration(phaseRemaining)} restantes
              </span>
            </div>
            <div aria-hidden style={{ height: 6, background: "rgba(148,163,184,0.25)", borderRadius: 999 }}>
              <div
                style={{
                  width: `${Math.round(sessionProgress * 100)}%`,
                  background: "linear-gradient(90deg, #60a5fa, #2563eb)",
                  height: "100%",
                  borderRadius: 999,
                  transition: "width 120ms ease-out",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#94a3b8" }}>
              <span>
                Cycle {Math.min(cycle, cycles)} / {cycles}
              </span>
              <span>Session cible : {sessionEstimate.expected}</span>
            </div>
            <div>
              <h4 style={{ margin: "8px 0", fontSize: 14, color: "#cbd5f5" }}>Phases du protocole</h4>
              <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "#94a3b8", display: "grid", gap: 4 }}>
                {protocol.pattern.map((step, index) => (
                  <li key={`${step.phase}-${index}`}>
                    {PHASE_LABELS[step.phase]} • {step.sec} s
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button ref={primaryButtonRef} onClick={handleToggle} data-ui="primary-cta">
              {running ? "Pause" : "Démarrer"}
            </Button>
            {!running && cycle > 0 && cycle < cycles && (
              <Button onClick={handleResume}>Reprendre</Button>
            )}
            <Button onClick={handleStop}>Terminer</Button>
          </div>

          {saveMessage && (
            <div
              role="status"
              aria-live="polite"
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: `1px solid ${saveTone}`,
                background: "rgba(15,23,42,0.45)",
                color: saveTone,
                fontSize: 13,
              }}
            >
              {saveMessage}
            </div>
          )}
        </section>
      </Card>
    </main>
  );
}
