/**
 * PDF Export Service pour les scans émotionnels
 * Génère des rapports PDF détaillés avec graphiques et statistiques
 */

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface ScanDataForExport {
  id: string;
  valence: number;
  arousal: number;
  emotion?: string;
  source: string;
  created_at: string;
  summary?: string;
}

export interface ExportStats {
  avgValence: number;
  avgArousal: number;
  totalScans: number;
  topEmotions: string[];
  periodStart: string;
  periodEnd: string;
}

/**
 * Génère un PDF de rapport émotionnel
 */
export async function generateEmotionReport(
  scans: ScanDataForExport[],
  stats: ExportStats,
  userName?: string
): Promise<Blob> {
  // Créer le contenu HTML du rapport
  const html = generateReportHTML(scans, stats, userName);
  
  // Convertir en Blob (pour impression/téléchargement)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  return blob;
}

/**
 * Génère le HTML du rapport
 */
function generateReportHTML(
  scans: ScanDataForExport[],
  stats: ExportStats,
  userName?: string
): string {
  const title = `Rapport Émotionnel - ${userName || 'Utilisateur'}`;
  const dateRange = `${format(new Date(stats.periodStart), 'dd MMMM yyyy', { locale: fr })} - ${format(new Date(stats.periodEnd), 'dd MMMM yyyy', { locale: fr })}`;
  
  const getEmotionLabel = (valence: number, arousal: number): string => {
    if (valence > 60 && arousal > 60) return 'Énergique et positif';
    if (valence > 60 && arousal <= 60) return 'Calme et serein';
    if (valence <= 40 && arousal > 60) return 'Tension ressentie';
    if (valence <= 40 && arousal <= 60) return 'Apaisement recherché';
    return 'État neutre';
  };

  const sourceLabels: Record<string, string> = {
    'scan_camera': 'Caméra',
    'scan_sliders': 'Manuel',
    'SAM': 'SAM',
    'voice': 'Vocal',
    'scan_text': 'Texte',
    'scan_multi': 'Multi-source'
  };

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1a1a2e;
      background: #fff;
      padding: 40px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e5e5e5;
    }
    .header h1 {
      font-size: 28px;
      color: #6366f1;
      margin-bottom: 8px;
    }
    .header p {
      color: #666;
      font-size: 14px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 40px;
    }
    .stat-card {
      background: linear-gradient(135deg, #f5f5ff 0%, #fff 100%);
      border: 1px solid #e5e5ff;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }
    .stat-value {
      font-size: 32px;
      font-weight: bold;
      color: #6366f1;
    }
    .stat-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .section {
      margin-bottom: 40px;
    }
    .section h2 {
      font-size: 18px;
      color: #1a1a2e;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e5e5;
    }
    .scan-table {
      width: 100%;
      border-collapse: collapse;
    }
    .scan-table th,
    .scan-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e5e5e5;
    }
    .scan-table th {
      background: #f8f9fa;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      color: #666;
    }
    .scan-table tr:hover {
      background: #fafafa;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 500;
    }
    .badge-positive { background: #dcfce7; color: #166534; }
    .badge-calm { background: #e0f2fe; color: #0c4a6e; }
    .badge-tension { background: #ffedd5; color: #9a3412; }
    .badge-low { background: #f3e8ff; color: #6b21a8; }
    .badge-neutral { background: #f3f4f6; color: #374151; }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
    @media print {
      body { padding: 20px; }
      .stat-card { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🧠 ${title}</h1>
    <p>Période: ${dateRange}</p>
    <p>Généré le ${format(new Date(), 'dd MMMM yyyy à HH:mm', { locale: fr })}</p>
  </div>

  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-value">${stats.totalScans}</div>
      <div class="stat-label">Scans réalisés</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${Math.round(stats.avgValence)}%</div>
      <div class="stat-label">Valence moyenne</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${Math.round(stats.avgArousal)}%</div>
      <div class="stat-label">Arousal moyen</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${stats.topEmotions[0] || 'N/A'}</div>
      <div class="stat-label">Émotion principale</div>
    </div>
  </div>

  <div class="section">
    <h2>📊 Historique des scans</h2>
    <table class="scan-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Source</th>
          <th>État</th>
          <th>Valence</th>
          <th>Arousal</th>
          <th>Résumé</th>
        </tr>
      </thead>
      <tbody>
        ${scans.slice(0, 50).map(scan => {
          const emotionLabel = getEmotionLabel(scan.valence, scan.arousal);
          const badgeClass = scan.valence > 60 && scan.arousal > 60 ? 'badge-positive'
            : scan.valence > 60 ? 'badge-calm'
            : scan.arousal > 60 ? 'badge-tension'
            : scan.valence < 40 ? 'badge-low'
            : 'badge-neutral';
          
          return `
            <tr>
              <td>${format(new Date(scan.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}</td>
              <td>${sourceLabels[scan.source] || scan.source}</td>
              <td><span class="badge ${badgeClass}">${emotionLabel}</span></td>
              <td>${Math.round(scan.valence)}%</td>
              <td>${Math.round(scan.arousal)}%</td>
              <td>${scan.summary || '-'}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>💡 Insights</h2>
    <ul style="list-style: none; padding: 0;">
      ${stats.avgValence > 60 ? '<li style="padding: 8px 0;">✅ Votre humeur générale est positive sur cette période.</li>' : ''}
      ${stats.avgValence < 40 ? '<li style="padding: 8px 0;">⚠️ Votre humeur semble basse. Prenez soin de vous.</li>' : ''}
      ${stats.avgArousal > 70 ? '<li style="padding: 8px 0;">⚡ Niveau d\'énergie élevé détecté. Pensez à des moments de calme.</li>' : ''}
      ${stats.avgArousal < 30 ? '<li style="padding: 8px 0;">😴 Énergie basse. Des activités stimulantes pourraient aider.</li>' : ''}
      ${stats.totalScans >= 14 ? '<li style="padding: 8px 0;">🏆 Excellent suivi ! Vous êtes régulier dans vos scans.</li>' : ''}
    </ul>
  </div>

  <div class="footer">
    <p>EmotionsCare - Rapport confidentiel</p>
    <p>Ce rapport est généré automatiquement et ne constitue pas un avis médical.</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Télécharge le rapport en tant que fichier HTML (imprimable en PDF)
 */
export function downloadReport(blob: Blob, filename?: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `emotion-report-${format(new Date(), 'yyyy-MM-dd')}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Ouvre le rapport dans une nouvelle fenêtre pour impression
 */
export function printReport(blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}
