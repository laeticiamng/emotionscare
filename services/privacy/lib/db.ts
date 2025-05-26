export type PrivacyPrefs = {
  user_id_hash: string;
  cam: boolean;
  mic: boolean;
  hr: boolean;
  gps: boolean;
  social: boolean;
  nft: boolean;
  updated_at: string;
};

export const DEFAULT_PREFS: Omit<PrivacyPrefs,'user_id_hash'|'updated_at'> = {
  cam: true,
  mic: true,
  hr: true,
  gps: true,
  social: true,
  nft: true
};

const prefs = new Map<string, PrivacyPrefs>();

export function getPrefs(hash: string): PrivacyPrefs | undefined {
  return prefs.get(hash);
}

export function initPrefs(hash: string): PrivacyPrefs {
  const row: PrivacyPrefs = { user_id_hash: hash, updated_at: new Date().toISOString(), ...DEFAULT_PREFS };
  prefs.set(hash, row);
  return row;
}

export function updatePrefs(hash: string, patch: Partial<PrivacyPrefs>): void {
  const current = prefs.get(hash) ?? initPrefs(hash);
  const updated: PrivacyPrefs = { ...current, ...patch, updated_at: new Date().toISOString(), user_id_hash: hash };
  prefs.set(hash, updated);
}

export const auditLog: { user_id_hash: string; action: string; details: string }[] = [];

export function logChange(hash: string, patch: Partial<PrivacyPrefs>): void {
  auditLog.push({ user_id_hash: hash, action: 'opt_change', details: JSON.stringify(patch) });
}

export function clear() {
  prefs.clear();
  auditLog.length = 0;
}
