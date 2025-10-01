// @ts-nocheck
export type MoodSnapshot = {
  valence?: number | null
  arousal?: number | null
}

const clampComponent = (value: number | null | undefined) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0
  }
  if (!Number.isFinite(value)) {
    return value > 0 ? 1 : -1
  }
  return Math.max(-1, Math.min(1, value))
}

/**
 * computeMoodDelta - produit un delta directionnel borné entre -10 et 10
 * basé sur la variation de valence et la variation absolue d'arousal.
 */
export function computeMoodDelta(before?: MoodSnapshot | null, after?: MoodSnapshot | null): number | null {
  if (!before || !after) {
    return null
  }

  const beforeValence = clampComponent(before.valence ?? 0)
  const afterValence = clampComponent(after.valence ?? 0)
  const beforeArousal = clampComponent(before.arousal ?? 0)
  const afterArousal = clampComponent(after.arousal ?? 0)

  const dv = afterValence - beforeValence
  const da = afterArousal - beforeArousal
  const aggregate = dv - Math.abs(da) * 0.25
  const scaled = Math.round(aggregate * 10)
  return Math.max(-10, Math.min(10, scaled))
}

