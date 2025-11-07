// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-ignore
import * as XLSX from 'https://cdn.sheetjs.com/xlsx-0.20.0/package/xlsx.mjs';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExportRequest {
  format: 'excel' | 'json' | 'csv';
  audit_id?: string;
  template?: 'standard' | 'executive' | 'technical' | 'minimal';
  include_history?: boolean;
  date_range?: { start: string; end: string };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const body: ExportRequest = await req.json();
    const { format, audit_id, template = 'standard', include_history = false, date_range } = body;

    console.log(`Generating ${format} export for user ${user.id}`);

    // Fetch audit data
    let auditQuery = supabase
      .from('compliance_audits')
      .select(`
        *,
        categories:compliance_categories(*),
        recommendations:compliance_recommendations(*)
      `);

    if (audit_id) {
      auditQuery = auditQuery.eq('id', audit_id);
    } else {
      auditQuery = auditQuery.order('audit_date', { ascending: false }).limit(1);
    }

    const { data: audits, error: auditError } = await auditQuery;
    if (auditError) throw auditError;

    const audit = audits?.[0];
    if (!audit) {
      throw new Error('No audit found');
    }

    // Fetch history if requested
    let historyData = [];
    if (include_history) {
      const historyQuery = supabase
        .from('compliance_audits')
        .select('audit_date, overall_score, status')
        .order('audit_date', { ascending: true });

      if (date_range) {
        historyQuery
          .gte('audit_date', date_range.start)
          .lte('audit_date', date_range.end);
      }

      const { data: history } = await historyQuery;
      historyData = history || [];
    }

    // Generate export based on format
    let fileContent: Uint8Array | string;
    let contentType: string;
    let filename: string;

    if (format === 'json') {
      const jsonData = generateJSONExport(audit, historyData, template);
      fileContent = JSON.stringify(jsonData, null, 2);
      contentType = 'application/json';
      filename = `rgpd-report-${audit.audit_date}.json`;
    } else if (format === 'excel') {
      fileContent = generateExcelExport(audit, historyData, template);
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      filename = `rgpd-report-${audit.audit_date}.xlsx`;
    } else if (format === 'csv') {
      fileContent = generateCSVExport(audit, historyData, template);
      contentType = 'text/csv';
      filename = `rgpd-report-${audit.audit_date}.csv`;
    } else {
      throw new Error(`Unsupported format: ${format}`);
    }

    return new Response(
      typeof fileContent === 'string' ? fileContent : new Uint8Array(fileContent),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      }
    );
  } catch (error: any) {
    console.error('Export error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateJSONExport(audit: any, history: any[], template: string): any {
  const base = {
    metadata: {
      export_date: new Date().toISOString(),
      template,
      audit_id: audit.id,
      audit_date: audit.audit_date,
    },
    audit: {
      overall_score: audit.overall_score,
      status: audit.status,
      audit_type: audit.audit_type,
      completed_at: audit.completed_at,
    },
  };

  if (template === 'minimal') {
    return base;
  }

  return {
    ...base,
    categories: audit.categories?.map((cat: any) => ({
      name: cat.category_name,
      code: cat.category_code,
      score: cat.score,
      max_score: cat.max_score,
      percentage: ((cat.score / cat.max_score) * 100).toFixed(1),
    })) || [],
    recommendations: template === 'technical' || template === 'standard'
      ? audit.recommendations?.map((rec: any) => ({
          category: rec.category_name,
          severity: rec.severity,
          title: rec.title,
          description: rec.description,
          status: rec.status,
        })) || []
      : [],
    history: history.length > 0 ? history : undefined,
  };
}

function generateExcelExport(audit: any, history: any[], template: string): Uint8Array {
  const workbook = XLSX.utils.book_new();

  // Summary sheet
  const summaryData = [
    ['Rapport RGPD - EmotionsCare'],
    [''],
    ['Date d\'audit', audit.audit_date],
    ['Score global', `${audit.overall_score}/100`],
    ['Statut', audit.status],
    ['Type', audit.audit_type],
    ['Complété le', audit.completed_at],
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Résumé');

  // Categories sheet
  if (audit.categories && audit.categories.length > 0) {
    const categoriesData = [
      ['Catégorie', 'Code', 'Score', 'Score Max', 'Pourcentage', 'Tests Réussis', 'Total Tests'],
      ...audit.categories.map((cat: any) => [
        cat.category_name,
        cat.category_code,
        cat.score,
        cat.max_score,
        `${((cat.score / cat.max_score) * 100).toFixed(1)}%`,
        cat.checks_passed,
        cat.checks_total,
      ]),
    ];
    const categoriesSheet = XLSX.utils.aoa_to_sheet(categoriesData);
    XLSX.utils.book_append_sheet(workbook, categoriesSheet, 'Catégories');
  }

  // Recommendations sheet (if not minimal template)
  if (template !== 'minimal' && audit.recommendations && audit.recommendations.length > 0) {
    const recsData = [
      ['Catégorie', 'Sévérité', 'Priorité', 'Titre', 'Description', 'Impact', 'Remédiation', 'Statut'],
      ...audit.recommendations.map((rec: any) => [
        rec.category_name,
        rec.severity,
        rec.priority,
        rec.title,
        rec.description,
        rec.impact,
        rec.remediation,
        rec.status,
      ]),
    ];
    const recsSheet = XLSX.utils.aoa_to_sheet(recsData);
    XLSX.utils.book_append_sheet(workbook, recsSheet, 'Recommandations');
  }

  // History sheet
  if (history.length > 0) {
    const historyData = [
      ['Date', 'Score', 'Statut'],
      ...history.map((h: any) => [h.audit_date, h.overall_score, h.status]),
    ];
    const historySheet = XLSX.utils.aoa_to_sheet(historyData);
    XLSX.utils.book_append_sheet(workbook, historySheet, 'Historique');
  }

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

function generateCSVExport(audit: any, history: any[], template: string): string {
  let csv = 'Rapport RGPD - EmotionsCare\n\n';
  csv += `Date d'audit,${audit.audit_date}\n`;
  csv += `Score global,${audit.overall_score}/100\n`;
  csv += `Statut,${audit.status}\n\n`;

  if (audit.categories && audit.categories.length > 0) {
    csv += '\nCatégories\n';
    csv += 'Nom,Code,Score,Score Max,Pourcentage\n';
    audit.categories.forEach((cat: any) => {
      csv += `${cat.category_name},${cat.category_code},${cat.score},${cat.max_score},${((cat.score / cat.max_score) * 100).toFixed(1)}%\n`;
    });
  }

  if (template !== 'minimal' && audit.recommendations && audit.recommendations.length > 0) {
    csv += '\nRecommandations\n';
    csv += 'Catégorie,Sévérité,Titre,Statut\n';
    audit.recommendations.forEach((rec: any) => {
      csv += `${rec.category_name},${rec.severity},${rec.title},${rec.status}\n`;
    });
  }

  return csv;
}
