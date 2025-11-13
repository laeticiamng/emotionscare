// @ts-nocheck
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { logger } from '@/lib/logger';
import { fetchAuditLogsWithFilters, type AuditExportFilters } from './roleAuditExportService';
import { getAuditLogsStats } from './roleAuditExportService';
import { getAlertStatistics } from './securityAlertsService';

/**
 * Génère un fichier Excel avec plusieurs feuilles
 */
export async function exportToExcel(filters: AuditExportFilters): Promise<void> {
  try {
    logger.info('Starting Excel export', filters, 'ADMIN');

    // Récupérer les données
    const logs = await fetchAuditLogsWithFilters(filters, 10000);
    const stats = await getAuditLogsStats(filters);
    const alertStats = await getAlertStatistics(30);

    // Créer un nouveau classeur
    const workbook = XLSX.utils.book_new();

    // Feuille 1: Statistiques générales
    const statsData = [
      ['Statistiques d\'Audit'],
      [],
      ['Total des changements', stats.total],
      ['Période', `${stats.dateRange.start} - ${stats.dateRange.end}`],
      [],
      ['Répartition par Action'],
      ['Action', 'Nombre'],
      ...Object.entries(stats.byAction).map(([action, count]) => [action, count]),
      [],
      ['Répartition par Rôle'],
      ['Rôle', 'Nombre'],
      ...Object.entries(stats.byRole).map(([role, count]) => [role, count]),
      [],
      ['Alertes de Sécurité (30 derniers jours)'],
      ['Total alertes', alertStats.total],
      [],
      ['Par Sévérité'],
      ['Sévérité', 'Nombre'],
      ...Object.entries(alertStats.bySeverity).map(([severity, count]) => [severity, count]),
      [],
      ['Par Type'],
      ['Type', 'Nombre'],
      ...Object.entries(alertStats.byType).map(([type, count]) => [type, count]),
    ];

    const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
    
    // Styles pour la feuille stats
    statsSheet['!cols'] = [{ wch: 30 }, { wch: 15 }];
    
    XLSX.utils.book_append_sheet(workbook, statsSheet, 'Statistiques');

    // Feuille 2: Logs détaillés
    const logsData = [
      ['Date', 'Email Utilisateur', 'Action', 'Rôle', 'Ancien Rôle', 'Nouveau Rôle', 'Modifié Par'],
      ...logs.map(log => [
        format(new Date(log.changed_at), 'dd/MM/yyyy HH:mm:ss', { locale: fr }),
        log.user_email,
        log.action,
        log.role,
        log.old_role || '-',
        log.new_role || '-',
        log.changed_by_email || 'Système',
      ]),
    ];

    const logsSheet = XLSX.utils.aoa_to_sheet(logsData);
    
    // Largeur des colonnes
    logsSheet['!cols'] = [
      { wch: 20 }, // Date
      { wch: 30 }, // Email
      { wch: 12 }, // Action
      { wch: 12 }, // Rôle
      { wch: 12 }, // Ancien Rôle
      { wch: 12 }, // Nouveau Rôle
      { wch: 30 }, // Modifié Par
    ];

    XLSX.utils.book_append_sheet(workbook, logsSheet, 'Logs Détaillés');

    // Feuille 3: Analyse temporelle
    const weeklyAnalysis = analyzeByWeek(logs);
    const weeklyData = [
      ['Analyse Hebdomadaire'],
      [],
      ['Semaine', 'Ajouts', 'Suppressions', 'Modifications', 'Total'],
      ...weeklyAnalysis.map(week => [
        week.week,
        week.add,
        week.remove,
        week.update,
        week.total,
      ]),
    ];

    const weeklySheet = XLSX.utils.aoa_to_sheet(weeklyData);
    weeklySheet['!cols'] = [{ wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
    
    XLSX.utils.book_append_sheet(workbook, weeklySheet, 'Analyse Temporelle');

    // Feuille 4: Top Administrateurs
    const adminActivity = analyzeAdminActivity(logs);
    const adminData = [
      ['Activité des Administrateurs'],
      [],
      ['Rang', 'Email', 'Ajouts', 'Suppressions', 'Modifications', 'Total'],
      ...adminActivity.map((admin, index) => [
        index + 1,
        admin.email,
        admin.add,
        admin.remove,
        admin.update,
        admin.total,
      ]),
    ];

    const adminSheet = XLSX.utils.aoa_to_sheet(adminData);
    adminSheet['!cols'] = [
      { wch: 8 },  // Rang
      { wch: 30 }, // Email
      { wch: 12 }, // Ajouts
      { wch: 12 }, // Suppressions
      { wch: 12 }, // Modifications
      { wch: 12 }, // Total
    ];
    
    XLSX.utils.book_append_sheet(workbook, adminSheet, 'Administrateurs');

    // Générer le fichier
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    const fileName = `rapport-audit-complet_${timestamp}.xlsx`;

    XLSX.writeFile(workbook, fileName);

    logger.info('Excel export completed', { fileName, logsCount: logs.length }, 'ADMIN');
  } catch (error) {
    logger.error('Failed to export to Excel', error as Error, 'ADMIN');
    throw error;
  }
}

/**
 * Analyse les logs par semaine
 */
function analyzeByWeek(logs: any[]): any[] {
  const weekMap = new Map<string, { add: number; remove: number; update: number }>();

  logs.forEach(log => {
    const week = format(new Date(log.changed_at), "'Sem' w yyyy", { locale: fr });
    
    if (!weekMap.has(week)) {
      weekMap.set(week, { add: 0, remove: 0, update: 0 });
    }

    const weekData = weekMap.get(week)!;
    weekData[log.action as 'add' | 'remove' | 'update']++;
  });

  return Array.from(weekMap.entries())
    .map(([week, data]) => ({
      week,
      add: data.add,
      remove: data.remove,
      update: data.update,
      total: data.add + data.remove + data.update,
    }))
    .sort((a, b) => a.week.localeCompare(b.week));
}

/**
 * Analyse l'activité des administrateurs
 */
function analyzeAdminActivity(logs: any[]): any[] {
  const adminMap = new Map<string, { add: number; remove: number; update: number }>();

  logs.forEach(log => {
    const admin = log.changed_by_email || 'Système';
    
    if (!adminMap.has(admin)) {
      adminMap.set(admin, { add: 0, remove: 0, update: 0 });
    }

    const adminData = adminMap.get(admin)!;
    adminData[log.action as 'add' | 'remove' | 'update']++;
  });

  return Array.from(adminMap.entries())
    .map(([email, data]) => ({
      email,
      add: data.add,
      remove: data.remove,
      update: data.update,
      total: data.add + data.remove + data.update,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 20); // Top 20
}
