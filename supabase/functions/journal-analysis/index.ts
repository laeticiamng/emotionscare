import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import sanitizeHtml from "https://esm.sh/sanitize-html@2.17.0";
import { buildRateLimitResponse, enforceEdgeRateLimit } from "../_shared/rate-limit.ts";

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

interface JournalAnalysisRequest {
  entry: string;
  previous_entries?: string[];
  analysis_type?: 'emotional' | 'behavioral' | 'progress' | 'comprehensive';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    return new Response(JSON.stringify({ 
      error: 'OpenAI API key not configured',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'journal-analysis',
      limit: 6,
      windowMs: 60_000,
      description: 'journal-analysis-request',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        message: 'Veuillez patienter avant de réessayer.',
      });
    }

    const body = await req.json() as JournalAnalysisRequest;
    const sanitizedEntry = sanitizeUserContent(body?.entry);
    const sanitizedHistory = Array.isArray(body?.previous_entries)
      ? body.previous_entries
          .map((entry) => sanitizeUserContent(entry))
          .filter((entry) => entry.length > 0)
          .slice(-3)
      : [];

    if (!sanitizedEntry) {
      return new Response(JSON.stringify({
        error: 'Journal entry is required',
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    console.log('📔 Analyzing journal entry with OpenAI');

    const analysisType = body.analysis_type || 'comprehensive';
    
    const systemPrompts = {
      emotional: `Tu es un thérapeute spécialisé dans l'analyse émotionnelle. Analyse l'entrée de journal suivante et fournis une réponse JSON avec:
      {
        "emotional_state": {"primary": "emotion", "secondary": ["emotions"], "intensity": 0-10},
        "mood_trends": ["observation1", "observation2"],
        "emotional_insights": "analyse_détaillée",
        "recommendations": ["conseil1", "conseil2"]
      }`,
      
      behavioral: `Tu es un psychologue comportemental. Analyse les patterns comportementaux dans cette entrée de journal et fournis une réponse JSON avec:
      {
        "behavioral_patterns": ["pattern1", "pattern2"],
        "triggers": ["trigger1", "trigger2"],
        "coping_mechanisms": ["mécanisme1", "mécanisme2"],
        "behavioral_insights": "analyse_détaillée",
        "action_suggestions": ["action1", "action2"]
      }`,
      
      progress: `Tu es un coach en développement personnel. Analyse les progrès et évolutions dans cette entrée de journal et fournis une réponse JSON avec:
      {
        "progress_indicators": ["progrès1", "progrès2"],
        "areas_of_growth": ["domaine1", "domaine2"],
        "challenges": ["défi1", "défi2"],
        "achievements": ["réussite1", "réussite2"],
        "next_steps": ["étape1", "étape2"]
      }`,
      
      comprehensive: `Tu es un thérapeute expérimenté spécialisé dans l'analyse de journaux personnels. Fournis une analyse complète en JSON:
      {
        "emotional_analysis": {
          "primary_emotions": [{"name": "emotion", "intensity": 0-10, "context": "contexte"}],
          "emotional_trajectory": "évolution_émotionnelle",
          "emotional_balance": 0-10
        },
        "behavioral_insights": {
          "patterns": ["pattern1", "pattern2"],
          "triggers": ["trigger1", "trigger2"],
          "coping_strategies": ["stratégie1", "stratégie2"]
        },
        "progress_tracking": {
          "positive_developments": ["développement1", "développement2"],
          "areas_for_improvement": ["amélioration1", "amélioration2"],
          "consistency_score": 0-10
        },
        "personalized_recommendations": {
          "immediate_actions": ["action1", "action2"],
          "long_term_goals": ["objectif1", "objectif2"],
          "therapeutic_exercises": ["exercice1", "exercice2"]
        },
        "overall_wellbeing_score": 0-10,
        "key_insights": "résumé_principal_des_insights",
        "encouraging_message": "message_de_soutien_personnalisé"
      }`
    };

    const userEntryMessage = `Voici l'entrée de journal à analyser: "${sanitizedEntry}"`;
    let messages = [
      {
        role: 'system',
        content: systemPrompts[analysisType]
      },
      {
        role: 'user',
        content: userEntryMessage
      }
    ];

    // Ajouter le contexte des entrées précédentes si disponible
    if (sanitizedHistory.length > 0) {
      messages.push({
        role: 'user',
        content: `Contexte des entrées précédentes: ${sanitizedHistory.join(' | ')}`
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 1500,
        temperature: 0.4,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const result = await response.json();
    const analysis = JSON.parse(result.choices[0].message.content);
    const sanitizeStructure = (value: unknown): unknown => {
      if (typeof value === 'string') {
        return sanitizeUserContent(value);
      }

      if (Array.isArray(value)) {
        return value.map((item) => sanitizeStructure(item));
      }

      if (value && typeof value === 'object') {
        return Object.fromEntries(
          Object.entries(value as Record<string, unknown>).map(([key, val]) => [key, sanitizeStructure(val)])
        );
      }

      return value;
    };

    const safeAnalysis = sanitizeStructure(analysis) as typeof analysis;
    
    console.log('✅ Journal analysis completed');

    const formattedResponse = {
      success: true,
      data: {
        ...safeAnalysis,
        analysis_type: analysisType,
        entry_length: sanitizedEntry.length,
        analysis_timestamp: new Date().toISOString(),
        model_used: 'gpt-4o-mini',
        has_historical_context: !!(body.previous_entries && body.previous_entries.length > 0)
      }
    };

    return new Response(JSON.stringify(formattedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Journal analysis error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});