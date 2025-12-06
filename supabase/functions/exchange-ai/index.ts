// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalysisRequest {
  type: 'improvement' | 'trust' | 'time' | 'emotion';
  userId: string;
  data: Record<string, unknown>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { type, userId, data }: AnalysisRequest = await req.json();

    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case 'improvement':
        systemPrompt = `Tu es un coach de développement personnel IA pour EmotionsCare Exchange. 
        Tu analyses la progression des utilisateurs et fournis des conseils personnalisés.
        Tu dois être encourageant, précis et actionnable.
        Réponds en français.`;
        userPrompt = `Analyse cette progression et donne des conseils:
        Objectif: ${JSON.stringify(data.goal)}
        Historique: ${JSON.stringify(data.history)}
        Score actuel: ${data.currentScore}
        
        Fournis:
        1. Une analyse de la progression
        2. Des points d'amélioration
        3. Un conseil actionnable pour la prochaine étape`;
        break;

      case 'trust':
        systemPrompt = `Tu es un analyste de confiance IA pour EmotionsCare Exchange.
        Tu évalues les interactions de confiance et suggères des opportunités.
        Tu dois être objectif et constructif.
        Réponds en français.`;
        userPrompt = `Analyse ce profil de confiance:
        Score: ${data.trustScore}
        Transactions: ${JSON.stringify(data.transactions)}
        Niveau: ${data.level}
        
        Fournis:
        1. Une évaluation du comportement de confiance
        2. Des suggestions pour améliorer le score
        3. Des opportunités de projets à soutenir`;
        break;

      case 'time':
        systemPrompt = `Tu es un conseiller en échange de temps IA pour EmotionsCare Exchange.
        Tu aides les utilisateurs à optimiser leurs échanges de compétences.
        Tu dois être pratique et orienté valeur.
        Réponds en français.`;
        userPrompt = `Analyse ces offres et suggère des échanges:
        Compétences: ${JSON.stringify(data.skills)}
        Taux du marché: ${JSON.stringify(data.marketRates)}
        Historique: ${JSON.stringify(data.history)}
        
        Fournis:
        1. Une évaluation de la valeur des compétences
        2. Des suggestions d'échanges avantageux
        3. Des conseils pour améliorer la valeur`;
        break;

      case 'emotion':
        systemPrompt = `Tu es un expert en bien-être émotionnel IA pour EmotionsCare Exchange.
        Tu recommandes des assets émotionnels personnalisés.
        Tu dois être empathique et précis.
        Réponds en français.`;
        userPrompt = `Recommande des assets émotionnels:
        Humeur actuelle: ${data.currentMood}
        Objectif: ${data.goal}
        Portfolio: ${JSON.stringify(data.portfolio)}
        
        Fournis:
        1. Une analyse du besoin émotionnel
        2. Des recommandations d'assets
        3. Un programme d'utilisation suggéré`;
        break;

      default:
        throw new Error(`Unknown analysis type: ${type}`);
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const analysis = aiResponse.choices?.[0]?.message?.content || "";

    // Log the analysis for the user
    await supabase.from("ai_recommendations").insert({
      user_id: userId,
      recommendation_type: type,
      content_type: "exchange_analysis",
      content_id: crypto.randomUUID(),
      reason: analysis,
      priority_level: "medium",
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis,
        type,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Exchange AI error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
