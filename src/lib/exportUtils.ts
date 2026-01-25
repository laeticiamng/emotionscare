import * as XLSX from 'xlsx';

interface ExportOptions {
  title: string;
  subtitle?: string;
  data: any[];
  mlRecommendations?: string[];
  includeTimestamp?: boolean;
}

/**
 * Export data to Excel with multiple sheets
 */
export const exportToExcel = (options: ExportOptions) => {
  const { title, data, mlRecommendations = [] } = options;
  
  const workbook = XLSX.utils.book_new();

  // Main data sheet
  if (data.length > 0) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Auto-size columns
    const maxWidth = 50;
    const colWidths = Object.keys(data[0]).map(key => {
      const maxLength = Math.max(
        key.length,
        ...data.map(row => String(row[key] || '').length)
      );
      return { wch: Math.min(maxLength + 2, maxWidth) };
    });
    worksheet['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Données');
  }

  // ML Recommendations sheet
  if (mlRecommendations.length > 0) {
    const recommendationsData = mlRecommendations.map((rec, idx) => ({
      '#': idx + 1,
      'Recommandation': rec,
      'Priorité': idx < 3 ? 'Haute' : 'Moyenne',
      'Statut': 'À implémenter'
    }));
    const recSheet = XLSX.utils.json_to_sheet(recommendationsData);
    recSheet['!cols'] = [
      { wch: 5 },
      { wch: 80 },
      { wch: 12 },
      { wch: 15 }
    ];
    XLSX.utils.book_append_sheet(workbook, recSheet, 'Recommandations ML');
  }

  // Summary sheet
  const summaryData = [
    { 'Métrique': 'Titre du rapport', 'Valeur': title },
    { 'Métrique': 'Date de génération', 'Valeur': new Date().toLocaleString('fr-FR') },
    { 'Métrique': 'Nombre d\'entrées', 'Valeur': data.length },
    { 'Métrique': 'Recommandations ML', 'Valeur': mlRecommendations.length },
  ];
  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  summarySheet['!cols'] = [{ wch: 25 }, { wch: 50 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Résumé', true);

  return workbook;
};

/**
 * Download Excel file
 */
export const downloadExcel = (options: ExportOptions, filename: string) => {
  const workbook = exportToExcel(options);
  XLSX.writeFile(workbook, filename);
};

/**
 * Generate PDF using print functionality (browser native)
 * Opens a print dialog with formatted content
 */
export const generatePrintablePDF = (options: ExportOptions) => {
  const { title, subtitle, data, mlRecommendations = [] } = options;
  
  // Create a new window with printable content
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const styles = `
    <style>
      @media print {
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { max-width: 150px; margin-bottom: 10px; }
        h1 { color: #667eea; font-size: 24px; margin: 10px 0; }
        h2 { color: #333; font-size: 18px; margin: 20px 0 10px; }
        .subtitle { color: #666; font-size: 14px; }
        .timestamp { color: #999; font-size: 12px; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; page-break-inside: avoid; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
        th { background-color: #667eea; color: white; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9fafb; }
        .recommendations { margin: 20px 0; }
        .recommendation { margin: 10px 0; padding: 10px; border-left: 3px solid #667eea; background: #f9fafb; page-break-inside: avoid; }
        .footer { text-align: center; margin-top: 30px; font-size: 10px; color: #999; }
      }
    </style>
  `;

  const tableHTML = data.length > 0 ? `
    <h2>Données Détaillées</h2>
    <table>
      <thead>
        <tr>${Object.keys(data[0]).map(key => `<th>${key}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${data.map(row => `<tr>${Object.values(row).map(val => `<td>${val ?? '-'}</td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>
  ` : '';

  const recommendationsHTML = mlRecommendations.length > 0 ? `
    <h2>🤖 Recommandations ML</h2>
    <div class="recommendations">
      ${mlRecommendations.map((rec, idx) => `
        <div class="recommendation">
          <strong>${idx + 1}.</strong> ${rec}
        </div>
      `).join('')}
    </div>
  ` : '';

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        ${styles}
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          ${subtitle ? `<div class="subtitle">${subtitle}</div>` : ''}
          <div class="timestamp">Généré le ${new Date().toLocaleString('fr-FR')}</div>
        </div>
        ${tableHTML}
        ${recommendationsHTML}
        <div class="footer">
          EmotionsCare - Rapport de Monitoring
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
  }, 250);
};
