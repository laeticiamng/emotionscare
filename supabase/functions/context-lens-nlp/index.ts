// @ts-nocheck
/**
 * Context Lens NLP Edge Function
 * Analyse NLP multilingue : sentiment, émotions, entités
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Emotion keywords for basic sentiment analysis (French/English)
const EMOTION_KEYWORDS = {
  joy: {
    fr: ['heureux', 'heureuse', 'joie', 'content', 'contente', 'super', 'génial', 'fantastique', 'merveilleux', 'bonheur', 'sourire', 'rire', 'aimer', 'adorer'],
    en: ['happy', 'joy', 'glad', 'great', 'amazing', 'wonderful', 'fantastic', 'love', 'excited', 'smile', 'laugh'],
  },
  sadness: {
    fr: ['triste', 'malheureux', 'malheureuse', 'déprimé', 'déprimée', 'pleurer', 'larmes', 'chagrin', 'mélancolie', 'seul', 'seule'],
    en: ['sad', 'unhappy', 'depressed', 'cry', 'tears', 'lonely', 'grief', 'melancholy'],
  },
  anger: {
    fr: ['colère', 'énervé', 'énervée', 'furieux', 'furieuse', 'agacé', 'agacée', 'frustré', 'frustrée', 'rage', 'détester'],
    en: ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'rage', 'hate', 'irritated'],
  },
  fear: {
    fr: ['peur', 'anxieux', 'anxieuse', 'inquiet', 'inquiète', 'stressé', 'stressée', 'angoisse', 'terreur', 'effrayé', 'effrayée'],
    en: ['fear', 'anxious', 'worried', 'scared', 'stressed', 'nervous', 'afraid', 'terrified'],
  },
  surprise: {
    fr: ['surpris', 'surprise', 'étonné', 'étonnée', 'choqué', 'choquée', 'inattendu', 'incroyable'],
    en: ['surprised', 'shocked', 'amazed', 'astonished', 'unexpected', 'incredible'],
  },
  disgust: {
    fr: ['dégoût', 'dégoûté', 'dégoûtée', 'écœuré', 'écœurée', 'répugnant', 'horrible'],
    en: ['disgust', 'disgusted', 'gross', 'horrible', 'revolting', 'awful'],
  },
};

// Entity patterns
const ENTITY_PATTERNS = {
  person: /\b([A-Z][a-zéèêë]+)\s+([A-Z][a-zéèêë]+)\b/g,
  date: /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{1,2}\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)(?:\s+\d{2,4})?)\b/gi,
  activity: /\b(méditation|respiration|yoga|sport|marche|course|lecture|musique|écriture|dessin|cuisine|jardinage|relaxation)\b/gi,
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { text, language = 'fr', extract_entities = true } = await req.json();

    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Context Lens NLP] Analyzing text (${language}): ${text.substring(0, 50)}...`);

    const analysis = analyzeText(text, language, extract_entities);

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Context Lens NLP] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function analyzeText(text: string, language: string, extractEntities: boolean) {
  const lowerText = text.toLowerCase();
  const lang = language === 'en' ? 'en' : 'fr';

  // Analyze emotions
  const emotions = {
    joy: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    surprise: 0,
    disgust: 0,
  };

  let totalMatches = 0;
  Object.entries(EMOTION_KEYWORDS).forEach(([emotion, keywords]) => {
    const langKeywords = keywords[lang as keyof typeof keywords] || keywords.fr;
    langKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        emotions[emotion as keyof typeof emotions] += matches.length;
        totalMatches += matches.length;
      }
    });
  });

  // Normalize emotion scores
  if (totalMatches > 0) {
    Object.keys(emotions).forEach(key => {
      emotions[key as keyof typeof emotions] /= totalMatches;
    });
  }

  // Calculate sentiment
  const positiveScore = emotions.joy + emotions.surprise * 0.5;
  const negativeScore = emotions.sadness + emotions.anger + emotions.fear + emotions.disgust;
  const sentimentScore = Math.max(-1, Math.min(1, (positiveScore - negativeScore)));
  const sentimentLabel = sentimentScore > 0.1 ? 'positive' : sentimentScore < -0.1 ? 'negative' : 'neutral';

  // Extract entities
  const entities: Array<{ text: string; type: string; confidence: number }> = [];
  if (extractEntities) {
    // Activities
    const activityMatches = text.match(ENTITY_PATTERNS.activity);
    if (activityMatches) {
      activityMatches.forEach(match => {
        entities.push({ text: match, type: 'activity', confidence: 0.9 });
      });
    }

    // Dates
    const dateMatches = text.match(ENTITY_PATTERNS.date);
    if (dateMatches) {
      dateMatches.forEach(match => {
        entities.push({ text: match, type: 'date', confidence: 0.85 });
      });
    }
  }

  // Extract keywords (simple frequency-based)
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const wordFreq: Record<string, number> = {};
  words.forEach(w => {
    const clean = w.replace(/[^a-zàâäéèêëïîôùûüç]/gi, '');
    if (clean.length > 3) {
      wordFreq[clean] = (wordFreq[clean] || 0) + 1;
    }
  });
  const keywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);

  return {
    text,
    language: lang,
    sentiment: {
      score: sentimentScore,
      label: sentimentLabel,
    },
    emotions,
    entities,
    keywords,
    topics: detectTopics(lowerText, lang),
  };
}

function detectTopics(text: string, lang: string): string[] {
  const topics: string[] = [];
  
  const topicKeywords: Record<string, string[]> = {
    'travail': ['travail', 'bureau', 'collègue', 'réunion', 'projet', 'work', 'office', 'meeting'],
    'famille': ['famille', 'enfant', 'parent', 'frère', 'sœur', 'family', 'child', 'parent'],
    'santé': ['santé', 'médecin', 'malade', 'fatigue', 'sommeil', 'health', 'doctor', 'tired', 'sleep'],
    'relations': ['ami', 'amie', 'couple', 'relation', 'friend', 'relationship'],
    'bien-être': ['méditation', 'yoga', 'sport', 'relaxation', 'bien-être', 'meditation', 'wellness'],
    'finances': ['argent', 'budget', 'dépense', 'money', 'budget', 'expense'],
  };

  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(kw => text.includes(kw))) {
      topics.push(topic);
    }
  });

  return topics;
}
