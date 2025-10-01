// @ts-nocheck
export const sanitizeMoodScore = (value: number | null | undefined): number | null => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return null;
  }
  const clamped = Math.min(100, Math.max(0, value));
  return Math.round(clamped);
};

export const computeMoodDelta = (
  before: number | null | undefined,
  after: number | null | undefined,
): number | null => {
  const sanitizedBefore = sanitizeMoodScore(before);
  const sanitizedAfter = sanitizeMoodScore(after);

  if (sanitizedBefore === null || sanitizedAfter === null) {
    return null;
  }

  return sanitizedAfter - sanitizedBefore;
};
