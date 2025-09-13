import { describe, it, expect } from "vitest";
import { computeStreakDays, bucketByDay, computeLevel, computeSnapshot } from "@/lib/scores/compute";

describe("scores compute", () => {
  it("streak calcule au moins 0", () => {
    expect(computeStreakDays([])).toBe(0);
  });
  it("bucketByDay regroupe par date", () => {
    const b = bucketByDay([{ startedAt: "2025-01-01T10:00:00Z", durationSec: 300 }, { startedAt: "2025-01-01T11:00:00Z", durationSec: 60 }]);
    expect(b[0].date).toBe("2025-01-01");
    expect(Math.round(b[0].value || 0)).toBe(6); // 300+60 sec ~ 6 min
  });
  it("level augmente avec le total", () => {
    const l1 = computeLevel(0), l2 = computeLevel(200);
    expect(l2).toBeGreaterThanOrEqual(l1);
  });
  it("snapshot renvoie des champs clés", () => {
    const s = computeSnapshot([]);
    expect(s.total).toBeDefined();
    expect(s.byDay).toBeDefined();
  });
});
