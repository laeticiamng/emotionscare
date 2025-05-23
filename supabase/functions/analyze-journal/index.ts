
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { authorizeRole } from '../_shared/auth.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user', 'b2b_admin', 'admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { content, journal_id } = await req.json();
    
    // Vérifier si le contenu est présent pour l'analyse
    if (!content || content.trim().length === 0) {
      return new Response(JSON.stringify({
        ai_feedback: "Je n'ai pas pu analyser votre journal car aucun contenu n'a été fourni."
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Analyzing journal entry ${journal_id} with content length: ${content.length}`);

    const prompt = `Tu es un coach de bien-être pour les professionnels de santé. Analyse cette entrée de journal et fournis un feedback constructif, bienveillant et personnalisé qui:
1. Reflète ce qui semble être les émotions dominantes
2. Souligne un point positif dans cette journée, même subtil
3. Propose une piste de réflexion pour mieux prendre soin de soi
4. S'exprime toujours en français de manière bienveillante et motivante
5. Reste concis (100 à 200 mots maximum)

Voici l'entrée de journal à analyser:
"""
${content}
"""

Format de sortie: un paragraphe rédigé à la première personne du singulier, comme si tu t'adressais directement à l'auteur du journal.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Tu es un coach de bien-être spécialisé pour les professionnels de santé.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log('OpenAI response received');

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from OpenAI');
    }

    const ai_feedback = data.choices[0].message.content.trim();

    return new Response(JSON.stringify({ ai_feedback }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-journal function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      ai_feedback: "Je n'ai pas pu analyser votre journal pour le moment. Votre texte est bien enregistré et vous pourrez consulter cette entrée ultérieurement."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
