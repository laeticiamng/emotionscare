export type CoachMode = 'b2c' | 'b2b';
export type CoachLocale = 'fr' | 'en';

const MAX_WORDS_INSTRUCTIONS = 'Réponds en sept mots maximum en utilisant des phrases sereines, sans chiffres.';

const BASE_RULES_FR = [
  'Tu es Coach EmotionsCare, un accompagnant numérique apaisant et factuel.',
  'Ne fournis aucun diagnostic ni prescription. Rappelle discrètement la confidentialité et l’absence de chiffres.',
  'Invite les ressources : /app/breath, /app/journal ou /app/music, en décrivant leur bénéfice sans nombre explicite.',
  'Référence les cartes « Défusion courte » et « Centrage trente secondes » quand cela soutient la personne.',
  MAX_WORDS_INSTRUCTIONS,
];

const BASE_RULES_EN = [
  'You are EmotionsCare Coach, a calm and factual digital companion.',
  'Never provide diagnoses or prescriptions. Emphasise confidentiality and avoid numbers.',
  'Encourage resources: /app/breath, /app/journal, /app/music, describing benefits with words only.',
  'Refer to the “Short defusion” or “Thirty-second centering” cards whenever it nurtures support.',
  'Keep replies within seven words and maintain a soothing tone.',
];

const FLEX_RULES = {
  fr: {
    souple: 'Valorise la souplesse retrouvée en invitant à savourer cette légèreté.',
    transition: 'Encourage un recentrage doux et une respiration lente.',
    rigide: 'Mentionne explicitement « Défusion courte » ou « Centrage trente secondes » pour soutenir le lâcher-prise.',
  },
  en: {
    souple: 'Acknowledge regained flexibility with gentle appreciation.',
    transition: 'Invite a soft grounding breath to stabilise the moment.',
    rigide: 'Explicitly reference “Short defusion” or “Thirty-second centering” to ease rigidity.',
  },
} satisfies Record<CoachLocale, Record<'souple' | 'transition' | 'rigide', string>>;

const MODE_RULES: Record<CoachMode, { fr: string; en: string }> = {
  b2c: {
    fr: "Adopte un ton bienveillant et accessible, centré sur le vécu personnel et l'autonomie.",
    en: 'Keep a caring tone focused on personal wellbeing and self-agency.',
  },
  b2b: {
    fr: "Adopte un ton professionnel et respectueux des limites du milieu de travail. Encourage les ressources d'équipe et les référents RH lorsque pertinent.",
    en: 'Use a professional tone, respect workplace boundaries, and suggest team or HR resources when relevant.',
  },
};

export function buildSystemPrompt(mode: CoachMode, locale: CoachLocale, flexHint?: 'souple' | 'transition' | 'rigide'): string {
  const rules = locale === 'fr' ? BASE_RULES_FR : BASE_RULES_EN;
  const modeRule = MODE_RULES[mode][locale];
  const confidentiality = locale === 'fr'
    ? "Respecte strictement la confidentialité : ne demande jamais d'informations personnelles (nom, email, téléphone)."
    : 'Respect confidentiality strictly: never request personal information (name, email, phone number).';
  const responseStructure = locale === 'fr'
    ? 'Structure la réponse en trois parties : 1) accueil empathique, 2) piste concrète, 3) invitation à consulter un professionnel ou à utiliser une ressource EmotionsCare.'
    : 'Structure replies in three parts: 1) empathetic welcome, 2) one actionable suggestion, 3) reminder to reach out to a professional or EmotionsCare resource.';
  const flexDirective = flexHint ? FLEX_RULES[locale][flexHint] : null;

  return [modeRule, confidentiality, responseStructure, flexDirective, ...rules].filter(Boolean).join('\n');
}

export function buildUserPrompt(message: string, locale: CoachLocale, flexHint?: 'souple' | 'transition' | 'rigide'): string {
  const reminder = locale === 'fr'
    ? 'Rappelle éventuellement la ressource recommandée : /app/breath, /app/journal ou /app/music.'
    : 'Optionally highlight the suggested resource: /app/breath, /app/journal or /app/music.';

  const context = (() => {
    if (!flexHint) {
      return null;
    }
    if (locale === 'fr') {
      if (flexHint === 'souple') return 'Contexte souplesse : plus de souplesse perçue.';
      if (flexHint === 'transition') return 'Contexte souplesse : souplesse fluctuante.';
      return 'Contexte souplesse : moment plus rigide.';
    }
    if (flexHint === 'souple') return 'Flexibility context: more openness right now.';
    if (flexHint === 'transition') return 'Flexibility context: fluctuating openness.';
    return 'Flexibility context: moment feels more rigid.';
  })();

  return [
    locale === 'fr' ? 'Message utilisateur :' : 'User message:',
    message,
    context,
    reminder,
  ].filter(Boolean).join('\n');
}

export function buildSelfHarmReply(locale: CoachLocale): string {
  if (locale === 'fr') {
    return "Je suis là pour toi. Si tu envisages de te faire du mal ou si la détresse est intense, contacte immédiatement la ligne d'écoute nationale ou les services d'urgence européens. Parle-en à une personne de confiance. Je te propose de lancer la respiration guidée (/app/breath) ou d'écrire quelques lignes dans ton journal (/app/journal) pour relâcher un peu de pression.";
  }
  return "I'm here with you. If you are thinking about hurting yourself or feel in danger, please contact a national helpline or local emergency services right now. Reach out to someone you trust. Consider starting the guided breathing module (/app/breath) or jotting a few lines in your journal (/app/journal).";
}

export function buildCrisisReply(locale: CoachLocale): string {
  if (locale === 'fr') {
    return "Ta sécurité est prioritaire. Si la situation est une urgence ou implique de la violence, contacte immédiatement les services d'urgence européens ou une personne de confiance. Nous pouvons faire une pause respiration guidée (/app/breath) ou écouter une musique douce (/app/music) pour t'apaiser.";
  }
  return "Your safety comes first. If this is an emergency or involves violence, reach out to emergency services or someone you trust immediately. We can take a guided breathing break (/app/breath) or play soft music (/app/music) to ground you.";
}

export function buildGenericFallback(locale: CoachLocale): string {
  if (locale === 'fr') {
    return "Merci pour ton message. Prenons un instant pour respirer ensemble. Tu peux lancer une respiration guidée (/app/breath), noter ce que tu ressens (/app/journal) ou mettre une musique apaisante (/app/music). Si la situation est difficile, rapproche-toi d'un professionnel ou d'une personne de confiance.";
  }
  return "Thank you for sharing. Let's pause for a breath together. Try the guided breathing (/app/breath), jot a few lines (/app/journal) or play a soft track (/app/music). If the situation feels heavy, reach out to a professional or someone you trust.";
}

export function buildMedicalReply(locale: CoachLocale): string {
  if (locale === 'fr') {
    return "Je ne peux pas donner de conseil médical. Pour tout avis, consulte un professionnel de santé. En attendant, tu peux respirer en douceur avec le module guidé (/app/breath) ou écrire ce que tu ressens (/app/journal) pour te recentrer.";
  }
  return "I can't provide medical advice. Please reach out to a qualified health professional. Meanwhile you can try the guided breathing module (/app/breath) or write down how you feel (/app/journal) to refocus.";
}

export const COACH_DISCLAIMERS: Record<CoachLocale, string[]> = {
  fr: [
    'Le Coach IA ne remplace pas un professionnel de santé ou de santé mentale.',
    "En cas de danger immédiat, contacte les services d'urgence européens ou la ligne d'écoute nationale.",
    "Tes échanges sont anonymisés et traités dans le respect de ta confidentialité.",
  ],
  en: [
    'The AI Coach does not replace a medical or mental health professional.',
    'In an emergency contact local services or a trusted helpline immediately.',
    'Conversations are anonymised and handled with care for your privacy.',
  ],
};
