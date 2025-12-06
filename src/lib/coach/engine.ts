// @ts-nocheck
import { CoachContext } from "./context";

export type Advice = {
  key: string;
  title: string;
  body: string;
  cta: { label: string; href: string };
  weight: number; // 1..100
  tag?: "respire" | "ecris" | "musique" | "scan" | "routine";
};

export type CoachMode = "soft" | "boost";

function between(h: number, a: number, b: number) {
  return h >= a && h <= b;
}

export function buildAdvice(ctx: CoachContext, mode: CoachMode = "soft"): Advice[] {
  const res: Advice[] = [];
  const isEvening = between(ctx.nowHour, 19, 23);
  const isMorning = between(ctx.nowHour, 6, 10);
  const lowStreak = (ctx.streakDays || 0) < 3;
  const negScan = ctx.lastScanBalance01 !== undefined && ctx.lastScanBalance01 < 0.45;

  // 1) Si moral un peu bas → respiration + journal
  if (negScan) {
    res.push({
      key: "breath-then-journal",
      title: "2 min pour apaiser puis poser les mots",
      body: "Fais 6 cycles de cohérence (5-5), puis écris 3 lignes sur ce que tu ressens.",
      cta: { label: "Démarrer Bubble Beat", href: "/app/bubble-beat" },
      weight: 85,
      tag: "respire"
    });
    res.push({
      key: "journal-3-lines",
      title: "Écrire 3 lignes, sans filtre",
      body: "Note ce qui te pèse et une petite chose positive de ta journée.",
      cta: { label: "Ouvrir Journal", href: "/app/journal" },
      weight: 70,
      tag: "ecris"
    });
  }

  // 2) Si streak bas → micro-séance
  if (lowStreak) {
    res.push({
      key: "micro-session",
      title: "Micro-séance pour relancer la série",
      body: "Lance une session de 3 minutes. L’important c’est d’y être.",
      cta: { label: "Respiration 3 min", href: "/app/bubble-beat" },
      weight: 65,
      tag: "routine"
    });
  }

  // 3) Matin → Mood Mixer focus / Soir → lofi doux
  if (isMorning) {
    res.push({
      key: "morning-focus",
      title: "2 min de musique pour cadrer la matinée",
      body: "Un preset ‘Focus’ léger pour te mettre en route.",
      cta: { label: "Lancer Mood Mixer", href: "/app/mood-mixer" },
      weight: 60,
      tag: "musique"
    });
  }
  if (isEvening) {
    res.push({
      key: "evening-lofi",
      title: "Débranche en douceur",
      body: "Un lofi tranquille (boucle courte) avant d’éteindre les écrans.",
      cta: { label: "Lancer Mood Mixer", href: "/app/mood-mixer" },
      weight: 55,
      tag: "musique"
    });
  }

  // 4) Pas de scan récent → proposer un Emotion Scan rapide
  if (ctx.lastScanBalance01 === undefined) {
    res.push({
      key: "do-scan",
      title: "Prends ta météo intérieure (1 min)",
      body: "Fais un mini Emotion Scan pour orienter la séance.",
      cta: { label: "Ouvrir Emotion Scan", href: "/app/scan" },
      weight: 58,
      tag: "scan"
    });
  }

  // 5) Rappel de routine légère
  res.push({
    key: "routine-3",
    title: "Routine rapide : 3 respirations profondes",
    body: "Inspire 4s, expire 6s, trois fois. C’est déjà un pas.",
    cta: { label: "Démarrer Bubble Beat", href: "/app/bubble-beat" },
    weight: 40,
    tag: "respire"
  });

  // Poids selon mode
  const mul = mode === "boost" ? 1.15 : 1.0;
  for (const a of res) a.weight = Math.round(a.weight * mul);

  // Déduper par key et trier
  const map = new Map<string, Advice>();
  res.forEach(a => { if (!map.has(a.key)) map.set(a.key, a); });
  return [...map.values()].sort((a, b) => b.weight - a.weight).slice(0, 6);
}
