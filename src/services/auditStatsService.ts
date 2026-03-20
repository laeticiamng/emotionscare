import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { startOfWeek, endOfWeek, subDays, format } from 'date-fns';

export interface WeeklyStats {
  week: string;
  add: number;
  remove: number;
  update: number;
  total: number;
}

export interface TopAdmin {
  admin_email: string;
  admin_id: string;
  changes_count: number;
}

export interface ActionDistribution {
  action: string;
  count: number;
  percentage: number;
}

export interface AuditStats {
  weeklyEvolution: WeeklyStats[];
  topAdmins: TopAdmin[];
  actionDistribution: ActionDistribution[];
  totalChanges: number;
}

/**
 * Récupère l'évolution hebdomadaire des changements sur 8 semaines
 */
async function getWeeklyEvolution(): Promise<WeeklyStats[]> {
  const weeks: WeeklyStats[] = [];
  const now = new Date();

  for (let i = 7; i >= 0; i--) {
    const weekDate = subDays(now, i * 7);
    const weekStart = startOfWeek(weekDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(weekDate, { weekStartsOn: 1 });

    const { data, error } = await supabase
      .from('role_audit_logs')
      .select('action')
      .gte('changed_at', weekStart.toISOString())
      .lte('changed_at', weekEnd.toISOString());

    if (error) {
      logger.error('Error fetching weekly stats', error, 'AUDIT_STATS');
      continue;
    }

    const weekStats = {
      week: format(weekStart, 'dd/MM'),
      add: data.filter(d => d.action === 'add').length,
      remove: data.filter(d => d.action === 'remove').length,
      update: data.filter(d => d.action === 'update').length,
      total: data.length,
    };

    weeks.push(weekStats);
  }

  return weeks;
}

/**
 * Récupère le top 5 des admins les plus actifs sur 30 jours
 */
async function getTopAdmins(): Promise<TopAdmin[]> {
  const thirtyDaysAgo = subDays(new Date(), 30).toISOString();

  const { data: logs, error } = await supabase
    .from('role_audit_logs')
    .select('changed_by')
    .gte('changed_at', thirtyDaysAgo)
    .not('changed_by', 'is', null);

  if (error) {
    logger.error('Error fetching admin activity', error, 'AUDIT_STATS');
    return [];
  }

  // Compter les changements par admin
  const adminCounts = new Map<string, number>();
  logs.forEach(log => {
    const count = adminCounts.get(log.changed_by) || 0;
    adminCounts.set(log.changed_by, count + 1);
  });

  // Récupérer les emails des admins
  const adminIds = Array.from(adminCounts.keys());
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

  if (usersError || !users) {
    logger.error('Error fetching users for top admins', usersError, 'AUDIT_STATS');
    return [];
  }

  const userEmailMap = new Map(users.map(u => [u.id, u.email || 'N/A']));

  // Créer le classement
  const topAdmins: TopAdmin[] = Array.from(adminCounts.entries())
    .map(([adminId, count]) => ({
      admin_id: adminId,
      admin_email: userEmailMap.get(adminId) || 'Admin supprimé',
      changes_count: count,
    }))
    .sort((a, b) => b.changes_count - a.changes_count)
    .slice(0, 5);

  return topAdmins;
}

/**
 * Récupère la répartition des actions sur 30 jours
 */
async function getActionDistribution(): Promise<ActionDistribution[]> {
  const thirtyDaysAgo = subDays(new Date(), 30).toISOString();

  const { data, error } = await supabase
    .from('role_audit_logs')
    .select('action')
    .gte('changed_at', thirtyDaysAgo);

  if (error) {
    logger.error('Error fetching action distribution', error, 'AUDIT_STATS');
    return [];
  }

  const total = data.length;
  const actionCounts = new Map<string, number>();

  data.forEach(log => {
    const count = actionCounts.get(log.action) || 0;
    actionCounts.set(log.action, count + 1);
  });

  const distribution: ActionDistribution[] = Array.from(actionCounts.entries())
    .map(([action, count]) => ({
      action,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  return distribution;
}

/**
 * Récupère toutes les statistiques d'audit
 */
export async function getAuditStats(): Promise<AuditStats> {
  try {
    logger.info('Fetching audit statistics', {}, 'AUDIT_STATS');

    const [weeklyEvolution, topAdmins, actionDistribution] = await Promise.all([
      getWeeklyEvolution(),
      getTopAdmins(),
      getActionDistribution(),
    ]);

    const totalChanges = actionDistribution.reduce((sum, dist) => sum + dist.count, 0);

    return {
      weeklyEvolution,
      topAdmins,
      actionDistribution,
      totalChanges,
    };
  } catch (error) {
    logger.error('Error fetching audit stats', error as Error, 'AUDIT_STATS');
    throw error;
  }
}
