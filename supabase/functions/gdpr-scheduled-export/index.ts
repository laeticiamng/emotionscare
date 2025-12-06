// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, serviceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScheduledExport {
  id: string;
  org_id: string | null;
  frequency: 'daily' | 'weekly' | 'monthly';
  format: 'csv' | 'json' | 'pdf';
  admin_emails: string[];
  last_run_at: string | null;
  next_run_at: string;
}

async function generateGDPRReport(format: string, orgId: string | null) {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endDate = now.toISOString();

  // Récupérer les données RGPD
  const [alertsRes, consentsRes, exportsRes, auditsRes] = await Promise.all([
    supabase.from('gdpr_alerts').select('*').gte('detected_at', startDate).lte('detected_at', endDate),
    supabase.from('consent_logs').select('*').gte('created_at', startDate).lte('created_at', endDate),
    supabase.from('export_jobs').select('*').gte('created_at', startDate).lte('created_at', endDate),
    supabase.from('audit_logs').select('*').gte('timestamp', startDate).lte('timestamp', endDate).limit(100),
  ]);

  const alerts = alertsRes.data || [];
  const consents = consentsRes.data || [];
  const exports = exportsRes.data || [];
  const audits = auditsRes.data || [];

  if (format === 'csv') {
    return generateCSV({ alerts, consents, exports, audits });
  } else if (format === 'json') {
    return JSON.stringify({ alerts, consents, exports, audits, generated_at: now.toISOString() }, null, 2);
  }

  return generateCSV({ alerts, consents, exports, audits });
}

function generateCSV(data: any) {
  const sections = [];

  // Alertes RGPD
  sections.push('=== ALERTES RGPD ===');
  sections.push('Type,Sévérité,Détecté le,Statut,Description');
  data.alerts.forEach((alert: any) => {
    sections.push(`"${alert.alert_type}","${alert.severity}","${alert.detected_at}","${alert.status}","${alert.message}"`);
  });

  // Consentements
  sections.push('\n=== CONSENTEMENTS ===');
  sections.push('Utilisateur,Type,Statut,Date');
  data.consents.forEach((consent: any) => {
    sections.push(`"${consent.user_id}","${consent.consent_type}","${consent.consent_given ? 'Accepté' : 'Refusé'}","${consent.created_at}"`);
  });

  // Exports
  sections.push('\n=== DEMANDES D\'EXPORT ===');
  sections.push('Utilisateur,Type,Statut,Créé le,Complété le');
  data.exports.forEach((exp: any) => {
    sections.push(`"${exp.user_id}","${exp.export_type}","${exp.status}","${exp.created_at}","${exp.completed_at || 'N/A'}"`);
  });

  // Logs d'audit
  sections.push('\n=== LOGS D\'AUDIT (100 derniers) ===');
  sections.push('Timestamp,Action,Utilisateur,Résultat,Détails');
  data.audits.forEach((audit: any) => {
    sections.push(`"${audit.timestamp}","${audit.action}","${audit.user_id || 'N/A'}","${audit.result}","${audit.details || ''}"`);
  });

  return sections.join('\n');
}

async function sendReportEmail(emails: string[], content: string, format: string, frequency: string) {
  const now = new Date();
  const fileName = `rapport-rgpd-${now.toISOString().split('T')[0]}.${format}`;
  const base64Content = btoa(content);

  const frequencyLabel = {
    daily: 'quotidien',
    weekly: 'hebdomadaire',
    monthly: 'mensuel',
  }[frequency] || frequency;

  try {
    const emailResponse = await resend.emails.send({
      from: "EmotionsCare RGPD <rgpd@emotionscare.app>",
      to: emails,
      subject: `📊 Rapport RGPD ${frequencyLabel} - ${now.toLocaleDateString('fr-FR')}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Rapport RGPD ${frequencyLabel}</h1>
          <p>Bonjour,</p>
          <p>Veuillez trouver ci-joint le rapport RGPD ${frequencyLabel} généré le ${now.toLocaleString('fr-FR')}.</p>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">📋 Contenu du rapport</h3>
            <ul>
              <li>Alertes RGPD détectées</li>
              <li>Statistiques des consentements</li>
              <li>Demandes d'export et de suppression</li>
              <li>Logs d'audit récents</li>
            </ul>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0;"><strong>🔒 Confidentialité</strong></p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">
              Ce rapport contient des données sensibles. Veillez à le traiter conformément aux politiques de sécurité de votre organisation.
            </p>
          </div>

          <p>Pour toute question concernant ce rapport, veuillez contacter l'équipe RGPD.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #9ca3af;">
            EmotionsCare - Plateforme de bien-être émotionnel<br>
            Cet email a été envoyé automatiquement. Ne pas répondre.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: fileName,
          content: base64Content,
        },
      ],
    });

    console.log("Report email sent successfully:", emailResponse);
    return emailResponse;
  } catch (error) {
    console.error("Failed to send report email:", error);
    throw error;
  }
}

async function processScheduledExports() {
  const now = new Date().toISOString();

  // Récupérer les exports planifiés qui doivent être exécutés
  const { data: scheduledExports, error } = await supabase
    .from('gdpr_scheduled_exports')
    .select('*')
    .eq('is_active', true)
    .lte('next_run_at', now);

  if (error) {
    console.error('Error fetching scheduled exports:', error);
    return { processed: 0, errors: 0 };
  }

  if (!scheduledExports || scheduledExports.length === 0) {
    console.log('No scheduled exports to process');
    return { processed: 0, errors: 0 };
  }

  let processed = 0;
  let errors = 0;

  for (const schedule of scheduledExports) {
    try {
      // Générer le rapport
      const report = await generateGDPRReport(schedule.format, schedule.org_id);

      // Envoyer par email
      await sendReportEmail(schedule.admin_emails, report, schedule.format, schedule.frequency);

      // Mettre à jour last_run_at et calculer next_run_at
      const { error: updateError } = await supabase
        .from('gdpr_scheduled_exports')
        .update({
          last_run_at: now,
          // next_run_at sera recalculé par le trigger
        })
        .eq('id', schedule.id);

      if (updateError) {
        console.error(`Error updating schedule ${schedule.id}:`, updateError);
        errors++;
      } else {
        processed++;
        console.log(`Successfully processed scheduled export ${schedule.id}`);
      }
    } catch (error) {
      console.error(`Error processing scheduled export ${schedule.id}:`, error);
      errors++;
    }
  }

  return { processed, errors };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting scheduled GDPR exports processing...');
    const result = await processScheduledExports();
    
    return new Response(JSON.stringify({
      success: true,
      message: `Processed ${result.processed} scheduled exports with ${result.errors} errors`,
      ...result,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Error in scheduled export function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);
