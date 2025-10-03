import { getEvents } from "./events";
import { hasConsent } from "@/ui/CookieConsent"; // si dispo en P2
import { safeFetch } from "@/lib/net/safeFetch";  // P0
import { ff } from "@/lib/flags/ff";

export async function trySyncScores() {
  const canSend = (ff?.("telemetry-opt-in") ?? false) && (hasConsent?.("analytics") ?? false);
  if (!canSend) return { sent: 0 };
  const events = getEvents();
  if (!events.length) return { sent: 0 };
  try {
    const res = await safeFetch("/api/scores/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events }),
      timeoutMs: 10000,
      retries: 1
    });
    if (res.ok) return { sent: events.length };
  } catch {}
  return { sent: 0 };
}
