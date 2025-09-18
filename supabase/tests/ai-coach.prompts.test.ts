import { describe, expect, it } from 'vitest';

import {
  COACH_DISCLAIMERS,
  buildSystemPrompt,
  buildUserPrompt,
  defaultCoachResponse,
  generateSuggestions,
  normalizeEmotion,
  sanitizeHistory,
} from '../functions/ai-coach/prompts.ts';

describe('ai-coach prompt helpers', () => {
  it('builds system prompts with consent and disclaimers', () => {
    expect(buildSystemPrompt('b2c', 'mindful')).toMatchInlineSnapshot(`
"Tu es un coach EmotionsCare.\nPersonnalité demandée: mindful.\nAdopte un ton chaleureux, accessible et centré sur le bien-être personnel.\nRespecte strictement la confidentialité et rappelle que les échanges sont anonymisés.\nRappels de sécurité à intégrer naturellement dans la réponse :\n- Le coach IA ne remplace pas un professionnel de santé ou de santé mentale.\n- En cas de danger immédiat ou de détresse, contactez les services d'urgence (112 en Europe) ou un proche de confiance.\n- Vos échanges sont anonymisés et destinés à un accompagnement confidentiel sans collecte de données sensibles.\nNe collecte ni ne demande jamais de données personnelles.\nEn cas de signes de détresse ou de danger, incite à contacter immédiatement les services d'urgence.\nRéponds en français clair, avec empathie et professionnalisme."`);

    expect(buildSystemPrompt('b2b')).toMatchInlineSnapshot(`
"Tu es un coach EmotionsCare.\nTu incarnes un coach bienveillant et expert en psychologie positive.\nAdopte un ton professionnel, orienté performance collective et qualité de collaboration.\nRespecte strictement la confidentialité et rappelle que les échanges sont anonymisés.\nRappels de sécurité à intégrer naturellement dans la réponse :\n- Le coach IA ne remplace pas un professionnel de santé ou de santé mentale.\n- En cas de danger immédiat ou de détresse, contactez les services d'urgence (112 en Europe) ou un proche de confiance.\n- Vos échanges sont anonymisés et destinés à un accompagnement confidentiel sans collecte de données sensibles.\nNe collecte ni ne demande jamais de données personnelles.\nEn cas de signes de détresse ou de danger, incite à contacter immédiatement les services d'urgence.\nRéponds en français clair, avec empathie et professionnalisme."`);
  });

  it('creates user prompts that embed history context and safety reminders', () => {
    const prompt = buildUserPrompt({
      message: 'Je me sens stressé avant ma présentation.',
      emotion: 'peur',
      history: [
        { role: 'assistant', content: 'Coach: Bonjour, comment puis-je vous aider ?' },
        { role: 'user', content: 'Utilisateur: Je veux booster ma confiance.' },
      ],
      disclaimers: COACH_DISCLAIMERS,
    });

    expect(prompt).toMatchInlineSnapshot(`
"Emotion détectée ou déclarée: peur.\nHistorique récent:\nCoach: Coach: Bonjour, comment puis-je vous aider ?\nUtilisateur: Utilisateur: Je veux booster ma confiance.\nNouveau message à traiter:\nJe me sens stressé avant ma présentation.\nStructure attendue de ta réponse:\n1. Accueil empathique en deux phrases maximum.\n2. Conseils pratiques en trois puces maximum, adaptés à l'émotion identifiée.\n3. Rappel sécurité synthétique (ex: Le coach IA ne remplace pas un professionnel de santé ou de santé mentale.).\nTermine par une question ouverte encourageant l'utilisateur à poursuivre la conversation."`);
  });

  it('normalizes emotions, sanitizes history and surfaces suggestions', () => {
    expect(normalizeEmotion('Enthousiaste')).toBe('joie');
    expect(normalizeEmotion('Stressé')).toBe('peur');

    const sanitizedHistory = sanitizeHistory([
      { role: 'assistant', content: 'Merci pour votre partage !'.repeat(120) },
      { role: 'user', content: 'Je cherche un plan d’action concret.' },
      { role: 'system' as any, content: 'ignore' },
    ]);

    expect(sanitizedHistory).toHaveLength(2);
    expect(sanitizedHistory[0].role).toBe('assistant');
    expect(sanitizedHistory[0].content.length).toBeLessThanOrEqual(600);
    expect(sanitizedHistory[0].content.endsWith('…')).toBe(true);
    expect(sanitizedHistory[1]).toEqual({ role: 'user', content: 'Je cherche un plan d’action concret.' });

    expect(generateSuggestions('peur', 'b2b')).toMatchInlineSnapshot(`
[
  "Partagez vos inquiétudes avec votre manager pour clarifier les attentes.",
  "Transformez les incertitudes en hypothèses et actions priorisées.",
  "Mobilisez un collègue comme partenaire de soutien sur le sujet concerné.",
]
`);

    expect(defaultCoachResponse('', 'b2c')).toMatchInlineSnapshot(`
"Je suis là pour vous accompagner. Parlez-moi de ce que vous vivez en ce moment. Ces conseils ne remplacent pas un accompagnement médical ou psychologique professionnel. En cas de danger immédiat ou de détresse, contactez les services d'urgence (112 en Europe) ou un proche de confiance."`);
  });
});

