
import { AnonymousActivity, ActivityStats } from './types';

/**
 * Prepares activity data for export to CSV or other formats
 */
export const exportActivityData = (data: AnonymousActivity[] | ActivityStats[], format: 'csv' | 'json' = 'csv'): string => {
  if (data.length === 0) {
    return '';
  }

  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }
  
  // Assuming CSV format
  // First, determine if we're dealing with daily activities or stats
  const isActivityStats = 'percentage' in data[0];
  
  // Create headers
  const headers = isActivityStats 
    ? ['Type', 'Total', 'Percentage']
    : ['ID', 'Type', 'Category', 'Count', 'Date'];
  
  // Create rows
  const rows = data.map(item => {
    if (isActivityStats) {
      const stat = item as ActivityStats;
      return [
        stat.activity_type,
        stat.total_count.toString(),
        stat.percentage.toFixed(1) + '%'
      ].join(',');
    } else {
      const activity = item as AnonymousActivity;
      return [
        activity.id,
        activity.activity_type,
        activity.category,
        activity.count.toString(),
        activity.timestamp_day
      ].join(',');
    }
  });
  
  return [headers.join(','), ...rows].join('\n');
};
