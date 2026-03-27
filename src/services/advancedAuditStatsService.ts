// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

export interface AdvancedFilters {
  startDate?: Date;
  endDate?: Date;
  role?: 'admin' | 'moderator' | 'premium' | null;
  action?: 'add' | 'remove' | 'update' | null;
  adminId?: string;
}

export interface RoleStats {
  role: string;
  add: number;
  remove: number;
  update: number;
  total: number;
}

export interface MonthComparison {
  month: string;
  currentMonth: number;
  previousMonth: number;
  change: number;
  changePercent: number;
}

/**
 * Récupère les statistiques par rôle avec filtres
 */
export async function getStatsByRole(filters: AdvancedFilters): Promise<RoleStats[]> {
  try {
    let query = supabase
      .from('role_audit_logs')
      .select('action, role, new_role, old_role');

    if (filters.startDate) {
      query = query.gte('changed_at', filters.startDate.toISOString());
    }
    if (filters.endDate) {
      query = query.lte('changed_at', filters.endDate.toISOString());
    }
    if (filters.action) {
      query = query.eq('action', filters.action);
    }
    if (filters.adminId) {
      query = query.eq('changed_by', filters.adminId);
    }

    const { data: logs, error } = await query;

    if (error) throw error;

    // Agréger par rôle
    const roleMap = new Map<string, RoleStats>();

    logs?.forEach((log) => {
      const targetRole = log.new_role || log.role;
      if (!targetRole) return;

      if (!roleMap.has(targetRole)) {
        roleMap.set(targetRole, {
          role: targetRole,
          add: 0,
          remove: 0,
          update: 0,
          total: 0,
        });
      }

      const stats = roleMap.get(targetRole)!;
      
      if (log.action === 'add') stats.add++;
      else if (log.action === 'remove') stats.remove++;
      else if (log.action === 'update') stats.update++;
      
      stats.total++;
      roleMap.set(targetRole, stats);
    });

    return Array.from(roleMap.values()).sort((a, b) => b.total - a.total);
  } catch (error) {
    logger.error('Failed to get stats by role', error as Error, 'AUDIT_STATS');
    throw error;
  }
}

/**
 * Compare les statistiques mois par mois
 */
export async function getMonthToMonthComparison(monthsBack = 6): Promise<MonthComparison[]> {
  try {
    const comparisons: MonthComparison[] = [];
    const now = new Date();

    for (let i = 0; i < monthsBack; i++) {
      const currentMonthDate = subMonths(now, i);
      const previousMonthDate = subMonths(currentMonthDate, 1);

      const currentStart = startOfMonth(currentMonthDate);
      const currentEnd = endOfMonth(currentMonthDate);
      const previousStart = startOfMonth(previousMonthDate);
      const previousEnd = endOfMonth(previousMonthDate);

      // Stats mois courant
      const { data: currentData, error: currentError } = await supabase
        .from('role_audit_logs')
        .select('id', { count: 'exact', head: true })
        .gte('changed_at', currentStart.toISOString())
        .lte('changed_at', currentEnd.toISOString());

      // Stats mois précédent
      const { data: previousData, error: previousError } = await supabase
        .from('role_audit_logs')
        .select('id', { count: 'exact', head: true })
        .gte('changed_at', previousStart.toISOString())
        .lte('changed_at', previousEnd.toISOString());

      if (currentError || previousError) {
        logger.error('Error fetching month comparison', currentError || previousError, 'AUDIT_STATS');
        continue;
      }

      const currentCount = currentData?.length || 0;
      const previousCount = previousData?.length || 0;
      const change = currentCount - previousCount;
      const changePercent = previousCount > 0 ? (change / previousCount) * 100 : 0;

      comparisons.push({
        month: format(currentMonthDate, 'MMM yyyy'),
        currentMonth: currentCount,
        previousMonth: previousCount,
        change,
        changePercent: Math.round(changePercent * 10) / 10,
      });
    }

    return comparisons.reverse();
  } catch (error) {
    logger.error('Failed to get month to month comparison', error as Error, 'AUDIT_STATS');
    throw error;
  }
}

/**
 * Récupère les stats filtrées par période personnalisée
 */
export async function getCustomPeriodStats(startDate: Date, endDate: Date) {
  try {
    const { data: logs, error } = await supabase
      .from('role_audit_logs')
      .select('*')
      .gte('changed_at', startDate.toISOString())
      .lte('changed_at', endDate.toISOString());

    if (error) throw error;

    const actionCounts = {
      add: logs.filter((l) => l.action === 'add').length,
      remove: logs.filter((l) => l.action === 'remove').length,
      update: logs.filter((l) => l.action === 'update').length,
    };

    const roleCounts = new Map<string, number>();
    logs.forEach((log) => {
      const role = log.new_role || log.role;
      if (role) {
        roleCounts.set(role, (roleCounts.get(role) || 0) + 1);
      }
    });

    return {
      total: logs.length,
      byAction: actionCounts,
      byRole: Object.fromEntries(roleCounts),
      logs,
    };
  } catch (error) {
    logger.error('Failed to get custom period stats', error as Error, 'AUDIT_STATS');
    throw error;
  }
}
