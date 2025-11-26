// @ts-nocheck
/**
 * scheduled-audits - Audits de conformité planifiés
 *
 * 🔒 SÉCURISÉ: Auth admin + Rate limit 10/min + CORS restrictif
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { sendEmail, generateAuditAlertEmail } from '../_shared/email-service.ts';
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
    route: 'scheduled-audits',
    userId: user.id,
    limit: 10,
    windowMs: 60_000,
    description: 'Scheduled audit operations - Admin only',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const url = new URL(req.url);
    const action = url.pathname.split('/').filter(Boolean).pop();

    // POST /scheduled-audits/check - Vérifier et exécuter les audits dus (appelé par cron)
    if (req.method === 'POST' && action === 'check') {
      console.log('[ScheduledAudits] Checking for due schedules...');

      // Récupérer les schedules dus
      const { data: schedules, error: schedulesError } = await supabaseClient
        .rpc('get_due_audit_schedules');

      if (schedulesError) {
        console.error('[ScheduledAudits] Error fetching schedules:', schedulesError);
        throw schedulesError;
      }

      console.log(`[ScheduledAudits] Found ${schedules?.length || 0} due schedules`);

      let executedCount = 0;

      for (const schedule of schedules || []) {
        try {
          console.log(`[ScheduledAudits] Executing schedule: ${schedule.schedule_name}`);

          // Lancer l'audit via l'edge function compliance-audit
          const { data: auditResult, error: auditError } = await supabaseClient.functions.invoke(
            'compliance-audit/run'
          );

          if (auditError) {
            console.error(`[ScheduledAudits] Error running audit:`, auditError);
            continue;
          }

          // Mettre à jour le schedule
          const nextRun = calculateNextRun(
            schedule.frequency,
            schedule.day_of_week,
            schedule.day_of_month,
            schedule.time_of_day
          );

          await supabaseClient
            .from('audit_schedules')
            .update({
              last_run_at: new Date().toISOString(),
            })
            .eq('id', schedule.schedule_id);

          executedCount++;
          console.log(`[ScheduledAudits] Successfully executed schedule ${schedule.schedule_name}`);

        } catch (error) {
          console.error(`[ScheduledAudits] Error executing schedule ${schedule.schedule_name}:`, error);
        }
      }

      // Traiter les alertes non envoyées
      await processAlerts(supabaseClient);

      return new Response(JSON.stringify({
        success: true,
        executed: executedCount,
        total: schedules?.length || 0,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /scheduled-audits/alerts - Récupérer les alertes récentes
    if (req.method === 'GET' && action === 'alerts') {
      const limit = parseInt(url.searchParams.get('limit') || '50');

      const { data, error } = await supabaseClient
        .from('audit_alerts')
        .select(`
          *,
          audit:compliance_audits(audit_date, overall_score)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return new Response(JSON.stringify({ alerts: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[ScheduledAudits] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processAlerts(supabase: any) {
  console.log('[ScheduledAudits] Processing unsent alerts...');

  // Récupérer les alertes non envoyées
  const { data: alerts, error: alertsError } = await supabase
    .from('audit_alerts')
    .select(`
      *,
      schedule:audit_schedules(alert_recipients)
    `)
    .eq('is_sent', false)
    .limit(20);

  if (alertsError) {
    console.error('[ScheduledAudits] Error fetching alerts:', alertsError);
    return;
  }

  for (const alert of alerts || []) {
    try {
      const recipients = alert.schedule?.alert_recipients || [];

      if (recipients.length === 0) {
        // Pas de destinataires, marquer comme envoyée
        await supabase
          .from('audit_alerts')
          .update({ is_sent: true, sent_at: new Date().toISOString() })
          .eq('id', alert.id);
        continue;
      }

      // Récupérer les détails de l'audit pour l'email
      const { data: audit } = await supabase
        .from('compliance_audits')
        .select('audit_date, overall_score')
        .eq('id', alert.audit_id)
        .single();

      // Générer le contenu de l'email
      const dashboardUrl = `${Deno.env.get('FRONTEND_URL') || 'https://app.emotionscare.com'}/dashboard/compliance`;
      const emailContent = generateAuditAlertEmail({
        auditDate: audit?.audit_date || new Date().toISOString(),
        overallScore: audit?.overall_score || 0,
        severity: alert.severity,
        message: alert.message,
        dashboardUrl
      });

      // Créer des notifications pour chaque destinataire
      const notifications = recipients.map((email: string) => ({
        alert_id: alert.id,
        recipient_email: email,
        notification_type: 'email',
        status: 'pending',
      }));

      await supabase
        .from('audit_notifications')
        .insert(notifications);

      // Envoyer les emails
      let sentCount = 0;
      for (const email of recipients) {
        const result = await sendEmail({
          to: email,
          subject: `🔔 Alerte Audit de Conformité - ${alert.severity.toUpperCase()}`,
          html: emailContent.html,
          text: emailContent.text
        });

        if (result.success) {
          sentCount++;
          // Marquer la notification individuelle comme envoyée
          await supabase
            .from('audit_notifications')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString(),
              message_id: result.messageId
            })
            .eq('alert_id', alert.id)
            .eq('recipient_email', email);
        } else {
          console.error(`[ScheduledAudits] Failed to send email to ${email}:`, result.error);
          // Marquer comme failed
          await supabase
            .from('audit_notifications')
            .update({
              status: 'failed',
              error_message: result.error
            })
            .eq('alert_id', alert.id)
            .eq('recipient_email', email);
        }
      }

      // Marquer l'alerte comme envoyée si au moins un email est parti
      if (sentCount > 0) {
        await supabase
          .from('audit_alerts')
          .update({ is_sent: true, sent_at: new Date().toISOString() })
          .eq('id', alert.id);
      }

      console.log(`[ScheduledAudits] Processed alert ${alert.id} - sent ${sentCount}/${recipients.length} emails`);

    } catch (error) {
      console.error(`[ScheduledAudits] Error processing alert ${alert.id}:`, error);
    }
  }
}

function calculateNextRun(frequency: string, dayOfWeek: number, dayOfMonth: number, timeOfDay: string): Date {
  const now = new Date();
  const [hours, minutes] = timeOfDay.split(':').map(Number);
  
  let nextRun = new Date(now);
  nextRun.setHours(hours, minutes, 0, 0);

  switch (frequency) {
    case 'daily':
      if (nextRun <= now) {
        nextRun.setDate(nextRun.getDate() + 1);
      }
      break;

    case 'weekly':
      const currentDay = now.getDay();
      let daysToAdd = dayOfWeek - currentDay;
      if (daysToAdd < 0 || (daysToAdd === 0 && nextRun <= now)) {
        daysToAdd += 7;
      }
      nextRun.setDate(nextRun.getDate() + daysToAdd);
      break;

    case 'monthly':
      nextRun.setDate(dayOfMonth);
      if (nextRun <= now) {
        nextRun.setMonth(nextRun.getMonth() + 1);
      }
      break;
  }

  return nextRun;
}
