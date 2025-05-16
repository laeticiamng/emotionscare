

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

export const DEFAULT_WELCOME_MESSAGES = {
  [TimeOfDay.MORNING]: [
    "Bonjour ! Comment vous sentez-vous ce matin ?",
    "Bienvenue dans votre espace de bien-être matinal",
    "Commencez votre journée avec un moment pour vous",
    "Un nouveau jour, de nouvelles émotions à explorer"
  ],
  [TimeOfDay.AFTERNOON]: [
    "Bonjour ! Comment se passe votre journée ?",
    "Un moment de pause bien mérité cet après-midi ?",
    "Prenez un instant pour vous reconnecter à vos émotions",
    "Bienvenue dans votre espace de bien-être"
  ],
  [TimeOfDay.EVENING]: [
    "Bonsoir ! Comment s'est passée votre journée ?",
    "Un moment pour vous détendre ce soir",
    "Bienvenue dans votre espace de bien-être nocturne",
    "Le soir est parfait pour un moment d'introspection"
  ],
  [TimeOfDay.NIGHT]: [
    "Bonsoir ! Un moment de détente avant de dormir ?",
    "La nuit est propice à l'exploration de vos émotions",
    "Bienvenue dans votre espace de bien-être nocturne",
    "Préparez-vous à une nuit sereine"
  ]
};

