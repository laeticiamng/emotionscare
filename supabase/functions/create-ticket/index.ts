// @ts-nocheck
/**
 * create-ticket - Création automatique de tickets Jira/Linear
 *
 * 🔒 SÉCURISÉ: Auth admin + Rate limit 10/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

serve(async (req) => {
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
    console.warn('[create-ticket] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  // 2. 🔒 SÉCURITÉ: Auth admin obligatoire
  const { user, status } = await authorizeRole(req, ['b2b_admin', 'admin']);
  if (!user) {
    console.warn('[create-ticket] Unauthorized access attempt');
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 3. 🛡️ Rate limiting strict
  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'create-ticket',
    userId: user.id,
    limit: 10,
    windowMs: 60_000,
    description: 'Ticket creation - Admin only',
  });

  if (!rateLimit.allowed) {
    console.warn('[create-ticket] Rate limit exceeded', { userId: user.id });
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  console.log(`[create-ticket] Processing for admin: ${user.id}`);

  try {
    const { alert_id, integration_id } = await req.json();

    if (!alert_id || !integration_id) {
      return new Response(
        JSON.stringify({ error: 'alert_id et integration_id requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Récupérer l'alerte
    const { data: alert, error: alertError } = await supabase
      .from('unified_alerts')
      .select('*')
      .eq('id', alert_id)
      .single();

    if (alertError || !alert) {
      throw new Error('Alerte non trouvée');
    }

    // Récupérer l'intégration
    const { data: integration, error: integrationError } = await supabase
      .from('ticket_integrations')
      .select('*')
      .eq('id', integration_id)
      .eq('is_active', true)
      .single();

    if (integrationError || !integration) {
      throw new Error('Intégration non trouvée ou inactive');
    }

    // Récupérer les patterns ML pour assignation intelligente
    const { data: patterns } = await supabase
      .from('error_patterns_history')
      .select('*')
      .eq('error_type', alert.error_type)
      .order('occurred_at', { ascending: false })
      .limit(10);

    // Analyser les patterns avec l'IA pour suggérer un assignee
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    let suggestedAssignee = integration.default_assignee;
    let mlConfidence = 0.5;

    if (LOVABLE_API_KEY && patterns && patterns.length > 0) {
      const analysisPrompt = `Analyse ces patterns d'erreurs similaires et suggère le meilleur assignee:

Patterns historiques: ${JSON.stringify(patterns, null, 2)}
Alerte actuelle: ${JSON.stringify(alert, null, 2)}

Réponds uniquement au format JSON avec:
{
  "suggested_assignee": "nom_assignee",
  "confidence": 0.0-1.0,
  "reasoning": "explication courte"
}`;

      try {
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: 'Tu es un expert en assignation de tickets basée sur l\'analyse de patterns ML. Réponds uniquement en JSON.' },
              { role: 'user', content: analysisPrompt }
            ],
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const aiContent = aiData.choices[0].message.content;
          const parsed = JSON.parse(aiContent);
          suggestedAssignee = parsed.suggested_assignee || integration.default_assignee;
          mlConfidence = parsed.confidence || 0.5;
        }
      } catch (error) {
        console.error('ML assignation error:', error);
      }
    }

    // Créer le ticket selon le type d'intégration
    let ticketKey = '';
    let ticketUrl = '';

    if (integration.integration_type === 'jira') {
      // Créer un ticket Jira
      const jiraPayload = {
        fields: {
          project: { key: integration.project_key },
          summary: `[${alert.severity.toUpperCase()}] ${alert.alert_type}: ${alert.message.substring(0, 100)}`,
          description: `Alerte escaladée automatiquement\n\n*Détails:*\n- Type: ${alert.alert_type}\n- Sévérité: ${alert.severity}\n- Niveau d'escalade: ${alert.escalation_level || 0}\n- Message: ${alert.message}\n- Timestamp: ${alert.timestamp}\n\n*Analyse ML:*\nAssignee suggéré: ${suggestedAssignee} (confiance: ${(mlConfidence * 100).toFixed(0)}%)\n\n*Patterns détectés:*\n${patterns ? patterns.length + ' occurrences similaires trouvées' : 'Aucun pattern similaire'}`,
          issuetype: { name: 'Bug' },
          priority: { name: alert.severity === 'critical' ? 'Highest' : alert.severity === 'high' ? 'High' : 'Medium' },
          assignee: suggestedAssignee ? { name: suggestedAssignee } : undefined,
          ...integration.custom_fields
        }
      };

      const jiraResponse = await fetch(`${integration.api_url}/rest/api/3/issue`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${integration.api_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jiraPayload)
      });

      if (!jiraResponse.ok) {
        const errorText = await jiraResponse.text();
        throw new Error(`Erreur Jira: ${jiraResponse.status} - ${errorText}`);
      }

      const jiraData = await jiraResponse.json();
      ticketKey = jiraData.key;
      ticketUrl = `${integration.api_url}/browse/${jiraData.key}`;

    } else if (integration.integration_type === 'linear') {
      // Créer un ticket Linear via GraphQL
      const linearMutation = `
        mutation CreateIssue($input: IssueCreateInput!) {
          issueCreate(input: $input) {
            success
            issue {
              id
              identifier
              url
            }
          }
        }
      `;

      const linearPayload = {
        query: linearMutation,
        variables: {
          input: {
            teamId: integration.project_key,
            title: `[${alert.severity.toUpperCase()}] ${alert.alert_type}: ${alert.message.substring(0, 100)}`,
            description: `Alerte escaladée automatiquement\n\nDétails:\n- Type: ${alert.alert_type}\n- Sévérité: ${alert.severity}\n- Niveau d'escalade: ${alert.escalation_level || 0}\n- Message: ${alert.message}\n- Timestamp: ${alert.timestamp}\n\nAnalyse ML:\nAssignee suggéré: ${suggestedAssignee} (confiance: ${(mlConfidence * 100).toFixed(0)}%)\n\nPatterns: ${patterns ? patterns.length + ' occurrences similaires' : 'Aucun pattern similaire'}`,
            priority: alert.severity === 'critical' ? 1 : alert.severity === 'high' ? 2 : 3,
            assigneeId: suggestedAssignee || undefined,
          }
        }
      };

      const linearResponse = await fetch(integration.api_url || 'https://api.linear.app/graphql', {
        method: 'POST',
        headers: {
          'Authorization': integration.api_token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(linearPayload)
      });

      if (!linearResponse.ok) {
        const errorText = await linearResponse.text();
        throw new Error(`Erreur Linear: ${linearResponse.status} - ${errorText}`);
      }

      const linearData = await linearResponse.json();
      if (linearData.data?.issueCreate?.success) {
        ticketKey = linearData.data.issueCreate.issue.identifier;
        ticketUrl = linearData.data.issueCreate.issue.url;
      } else {
        throw new Error('Échec de création du ticket Linear');
      }
    }

    // Enregistrer le ticket créé
    const { data: createdTicket, error: ticketError } = await supabase
      .from('auto_created_tickets')
      .insert({
        alert_id,
        integration_id,
        ticket_key: ticketKey,
        ticket_url: ticketUrl,
        assigned_to: suggestedAssignee,
        status: 'open',
        ml_suggested_assignee: suggestedAssignee,
        ml_confidence: mlConfidence,
        pattern_analysis: {
          similar_patterns_count: patterns?.length || 0,
          patterns_summary: patterns?.slice(0, 3).map(p => ({
            error_type: p.error_type,
            occurred_at: p.occurred_at
          }))
        }
      })
      .select()
      .single();

    if (ticketError) {
      console.error('Error saving ticket:', ticketError);
    }

    console.log(`Ticket créé: ${ticketKey} (ID: ${createdTicket?.id})`);

    // ─────────────────────────────────────────────────────────────
    // INTÉGRATION PROACTIVE: Générer rapport d'incident si critique
    // ─────────────────────────────────────────────────────────────
    if (alert.severity === 'critical') {
      try {
        console.log('Generating incident report for critical alert...');
        await supabase.functions.invoke('generate-incident-report', {
          body: {
            title: `Alerte Critique: ${alert.alert_type}`,
            severity: 'critical',
            alertId: alert.id,
            affectedSystems: [alert.source || 'Unknown'],
            impactDescription: alert.message || 'Alerte critique avec création automatique de ticket'
          }
        });
        console.log('Incident report generation triggered');
      } catch (incidentError) {
        console.error('Failed to generate incident report:', incidentError);
        // Non-bloquant: le ticket est créé même si l'incident échoue
      }
    }

    // Send notification
    try {
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
        },
        body: JSON.stringify({
          event_type: 'ticket_created',
          title: 'Ticket Créé Automatiquement',
          message: `Un ticket ${ticketKey} a été créé dans ${integration.integration_type.toUpperCase()} et assigné à ${suggestedAssignee}`,
          severity: 'info',
          data: {
            'Ticket': ticketKey,
            'Assigné à': suggestedAssignee,
            'Confiance ML': `${(mlConfidence * 100).toFixed(0)}%`,
            'Intégration': integration.name,
            'URL': ticketUrl
          }
        })
      });
      console.log('Notification sent for ticket creation');
    } catch (notifError) {
      console.error('Failed to send notification:', notifError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        ticket_key: ticketKey,
        ticket_url: ticketUrl,
        assigned_to: suggestedAssignee,
        ml_confidence: mlConfidence,
        ticket_id: createdTicket?.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Create ticket error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur lors de la création du ticket' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});