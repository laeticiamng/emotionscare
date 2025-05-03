
import { Report } from '../types';

// Mock Reports
export const mockReports: Report[] = [
  {
    id: '1',
    metric: 'absenteeism',
    period_start: '2023-04-01T00:00:00Z',
    period_end: '2023-04-07T00:00:00Z',
    value: 3.5,
    change_pct: -2.1,
  },
  {
    id: '2',
    metric: 'absenteeism',
    period_start: '2023-04-08T00:00:00Z',
    period_end: '2023-04-14T00:00:00Z',
    value: 3.2,
    change_pct: -8.6,
  },
  {
    id: '3',
    metric: 'productivity',
    period_start: '2023-04-01T00:00:00Z',
    period_end: '2023-04-07T00:00:00Z',
    value: 87.3,
    change_pct: 1.5,
  },
  {
    id: '4',
    metric: 'productivity',
    period_start: '2023-04-08T00:00:00Z',
    period_end: '2023-04-14T00:00:00Z',
    value: 89.7,
    change_pct: 2.7,
  },
];
