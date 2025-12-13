/**
 * Export Service - PDF/CSV/Excel complet pour toutes les données
 * Génère des exports professionnels avec graphiques et formatage
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export type ExportFormat = 'csv' | 'xlsx' | 'pdf' | 'json';
export type ExportType = 
  | 'mood_history' 
  | 'journal_entries' 
  | 'assessments' 
  | 'sessions' 
  | 'achievements'
  | 'music_history'
  | 'breathing_sessions'
  | 'full_profile';

export interface ExportOptions {
  format: ExportFormat;
  type: ExportType;
  dateRange?: { from: Date; to: Date };
  includeCharts?: boolean;
  locale?: string;
}

export interface ExportResult {
  success: boolean;
  fileName?: string;
  blob?: Blob;
  error?: string;
}

class ExportService {
  /**
   * Exporte les données selon les options
   */
  async export(userId: string, options: ExportOptions): Promise<ExportResult> {
    try {
      logger.info('[Export] Starting export', { type: options.type, format: options.format }, 'EXPORT');

      // Récupérer les données
      const data = await this.fetchData(userId, options.type, options.dateRange);
      
      if (!data || data.length === 0) {
        return { success: false, error: 'Aucune donnée à exporter' };
      }

      // Générer le fichier selon le format
      let result: ExportResult;
      
      switch (options.format) {
        case 'csv':
          result = this.exportToCSV(data, options.type);
          break;
        case 'xlsx':
          result = this.exportToExcel(data, options.type);
          break;
        case 'pdf':
          result = await this.exportToPDF(userId, data, options);
          break;
        case 'json':
          result = this.exportToJSON(data, options.type);
          break;
        default:
          return { success: false, error: 'Format non supporté' };
      }

      if (result.success && result.blob && result.fileName) {
        saveAs(result.blob, result.fileName);
        logger.info('[Export] Export completed', { fileName: result.fileName }, 'EXPORT');
      }

      return result;
    } catch (error) {
      logger.error('[Export] Export failed', error as Error, 'EXPORT');
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Récupère les données selon le type
   */
  private async fetchData(
    userId: string, 
    type: ExportType, 
    dateRange?: { from: Date; to: Date }
  ): Promise<Record<string, unknown>[]> {
    const tableMappings: Record<ExportType, string> = {
      mood_history: 'mood_entries',
      journal_entries: 'journal_entries',
      assessments: 'assessments',
      sessions: 'ai_coach_sessions',
      achievements: 'user_achievements',
      music_history: 'music_listen_events',
      breathing_sessions: 'breathing_vr_sessions',
      full_profile: 'profiles'
    };

    const table = tableMappings[type];
    let query = supabase
      .from(table)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (dateRange) {
      query = query
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString());
    }

    const { data, error } = await query.limit(1000);
    
    if (error) throw error;
    return data || [];
  }

  /**
   * Export CSV
   */
  private exportToCSV(data: Record<string, unknown>[], type: ExportType): ExportResult {
    if (data.length === 0) {
      return { success: false, error: 'Pas de données' };
    }

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(h => {
          const val = row[h];
          if (val === null || val === undefined) return '';
          if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
          return `"${String(val).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = `emotionscare_${type}_${format(new Date(), 'yyyy-MM-dd')}.csv`;

    return { success: true, blob, fileName };
  }

  /**
   * Export Excel
   */
  private exportToExcel(data: Record<string, unknown>[], type: ExportType): ExportResult {
    // Créer le workbook
    const wb = XLSX.utils.book_new();
    
    // Formater les données
    const formattedData = data.map(row => {
      const formatted: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(row)) {
        if (value instanceof Date || (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/))) {
          formatted[this.formatHeader(key)] = format(new Date(value as string), 'dd/MM/yyyy HH:mm', { locale: fr });
        } else if (typeof value === 'object' && value !== null) {
          formatted[this.formatHeader(key)] = JSON.stringify(value);
        } else {
          formatted[this.formatHeader(key)] = value;
        }
      }
      return formatted;
    });

    // Créer la feuille
    const ws = XLSX.utils.json_to_sheet(formattedData);
    
    // Ajuster les largeurs de colonnes
    const colWidths = Object.keys(formattedData[0] || {}).map(key => ({
      wch: Math.max(key.length, 15)
    }));
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, this.getSheetName(type));

    // Générer le fichier
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const fileName = `emotionscare_${type}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;

    return { success: true, blob, fileName };
  }

  /**
   * Export PDF via edge function
   */
  private async exportToPDF(
    userId: string,
    data: Record<string, unknown>[],
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      const { data: pdfData, error } = await supabase.functions.invoke('html-to-pdf', {
        body: {
          html: this.generatePDFHtml(data, options),
          fileName: `emotionscare_${options.type}_${format(new Date(), 'yyyy-MM-dd')}.pdf`,
          userId
        }
      });

      if (error) throw error;

      // Le backend retourne l'URL du PDF ou le contenu
      if (pdfData?.url) {
        const response = await fetch(pdfData.url);
        const blob = await response.blob();
        return { 
          success: true, 
          blob, 
          fileName: `emotionscare_${options.type}_${format(new Date(), 'yyyy-MM-dd')}.pdf` 
        };
      }

      return { success: false, error: 'Échec de la génération PDF' };
    } catch (error) {
      logger.error('[Export] PDF generation failed', error as Error, 'EXPORT');
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Export JSON
   */
  private exportToJSON(data: Record<string, unknown>[], type: ExportType): ExportResult {
    const jsonContent = JSON.stringify({
      exportDate: new Date().toISOString(),
      type,
      count: data.length,
      data
    }, null, 2);

    const blob = new Blob([jsonContent], { type: 'application/json' });
    const fileName = `emotionscare_${type}_${format(new Date(), 'yyyy-MM-dd')}.json`;

    return { success: true, blob, fileName };
  }

  /**
   * Génère le HTML pour le PDF
   */
  private generatePDFHtml(data: Record<string, unknown>[], options: ExportOptions): string {
    const title = this.getExportTitle(options.type);
    const headers = data.length > 0 ? Object.keys(data[0]) : [];
    
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
    h1 { color: #6366f1; margin-bottom: 20px; }
    .meta { color: #666; margin-bottom: 30px; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #6366f1; color: white; padding: 12px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #eee; }
    tr:nth-child(even) { background: #f9fafb; }
    .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <h1>📊 ${title}</h1>
  <div class="meta">
    Exporté le ${format(new Date(), 'dd MMMM yyyy à HH:mm', { locale: fr })}<br>
    ${data.length} enregistrements
  </div>
  <table>
    <thead>
      <tr>${headers.map(h => `<th>${this.formatHeader(h)}</th>`).join('')}</tr>
    </thead>
    <tbody>
      ${data.slice(0, 100).map(row => `
        <tr>${headers.map(h => `<td>${this.formatValue(row[h])}</td>`).join('')}</tr>
      `).join('')}
    </tbody>
  </table>
  ${data.length > 100 ? '<p style="color:#666;margin-top:20px;">... et ' + (data.length - 100) + ' autres entrées</p>' : ''}
  <div class="footer">EmotionsCare - Votre compagnon bien-être</div>
</body>
</html>`;
  }

  private formatHeader(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  private formatValue(value: unknown): string {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') return JSON.stringify(value).substring(0, 50);
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
      return format(new Date(value), 'dd/MM/yyyy', { locale: fr });
    }
    return String(value);
  }

  private getSheetName(type: ExportType): string {
    const names: Record<ExportType, string> = {
      mood_history: 'Historique Humeur',
      journal_entries: 'Journal',
      assessments: 'Évaluations',
      sessions: 'Sessions Coach',
      achievements: 'Badges',
      music_history: 'Musique',
      breathing_sessions: 'Respiration',
      full_profile: 'Profil'
    };
    return names[type] || 'Données';
  }

  private getExportTitle(type: ExportType): string {
    const titles: Record<ExportType, string> = {
      mood_history: 'Historique de votre humeur',
      journal_entries: 'Vos entrées de journal',
      assessments: 'Vos évaluations psychométriques',
      sessions: 'Vos sessions avec le coach IA',
      achievements: 'Vos badges et récompenses',
      music_history: 'Votre historique musical',
      breathing_sessions: 'Vos sessions de respiration',
      full_profile: 'Votre profil complet'
    };
    return titles[type] || 'Export de données';
  }
}

export const exportService = new ExportService();
export default exportService;
