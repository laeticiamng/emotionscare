/**
 * Service de génération de templates HTML pour les rapports d'audit
 */

export interface ReportData {
  period: {
    start: string;
    end: string;
  };
  stats: {
    totalChanges: number;
    totalAlerts: number;
    criticalAlerts: number;
    changesByAction: Record<string, number>;
    alertsBySeverity: Record<string, number>;
  };
  topAdmins?: Array<{ email: string; count: number }>;
}

/**
 * Génère le HTML d'un rapport d'audit
 */
export function generateReportHTML(data: ReportData): string {
  const { period, stats } = data;
  const startDate = new Date(period.start).toLocaleDateString('fr-FR');
  const endDate = new Date(period.end).toLocaleDateString('fr-FR');

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rapport d'audit - ${startDate} au ${endDate}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    h1 {
      color: #1e40af;
      margin: 0 0 10px 0;
      font-size: 28px;
    }
    .period {
      color: #6b7280;
      font-size: 14px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    .stat-card {
      background: #f9fafb;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      border-radius: 4px;
    }
    .stat-card.warning {
      border-left-color: #f59e0b;
    }
    .stat-card.danger {
      border-left-color: #ef4444;
    }
    .stat-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    .stat-value {
      font-size: 32px;
      font-weight: bold;
      color: #1f2937;
    }
    .section {
      margin: 30px 0;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
    }
    .breakdown-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #f3f4f6;
    }
    .breakdown-item:last-child {
      border-bottom: none;
    }
    .breakdown-label {
      color: #4b5563;
    }
    .breakdown-value {
      font-weight: 600;
      color: #1f2937;
      font-size: 18px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    .alert-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      margin-left: 10px;
    }
    .alert-badge.critical {
      background: #fee2e2;
      color: #991b1b;
    }
    .alert-badge.high {
      background: #fed7aa;
      color: #9a3412;
    }
    .alert-badge.medium {
      background: #fef3c7;
      color: #92400e;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Rapport d'audit hebdomadaire</h1>
      <p class="period">Période : ${startDate} au ${endDate}</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total modifications</div>
        <div class="stat-value">${stats.totalChanges}</div>
      </div>
      <div class="stat-card warning">
        <div class="stat-label">Alertes totales</div>
        <div class="stat-value">${stats.totalAlerts}</div>
      </div>
      <div class="stat-card danger">
        <div class="stat-label">Alertes critiques</div>
        <div class="stat-value">${stats.criticalAlerts}</div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Répartition par action</h2>
      ${Object.entries(stats.changesByAction)
        .map(
          ([action, count]) => `
        <div class="breakdown-item">
          <span class="breakdown-label">${getActionLabel(action)}</span>
          <span class="breakdown-value">${count}</span>
        </div>
      `
        )
        .join('')}
    </div>

    <div class="section">
      <h2 class="section-title">Alertes par sévérité</h2>
      ${Object.entries(stats.alertsBySeverity)
        .map(
          ([severity, count]) => `
        <div class="breakdown-item">
          <span class="breakdown-label">
            ${getSeverityLabel(severity)}
            <span class="alert-badge ${severity}">${severity}</span>
          </span>
          <span class="breakdown-value">${count}</span>
        </div>
      `
        )
        .join('')}
    </div>

    ${
      data.topAdmins && data.topAdmins.length > 0
        ? `
    <div class="section">
      <h2 class="section-title">Top administrateurs actifs</h2>
      ${data.topAdmins
        .slice(0, 5)
        .map(
          (admin, index) => `
        <div class="breakdown-item">
          <span class="breakdown-label">${index + 1}. ${admin.email}</span>
          <span class="breakdown-value">${admin.count}</span>
        </div>
      `
        )
        .join('')}
    </div>
    `
        : ''
    }

    <div class="footer">
      <p>Ce rapport a été généré automatiquement par EmotionsCare</p>
      <p>Pour plus d'informations, consultez le tableau de bord d'administration</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function getActionLabel(action: string): string {
  const labels: Record<string, string> = {
    add: 'Ajouts de rôles',
    remove: 'Suppressions de rôles',
    update: 'Modifications de rôles',
  };
  return labels[action] || action;
}

function getSeverityLabel(severity: string): string {
  const labels: Record<string, string> = {
    critical: 'Critique',
    high: 'Élevée',
    medium: 'Moyenne',
    low: 'Faible',
  };
  return labels[severity] || severity;
}

/**
 * Génère un aperçu texte du rapport
 */
export function generateReportPreview(data: ReportData): string {
  const { period, stats } = data;
  const startDate = new Date(period.start).toLocaleDateString('fr-FR');
  const endDate = new Date(period.end).toLocaleDateString('fr-FR');

  return `
📊 Rapport d'audit hebdomadaire
Période : ${startDate} au ${endDate}

📈 Statistiques principales :
• Total modifications : ${stats.totalChanges}
• Alertes totales : ${stats.totalAlerts}
• Alertes critiques : ${stats.criticalAlerts}

🔄 Répartition par action :
${Object.entries(stats.changesByAction)
  .map(([action, count]) => `• ${getActionLabel(action)} : ${count}`)
  .join('\n')}

⚠️ Alertes par sévérité :
${Object.entries(stats.alertsBySeverity)
  .map(([severity, count]) => `• ${getSeverityLabel(severity)} : ${count}`)
  .join('\n')}
  `.trim();
}
