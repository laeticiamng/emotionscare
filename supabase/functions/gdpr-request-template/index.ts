// @ts-nocheck
/**
 * gdpr-request-template - Génération de templates de demandes RGPD
 *
 * 🔒 SÉCURISÉ: Auth admin/b2b_admin + Rate limit 10/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

serve(async (req) => {
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  if (!corsResult.allowed) {
    return rejectCors(corsResult);
  }

  const { user, status } = await authorizeRole(req, ['b2b_admin', 'admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'gdpr-request-template',
    userId: user.id,
    limit: 10,
    windowMs: 60_000,
    description: 'GDPR request template generation',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  try {
    const { requestType, userContext, model, temperature } = await req.json();
    
    if (!requestType) {
      throw new Error('Un type de demande doit être spécifié');
    }

    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      throw new Error('Clé API OpenAI manquante');
    }

    // Construction du prompt avec les informations utilisateur si disponibles
    let userInfo = '';
    if (userContext) {
      if (userContext.name) userInfo += `\nNom: ${userContext.name}`;
      if (userContext.email) userInfo += `\nEmail: ${userContext.email}`;
      if (userContext.company) userInfo += `\nEntreprise concernée: ${userContext.company}`;
      if (userContext.details) userInfo += `\nInformations supplémentaires fournies par l'utilisateur: ${userContext.details}`;
    }

    // Mapping des types de demande vers des descriptions plus précises
    const requestTypeMap: Record<string, string> = {
      'access': "d'accès à mes données personnelles",
      'rectification': "de rectification de mes données personnelles",
      'deletion': "d'effacement de mes données personnelles",
      'portability': "de portabilité de mes données personnelles",
      'objection': "d'opposition au traitement de mes données personnelles",
      'restriction': "de limitation du traitement de mes données personnelles"
    };

    const requestDescription = requestTypeMap[requestType] || requestType;

    const prompt = `
    Générez un modèle de lettre pour une demande RGPD ${requestDescription}.
    ${userInfo}
    
    La lettre doit:
    1. Être formelle mais claire
    2. Mentionner spécifiquement le droit RGPD concerné
    3. Inclure les références juridiques appropriées
    4. Spécifier un délai de réponse conforme à la loi (1 mois)
    
    Structurez votre réponse avec:
    1. Le modèle de lettre complet
    2. Une liste d'instructions pour compléter/envoyer la demande
    3. Le délai estimé de traitement
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'gpt-4.1-2025-04-14',
        temperature: temperature || 0.2,
        messages: [
          { role: 'system', content: 'Vous êtes un spécialiste RGPD qui génère des modèles de lettres juridiques clairs et précis.' },
          { role: 'user', content: prompt }
        ]
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Erreur OpenAI:', responseData);
      throw new Error('Erreur lors de la génération du modèle');
    }

    const content = responseData.choices[0].message.content;

    // Extraction des différentes sections
    let template = '';
    let instructions: string[] = [];
    let estimatedProcessingTime = '30 jours';

    // Extraction du modèle de lettre
    const templateMatch = content.match(/(.+?)(?=Instructions|Liste d'instructions|Étapes suivantes|$)/s);
    if (templateMatch) {
      template = templateMatch[0].trim();
    }

    // Extraction des instructions
    const instructionsMatch = content.match(/(?:Instructions|Liste d'instructions|Étapes suivantes).*?:([\s\S]*?)(?=Délai|$)/i);
    if (instructionsMatch) {
      instructions = instructionsMatch[1]
        .trim()
        .split(/\n/)
        .map(instruction => instruction.replace(/^[•\-\*\d\.]\s*/, '').trim())
        .filter(instruction => instruction.length > 0);
    }

    // Extraction du délai de traitement
    const timeMatch = content.match(/(?:Délai|Délai estimé|Délai de traitement).*?:(.+?)(?=$|\n)/i);
    if (timeMatch) {
      estimatedProcessingTime = timeMatch[1].trim();
    }

    return new Response(
      JSON.stringify({
        template,
        instructions,
        estimatedProcessingTime
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
