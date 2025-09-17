
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4"

import { logAccess } from "../_shared/logging.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabaseAdmin = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey)
  : null

const COACH_DISCLAIMERS = [
  "Le coach IA ne remplace pas un professionnel de santé ou de santé mentale.",
  "En cas de danger immédiat ou de détresse, contactez les services d'urgence (112 en Europe) ou un proche de confiance.",
]

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let userContext: { userId: string | null; userRole: string | null } = { userId: null, userRole: null };

  try {
    userContext = await getUserContext(req);
    const { message, emotion } = await req.json();
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    const normalizedEmotion = (emotion || 'neutre').toLowerCase();

    const systemPrompt = `Tu es un coach en bien-être émotionnel bienveillant et professionnel.
    Tu aides les utilisateurs à gérer leurs émotions et améliorer leur bien-être.
    ${emotion ? `L'utilisateur semble ressentir: ${emotion}` : ''}
    Réponds avec empathie et propose des conseils pratiques.
    Limite tes réponses à 200 mots maximum.`;

    let source: 'openai' | 'fallback' = 'fallback'
    let coachResponse = defaultCoachResponse(message)

    if (openaiApiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 300
        }),
      });

      if (!response.ok) {
        console.error('OpenAI error response:', await response.text());
      } else {
        const data = await response.json();
        coachResponse = data?.choices?.[0]?.message?.content?.trim() || coachResponse;
        source = 'openai';
      }
    } else {
      console.warn('OPENAI_API_KEY missing, using fallback response');
    }

    // Générer des suggestions basées sur l'émotion
    const suggestions = generateSuggestions(normalizedEmotion);
    const payload = {
      response: coachResponse,
      suggestions,
      disclaimers: COACH_DISCLAIMERS,
      meta: {
        emotion: normalizedEmotion,
        source,
        timestamp: new Date().toISOString(),
      },
    };

    await logAccess({
      user_id: userContext.userId,
      role: userContext.userRole,
      route: 'ai-coach',
      action: 'generate_response',
      result: 'success',
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
      user_agent: req.headers.get('user-agent') || undefined,
      details: JSON.stringify({ emotion: normalizedEmotion, source }),
    });

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-coach:', error);

    await logAccess({
      user_id: userContext.userId,
      role: userContext.userRole,
      route: 'ai-coach',
      action: 'generate_response',
      result: 'error',
      details: error instanceof Error ? error.message : 'Unexpected error',
    });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateSuggestions(emotion: string): string[] {
  const suggestionsByEmotion = {
    'joie': [
      'Partagez cette joie avec vos proches',
      'Pratiquez la gratitude',
      'Engagez-vous dans une activité créative'
    ],
    'tristesse': [
      'Prenez du temps pour vous',
      'Écoutez de la musique apaisante',
      'Parlez à quelqu\'un en qui vous avez confiance'
    ],
    'colère': [
      'Pratiquez des exercices de respiration',
      'Faites de l\'exercice physique',
      'Prenez du recul avant de réagir'
    ],
    'peur': [
      'Identifiez la source de votre peur',
      'Pratiquez la relaxation',
      'Divisez le problème en petites étapes'
    ],
    'neutre': [
      'Explorez de nouvelles activités',
      'Connectez-vous avec la nature',
      'Pratiquez la méditation'
    ]
  };

  return suggestionsByEmotion[emotion] || suggestionsByEmotion['neutre'];
}

function defaultCoachResponse(message: string): string {
  if (!message) {
    return "Je suis là pour vous accompagner. Parlez-moi de ce que vous ressentez en ce moment.";
  }

  return "Merci de partager cela avec moi. Prenons un moment pour respirer et regarder ensemble comment avancer pas à pas.";
}

async function getUserContext(req: Request): Promise<{ userId: string | null; userRole: string | null }> {
  if (!supabaseAdmin) {
    return { userId: null, userRole: null };
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { userId: null, userRole: null };
  }

  try {
    const token = authHeader.replace('Bearer ', '').trim();
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error) {
      console.warn('Unable to fetch user context for logging:', error);
      return { userId: null, userRole: null };
    }

    const user = data?.user;
    if (!user) {
      return { userId: null, userRole: null };
    }

    const role = typeof user.app_metadata?.role === 'string'
      ? user.app_metadata.role
      : Array.isArray(user.app_metadata?.roles)
        ? user.app_metadata.roles[0]
        : null;

    return {
      userId: user.id,
      userRole: role,
    };
  } catch (err) {
    console.warn('Error retrieving user context:', err);
    return { userId: null, userRole: null };
  }
}
