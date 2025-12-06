// @ts-nocheck
import { SessionEvent } from "@/SCHEMA";

const KEY = "ec_session_events_v2";

export function getEvents(): SessionEvent[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function recordEvent(evt: SessionEvent) {
  const list = getEvents();
  list.push({ ...evt, id: evt.id || crypto.randomUUID?.() || String(Date.now()) });
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function clearEvents() {
  localStorage.removeItem(KEY);
}
