// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MonitoringEvent {
  type: "error" | "performance" | "user_feedback" | "custom";
  severity: "critical" | "high" | "medium" | "low";
  message: string;
  context?: Record<string, any>;
  userId?: string;
  timestamp: string;
  stack?: string;
  url?: string;
  userAgent?: string;
}

interface AIAnalysis {
  isKnownIssue: boolean;
  suggestedFix: string;
  autoFixCode: string | null;
  relatedErrors: string[];
  priority: "urgent" | "high" | "medium" | "low";
  category: string;
  needsAlert: boolean;
  analysis: string;
  preventionTips: string[];
}

async function analyzeWithOpenAI(event: MonitoringEvent): Promise<AIAnalysis> {
  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  
  if (!openaiKey) {
    console.error("OPENAI_API_KEY not configured");
    return {
      isKnownIssue: false,
      suggestedFix: "OpenAI not configured",
      autoFixCode: null,
      relatedErrors: [],
      priority: event.severity === "critical" ? "urgent" : "medium",
      category: "unknown",
      needsAlert: event.severity === "critical",
      analysis: "Cannot analyze - OpenAI key missing",
      preventionTips: []
    };
  }

  try {
    const prompt = `Tu es un expert senior en debugging React/TypeScript et architecture frontend. Analyse cette erreur en profondeur:

**Contexte technique:**
- Type: ${event.type}
- Gravité: ${event.severity}
- Message: ${event.message}
- Stack trace: ${event.stack ? event.stack.substring(0, 500) : "N/A"}
- URL: ${event.url || "N/A"}
- Context additionnel: ${JSON.stringify(event.context || {}, null, 2)}

**Analyse requise:**

1. **isKnownIssue** (boolean): Est-ce un pattern d'erreur connu (import circulaire, hook mal utilisé, RLS Supabase, etc.)?

2. **suggestedFix** (string): Solution technique TRÈS détaillée avec:
   - Code exact à modifier ou ajouter
   - Fichiers concernés
   - Étapes de correction numérotées
   - Commandes si nécessaires

3. **autoFixCode** (string | null): Si applicable, fournis le code exact de correction (snippet complet avec imports)

4. **relatedErrors** (string[]): Erreurs similaires possibles dans le codebase

5. **priority** ("urgent" | "high" | "medium" | "low"): Niveau réel d'urgence

6. **category** (string): Catégorie précise (auth, api, react-hooks, typescript, rls, imports, performance, ui, etc.)

7. **needsAlert** (boolean): Nécessite intervention développeur immédiate?

8. **analysis** (string): Diagnostic complet:
   - Cause racine probable
   - Impact sur l'app
   - Risques associés
   - Recommandations préventives

9. **preventionTips** (string[]): Conseils pour éviter ce type d'erreur à l'avenir

Réponds UNIQUEMENT en JSON valide, sans markdown.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5-mini-2025-08-07",
        messages: [
          { 
            role: "system", 
            content: "Tu es un expert en debugging React/TypeScript avec 10+ ans d'expérience. Tu fournis des analyses détaillées et actionnables. Réponds UNIQUEMENT en JSON valide sans blocs markdown." 
          },
          { role: "user", content: prompt }
        ],
        max_completion_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0]?.message?.content || "{}";
    
    // Nettoyer les blocs markdown si présents
    content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
    
    // Parse JSON response
    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error(`JSON parse error: ${parseError instanceof Error ? parseError.message : 'Unknown'}`);
    }
    
    return {
      isKnownIssue: analysis.isKnownIssue || false,
      suggestedFix: analysis.suggestedFix || "Analyse non disponible",
      autoFixCode: analysis.autoFixCode || null,
      relatedErrors: analysis.relatedErrors || [],
      priority: analysis.priority || (event.severity === "critical" ? "urgent" : "medium"),
      category: analysis.category || "unknown",
      needsAlert: analysis.needsAlert || event.severity === "critical",
      analysis: analysis.analysis || "Aucune analyse disponible",
      preventionTips: analysis.preventionTips || []
    };
  } catch (error) {
    console.error("Error analyzing with OpenAI:", error);
    return {
      isKnownIssue: false,
      suggestedFix: "Erreur d'analyse AI",
      autoFixCode: null,
      relatedErrors: [],
      priority: event.severity === "critical" ? "urgent" : "medium",
      category: "unknown",
      needsAlert: event.severity === "critical",
      analysis: `Erreur lors de l'analyse: ${error instanceof Error ? error.message : "Unknown error"}`,
      preventionTips: []
    };
  }
}

async function storeMonitoringEvent(event: MonitoringEvent, analysis: AIAnalysis) {
  // Store in a monitoring table for tracking
  console.log("📊 Monitoring Event:", {
    type: event.type,
    severity: event.severity,
    message: event.message,
    analysis: analysis.analysis,
    suggestedFix: analysis.suggestedFix,
    needsAlert: analysis.needsAlert
  });
  
  // TODO: Store in database for historical analysis
  // await supabase.from('monitoring_events').insert({ event, analysis });
}

async function sendAlertIfNeeded(event: MonitoringEvent, analysis: AIAnalysis) {
  if (!analysis.needsAlert) return;

  console.warn("🚨 ALERT NEEDED:", {
    severity: event.severity,
    priority: analysis.priority,
    message: event.message,
    suggestedFix: analysis.suggestedFix
  });

  // TODO: Implement alert system (email, webhook, etc.)
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const event: MonitoringEvent = await req.json();
    
    console.log("📥 Received monitoring event:", event.type, event.severity);

    // Analyze with AI
    const analysis = await analyzeWithOpenAI(event);

    // Store event
    await storeMonitoringEvent(event, analysis);

    // Send alert if critical
    await sendAlertIfNeeded(event, analysis);

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        eventId: crypto.randomUUID(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in ai-monitoring:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
