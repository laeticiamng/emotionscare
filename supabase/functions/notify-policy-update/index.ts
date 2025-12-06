// @ts-nocheck
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from '../_shared/supabase.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const resendApiKey = Deno.env.get('RESEND_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    const { policy_id } = await req.json();

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Récupérer la politique
    const { data: policy, error: policyError } = await supabase
      .from('privacy_policies')
      .select('*')
      .eq('id', policy_id)
      .single();

    if (policyError || !policy) {
      throw new Error('Politique non trouvée');
    }

    // Récupérer tous les utilisateurs qui n'ont pas encore accepté
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .not('id', 'in', `(
        SELECT user_id FROM policy_acceptances WHERE policy_id = '${policy_id}'
      )`);

    if (usersError) {
      console.error('Erreur récupération utilisateurs:', usersError);
    }

    const notifiedUsers = [];
    const failedUsers = [];

    // Envoyer des notifications
    for (const user of users || []) {
      try {
        // Notification in-app
        await supabase.from('policy_notifications').insert({
          policy_id,
          user_id: user.id,
          notification_type: 'in_app',
          status: 'sent',
        });

        // Notification email (si Resend configuré)
        if (resendApiKey && user.email) {
          const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: 'EmotionsCare <noreply@emotionscare.com>',
              to: [user.email],
              subject: `Mise à jour de notre politique de confidentialité - Version ${policy.version}`,
              html: `
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                    .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
                    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1>🔒 Mise à jour de notre politique de confidentialité</h1>
                    </div>
                    <div class="content">
                      <p>Bonjour ${user.full_name || 'cher utilisateur'},</p>
                      
                      <p>Nous avons mis à jour notre politique de confidentialité (version <strong>${policy.version}</strong>).</p>
                      
                      ${policy.summary ? `
                        <div style="background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0;">
                          <strong>Résumé des changements :</strong><br>
                          ${policy.summary}
                        </div>
                      ` : ''}
                      
                      <p>Cette mise à jour entrera en vigueur le <strong>${new Date(policy.effective_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>.</p>
                      
                      <p>Veuillez prendre le temps de lire ces modifications. Votre acceptation est requise pour continuer à utiliser nos services.</p>
                      
                      <a href="${supabaseUrl}/privacy-policy/${policy.id}" class="button">
                        📄 Lire et accepter la politique
                      </a>
                      
                      <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                        Si vous avez des questions concernant ces modifications, n'hésitez pas à nous contacter.
                      </p>
                    </div>
                    <div class="footer">
                      <p>EmotionsCare - Votre bien-être mental au quotidien</p>
                      <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
                    </div>
                  </div>
                </body>
                </html>
              `,
            }),
          });

          if (emailResponse.ok) {
            await supabase.from('policy_notifications').insert({
              policy_id,
              user_id: user.id,
              notification_type: 'email',
              status: 'sent',
            });
            notifiedUsers.push(user.id);
          } else {
            failedUsers.push(user.id);
          }
        } else {
          notifiedUsers.push(user.id);
        }
      } catch (error) {
        console.error(`Erreur notification utilisateur ${user.id}:`, error);
        failedUsers.push(user.id);
      }
    }

    // Créer une alerte RGPD pour le suivi
    await supabase.from('gdpr_alerts').insert({
      alert_type: 'policy_update',
      severity: 'info',
      title: `Politique ${policy.version} publiée`,
      description: `${notifiedUsers.length} utilisateurs notifiés, ${failedUsers.length} échecs`,
      source: 'policy_versioning',
      metadata: {
        policy_id,
        policy_version: policy.version,
        notified_count: notifiedUsers.length,
        failed_count: failedUsers.length,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        notified: notifiedUsers.length,
        failed: failedUsers.length,
        total: (users || []).length,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Erreur notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});
