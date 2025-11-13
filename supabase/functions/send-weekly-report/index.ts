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

    if (!reportData || !recipients || !Array.isArray(recipients)) {
      return new Response(
        JSON.stringify({ error: "Missing reportData or recipients" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Logging report for", recipients.length, "recipients");

    // Sauvegarder dans les logs
    const { error: logError } = await supabase.from("audit_report_logs").insert({
      recipients: recipients,
      period_start: reportData.period.start,
      period_end: reportData.period.end,
      total_changes: reportData.stats.totalChanges || 0,
      total_alerts: reportData.stats.totalAlerts || 0,
      critical_alerts: reportData.stats.criticalAlerts || 0,
    });

    if (logError) {
      console.error("Log error:", logError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent: recipients.length,
        message: "Report logged. Email integration pending.",
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
