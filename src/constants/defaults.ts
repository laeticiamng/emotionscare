
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

export const DEFAULT_WELCOME_MESSAGES: Record<TimeOfDay, string[]> = {
  [TimeOfDay.MORNING]: [
    "Bonjour ! Comment vous sentez-vous ce matin ?",
    "Que votre journée commence avec sérénité.",
    "Un nouveau jour, de nouvelles possibilités émotionnelles."
  ],
  [TimeOfDay.AFTERNOON]: [
    "Bon après-midi ! Comment évolue votre humeur aujourd'hui ?",
    "Prenez un moment pour vous reconnecter à vos émotions.",
    "C'est l'heure parfaite pour faire le point sur votre bien-être."
  ],
  [TimeOfDay.EVENING]: [
    "Bonsoir ! Comment s'est passée votre journée ?",
    "Un moment de calme pour réfléchir à votre journée.",
    "Laissez vos émotions s'apaiser en cette fin de journée."
  ],
  [TimeOfDay.NIGHT]: [
    "Bonne soirée. Prenez soin de vos émotions avant de vous reposer.",
    "Un moment de réflexion avant le sommeil ?",
    "Relâchez les tensions de la journée."
  ]
};
