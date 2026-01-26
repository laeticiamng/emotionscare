/**
 * Utilitaires pour exporter les données de scan émotionnel
 * Supporte les formats: JSON, CSV
 */

// PDF export disabled - jspdf module not available
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';

import { logger } from '@/lib/logger';

interface ScanData {
  id: string;
  valence: number;
  arousal: number;
  summary?: string;
  source?: string;
  created_at: string;
  metadata?: Record<string, any>;
}

interface ExportOptions {
  filename?: string;
  includeMetadata?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Exporte les données en format JSON
 */
export const exportAsJSON = (
  scans: ScanData[],
  options: ExportOptions = {}
): void => {
  const {
    filename = `emotion-scans-${new Date().toISOString().split('T')[0]}.json`,
    includeMetadata = true
  } = options;

  const data = {
    exportDate: new Date().toISOString(),
    totalScans: scans.length,
    scans: includeMetadata
      ? scans
      : scans.map(({ id, valence, arousal, summary, source, created_at }) => ({
          id,
          valence,
          arousal,
          summary,
          source,
          created_at
        }))
  };

  const jsonString = JSON.stringify(data, null, 2);
  downloadFile(jsonString, filename, 'application/json');
};

/**
 * Exporte les données en format CSV
 */
export const exportAsCSV = (
  scans: ScanData[],
  options: ExportOptions = {}
): void => {
  const {
    filename = `emotion-scans-${new Date().toISOString().split('T')[0]}.csv`,
    includeMetadata = false
  } = options;

  // En-têtes
  const headers = ['Date', 'Heure', 'Valence', 'Arousal', 'Émotion', 'Source'];
  if (includeMetadata) {
    headers.push('Métadonnées');
  }

  // Lignes
  const rows = scans.map(scan => {
    const date = new Date(scan.created_at);
    const dateStr = date.toLocaleDateString('fr-FR');
    const timeStr = date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const row = [
      dateStr,
      timeStr,
      scan.valence.toFixed(1),
      scan.arousal.toFixed(1),
      scan.summary || 'Neutre',
      scan.source || 'Manuel'
    ];

    if (includeMetadata && scan.metadata) {
      row.push(JSON.stringify(scan.metadata));
    }

    // Échapper les guillemets et les virgules
    return row
      .map(field => {
        const str = String(field);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      })
      .join(',');
  });

  const csvContent = [
    headers.join(','),
    ...rows
  ].join('\n');

  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
};

/**
 * Exporte les données en format PDF (version simple sans dépendance jsPDF)
 */
export const exportAsPDF = async (
  scans: ScanData[],
  _options: ExportOptions = {}
): Promise<void> => {
  try {
    // Générer un HTML formaté pour impression PDF
    const avgValence = scans.length > 0 
      ? (scans.reduce((a, s) => a + s.valence, 0) / scans.length).toFixed(1)
      : '0';
    const avgArousal = scans.length > 0
      ? (scans.reduce((a, s) => a + s.arousal, 0) / scans.length).toFixed(1)
      : '0';

    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Rapport d'analyse émotionnelle</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { color: #1a1a2e; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; }
    h2 { color: #4f46e5; margin-top: 30px; }
    .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
    .stat-card { background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; }
    .stat-value { font-size: 2em; font-weight: bold; color: #4f46e5; }
    .stat-label { color: #64748b; font-size: 0.9em; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    th { background: #4f46e5; color: white; }
    tr:nth-child(even) { background: #f8fafc; }
    .footer { margin-top: 40px; text-align: center; color: #94a3b8; font-size: 0.8em; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>📊 Rapport d'analyse émotionnelle</h1>
  <p>Généré le: ${new Date().toLocaleString('fr-FR')}</p>
  
  <div class="stats">
    <div class="stat-card">
      <div class="stat-value">${scans.length}</div>
      <div class="stat-label">Scans totaux</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${avgValence}</div>
      <div class="stat-label">Valence moyenne</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${avgArousal}</div>
      <div class="stat-label">Arousal moyen</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${scans.length > 0 ? new Date(scans[scans.length - 1].created_at).toLocaleDateString('fr-FR') : '-'}</div>
      <div class="stat-label">Premier scan</div>
    </div>
  </div>

  <h2>Détail des scans</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Heure</th>
        <th>Valence</th>
        <th>Arousal</th>
        <th>Émotion</th>
        <th>Source</th>
      </tr>
    </thead>
    <tbody>
      ${scans.slice(0, 50).map(scan => {
        const date = new Date(scan.created_at);
        return `
          <tr>
            <td>${date.toLocaleDateString('fr-FR')}</td>
            <td>${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</td>
            <td>${scan.valence.toFixed(1)}</td>
            <td>${scan.arousal.toFixed(1)}</td>
            <td>${scan.summary || 'Neutre'}</td>
            <td>${scan.source || 'Manuel'}</td>
          </tr>
        `;
      }).join('')}
    </tbody>
  </table>
  
  ${scans.length > 50 ? `<p style="color: #94a3b8; font-style: italic;">Affichage limité aux 50 premiers scans sur ${scans.length} total.</p>` : ''}
  
  <div class="footer">
    <p>Rapport généré par EmotionsCare</p>
    <p>Les données sont confidentielles et personnelles.</p>
  </div>
</body>
</html>
    `;

    // Ouvrir dans une nouvelle fenêtre pour impression
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Attendre le chargement puis lancer l'impression
      printWindow.onload = () => {
        printWindow.print();
      };
      
      // Fallback si onload ne se déclenche pas
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      throw new Error('Impossible d\'ouvrir la fenêtre d\'impression. Vérifiez les bloqueurs de popup.');
    }

  } catch (error) {
    logger.error('Erreur lors de la génération du PDF:', error, 'LIB');
    throw error;
  }
};

/**
 * Génère un résumé texte des données
 */
export const generateTextSummary = (scans: ScanData[]): string => {
  if (scans.length === 0) {
    return 'Aucune donnée disponible';
  }

  const avgValence = (scans.reduce((a, s) => a + s.valence, 0) / scans.length).toFixed(1);
  const avgArousal = (scans.reduce((a, s) => a + s.arousal, 0) / scans.length).toFixed(1);
  const maxValence = Math.max(...scans.map(s => s.valence));
  const minValence = Math.min(...scans.map(s => s.valence));
  const maxArousal = Math.max(...scans.map(s => s.arousal));
  const minArousal = Math.min(...scans.map(s => s.arousal));

  const startDate = new Date(scans[scans.length - 1].created_at).toLocaleDateString('fr-FR');
  const endDate = new Date(scans[0].created_at).toLocaleDateString('fr-FR');

  return `
RAPPORT D'ANALYSE ÉMOTIONNELLE
================================

Période: ${startDate} à ${endDate}
Nombre de scans: ${scans.length}

STATISTIQUES GLOBALES
--------------------
Valence moyenne: ${avgValence}/100
Valence min/max: ${minValence}/100 - ${maxValence}/100

Arousal moyen: ${avgArousal}/100
Arousal min/max: ${minArousal}/100 - ${maxArousal}/100

INTERPRÉTATION
---------------
- Valence: Mesure du positif (-100) au négatif (+100)
- Arousal: Mesure du calme (0) à l'excitation (100)

Généré le: ${new Date().toLocaleString('fr-FR')}
  `.trim();
};

/**
 * Fonction utilitaire pour télécharger un fichier
 */
const downloadFile = (
  content: string,
  filename: string,
  mimeType: string
): void => {
  const element = document.createElement('a');
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  element.setAttribute('href', url);
  element.setAttribute('download', filename);
  element.style.display = 'none';

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

  URL.revokeObjectURL(url);
};

/**
 * Copier les données au presse-papiers
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    logger.error('Erreur lors de la copie au presse-papiers:', error, 'LIB');
    return false;
  }
};

/**
 * Partager les données via l'API Web Share (si disponible)
 */
export const shareData = async (
  scans: ScanData[],
  title: string = 'Mon rapport émotionnel'
): Promise<boolean> => {
  if (!navigator.share) {
    return false;
  }

  try {
    const summary = generateTextSummary(scans);
    await navigator.share({
      title,
      text: summary
    });
    return true;
  } catch (error) {
    logger.error('Erreur lors du partage:', error, 'LIB');
    return false;
  }
};

/**
 * Exporter dans tous les formats à la fois
 */
export const exportAll = async (
  scans: ScanData[],
  options: ExportOptions = {}
): Promise<void> => {
  const baseFilename = options.filename?.replace(/\.[^.]+$/, '') ||
    `emotion-scans-${new Date().toISOString().split('T')[0]}`;

  try {
    // JSON
    exportAsJSON(scans, {
      ...options,
      filename: `${baseFilename}.json`
    });

    // CSV
    exportAsCSV(scans, {
      ...options,
      filename: `${baseFilename}.csv`
    });

    // PDF
    await exportAsPDF(scans, {
      ...options,
      filename: `${baseFilename}.pdf`
    });
  } catch (error) {
    logger.error('Erreur lors de l\'export:', error, 'LIB');
    throw error;
  }
};
