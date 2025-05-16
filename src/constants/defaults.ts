
export enum TimeOfDay {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
  NIGHT = 'NIGHT'
}

export const determineTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return TimeOfDay.MORNING;
  } else if (hour >= 12 && hour < 18) {
    return TimeOfDay.AFTERNOON;
  } else if (hour >= 18 && hour < 22) {
    return TimeOfDay.EVENING;
  } else {
    return TimeOfDay.NIGHT;
  }
};
