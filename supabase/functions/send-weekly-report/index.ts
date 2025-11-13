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

    // Date range: last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    console.log("Fetching weekly report data...");

    // Fetch audit logs count
    const { count: auditCount, error: auditError } = await supabase
      .from("role_audit_logs")
      .select("*", { count: "exact", head: true })
      .gte("changed_at", startDate.toISOString())
      .lte("changed_at", endDate.toISOString());

    if (auditError) throw auditError;

    // Fetch security alerts count
    const { count: alertsCount, error: alertsError } = await supabase
      .from("security_alerts")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    if (alertsError) throw alertsError;

    console.log(`Weekly report: ${auditCount} audit logs, ${alertsCount} alerts`);

    return new Response(
      JSON.stringify({
        success: true,
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
        stats: {
          totalAuditLogs: auditCount || 0,
          totalAlerts: alertsCount || 0,
        },
        message: "Report data collected successfully. Email sending feature pending configuration.",
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
