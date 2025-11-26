// @ts-nocheck
/**
 * scheduled-pdf-reports - Rapports PDF planifiés
 *
 * 🔒 SÉCURISÉ: Auth admin + Rate limit 5/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
    route: 'scheduled-pdf-reports',
    userId: user.id,
    limit: 5,
    windowMs: 60_000,
    description: 'Scheduled PDF report generation - Admin only',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🕐 Starting scheduled PDF reports job');

    // Récupérer les planifications actives dont l'exécution est due
    const now = new Date().toISOString();
    const { data: schedules, error: schedError } = await supabase
      .from('pdf_report_schedules')
      .select('*')
      .eq('is_active', true)
      .or(`next_run_at.is.null,next_run_at.lte.${now}`);

    if (schedError) throw schedError;

    console.log(`📋 Found ${schedules?.length || 0} schedules to process`);

    const results = [];

    for (const schedule of schedules || []) {
      try {
        console.log(`📊 Processing schedule ${schedule.id} for user ${schedule.user_id}`);

        // Générer le rapport PDF
        const { data: reportData, error: reportError } = await supabase.functions.invoke(
          'generate-audit-pdf',
          {
            body: {
              reportType: schedule.report_type,
              ...schedule.options,
            },
          }
        );

        if (reportError) throw reportError;

        // Créer le contenu HTML du rapport
        const htmlContent = reportData.htmlContent;
        
        // Récupérer l'email de l'utilisateur
        const { data: userData } = await supabase.auth.admin.getUserById(schedule.user_id);
        const userEmail = userData?.user?.email;

        // Envoyer l'email avec le rapport
        const emailResponse = await resend.emails.send({
          from: "EmotionsCare RGPD <reports@emotionscare.app>",
          to: schedule.recipient_emails,
          subject: `📊 Rapport RGPD automatique - ${schedule.report_type}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0;">📊 Rapport RGPD Automatique</h1>
              </div>
              
              <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 8px 8px;">
                <p style="font-size: 16px; color: #333;">Bonjour,</p>
                
                <p style="font-size: 14px; color: #666; line-height: 1.6;">
                  Votre rapport RGPD de type <strong>${schedule.report_type}</strong> a été généré automatiquement 
                  conformément à votre planification.
                </p>

                <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #667eea;">
                  <h3 style="margin-top: 0; color: #333;">📋 Détails du rapport</h3>
                  <ul style="color: #666; line-height: 1.8;">
                    <li><strong>Type:</strong> ${schedule.report_type}</li>
                    <li><strong>Date de génération:</strong> ${new Date().toLocaleString('fr-FR')}</li>
                    <li><strong>Prochaine exécution:</strong> ${calculateNextRun(schedule.schedule_cron)}</li>
                  </ul>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <p style="font-size: 12px; color: #999; margin-bottom: 15px;">
                    Le rapport complet est disponible ci-dessous
                  </p>
                </div>

                <div style="background: white; padding: 20px; border-radius: 6px; border: 1px solid #e0e0e0;">
                  ${htmlContent}
                </div>

                <div style="margin-top: 30px; padding: 20px; background: #fff3cd; border-radius: 6px; border-left: 4px solid #ffc107;">
                  <p style="margin: 0; font-size: 13px; color: #856404;">
                    <strong>🔒 Confidentialité:</strong> Ce rapport contient des informations sensibles. 
                    Ne le transférez qu'aux personnes autorisées.
                  </p>
                </div>

                <p style="font-size: 13px; color: #999; margin-top: 30px; text-align: center;">
                  Rapport généré automatiquement par EmotionsCare<br>
                  Pour modifier cette planification, connectez-vous à votre tableau de bord RGPD
                </p>
              </div>
            </div>
          `,
        });

        // Enregistrer le rapport dans l'historique
        const { data: latestReport } = await supabase
          .from('pdf_reports')
          .select('report_version')
          .eq('user_id', schedule.user_id)
          .eq('report_type', schedule.report_type)
          .order('report_version', { ascending: false })
          .limit(1)
          .single();

        const nextVersion = (latestReport?.report_version || 0) + 1;

        await supabase.from('pdf_reports').insert({
          user_id: schedule.user_id,
          report_type: schedule.report_type,
          report_version: nextVersion,
          title: `Rapport ${schedule.report_type} - ${new Date().toLocaleDateString('fr-FR')}`,
          metadata: {
            scheduled: true,
            schedule_id: schedule.id,
            recipients: schedule.recipient_emails,
            email_id: emailResponse.data?.id,
          },
          score_global: reportData.reportData?.audit?.overall_score,
        });

        // Mettre à jour la planification
        const nextRunAt = calculateNextRun(schedule.schedule_cron);
        await supabase
          .from('pdf_report_schedules')
          .update({
            last_run_at: now,
            next_run_at: nextRunAt,
          })
          .eq('id', schedule.id);

        results.push({
          scheduleId: schedule.id,
          success: true,
          emailId: emailResponse.data?.id,
          nextRun: nextRunAt,
        });

        console.log(`✅ Successfully processed schedule ${schedule.id}`);
      } catch (error) {
        console.error(`❌ Error processing schedule ${schedule.id}:`, error);
        results.push({
          scheduleId: schedule.id,
          success: false,
          error: error.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processedCount: schedules?.length || 0,
        results,
        timestamp: now,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in scheduled-pdf-reports:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function calculateNextRun(cronExpression: string): string {
  // Parsing basique de cron (à améliorer avec une vraie lib cron)
  // Format: minute hour day month weekday
  const parts = cronExpression.split(' ');
  
  // Pour l'instant, on fait simple: ajout d'intervalle basique
  // Exemples supportés: "0 9 * * *" (tous les jours à 9h), "0 9 * * 1" (tous les lundis à 9h)
  
  const now = new Date();
  const next = new Date(now);
  
  // Logique simplifiée pour les cas courants
  if (cronExpression === '0 9 * * *') {
    // Tous les jours à 9h
    next.setDate(next.getDate() + 1);
    next.setHours(9, 0, 0, 0);
  } else if (cronExpression === '0 9 * * 1') {
    // Tous les lundis à 9h
    const daysUntilMonday = (8 - next.getDay()) % 7 || 7;
    next.setDate(next.getDate() + daysUntilMonday);
    next.setHours(9, 0, 0, 0);
  } else if (cronExpression === '0 9 1 * *') {
    // Le 1er de chaque mois à 9h
    next.setMonth(next.getMonth() + 1, 1);
    next.setHours(9, 0, 0, 0);
  } else {
    // Par défaut: ajouter 24h
    next.setDate(next.getDate() + 1);
  }
  
  return next.toISOString();
}