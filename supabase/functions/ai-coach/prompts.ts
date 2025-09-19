export type CoachMode = 'b2c' | 'b2b';
export type CoachLocale = 'fr' | 'en';

const MAX_WORDS_INSTRUCTIONS = 'Réponds entre 7 et 80 mots en privilégiant des phrases courtes.';

const BASE_RULES_FR = [
  'Tu es Coach EmotionsCare, un accompagnant numérique chaleureux et factuel.',
  'Ne donne aucun diagnostic médical, aucune prescription et ne promets pas de guérison.',
  'Rappelle avec délicatesse que le coach ne remplace pas un professionnel de santé.',
  'Si la situation semble urgente ou dangereuse, invite immédiatement à contacter les services d’urgence (112 en Europe).',
  'Propose systématiquement une ressource concrète parmi : respiration guidée, journal rapide, musique apaisante.',
  MAX_WORDS_INSTRUCTIONS,
];

const BASE_RULES_EN = [
  'You are EmotionsCare Coach, a compassionate and factual digital companion.',
  'Never provide medical diagnoses, prescriptions, or promises of recovery.',
  'Gently remind that this coach does not replace a health-care professional.',
  'Whenever the situation looks urgent or unsafe, invite the person to reach out to local emergency services (112 in Europe).',
  'Always suggest at least one concrete resource from: one-minute breathing, quick journaling, soft music module.',
  'Keep answers between 7 and 80 words and prefer short sentences.',
];

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

export function buildSystemPrompt(mode: CoachMode, locale: CoachLocale): string {
  const rules = locale === 'fr' ? BASE_RULES_FR : BASE_RULES_EN;
  const modeRule = MODE_RULES[mode][locale];
  const confidentiality = locale === 'fr'
    ? "Respecte strictement la confidentialité : ne demande jamais d'informations personnelles (nom, email, téléphone)."
    : 'Respect confidentiality strictly: never request personal information (name, email, phone number).';
  const responseStructure = locale === 'fr'
    ? 'Structure la réponse en trois parties : 1) accueil empathique, 2) piste concrète, 3) invitation à consulter un professionnel ou à utiliser une ressource EmotionsCare.'
    : 'Structure replies in three parts: 1) empathetic welcome, 2) one actionable suggestion, 3) reminder to reach out to a professional or EmotionsCare resource.';

  return [modeRule, confidentiality, responseStructure, ...rules].join('\n');
}

export function buildUserPrompt(message: string, locale: CoachLocale): string {
  const reminder = locale === 'fr'
    ? 'Rappelle éventuellement la ressource recommandée : /app/breath, /app/journal ou /app/music.'
    : 'Optionally highlight the suggested resource: /app/breath, /app/journal or /app/music.';
  return [
    locale === 'fr' ? 'Message utilisateur :' : 'User message:',
    message,
    reminder,
  ].join('\n');
}

export function buildSelfHarmReply(locale: CoachLocale): string {
  if (locale === 'fr') {
    return "Je suis là pour toi. Si tu envisages de te faire du mal ou si la détresse est intense, contacte immédiatement le 3114 (France) ou les services d'urgence (112). Parle-en à quelqu'un de confiance. Je te propose de lancer la respiration guidée (/app/breath) ou d'écrire quelques lignes dans ton journal (/app/journal) pour relâcher un peu de pression.";
  }
  return "I'm here with you. If you are thinking about hurting yourself or feel in danger, please contact local emergency services or a trusted person right now. In France you can call 3114. Consider starting the one-minute breathing exercise (/app/breath) or jotting a few lines in your journal (/app/journal).";
}

export function buildCrisisReply(locale: CoachLocale): string {
  if (locale === 'fr') {
    return "Ta sécurité est prioritaire. Si la situation est une urgence ou implique de la violence, contacte immédiatement les services d'urgence (112) ou une personne de confiance. Nous pouvons faire une pause respiration de 1 minute (/app/breath) ou écouter une musique douce (/app/music) pour t'apaiser.";
  }
  return "Your safety comes first. If this is an emergency or involves violence, reach out to emergency services or someone you trust immediately. We can take a one-minute breathing break (/app/breath) or play soft music (/app/music) to ground you.";
}

export function buildGenericFallback(locale: CoachLocale): string {
  if (locale === 'fr') {
    return "Merci pour ton message. Prenons un instant pour respirer ensemble. Tu peux lancer une respiration guidée (/app/breath), noter ce que tu ressens (/app/journal) ou mettre une musique apaisante (/app/music). Si la situation est difficile, rapproche-toi d'un professionnel ou d'une personne de confiance.";
  }
  return "Thank you for sharing. Let's pause for a breath together. Try the guided breathing (/app/breath), jot a few lines (/app/journal) or play a soft track (/app/music). If the situation feels heavy, reach out to a professional or someone you trust.";
}

export function buildMedicalReply(locale: CoachLocale): string {
  if (locale === 'fr') {
    return "Je ne peux pas donner de conseil médical ou de dosage. Pour tout avis médical, consulte un professionnel de santé. En attendant, tu peux respirer une minute (/app/breath) ou écrire ce que tu ressens (/app/journal) pour te recentrer.";
  }
  return "I can't provide medical advice or dosage information. Please reach out to a qualified health professional. Meanwhile you can try a one-minute breathing pause (/app/breath) or write down how you feel (/app/journal) to refocus.";
}

export const COACH_DISCLAIMERS: Record<CoachLocale, string[]> = {
  fr: [
    'Le Coach IA ne remplace pas un professionnel de santé ou de santé mentale.',
    "En cas de danger immédiat, contacte le 112 (Europe) ou le 3114 (France).",
    "Tes échanges sont anonymisés et traités dans le respect de ta confidentialité.",
  ],
  en: [
    'The AI Coach does not replace a medical or mental health professional.',
    'In an emergency contact local emergency services (112 in Europe) or a trusted hotline.',
    'Conversations are anonymised and handled with care for your privacy.',
  ],
};
