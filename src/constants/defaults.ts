
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export function determineTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
}

export const DEFAULT_WELCOME_MESSAGES = {
  morning: [
    "Bonjour et bienvenue dans votre espace de bien-être.",
    "Une belle journée s'annonce, comment vous sentez-vous aujourd'hui ?",
    "Le matin est parfait pour prendre soin de soi. Bienvenue !",
    "Un nouveau jour, de nouvelles possibilités de bien-être.",
    "Prenez quelques instants pour vous connecter à vos émotions ce matin."
  ],
  afternoon: [
    "Bon après-midi, c'est le moment idéal pour faire une pause bien-être.",
    "Comment se déroule votre journée ? Prenez un moment pour vous.",
    "Bienvenue dans votre espace de reconnexion émotionnelle.",
    "Le milieu de journée est parfait pour se recentrer. Bienvenue !",
    "Accordez-vous une pause bien méritée dans votre cocon émotionnel."
  ],
  evening: [
    "Bonsoir, c'est le moment de vous détendre après cette journée.",
    "Bienvenue dans votre espace de détente du soir.",
    "La soirée est propice à la relaxation. Prenez soin de vous.",
    "Prenez un moment pour faire le point sur vos émotions de la journée.",
    "La journée touche à sa fin, accordez-vous un moment de bien-être."
  ],
  night: [
    "Bienvenue dans votre espace nocturne de détente.",
    "Une séance de relaxation avant le sommeil vous attend.",
    "La nuit est propice à l'introspection et au lâcher-prise.",
    "Avant de dormir, prenez le temps de vous reconnecter à vos émotions.",
    "Bienvenue dans votre cocon nocturne. Apaisez votre esprit avant le repos."
  ]
};
