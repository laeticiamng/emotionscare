// @ts-nocheck
import { submitAssess } from '@/lib/assess/client';

let ON = true;

export function setImplicitOn(on: boolean) {
  ON = on;
}

export interface ImplicitSignal {
  instrument: string;
  item_id: string;
  proxy: 'choice' | 'duration' | 'skip' | 'repeat' | 'preset' | 'reaction' | 'completion' | 'cadence_followed' | 'like';
  value: string | number;
  weight?: number;
  context?: Record<string, string>;
  ts?: number;
}

const Q: ImplicitSignal[] = [];
let t: any = null;

function serializeImplicit(s: ImplicitSignal): number {
  if (s.proxy === 'duration') {
    const n = Number(s.value) || 0;
    if (n >= 300000) return 5; // >5min = strongly_agree
    if (n >= 90000) return 4;   // 1.5–5min = agree
    if (n >= 30000) return 3;   // 30–90s = neutral
    return 2;                    // <30s = disagree
  }

  if (s.proxy === 'skip') return 2; // disagree
  if (s.proxy === 'repeat') return 4; // agree

  if (s.proxy === 'choice') {
    const v = String(s.value);
    if (['calm', 'soft', 'slow', 'private', '2d', 'low'].includes(v)) {
      return 4; // agree
    }
    if (['energize', 'fast', 'public', '3d', 'high'].includes(v)) {
      return 3; // neutral
    }
    return 3; // neutral default
  }

  if (s.proxy === 'cadence_followed') {
    const p = Number(s.value) || 0; // 0..1
    if (p >= 0.7) return 4; // agree
    if (p >= 0.4) return 3; // neutral
    return 2; // disagree
  }

  if (s.proxy === 'completion') {
    const r = Number(s.value) || 0; // 0..1
    if (r >= 0.8) return 4; // agree
    if (r >= 0.5) return 3; // neutral
    return 2; // disagree
  }

  return 3; // neutral default
}

export function trackImplicitAssess(s: ImplicitSignal) {
  if (!ON) return;
  Q.push({ ...s, ts: Date.now() });
  if (!t) t = setTimeout(flushImplicitAssess, 12000);
}

export async function flushImplicitAssess() {
  clearTimeout(t);
  t = null;
  if (!Q.length) return;
  
  const batch = Q.splice(0);
  const payload = {
    session_id: `implicit:${new Date().toISOString().slice(0, 10)}`,
    answers: batch.map(s => ({
      id: `${s.instrument}.${s.item_id}`,
      value: serializeImplicit(s)
    })),
    meta: {
      implicit: true,
      signals: batch.map(s => ({
        proxy: s.proxy,
        ctx: s.context,
        w: s.weight ?? 0.5,
        ts: s.ts
      }))
    }
  };
  
  try {
    await submitAssess(payload as any);
  } catch (e) {
    // silencieux
  }
}

// Flush on beforeunload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (Q.length > 0 && navigator.sendBeacon) {
      const batch = Q.splice(0);
      const payload = JSON.stringify({
        session_id: `implicit:${new Date().toISOString().slice(0, 10)}`,
        answers: batch.map(s => ({
          id: `${s.instrument}.${s.item_id}`,
          value: serializeImplicit(s)
        })),
        meta: { implicit: true }
      });
      
      navigator.sendBeacon(
        'https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/assess-submit',
        new Blob([payload], { type: 'application/json' })
      );
    }
  });
}
