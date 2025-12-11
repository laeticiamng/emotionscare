// @ts-nocheck
/**
 * Chat Coach - Coach IA sécurisé via Lovable AI Gateway
 * Utilise google/gemini-2.5-flash pour des réponses rapides et empathiques
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Système de détection de crise
const CRISIS_KEYWORDS = [
  'suicide', 'suicidaire', 'me tuer', 'en finir', 'mourir', 
  'plus envie de vivre', 'automutilation', 'me faire du mal',
  'désespéré', 'sans espoir', 'plus rien à perdre'
];

const CRISIS_RESOURCES = {
  france: {
    name: 'Numéro national de prévention du suicide',
    number: '3114',
    available: '24h/24, 7j/7'
  },
  sos_amitie: {
    name: 'SOS Amitié',
    number: '09 72 39 40 50',
    available: '24h/24'
  }
};

function detectCrisis(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

function getCrisisResponse(): string {
  return `⚠️ **Je perçois que vous traversez un moment très difficile.**

Votre bien-être est ma priorité absolue. Ce que vous ressentez est important et mérite une aide professionnelle immédiate.

📞 **Ressources d'aide immédiate :**
- **${CRISIS_RESOURCES.france.number}** - ${CRISIS_RESOURCES.france.name} (${CRISIS_RESOURCES.france.available})
- **${CRISIS_RESOURCES.sos_amitie.number}** - ${CRISIS_RESOURCES.sos_amitie.name} (${CRISIS_RESOURCES.sos_amitie.available})

Ces professionnels sont formés pour vous écouter et vous accompagner. N'hésitez pas à les appeler.

Je reste là pour vous, mais un professionnel pourra mieux vous aider dans ce moment. 💙`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentification
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY non configurée');
    }

    const { message, history, context } = await req.json();

    // Détection de crise
    if (detectCrisis(message)) {
      // Log l'alerte de crise
      await supabaseClient.from('crisis_alerts').insert({
        user_id: user.id,
        message_snippet: message.substring(0, 100),
        detected_at: new Date().toISOString(),
        status: 'detected'
      }).catch(() => {}); // Silent fail si table n'existe pas

      return new Response(
        JSON.stringify({ 
          response: getCrisisResponse(),
          crisis_detected: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Construction du contexte
    const systemPrompt = `Tu es EmoCare, un coach en bien-être émotionnel bienveillant et professionnel pour la plateforme EmotionsCare.

PERSONNALITÉ:
- Empathique, chaleureux et encourageant
- Pratique et orienté solutions
- Respectueux des limites (tu n'es pas un thérapeute)
- Tu parles français naturellement

CAPACITÉS:
- Aide à comprendre et gérer les émotions
- Propose des exercices de respiration, méditation, gratitude
- Donne des conseils concrets et réalisables
- Encourage les bonnes habitudes de bien-être

LIMITES:
- Si situation grave → recommande un professionnel (psychologue, médecin)
- Ne donne jamais de diagnostic médical
- Ne prescris jamais de médicaments

CONTEXTE UTILISATEUR:
${context ? JSON.stringify(context) : 'Aucun contexte spécifique'}

Réponds de manière naturelle, bienveillante et concise (max 200 mots).`;

    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Ajouter l'historique
    if (history && history.length > 0) {
      history.slice(-10).forEach((msg: { sender: string; content: string }) => {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      });
    }

    messages.push({ role: 'user', content: message });

    // Appel à Lovable AI Gateway
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Limite de requêtes atteinte. Réessayez dans quelques instants.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Service IA temporairement indisponible.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'Je suis désolé, je n\'ai pas pu générer une réponse.';

    // Sauvegarder la session
    await supabaseClient.from('ai_coach_sessions').upsert({
      user_id: user.id,
      updated_at: new Date().toISOString(),
      messages_count: (history?.length || 0) + 2
    }, { onConflict: 'user_id' }).catch(() => {});

    return new Response(
      JSON.stringify({ response: aiResponse, crisis_detected: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('[chat-coach] Error:', errorMessage);
    return new Response(
      JSON.stringify({ error: 'Erreur de communication avec le coach IA' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
