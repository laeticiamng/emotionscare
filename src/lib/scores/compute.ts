// @ts-nocheck
import { SessionEvent, ScoreSnapshot } from "@/SCHEMA";

function toDate(d?: string) {
  return d ? new Date(d) : new Date();
}
function fmtDay(d: Date) {
  return d.toISOString().slice(0,10); // YYYY-MM-DD
}

export function bucketByDay(events: SessionEvent[]) {
  const map = new Map<string, number>();
  for (const e of events) {
    const day = fmtDay(toDate(e.startedAt));
    const val = typeof e.score === "number" ? e.score : (e.durationSec ?? 0)/60;
    map.set(day, (map.get(day) ?? 0) + (isFinite(val) ? val : 0));
  }
  return [...map.entries()].sort(([a],[b])=> a.localeCompare(b)).map(([date, value]) => ({ date, value }));
}

export function computeStreakDays(events: SessionEvent[]): number {
  if (!events.length) return 0;
  const setDays = new Set(bucketByDay(events).map(x => x.date));
  let streak = 0;
  let d = new Date();
  for (;;) {
    const key = fmtDay(d);
    if (setDays.has(key)) { streak++; d.setDate(d.getDate()-1); }
    else break;
  }
  return streak;
}

export function computeLevel(total: number) {
  // palier simple: niveau = floor(sqrt(total/10)) + 1, total exprimé en "points"
  return Math.floor(Math.sqrt((total || 0)/10)) + 1;
}

export function computeBadges(streakDays: number, total: number) {
  const badges: string[] = [];
  if (total >= 1) badges.push("first-session");
  if (streakDays >= 3) badges.push("streak-3");
  if (streakDays >= 7) badges.push("streak-7");
  if (total >= 100) badges.push("centurion");
  return badges;
}

export function computeSnapshot(events: SessionEvent[]): ScoreSnapshot {
  const byDay = bucketByDay(events);
  const total = byDay.reduce((s,x)=> s + (x.value||0), 0);
  const streakDays = computeStreakDays(events);
  const level = computeLevel(total);
  const badges = computeBadges(streakDays, total);
  return { total, streakDays, level, badges, byDay };
}
