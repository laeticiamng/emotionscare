"use client";
import React from "react";
import { PageHeader, Card, Button } from "@/COMPONENTS.reg";
import { ConstellationCanvas } from "@/COMPONENTS.reg";
import { useBreathPattern, Pattern } from "@/ui/hooks/useBreathPattern";
import { useSound } from "@/COMPONENTS.reg"; // si P5 dispo
import { ff } from "@/lib/flags/ff";
import { recordEvent } from "@/lib/scores/events"; // si P6 dispo

const PATTERNS: Record<string, Pattern> = {
  "coherence-5-5": [
    { phase: "inhale", sec: 5 },
    { phase: "exhale", sec: 5 },
  ],
  "4-7-8": [
    { phase: "inhale", sec: 4 },
    { phase: "hold", sec: 7 },
    { phase: "exhale", sec: 8 },
  ],
  "box-4-4-4-4": [
    { phase: "inhale", sec: 4 },
    { phase: "hold", sec: 4 },
    { phase: "exhale", sec: 4 },
    { phase: "hold2", sec: 4 },
  ],
  "triangle-4-6-8": [
    { phase: "inhale", sec: 4 },
    { phase: "hold", sec: 6 },
    { phase: "exhale", sec: 8 },
  ],
};

export default function BreathConstellationPage() {
  const [patternKey, setPatternKey] = React.useState<keyof typeof PATTERNS>("coherence-5-5");
  const [cycles, setCycles] = React.useState(8);
  const [density, setDensity] = React.useState(0.8); // 0..1
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const bp = useBreathPattern(PATTERNS[patternKey], cycles);
  const useNewAudio = ff?.("new-audio-engine") ?? false;
  const cue = useNewAudio ? useSound?.("/audio/tick.mp3") ?? null : null;

  const lastPhase = React.useRef<string>("");
  React.useEffect(() => {
    const p = bp.current.phase;
    if (p !== lastPhase.current) {
      lastPhase.current = p;
      if (cue?.play) cue.play().catch(() => {});
      if ("vibrate" in navigator && !reduced) navigator.vibrate?.(6);
    }
  }, [bp.current.phase, cue, reduced]);

  React.useEffect(() => {
    if (!bp.running && bp.cycle >= cycles && cycles > 0) {
      const dur = PATTERNS[patternKey].reduce((s, p) => s + p.sec, 0) * cycles;
      recordEvent?.({
        module: "breath-constellation",
        startedAt: new Date(Date.now() - dur * 1000).toISOString(),
        endedAt: new Date().toISOString(),
        durationSec: dur,
        score: Math.min(10, Math.round(cycles * 1.2)),
        meta: { pattern: patternKey, density },
      });
    }
  }, [bp.running, bp.cycle, cycles, density, patternKey]);

  return (
    <main aria-label="Breath Constellation">
      <PageHeader title="Breath Constellation" subtitle="Respiration guidée par une constellation vivante" />
      <Card>
        <section style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gap: 8 }}>
            <label>
              Pattern
              <select value={patternKey} onChange={(e) => setPatternKey(e.target.value as any)}>
                <option value="coherence-5-5">Cohérence (5-5)</option>
                <option value="4-7-8">4-7-8</option>
                <option value="box-4-4-4-4">Box (4-4-4-4)</option>
                <option value="triangle-4-6-8">Triangle (4-6-8)</option>
              </select>
            </label>

            <label>
              Cycles : {cycles}
              <input type="range" min={4} max={16} step={1} value={cycles} onChange={(e) => setCycles(parseInt(e.target.value, 10))} />
            </label>

            <label>
              Densité : {Math.round(density * 100)}%
              <input type="range" min={0.3} max={1} step={0.05} value={density} onChange={(e) => setDensity(parseFloat(e.target.value))} />
            </label>
          </div>

          <ConstellationCanvas phase={bp.current.phase} phaseProgress={bp.phaseProgress} reduced={!!reduced} density={density} />

          <div style={{ display: "flex", gap: 8 }}>
            <Button onClick={bp.toggle} data-ui="primary-cta">{bp.running ? "Pause" : "Démarrer"}</Button>
            {!bp.running && bp.cycle > 0 && bp.cycle < cycles && <Button onClick={bp.start}>Reprendre</Button>}
            <Button onClick={bp.stop}>Arrêter</Button>
          </div>

          <small>Cycle {Math.min(bp.cycle, cycles)} / {cycles}</small>
        </section>
      </Card>
    </main>
  );
}

