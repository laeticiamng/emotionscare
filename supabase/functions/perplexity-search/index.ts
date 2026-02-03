// @ts-nocheck
/**
 * Perplexity AI Search Edge Function
 * Recherche contextuelle intelligente pour l'aide et les ressources bien-être
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  query: string;
  context?: 'wellness' | 'meditation' | 'stress' | 'emotional' | 'general';
  language?: string;
  max_tokens?: number;
}

// Contextes spécialisés pour le bien-être
const WELLNESS_SYSTEM_PROMPTS = {
  wellness: `Tu es un expert en bien-être émotionnel et mental. Fournis des réponses empathiques, 
    basées sur des preuves scientifiques, adaptées aux professionnels de santé et étudiants en médecine.
    Privilégie les techniques validées : TCC, pleine conscience, régulation émotionnelle.`,
  
  meditation: `Tu es un guide de méditation expert. Fournis des instructions claires et apaisantes
    pour les pratiques méditatives, les exercices de respiration et la relaxation progressive.
    Adapte tes conseils au niveau de l'utilisateur (débutant à avancé).`,
  
  stress: `Tu es un spécialiste de la gestion du stress pour les soignants. Fournis des stratégies
    pratiques et immédiatement applicables pour gérer le stress professionnel, prévenir le burn-out
    et maintenir l'équilibre émotionnel en milieu médical.`,
  
  emotional: `Tu es un coach en intelligence émotionnelle. Aide à identifier, comprendre et réguler
    les émotions. Propose des techniques de régulation adaptées à l'intensité émotionnelle ressentie.`,
  
  general: `Tu es un assistant bienveillant spécialisé dans le bien-être des professionnels de santé.
    Fournis des réponses complètes, empathiques et scientifiquement fondées.`,
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');
    if (!PERPLEXITY_API_KEY) {
      throw new Error('PERPLEXITY_API_KEY is not configured');
    }

    const { query, context = 'general', language = 'fr', max_tokens = 1024 }: SearchRequest = await req.json();

    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = WELLNESS_SYSTEM_PROMPTS[context] || WELLNESS_SYSTEM_PROMPTS.general;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar', // Modèle Sonar standard
        messages: [
          {
            role: 'system',
            content: `${systemPrompt}\n\nRéponds en ${language === 'fr' ? 'français' : 'anglais'}.`
          },
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens,
        temperature: 0.2,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', errorText);
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify({
        answer: data.choices?.[0]?.message?.content || '',
        citations: data.citations || [],
        model: data.model,
        usage: data.usage,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Perplexity Search error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
