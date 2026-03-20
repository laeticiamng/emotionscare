import { describe, expect, it } from "vitest";

import { mapStateToPreset, type PomsTrendSummary } from "./presetMapper";

const buildSummary = (overrides: Partial<PomsTrendSummary>): PomsTrendSummary => ({
  tensionTrend: "steady",
  fatigueTrend: "steady",
  note: null,
  completed: true,
  ...overrides,
});

describe("mapStateToPreset", () => {
  it("choisit un preset très calme lorsque l'arousal est bas", () => {
    const recommendation = mapStateToPreset({ arousal: 10, valence: 5 });

    expect(recommendation.presetId).toBe("calm_very_low");
    expect(recommendation.intensity).toBe("feather");
    expect(recommendation.adjustments.source).toBe("sam");
  });

  it("maintient un preset lumineux lorsque valence et arousal sont élevés", () => {
    const recommendation = mapStateToPreset({ arousal: 82, valence: 70 });

    expect(recommendation.presetId).toBe("bright_mist");
    expect(recommendation.intensity).toBe("glow");
    expect(recommendation.cta).toBeNull();
  });

  it("adouci la texture lorsque la fatigue augmente", () => {
    const recommendation = mapStateToPreset(
      { arousal: 55, valence: -10 },
      buildSummary({ fatigueTrend: "up" }),
    );

    expect(recommendation.presetId).toBe("calm_very_low");
    expect(recommendation.intensity).toBe("feather");
    expect(recommendation.adjustments.softenedForFatigue).toBe(true);
    expect(recommendation.adjustments.source).toBe("mixed");
  });

  it("allonge le crossfade et propose la relance douce quand la tension diminue", () => {
    const recommendation = mapStateToPreset(
      { arousal: 60, valence: 40 },
      buildSummary({ tensionTrend: "down" }),
    );

    expect(recommendation.crossfadeMs).toBeGreaterThanOrEqual(3000);
    expect(recommendation.cta).toBe("encore_2_min");
    expect(recommendation.adjustments.extendedForTensionRelease).toBe(true);
  });

  it("cumule les ajustements lorsque la fatigue monte et la tension baisse", () => {
    const recommendation = mapStateToPreset(
      { arousal: 72, valence: 20 },
      buildSummary({ tensionTrend: "down", fatigueTrend: "up" }),
    );

    expect(recommendation.presetId).toBe("calm_very_low");
    expect(recommendation.cta).toBe("encore_2_min");
    expect(recommendation.adjustments.softenedForFatigue).toBe(true);
    expect(recommendation.adjustments.extendedForTensionRelease).toBe(true);
  });
});

