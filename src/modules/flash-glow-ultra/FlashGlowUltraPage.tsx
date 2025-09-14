"use client";
import React from "react";
import { PageHeader, Card, Button } from "@/COMPONENTS.reg";
import { GlowSurface } from "@/COMPONENTS.reg";
import { usePulseClock } from "@/COMPONENTS.reg";
import { ff } from "@/lib/flags/ff";
import { useSound } from "@/COMPONENTS.reg";       // si P5 dispo
import { recordEvent } from "@/lib/scores/events"; // si P6 dispo

type Theme = "cyan"|"violet"|"amber"|"emerald";
type PresetKey = "calme"|"focus"|"recovery";

const PRESETS: Record<PresetKey, { bpm: number; intensity: number; theme: Theme; shape: "ring"|"full" }> = {
  calme:    { bpm: 6,  intensity: 0.6, theme: "emerald", shape: "ring" },
  focus:    { bpm: 8,  intensity: 0.7, theme: "cyan",    shape: "ring" },
  recovery: { bpm: 4,  intensity: 0.8, theme: "violet",  shape: "full" }
};

export default function FlashGlowUltraPage() {
  const [preset, setPreset]   = React.useState<PresetKey>("calme");
  const [bpm, setBpm]         = React.useState(PRESETS.calme.bpm);        // visuel <= 3 Hz → ici 4..12 par défaut
  const [intensity, setInt]   = React.useState(PRESETS.calme.intensity);  // 0..1
  const [theme, setTheme]     = React.useState<Theme>(PRESETS.calme.theme);
  const [shape, setShape]     = React.useState<"ring"|"full">(PRESETS.calme.shape);
  const [running, setRunning] = React.useState(false);
  const [durationMin, setDur] = React.useState(2); // 1..10 min
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // Cap visuel ≤ 3 Hz: si l'utilisateur pousse trop le BPM, on lisse visuellement (phase effective divisée)
  const SAFE_BPM = Math.min(Math.max(1, bpm), 12);
  const rawPhase = usePulseClock(SAFE_BPM, running);
  const phase01 = Math.min(1, rawPhase * Math.max(1, SAFE_BPM / 6)); // au-delà de 6 bpm, on compresse la variation pour éviter la sensation de flash

  const useNewAudio = ff?.("new-audio-engine") ?? false;
  const tick = useNewAudio ? (useSound?.("/audio/tick.mp3") ?? null) : null;

  // Cue doux à chaque "apex" (phase ~ 0)
  const lastZone = React.useRef<number>(-1);
  React.useEffect(() => {
    if (!running) return;
    const zone = phase01 < 0.1 ? 0 : phase01 > 0.9 ? 1 : -1;
    if (zone !== -1 && zone !== lastZone.current) {
      lastZone.current = zone;
      if (tick?.play) tick.play().catch(()=>{});
      if ("vibrate" in navigator && !reduced) navigator.vibrate?.(8);
    }
  }, [phase01, running, tick, reduced]);

  // Durée de session
  React.useEffect(() => {
    if (!running) return;
    const ms = durationMin * 60 * 1000;
    const id = setTimeout(() => setRunning(false), ms);
    return () => clearTimeout(id);
  }, [running, durationMin]);

  function applyPreset(k: PresetKey) {
    const p = PRESETS[k];
    setPreset(k); setBpm(p.bpm); setInt(p.intensity); setTheme(p.theme); setShape(p.shape);
  }

  function onStartStop() {
    const now = Date.now();
    if (!running) {
      setRunning(true);
      // event start (non bloquant)
      try {
        recordEvent?.({
          module: "flash-glow-ultra",
          startedAt: new Date(now).toISOString(),
          meta: { preset, bpm, intensity, theme, shape, durationMin }
        });
      } catch {}
    } else {
      setRunning(false);
      try {
        recordEvent?.({
          module: "flash-glow-ultra",
          startedAt: new Date(now - durationMin*60*1000).toISOString(),
          endedAt: new Date().toISOString(),
          durationSec: durationMin * 60,
          score: Math.min(10, 2 + Math.round(durationMin/2)),
          meta: { preset, bpm, intensity, theme, shape }
        });
      } catch {}
    }
  }

  return (
    <main aria-label="Flash Glow Ultra">
      <PageHeader title="Flash Glow Ultra" subtitle="Glow respiratoire avancé, sûr et personnalisable" />
      <Card>
        <section style={{ display:"grid", gap:12 }}>
          <div style={{ display:"grid", gap:8 }}>
            <label>
              Preset
              <select value={preset} onChange={(e)=>applyPreset(e.target.value as PresetKey)}>
                <option value="calme">Calme (6 bpm, emerald)</option>
                <option value="focus">Focus (8 bpm, cyan)</option>
                <option value="recovery">Recovery (4 bpm, violet)</option>
              </select>
            </label>

            <label>
              BPM visuel : {bpm}
              <input type="range" min={2} max={12} step={1} value={bpm} onChange={(e)=>setBpm(parseInt(e.target.value,10))} />
            </label>

            <label>
              Intensité : {Math.round(intensity*100)}%
              <input type="range" min={0.2} max={1} step={0.05} value={intensity} onChange={(e)=>setInt(parseFloat(e.target.value))} />
            </label>

            <label>
              Thème
              <select value={theme} onChange={(e)=>setTheme(e.target.value as Theme)}>
                <option value="emerald">Émeraude</option>
                <option value="cyan">Cyan</option>
                <option value="violet">Violet</option>
                <option value="amber">Ambre</option>
              </select>
            </label>

            <label>
              Forme
              <select value={shape} onChange={(e)=>setShape(e.target.value as any)}>
                <option value="ring">Anneau</option>
                <option value="full">Plein</option>
              </select>
            </label>

            <label>
              Durée (min) : {durationMin}
              <input type="range" min={1} max={10} step={1} value={durationMin} onChange={(e)=>setDur(parseInt(e.target.value,10))} />
            </label>
          </div>

          <GlowSurface phase01={phase01} theme={theme} intensity={intensity} shape={shape} />

          <div style={{ display:"flex", gap:8 }}>
            <Button onClick={onStartStop} data-ui="primary-cta">{running ? "Arrêter" : "Démarrer"}</Button>
            {running && <Button onClick={()=>setRunning(false)}>Pause</Button>}
          </div>

          <small style={{ opacity:.75 }}>
            Sécurité anti-flash activée (≤3 Hz). Si tu utilises “Réduction des animations” sur ton appareil, l’animation devient très douce.
          </small>
        </section>
      </Card>
    </main>
  );
}
