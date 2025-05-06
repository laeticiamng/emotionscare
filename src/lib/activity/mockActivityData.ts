
import { AnonymousActivity, ActivityStats } from '@/components/dashboard/admin/tabs/activity-logs/types';

export const mockActivities: AnonymousActivity[] = [
  {
    id: '1',
    activity_type: 'login',
    category: 'authentification',
    count: 25,
    timestamp_day: '2023-07-01'
  },
  {
    id: '2',
    activity_type: 'scan_emotion',
    category: 'bien-être',
    count: 18,
    timestamp_day: '2023-07-01'
  },
  {
    id: '3',
    activity_type: 'consultation',
    category: 'activités',
    count: 12,
    timestamp_day: '2023-07-01'
  },
  {
    id: '4',
    activity_type: 'login',
    category: 'authentification',
    count: 28,
    timestamp_day: '2023-06-30'
  },
  {
    id: '5',
    activity_type: 'scan_emotion',
    category: 'bien-être',
    count: 22,
    timestamp_day: '2023-06-30'
  }
];

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
    activity_type: 'consultation',
    total_count: 48,
    percentage: 15.5
  },
  {
    activity_type: 'commentaire',
    total_count: 35,
    percentage: 11.3
  },
  {
    activity_type: 'autre',
    total_count: 19,
    percentage: 6.2
  }
];
