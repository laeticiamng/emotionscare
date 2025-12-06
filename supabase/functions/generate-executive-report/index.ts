// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExecutiveReportData {
  yearlyTrend: any;
  comparison: any;
  recommendations: any[];
  kpis: any;
}

/**
 * Edge function pour générer un rapport PDF exécutif RGPD
 * Génère un rapport PDF avec graphiques et recommandations stratégiques
 */
Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { reportData } = await req.json() as { reportData: ExecutiveReportData };

    console.log('[Executive Report] Generating PDF report', {
      kpis: reportData.kpis,
      monthsCount: reportData.yearlyTrend.months.length,
      recommendationsCount: reportData.recommendations.length,
    });

    // Générer le contenu HTML du rapport
    const htmlContent = generateReportHTML(reportData);

    // Dans une vraie implémentation, on utiliserait un service comme Puppeteer ou une API PDF
    // Pour l'instant, on retourne le HTML qui peut être converti en PDF côté client
    const reportHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rapport Exécutif RGPD - ${new Date().toLocaleDateString('fr-FR')}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
      padding: 40px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #2563eb;
    }
    .header h1 {
      color: #1e40af;
      font-size: 32px;
      margin-bottom: 10px;
    }
    .header p {
      color: #6b7280;
      font-size: 14px;
    }
    .section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }
    .section h2 {
      color: #1e40af;
      font-size: 24px;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }
    .kpi-card {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #2563eb;
    }
    .kpi-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .kpi-value {
      font-size: 32px;
      font-weight: bold;
      color: #1e40af;
    }
    .kpi-trend {
      font-size: 14px;
      margin-top: 5px;
    }
    .kpi-trend.positive {
      color: #059669;
    }
    .kpi-trend.negative {
      color: #dc2626;
    }
    .recommendation {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      border-left: 4px solid #f59e0b;
    }
    .recommendation.high {
      border-left-color: #dc2626;
    }
    .recommendation.medium {
      border-left-color: #f59e0b;
    }
    .recommendation.low {
      border-left-color: #2563eb;
    }
    .recommendation h3 {
      color: #1e40af;
      font-size: 18px;
      margin-bottom: 10px;
    }
    .recommendation .badges {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge-high {
      background: #fecaca;
      color: #991b1b;
    }
    .badge-medium {
      background: #fed7aa;
      color: #92400e;
    }
    .badge-low {
      background: #bfdbfe;
      color: #1e40af;
    }
    .action-items {
      margin-top: 15px;
    }
    .action-items ul {
      list-style: none;
      padding-left: 0;
    }
    .action-items li {
      padding: 8px 0;
      padding-left: 25px;
      position: relative;
    }
    .action-items li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #2563eb;
      font-weight: bold;
    }
    .chart-placeholder {
      background: #f3f4f6;
      height: 200px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      margin: 20px 0;
    }
    .comparison-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .comparison-table th,
    .comparison-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    .comparison-table th {
      background: #f9fafb;
      font-weight: 600;
      color: #374151;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    @media print {
      body {
        padding: 20px;
      }
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>
    `;

    console.log('[Executive Report] PDF HTML generated successfully');

    return new Response(
      JSON.stringify({
        success: true,
        html: reportHtml,
        generatedAt: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[Executive Report] Error:', error);

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

/**
 * Générer le contenu HTML du rapport
 */
function generateReportHTML(data: ExecutiveReportData): string {
  const date = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const riskLabels = {
    low: 'Faible',
    medium: 'Moyen',
    high: 'Élevé',
    critical: 'Critique',
  };

  return `
    <div class="header">
      <h1>Rapport Exécutif RGPD</h1>
      <p>Généré le ${date}</p>
      <p>Conformité et Recommandations Stratégiques</p>
    </div>

    <!-- KPIs Exécutifs -->
    <div class="section">
      <h2>Indicateurs Clés de Performance</h2>
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Score de Conformité Global</div>
          <div class="kpi-value">${data.kpis.overallCompliance}/100</div>
          ${data.kpis.monthlyImprovement !== 0 ? `
            <div class="kpi-trend ${data.kpis.monthlyImprovement > 0 ? 'positive' : 'negative'}">
              ${data.kpis.monthlyImprovement > 0 ? '↑' : '↓'} ${Math.abs(data.kpis.monthlyImprovement).toFixed(1)}% ce mois
            </div>
          ` : ''}
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Niveau de Risque</div>
          <div class="kpi-value">${riskLabels[data.kpis.riskLevel as keyof typeof riskLabels]}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Amélioration Mensuelle</div>
          <div class="kpi-value">${Math.abs(data.kpis.monthlyImprovement).toFixed(1)}%</div>
          <div class="kpi-trend ${data.kpis.monthlyImprovement >= 0 ? 'positive' : 'negative'}">
            ${data.kpis.monthlyImprovement >= 0 ? 'Progression' : 'Régression'}
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Coût Potentiel de Non-Conformité</div>
          <div class="kpi-value">${(data.kpis.costOfNonCompliance / 1000).toFixed(0)}K€</div>
        </div>
      </div>
    </div>

    <!-- Tendances Annuelles -->
    <div class="section">
      <h2>Tendances Annuelles ${data.yearlyTrend.year}</h2>
      <p><strong>Score moyen:</strong> ${data.yearlyTrend.averageScore.toFixed(1)}/100</p>
      <p><strong>Total d'actions:</strong> ${data.yearlyTrend.totalActions.toLocaleString('fr-FR')}</p>
      <p><strong>Taux d'amélioration annuel:</strong> 
        <span class="${data.yearlyTrend.improvementRate >= 0 ? 'kpi-trend positive' : 'kpi-trend negative'}">
          ${data.yearlyTrend.improvementRate > 0 ? '+' : ''}${data.yearlyTrend.improvementRate.toFixed(1)}%
        </span>
      </p>
      <div class="chart-placeholder">
        [Graphique des tendances sur 12 mois - ${data.yearlyTrend.months.length} points de données]
      </div>
    </div>

    <!-- Comparaison Mensuelle -->
    <div class="section">
      <h2>Comparaison Mensuelle</h2>
      <p><strong>${data.comparison.currentMonth.month}</strong> vs <strong>${data.comparison.previousMonth.month}</strong></p>
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Métrique</th>
            <th>Mois Précédent</th>
            <th>Mois Actuel</th>
            <th>Évolution</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Score de conformité</td>
            <td>${data.comparison.previousMonth.complianceScore}/100</td>
            <td>${data.comparison.currentMonth.complianceScore}/100</td>
            <td class="${data.comparison.percentageChanges.score >= 0 ? 'kpi-trend positive' : 'kpi-trend negative'}">
              ${data.comparison.percentageChanges.score > 0 ? '+' : ''}${data.comparison.percentageChanges.score.toFixed(1)}%
            </td>
          </tr>
          <tr>
            <td>Consentements</td>
            <td>${data.comparison.previousMonth.consents}</td>
            <td>${data.comparison.currentMonth.consents}</td>
            <td class="${data.comparison.percentageChanges.consents >= 0 ? 'kpi-trend positive' : 'kpi-trend negative'}">
              ${data.comparison.percentageChanges.consents > 0 ? '+' : ''}${data.comparison.percentageChanges.consents.toFixed(1)}%
            </td>
          </tr>
          <tr>
            <td>Exports</td>
            <td>${data.comparison.previousMonth.exports}</td>
            <td>${data.comparison.currentMonth.exports}</td>
            <td>${data.comparison.percentageChanges.exports > 0 ? '+' : ''}${data.comparison.percentageChanges.exports.toFixed(1)}%</td>
          </tr>
          <tr>
            <td>Suppressions</td>
            <td>${data.comparison.previousMonth.deletions}</td>
            <td>${data.comparison.currentMonth.deletions}</td>
            <td>${data.comparison.percentageChanges.deletions > 0 ? '+' : ''}${data.comparison.percentageChanges.deletions.toFixed(1)}%</td>
          </tr>
          <tr>
            <td>Alertes</td>
            <td>${data.comparison.previousMonth.alerts}</td>
            <td>${data.comparison.currentMonth.alerts}</td>
            <td class="${data.comparison.percentageChanges.alerts <= 0 ? 'kpi-trend positive' : 'kpi-trend negative'}">
              ${data.comparison.percentageChanges.alerts > 0 ? '+' : ''}${data.comparison.percentageChanges.alerts.toFixed(1)}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Recommandations Stratégiques -->
    <div class="section">
      <h2>Recommandations Stratégiques</h2>
      ${data.recommendations.map(rec => `
        <div class="recommendation ${rec.priority}">
          <div class="badges">
            <span class="badge badge-${rec.priority}">Priorité ${rec.priority === 'high' ? 'Haute' : rec.priority === 'medium' ? 'Moyenne' : 'Basse'}</span>
            <span class="badge">${rec.category}</span>
          </div>
          <h3>${rec.title}</h3>
          <p>${rec.description}</p>
          <p style="margin-top: 10px;"><strong>Impact:</strong> ${rec.impact}</p>
          <p><strong>Délai estimé:</strong> ${rec.estimatedTimeframe}</p>
          <div class="action-items">
            <strong>Plan d'action:</strong>
            <ul>
              ${rec.actionItems.map((item: string) => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="footer">
      <p>Ce rapport a été généré automatiquement par le système de monitoring RGPD</p>
      <p>Confidentiel - Usage interne uniquement</p>
    </div>
  `;
}
