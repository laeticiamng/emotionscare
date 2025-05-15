
export enum TimeOfDay {
  MORNING = "morning",
  AFTERNOON = "afternoon",
  EVENING = "evening",
  NIGHT = "night",
}

export const determineTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return TimeOfDay.MORNING;
  } else if (hour >= 12 && hour < 17) {
    return TimeOfDay.AFTERNOON;
  } else if (hour >= 17 && hour < 22) {
    return TimeOfDay.EVENING;
  } else {
    return TimeOfDay.NIGHT;
  }
};

export const DEFAULT_WELCOME_MESSAGES = {
  MORNING: "Bonjour et bienvenue dans votre espace de bien-être émotionnel.",
  AFTERNOON: "Bon après-midi. Prenez un moment pour vous reconnecter à vos émotions.",
  EVENING: "Bonsoir. C'est l'heure idéale pour faire le point sur votre journée émotionnelle.",
  NIGHT: "Bonsoir. Un moment calme pour explorer vos ressentis avant le repos.",
  GENERIC: "Bienvenue dans votre espace personnel EmotionsCare."
};
