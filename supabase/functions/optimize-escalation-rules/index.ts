// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('[Escalation Optimizer] Starting optimization analysis...');

    // Fetch all escalation rules
    const { data: rules, error: rulesError } = await supabase
      .from('alert_escalation_rules')
      .select('*')
      .eq('is_active', true);

    if (rulesError) throw rulesError;

    // Fetch performance metrics for each rule
    const { data: metrics, error: metricsError } = await supabase
      .from('escalation_performance_metrics')
      .select('*')
      .order('metric_date', { ascending: false });

    if (metricsError) throw metricsError;

    const optimizations = [];

    for (const rule of rules || []) {
      const ruleMetrics = metrics?.filter(m => m.rule_id === rule.id) || [];
      
      if (ruleMetrics.length === 0) {
        console.log(`No metrics for rule ${rule.id}, skipping...`);
        continue;
      }

      // Calculate average performance
      const avgAccuracy = ruleMetrics.reduce((sum, m) => sum + (m.escalation_accuracy || 0), 0) / ruleMetrics.length;
      const avgResolutionTime = ruleMetrics.reduce((sum, m) => sum + (m.avg_resolution_time_minutes || 0), 0) / ruleMetrics.length;
      const totalFalsePositives = ruleMetrics.reduce((sum, m) => sum + (m.false_positives || 0), 0);
      const totalMissedAlerts = ruleMetrics.reduce((sum, m) => sum + (m.missed_alerts || 0), 0);

      let recommendation = null;

      // Optimization logic
      if (avgAccuracy < 70) {
        recommendation = {
          action: 'adjust_delay',
          current_delay: rule.escalation_delay_minutes,
          suggested_delay: Math.round(rule.escalation_delay_minutes * 1.5),
          reason: `Low accuracy (${avgAccuracy.toFixed(1)}%). Increasing delay to reduce false positives.`
        };
      } else if (avgResolutionTime > rule.escalation_delay_minutes * rule.max_escalation_level * 2) {
        recommendation = {
          action: 'increase_max_level',
          current_max: rule.max_escalation_level,
          suggested_max: rule.max_escalation_level + 1,
          reason: `High resolution time (${avgResolutionTime.toFixed(0)}min). Adding escalation level.`
        };
      } else if (totalFalsePositives > totalMissedAlerts * 2) {
        recommendation = {
          action: 'increase_delay',
          current_delay: rule.escalation_delay_minutes,
          suggested_delay: rule.escalation_delay_minutes + 15,
          reason: `High false positive rate. Increasing delay to improve accuracy.`
        };
      } else if (totalMissedAlerts > totalFalsePositives * 2) {
        recommendation = {
          action: 'decrease_delay',
          current_delay: rule.escalation_delay_minutes,
          suggested_delay: Math.max(5, rule.escalation_delay_minutes - 10),
          reason: `High missed alert rate. Decreasing delay for faster response.`
        };
      } else if (avgAccuracy > 90 && avgResolutionTime < rule.escalation_delay_minutes) {
        recommendation = {
          action: 'optimize_performing_well',
          message: `Rule performing excellently (${avgAccuracy.toFixed(1)}% accuracy). No changes needed.`
        };
      }

      if (recommendation) {
        optimizations.push({
          rule_id: rule.id,
          rule_name: rule.alert_context,
          metrics: {
            avgAccuracy: avgAccuracy.toFixed(2),
            avgResolutionTime: avgResolutionTime.toFixed(0),
            falsePositives: totalFalsePositives,
            missedAlerts: totalMissedAlerts,
          },
          recommendation,
        });

        // Update metrics table with recommendation
        await supabase
          .from('escalation_performance_metrics')
          .insert({
            rule_id: rule.id,
            metric_date: new Date().toISOString().split('T')[0],
            recommendation: recommendation,
            escalation_accuracy: avgAccuracy,
            avg_resolution_time_minutes: avgResolutionTime,
            false_positives: totalFalsePositives,
            missed_alerts: totalMissedAlerts,
          });

        // Auto-apply optimizations if accuracy is critically low
        if (avgAccuracy < 50 && recommendation.action !== 'optimize_performing_well') {
          console.log(`Auto-applying optimization for rule ${rule.id} due to low accuracy`);
          
          const updates: any = {};
          
          if (recommendation.action === 'adjust_delay' || recommendation.action === 'increase_delay') {
            updates.escalation_delay_minutes = recommendation.suggested_delay;
          } else if (recommendation.action === 'decrease_delay') {
            updates.escalation_delay_minutes = recommendation.suggested_delay;
          } else if (recommendation.action === 'increase_max_level') {
            updates.max_escalation_level = recommendation.suggested_max;
          }

          if (Object.keys(updates).length > 0) {
            await supabase
              .from('alert_escalation_rules')
              .update(updates)
              .eq('id', rule.id);
            
            console.log(`Applied auto-optimization to rule ${rule.id}:`, updates);
          }
        }
      }
    }

    // Store optimization results as ML prediction
    await supabase
      .from('ml_predictions')
      .insert({
        prediction_type: 'escalation_optimization',
        prediction_data: {
          optimizations,
          totalRulesAnalyzed: rules?.length || 0,
          rulesOptimized: optimizations.length,
          timestamp: new Date().toISOString(),
        },
        confidence_score: 0.9,
        model_version: 'v1.0-rule-optimizer',
        context: 'automated_optimization',
      });

    console.log(`[Escalation Optimizer] Analyzed ${rules?.length || 0} rules, generated ${optimizations.length} recommendations`);

    return new Response(
      JSON.stringify({ 
        success: true,
        optimizations,
        summary: {
          totalRules: rules?.length || 0,
          rulesWithRecommendations: optimizations.length,
          autoApplied: optimizations.filter(o => o.metrics.avgAccuracy < 50).length,
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Escalation Optimizer error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        success: false 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});