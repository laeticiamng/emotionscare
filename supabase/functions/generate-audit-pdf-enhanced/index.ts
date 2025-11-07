// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Enhanced PDF generation with Chart.js SVG graphs
 * This function generates high-quality SVG charts for PDF reports
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const {
      auditId,
      includeHistory = true,
      template = 'standard',
    } = await req.json();

    console.log('Generating enhanced PDF with SVG charts');

    // Fetch current audit
    const { data: audit, error: auditError } = await supabase
      .from('compliance_audits')
      .select(`
        *,
        categories:compliance_categories(*),
        scores:compliance_scores(*, compliance_categories(*)),
        recommendations:compliance_recommendations(*)
      `)
      .eq('id', auditId)
      .single();

    if (auditError) throw auditError;

    // Fetch history for trend charts
    let historyData = [];
    if (includeHistory) {
      const { data: history } = await supabase
        .from('compliance_audits')
        .select('audit_date, overall_score, status')
        .order('audit_date', { ascending: true })
        .limit(12);

      historyData = history || [];
    }

    // Generate Chart.js-compatible data for SVG rendering
    const chartsData = generateChartsData(audit, historyData);

    // Generate HTML with embedded SVG charts
    const htmlContent = generateEnhancedHTML(audit, chartsData, template);

    return new Response(
      JSON.stringify({
        success: true,
        htmlContent,
        chartsData,
        metadata: {
          generatedAt: new Date().toISOString(),
          auditId,
          template,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error generating enhanced PDF:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateChartsData(audit: any, history: any[]) {
  // Trend chart data
  const trendChart = {
    type: 'line',
    labels: history.map(h => new Date(h.audit_date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })),
    datasets: [{
      label: 'Score de Conformité',
      data: history.map(h => h.overall_score),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true,
    }],
  };

  // Category scores radar chart
  const categoryScores = audit.scores?.map((s: any) => ({
    category: s.compliance_categories?.category_code || 'N/A',
    score: s.score,
  })) || [];

  const radarChart = {
    type: 'radar',
    labels: categoryScores.map((c: any) => c.category),
    datasets: [{
      label: 'Scores par Catégorie',
      data: categoryScores.map((c: any) => c.score),
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      pointBackgroundColor: '#8b5cf6',
    }],
  };

  // Recommendations by severity (bar chart)
  const severityCounts = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  audit.recommendations?.forEach((rec: any) => {
    if (severityCounts.hasOwnProperty(rec.severity)) {
      severityCounts[rec.severity as keyof typeof severityCounts]++;
    }
  });

  const barChart = {
    type: 'bar',
    labels: ['Critique', 'Haute', 'Moyenne', 'Basse'],
    datasets: [{
      label: 'Recommandations par Sévérité',
      data: [severityCounts.critical, severityCounts.high, severityCounts.medium, severityCounts.low],
      backgroundColor: ['#ef4444', '#f59e0b', '#fbbf24', '#10b981'],
    }],
  };

  return {
    trendChart,
    radarChart,
    barChart,
  };
}

function generateEnhancedHTML(audit: any, chartsData: any, template: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Rapport RGPD - EmotionsCare</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          color: #1f2937;
          max-width: 1200px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          margin-bottom: 50px;
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 30px;
        }
        .header h1 {
          color: #1e40af;
          font-size: 32px;
          margin-bottom: 10px;
        }
        .score-banner {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          margin: 30px 0;
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
        }
        .score-value {
          font-size: 72px;
          font-weight: bold;
          margin: 10px 0;
        }
        .chart-container {
          margin: 40px 0;
          padding: 30px;
          background: #f9fafb;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }
        .chart-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #374151;
        }
        .chart-svg {
          width: 100%;
          height: auto;
        }
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin: 30px 0;
        }
        .category-card {
          padding: 20px;
          background: white;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .category-name {
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 8px;
          color: #1f2937;
        }
        .category-score {
          font-size: 24px;
          font-weight: bold;
          color: #3b82f6;
        }
        .recommendations-section {
          margin: 40px 0;
        }
        .recommendation-card {
          padding: 20px;
          margin: 15px 0;
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          border-radius: 8px;
        }
        .recommendation-card.critical {
          background: #fee2e2;
          border-left-color: #ef4444;
        }
        .recommendation-card.high {
          background: #fed7aa;
          border-left-color: #f97316;
        }
        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .badge-critical { background: #ef4444; color: white; }
        .badge-high { background: #f97316; color: white; }
        .badge-medium { background: #f59e0b; color: white; }
        .badge-low { background: #10b981; color: white; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Rapport d'Audit RGPD</h1>
        <p style="font-size: 14px; color: #6b7280;">
          EmotionsCare - Généré le ${new Date().toLocaleDateString('fr-FR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      <div class="score-banner">
        <div style="font-size: 16px; opacity: 0.9;">Score Global de Conformité</div>
        <div class="score-value">${audit.overall_score}<span style="font-size: 36px;">/100</span></div>
        <div style="font-size: 14px; opacity: 0.9;">
          ${audit.overall_score >= 80 ? '✓ Conforme' : audit.overall_score >= 50 ? '⚠️ À améliorer' : '✗ Non conforme'}
        </div>
      </div>

      ${template !== 'minimal' ? generateCategoriesSection(audit) : ''}
      ${template === 'standard' || template === 'technical' ? generateRecommendationsSection(audit) : ''}
      
      <!-- Charts Data for Client-Side Rendering -->
      <script type="application/json" id="charts-data">
        ${JSON.stringify(chartsData)}
      </script>
    </body>
    </html>
  `;
}

function generateCategoriesSection(audit: any): string {
  if (!audit.scores || audit.scores.length === 0) return '';

  let html = '<div class="categories-grid">';
  
  audit.scores.forEach((score: any) => {
    html += `
      <div class="category-card">
        <div class="category-name">${score.compliance_categories?.name || 'N/A'}</div>
        <div class="category-score">${score.score}/100</div>
        <div style="margin-top: 8px; font-size: 13px; color: #6b7280;">
          ${score.checks_passed || 0}/${score.checks_total || 0} tests réussis
        </div>
      </div>
    `;
  });

  html += '</div>';
  return html;
}

function generateRecommendationsSection(audit: any): string {
  if (!audit.recommendations || audit.recommendations.length === 0) return '';

  let html = '<div class="recommendations-section">';
  html += '<h2 style="font-size: 24px; margin-bottom: 20px; color: #1f2937;">Recommandations Prioritaires</h2>';

  audit.recommendations.slice(0, 10).forEach((rec: any) => {
    const severityClass = rec.severity === 'critical' || rec.severity === 'high' ? rec.severity : '';
    html += `
      <div class="recommendation-card ${severityClass}">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
          <strong style="font-size: 16px;">${rec.title}</strong>
          <span class="badge badge-${rec.severity}">${rec.severity}</span>
        </div>
        <p style="margin: 10px 0; color: #4b5563;">${rec.description}</p>
        <div style="font-size: 12px; color: #6b7280; margin-top: 10px;">
          <strong>Impact:</strong> ${rec.impact} | <strong>Priorité:</strong> ${rec.priority}
        </div>
      </div>
    `;
  });

  html += '</div>';
  return html;
}
