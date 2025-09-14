"use client";
import React from "react";
import { PageHeader, Card, Button, ProgressBar, Sparkline } from "@/COMPONENTS.reg"; // ProgressBar/Sparkline ajoutés en P6
import { recordEvent } from "@/lib/scores/events"; // si P6 non intégré, cet import peut être ignoré (no-op)
import { z } from "zod";

const POS = [
  { id: "active", label: "Actif(ve)" },
  { id: "determined", label: "Déterminé(e)" },
  { id: "attentive", label: "Attentif(ve)" },
  { id: "inspired", label: "Inspiré(e)" },
  { id: "alert", label: "Alerte" }
] as const;

const NEG = [
  { id: "upset", label: "Contrarié(e)" },
  { id: "hostile", label: "Hostile" },
  { id: "ashamed", label: "Honteux(se)" },
  { id: "nervous", label: "Nerveux(se)" },
  { id: "afraid", label: "Effrayé(e)" }
] as const;

type Likert = 1|2|3|4|5;
type Resp = Record<(typeof POS[number] | typeof NEG[number])["id"], Likert | undefined>;

const HISTORY_KEY = "emotion_scan_history_v1";

function loadHistory(): number[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
}
function saveHistory(vals: number[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(vals.slice(-12)));
}

export default function EmotionScanPage() {
  const [resp, setResp] = React.useState<Resp>({} as any);
  const [submitted, setSubmitted] = React.useState(false);
  const [history, setHistory] = React.useState<number[]>([]);

  React.useEffect(() => { setHistory(loadHistory()); }, []);

  const pa = POS.reduce((s, q) => s + ((resp[q.id] ?? 0) as number), 0); // 0..25
  const na = NEG.reduce((s, q) => s + ((resp[q.id] ?? 0) as number), 0); // 0..25
  const balance = pa - na; // -25..25
  const completion = [...POS, ...NEG].filter(q => !!resp[q.id]).length / 10; // 0..1

  function labelForBalance(b: number) {
    if (b >= 8) return "Équilibre positif";
    if (b >= 3) return "Plutôt positif";
    if (b > -3) return "Neutre";
    if (b > -8) return "Tendu";
    return "Négatif";
    }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    // Historique (balance normalisée 0..100)
    const toStore = Math.round((balance + 25) * 2); // -25..25 → 0..100
    const next = [...history, toStore].slice(-12);
    setHistory(next);
    saveHistory(next);

    // Event pour Scores V2 (si dispo)
    try {
      recordEvent?.({
        module: "emotion-scan",
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
        durationSec: 60,
        score: Math.max(0, toStore), // proxy
        meta: { pa, na, balance }
      });
    } catch {}

    // focus résultat
    setTimeout(() => document.getElementById("scan-result")?.scrollIntoView({ behavior: "smooth", block: "start" }), 10);
  }

  return (
    <main aria-label="Emotion Scan">
      <PageHeader title="Emotion Scan" subtitle="Auto-évaluation rapide (I-PANAS-SF)" />
      <Card>
        <form onSubmit={onSubmit}>
          <fieldset>
            <legend>Émotions positives</legend>
            {POS.map(q => (
              <LikertRow key={q.id} id={q.id} label={q.label} value={resp[q.id]} onChange={(v)=>setResp(r => ({...r, [q.id]: v}))} />
            ))}
          </fieldset>

          <fieldset style={{ marginTop: 12 }}>
            <legend>Émotions négatives</legend>
            {NEG.map(q => (
              <LikertRow key={q.id} id={q.id} label={q.label} value={resp[q.id]} onChange={(v)=>setResp(r => ({...r, [q.id]: v}))} />
            ))}
          </fieldset>

          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            <ProgressBar value={completion * 100} max={100} />
            <Button type="submit" data-ui="primary-cta" aria-disabled={completion < 1}>Calculer</Button>
          </div>
        </form>
      </Card>

      {submitted && (
        <Card id="scan-result" style={{ marginTop: 12 }}>
          <h2>Résultat</h2>
          <p><strong>PA</strong> (positif) : {pa} / 25</p>
          <p><strong>NA</strong> (négatif) : {na} / 25</p>
          <p><strong>Balance</strong> (PA - NA) : {balance} — <em>{labelForBalance(balance)}</em></p>
          <div style={{ marginTop: 8 }}>
            <Sparkline values={history} />
          </div>
        </Card>
      )}
    </main>
  );
}

function LikertRow({ id, label, value, onChange }: { id: string; label: string; value?: Likert; onChange: (v: Likert)=>void }) {
  const opts: Likert[] = [1,2,3,4,5];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto auto auto", alignItems: "center", gap: 6, paddingBlock: 4 }}>
      <label htmlFor={`${id}-3`} style={{ whiteSpace: "nowrap" }}>{label}</label>
      {opts.map(v => (
        <label key={v} style={{ display: "grid", placeItems: "center" }} aria-label={`${label} ${v}`}>
          <input
            type="radio"
            name={id}
            id={`${id}-${v}`}
            checked={value === v}
            onChange={() => onChange(v)}
          />
          <small>{v}</small>
        </label>
      ))}
    </div>
  );
}
