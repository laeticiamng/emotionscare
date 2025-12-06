// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

async function storeMonitoringEvent(event: MonitoringEvent, analysis: AIAnalysis): Promise<string | null> {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from('ai_monitoring_errors')
      .insert({
        error_type: event.type,
        severity: event.severity,
        message: event.message,
        stack: event.stack,
        url: event.url,
        user_agent: event.userAgent,
        context: event.context || {},
        user_id: event.userId,
        ai_analysis: analysis,
        is_known_issue: analysis.isKnownIssue,
        priority: analysis.priority,
        category: analysis.category,
        needs_alert: analysis.needsAlert,
      })
      .select('id')
      .single();

    if (error) {
      console.error("Failed to store monitoring event:", error);
      return null;
    }

    console.log("✅ Monitoring event stored:", data.id);
    return data.id;
  } catch (error) {
    console.error("Error storing monitoring event:", error);
    return null;
  }
}

async function sendAlertIfNeeded(
  event: MonitoringEvent,
  analysis: AIAnalysis,
  errorId: string
): Promise<void> {
  if (!analysis.needsAlert) {
    return;
  }

  try {
    // Fetch alert configurations from database
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials not configured');
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get enabled alert configurations
    const { data: configs, error: configError } = await supabase
      .from('alert_configurations')
      .select('*')
      .eq('enabled', true);

    if (configError) {
      console.error('Failed to fetch alert configurations:', configError);
      return;
    }

    if (!configs || configs.length === 0) {
      console.log('No enabled alert configurations found');
      return;
    }

    const dashboardUrl = Deno.env.get('DASHBOARD_URL') || 'https://app.emotionscare.com/admin/ai-monitoring';

    // Process each configuration
    for (const config of configs) {
      try {
        // Check if this error matches the configuration filters
        const matchesFilters = shouldTriggerAlert(event, analysis, config);
        
        if (!matchesFilters) {
          console.log(`Config "${config.name}" filters not matched - skipping`);
          continue;
        }

        // Check throttling
        if (config.last_triggered_at && config.throttle_minutes) {
          const lastTriggered = new Date(config.last_triggered_at);
          const now = new Date();
          const minutesSince = (now.getTime() - lastTriggered.getTime()) / (1000 * 60);
          
          if (minutesSince < config.throttle_minutes) {
            console.log(`Config "${config.name}" throttled (${minutesSince.toFixed(1)}/${config.throttle_minutes} min)`);
            continue;
          }
        }

        console.log(`Triggering alerts for config: ${config.name}`);

        // Send email alerts
        if (config.notify_email && config.email_recipients && config.email_recipients.length > 0) {
          for (const email of config.email_recipients) {
            await sendEmailAlert(event, analysis, errorId, email, dashboardUrl);
          }
        }

        // Send Slack alerts
        if (config.notify_slack && config.slack_webhook_url) {
          await sendSlackAlert(event, analysis, errorId, config.slack_webhook_url, config.slack_channel, dashboardUrl);
        }

        // Send Discord alerts
        if (config.notify_discord && config.discord_webhook_url) {
          await sendDiscordAlert(event, analysis, errorId, config.discord_webhook_url, config.discord_username, dashboardUrl);
        }

        // Update last triggered timestamp
        await supabase
          .from('alert_configurations')
          .update({ last_triggered_at: new Date().toISOString() })
          .eq('id', config.id);

      } catch (configError) {
        console.error(`Failed to process config "${config.name}":`, configError);
      }
    }

  } catch (error) {
    console.error('❌ Failed to send alerts:', error);
  }
}

function shouldTriggerAlert(
  event: MonitoringEvent,
  analysis: AIAnalysis,
  config: any
): boolean {
  // Check if alert flag is required
  if (config.require_alert_flag && !analysis.needsAlert) {
    return false;
  }

  // Check minimum priority
  const priorityLevels: Record<string, number> = { low: 0, medium: 1, high: 2, urgent: 3 };
  const eventPriority = priorityLevels[analysis.priority] || 0;
  const minPriority = priorityLevels[config.min_priority] || 0;
  
  if (eventPriority < minPriority) {
    return false;
  }

  // Check minimum severity
  const severityLevels: Record<string, number> = { low: 0, medium: 1, high: 2, critical: 3 };
  const eventSeverity = severityLevels[event.severity] || 0;
  const minSeverity = severityLevels[config.min_severity] || 0;
  
  if (eventSeverity < minSeverity) {
    return false;
  }

  // Check included categories
  if (config.included_categories && config.included_categories.length > 0) {
    if (!config.included_categories.includes(analysis.category)) {
      return false;
    }
  }

  // Check excluded categories
  if (config.excluded_categories && config.excluded_categories.length > 0) {
    if (config.excluded_categories.includes(analysis.category)) {
      return false;
    }
  }

  return true;
}

async function sendEmailAlert(
  event: MonitoringEvent,
  analysis: AIAnalysis,
  errorId: string,
  recipientEmail: string,
  dashboardUrl: string
): Promise<void> {
  try {
    const response = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-error-alert`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        },
        body: JSON.stringify({
          errorMessage: event.message,
          severity: event.severity,
          priority: analysis.priority,
          category: analysis.category,
          analysis: analysis.analysis,
          suggestedFix: analysis.suggestedFix,
          autoFixCode: analysis.autoFixCode,
          preventionTips: analysis.preventionTips,
          url: event.url,
          timestamp: event.timestamp,
          errorId,
          recipientEmail,
          dashboardUrl,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Email alert failed: ${response.status}`);
    }

    console.log(`✅ Email alert sent to ${recipientEmail}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${recipientEmail}:`, error);
  }
}

async function sendSlackAlert(
  event: MonitoringEvent,
  analysis: AIAnalysis,
  errorId: string,
  webhookUrl: string,
  channel: string | null,
  dashboardUrl: string
): Promise<void> {
  try {
    const response = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-slack-alert`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        },
        body: JSON.stringify({
          errorMessage: event.message,
          severity: event.severity,
          priority: analysis.priority,
          category: analysis.category,
          analysis: analysis.analysis,
          suggestedFix: analysis.suggestedFix,
          autoFixCode: analysis.autoFixCode,
          preventionTips: analysis.preventionTips,
          url: event.url,
          timestamp: event.timestamp,
          errorId,
          webhookUrl,
          channel,
          dashboardUrl,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Slack alert failed: ${response.status}`);
    }

    console.log(`✅ Slack alert sent`);
  } catch (error) {
    console.error(`❌ Failed to send Slack alert:`, error);
  }
}

async function sendDiscordAlert(
  event: MonitoringEvent,
  analysis: AIAnalysis,
  errorId: string,
  webhookUrl: string,
  username: string | null,
  dashboardUrl: string
): Promise<void> {
  try {
    const response = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-discord-alert`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        },
        body: JSON.stringify({
          errorMessage: event.message,
          severity: event.severity,
          priority: analysis.priority,
          category: analysis.category,
          analysis: analysis.analysis,
          suggestedFix: analysis.suggestedFix,
          autoFixCode: analysis.autoFixCode,
          preventionTips: analysis.preventionTips,
          url: event.url,
          timestamp: event.timestamp,
          errorId,
          webhookUrl,
          username,
          dashboardUrl,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Discord alert failed: ${response.status}`);
    }

    console.log(`✅ Discord alert sent`);
  } catch (error) {
    console.error(`❌ Failed to send Discord alert:`, error);
  }
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

    // Store event in database
    const errorId = await storeMonitoringEvent(event, analysis);

    // Send alert if needed
    if (errorId && analysis.needsAlert) {
      await sendAlertIfNeeded(event, analysis, errorId);
    }

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
