
export const durationToNumber = (duration: string | number): number => {
  if (typeof duration === 'number') return duration;
  
  // Parse duration string like "10min" or "5" to number
  const match = duration.match(/(\d+)/);
  return match ? parseInt(match[1]) : 10;
};

export const formatDuration = (duration: string | number): string => {
  const minutes = durationToNumber(duration);
  return `${minutes} min`;
};
