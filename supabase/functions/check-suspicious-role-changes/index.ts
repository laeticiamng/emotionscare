// @ts-nocheck
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'noreply@emotionscare.com';

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

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

interface SuspiciousActivityAlert {
  count: number;
  action: string;
  timeWindow: string;
  logs: any[];
}

async function checkSuspiciousActivity(): Promise<SuspiciousActivityAlert[]> {
  // Utiliser la fonction SQL qui lit les seuils configurables
  const { data: suspiciousActivities, error } = await supabase.rpc('check_suspicious_role_activity');

  if (error) {
    console.error('Error checking suspicious activity:', error);
    return [];
  }

  if (!suspiciousActivities || suspiciousActivities.length === 0) {
    console.log('No suspicious activity detected');
    return [];
  }

  const alerts: SuspiciousActivityAlert[] = suspiciousActivities.map((activity: any) => ({
    count: Number(activity.count),
    action: getActionLabel(activity.alert_type),
    timeWindow: `${activity.time_window_minutes} dernières minutes`,
    logs: activity.logs || [],
  }));

  return alerts;
}

function getActionLabel(alertType: string): string {
  const labels: Record<string, string> = {
    'premium_role_add': 'Ajouts massifs de rôles premium',
    'premium_role_remove': 'Suppressions massives de rôles premium',
    'admin_role_change': 'Changements de rôles admin',
    'bulk_role_changes': 'Changements de rôles en masse',
  };
  return labels[alertType] || alertType;
}

async function getAdminEmails(): Promise<string[]> {
  const { data: adminRoles, error } = await supabase
    .from('user_roles')
    .select('user_id')
    .eq('role', 'admin');

  if (error || !adminRoles) {
    console.error('Error fetching admin roles:', error);
    return [];
  }

  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
  
  if (usersError || !users) {
    console.error('Error fetching users:', usersError);
    return [];
  }

  const adminUserIds = new Set(adminRoles.map(r => r.user_id));
  return users
    .filter(u => adminUserIds.has(u.id) && u.email)
    .map(u => u.email!);
}

async function sendAlertEmail(to: string, alerts: SuspiciousActivityAlert[]) {
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return;
  }

  const alertsHtml = alerts.map(alert => `
    <div style="margin: 20px 0; padding: 15px; background-color: #fee; border-left: 4px solid #c00;">
      <h3 style="color: #c00; margin: 0 0 10px 0;">⚠️ Activité Suspecte Détectée</h3>
      <p><strong>Action:</strong> ${alert.action}</p>
      <p><strong>Nombre d'occurrences:</strong> ${alert.count}</p>
      <p><strong>Période:</strong> ${alert.timeWindow}</p>
      <p style="margin-top: 10px; font-size: 12px; color: #666;">
        ${alert.count} changements détectés dans les ${alert.timeWindow}
      </p>
    </div>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #c00;">🚨 Alerte Sécurité - EmotionsCare</h1>
          <p>Une activité suspecte a été détectée sur la plateforme concernant les changements de rôles utilisateurs.</p>
          
          ${alertsHtml}
          
          <div style="margin-top: 30px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
            <p style="margin: 0;"><strong>Actions recommandées :</strong></p>
            <ul style="margin: 10px 0;">
              <li>Vérifier les logs d'audit dans l'interface admin</li>
              <li>Contacter les administrateurs concernés si nécessaire</li>
              <li>Vérifier l'intégrité des données utilisateurs</li>
            </ul>
          </div>
          
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            Ce message a été envoyé automatiquement par le système de surveillance EmotionsCare.
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject: '🚨 Alerte Sécurité - Activité Suspecte Détectée',
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to send email:', error);
    } else {
      console.log('Alert email sent successfully to:', to);
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req) });
  }

  try {
    console.log('Checking for suspicious role changes...');
    
    const alerts = await checkSuspiciousActivity();

    if (alerts.length === 0) {
      console.log('No suspicious activity detected');
      return new Response(
        JSON.stringify({ message: 'No suspicious activity detected' }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json', ...getCorsHeaders(req) }
        }
      );
    }

    console.log(`Found ${alerts.length} suspicious activities`);

    // Récupérer les emails des admins
    const adminEmails = await getAdminEmails();

    if (adminEmails.length === 0) {
      console.warn('No admin emails found');
      return new Response(
        JSON.stringify({ 
          message: 'Suspicious activity detected but no admin emails to notify',
          alerts 
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json', ...getCorsHeaders(req) }
        }
      );
    }

    // Envoyer les alertes à tous les admins
    await Promise.all(
      adminEmails.map(email => sendAlertEmail(email, alerts))
    );

    console.log(`Alert emails sent to ${adminEmails.length} admins`);

    return new Response(
      JSON.stringify({ 
        message: 'Suspicious activity detected and alerts sent',
        alertsCount: alerts.length,
        emailsSent: adminEmails.length,
        alerts
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json', ...getCorsHeaders(req) }
      }
    );

  } catch (error) {
    console.error('Error in check-suspicious-role-changes:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal error' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json', ...getCorsHeaders(req) }
      }
    );
  }
});
