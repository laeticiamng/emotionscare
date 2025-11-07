// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExportOptions {
  format: 'excel' | 'json' | 'csv';
  audit_id?: string;
  template?: 'standard' | 'executive' | 'technical' | 'minimal';
  include_history?: boolean;
  date_range?: { start: string; end: string };
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const options: ExportOptions = await req.json();
    console.log('Export request:', options);

    const gdprData = await fetchGDPRData(supabase, options);

    let result: string;
    let contentType: string;

    switch (options.format) {
      case 'excel':
        result = generateExcelFormat(gdprData, options);
        contentType = 'text/csv';
        break;
      case 'json':
        result = generateJSON(gdprData, options);
        contentType = 'application/json';
        break;
      case 'csv':
        result = generateCSV(gdprData, options);
        contentType = 'text/csv';
        break;
      default:
        throw new Error('Unsupported format');
    }

    return new Response(result, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="rgpd-export-${new Date().toISOString().split('T')[0]}.${options.format}"`,
      },
    });
  } catch (error: any) {
    console.error('Export error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: error.message === 'Unauthorized' ? 401 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function fetchGDPRData(supabase: any, options: ExportOptions) {
  const now = new Date();
  const startDate = options.date_range?.start || new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const endDate = options.date_range?.end || now.toISOString();

  const [consents, exports, deletions, alerts] = await Promise.all([
    supabase.from('user_consents').select('*').gte('created_at', startDate).lte('created_at', endDate),
    supabase.from('data_export_requests').select('*').gte('created_at', startDate).lte('created_at', endDate),
    supabase.from('data_deletion_requests').select('*').gte('created_at', startDate).lte('created_at', endDate),
    supabase.from('gdpr_alerts').select('*').gte('created_at', startDate).lte('created_at', endDate),
  ]);

  const data = {
    consents: consents.data || [],
    exports: exports.data || [],
    deletions: deletions.data || [],
    alerts: alerts.data || [],
  };

  const complianceScore = calculateCompliance(data);

  return { ...data, complianceScore };
}

function calculateCompliance(data: any): number {
  const total = data.consents.length || 1;
  const active = data.consents.filter((c: any) => c.analytics_consent || c.marketing_consent).length;
  const pending = data.exports.filter((e: any) => e.status === 'pending').length;
  const critical = data.alerts.filter((a: any) => a.severity === 'critical' && a.status !== 'resolved').length;

  return Math.round((active / total) * 50 + Math.max(0, 30 - pending * 5) + Math.max(0, 20 - critical * 10));
}

function generateJSON(data: any, options: ExportOptions): string {
  const output: any = {
    generated_at: new Date().toISOString(),
    template: options.template,
    compliance_score: data.complianceScore,
  };

  switch (options.template) {
    case 'minimal':
      output.summary = {
        compliance_score: data.complianceScore,
        total_consents: data.consents.length,
        total_exports: data.exports.length,
        total_alerts: data.alerts.length,
      };
      break;
    case 'executive':
      output.summary = {
        compliance_score: data.complianceScore,
        key_metrics: {
          active_consents: data.consents.filter((c: any) => c.analytics_consent || c.marketing_consent).length,
          pending_exports: data.exports.filter((e: any) => e.status === 'pending').length,
          critical_alerts: data.alerts.filter((a: any) => a.severity === 'critical').length,
        },
      };
      if (options.include_history) {
        output.trends = {
          consent_evolution: 'Stable',
          export_volume: 'En hausse',
          alert_frequency: data.alerts.length > 10 ? 'Élevée' : 'Normale',
        };
      }
      break;
    case 'technical':
      output.detailed_data = {
        consents: data.consents,
        exports: data.exports,
        deletions: data.deletions,
        alerts: data.alerts,
      };
      output.technical_metrics = {
        consent_rate: ((data.consents.filter((c: any) => c.analytics_consent).length / Math.max(data.consents.length, 1)) * 100).toFixed(2) + '%',
        pending_export_count: data.exports.filter((e: any) => e.status === 'pending').length,
        alert_distribution: {
          critical: data.alerts.filter((a: any) => a.severity === 'critical').length,
          high: data.alerts.filter((a: any) => a.severity === 'high').length,
          medium: data.alerts.filter((a: any) => a.severity === 'medium').length,
          low: data.alerts.filter((a: any) => a.severity === 'low').length,
        },
      };
      break;
    default: // standard
      output.overview = {
        compliance_score: data.complianceScore,
        total_consents: data.consents.length,
        total_exports: data.exports.length,
        total_deletions: data.deletions.length,
        total_alerts: data.alerts.length,
      };
      output.consents = data.consents;
      output.exports = data.exports;
      output.deletions = data.deletions;
      output.alerts = data.alerts;
  }

  return JSON.stringify(output, null, 2);
}

function generateCSV(data: any, options: ExportOptions): string {
  const lines: string[] = [];
  
  lines.push('RAPPORT RGPD');
  lines.push(`Généré le,${new Date().toISOString()}`);
  lines.push(`Template,${options.template}`);
  lines.push(`Score de conformité,${data.complianceScore}%`);
  lines.push('');

  lines.push('RÉSUMÉ');
  lines.push('Métrique,Valeur');
  lines.push(`Total consentements,${data.consents.length}`);
  lines.push(`Consentements actifs,${data.consents.filter((c: any) => c.analytics_consent || c.marketing_consent).length}`);
  lines.push(`Exports de données,${data.exports.length}`);
  lines.push(`Suppressions de données,${data.deletions.length}`);
  lines.push(`Alertes,${data.alerts.length}`);
  lines.push('');

  if (options.template !== 'minimal') {
    lines.push('CONSENTEMENTS');
    lines.push('ID,Date,Analytics,Marketing,Statut');
    data.consents.forEach((c: any) => {
      lines.push(`${c.id},${c.created_at},${c.analytics_consent},${c.marketing_consent},${c.analytics_consent || c.marketing_consent ? 'Actif' : 'Inactif'}`);
    });
    lines.push('');

    lines.push('EXPORTS DE DONNÉES');
    lines.push('ID,Date,Statut,Type');
    data.exports.forEach((e: any) => {
      lines.push(`${e.id},${e.created_at},${e.status},${e.export_type || 'complet'}`);
    });
    lines.push('');

    lines.push('ALERTES');
    lines.push('ID,Date,Type,Sévérité,Statut');
    data.alerts.forEach((a: any) => {
      lines.push(`${a.id},${a.created_at},${a.alert_type},${a.severity},${a.status}`);
    });
  }

  return lines.join('\n');
}

function generateExcelFormat(data: any, options: ExportOptions): string {
  const lines: string[] = [];
  
  lines.push('RAPPORT RGPD\t\t\t');
  lines.push(`Généré le\t${new Date().toISOString()}\t\t`);
  lines.push(`Score\t${data.complianceScore}%\t\t`);
  lines.push('\t\t\t');
  
  lines.push('RÉSUMÉ\t\t\t');
  lines.push('Métrique\tValeur\t\t');
  lines.push(`Total consentements\t${data.consents.length}\t\t`);
  lines.push(`Consentements actifs\t${data.consents.filter((c: any) => c.analytics_consent || c.marketing_consent).length}\t\t`);
  lines.push(`Exports\t${data.exports.length}\t\t`);
  lines.push(`Alertes\t${data.alerts.length}\t\t`);
  lines.push('\t\t\t');

  if (options.template !== 'minimal') {
    lines.push('CONSENTEMENTS\t\t\t');
    lines.push('Date\tAnalytics\tMarketing\tStatut');
    data.consents.forEach((c: any) => {
      lines.push(`${c.created_at}\t${c.analytics_consent}\t${c.marketing_consent}\t${c.analytics_consent || c.marketing_consent ? 'Actif' : 'Inactif'}`);
    });
    lines.push('\t\t\t');

    lines.push('ALERTES\t\t\t');
    lines.push('Date\tType\tSévérité\tStatut');
    data.alerts.forEach((a: any) => {
      lines.push(`${a.created_at}\t${a.alert_type}\t${a.severity}\t${a.status}`);
    });
  }

  return lines.join('\n');
}
