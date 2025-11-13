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
  relatedErrors: string[];
  priority: "urgent" | "high" | "medium" | "low";
  category: string;
  needsAlert: boolean;
  analysis: string;
}

async function analyzeWithOpenAI(event: MonitoringEvent): Promise<AIAnalysis> {
  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  
  if (!openaiKey) {
    console.error("OPENAI_API_KEY not configured");
    return {
      isKnownIssue: false,
      suggestedFix: "OpenAI not configured",
      relatedErrors: [],
      priority: event.severity === "critical" ? "urgent" : "medium",
      category: "unknown",
      needsAlert: event.severity === "critical",
      analysis: "Cannot analyze - OpenAI key missing"
    };
  }

  try {
    const prompt = `Tu es un expert en debugging et monitoring d'applications. Analyse cette erreur:

Type: ${event.type}
Severity: ${event.severity}
Message: ${event.message}
Context: ${JSON.stringify(event.context || {}, null, 2)}
${event.stack ? `Stack: ${event.stack}` : ""}
URL: ${event.url || "N/A"}

Fournis une analyse JSON avec:
1. isKnownIssue: si c'est une erreur commune
2. suggestedFix: solution concrète pour corriger
3. relatedErrors: erreurs liées possibles
4. priority: urgent/high/medium/low
5. category: type d'erreur (auth, api, ui, performance, etc.)
6. needsAlert: si nécessite intervention immédiate
7. analysis: explication détaillée

Réponds UNIQUEMENT en JSON valide.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Tu es un expert en debugging. Réponds uniquement en JSON valide." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "{}";
    
    // Parse JSON response
    const analysis = JSON.parse(content);
    
    return {
      isKnownIssue: analysis.isKnownIssue || false,
      suggestedFix: analysis.suggestedFix || "Analyse non disponible",
      relatedErrors: analysis.relatedErrors || [],
      priority: analysis.priority || event.severity === "critical" ? "urgent" : "medium",
      category: analysis.category || "unknown",
      needsAlert: analysis.needsAlert || event.severity === "critical",
      analysis: analysis.analysis || "Aucune analyse disponible"
    };
  } catch (error) {
    console.error("Error analyzing with OpenAI:", error);
    return {
      isKnownIssue: false,
      suggestedFix: "Erreur d'analyse AI",
      relatedErrors: [],
      priority: event.severity === "critical" ? "urgent" : "medium",
      category: "unknown",
      needsAlert: event.severity === "critical",
      analysis: `Erreur lors de l'analyse: ${error instanceof Error ? error.message : "Unknown error"}`
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
