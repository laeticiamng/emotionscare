// @ts-nocheck
const KEY = "cookie_consent_v1";

export function hasConsent(kind: "analytics" | "functional" | "marketing" = "functional") {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return !!parsed[kind];
  } catch { return false; }
}
