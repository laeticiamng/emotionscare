// @ts-nocheck
/**
 * Journal AI Process - Traitement AI pour le journal
 * Utilise Lovable AI Gateway pour transcription et analyse
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const AI_GATEWAY_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const body = await req.json();
    const { action, text, audio, mimeType, entries } = body;

    // Traitement texte
    if (action === 'text') {
      const result = await analyzeText(text);
      return new Response(JSON.stringify({ success: true, ...result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Traitement vocal (simulation - en production utiliser Whisper)
    if (action === 'voice') {
      // Note: La transcription audio nécessite Whisper API
      // Pour l'instant, on retourne un message informatif
      const result = await analyzeText(
        "[Note vocale reçue - transcription en cours d'intégration avec Whisper API]"
      );
      return new Response(JSON.stringify({ 
        success: true, 
        transcription: "[Transcription Whisper à configurer]",
        language: 'fr',
        duration: 0,
        ...result 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Génération de tags
    if (action === 'tags') {
      const tags = await generateTags(text);
      return new Response(JSON.stringify({ success: true, tags }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Analyse de tendances
    if (action === 'trends') {
      const trends = await analyzeTrends(entries);
      return new Response(JSON.stringify({ success: true, ...trends }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Action non reconnue' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[journal-ai-process] Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function analyzeText(text: string): Promise<{
  summary: string;
  tone: 'positive' | 'neutral' | 'negative';
  emotions: string[];
  keywords: string[];
  suggestedTags: string[];
  confidence: number;
}> {
  if (!LOVABLE_API_KEY) {
    console.warn('LOVABLE_API_KEY not configured, using heuristic analysis');
    return heuristicAnalysis(text);
  }

  try {
    const response = await fetch(AI_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en analyse de journal intime et bien-être émotionnel.
Analyse le texte et retourne un JSON avec:
- summary: résumé en 1-2 phrases (max 100 caractères)
- tone: "positive", "neutral" ou "negative"
- emotions: tableau des émotions détectées (max 3, en français)
- keywords: mots-clés importants (max 5)
- suggestedTags: tags suggérés pour catégoriser (max 3)
- confidence: score de confiance 0-1

Réponds UNIQUEMENT avec le JSON, sans markdown.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn('Rate limited, using heuristic');
        return heuristicAnalysis(text);
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    try {
      const parsed = JSON.parse(content.replace(/```json\n?|\n?```/g, '').trim());
      return {
        summary: parsed.summary || text.substring(0, 97) + '...',
        tone: parsed.tone || 'neutral',
        emotions: parsed.emotions || [],
        keywords: parsed.keywords || [],
        suggestedTags: parsed.suggestedTags || [],
        confidence: parsed.confidence || 0.8,
      };
    } catch {
      return heuristicAnalysis(text);
    }
  } catch (error) {
    console.error('AI analysis error:', error);
    return heuristicAnalysis(text);
  }
}

async function generateTags(text: string): Promise<string[]> {
  if (!LOVABLE_API_KEY) {
    return extractKeywordsSimple(text);
  }

  try {
    const response = await fetch(AI_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'Génère 3-5 tags pertinents pour catégoriser cette entrée de journal. Retourne uniquement un tableau JSON de strings en français, sans markdown.'
          },
          { role: 'user', content: text }
        ],
        temperature: 0.3,
        max_tokens: 100,
      }),
    });

    if (!response.ok) return extractKeywordsSimple(text);

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '[]';
    return JSON.parse(content.replace(/```json\n?|\n?```/g, '').trim());
  } catch {
    return extractKeywordsSimple(text);
  }
}

async function analyzeTrends(entries: Array<{ content: string; created_at: string }>): Promise<{
  dominantTone: 'positive' | 'neutral' | 'negative';
  trendDirection: 'improving' | 'stable' | 'declining';
  insights: string[];
}> {
  if (!LOVABLE_API_KEY || entries.length < 3) {
    return {
      dominantTone: 'neutral',
      trendDirection: 'stable',
      insights: ['Continuez à écrire pour obtenir des analyses de tendances.']
    };
  }

  try {
    const entriesSummary = entries.slice(0, 10).map((e, i) => 
      `[${i + 1}] ${e.content.substring(0, 200)}`
    ).join('\n\n');

    const response = await fetch(AI_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Analyse ces entrées de journal chronologiques et retourne un JSON:
- dominantTone: "positive", "neutral" ou "negative"
- trendDirection: "improving", "stable" ou "declining"
- insights: 2-3 observations en français sur les tendances émotionnelles

Réponds uniquement avec le JSON.`
          },
          { role: 'user', content: entriesSummary }
        ],
        temperature: 0.4,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      return { dominantTone: 'neutral', trendDirection: 'stable', insights: [] };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const parsed = JSON.parse(content.replace(/```json\n?|\n?```/g, '').trim());

    return {
      dominantTone: parsed.dominantTone || 'neutral',
      trendDirection: parsed.trendDirection || 'stable',
      insights: parsed.insights || [],
    };
  } catch {
    return { dominantTone: 'neutral', trendDirection: 'stable', insights: [] };
  }
}

function heuristicAnalysis(text: string) {
  const lower = text.toLowerCase();
  
  const positiveWords = ['heureux', 'content', 'joie', 'super', 'bien', 'merci', 'génial', 'excellent', 'parfait', 'amour', 'sourire', 'rire'];
  const negativeWords = ['triste', 'mal', 'stress', 'anxieux', 'peur', 'colère', 'frustré', 'déprimé', 'inquiet', 'horrible', 'pleurer'];
  
  let posCount = 0, negCount = 0;
  positiveWords.forEach(w => { if (lower.includes(w)) posCount++; });
  negativeWords.forEach(w => { if (lower.includes(w)) negCount++; });
  
  const tone = posCount > negCount ? 'positive' : negCount > posCount ? 'negative' : 'neutral';
  
  return {
    summary: text.length > 100 ? text.substring(0, 97) + '...' : text,
    tone,
    emotions: [],
    keywords: extractKeywordsSimple(text),
    suggestedTags: extractKeywordsSimple(text).slice(0, 3),
    confidence: 0.5,
  };
}

function extractKeywordsSimple(text: string): string[] {
  const stopWords = new Set(['le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'mais', 'donc', 'car', 'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'ce', 'cette', 'mon', 'ma', 'ton', 'son', 'notre', 'votre', 'leur', 'ai', 'as', 'a', 'avons', 'avez', 'ont', 'suis', 'es', 'est', 'être', 'avoir', 'fait', 'pour', 'dans', 'sur', 'avec', 'sans', 'par', 'plus', 'très', 'aussi', 'bien', 'tout', 'tous']);
  
  const words = text.toLowerCase()
    .replace(/[^\wàâäéèêëïîôùûüç\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w));
  
  const freq: Record<string, number> = {};
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
  
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}
