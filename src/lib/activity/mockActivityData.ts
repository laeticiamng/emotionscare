
import { AnonymousActivity, ActivityStats } from '@/components/dashboard/admin/tabs/activity-logs/types';

/**
 * Mock activity data for development
 */
export const mockActivities: AnonymousActivity[] = [
  {
    id: '1',
    activity_type: 'login',
    category: 'authentication',
    count: 25,
    timestamp_day: '2023-07-01'
  },
  {
    id: '2',
    activity_type: 'scan_emotion',
    category: 'wellness',
    count: 18,
    timestamp_day: '2023-07-01'
  },
  {
    id: '3',
    activity_type: 'journal_entry',
    category: 'wellness',
    count: 12,
    timestamp_day: '2023-07-02'
  },
  {
    id: '4',
    activity_type: 'vr_session',
    category: 'wellness',
    count: 8,
    timestamp_day: '2023-07-02'
  },
  {
    id: '5',
    activity_type: 'profile_update',
    category: 'account',
    count: 5,
    timestamp_day: '2023-07-03'
  }
];

/**
 * Mock statistics data for development
 */
export const mockStats: ActivityStats[] = [
  {
    activity_type: 'login',
    total_count: 125,
    percentage: 40.5
  },
  {
    activity_type: 'scan_emotion',
    total_count: 82,
    percentage: 26.5
  },
  {
    activity_type: 'journal_entry',
    total_count: 45,
    percentage: 14.5
  },
  {
    activity_type: 'vr_session',
    total_count: 37,
    percentage: 12.0
  },
  {
    activity_type: 'profile_update',
    total_count: 20,
    percentage: 6.5
  }
];
