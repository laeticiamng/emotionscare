/**
 * Utilitaires pour exporter les données de scan émotionnel
 * Supporte les formats: JSON, CSV
 */

// PDF export disabled - jspdf module not available
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';

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
 * Exporte les données en format PDF
 */
export const exportAsPDF = async (
  scans: ScanData[],
  options: ExportOptions = {}
): Promise<void> => {
  const {
    filename = `emotion-scans-${new Date().toISOString().split('T')[0]}.pdf`
  } = options;

  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // En-tête
    doc.setFontSize(20);
    doc.text('Rapport d\'analyse émotionnelle', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 15;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Généré le: ${new Date().toLocaleString('fr-FR')}`, pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 20;

    // Statistiques générales
    if (scans.length > 0) {
      const avgValence = (scans.reduce((a, s) => a + s.valence, 0) / scans.length).toFixed(1);
      const avgArousal = (scans.reduce((a, s) => a + s.arousal, 0) / scans.length).toFixed(1);

      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text('Statistiques globales', 20, yPosition);

      yPosition += 10;
      doc.setFontSize(10);
      doc.setTextColor(80);

      const stats = [
        `Total de scans: ${scans.length}`,
        `Valence moyenne: ${avgValence}`,
        `Arousal moyen: ${avgArousal}`,
        `Période: ${new Date(scans[scans.length - 1].created_at).toLocaleDateString('fr-FR')} - ${new Date(scans[0].created_at).toLocaleDateString('fr-FR')}`
      ];

      stats.forEach(stat => {
        doc.text(stat, 30, yPosition);
        yPosition += 7;
      });

      yPosition += 10;

      // Tableau des données
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('Détail des scans', 20, yPosition);
      yPosition += 8;

      // Créer un tableau avec les données
      const tableData = scans.slice(0, 30).map(scan => {
        const date = new Date(scan.created_at);
        return [
          date.toLocaleDateString('fr-FR'),
          date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          scan.valence.toFixed(1),
          scan.arousal.toFixed(1),
          scan.summary || 'Neutre',
          scan.source || 'Manuel'
        ];
      });

      // @ts-ignore - jsPDF-autoTable
      doc.autoTable({
        startY: yPosition,
        head: [['Date', 'Heure', 'Valence', 'Arousal', 'Émotion', 'Source']],
        body: tableData,
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: 'bold'
        },
        margin: { left: 20, right: 20 }
      });

      // Pied de page
      const pageCount = (doc as any).internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} / ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }
    }

    doc.save(filename);
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
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
    console.error('Erreur lors de la copie au presse-papiers:', error);
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
    console.error('Erreur lors du partage:', error);
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
    console.error('Erreur lors de l\'export:', error);
    throw error;
  }
};
