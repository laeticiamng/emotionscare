// @ts-nocheck
/**
 * gdpr-assistant - Assistant RGPD via IA
 *
 * 🔒 SÉCURISÉ: Auth admin + Rate limit 15/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

const gdprArticles = [
  { id: "art13", title: "Informations lors de la collecte de données" },
  { id: "art15", title: "Droit d'accès" },
  { id: "art16", title: "Droit de rectification" },
  { id: "art17", title: "Droit à l'effacement" },
  { id: "art18", title: "Droit à la limitation du traitement" },
  { id: "art20", title: "Droit à la portabilité" },
  { id: "art21", title: "Droit d'opposition" },
  { id: "art22", title: "Décision automatisée et profilage" },
  { id: "art32", title: "Sécurité du traitement" },
  { id: "art33", title: "Notification de violation" }
];

serve(async (req) => {
  // 1. CORS check
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  // Vérification CORS stricte
  if (!corsResult.allowed) {
    console.warn('[gdpr-assistant] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  // 2. Auth admin
  const { user, status } = await authorizeRole(req, ['b2b_admin', 'admin']);
  if (!user) {
    console.warn('[gdpr-assistant] Unauthorized access attempt');
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 3. 🛡️ Rate limiting
  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'gdpr-assistant',
    userId: user.id,
    limit: 15,
    windowMs: 60_000,
    description: 'GDPR assistant - Admin only',
  });

  if (!rateLimit.allowed) {
    console.warn('[gdpr-assistant] Rate limit exceeded', { userId: user.id });
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  console.log(`[gdpr-assistant] Processing for admin: ${user.id}`);

  try {
    const { question, language, previousInteractions = [], model, temperature } = await req.json();
    
    if (!question) {
      throw new Error('Une question doit être spécifiée');
    }

    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      throw new Error('Clé API OpenAI manquante');
    }

    // Construction du contexte conversationnel
    const conversationContext = previousInteractions.map(interaction => [
      { role: 'user', content: interaction.question },
      { role: 'assistant', content: interaction.answer }
    ]).flat();

    // Création du système prompt avec les articles RGPD
    const systemPrompt = `
    Vous êtes un assistant spécialiste du RGPD (Règlement Général sur la Protection des Données) dont la mission est d'expliquer de manière empathique, claire et rassurante les concepts juridiques liés à la protection des données.
    
    Votre réponse doit être:
    1. Simple à comprendre
    2. Empathique et rassurante
    3. Précise sur le plan juridique
    4. Concise (maximum 200 mots)
    
    Si la question porte clairement sur un aspect spécifique du RGPD, mentionnez les articles pertinents dans votre réponse.
    En cas de doute ou pour des conseils très spécifiques, proposez de contacter le DPO (Délégué à la Protection des Données).
    Ne donnez jamais un conseil juridique définitif, mais plutôt une explication générale et pédagogique.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'gpt-4.1-2025-04-14',
        temperature: temperature || 0.4,
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationContext,
          { role: 'user', content: question }
        ]
      }),
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('Erreur OpenAI:', responseData);
      throw new Error('Erreur lors de la génération de la réponse');
    }

    const answer = responseData.choices[0].message.content;

    // Déterminer les articles RGPD potentiellement pertinents pour cette question
    const relatedArticlesResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'gpt-4.1-2025-04-14',
        temperature: 0.1,
        messages: [
          { 
            role: 'system', 
            content: `Vous êtes un expert du RGPD. Identifiez les articles du RGPD les plus pertinents pour la question suivante. 
            Répondez uniquement avec les IDs des articles séparés par des virgules (par exemple: art13, art15). 
            N'incluez aucune autre explication. Limitez-vous à maximum 3 articles les plus pertinents.
            Utilisez cette liste: ${JSON.stringify(gdprArticles)}`
          },
          { role: 'user', content: question }
        ]
      }),
    });

    const articlesData = await relatedArticlesResponse.json();
    let relatedArticles = [];
    
    if (articlesData?.choices?.[0]?.message?.content) {
      const articleIds = articlesData.choices[0].message.content
        .split(',')
        .map(id => id.trim())
        .filter(id => id);
      
      relatedArticles = articleIds.map(id => {
        const article = gdprArticles.find(a => a.id === id);
        return article || { id, title: `Article ${id.replace('art', '')}` };
      });
    }

    return new Response(
      JSON.stringify({
        answer,
        relatedArticles: relatedArticles.length > 0 ? relatedArticles : undefined
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
