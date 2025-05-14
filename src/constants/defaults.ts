
export const TIME_OF_DAY = {
  MORNING: "MORNING",
  AFTERNOON: "AFTERNOON",
  EVENING: "EVENING",
  NIGHT: "NIGHT"
} as const;

export type TimeOfDay = typeof TIME_OF_DAY[keyof typeof TIME_OF_DAY];
