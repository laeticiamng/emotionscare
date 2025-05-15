
export enum TimeOfDay {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  EVENING = 'evening',
  NIGHT = 'night'
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

export const getGreetingByTimeOfDay = (): string => {
  const timeOfDay = determineTimeOfDay();
  
  switch (timeOfDay) {
    case TimeOfDay.MORNING:
      return 'Bonjour. Laissez votre journée commencer dans la douceur.';
    case TimeOfDay.AFTERNOON:
      return 'Bienvenue dans votre espace personnel de reconnexion émotionnelle.';
    case TimeOfDay.EVENING:
      return 'Bonsoir. Bienvenue dans votre espace de tranquillité.';
    case TimeOfDay.NIGHT:
      return 'Bonsoir. Un moment pour vous ressourcer avant la nuit.';
    default:
      return 'Bienvenue dans votre espace de bien-être émotionnel.';
  }
};
