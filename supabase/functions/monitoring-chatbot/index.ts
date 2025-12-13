// @ts-nocheck
/**
 * Monitoring Chatbot - Assistant IA pour analyse et correction d'incidents
 * Enrichi avec suggestions de correction automatique
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FixSuggestion {
  id: string;
  type: 'sql' | 'config' | 'code' | 'manual';
  title: string;
  description: string;
  command?: string;
  risk: 'low' | 'medium' | 'high';
  autoApplicable: boolean;
}

interface AnalysisResult {
  answer: string;
  fixes: FixSuggestion[];
  severity: 'info' | 'warning' | 'critical';
  affectedSystems: string[];
  recommendedActions: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, action, fixId } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Action: Appliquer un fix suggéré
    if (action === 'apply_fix' && fixId) {
      console.log(`[monitoring-chatbot] Applying fix: ${fixId}`);
      
      // Récupérer le fix depuis le cache ou la DB
      const { data: fix } = await supabase
        .from('suggested_fixes')
        .select('*')
        .eq('id', fixId)
        .single();

      if (!fix) {
        return new Response(
          JSON.stringify({ error: 'Fix non trouvé', fixId }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Enregistrer l'application du fix
      await supabase.from('applied_fixes').insert({
        fix_id: fixId,
        applied_at: new Date().toISOString(),
        status: 'applied',
        result: { success: true, message: 'Fix appliqué manuellement' }
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Fix "${fix.title}" enregistré comme appliqué`,
          nextSteps: ['Vérifier que le problème est résolu', 'Monitorer les métriques']
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Question requise pour l'analyse
    if (!question || typeof question !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Question requise' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[monitoring-chatbot] Processing question: ${question.substring(0, 100)}...`);

    // Récupérer les données contextuelles enrichies
    const [
      escalationsResult,
      patternsResult,
      predictionsResult,
      metricsResult,
      recentErrorsResult,
      alertsResult,
    ] = await Promise.all([
      supabase.from('active_escalations').select('*').eq('status', 'active').limit(20),
      supabase.from('error_patterns_history').select('*').order('occurred_at', { ascending: false }).limit(50),
      supabase.from('ml_predictions').select('*').order('predicted_at', { ascending: false }).limit(10),
      supabase.from('escalation_performance_metrics').select('*').order('metric_date', { ascending: false }).limit(7),
      supabase.from('ai_monitoring_errors').select('*').eq('resolved', false).order('created_at', { ascending: false }).limit(30),
      supabase.from('unified_alerts').select('*').eq('acknowledged', false).order('created_at', { ascending: false }).limit(20),
    ]);

    // Préparer le contexte enrichi
    const context = {
      active_escalations: escalationsResult.data || [],
      error_patterns: patternsResult.data || [],
      ml_predictions: predictionsResult.data || [],
      performance_metrics: metricsResult.data || [],
      recent_errors: recentErrorsResult.data || [],
      pending_alerts: alertsResult.data || [],
    };

    // Analyser les patterns pour générer des suggestions de fix
    const suggestedFixes = generateFixSuggestions(context);

    // Construire le prompt système enrichi
    const systemPrompt = `Tu es un assistant IA expert en analyse de monitoring, incidents et correction automatique pour EmotionsCare.

## Contexte des données disponibles:
- ${context.active_escalations.length} escalades actives
- ${context.error_patterns.length} patterns d'erreurs récents
- ${context.ml_predictions.length} prédictions ML
- ${context.performance_metrics.length} jours de métriques
- ${context.recent_errors.length} erreurs non résolues
- ${context.pending_alerts.length} alertes en attente

## Données complètes:
${JSON.stringify(context, null, 2)}

## Suggestions de correction générées automatiquement:
${JSON.stringify(suggestedFixes, null, 2)}

## Tes responsabilités:
1. Analyser les données et identifier les causes racines
2. Proposer des solutions concrètes et actionnables
3. Évaluer la sévérité (info/warning/critical)
4. Identifier les systèmes affectés
5. Suggérer des corrections automatiques si possible
6. Prioriser les actions par impact et urgence

## Format de réponse souhaité:
- Résumé de la situation (2-3 phrases)
- Analyse des causes probables
- Actions recommandées (numérotées)
- Risques si non traité
- Corrections automatiques disponibles

Réponds en français, de manière professionnelle, concise et actionnable.`;

    // Appeler Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      // Fallback: réponse basée sur l'analyse locale
      const fallbackAnalysis = generateFallbackAnalysis(context, suggestedFixes, question);
      return new Response(
        JSON.stringify(fallbackAnalysis),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        max_tokens: 1500,
      }),
    });

    if (!aiResponse.ok) {
      console.error(`[monitoring-chatbot] AI API error: ${aiResponse.status}`);
      
      if (aiResponse.status === 429 || aiResponse.status === 402) {
        const fallbackAnalysis = generateFallbackAnalysis(context, suggestedFixes, question);
        return new Response(
          JSON.stringify(fallbackAnalysis),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const answer = aiData.choices[0].message.content;

    // Sauvegarder les fixes suggérés pour application ultérieure
    if (suggestedFixes.length > 0) {
      await supabase.from('suggested_fixes').upsert(
        suggestedFixes.map(fix => ({
          id: fix.id,
          ...fix,
          suggested_at: new Date().toISOString(),
          context_summary: question,
        })),
        { onConflict: 'id' }
      );
    }

    const result: AnalysisResult = {
      answer,
      fixes: suggestedFixes,
      severity: determineSeverity(context),
      affectedSystems: identifyAffectedSystems(context),
      recommendedActions: extractRecommendedActions(context, suggestedFixes),
    };

    console.log(`[monitoring-chatbot] Analysis complete. Fixes: ${suggestedFixes.length}, Severity: ${result.severity}`);

    return new Response(
      JSON.stringify({ 
        ...result,
        context_summary: {
          active_escalations: context.active_escalations.length,
          error_patterns: context.error_patterns.length,
          recent_errors: context.recent_errors.length,
          pending_alerts: context.pending_alerts.length,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[monitoring-chatbot] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur interne du chatbot' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Générer des suggestions de correction basées sur les patterns détectés
function generateFixSuggestions(context: any): FixSuggestion[] {
  const fixes: FixSuggestion[] = [];

  // Analyser les erreurs récentes pour patterns communs
  const errorsByType = new Map<string, number>();
  (context.recent_errors || []).forEach((err: any) => {
    const type = err.error_type || 'unknown';
    errorsByType.set(type, (errorsByType.get(type) || 0) + 1);
  });

  // Suggestions basées sur les types d'erreurs fréquents
  errorsByType.forEach((count, type) => {
    if (count >= 3) {
      if (type.includes('auth') || type.includes('jwt')) {
        fixes.push({
          id: `fix-auth-${Date.now()}`,
          type: 'config',
          title: 'Rafraîchir les tokens JWT',
          description: `${count} erreurs d'authentification détectées. Vérifier la configuration JWT.`,
          command: 'Vérifier SUPABASE_JWT_SECRET et rafraîchir les sessions',
          risk: 'low',
          autoApplicable: false,
        });
      }

      if (type.includes('timeout') || type.includes('connection')) {
        fixes.push({
          id: `fix-conn-${Date.now()}`,
          type: 'config',
          title: 'Optimiser les timeouts de connexion',
          description: `${count} timeouts détectés. Augmenter les délais ou vérifier la connectivité.`,
          command: 'Augmenter connection_timeout dans la configuration',
          risk: 'low',
          autoApplicable: true,
        });
      }

      if (type.includes('rate') || type.includes('limit')) {
        fixes.push({
          id: `fix-rate-${Date.now()}`,
          type: 'config',
          title: 'Ajuster les limites de rate limiting',
          description: `${count} erreurs de rate limiting. Revoir les quotas.`,
          command: 'Augmenter les limites dans supabase/config.toml',
          risk: 'medium',
          autoApplicable: false,
        });
      }
    }
  });

  // Suggestions basées sur les escalades actives
  if (context.active_escalations.length > 5) {
    fixes.push({
      id: `fix-escalation-${Date.now()}`,
      type: 'manual',
      title: 'Triage des escalades en masse',
      description: `${context.active_escalations.length} escalades actives. Prioriser et assigner.`,
      risk: 'medium',
      autoApplicable: false,
    });
  }

  // Suggestions basées sur les prédictions ML
  const criticalPredictions = (context.ml_predictions || []).filter(
    (p: any) => p.severity === 'critical' || p.probability > 0.8
  );
  if (criticalPredictions.length > 0) {
    fixes.push({
      id: `fix-preventive-${Date.now()}`,
      type: 'manual',
      title: 'Actions préventives recommandées',
      description: `${criticalPredictions.length} incidents critiques prédits. Intervention préventive conseillée.`,
      risk: 'high',
      autoApplicable: false,
    });
  }

  return fixes;
}

// Analyse fallback sans IA
function generateFallbackAnalysis(context: any, fixes: FixSuggestion[], question: string): AnalysisResult {
  const severity = determineSeverity(context);
  const systems = identifyAffectedSystems(context);

  let answer = `## Analyse automatique\n\n`;
  answer += `**Situation actuelle:**\n`;
  answer += `- ${context.active_escalations.length} escalades actives\n`;
  answer += `- ${context.recent_errors.length} erreurs non résolues\n`;
  answer += `- ${context.pending_alerts.length} alertes en attente\n\n`;

  if (severity === 'critical') {
    answer += `⚠️ **Attention: Situation critique détectée**\n\n`;
  }

  answer += `**Systèmes affectés:** ${systems.join(', ') || 'Aucun identifié'}\n\n`;

  if (fixes.length > 0) {
    answer += `**Corrections suggérées:**\n`;
    fixes.forEach((fix, i) => {
      answer += `${i + 1}. ${fix.title} (Risque: ${fix.risk})\n`;
    });
  }

  return {
    answer,
    fixes,
    severity,
    affectedSystems: systems,
    recommendedActions: extractRecommendedActions(context, fixes),
  };
}

function determineSeverity(context: any): 'info' | 'warning' | 'critical' {
  const criticalEscalations = (context.active_escalations || []).filter(
    (e: any) => e.current_level >= 3
  ).length;

  const criticalErrors = (context.recent_errors || []).filter(
    (e: any) => e.severity === 'critical' || e.priority === 'high'
  ).length;

  if (criticalEscalations > 0 || criticalErrors >= 5) return 'critical';
  if (context.active_escalations.length > 3 || criticalErrors > 0) return 'warning';
  return 'info';
}

function identifyAffectedSystems(context: any): string[] {
  const systems = new Set<string>();

  (context.recent_errors || []).forEach((err: any) => {
    if (err.category) systems.add(err.category);
    if (err.url?.includes('/api/')) systems.add('API');
    if (err.url?.includes('/auth')) systems.add('Authentification');
    if (err.error_type?.includes('database')) systems.add('Base de données');
  });

  (context.active_escalations || []).forEach((esc: any) => {
    if (esc.metadata?.system) systems.add(esc.metadata.system);
  });

  return Array.from(systems);
}

function extractRecommendedActions(context: any, fixes: FixSuggestion[]): string[] {
  const actions: string[] = [];

  if (context.active_escalations.length > 0) {
    actions.push('Traiter les escalades actives par ordre de priorité');
  }

  if (context.pending_alerts.length > 5) {
    actions.push('Trier et acquitter les alertes en attente');
  }

  fixes.filter(f => f.risk === 'low' && f.autoApplicable).forEach(fix => {
    actions.push(`Appliquer automatiquement: ${fix.title}`);
  });

  if (context.recent_errors.length > 10) {
    actions.push('Analyser les patterns d\'erreurs récurrents');
  }

  return actions;
}
