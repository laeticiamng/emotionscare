// @ts-nocheck
import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { logger } from '@/lib/logger';
import { getAuditLogsStats } from './roleAuditExportService';
import type { AuditExportFilters } from './roleAuditExportService';

interface ReportData {
  filters: AuditExportFilters;
  stats: {
    total: number;
    byAction: Record<string, number>;
    byRole: Record<string, number>;
    dateRange: { start: string; end: string };
  };
}

/**
 * Génère un rapport PDF à partir d'un élément DOM contenant les graphiques
 */
export async function exportAuditReportToPDF(
  reportElement: HTMLElement,
  filters: AuditExportFilters
): Promise<void> {
  try {
    logger.info('Starting audit report PDF export', filters, 'ADMIN');

    // Capturer l'élément avec html2canvas
    const canvas = await html2canvas(reportElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true,
      windowWidth: reportElement.scrollWidth,
      windowHeight: reportElement.scrollHeight,
    });

    if (!canvas) {
      throw new Error('Impossible de capturer le rapport.');
    }

    // Convertir en image PNG
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Impossible de générer le rapport PDF.');
      }

      const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
      const fileName = `rapport-audit_${timestamp}.png`;
      
      saveAs(blob, fileName);
      logger.info('Audit report exported successfully', { fileName }, 'ADMIN');
    }, 'image/png', 0.95);

  } catch (error) {
    logger.error('Failed to export audit report', error as Error, 'ADMIN');
    throw error;
  }
}

/**
 * Génère et exporte un rapport complet avec statistiques
 */
export async function generateAndExportFullReport(
  filters: AuditExportFilters,
  reportElement: HTMLElement
): Promise<void> {
  try {
    logger.info('Generating full audit report', filters, 'ADMIN');

    const stats = await getAuditLogsStats(filters);
    
    if (stats.total === 0) {
      throw new Error('Aucune donnée disponible pour générer le rapport');
    }

    await exportAuditReportToPDF(reportElement, filters);

    logger.info('Full report generated and exported', { stats }, 'ADMIN');
  } catch (error) {
    logger.error('Failed to generate full report', error as Error, 'ADMIN');
    throw error;
  }
}

/**
 * Prépare les données pour le rapport
 */
export async function prepareReportData(
  filters: AuditExportFilters
): Promise<ReportData> {
  try {
    const stats = await getAuditLogsStats(filters);
    
    return {
      filters,
      stats,
    };
  } catch (error) {
    logger.error('Failed to prepare report data', error as Error, 'ADMIN');
    throw error;
  }
}
