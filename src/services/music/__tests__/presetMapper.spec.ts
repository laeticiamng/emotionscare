import { describe, expect, test } from "vitest";

import { mapStateToPreset } from "../presetMapper";

describe("mapStateToPreset", () => {
  test("prefers very calm preset when arousal is very low", () => {
    const recommendation = mapStateToPreset({ valence: -10, arousal: 10 });
    expect(recommendation.presetId).toBe("calm_very_low");
    expect(recommendation.intensity).toBe("feather");
  });

  test("brightens when valence and arousal are high", () => {
    const recommendation = mapStateToPreset({ valence: 80, arousal: 85 });
    expect(recommendation.presetId).toBe("bright_mist");
    expect(recommendation.intensity).toBe("glow");
  });

  test("softens and shortens intensity when fatigue rises", () => {
    const recommendation = mapStateToPreset(
      { valence: 20, arousal: 55 },
      { fatigueTrend: "up", tensionTrend: "steady", note: "besoin de repos" },
    );

    expect(recommendation.presetId).toBe("calm_very_low");
    expect(recommendation.adjustments.softenedForFatigue).toBe(true);
    expect(recommendation.narrative).toMatch(/nuage très doux/);
  });

  test("extends crossfade and exposes CTA when tension decreases", () => {
    const recommendation = mapStateToPreset(
      { valence: 30, arousal: 40 },
      { tensionTrend: "down", fatigueTrend: "steady" },
    );

    expect(recommendation.cta).toBe("encore_2_min");
    expect(recommendation.adjustments.extendedForTensionRelease).toBe(true);
    expect(recommendation.crossfadeMs).toBeGreaterThan(2800);
  });
});
