// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const now = new Date();

    // Récupérer tous les rapports actifs dont next_run_at est dépassé
    const { data: reports, error: reportsError } = await supabase
      .from('scheduled_reports')
      .select('*')
      .eq('is_active', true)
      .lte('next_run_at', now.toISOString());

    if (reportsError) {
      console.error('Error fetching scheduled reports:', reportsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch scheduled reports' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${reports?.length || 0} reports to execute`);

    const results = [];

    for (const report of reports || []) {
      try {
        // Appeler la fonction generate-analytics-report
        const { data, error } = await supabase.functions.invoke('generate-analytics-report', {
          body: {
            reportId: report.id,
            name: report.name,
            startDate: report.date_range_start,
            endDate: report.date_range_end,
            recipients: report.recipients,
            format: report.format,
          },
        });

        if (error) {
          console.error(`Error generating report ${report.id}:`, error);
          results.push({ reportId: report.id, status: 'error', error: error.message });
          continue;
        }

        // Calculer le prochain run_at selon la fréquence
        let nextRunAt = new Date(report.next_run_at);
        
        switch (report.frequency) {
          case 'daily':
            nextRunAt.setDate(nextRunAt.getDate() + 1);
            break;
          case 'weekly':
            nextRunAt.setDate(nextRunAt.getDate() + 7);
            break;
          case 'monthly':
            nextRunAt.setMonth(nextRunAt.getMonth() + 1);
            break;
        }

        // Mettre à jour last_run_at et next_run_at
        const { error: updateError } = await supabase
          .from('scheduled_reports')
          .update({
            last_run_at: now.toISOString(),
            next_run_at: nextRunAt.toISOString(),
          })
          .eq('id', report.id);

        if (updateError) {
          console.error(`Error updating report ${report.id}:`, updateError);
        }

        results.push({ reportId: report.id, status: 'success', nextRunAt });
      } catch (err) {
        console.error(`Exception processing report ${report.id}:`, err);
        results.push({ reportId: report.id, status: 'error', error: String(err) });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in check-scheduled-reports:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
