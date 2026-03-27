// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

export interface AuditExportFilters {
  startDate?: Date;
  endDate?: Date;
  action?: 'add' | 'remove' | 'update' | null;
  userEmail?: string;
}

interface AuditLogRow {
  user_email: string;
  action: string;
  role: string;
  old_role?: string;
  new_role?: string;
  changed_by_email?: string;
  changed_at: string;
}

/**
 * Récupère les logs d'audit avec filtres
 */
export async function fetchAuditLogsWithFilters(
  filters: AuditExportFilters,
  limit = 10000
): Promise<AuditLogRow[]> {
  try {
    let query = supabase
      .from('role_audit_logs')
      .select(`
        id,
        user_id,
        action,
        role,
        old_role,
        new_role,
        changed_by,
        changed_at
      `)
      .order('changed_at', { ascending: false })
      .limit(limit);

    // Filtre par période
    if (filters.startDate) {
      query = query.gte('changed_at', filters.startDate.toISOString());
    }
    if (filters.endDate) {
      query = query.lte('changed_at', filters.endDate.toISOString());
    }

    // Filtre par action
    if (filters.action) {
      query = query.eq('action', filters.action);
    }

    const { data: logs, error } = await query;

    if (error) throw error;

    // Récupérer les emails des utilisateurs
    const userIds = new Set<string>();
    logs?.forEach((log) => {
      userIds.add(log.user_id);
      if (log.changed_by) userIds.add(log.changed_by);
    });

    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) throw usersError;

    const userEmailMap = new Map<string, string>();
    users.users.forEach((user) => {
      userEmailMap.set(user.id, user.email || 'N/A');
    });

    // Transformer les logs avec emails
    const enrichedLogs: AuditLogRow[] = (logs || []).map((log) => ({
      user_email: userEmailMap.get(log.user_id) || 'Utilisateur supprimé',
      action: log.action,
      role: log.role,
      old_role: log.old_role || '',
      new_role: log.new_role || '',
      changed_by_email: log.changed_by ? userEmailMap.get(log.changed_by) || 'N/A' : 'Système',
      changed_at: log.changed_at,
    }));

    // Filtre par email utilisateur (côté client car besoin des emails)
    if (filters.userEmail) {
      const searchTerm = filters.userEmail.toLowerCase();
      return enrichedLogs.filter((log) =>
        log.user_email.toLowerCase().includes(searchTerm)
      );
    }

    return enrichedLogs;
  } catch (error) {
    logger.error('Failed to fetch audit logs with filters', error as Error, 'ADMIN');
    throw error;
  }
}

/**
 * Convertit les logs en CSV
 */
function convertToCSV(logs: AuditLogRow[]): string {
  const headers = [
    'Date',
    'Email Utilisateur',
    'Action',
    'Rôle',
    'Ancien Rôle',
    'Nouveau Rôle',
    'Modifié Par',
  ];

  const rows = logs.map((log) => [
    format(new Date(log.changed_at), 'yyyy-MM-dd HH:mm:ss'),
    log.user_email,
    log.action,
    log.role,
    log.old_role || '-',
    log.new_role || '-',
    log.changed_by_email || 'Système',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  return csvContent;
}

/**
 * Exporte les logs d'audit en CSV
 */
export async function exportAuditLogsToCSV(
  filters: AuditExportFilters
): Promise<void> {
  try {
    logger.info('Starting audit logs export', filters, 'ADMIN');

    const logs = await fetchAuditLogsWithFilters(filters);

    if (logs.length === 0) {
      throw new Error('Aucun log trouvé pour les critères sélectionnés');
    }

    const csv = convertToCSV(logs);
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });

    // Nom du fichier avec date
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    const fileName = `audit-logs_${timestamp}.csv`;

    saveAs(blob, fileName);

    logger.info(`Exported ${logs.length} audit logs to CSV`, { fileName }, 'ADMIN');
  } catch (error) {
    logger.error('Failed to export audit logs', error as Error, 'ADMIN');
    throw error;
  }
}

/**
 * Récupère les statistiques des logs filtrés
 */
export async function getAuditLogsStats(
  filters: AuditExportFilters
): Promise<{
  total: number;
  byAction: Record<string, number>;
  byRole: Record<string, number>;
  dateRange: { start: string; end: string };
}> {
  try {
    const logs = await fetchAuditLogsWithFilters(filters);

    const byAction: Record<string, number> = {};
    const byRole: Record<string, number> = {};

    logs.forEach((log) => {
      byAction[log.action] = (byAction[log.action] || 0) + 1;
      byRole[log.role] = (byRole[log.role] || 0) + 1;
    });

    const dates = logs.map((log) => new Date(log.changed_at).getTime());
    const dateRange = {
      start: dates.length > 0 ? format(new Date(Math.min(...dates)), 'yyyy-MM-dd') : '',
      end: dates.length > 0 ? format(new Date(Math.max(...dates)), 'yyyy-MM-dd') : '',
    };

    return {
      total: logs.length,
      byAction,
      byRole,
      dateRange,
    };
  } catch (error) {
    logger.error('Failed to get audit logs stats', error as Error, 'ADMIN');
    throw error;
  }
}
