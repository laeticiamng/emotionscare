/**
 * Dashboard Feature
 * 
 * Main dashboard, statistics, and overview components.
 * @module features/dashboard
 */

// ============================================================================
// HOOKS - Re-export depuis le dossier hooks/dashboard organisé
// ============================================================================
export { useApiConnection } from '@/hooks/dashboard/useApiConnection';
export { useCoachDashboard } from '@/hooks/dashboard/useCoachDashboard';

// Hooks additionnels depuis racine
export { useDashboard } from '@/hooks/useDashboard';
export { useDashboardData } from '@/hooks/useDashboardData';
export { useDashboardHero } from '@/hooks/useDashboardHero';
export { useDashboardState } from '@/hooks/useDashboardState';
export { useDashboardWeekly } from '@/hooks/useDashboardWeekly';

// ============================================================================
// STORES
// ============================================================================
export { useDashboardStore } from '@/store';

// ============================================================================
// SERVICES
// ============================================================================
export { DashboardService } from '@/modules/dashboard';

// ============================================================================
// TYPES
// ============================================================================
export type { DashboardStats, ModuleActivity } from '@/modules/dashboard';

export interface DashboardWidget {
  id: string;
  type: 'mood' | 'streak' | 'progress' | 'recommendations' | 'goals' | 'stats';
  position: { x: number; y: number };
  size: { w: number; h: number };
  config?: Record<string, unknown>;
}

export interface WeeklyStats {
  scansCount: number;
  journalEntries: number;
  activitiesCompleted: number;
  avgMoodScore: number;
  streakDays: number;
}
