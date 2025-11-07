// @ts-nocheck
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExportRequest {
  format: 'csv' | 'json';
  startDate?: string;
  endDate?: string;
  includeAlerts?: boolean;
  includeConsents?: boolean;
  includeExports?: boolean;
  includeAuditLogs?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Vérifier que l'utilisateur est admin
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!userRole || userRole.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const {
      format = 'csv',
      startDate,
      endDate,
      includeAlerts = true,
      includeConsents = true,
      includeExports = true,
      includeAuditLogs = true,
    }: ExportRequest = await req.json();

    console.log('[GDPR Report Export] Generating report:', {
      format,
      startDate,
      endDate,
      user: user.id,
    });

    const reportData: any = {
      metadata: {
        generatedAt: new Date().toISOString(),
        generatedBy: user.email,
        period: {
          start: startDate || 'All time',
          end: endDate || new Date().toISOString(),
        },
      },
      sections: {},
    };

    // Récupérer les alertes
    if (includeAlerts) {
      let alertsQuery = supabase
        .from('gdpr_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (startDate) alertsQuery = alertsQuery.gte('created_at', startDate);
      if (endDate) alertsQuery = alertsQuery.lte('created_at', endDate);

      const { data: alerts } = await alertsQuery.limit(500);
      reportData.sections.alerts = alerts || [];
    }

    // Récupérer les consentements
    if (includeConsents) {
      let consentsQuery = supabase
        .from('user_consents')
        .select('consent_type, granted, created_at')
        .order('created_at', { ascending: false });

      if (startDate) consentsQuery = consentsQuery.gte('created_at', startDate);
      if (endDate) consentsQuery = consentsQuery.lte('created_at', endDate);

      const { data: consents } = await consentsQuery.limit(1000);
      
      // Calculer les statistiques
      const totalConsents = consents?.length || 0;
      const analyticsConsents = consents?.filter(c => c.consent_type === 'analytics' && c.granted).length || 0;
      const analyticsRefused = consents?.filter(c => c.consent_type === 'analytics' && !c.granted).length || 0;

      reportData.sections.consents = {
        summary: {
          total: totalConsents,
          analyticsAccepted: analyticsConsents,
          analyticsRefused,
          acceptanceRate: totalConsents > 0 ? ((analyticsConsents / totalConsents) * 100).toFixed(2) : 0,
        },
        details: consents || [],
      };
    }

    // Récupérer les demandes d'export
    if (includeExports) {
      let exportsQuery = supabase
        .from('data_export_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (startDate) exportsQuery = exportsQuery.gte('created_at', startDate);
      if (endDate) exportsQuery = exportsQuery.lte('created_at', endDate);

      const { data: exports } = await exportsQuery.limit(500);
      
      const totalExports = exports?.length || 0;
      const pendingExports = exports?.filter(e => e.status === 'pending').length || 0;
      const completedExports = exports?.filter(e => e.status === 'completed').length || 0;
      const failedExports = exports?.filter(e => e.status === 'failed').length || 0;

      reportData.sections.exports = {
        summary: {
          total: totalExports,
          pending: pendingExports,
          completed: completedExports,
          failed: failedExports,
        },
        details: exports || [],
      };
    }

    // Récupérer les audit logs
    if (includeAuditLogs) {
      let logsQuery = supabase
        .from('audit_logs')
        .select('event, occurred_at, actor_id, target, details')
        .order('occurred_at', { ascending: false });

      if (startDate) logsQuery = logsQuery.gte('occurred_at', startDate);
      if (endDate) logsQuery = logsQuery.lte('occurred_at', endDate);

      const { data: logs } = await logsQuery.limit(500);
      reportData.sections.auditLogs = logs || [];
    }

    // Générer le format demandé
    if (format === 'csv') {
      const csv = generateCSV(reportData);
      return new Response(csv, {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="gdpr-report-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    // Par défaut, retourner JSON
    return new Response(JSON.stringify(reportData), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('[GDPR Report Export] Error:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateCSV(reportData: any): string {
  const lines: string[] = [];

  // Header
  lines.push('RAPPORT DE CONFORMITÉ RGPD');
  lines.push(`Généré le: ${new Date(reportData.metadata.generatedAt).toLocaleString('fr-FR')}`);
  lines.push(`Période: ${reportData.metadata.period.start} - ${reportData.metadata.period.end}`);
  lines.push('');

  // Alertes
  if (reportData.sections.alerts) {
    lines.push('ALERTES RGPD');
    lines.push('Type,Sévérité,Titre,Description,Résolu,Date de création');
    reportData.sections.alerts.forEach((alert: any) => {
      lines.push(
        `"${alert.alert_type}","${alert.severity}","${alert.title}","${alert.description || ''}",${alert.resolved ? 'Oui' : 'Non'},"${new Date(alert.created_at).toLocaleString('fr-FR')}"`
      );
    });
    lines.push('');
  }

  // Consentements
  if (reportData.sections.consents) {
    lines.push('STATISTIQUES DE CONSENTEMENTS');
    const { summary } = reportData.sections.consents;
    lines.push(`Total de consentements,${summary.total}`);
    lines.push(`Analytics acceptés,${summary.analyticsAccepted}`);
    lines.push(`Analytics refusés,${summary.analyticsRefused}`);
    lines.push(`Taux d'acceptation,${summary.acceptanceRate}%`);
    lines.push('');
  }

  // Exports
  if (reportData.sections.exports) {
    lines.push('DEMANDES D\'EXPORT');
    const { summary } = reportData.sections.exports;
    lines.push(`Total de demandes,${summary.total}`);
    lines.push(`En attente,${summary.pending}`);
    lines.push(`Complétées,${summary.completed}`);
    lines.push(`Échouées,${summary.failed}`);
    lines.push('');
    lines.push('Détails des demandes');
    lines.push('ID,Statut,Date de création');
    reportData.sections.exports.details.forEach((exp: any) => {
      lines.push(
        `"${exp.id}","${exp.status}","${new Date(exp.created_at).toLocaleString('fr-FR')}"`
      );
    });
    lines.push('');
  }

  // Audit Logs
  if (reportData.sections.auditLogs) {
    lines.push('JOURNAUX D\'AUDIT (100 derniers événements)');
    lines.push('Événement,Date,Acteur,Cible');
    reportData.sections.auditLogs.slice(0, 100).forEach((log: any) => {
      lines.push(
        `"${log.event}","${new Date(log.occurred_at).toLocaleString('fr-FR')}","${log.actor_id || 'N/A'}","${log.target || 'N/A'}"`
      );
    });
  }

  return lines.join('\n');
}
