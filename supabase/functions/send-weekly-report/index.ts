import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WeeklyReportData {
  totalChanges: number;
  totalAlerts: number;
  criticalAlerts: number;
  topAdmins: Array<{ email: string; count: number }>;
  alertsBySeverity: Record<string, number>;
  changesByAction: Record<string, number>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    // Date range: last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    console.log("Fetching weekly report data...");

    // Fetch audit logs
    const { data: auditLogs, error: auditError } = await supabase
      .from("role_audit_logs")
      .select("*")
      .gte("changed_at", startDate.toISOString())
      .lte("changed_at", endDate.toISOString());

    if (auditError) throw auditError;

    // Fetch security alerts
    const { data: alerts, error: alertsError } = await supabase
      .from("security_alerts")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    if (alertsError) throw alertsError;

    // Get admin users
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) throw usersError;

    const { data: adminRoles, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    if (rolesError) throw rolesError;

    const adminUserIds = new Set(adminRoles?.map(r => r.user_id) || []);
    const adminEmails = users
      .filter(u => adminUserIds.has(u.id))
      .map(u => u.email)
      .filter((email): email is string => email !== undefined);

    // Analyze data
    const reportData = analyzeData(auditLogs || [], alerts || [], users);

    console.log(`Sending report to ${adminEmails.length} admins`);

    // Send email to each admin
    const emailPromises = adminEmails.map(async (email) => {
      const htmlContent = generateEmailHTML(reportData, startDate, endDate);

      return resend.emails.send({
        from: "EmotionsCare <notifications@emotionscare.com>",
        to: [email],
        subject: `📊 Rapport hebdomadaire de sécurité - ${formatDate(startDate)} au ${formatDate(endDate)}`,
        html: htmlContent,
      });
    });

    const results = await Promise.allSettled(emailPromises);
    
    const successful = results.filter(r => r.status === "fulfilled").length;
    const failed = results.filter(r => r.status === "rejected").length;

    console.log(`Report sent: ${successful} successful, ${failed} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: successful,
        failed,
        adminCount: adminEmails.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-weekly-report:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function analyzeData(
  auditLogs: any[],
  alerts: any[],
  users: any[]
): WeeklyReportData {
  const userEmailMap = new Map(users.map(u => [u.id, u.email || "N/A"]));

  // Count changes by action
  const changesByAction: Record<string, number> = {};
  auditLogs.forEach(log => {
    changesByAction[log.action] = (changesByAction[log.action] || 0) + 1;
  });

  // Count alerts by severity
  const alertsBySeverity: Record<string, number> = {};
  let criticalCount = 0;
  alerts.forEach(alert => {
    alertsBySeverity[alert.severity] = (alertsBySeverity[alert.severity] || 0) + 1;
    if (alert.severity === "critical") criticalCount++;
  });

  // Top admins
  const adminActivity = new Map<string, number>();
  auditLogs.forEach(log => {
    if (log.changed_by) {
      const email = userEmailMap.get(log.changed_by) || "Unknown";
      adminActivity.set(email, (adminActivity.get(email) || 0) + 1);
    }
  });

  const topAdmins = Array.from(adminActivity.entries())
    .map(([email, count]) => ({ email, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalChanges: auditLogs.length,
    totalAlerts: alerts.length,
    criticalAlerts: criticalCount,
    topAdmins,
    alertsBySeverity,
    changesByAction,
  };
}

function generateEmailHTML(
  data: WeeklyReportData,
  startDate: Date,
  endDate: Date
): string {
  const riskLevel = 
    data.criticalAlerts > 5 ? "🔴 Critique" :
    data.criticalAlerts > 0 ? "🟠 Élevé" :
    data.totalAlerts > 10 ? "🟡 Moyen" : "🟢 Faible";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
    .content { background: #f8f9fa; padding: 30px; }
    .card { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .metric { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .metric:last-child { border-bottom: none; }
    .metric-label { font-weight: bold; }
    .metric-value { color: #667eea; font-weight: bold; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .risk-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Rapport Hebdomadaire de Sécurité</h1>
      <p>Période : ${formatDate(startDate)} - ${formatDate(endDate)}</p>
    </div>
    
    <div class="content">
      <div class="card">
        <h2>🎯 Vue d'ensemble</h2>
        <div class="metric">
          <span class="metric-label">Niveau de risque</span>
          <span class="metric-value">${riskLevel}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Total changements de rôles</span>
          <span class="metric-value">${data.totalChanges}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Total alertes de sécurité</span>
          <span class="metric-value">${data.totalAlerts}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Alertes critiques</span>
          <span class="metric-value" style="color: ${data.criticalAlerts > 0 ? '#dc2626' : '#16a34a'}">${data.criticalAlerts}</span>
        </div>
      </div>

      <div class="card">
        <h2>📈 Changements de rôles</h2>
        ${Object.entries(data.changesByAction).map(([action, count]) => `
          <div class="metric">
            <span class="metric-label">${action === 'add' ? 'Ajouts' : action === 'remove' ? 'Suppressions' : 'Modifications'}</span>
            <span class="metric-value">${count}</span>
          </div>
        `).join('')}
      </div>

      <div class="card">
        <h2>🚨 Alertes par sévérité</h2>
        ${Object.entries(data.alertsBySeverity).map(([severity, count]) => `
          <div class="metric">
            <span class="metric-label">${severity}</span>
            <span class="metric-value">${count}</span>
          </div>
        `).join('')}
      </div>

      ${data.topAdmins.length > 0 ? `
      <div class="card">
        <h2>👥 Top Administrateurs</h2>
        ${data.topAdmins.map((admin, index) => `
          <div class="metric">
            <span class="metric-label">${index + 1}. ${admin.email}</span>
            <span class="metric-value">${admin.count} actions</span>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <div class="card" style="background: #f0f9ff; border-left: 4px solid #667eea;">
        <p style="margin: 0;">
          <strong>💡 Conseil :</strong> ${
            data.criticalAlerts > 0 
              ? "Des alertes critiques nécessitent votre attention immédiate."
              : "Aucune alerte critique cette semaine. Continuez à surveiller l'activité."
          }
        </p>
      </div>
    </div>

    <div class="footer">
      <p>Ce rapport a été généré automatiquement par EmotionsCare</p>
      <p>Connectez-vous au tableau de bord pour plus de détails</p>
    </div>
  </div>
</body>
</html>
  `;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

serve(handler);
