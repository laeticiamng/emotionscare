// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const ALLOWED_ORIGINS = [
  'https://emotionscare.com',
  'https://www.emotionscare.com',
  'https://emotions-care.lovable.app',
  'http://localhost:5173',
];

function getCorsHeaders(req) {
  const origin = req.headers.get('origin') ?? '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

/**
 * Proactive Incident Detector
 * 
 * Cette fonction surveille les alertes critiques et déclenche automatiquement :
 * 1. Génération de rapport d'incident avec analyse ML
 * 2. Création de ticket si nécessaire
 * 3. Notifications aux administrateurs
 * 
 * Déclenchée par :
 * - Nouvelle alerte critique détectée
 * - Escalade niveau 3+
 * - Test A/B avec résultat significatif négatif
 */

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get request body (peut être vide si appelé par cron)
    const body = await req.json().catch(() => ({}));
    console.log('Proactive detector triggered', body);

    // ─────────────────────────────────────────────────────────────
    // 1. DÉTECTER LES ALERTES CRITIQUES NON TRAITÉES
    // ─────────────────────────────────────────────────────────────

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    const { data: criticalAlerts, error: alertsError } = await supabase
      .from('unified_alerts')
      .select('*')
      .eq('severity', 'critical')
      .gte('created_at', fifteenMinutesAgo.toISOString())
      .is('acknowledged', false)
      .order('created_at', { ascending: false });

    if (alertsError) {
      console.error('Error fetching critical alerts:', alertsError);
    }

    console.log(`Found ${criticalAlerts?.length || 0} unacknowledged critical alerts`);

    // ─────────────────────────────────────────────────────────────
    // 2. DÉTECTER LES ESCALADES CRITIQUES
    // ─────────────────────────────────────────────────────────────

    const { data: criticalEscalations, error: escalationsError } = await supabase
      .from('active_escalations')
      .select('*, unified_alerts(*)')
      .gte('escalation_level', 3)
      .eq('status', 'active')
      .gte('started_at', fifteenMinutesAgo.toISOString());

    if (escalationsError) {
      console.error('Error fetching critical escalations:', escalationsError);
    }

    console.log(`Found ${criticalEscalations?.length || 0} critical escalations`);

    // ─────────────────────────────────────────────────────────────
    // 3. DÉTECTER LES TESTS A/B AVEC RÉSULTATS NÉGATIFS SIGNIFICATIFS
    // ─────────────────────────────────────────────────────────────

    const { data: negativeTests, error: testsError } = await supabase
      .from('ab_test_configurations')
      .select('*')
      .eq('status', 'running')
      .gte('created_at', fifteenMinutesAgo.toISOString());

    if (testsError) {
      console.error('Error fetching A/B tests:', testsError);
    }

    // Filter tests with negative performance
    const problematicTests = negativeTests?.filter(test => {
      const metadata = test.metadata || {};
      const confidence = metadata.confidence || 0;
      const improvement = metadata.performance_improvement || 0;
      
      // Test significatif (confiance > 95%) MAIS amélioration négative
      return confidence >= test.confidence_level && improvement < -10;
    }) || [];

    console.log(`Found ${problematicTests.length} A/B tests with negative significant results`);

    // ─────────────────────────────────────────────────────────────
    // 4. VÉRIFIER SI DES INCIDENTS EXISTENT DÉJÀ
    // ─────────────────────────────────────────────────────────────

    const allAlertIds = [
      ...(criticalAlerts?.map(a => a.id) || []),
      ...(criticalEscalations?.flatMap(e => e.unified_alerts?.id ? [e.unified_alerts.id] : []) || [])
    ];

    const { data: existingIncidents } = await supabase
      .from('incident_reports')
      .select('related_alert_ids')
      .in('status', ['open', 'investigating']);

    const processedAlertIds = new Set(
      existingIncidents?.flatMap(i => i.related_alert_ids || []) || []
    );

    // ─────────────────────────────────────────────────────────────
    // 5. GÉNÉRER DES RAPPORTS D'INCIDENT POUR NOUVEAUX PROBLÈMES
    // ─────────────────────────────────────────────────────────────

    const incidentsCreated = [];
    const errors = [];

    // Traiter les alertes critiques
    for (const alert of criticalAlerts || []) {
      if (processedAlertIds.has(alert.id)) {
        console.log(`Alert ${alert.id} already has an incident report, skipping`);
        continue;
      }

      try {
        console.log(`Generating incident report for critical alert: ${alert.id}`);
        
        const { data: incidentData, error: incidentError } = await supabase.functions.invoke(
          'generate-incident-report',
          {
            body: {
              title: `Alerte Critique: ${alert.alert_type}`,
              severity: 'critical',
              alertId: alert.id,
              affectedSystems: [alert.source || 'Unknown'],
              impactDescription: alert.message || 'Alerte critique détectée automatiquement'
            }
          }
        );

        if (incidentError) {
          console.error('Error generating incident:', incidentError);
          errors.push({ alertId: alert.id, error: incidentError.message });
        } else {
          incidentsCreated.push({
            alertId: alert.id,
            incidentId: incidentData.incidentId,
            type: 'critical_alert'
          });

          // Créer un ticket automatiquement si recommandé
          if (incidentData.analysis?.corrective_actions?.length > 0) {
            try {
              await supabase.functions.invoke('create-ticket', {
                body: {
                  title: `[AUTO] ${incidentData.report.title}`,
                  description: `Incident automatique détecté\n\nRoot Cause:\n${incidentData.analysis.root_cause}\n\nActions recommandées:\n${incidentData.analysis.corrective_actions.join('\n')}`,
                  priority: 'high',
                  category: 'incident',
                  metadata: {
                    incidentId: incidentData.incidentId,
                    alertId: alert.id,
                    autoGenerated: true,
                    mlConfidence: incidentData.analysis.confidence
                  }
                }
              });
              console.log(`Ticket auto-created for incident ${incidentData.incidentId}`);
            } catch (ticketError) {
              console.error('Error creating ticket:', ticketError);
            }
          }
        }
      } catch (error) {
        console.error(`Failed to process alert ${alert.id}:`, error);
        errors.push({ alertId: alert.id, error: error.message });
      }
    }

    // Traiter les escalades critiques
    for (const escalation of criticalEscalations || []) {
      const alertId = escalation.unified_alerts?.id;
      if (!alertId || processedAlertIds.has(alertId)) {
        continue;
      }

      try {
        console.log(`Generating incident report for escalation: ${escalation.id}`);
        
        const { data: incidentData, error: incidentError } = await supabase.functions.invoke(
          'generate-incident-report',
          {
            body: {
              title: `Escalade Niveau ${escalation.escalation_level}: ${escalation.unified_alerts?.alert_type || 'Unknown'}`,
              severity: escalation.escalation_level >= 4 ? 'critical' : 'high',
              alertId: alertId,
              escalationId: escalation.id,
              affectedSystems: [escalation.unified_alerts?.source || 'Unknown'],
              impactDescription: `Escalation de niveau ${escalation.escalation_level} détectée`
            }
          }
        );

        if (!incidentError) {
          incidentsCreated.push({
            escalationId: escalation.id,
            incidentId: incidentData.incidentId,
            type: 'critical_escalation'
          });
        }
      } catch (error) {
        console.error(`Failed to process escalation ${escalation.id}:`, error);
        errors.push({ escalationId: escalation.id, error: error.message });
      }
    }

    // Traiter les tests A/B problématiques
    for (const test of problematicTests) {
      try {
        console.log(`Generating incident report for negative A/B test: ${test.test_name}`);
        
        const { data: incidentData, error: incidentError } = await supabase.functions.invoke(
          'generate-incident-report',
          {
            body: {
              title: `Test A/B Négatif: ${test.test_name}`,
              severity: 'medium',
              affectedSystems: ['A/B Testing System', test.variant_name],
              impactDescription: `Test A/B ${test.test_name} montre une dégradation significative de performance (${test.metadata?.performance_improvement}%) avec confiance ${test.metadata?.confidence}%`
            }
          }
        );

        if (!incidentError) {
          incidentsCreated.push({
            testId: test.id,
            incidentId: incidentData.incidentId,
            type: 'negative_ab_test'
          });

          // Notifier via send-notification
          await supabase.functions.invoke('send-notification', {
            body: {
              title: `⚠️ Test A/B avec résultat négatif significatif`,
              message: `${test.test_name}: Performance -${Math.abs(test.metadata?.performance_improvement || 0)}%`,
              type: 'ab_test_alert',
              severity: 'high',
              metadata: {
                testName: test.test_name,
                improvement: test.metadata?.performance_improvement,
                confidence: test.metadata?.confidence,
                incidentId: incidentData.incidentId
              }
            }
          });
        }
      } catch (error) {
        console.error(`Failed to process A/B test ${test.id}:`, error);
        errors.push({ testId: test.id, error: error.message });
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 6. RÉSUMÉ ET RETOUR
    // ─────────────────────────────────────────────────────────────

    const summary = {
      timestamp: new Date().toISOString(),
      alertsScanned: criticalAlerts?.length || 0,
      escalationsScanned: criticalEscalations?.length || 0,
      testsScanned: negativeTests?.length || 0,
      problematicTests: problematicTests.length,
      incidentsCreated: incidentsCreated.length,
      errors: errors.length,
      details: {
        incidents: incidentsCreated,
        errors: errors.length > 0 ? errors : undefined
      }
    };

    console.log('Proactive detection summary:', JSON.stringify(summary, null, 2));

    // Envoyer notification récapitulative si des incidents ont été créés
    if (incidentsCreated.length > 0) {
      try {
        await supabase.functions.invoke('send-notification', {
          body: {
            title: `🤖 Détection Proactive: ${incidentsCreated.length} incident(s) détecté(s)`,
            message: `Rapports générés automatiquement avec analyse ML. Consultez /admin/incidents pour plus de détails.`,
            type: 'proactive_detection',
            severity: 'info',
            metadata: {
              incidentsCount: incidentsCreated.length,
              timestamp: new Date().toISOString()
            }
          }
        });
      } catch (notifError) {
        console.error('Error sending summary notification:', notifError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        summary
      }),
      { 
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in proactive incident detector:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
