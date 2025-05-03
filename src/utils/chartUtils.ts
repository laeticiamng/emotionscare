
import { mockReports } from '@/data/mockReports';

// Format date for charts
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

// Convert reports to chart data
export const prepareReportData = (metric: 'absenteeism' | 'productivity') => {
  return mockReports
    .filter(report => report.metric === metric)
    .map(report => ({
      date: formatDate(report.period_end),
      value: report.value
    }))
    .sort((a, b) => {
      const [dayA, monthA] = a.date.split('/').map(Number);
      const [dayB, monthB] = b.date.split('/').map(Number);
      
      // Sort by month, then by day
      if (monthA !== monthB) {
        return monthA - monthB;
      }
      return dayA - dayB;
    });
};
