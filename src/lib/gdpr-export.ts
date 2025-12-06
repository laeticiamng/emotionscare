import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface ExportOptions {
  startDate?: string;
  endDate?: string;
  includeAlerts?: boolean;
  includeConsents?: boolean;
  includeExports?: boolean;
  includeAuditLogs?: boolean;
}

/**
 * Exporter le rapport RGPD en CSV
 */
export const exportGDPRReportCSV = async (options: ExportOptions = {}): Promise<void> => {
  try {
    const { data, error } = await supabase.functions.invoke('gdpr-report-export', {
      body: {
        format: 'csv',
        ...options,
      },
    });

    if (error) throw error;

    // Télécharger le fichier CSV
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `gdpr-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logger.info('GDPR report exported as CSV', undefined, 'GDPR');
  } catch (error) {
    logger.error('Error exporting GDPR report as CSV', error as Error, 'GDPR');
    throw error;
  }
};

/**
 * Exporter le rapport RGPD en JSON détaillé
 */
export const exportGDPRReportJSON = async (options: ExportOptions = {}): Promise<void> => {
  try {
    const { data, error } = await supabase.functions.invoke('gdpr-report-export', {
      body: {
        format: 'json',
        ...options,
      },
    });

    if (error) throw error;

    // Télécharger le fichier JSON
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `gdpr-report-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logger.info('GDPR report exported as JSON', undefined, 'GDPR');
  } catch (error) {
    logger.error('Error exporting GDPR report as JSON', error as Error, 'GDPR');
    throw error;
  }
};

/**
 * Générer un rapport PDF via impression navigateur
 */
export const printGDPRReport = async (options: ExportOptions = {}): Promise<void> => {
  try {
    const { data, error } = await supabase.functions.invoke('gdpr-report-export', {
      body: {
        format: 'json',
        ...options,
      },
    });

    if (error) throw error;

    // Créer une page HTML pour l'impression
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Impossible d\'ouvrir la fenêtre d\'impression');
    }

    const html = generatePrintableHTML(data);
    printWindow.document.write(html);
    printWindow.document.close();

    // Attendre que le contenu soit chargé puis lancer l'impression
    printWindow.onload = () => {
      printWindow.print();
    };

    logger.info('GDPR report prepared for printing', undefined, 'GDPR');
  } catch (error) {
    logger.error('Error preparing GDPR report for print', error as Error, 'GDPR');
    throw error;
  }
};

/**
 * Générer HTML imprimable pour le rapport
 */
function generatePrintableHTML(data: any): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Rapport RGPD - EmotionsCare</title>
        <style>
          @media print {
            @page { margin: 2cm; }
            body { margin: 0; }
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            color: #2563eb;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 10px;
            margin-bottom: 30px;
          }
          h2 {
            color: #1e40af;
            margin-top: 40px;
            margin-bottom: 20px;
            border-left: 4px solid #2563eb;
            padding-left: 15px;
          }
          .metadata {
            background: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .stat-box {
            background: #fff;
            border: 1px solid #e5e7eb;
            padding: 15px;
            margin: 10px 0;
            border-radius: 6px;
          }
          .stat-label {
            font-weight: 600;
            color: #4b5563;
          }
          .stat-value {
            font-size: 1.5em;
            color: #2563eb;
            font-weight: bold;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #e5e7eb;
            padding: 12px;
            text-align: left;
          }
          th {
            background: #f9fafb;
            font-weight: 600;
            color: #374151;
          }
          tr:nth-child(even) {
            background: #f9fafb;
          }
          .alert-critical { color: #dc2626; font-weight: bold; }
          .alert-warning { color: #ea580c; font-weight: bold; }
          .alert-info { color: #2563eb; }
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 0.9em;
          }
        </style>
      </head>
      <body>
        <h1>📊 Rapport de Conformité RGPD</h1>
        
        <div class="metadata">
          <p><strong>Généré le:</strong> ${new Date(data.metadata.generatedAt).toLocaleString('fr-FR')}</p>
          <p><strong>Période:</strong> ${data.metadata.period.start} - ${data.metadata.period.end}</p>
          <p><strong>Par:</strong> ${data.metadata.generatedBy}</p>
        </div>

        ${data.sections.alerts ? generateAlertsSection(data.sections.alerts) : ''}
        ${data.sections.consents ? generateConsentsSection(data.sections.consents) : ''}
        ${data.sections.exports ? generateExportsSection(data.sections.exports) : ''}
        ${data.sections.auditLogs ? generateAuditSection(data.sections.auditLogs) : ''}

        <div class="footer">
          <p>EmotionsCare - Rapport confidentiel</p>
          <p>Document généré automatiquement - Ne pas diffuser</p>
        </div>
      </body>
    </html>
  `;
}

function generateAlertsSection(alerts: any[]): string {
  const critical = alerts.filter((a: any) => a.severity === 'critical').length;
  const warning = alerts.filter((a: any) => a.severity === 'warning').length;
  const resolved = alerts.filter((a: any) => a.resolved).length;

  return `
    <h2>🚨 Alertes RGPD</h2>
    <div class="stat-box">
      <div class="stat-label">Total d'alertes</div>
      <div class="stat-value">${alerts.length}</div>
    </div>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
      <div class="stat-box">
        <div class="stat-label">Critiques</div>
        <div class="stat-value alert-critical">${critical}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Warnings</div>
        <div class="stat-value alert-warning">${warning}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Résolues</div>
        <div class="stat-value">${resolved}</div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Sévérité</th>
          <th>Titre</th>
          <th>Statut</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${alerts.slice(0, 20).map((alert: any) => `
          <tr>
            <td>${alert.alert_type}</td>
            <td class="alert-${alert.severity}">${alert.severity}</td>
            <td>${alert.title}</td>
            <td>${alert.resolved ? '✅ Résolu' : '⏳ En cours'}</td>
            <td>${new Date(alert.created_at).toLocaleString('fr-FR')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function generateConsentsSection(consents: any): string {
  const { summary } = consents;
  return `
    <h2>✅ Consentements</h2>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
      <div class="stat-box">
        <div class="stat-label">Total</div>
        <div class="stat-value">${summary.total}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Taux d'acceptation</div>
        <div class="stat-value">${summary.acceptanceRate}%</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Analytics acceptés</div>
        <div class="stat-value">${summary.analyticsAccepted}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Analytics refusés</div>
        <div class="stat-value">${summary.analyticsRefused}</div>
      </div>
    </div>
  `;
}

function generateExportsSection(exports: any): string {
  const { summary } = exports;
  return `
    <h2>📥 Demandes d'export</h2>
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
      <div class="stat-box">
        <div class="stat-label">Total</div>
        <div class="stat-value">${summary.total}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">En attente</div>
        <div class="stat-value">${summary.pending}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Complétées</div>
        <div class="stat-value">${summary.completed}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Échouées</div>
        <div class="stat-value alert-critical">${summary.failed}</div>
      </div>
    </div>
  `;
}

function generateAuditSection(logs: any[]): string {
  return `
    <h2>📋 Journaux d'audit</h2>
    <p><strong>${logs.length}</strong> événements récents</p>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Événement</th>
          <th>Cible</th>
        </tr>
      </thead>
      <tbody>
        ${logs.slice(0, 50).map((log: any) => `
          <tr>
            <td>${new Date(log.occurred_at).toLocaleString('fr-FR')}</td>
            <td>${log.event}</td>
            <td>${log.target || 'N/A'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/**
 * Générer un rapport mensuel automatique
 */
export const generateMonthlyReport = async (year: number, month: number): Promise<void> => {
  const startDate = new Date(year, month - 1, 1).toISOString();
  const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();

  const options: ExportOptions = {
    startDate,
    endDate,
    includeAlerts: true,
    includeConsents: true,
    includeExports: true,
    includeAuditLogs: true,
  };

  await exportGDPRReportCSV(options);
};
