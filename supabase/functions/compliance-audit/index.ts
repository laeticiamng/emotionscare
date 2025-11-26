// @ts-nocheck
/**
 * compliance-audit - Audits de conformité RGPD
 *
 * 🔒 SÉCURISÉ: Auth admin + Rate limit 5/min + CORS restrictif
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { withMonitoring } from '../_shared/monitoring-wrapper.ts';
import { sendAlert, checkComplianceThreshold } from '../_shared/alert-notifier.ts';
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

const handler = withMonitoring('compliance-audit', async (req) => {
  // 1. CORS check
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  // Vérification CORS stricte
  if (!corsResult.allowed) {
    console.warn('[compliance-audit] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  // 2. 🔒 SÉCURITÉ: Auth admin obligatoire
  const { user, status } = await authorizeRole(req, ['admin']);
  if (!user) {
    console.warn('[compliance-audit] Unauthorized access attempt');
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 3. 🛡️ Rate limiting strict
  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'compliance-audit',
    userId: user.id,
    limit: 5,
    windowMs: 60_000,
    description: 'Compliance audit - Admin only',
  });

  if (!rateLimit.allowed) {
    console.warn('[compliance-audit] Rate limit exceeded', { userId: user.id });
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  console.log(`[compliance-audit] Processing for admin: ${user.id}`);

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user } } = await supabaseClient.auth.getUser(
      req.headers.get('Authorization')?.replace('Bearer ', '')
    );

    const url = new URL(req.url);
    const action = url.pathname.split('/').filter(Boolean).pop();

    // POST /compliance-audit/run - Lancer un audit
    if (req.method === 'POST' && action === 'run') {
      console.log('[Audit] Starting compliance audit...');

      // Créer l'audit
      const { data: audit, error: auditError } = await supabaseClient
        .from('compliance_audits')
        .insert({
          status: 'in_progress',
          audit_type: 'automatic',
          triggered_by: user?.id,
        })
        .select()
        .single();

      if (auditError) throw auditError;

      console.log(`[Audit] Created audit ${audit.id}`);

      // Récupérer les catégories actives
      const { data: categories, error: categoriesError } = await supabaseClient
        .from('compliance_categories')
        .select('*')
        .eq('is_active', true);

      if (categoriesError) throw categoriesError;

      let totalWeightedScore = 0;
      let totalWeight = 0;
      const recommendations: any[] = [];

      // Exécuter les audits par catégorie
      for (const category of categories) {
        console.log(`[Audit] Auditing category: ${category.code}`);

        let result: any = { score: 0, max_score: 100, checks_passed: 0, checks_total: 0, findings: [] };

        try {
          // Exécuter la fonction d'audit spécifique
          const functionName = `audit_${category.code}_compliance`;
          const { data: auditResult, error: auditFuncError } = await supabaseClient
            .rpc(functionName);

          if (auditFuncError) {
            console.warn(`[Audit] No audit function for ${category.code}:`, auditFuncError);
          } else if (auditResult) {
            result = auditResult;
          }
        } catch (error) {
          console.error(`[Audit] Error auditing ${category.code}:`, error);
        }

        // Enregistrer le score
        await supabaseClient
          .from('compliance_scores')
          .insert({
            audit_id: audit.id,
            category_id: category.id,
            score: result.score,
            max_score: result.max_score,
            checks_passed: result.checks_passed,
            checks_total: result.checks_total,
            findings: result.findings,
          });

        totalWeightedScore += result.score * category.weight;
        totalWeight += category.weight;

        // Générer des recommandations si le score est faible
        if (result.score < 80) {
          recommendations.push(...generateRecommendations(audit.id, category, result));
        }
      }

      // Calculer le score global
      const overallScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

      // Vérifier les seuils et envoyer alertes si nécessaire
      await checkComplianceThreshold(
        'overall_compliance_score',
        overallScore,
        80, // Seuil: 80%
        'compliance-audit',
        { audit_id: audit.id, categories: categories.length }
      );

      // Alerte critique si score < 60
      if (overallScore < 60) {
        await sendAlert({
          severity: 'critical',
          title: 'Score de conformité RGPD critique',
          message: `Le score global de conformité est de ${overallScore.toFixed(1)}%, en dessous du seuil critique de 60%.`,
          functionName: 'compliance-audit',
          context: {
            audit_id: audit.id,
            overall_score: overallScore,
            recommendations_count: recommendations.length,
          },
        });
      }

      // Enregistrer les recommandations
      if (recommendations.length > 0) {
        await supabaseClient
          .from('compliance_recommendations')
          .insert(recommendations);
      }

      // Mettre à jour l'audit
      await supabaseClient
        .from('compliance_audits')
        .update({
          status: 'completed',
          overall_score: overallScore,
          completed_at: new Date().toISOString(),
        })
        .eq('id', audit.id);

      console.log(`[Audit] Completed with score: ${overallScore.toFixed(2)}/100`);

      return new Response(JSON.stringify({
        success: true,
        audit_id: audit.id,
        overall_score: overallScore,
        recommendations_count: recommendations.length,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /compliance-audit/latest - Récupérer le dernier audit
    if (req.method === 'GET' && action === 'latest') {
      const { data, error } = await supabaseClient
        .rpc('get_latest_compliance_audit');

      if (error) throw error;

      return new Response(JSON.stringify(data?.[0] || null), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /compliance-audit/history - Historique des audits
    if (req.method === 'GET' && action === 'history') {
      const limit = parseInt(url.searchParams.get('limit') || '10');

      const { data, error } = await supabaseClient
        .from('compliance_audits')
        .select('*')
        .order('audit_date', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return new Response(JSON.stringify({ audits: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[Audit] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateRecommendations(auditId: string, category: any, result: any): any[] {
  const recommendations: any[] = [];
  const score = result.score;

  switch (category.code) {
    case 'consent':
      if (score < 50) {
        recommendations.push({
          audit_id: auditId,
          category_id: category.id,
          severity: 'critical',
          priority: 100,
          title: 'Taux de consentement critique',
          description: 'Moins de 50% des utilisateurs ont donné leur consentement.',
          impact: 'Non-conformité RGPD majeure. Risque de sanctions importantes.',
          remediation: '1. Réviser le processus d\'opt-in\n2. Améliorer la communication\n3. Simplifier les choix de consentement',
        });
      } else if (score < 80) {
        recommendations.push({
          audit_id: auditId,
          category_id: category.id,
          severity: 'high',
          priority: 80,
          title: 'Optimiser le taux de consentement',
          description: 'Le taux de consentement peut être amélioré.',
          impact: 'Opportunité d\'amélioration de la conformité.',
          remediation: 'Analyser les motifs de refus et optimiser l\'expérience utilisateur',
        });
      }
      break;

    case 'retention':
      if (score < 60) {
        recommendations.push({
          audit_id: auditId,
          category_id: category.id,
          severity: 'high',
          priority: 90,
          title: 'Politiques de rétention insuffisantes',
          description: 'Nombre insuffisant de règles de rétention des données.',
          impact: 'Risque de conservation excessive des données personnelles.',
          remediation: 'Définir et implémenter des règles de rétention pour toutes les catégories de données',
        });
      }
      break;

    case 'user_rights':
      if (score < 70) {
        recommendations.push({
          audit_id: auditId,
          category_id: category.id,
          severity: 'high',
          priority: 85,
          title: 'Délais d\'export trop longs',
          description: 'Les demandes d\'export prennent plus de 7 jours en moyenne.',
          impact: 'Non-respect du délai RGPD de 30 jours, insatisfaction utilisateurs.',
          remediation: 'Automatiser davantage le processus d\'export et allouer des ressources',
        });
      }
      break;

    case 'security':
      if (score < 70) {
        recommendations.push({
          audit_id: auditId,
          category_id: category.id,
          severity: 'critical',
          priority: 100,
          title: 'Anomalies de sécurité critiques',
          description: 'Des anomalies critiques d\'accès aux données ne sont pas résolues.',
          impact: 'Risque de violation de données et de non-conformité.',
          remediation: 'Traiter immédiatement toutes les anomalies critiques et renforcer la surveillance',
        });
      }
      break;
  }

  return recommendations;
}

serve(handler);
