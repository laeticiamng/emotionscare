// @ts-nocheck
import { vi } from "vitest";
export function fastForwardTimers() {
  vi.useFakeTimers();
  // vitesse ×1000  (1 s réel → 1 ms)
  vi.spyOn(global, 'setTimeout').mockImplementation(cb => setImmediate(cb));
}
