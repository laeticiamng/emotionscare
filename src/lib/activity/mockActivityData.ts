// @ts-nocheck

import { ActivityType } from './activityTypes';
import { AnonymizedActivityLog, ActivityStats } from './activityTypes';

/**
 * Mock data for anonymized activity logs
 */
export const mockAnonymizedLogs: AnonymizedActivityLog[] = [
  {
    id: '1',
    activity_type: 'visit_page',
    category: 'navigation',
    count: 156,
    timestamp_day: '2025-05-01'
  },
  {
    id: '2',
    activity_type: 'scan_emotion',
    category: 'engagement',
    count: 78,
    timestamp_day: '2025-05-01'
  },
  {
    id: '3',
    activity_type: 'use_coach',
    category: 'engagement',
    count: 42,
    timestamp_day: '2025-05-01'
  },
  {
    id: '4',
    activity_type: 'play_music',
    category: 'engagement',
    count: 63,
    timestamp_day: '2025-05-01'
  },
  {
    id: '5',
    activity_type: 'coach_interaction',
    category: 'engagement',
    count: 37,
    timestamp_day: '2025-05-01'
  }
];

/**
 * Mock data for activity statistics
 */
export const mockActivityStats: ActivityStats[] = [
  {
    activity_type: 'visit_page',
    total_count: 456,
    percentage: 42
  },
  {
    activity_type: 'scan_emotion',
    total_count: 213,
    percentage: 19
  },
  {
    activity_type: 'use_coach',
    total_count: 187,
    percentage: 17
  },
  {
    activity_type: 'play_music',
    total_count: 145,
    percentage: 13
  },
  {
    activity_type: 'coach_interaction', 
    total_count: 97,
    percentage: 9
  }
];
