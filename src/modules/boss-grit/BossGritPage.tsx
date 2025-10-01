// @ts-nocheck
"use client";
import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/ui/ProgressBar";
import { useTimer } from "@/ui/hooks/useTimer";
import { loadTasks, upsertTask, removeTask, GritTask } from "@/lib/boss-grit/store";
import { ff } from "@/lib/flags/ff";
import { useSound } from "@/ui/hooks/useSound";          // si P5 dispo (sinon null)
import { recordEvent } from "@/lib/scores/events";    // si P6 dispo (sinon no-op)

const PRESETS: { label: string; ms: number }[] = [
  { label: "90 s",   ms: 90_000 },
  { label: "3 min",  ms: 180_000 },
  { label: "5 min",  ms: 300_000 },
  { label: "10 min", ms: 600_000 }
];

export default function BossGritPage() {
  const [selMs, setSelMs] = React.useState<number>(180_000);
  const [tasks, setTasks] = React.useState<GritTask[]>([]);
  const [newTask, setNewTask] = React.useState("");

  const t = useTimer(selMs);
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const useNewAudio = ff?.("new-audio-engine") ?? false;
  const beep = useNewAudio ? (useSound?.("/audio/tick.mp3") ?? null) : null;

  React.useEffect(() => { setTasks(loadTasks()); }, []);

  React.useEffect(() => {
    if (t.done) {
      try {
        beep?.play?.(); // bip de fin
        if ("vibrate" in navigator && !reduced) navigator.vibrate?.(12);
        recordEvent?.({
          module: "boss-grit",
          startedAt: new Date(Date.now() - t.totalMs).toISOString(),
          endedAt: new Date().toISOString(),
          durationSec: Math.round(t.totalMs / 1000),
          score: 2 + Math.round(t.totalMs / 120000), // proxy: 90s->3, 3min->4, etc.
          meta: {
            tasksChecked: tasks.filter(x => x.done).length,
            totalTasks: tasks.length
          }
        });
      } catch {}
    }
  }, [t.done]);

  function toggleTask(id: string) {
    const next = tasks.map(x => x.id === id ? { ...x, done: !x.done } : x);
    setTasks(next); next.forEach(upsertTask);
  }
  function addTask() {
    const s = newTask.trim(); if (!s) return;
    const tsk = { id: crypto.randomUUID?.() || String(Date.now()), label: s, done: false };
    upsertTask(tsk);
    setTasks(loadTasks());
    setNewTask("");
  }
  function delTask(id: string) {
    removeTask(id);
    setTasks(loadTasks());
  }

  return (
    <main aria-label="Boss Grit">
      <PageHeader title="Boss Grit" subtitle="Micro-sessions + 3 actions pour passer à l’acte" />
      <Card>
        <section style={{ display:"grid", gap: 12 }}>
          <div style={{ display:"flex", flexWrap:"wrap", gap: 8 }}>
            {PRESETS.map(p => (
              <Button key={p.ms} onClick={() => { setSelMs(p.ms); if (t.running) t.reset(); }}>
                {p.label}
              </Button>
            ))}
          </div>

          <div style={{ display:"flex", alignItems:"center", gap: 12 }}>
            <strong>{fmtTime(t.elapsed)} / {fmtTime(t.totalMs)}</strong>
            <ProgressBar value={t.progress * 100} max={100} />
          </div>

          <div style={{ display:"flex", gap:8 }}>
            {!t.running && !t.done && <Button onClick={t.start} data-ui="primary-cta">Démarrer</Button>}
            {t.running && <Button onClick={t.pause}>Pause</Button>}
            <Button onClick={() => { t.reset(); }}>Reset</Button>
          </div>
        </section>
      </Card>

      <Card style={{ marginTop: 12 }}>
        <h2>Checklist (max 3)</h2>
        <div style={{ display:"flex", gap: 8, marginBottom: 8 }}>
          <input
            type="text"
            placeholder="Ex: ouvrir le dossier, écrire 3 lignes, envoyer 1 mail"
            value={newTask}
            onChange={(e)=>setNewTask(e.target.value)}
            maxLength={80}
          />
          <Button onClick={addTask}>Ajouter</Button>
        </div>
        <ul style={{ listStyle:"none", padding:0, display:"grid", gap:8 }}>
          {tasks.slice(0,3).map(tk => (
            <li key={tk.id} style={{ display:"flex", justifyContent:"space-between", gap:8, border:"1px solid var(--card)", borderRadius:12, padding:10 }}>
              <label style={{ display:"flex", gap:6, alignItems:"center" }}>
                <input type="checkbox" checked={!!tk.done} onChange={()=>toggleTask(tk.id)} />
                <span style={{ textDecoration: tk.done ? "line-through" : "none" }}>{tk.label}</span>
              </label>
              <Button onClick={()=>delTask(tk.id)}>Supprimer</Button>
            </li>
          ))}
          {!tasks.length && <em>Ajoute 1 à 3 actions simples pour cadrer ta session.</em>}
        </ul>
      </Card>
    </main>
  );
}

function fmtTime(ms: number) {
  const s = Math.round(ms/1000);
  const m = Math.floor(s/60).toString().padStart(2,"0");
  const ss = (s%60).toString().padStart(2,"0");
  return `${m}:${ss}`;
}
