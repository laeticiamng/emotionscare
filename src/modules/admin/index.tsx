import { lazyDefault } from '@/lib/lazyDefault';

// ============================================================================
// PAGE
// ============================================================================

export { default } from './AdminFlagsPage';
export { default as AdminFlagsPage } from './AdminFlagsPage';

export const LazyAdminFlagsPage = lazyDefault(
  () => import('./AdminFlagsPage'),
  'AdminFlagsPage'
);

// ============================================================================
// HOOK
// ============================================================================

export { useAdmin } from './useAdmin';
export type { UseAdminReturn, AdminStats, FeatureFlag } from './useAdmin';

// ============================================================================
// SERVICE
// ============================================================================

export { AdminService } from './adminService';
export type { ModerationAction, UserBanAction, SystemMetrics } from './adminService';
