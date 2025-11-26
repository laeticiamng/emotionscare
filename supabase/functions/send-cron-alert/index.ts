// @ts-nocheck
/**
 * send-cron-alert - Alertes cron échecs consécutifs
 *
 * 🔒 SÉCURISÉ: Auth admin + Rate limit 10/min + CORS restrictif
 */
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

interface CronFailure {
  jobname: string;
  runid: bigint;
  job_pid: number;
  database: string;
  username: string;
  command: string;
  status: string;
  return_message: string;
  start_time: string;
  end_time: string;
}

Deno.serve(async (req: Request) => {
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
    route: 'send-cron-alert',
    userId: user.id,
    limit: 10,
    windowMs: 60_000,
    description: 'Cron alert sending - Admin only',
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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const adminEmail = Deno.env.get('ADMIN_EMAIL');

    if (!resendApiKey || !adminEmail) {
      throw new Error('RESEND_API_KEY or ADMIN_EMAIL not configured');
    }

    console.log('[send-cron-alert] Starting cron failure check');

    // Check for consecutive failures in the last 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

    const { data: recentFailures, error: queryError } = await supabaseClient
      .rpc('get_gamification_cron_history', {
        p_limit: 100
      });

    if (queryError) {
      throw queryError;
    }

    // Group failures by job name
    const failuresByJob: Record<string, CronFailure[]> = {};
    
    for (const failure of recentFailures || []) {
      if (failure.status === 'failed' && new Date(failure.end_time) >= new Date(thirtyMinutesAgo)) {
        if (!failuresByJob[failure.jobname]) {
          failuresByJob[failure.jobname] = [];
        }
        failuresByJob[failure.jobname].push(failure);
      }
    }

    // Check for 3+ consecutive failures
    const alertsToSend = [];
    for (const [jobName, failures] of Object.entries(failuresByJob)) {
      if (failures.length >= 3) {
        // Verify they are consecutive (no success in between)
        const allRecentRuns = (recentFailures || [])
          .filter((r: any) => r.jobname === jobName)
          .sort((a: any, b: any) => new Date(b.end_time).getTime() - new Date(a.end_time).getTime())
          .slice(0, 3);

        const allFailed = allRecentRuns.every((r: any) => r.status === 'failed');
        
        if (allFailed) {
          alertsToSend.push({
            jobName,
            failures: allRecentRuns
          });
        }
      }
    }

    if (alertsToSend.length === 0) {
      console.log('[send-cron-alert] No consecutive failures detected');
      return new Response(
        JSON.stringify({ message: 'No alerts to send' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Send alert emails
    const emailsSent = [];
    for (const alert of alertsToSend) {
      const { jobName, failures } = alert;
      
      const errorDetails = failures.map((f: CronFailure) => `
        <li>
          <strong>Run ID:</strong> ${f.runid}<br>
          <strong>Time:</strong> ${new Date(f.end_time).toLocaleString('fr-FR')}<br>
          <strong>Error:</strong> ${f.return_message}
        </li>
      `).join('');

      const logsUrl = `https://yaincoxihiqdksxgrsrk.supabase.co/project/yaincoxihiqdksxgrsrk/logs/postgres-logs`;

      const htmlContent = `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #dc2626;">🚨 Alerte: Échecs consécutifs du cron job</h2>
            <p><strong>Job concerné:</strong> <code>${jobName}</code></p>
            <p>Le job a échoué <strong>3 fois consécutivement</strong> au cours des 30 dernières minutes.</p>
            
            <h3>Détails des échecs:</h3>
            <ul style="background: #f3f4f6; padding: 15px; border-radius: 5px;">
              ${errorDetails}
            </ul>

            <p>
              <a href="${logsUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">
                Voir les logs Supabase
              </a>
            </p>

            <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
              Cette alerte est générée automatiquement par le système EmotionsCare.
            </p>
          </body>
        </html>
      `;

      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'EmotionsCare Alerts <alerts@emotionscare.app>',
          to: [adminEmail],
          subject: `🚨 Cron Alert: ${jobName} - 3 échecs consécutifs`,
          html: htmlContent,
        }),
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error(`[send-cron-alert] Failed to send email for ${jobName}:`, errorText);
      } else {
        const result = await emailResponse.json();
        emailsSent.push({ jobName, emailId: result.id });
        console.log(`[send-cron-alert] Email sent for ${jobName}, ID: ${result.id}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        alertsSent: emailsSent.length,
        details: emailsSent
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error: any) {
    console.error('[send-cron-alert] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
