// @ts-nocheck
import { getEvents } from "@/lib/scores/events";
import { computeSnapshot } from "@/lib/scores/compute";

const SCAN_HISTORY_KEY = "emotion_scan_history_v1"; // déjà utilisé par Emotion Scan

export type CoachContext = {
  nowHour: number;
  streakDays: number;
  totalPoints: number;
  lastScanBalance01?: number; // 0..1 (balance -25..25 -> 0..1)
  recentModules: string[];    // 3 derniers modules
};

export function loadEmotionScanHistory01(): number[] {
  try {
    const arr = JSON.parse(localStorage.getItem(SCAN_HISTORY_KEY) || "[]");
    if (!Array.isArray(arr)) return [];
    // arr est 0..100 -> 0..1
    return arr.map((v: number) => Math.max(0, Math.min(1, v / 100)));
  } catch { return []; }
}

export function getCoachContext(): CoachContext {
  const events = getEvents();
  const snap = computeSnapshot(events);
  const recent = [...events].reverse().slice(0, 3).map(e => String(e.module || "unknown"));
  const scan = loadEmotionScanHistory01();
  const lastScan = scan.length ? scan[scan.length - 1] : undefined;
  const h = new Date().getHours();
  return {
    nowHour: h,
    streakDays: snap.streakDays ?? 0,
    totalPoints: Math.round(snap.total ?? 0),
    lastScanBalance01: lastScan,
    recentModules: recent
  };
}
