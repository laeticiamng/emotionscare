// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'npm:resend@4.0.0';
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

interface ReportRequest {
  dateRangeDays?: number;
  format: 'pdf' | 'csv' | 'both';
  includeCharts?: boolean;
  recipientEmails?: string[];
  scheduledReportId?: string;
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
    route: 'generate-analytics-report',
    userId: user.id,
    limit: 10,
    windowMs: 60_000,
    description: 'Analytics report generation (admin)',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      error: 'Too many requests',
      retryAfter: rateLimit.retryAfter,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const requestData: ReportRequest = await req.json();
    const dateRangeDays = requestData.dateRangeDays || 7;
    const format = requestData.format || 'pdf';
    const includeCharts = requestData.includeCharts !== false;

    console.log('Generating analytics report:', { dateRangeDays, format, includeCharts });

    // Récupérer les données analytics
    const { data: analytics, error: analyticsError } = await supabase
      .from('alert_analytics')
      .select('*')
      .gte('date', new Date(Date.now() - dateRangeDays * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: false });

    if (analyticsError) {
      console.error('Error fetching analytics:', analyticsError);
      throw analyticsError;
    }

    // Calculer les statistiques globales
    const totalAlerts = analytics.reduce((sum, row) => sum + (row.total_alerts || 0), 0);
    const resolvedCount = analytics.reduce((sum, row) => sum + (row.resolved_count || 0), 0);
    const unresolvedCount = analytics.reduce((sum, row) => sum + (row.unresolved_count || 0), 0);
    const criticalCount = analytics.reduce((sum, row) => sum + (row.critical_count || 0), 0);
    const resolutionRate = totalAlerts > 0 ? ((resolvedCount / totalAlerts) * 100).toFixed(1) : '0';
    
    const avgResolutionTimes = analytics
      .filter(row => row.avg_resolution_time_minutes !== null)
      .map(row => row.avg_resolution_time_minutes);
    const avgResolutionTime = avgResolutionTimes.length > 0
      ? (avgResolutionTimes.reduce((sum, time) => sum + time, 0) / avgResolutionTimes.length).toFixed(1)
      : '0';

    // Agréger par catégorie
    const categoryMap = new Map<string, number>();
    analytics.forEach(row => {
      if (row.category) {
        categoryMap.set(row.category, (categoryMap.get(row.category) || 0) + (row.category_count || 0));
      }
    });
    const topCategories = Array.from(categoryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    let csvContent = '';
    let htmlContent = '';

    // Générer le CSV
    if (format === 'csv' || format === 'both') {
      csvContent = generateCSV(analytics, {
        totalAlerts,
        resolvedCount,
        unresolvedCount,
        criticalCount,
        resolutionRate,
        avgResolutionTime,
        topCategories
      });
    }

    // Générer le HTML/PDF
    if (format === 'pdf' || format === 'both') {
      htmlContent = generateHTML(analytics, {
        totalAlerts,
        resolvedCount,
        unresolvedCount,
        criticalCount,
        resolutionRate,
        avgResolutionTime,
        topCategories,
        dateRangeDays
      });
    }

    // Si des emails sont fournis, envoyer le rapport
    if (requestData.recipientEmails && requestData.recipientEmails.length > 0) {
      const attachments = [];

      if (csvContent) {
        attachments.push({
          filename: `analytics-report-${new Date().toISOString().split('T')[0]}.csv`,
          content: Buffer.from(csvContent).toString('base64'),
        });
      }

      const emailResult = await resend.emails.send({
        from: 'EmotionsCare Analytics <alerts@emotionscare.com>',
        to: requestData.recipientEmails,
        subject: `📊 Rapport Analytics EmotionsCare - ${dateRangeDays} derniers jours`,
        html: htmlContent || `<p>Rapport analytics des ${dateRangeDays} derniers jours</p>`,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      console.log('Email sent:', emailResult);

      // Enregistrer dans l'historique si c'est un rapport programmé
      if (requestData.scheduledReportId) {
        await supabase.from('report_send_history').insert({
          scheduled_report_id: requestData.scheduledReportId,
          recipient_emails: requestData.recipientEmails,
          status: emailResult.error ? 'failed' : 'success',
          error_message: emailResult.error ? JSON.stringify(emailResult.error) : null,
          report_data: {
            totalAlerts,
            resolvedCount,
            resolutionRate,
            avgResolutionTime
          }
        });

        // Mettre à jour last_sent_at
        await supabase
          .from('scheduled_reports')
          .update({ last_sent_at: new Date().toISOString() })
          .eq('id', requestData.scheduledReportId);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Report sent successfully',
          emailId: emailResult.data?.id 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Sinon, retourner les données pour téléchargement
    return new Response(
      JSON.stringify({ 
        success: true,
        csv: csvContent,
        html: htmlContent,
        stats: {
          totalAlerts,
          resolvedCount,
          unresolvedCount,
          criticalCount,
          resolutionRate,
          avgResolutionTime,
          topCategories
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error generating report:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateCSV(analytics: any[], stats: any): string {
  let csv = 'Rapport Analytics EmotionsCare\n\n';
  csv += 'Statistiques Globales\n';
  csv += `Total Alertes,${stats.totalAlerts}\n`;
  csv += `Résolues,${stats.resolvedCount}\n`;
  csv += `Non Résolues,${stats.unresolvedCount}\n`;
  csv += `Critiques,${stats.criticalCount}\n`;
  csv += `Taux de Résolution,${stats.resolutionRate}%\n`;
  csv += `Temps Moyen de Résolution,${stats.avgResolutionTime} min\n\n`;

  csv += 'Top Catégories\n';
  csv += 'Catégorie,Nombre\n';
  stats.topCategories.forEach(([category, count]: [string, number]) => {
    csv += `${category},${count}\n`;
  });

  csv += '\nDétails par Date\n';
  csv += 'Date,Total,Résolues,Non Résolues,Critiques,Haute Priorité,Urgent,Temps Résolution (min)\n';
  analytics.forEach(row => {
    csv += `${row.date},${row.total_alerts},${row.resolved_count},${row.unresolved_count},`;
    csv += `${row.critical_count},${row.high_count},${row.urgent_count},${row.avg_resolution_time_minutes || 'N/A'}\n`;
  });

  return csv;
}

function generateHTML(analytics: any[], stats: any): string {
  const dateStr = new Date().toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rapport Analytics EmotionsCare</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #1f2937;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    h2 {
      color: #374151;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    .stat-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 15px;
    }
    .stat-label {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 5px;
    }
    .stat-value {
      font-size: 28px;
      font-weight: bold;
      color: #1f2937;
    }
    .stat-unit {
      font-size: 14px;
      color: #6b7280;
      margin-left: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    th {
      background: #f9fafb;
      font-weight: 600;
      color: #374151;
    }
    tr:hover {
      background: #f9fafb;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge-success {
      background: #dcfce7;
      color: #166534;
    }
    .badge-warning {
      background: #fef3c7;
      color: #92400e;
    }
    .badge-danger {
      background: #fee2e2;
      color: #991b1b;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 Rapport Analytics EmotionsCare</h1>
    <p><strong>Période:</strong> ${stats.dateRangeDays} derniers jours | <strong>Généré le:</strong> ${dateStr}</p>

    <h2>Statistiques Globales</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total Alertes</div>
        <div class="stat-value">${stats.totalAlerts}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Taux de Résolution</div>
        <div class="stat-value">${stats.resolutionRate}<span class="stat-unit">%</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Temps Moyen</div>
        <div class="stat-value">${stats.avgResolutionTime}<span class="stat-unit">min</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Alertes Critiques</div>
        <div class="stat-value">${stats.criticalCount}</div>
      </div>
    </div>

    <h2>Top 10 Catégories d'Erreurs</h2>
    <table>
      <thead>
        <tr>
          <th>Catégorie</th>
          <th>Nombre</th>
          <th>Pourcentage</th>
        </tr>
      </thead>
      <tbody>
        ${stats.topCategories.map(([category, count]: [string, number]) => {
          const percentage = ((count / stats.totalAlerts) * 100).toFixed(1);
          return `
            <tr>
              <td><strong>${category}</strong></td>
              <td>${count}</td>
              <td>${percentage}%</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>

    <h2>Évolution Quotidienne</h2>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Total</th>
          <th>Résolues</th>
          <th>Critiques</th>
          <th>Temps Résolution</th>
        </tr>
      </thead>
      <tbody>
        ${analytics.slice(0, 15).map(row => `
          <tr>
            <td>${new Date(row.date).toLocaleDateString('fr-FR')}</td>
            <td>${row.total_alerts}</td>
            <td><span class="badge badge-success">${row.resolved_count}</span></td>
            <td><span class="badge badge-danger">${row.critical_count}</span></td>
            <td>${row.avg_resolution_time_minutes ? row.avg_resolution_time_minutes + ' min' : 'N/A'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="footer">
      <p>Ce rapport a été généré automatiquement par EmotionsCare AI Monitoring</p>
      <p>&copy; ${new Date().getFullYear()} EmotionsCare. Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>
  `;
}
