// @ts-nocheck
// Helpers de rollout/cohortes + overrides dev (append-only)
const UID_KEY = "ec_uid_v1";
const OV_KEY = "ec_flag_overrides_v1";

function uid(): string {
  try {
    const cur = localStorage.getItem(UID_KEY);
    if (cur) return cur;
    const u = (crypto.randomUUID?.() || Math.random().toString(36).slice(2));
    localStorage.setItem(UID_KEY, u);
    return u;
  } catch {
    return "anon";
  }
}

function hashToPercent(s: string): number {
  // djb2 mod 100
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) + s.charCodeAt(i);
  return Math.abs(h) % 100; // 0..99
}

export function inCohort(pct: number): boolean {
  const u = uid();
  return hashToPercent(u) < Math.max(0, Math.min(100, Math.floor(pct)));
}

export function getOverrides(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(OV_KEY) || "{}"); } catch { return {}; }
}
export function setOverride(key: string, val: boolean) {
  const map = getOverrides(); map[key] = !!val; localStorage.setItem(OV_KEY, JSON.stringify(map));
}
export function clearOverride(key: string) {
  const map = getOverrides(); delete map[key]; localStorage.setItem(OV_KEY, JSON.stringify(map));
}

/**
 * flagActive: renvoie TRUE si:
 * - override localStorage = true, OU
 * - ff(key) = true, OU
 * - pourcentage de rollout défini ET user ∈ cohorte.
 */
export function flagActive(key: string, opts?: { percent?: number, ff?: (k: string)=>boolean }) {
  const ov = getOverrides();
  if (typeof ov[key] === "boolean") return ov[key];
  const base = opts?.ff?.(key);
  if (base) return true;
  const pct = opts?.percent ?? 0;
  return pct > 0 ? inCohort(pct) : false;
}

