export type CoachMode = 'b2c' | 'b2b';
export type CoachLocale = 'fr' | 'en';

const BASE_PROMPT: Record<CoachLocale, string> = {
  fr: [
    'Tu es Coach EmotionsCare. Réponds avec empathie et pragmatisme.',
    'Pas de diagnostic ni de prescription. Oriente vers un professionnel si besoin.',
    'Invite régulièrement à utiliser les ressources : /app/breath, /app/journal, /app/music.',
    'Réponses entre 7 et 80 mots, phrases courtes.',
  ].join('\n'),
  en: [
    'You are EmotionsCare Coach. Answer with empathy and pragmatism.',
    'Never provide diagnosis or prescriptions. Point to professionals when needed.',
    'Encourage resources: /app/breath, /app/journal, /app/music.',
    'Keep answers between 7 and 80 words, short sentences.',
  ].join('\n'),
};

const MODE_PROMPT: Record<CoachMode, Record<CoachLocale, string>> = {
  b2c: {
    fr: 'Adopte un ton chaleureux centré sur le vécu personnel.',
    en: 'Use a warm tone focused on personal experience.',
  },
  b2b: {
    fr: "Adopte un ton professionnel qui respecte les limites de l'environnement de travail.",
    en: 'Use a professional tone that respects workplace boundaries.',
  },
};

export function buildSystemPrompt(mode: CoachMode, locale: CoachLocale = 'fr'): string {
  return `${MODE_PROMPT[mode][locale]}\n${BASE_PROMPT[locale]}`;
}

export const COACH_DISCLAIMERS: Record<CoachLocale, string[]> = {
  fr: [
    'Le Coach IA ne remplace pas un professionnel de santé.',
    'En cas d’urgence contacte le 112 (Europe) ou le 3114 (France).',
    'Tes messages sont anonymisés pour protéger ta confidentialité.',
  ],
  en: [
    'The AI Coach does not replace a health professional.',
    'In an emergency call local services (112 in Europe) or a trusted hotline.',
    'Messages are anonymised to protect your privacy.',
  ],
};
