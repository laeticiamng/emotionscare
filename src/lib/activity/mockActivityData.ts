
import { AnonymizedActivityLog, ActivityStats } from './activityTypes';

// Mock anonymized activity logs for admin dashboard
export const mockActivityLogs: AnonymizedActivityLog[] = [
  {
    id: '1',
    activity_type: 'login',
    category: 'authentication',
    count: 128,
    timestamp_day: '2023-05-01'
  },
  {
    id: '2',
    activity_type: 'scan_emotion',
    category: 'wellness',
    count: 98,
    timestamp_day: '2023-05-01'
  },
  {
    id: '3',
    activity_type: 'journal_entry',
    category: 'wellness',
    count: 42,
    timestamp_day: '2023-05-01'
  },
  {
    id: '4',
    activity_type: 'coach_message',
    category: 'coaching',
    count: 76,
    timestamp_day: '2023-05-02'
  },
  {
    id: '5',
    activity_type: 'vr_session',
    category: 'wellness',
    count: 31,
    timestamp_day: '2023-05-02'
  }
];

// Mock activity statistics
export const mockActivityStats: ActivityStats[] = [
  {
    activity_type: 'login',
    total_count: 580,
    percentage: 28.5
  },
  {
    activity_type: 'scan_emotion',
    total_count: 423,
    percentage: 20.8
  },
  {
    activity_type: 'journal_entry',
    total_count: 217,
    percentage: 10.7
  },
  {
    activity_type: 'coach_message',
    total_count: 382,
    percentage: 18.7
  },
  {
    activity_type: 'vr_session',
    total_count: 156,
    percentage: 7.6
  },
  {
    activity_type: 'music_play',
    total_count: 278,
    percentage: 13.7
  }
];

// Alias for compatibility with existing imports
export const mockActivities = mockActivityLogs;
export const mockStats = mockActivityStats;
