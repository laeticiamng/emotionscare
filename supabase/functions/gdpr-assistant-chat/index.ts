// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { conversationId, message } = await req.json();

    // Récupérer l'historique complet de la conversation
    const { data: messages } = await supabase
      .from('gdpr_chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    // Sauvegarder le message utilisateur
    await supabase.from('gdpr_chat_messages').insert({
      conversation_id: conversationId,
      role: 'user',
      content: message,
      user_id: user.id,
    });

    const systemPrompt = `Tu es un expert RGPD (Règlement Général sur la Protection des Données) dédié à aider les organisations à atteindre et maintenir leur conformité.

RÔLE ET EXPERTISE:
- Connaissance approfondie du RGPD, des articles 1 à 99
- Expert en droits des personnes (accès, rectification, effacement, portabilité)
- Spécialiste des obligations des responsables de traitement
- Conseil sur les mesures de sécurité techniques et organisationnelles

APPROCHE:
- Réponds de manière claire, précise et actionnable
- Cite les articles RGPD pertinents quand nécessaire
- Fournis des recommandations concrètes étape par étape
- Identifie les risques et propose des solutions
- Adapte ton langage au niveau technique de l'utilisateur

CAPACITÉS:
- Analyse de conformité et identification des gaps
- Recommandations pour mise en conformité
- Aide à la rédaction de politiques et procédures
- Conseil sur les analyses d'impact (DPIA)
- Support pour les demandes d'exercice de droits (DSAR)

Sois empathique, pédagogue et proactif dans tes conseils.`;

    const conversationHistory = [
      { role: 'system', content: systemPrompt },
      ...(messages || []).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: conversationHistory,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requêtes atteinte. Réessayez dans quelques instants.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Crédits épuisés. Veuillez recharger votre compte Lovable AI.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error('AI Gateway error');
    }

    // Stream la réponse au client
    const reader = response.body?.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let fullResponse = '';

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader!.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (!line.trim() || line.startsWith(':')) continue;
              if (!line.startsWith('data: ')) continue;

              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  fullResponse += content;
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                }
              } catch (e) {
                // Ignore JSON parse errors for partial chunks
              }
            }
          }

          // Sauvegarder la réponse complète
          await supabase.from('gdpr_chat_messages').insert({
            conversation_id: conversationId,
            role: 'assistant',
            content: fullResponse,
            user_id: user.id,
          });

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Error in gdpr-assistant-chat:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur inconnue' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
