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
  const trendSVG = generateTrendChartSVG(history);
  const radarSVG = generateRadarChartSVG(audit.scores);
  const barSVG = generateSeverityBarChartSVG(audit.recommendations);

  return { trendSVG, radarSVG, barSVG };
}

function generateTrendChartSVG(history: any[]): string {
  if (!history || history.length === 0) return '';
  
  const width = 800;
  const height = 300;
  const padding = 60;
  const maxScore = 100;
  
  const points = history.map((h, i) => ({
    x: padding + (i / (history.length - 1)) * (width - 2 * padding),
    y: height - padding - ((h.overall_score / maxScore) * (height - 2 * padding)),
    score: h.overall_score,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  const areaD = `${pathD} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.4"/>
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.05"/>
        </linearGradient>
      </defs>
      <text x="${width/2}" y="25" text-anchor="middle" font-size="18" font-weight="600" fill="#1f2937">
        Évolution du Score (${history.length} derniers audits)
      </text>
      ${[0, 25, 50, 75, 100].map(val => {
        const y = height - padding - ((val / maxScore) * (height - 2 * padding));
        return `
          <line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="#e5e7eb" stroke-width="1"/>
          <text x="${padding - 10}" y="${y + 5}" text-anchor="end" font-size="12" fill="#6b7280">${val}</text>
        `;
      }).join('')}
      <path d="${areaD}" fill="url(#areaGradient)"/>
      <path d="${pathD}" fill="none" stroke="#3b82f6" stroke-width="3"/>
      ${points.map(p => `
        <circle cx="${p.x}" cy="${p.y}" r="5" fill="#3b82f6" stroke="white" stroke-width="2"/>
      `).join('')}
      <text x="${padding}" y="${height - 10}" font-size="12" fill="#6b7280">Anciens</text>
      <text x="${width - padding}" y="${height - 10}" text-anchor="end" font-size="12" fill="#6b7280">Récent</text>
    </svg>
  `;
}

function generateRadarChartSVG(scores: any[]): string {
  if (!scores || scores.length === 0) return '';
  
  const size = 400;
  const center = size / 2;
  const radius = 150;
  const categories = scores.slice(0, 6);
  const angleStep = (2 * Math.PI) / categories.length;

  const points = categories.map((s, i) => {
    const angle = -Math.PI / 2 + i * angleStep;
    const normalized = (s.score || 0) / 100;
    return {
      x: center + radius * normalized * Math.cos(angle),
      y: center + radius * normalized * Math.sin(angle),
      labelX: center + (radius + 40) * Math.cos(angle),
      labelY: center + (radius + 40) * Math.sin(angle),
      name: s.compliance_categories?.category_code || 'N/A',
    };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';

  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <text x="${center}" y="25" text-anchor="middle" font-size="18" font-weight="600" fill="#1f2937">
        Scores par Catégorie
      </text>
      ${[0.2, 0.4, 0.6, 0.8, 1].map(factor => {
        const r = radius * factor;
        const hexPoints = categories.map((_, i) => {
          const angle = -Math.PI / 2 + i * angleStep;
          return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
        }).join(' ');
        return `<polygon points="${hexPoints}" fill="none" stroke="#e5e7eb" stroke-width="1"/>`;
      }).join('')}
      <path d="${pathD}" fill="rgba(139, 92, 246, 0.3)" stroke="#8b5cf6" stroke-width="2"/>
      ${points.map(p => `
        <circle cx="${p.x}" cy="${p.y}" r="4" fill="#8b5cf6" stroke="white" stroke-width="2"/>
        <text x="${p.labelX}" y="${p.labelY}" text-anchor="middle" font-size="11" fill="#374151" font-weight="500">
          ${p.name}
        </text>
      `).join('')}
    </svg>
  `;
}

function generateSeverityBarChartSVG(recommendations: any[]): string {
  if (!recommendations || recommendations.length === 0) return '';
  
  const width = 600;
  const height = 300;
  const padding = 60;
  
  const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
  recommendations.forEach((rec: any) => {
    if (severityCounts.hasOwnProperty(rec.severity)) {
      severityCounts[rec.severity as keyof typeof severityCounts]++;
    }
  });

  const data = [
    { label: 'Critique', count: severityCounts.critical, color: '#ef4444' },
    { label: 'Haute', count: severityCounts.high, color: '#f59e0b' },
    { label: 'Moyenne', count: severityCounts.medium, color: '#fbbf24' },
    { label: 'Basse', count: severityCounts.low, color: '#10b981' },
  ];

  const maxCount = Math.max(...data.map(d => d.count), 1);
  const barWidth = (width - 2 * padding) / data.length - 20;

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <text x="${width/2}" y="25" text-anchor="middle" font-size="18" font-weight="600" fill="#1f2937">
        Recommandations par Sévérité
      </text>
      ${data.map((d, i) => {
        const x = padding + i * ((width - 2 * padding) / data.length);
        const barHeight = (d.count / maxCount) * (height - 2 * padding);
        const y = height - padding - barHeight;
        return `
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" 
                fill="${d.color}" rx="4"/>
          <text x="${x + barWidth/2}" y="${y - 10}" text-anchor="middle" 
                font-size="16" font-weight="600" fill="#1f2937">${d.count}</text>
          <text x="${x + barWidth/2}" y="${height - padding + 25}" text-anchor="middle" 
                font-size="13" fill="#6b7280">${d.label}</text>
        `;
      }).join('')}
    </svg>
  `;
}

function generateEnhancedHTML(audit: any, chartsData: any, template: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Rapport RGPD - EmotionsCare</title>
      <style>
        @page { size: A4; margin: 1cm; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          color: #1f2937;
          max-width: 1200px;
          margin: 0 auto;
          line-height: 1.6;
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
          text-align: center;
          page-break-inside: avoid;
        }
        .chart-svg {
          max-width: 100%;
          height: auto;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📊 Rapport d'Audit RGPD - Haute Qualité</h1>
        <p style="font-size: 14px; color: #6b7280;">
          EmotionsCare - ${new Date().toLocaleDateString('fr-FR', { 
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })}
        </p>
      </div>

      <div class="score-banner">
        <div style="font-size: 16px; opacity: 0.9;">Score Global de Conformité</div>
        <div class="score-value">${audit.overall_score}<span style="font-size: 36px;">/100</span></div>
      </div>

      <div class="chart-container">
        ${chartsData.trendSVG}
      </div>

      <div class="chart-container">
        ${chartsData.radarSVG}
      </div>

      <div class="chart-container">
        ${chartsData.barSVG}
      </div>

      ${template !== 'minimal' ? generateCategoriesSection(audit) : ''}
      ${template === 'standard' || template === 'technical' ? generateRecommendationsSection(audit) : ''}
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
