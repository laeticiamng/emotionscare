
export const durationToNumber = (duration: number | string): number => {
  if (typeof duration === 'number') return duration;
  return parseInt(duration) || 0;
};

export const formatDuration = (duration: number | string): string => {
  const minutes = durationToNumber(duration);
  return `${minutes} min`;
};
