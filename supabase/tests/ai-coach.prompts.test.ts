import { describe, expect, it } from 'vitest';

import {
  COACH_DISCLAIMERS,
  buildSystemPrompt,
  buildUserPrompt,
  buildSelfHarmReply,
  buildCrisisReply,
  buildGenericFallback,
  buildMedicalReply,
} from '../functions/ai-coach/prompts.ts';

describe('ai-coach prompt helpers', () => {
  it('builds system prompts with consent reminders and flex hints', () => {
    expect(buildSystemPrompt('b2c', 'fr', 'rigide')).toMatchInlineSnapshot(`
"Adopte un ton bienveillant et accessible, centré sur le vécu personnel et l'autonomie.\nRespecte strictement la confidentialité : ne demande jamais d'informations personnelles (nom, email, téléphone).\nStructure la réponse en trois parties : 1) accueil empathique, 2) piste concrète, 3) invitation à consulter un professionnel ou à utiliser une ressource EmotionsCare.\nMentionne explicitement « Défusion courte » ou « Centrage trente secondes » pour soutenir le lâcher-prise.\nTu es Coach EmotionsCare, un accompagnant numérique apaisant et factuel.\nNe fournis aucun diagnostic ni prescription. Rappelle discrètement la confidentialité et l’absence de chiffres.\nInvite les ressources : /app/breath, /app/journal ou /app/music, en décrivant leur bénéfice sans nombre explicite.\nRéférence les cartes « Défusion courte » et « Centrage trente secondes » quand cela soutient la personne.\nRéponds en sept mots maximum en utilisant des phrases sereines, sans chiffres."`);

    expect(buildSystemPrompt('b2b', 'en', 'souple')).toMatchInlineSnapshot(`
"Use a professional tone, respect workplace boundaries, and suggest team or HR resources when relevant.\nRespect confidentiality strictly: never request personal information (name, email, phone number).\nStructure replies in three parts: 1) empathetic welcome, 2) one actionable suggestion, 3) reminder to reach out to a professional or EmotionsCare resource.\nAcknowledge regained flexibility with gentle appreciation.\nYou are EmotionsCare Coach, a calm and factual digital companion.\nNever provide diagnoses or prescriptions. Emphasise confidentiality and avoid numbers.\nEncourage resources: /app/breath, /app/journal, /app/music, describing benefits with words only.\nRefer to the “Short defusion” or “Thirty-second centering” cards whenever it nurtures support.\nKeep replies within seven words and maintain a soothing tone."`);
  });

  it('creates user prompts with optional flexibility context', () => {
    expect(buildUserPrompt('Je me sens stressé.', 'fr', 'rigide')).toMatchInlineSnapshot(`
"Message utilisateur :\nJe me sens stressé.\nContexte souplesse : moment plus rigide.\nRappelle éventuellement la ressource recommandée : /app/breath, /app/journal ou /app/music."`);

    expect(buildUserPrompt('Feeling tense before presentation.', 'en')).toMatchInlineSnapshot(`
"User message:\nFeeling tense before presentation.\nOptionally highlight the suggested resource: /app/breath, /app/journal or /app/music."`);
  });

  it('exposes safety replies and disclaimers without sensitive details', () => {
    expect(COACH_DISCLAIMERS.fr).toMatchInlineSnapshot(`
[
  "Le Coach IA ne remplace pas un professionnel de santé ou de santé mentale.",
  "En cas de danger immédiat, contacte les services d'urgence européens ou la ligne d'écoute nationale.",
  "Tes échanges sont anonymisés et traités dans le respect de ta confidentialité.",
]`);

    expect(COACH_DISCLAIMERS.en).toMatchInlineSnapshot(`
[
  "The AI Coach does not replace a medical or mental health professional.",
  "In an emergency contact local services or a trusted helpline immediately.",
  "Conversations are anonymised and handled with care for your privacy.",
]`);

    expect(buildSelfHarmReply('fr')).toMatchInlineSnapshot(`
"Je suis là pour toi. Si tu envisages de te faire du mal ou si la détresse est intense, contacte immédiatement la ligne d'écoute nationale ou les services d'urgence européens. Parle-en à une personne de confiance. Je te propose de lancer la respiration guidée (/app/breath) ou d'écrire quelques lignes dans ton journal (/app/journal) pour relâcher un peu de pression."`);

    expect(buildSelfHarmReply('en')).toMatchInlineSnapshot(`
"I'm here with you. If you are thinking about hurting yourself or feel in danger, please contact a national helpline or local emergency services right now. Reach out to someone you trust. Consider starting the guided breathing module (/app/breath) or jotting a few lines in your journal (/app/journal)."`);

    expect(buildCrisisReply('fr')).toMatchInlineSnapshot(`
"Ta sécurité est prioritaire. Si la situation est une urgence ou implique de la violence, contacte immédiatement les services d'urgence européens ou une personne de confiance. Nous pouvons faire une pause respiration guidée (/app/breath) ou écouter une musique douce (/app/music) pour t'apaiser."`);

    expect(buildCrisisReply('en')).toMatchInlineSnapshot(`
"Your safety comes first. If this is an emergency or involves violence, reach out to emergency services or someone you trust immediately. We can take a guided breathing break (/app/breath) or play soft music (/app/music) to ground you."`);

    expect(buildGenericFallback('fr')).toMatchInlineSnapshot(`
"Merci pour ton message. Prenons un instant pour respirer ensemble. Tu peux lancer une respiration guidée (/app/breath), noter ce que tu ressens (/app/journal) ou mettre une musique apaisante (/app/music). Si la situation est difficile, rapproche-toi d'un professionnel ou d'une personne de confiance."`);

    expect(buildGenericFallback('en')).toMatchInlineSnapshot(`
"Thank you for sharing. Let's pause for a breath together. Try the guided breathing (/app/breath), jot a few lines (/app/journal) or play a soft track (/app/music). If the situation feels heavy, reach out to a professional or someone you trust."`);

    expect(buildMedicalReply('fr')).toMatchInlineSnapshot(`
"Je ne peux pas donner de conseil médical. Pour tout avis, consulte un professionnel de santé. En attendant, tu peux respirer en douceur avec le module guidé (/app/breath) ou écrire ce que tu ressens (/app/journal) pour te recentrer."`);

    expect(buildMedicalReply('en')).toMatchInlineSnapshot(`
"I can't provide medical advice. Please reach out to a qualified health professional. Meanwhile you can try the guided breathing module (/app/breath) or write down how you feel (/app/journal) to refocus."`);
  });
});
