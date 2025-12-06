
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import sanitizeHtml from "https://esm.sh/sanitize-html@2.17.0";
import { authorizeRole } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const sanitizeUserContent = (input?: unknown): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  const sanitized = sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} });
  return sanitized
    .replace(/\u00a0/g, ' ')
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .trim();
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user', 'b2b_admin', 'admin']);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const body = await req.json();
    const sanitizedContent = sanitizeUserContent(body?.content);
    const sanitizedHistory = Array.isArray(body?.previousEntries)
      ? body.previousEntries
          .map((entry: unknown) => sanitizeUserContent(typeof entry === 'string' ? entry : JSON.stringify(entry)))
          .filter((entry: string) => entry.length > 0)
          .slice(-3)
      : [];

    if (!sanitizedContent) {
      return new Response(
        JSON.stringify({ error: 'Journal content required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const analysisPrompt = `Analyse cette entrée de journal personnel et fournis une analyse complète :

    Contenu : "${sanitizedContent}"
    ${sanitizedHistory.length ? `Historique récent : ${JSON.stringify(sanitizedHistory)}` : ''}
    
    Réponds en JSON avec cette structure :
    {
      "mood": "string (ex: Joyeux, Pensif, Stressé)",
      "emotional_tags": ["tag1", "tag2", "tag3"],
      "insights": ["insight1", "insight2"],
      "suggestions": [
        {
          "type": "reflection|action|technique|resource",
          "title": "titre",
          "content": "description détaillée",
          "priority": "low|medium|high",
          "category": "catégorie"
        }
      ],
      "patterns": [
        {
          "pattern": "description du pattern",
          "frequency": 3,
          "trend": "increasing|decreasing|stable",
          "recommendation": "recommandation"
        }
      ]
    }`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'Tu es un thérapeute bienveillant qui analyse les journaux personnels. Réponds en JSON valide uniquement.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        max_tokens: 300,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    try {
      const analysisResult = JSON.parse(aiResponse);
      return new Response(
        JSON.stringify(analysisResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      return new Response(
        JSON.stringify({
          mood: 'Pensif',
          feedback: 'Merci pour ce partage. Votre réflexion montre une belle introspection.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in analyze-journal function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
