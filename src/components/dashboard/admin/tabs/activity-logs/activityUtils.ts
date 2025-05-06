
import { AnonymousActivity, ActivityStats, ActivityFiltersState, ActivityTabView } from './types';

/**
 * Gets a human-readable label for an activity type
 */
export const getActivityLabel = (activityType: string): string => {
  const labels: Record<string, string> = {
    login: 'Connexion',
    logout: 'Déconnexion',
    scan_emotion: 'Scan émotionnel',
    journal_entry: 'Journal',
    music_play: 'Écoute musicale',
    vr_session: 'Session VR',
    profile_update: 'Mise à jour profil',
    account_created: 'Création de compte',
    invitation_sent: 'Invitation envoyée',
    invitation_accepted: 'Invitation acceptée',
  };
  
  return labels[activityType] || activityType;
};

/**
 * Apply filters to activity data
 */
export const applyFilters = (
  data: AnonymousActivity[] | ActivityStats[], 
  filters: ActivityFiltersState
): AnonymousActivity[] | ActivityStats[] => {
  if (!data.length) return data;
  
  return data.filter((item) => {
    // Apply search term filter
    if (filters.searchTerm && !JSON.stringify(item).toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply activity type filter
    if (filters.activityType && filters.activityType !== 'all' && item.activity_type !== filters.activityType) {
      return false;
    }
    
    // Apply date filter for activities (not for stats)
    if ('timestamp_day' in item && (filters.startDate || filters.endDate)) {
      const itemDate = new Date(item.timestamp_day);
      
      if (filters.startDate && itemDate < filters.startDate) {
        return false;
      }
      
      if (filters.endDate) {
        // Add one day to the end date to include the entire end day
        const endDatePlusDay = new Date(filters.endDate);
        endDatePlusDay.setDate(endDatePlusDay.getDate() + 1);
        
        if (itemDate > endDatePlusDay) {
          return false;
        }
      }
    }
    
    return true;
  }) as any;
};

/**
 * Format data for CSV export
 */
export const formatCsvData = (
  tabView: ActivityTabView,
  data: AnonymousActivity[] | ActivityStats[]
): Record<string, string>[] => {
  if (tabView === 'daily') {
    return (data as AnonymousActivity[]).map(item => ({
      'Type d\'activité': getActivityLabel(item.activity_type),
      'Catégorie': item.category,
      'Nombre': item.count.toString(),
      'Date': new Date(item.timestamp_day).toLocaleDateString('fr-FR')
    }));
  } else {
    return (data as ActivityStats[]).map(item => ({
      'Type d\'activité': getActivityLabel(item.activity_type),
      'Total': item.total_count.toString(),
      'Pourcentage': `${item.percentage.toFixed(1)}%`
    }));
  }
};

/**
 * Generate default CSV filename
 */
export const getDefaultCsvFileName = (tabView: ActivityTabView): string => {
  const date = new Date().toISOString().split('T')[0];
  return tabView === 'daily'
    ? `activites-journalieres-${date}.csv`
    : `statistiques-activites-${date}.csv`;
};

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
