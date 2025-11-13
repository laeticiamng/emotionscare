// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { reportData, recipients } = await req.json();

    console.log("Sending report to:", recipients);

    if (!reportData || !recipients || !Array.isArray(recipients)) {
      return new Response(
        JSON.stringify({ error: "Missing reportData or recipients" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Générer le HTML du rapport
    const htmlContent = generateReportHTML(reportData);

    // Note: Pour l'envoi d'emails, il faudrait intégrer Resend
    // Pour l'instant, on log simplement l'action
    console.log("Report generated successfully for recipients:", recipients.join(", "));
    console.log("Report data summary:", {
      totalChanges: reportData.stats.totalChanges,
      totalAlerts: reportData.stats.totalAlerts,
      criticalAlerts: reportData.stats.criticalAlerts,
    });

    // Sauvegarder dans les logs
    await supabase.from("audit_report_logs").insert({
      recipients: recipients,
      period_start: reportData.period.start,
      period_end: reportData.period.end,
      total_changes: reportData.stats.totalChanges,
      total_alerts: reportData.stats.totalAlerts,
      critical_alerts: reportData.stats.criticalAlerts,
    });

    return new Response(
      JSON.stringify({
        success: true,
        sent: recipients.length,
        message: "Report prepared successfully. Email integration pending.",
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
});

function generateReportHTML(data: any): string {
  const { period, stats } = data;
  const startDate = new Date(period.start).toLocaleDateString('fr-FR');
  const endDate = new Date(period.end).toLocaleDateString('fr-FR');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #3b82f6; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 20px; border: 1px solid #e5e7eb; }
    .stat { background: #f3f4f6; padding: 15px; margin: 10px 0; border-radius: 4px; }
    .stat-value { font-size: 32px; font-weight: bold; color: #1f2937; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📊 Rapport d'audit hebdomadaire</h1>
    <p>Période : ${startDate} au ${endDate}</p>
  </div>
  <div class="content">
    <div class="stat">
      <div class="stat-value">${stats.totalChanges}</div>
      <p>Total modifications</p>
    </div>
    <div class="stat">
      <div class="stat-value">${stats.totalAlerts}</div>
      <p>Alertes totales</p>
    </div>
    <div class="stat">
      <div class="stat-value">${stats.criticalAlerts}</div>
      <p>Alertes critiques</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
