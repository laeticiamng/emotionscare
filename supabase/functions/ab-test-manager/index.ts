// @ts-nocheck
/**
 * ab-test-manager - Gestion des tests A/B
 *
 * 🔒 SÉCURISÉ: Auth admin + Rate limit 10/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

serve(async (req) => {
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  if (!corsResult.allowed) {
    return rejectCors(corsResult);
  }

  const { user, status } = await authorizeRole(req, ['admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'ab-test-manager',
    userId: user.id,
    limit: 10,
    windowMs: 60_000,
    description: 'A/B test manager - Admin only',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  try {
    const { action, test_id } = await req.json();

    if (!action || (action !== 'analyze_all' && !test_id)) {
      return new Response(
        JSON.stringify({ error: 'action et test_id requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (action === 'analyze_all') {
      // Analyser tous les tests en cours
      const { data: runningTests, error: testsError } = await supabase
        .from('ab_test_configurations')
        .select('*')
        .eq('status', 'running');

      if (testsError) throw testsError;

      const analysisResults = [];
      for (const test of runningTests || []) {
        const result = await analyzeTest(supabase, test.id);
        analysisResults.push(result);
      }

      return new Response(
        JSON.stringify({ 
          analyzed_tests: analysisResults.length,
          results: analysisResults 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'analyze') {
      const result = await analyzeTest(supabase, test_id);
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'select_winner') {
      const result = await selectWinner(supabase, test_id);
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Action non reconnue' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AB test manager error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur AB test manager' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function analyzeTest(supabase: any, testId: string) {
  // Récupérer le test
  const { data: test, error: testError } = await supabase
    .from('ab_test_configurations')
    .select('*')
    .eq('id', testId)
    .single();

  if (testError || !test) {
    throw new Error('Test non trouvé');
  }

  // Récupérer les résultats
  const { data: results, error: resultsError } = await supabase
    .from('ab_test_results')
    .select('*')
    .eq('test_id', testId);

  if (resultsError) throw resultsError;

  // Calculer les métriques pour chaque variant
  const controlResults = results?.filter(r => r.variant === 'control') || [];
  const variantResults = results?.filter(r => r.variant === 'variant') || [];

  const controlMetrics = calculateMetrics(controlResults);
  const variantMetrics = calculateMetrics(variantResults);

  // Calculer la significativité statistique
  const sampleSize = Math.min(controlResults.length, variantResults.length);
  const hasMinSample = sampleSize >= (test.min_sample_size || 100);

  let winner = 'inconclusive';
  let confidence = 0;

  if (hasMinSample) {
    // Test de significativité (approximation simple)
    const resolutionRateDiff = Math.abs(variantMetrics.resolution_rate - controlMetrics.resolution_rate);
    const avgResolutionTimeDiff = Math.abs(variantMetrics.avg_resolution_time - controlMetrics.avg_resolution_time);

    // Score combiné (plus le taux de résolution est élevé et le temps court, mieux c'est)
    const controlScore = controlMetrics.resolution_rate * 100 - controlMetrics.avg_resolution_time / 60;
    const variantScore = variantMetrics.resolution_rate * 100 - variantMetrics.avg_resolution_time / 60;

    const scoreDiff = Math.abs(variantScore - controlScore);
    confidence = Math.min(scoreDiff / 20, 1); // Normaliser entre 0 et 1

    if (confidence >= (test.confidence_level || 0.95)) {
      winner = variantScore > controlScore ? 'variant' : 'control';
    }
  }

  // Mettre à jour le test avec les résultats
  await supabase
    .from('ab_test_configurations')
    .update({
      metadata: {
        ...test.metadata,
        last_analysis: new Date().toISOString(),
        control_metrics: controlMetrics,
        variant_metrics: variantMetrics,
        sample_size: sampleSize,
        has_min_sample: hasMinSample,
        current_winner: winner,
        confidence
      }
    })
    .eq('id', testId);

  const isSignificant = hasMinSample && confidence >= (test.confidence_level || 0.95);
  
  // Send notification if significant
  if (isSignificant && winner !== 'inconclusive') {
    try {
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
        },
        body: JSON.stringify({
          event_type: 'ab_test_significant',
          title: `Test A/B Significatif: ${test.name}`,
          message: `Le test "${test.name}" a atteint la significativité statistique. Le ${winner === 'control' ? 'contrôle' : 'variant'} est significativement meilleur (confiance: ${(confidence * 100).toFixed(1)}%)`,
          severity: 'success',
          data: {
            'Test': test.name,
            'Gagnant': winner === 'control' ? 'Contrôle' : 'Variant',
            'Confiance': `${(confidence * 100).toFixed(1)}%`,
            'Taux contrôle': `${(controlMetrics.resolution_rate * 100).toFixed(1)}%`,
            'Taux variant': `${(variantMetrics.resolution_rate * 100).toFixed(1)}%`,
            'Échantillon': sampleSize.toString()
          }
        })
      });
      console.log('Notification sent for significant A/B test');
    } catch (notifError) {
      console.error('Failed to send notification:', notifError);
    }

    // ─────────────────────────────────────────────────────────────
    // INTÉGRATION PROACTIVE: Détecter résultats négatifs significatifs
    // ─────────────────────────────────────────────────────────────
    const performanceImprovement = ((variantScore - controlScore) / Math.abs(controlScore)) * 100;
    const isNegativeSignificant = isSignificant && performanceImprovement < -10; // -10% ou pire
    
    if (isNegativeSignificant) {
      try {
        console.log('Detected significant negative A/B test result, generating incident report...');
        await supabase.functions.invoke('generate-incident-report', {
          body: {
            title: `Test A/B Négatif Significatif: ${test.test_name}`,
            severity: performanceImprovement < -20 ? 'high' : 'medium',
            affectedSystems: ['A/B Testing System', test.variant_name],
            impactDescription: `Le test A/B "${test.test_name}" montre une dégradation significative de performance de ${performanceImprovement.toFixed(1)}% avec une confiance de ${(confidence * 100).toFixed(1)}%. Le variant ${test.variant_name} performe significativement moins bien que le contrôle.`
          }
        });
        console.log('Incident report generation triggered for negative A/B test');
      } catch (incidentError) {
        console.error('Failed to generate incident report for negative test:', incidentError);
      }
    }
  }

  return {
    test_id: testId,
    test_name: test.name,
    sample_size: sampleSize,
    has_min_sample: hasMinSample,
    control_metrics: controlMetrics,
    variant_metrics: variantMetrics,
    winner,
    confidence,
    recommendation: hasMinSample 
      ? (confidence >= (test.confidence_level || 0.95) 
          ? `Le variant ${winner} est significativement meilleur (confiance: ${(confidence * 100).toFixed(1)}%)`
          : 'Différence non significative, continuer le test')
      : `Échantillon insuffisant (${sampleSize}/${test.min_sample_size || 100})`
  };
}

function calculateMetrics(results: any[]) {
  const total = results.length;
  if (total === 0) {
    return {
      total: 0,
      resolved: 0,
      resolution_rate: 0,
      avg_resolution_time: 0,
      avg_escalations: 0
    };
  }

  const resolved = results.filter(r => r.resolved).length;
  const avgResolutionTime = results
    .filter(r => r.resolution_time_minutes)
    .reduce((sum, r) => sum + r.resolution_time_minutes, 0) / (resolved || 1);
  const avgEscalations = results.reduce((sum, r) => sum + (r.escalation_count || 0), 0) / total;

  return {
    total,
    resolved,
    resolution_rate: resolved / total,
    avg_resolution_time: avgResolutionTime,
    avg_escalations: avgEscalations
  };
}

async function selectWinner(supabase: any, testId: string) {
  // Analyser d'abord
  const analysis = await analyzeTest(supabase, testId);

  if (analysis.winner === 'inconclusive') {
    throw new Error('Impossible de sélectionner un gagnant : résultats non concluants');
  }

  // Récupérer le test
  const { data: test } = await supabase
    .from('ab_test_configurations')
    .select('*, control_rule_id, variant_rule_id')
    .eq('id', testId)
    .single();

  // Marquer le test comme complété avec le gagnant
  await supabase
    .from('ab_test_configurations')
    .update({
      status: 'completed',
      winner: analysis.winner,
      end_date: new Date().toISOString()
    })
    .eq('id', testId);

  // Appliquer automatiquement la règle gagnante
  const winningRuleId = analysis.winner === 'control' ? test.control_rule_id : test.variant_rule_id;
  const losingRuleId = analysis.winner === 'control' ? test.variant_rule_id : test.control_rule_id;

  // Désactiver la règle perdante si elle existe
  if (losingRuleId) {
    await supabase
      .from('alert_escalation_rules')
      .update({ is_active: false })
      .eq('id', losingRuleId);
  }

  // S'assurer que la règle gagnante est active
  if (winningRuleId) {
    await supabase
      .from('alert_escalation_rules')
      .update({ is_active: true })
      .eq('id', winningRuleId);
  }

  return {
    success: true,
    winner: analysis.winner,
    confidence: analysis.confidence,
    winning_rule_id: winningRuleId,
    metrics: analysis.winner === 'control' ? analysis.control_metrics : analysis.variant_metrics,
    message: `Test complété : ${analysis.winner} sélectionné et appliqué automatiquement`
  };
}