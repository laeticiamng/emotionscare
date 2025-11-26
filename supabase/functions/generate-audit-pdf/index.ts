// @ts-nocheck
/**
 * generate-audit-pdf - Génération de rapports PDF d'audit RGPD
 *
 * 🔒 SÉCURISÉ: Auth admin + Rate limit 5/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

interface PDFGenerationRequest {
  auditId?: string;
  includeGraphs?: boolean;
  includeRecommendations?: boolean;
  includeCategoryDetails?: boolean;
  reportTitle?: string;
  reportType?: 'audit' | 'violations' | 'dsar' | 'full';
}

serve(async (req) => {
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  if (!corsResult.allowed) {
    return rejectCors(corsResult);
  }

  const { user, status } = await authorizeRole(req, ['admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'generate-audit-pdf',
    userId: user.id,
    limit: 5,
    windowMs: 60_000,
    description: 'Audit PDF generation - Admin only',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const {
      auditId,
      includeGraphs = true,
      includeRecommendations = true,
      includeCategoryDetails = true,
      reportTitle = 'Rapport d\'Audit RGPD',
      reportType = 'audit',
    }: PDFGenerationRequest = await req.json();

    console.log(`Generating PDF report: ${reportType}`, { auditId });

    // Récupérer les données selon le type de rapport
    let reportData: any = {};

    if (reportType === 'audit' && auditId) {
      // Rapport d'audit spécifique
      const { data: audit, error: auditError } = await supabase
        .from('compliance_audits')
        .select('*')
        .eq('id', auditId)
        .single();

      if (auditError) throw auditError;

      const { data: scores } = await supabase
        .from('compliance_scores')
        .select('*, compliance_categories(*)')
        .eq('audit_id', auditId);

      const { data: recommendations } = await supabase
        .from('compliance_recommendations')
        .select('*')
        .eq('audit_id', auditId)
        .order('priority', { ascending: false });

      reportData = {
        audit,
        scores: scores || [],
        recommendations: recommendations || [],
      };
    } else if (reportType === 'violations') {
      // Rapport des violations
      const { data: violations } = await supabase
        .from('gdpr_violations')
        .select('*')
        .order('detected_at', { ascending: false })
        .limit(50);

      const { data: alerts } = await supabase
        .from('violation_alerts')
        .select('*')
        .eq('is_dismissed', false)
        .order('triggered_at', { ascending: false })
        .limit(30);

      const { data: stats } = await supabase.rpc('get_violation_stats', { days: 30 });

      reportData = {
        violations: violations || [],
        alerts: alerts || [],
        stats: stats?.[0] || {},
      };
    } else if (reportType === 'dsar') {
      // Rapport DSAR
      const { data: dsarRequests } = await supabase
        .from('dsar_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      reportData = {
        dsarRequests: dsarRequests || [],
      };
    } else {
      // Rapport complet
      const { data: latestAudit } = await supabase
        .from('compliance_audits')
        .select('*')
        .order('audit_date', { ascending: false })
        .limit(1)
        .single();

      const { data: violations } = await supabase
        .from('gdpr_violations')
        .select('*')
        .eq('status', 'detected')
        .order('detected_at', { ascending: false })
        .limit(20);

      const { data: dsarRequests } = await supabase
        .from('dsar_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(20);

      reportData = {
        audit: latestAudit,
        violations: violations || [],
        dsarRequests: dsarRequests || [],
      };
    }

    // Générer le HTML du rapport
    const htmlContent = generateHTMLReport(reportData, {
      title: reportTitle,
      type: reportType,
      includeGraphs,
      includeRecommendations,
      includeCategoryDetails,
    });

    // Enregistrer le rapport dans l'historique
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user } } = await supabase.auth.getUser(token);
        
        if (user) {
          // Obtenir la prochaine version
          const { data: latestReport } = await supabase
            .from('pdf_reports')
            .select('report_version')
            .eq('user_id', user.id)
            .eq('report_type', reportType)
            .order('report_version', { ascending: false })
            .limit(1)
            .single();

          const nextVersion = (latestReport?.report_version || 0) + 1;
          const scoreGlobal = reportType === 'audit' && reportData.audit?.overall_score 
            ? reportData.audit.overall_score 
            : null;

          await supabase.from('pdf_reports').insert({
            user_id: user.id,
            report_type: reportType,
            report_version: nextVersion,
            title: reportTitle,
            metadata: {
              includeGraphs,
              includeRecommendations,
              includeCategoryDetails,
              auditId,
            },
            score_global: scoreGlobal,
          });
        }
      } catch (error) {
        console.error('Error saving to history:', error);
        // Ne pas bloquer la génération si l'enregistrement échoue
      }
    }

    // Note: La génération PDF réelle se fait côté client avec jsPDF
    // Ici on retourne les données formatées pour le client
    return new Response(
      JSON.stringify({
        success: true,
        reportData,
        htmlContent,
        metadata: {
          generatedAt: new Date().toISOString(),
          reportType,
          title: reportTitle,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error generating PDF report:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateHTMLReport(data: any, options: any): string {
  const { title, type, includeGraphs, includeRecommendations, includeCategoryDetails } = options;

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #1a1a1a; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        .metric { display: inline-block; margin: 10px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
        .metric-value { font-size: 24px; font-weight: bold; color: #007bff; }
        .metric-label { font-size: 12px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; font-weight: bold; }
        .badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .badge-critical { background: #dc3545; color: white; }
        .badge-high { background: #fd7e14; color: white; }
        .badge-medium { background: #ffc107; color: black; }
        .badge-low { background: #28a745; color: white; }
        .recommendation { padding: 15px; margin: 10px 0; background: #fff3cd; border-left: 4px solid #ffc107; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <p>Généré le ${new Date().toLocaleDateString('fr-FR', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
      </div>
  `;

  if (type === 'audit' && data.audit) {
    html += generateAuditSection(data, includeGraphs, includeRecommendations, includeCategoryDetails);
  } else if (type === 'violations') {
    html += generateViolationsSection(data);
  } else if (type === 'dsar') {
    html += generateDSARSection(data);
  } else {
    html += generateFullReportSections(data);
  }

  html += `
    </body>
    </html>
  `;

  return html;
}

function generateAuditSection(data: any, includeGraphs: boolean, includeRecommendations: boolean, includeCategoryDetails: boolean): string {
  const { audit, scores, recommendations } = data;

  let html = `
    <div class="section">
      <h2>Score de Conformité Global</h2>
      <div class="metric">
        <div class="metric-value">${audit.overall_score}/100</div>
        <div class="metric-label">Score Global</div>
      </div>
      <div class="metric">
        <div class="metric-value">${scores.filter((s: any) => s.score >= 80).length}</div>
        <div class="metric-label">Catégories Conformes</div>
      </div>
      <div class="metric">
        <div class="metric-value">${scores.filter((s: any) => s.score < 50).length}</div>
        <div class="metric-label">Catégories à Risque</div>
      </div>
    </div>
  `;

  if (includeCategoryDetails && scores.length > 0) {
    html += `
      <div class="section">
        <h2>Détail par Catégorie</h2>
        <table>
          <thead>
            <tr>
              <th>Catégorie</th>
              <th>Score</th>
              <th>Statut</th>
              <th>Problèmes</th>
            </tr>
          </thead>
          <tbody>
    `;

    scores.forEach((score: any) => {
      const status = score.score >= 80 ? 'Conforme' : score.score >= 50 ? 'À améliorer' : 'Non conforme';
      const badgeClass = score.score >= 80 ? 'badge-low' : score.score >= 50 ? 'badge-medium' : 'badge-critical';
      
      html += `
        <tr>
          <td>${score.compliance_categories?.name || 'N/A'}</td>
          <td><strong>${score.score}/100</strong></td>
          <td><span class="badge ${badgeClass}">${status}</span></td>
          <td>${score.issues_found || 0}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;
  }

  if (includeRecommendations && recommendations.length > 0) {
    html += `
      <div class="section">
        <h2>Recommandations Prioritaires</h2>
    `;

    recommendations.slice(0, 10).forEach((rec: any) => {
      html += `
        <div class="recommendation">
          <strong>${rec.title}</strong>
          <p>${rec.description}</p>
          <small>Priorité: ${rec.priority} | Impact: ${rec.impact}</small>
        </div>
      `;
    });

    html += `</div>`;
  }

  return html;
}

function generateViolationsSection(data: any): string {
  const { violations, alerts, stats } = data;

  let html = `
    <div class="section">
      <h2>Statistiques des Violations</h2>
      <div class="metric">
        <div class="metric-value">${stats.total_violations || 0}</div>
        <div class="metric-label">Total Violations (30j)</div>
      </div>
      <div class="metric">
        <div class="metric-value">${stats.critical_violations || 0}</div>
        <div class="metric-label">Critiques</div>
      </div>
      <div class="metric">
        <div class="metric-value">${stats.resolved_violations || 0}</div>
        <div class="metric-label">Résolues</div>
      </div>
    </div>
  `;

  if (violations.length > 0) {
    html += `
      <div class="section">
        <h2>Violations Récentes</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Sévérité</th>
              <th>Description</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
    `;

    violations.forEach((v: any) => {
      const badgeClass = v.severity === 'critical' ? 'badge-critical' : 
                         v.severity === 'high' ? 'badge-high' : 
                         v.severity === 'medium' ? 'badge-medium' : 'badge-low';
      
      html += `
        <tr>
          <td>${new Date(v.detected_at).toLocaleDateString('fr-FR')}</td>
          <td>${v.violation_type}</td>
          <td><span class="badge ${badgeClass}">${v.severity}</span></td>
          <td>${v.title}</td>
          <td>${v.status}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;
  }

  return html;
}

function generateDSARSection(data: any): string {
  const { dsarRequests } = data;

  let html = `
    <div class="section">
      <h2>Demandes DSAR</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Utilisateur</th>
            <th>Statut</th>
            <th>Échéance légale</th>
          </tr>
        </thead>
        <tbody>
  `;

  dsarRequests.forEach((req: any) => {
    const isOverdue = req.status === 'pending' && new Date(req.legal_deadline) < new Date();
    html += `
      <tr>
        <td>${new Date(req.created_at).toLocaleDateString('fr-FR')}</td>
        <td>${req.request_type}</td>
        <td>${req.user_email || 'N/A'}</td>
        <td>${req.status}</td>
        <td${isOverdue ? ' style="color: red; font-weight: bold;"' : ''}>
          ${new Date(req.legal_deadline).toLocaleDateString('fr-FR')}
          ${isOverdue ? ' ⚠️ DÉPASSÉE' : ''}
        </td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  return html;
}

function generateFullReportSections(data: any): string {
  let html = '';

  if (data.audit) {
    html += `
      <div class="section">
        <h2>Audit de Conformité</h2>
        <div class="metric">
          <div class="metric-value">${data.audit.overall_score}/100</div>
          <div class="metric-label">Score Global</div>
        </div>
      </div>
    `;
  }

  if (data.violations?.length > 0) {
    html += `
      <div class="section">
        <h2>Violations Actives</h2>
        <p><strong>${data.violations.length}</strong> violation(s) détectée(s) nécessitant une attention</p>
      </div>
    `;
  }

  if (data.dsarRequests?.length > 0) {
    html += `
      <div class="section">
        <h2>Demandes DSAR en Attente</h2>
        <p><strong>${data.dsarRequests.length}</strong> demande(s) en cours de traitement</p>
      </div>
    `;
  }

  return html;
}
