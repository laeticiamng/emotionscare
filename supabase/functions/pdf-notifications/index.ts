// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🔔 Checking scheduled PDF reports for upcoming notifications');

    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    // Récupérer les planifications actives avec prochaine exécution dans les 48h
    const { data: upcomingSchedules, error: schedError } = await supabase
      .from('pdf_report_schedules')
      .select('*, user:user_id(email)')
      .eq('is_active', true)
      .gte('next_run_at', now.toISOString())
      .lte('next_run_at', in48Hours.toISOString());

    if (schedError) throw schedError;

    console.log(`📋 Found ${upcomingSchedules?.length || 0} upcoming schedules`);

    const notifications = [];

    for (const schedule of upcomingSchedules || []) {
      try {
        const nextRun = new Date(schedule.next_run_at);
        const hoursUntilRun = Math.floor((nextRun.getTime() - now.getTime()) / (1000 * 60 * 60));

        // Envoyer notification 24h avant
        if (hoursUntilRun <= 24 && hoursUntilRun > 23) {
          await sendNotificationEmail(schedule, hoursUntilRun, resend);
          notifications.push({
            scheduleId: schedule.id,
            type: '24h',
            sent: true,
          });
        }
        // Ou 48h avant
        else if (hoursUntilRun <= 48 && hoursUntilRun > 47) {
          await sendNotificationEmail(schedule, hoursUntilRun, resend);
          notifications.push({
            scheduleId: schedule.id,
            type: '48h',
            sent: true,
          });
        }

        console.log(`✅ Notification sent for schedule ${schedule.id} (${hoursUntilRun}h)`);
      } catch (error) {
        console.error(`❌ Error sending notification for ${schedule.id}:`, error);
        notifications.push({
          scheduleId: schedule.id,
          error: error.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        notificationsSent: notifications.length,
        notifications,
        timestamp: now.toISOString(),
      }),
      {
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in pdf-notifications:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      {
        status: 500,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      }
    );
  }
});

async function sendNotificationEmail(schedule: any, hoursUntilRun: number, resend: any) {
  const timeText = hoursUntilRun > 24 ? '48 heures' : '24 heures';
  
  await resend.emails.send({
    from: "EmotionsCare RGPD <noreply@emotionscare.com>",
    to: schedule.recipient_emails,
    subject: `🔔 Rapport RGPD planifié dans ${timeText}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">🔔 Rappel - Rapport RGPD Planifié</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 8px 8px;">
          <div style="background: #fff3cd; padding: 20px; border-radius: 6px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 16px; color: #856404;">
              <strong>⏰ Rapport automatique dans ${timeText}</strong>
            </p>
          </div>

          <p style="font-size: 14px; color: #666; line-height: 1.6;">
            Bonjour,
          </p>

          <p style="font-size: 14px; color: #666; line-height: 1.6;">
            Un rapport RGPD automatique de type <strong>${schedule.report_type}</strong> sera généré et envoyé 
            dans <strong>${timeText}</strong> conformément à votre planification.
          </p>

          <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border: 1px solid #e0e0e0;">
            <h3 style="margin-top: 0; color: #333;">📊 Détails de la planification</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Type de rapport:</strong></td>
                <td style="padding: 8px 0; color: #333;">${schedule.report_type}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Prochaine exécution:</strong></td>
                <td style="padding: 8px 0; color: #333;">${new Date(schedule.next_run_at).toLocaleString('fr-FR')}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Destinataires:</strong></td>
                <td style="padding: 8px 0; color: #333;">${schedule.recipient_emails.length} personne(s)</td>
              </tr>
            </table>
          </div>

          <div style="background: #e8f4fd; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; font-size: 13px; color: #014361;">
              <strong>💡 Que faire ?</strong><br>
              Rien ! Le rapport sera généré et envoyé automatiquement à tous les destinataires.
              Vous pouvez consulter ou modifier cette planification depuis votre tableau de bord RGPD.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://app.emotionscare.com/gdpr" 
               style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Accéder au tableau de bord RGPD
            </a>
          </div>

          <p style="font-size: 12px; color: #999; margin-top: 30px; text-align: center;">
            Email de notification automatique - EmotionsCare<br>
            Pour désactiver ces notifications, modifiez votre planification dans le dashboard
          </p>
        </div>
      </div>
    `,
  });
}