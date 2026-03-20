
import { AnonymousActivity, ActivityStats, ActivityFiltersState, ActivityTabView } from "./types";

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

// Fix the type issue by using a generic approach
export const applyFilters = <T extends AnonymousActivity | ActivityStats>(
  data: T[], 
  filters: ActivityFiltersState
): T[] => {
  return data.filter((item) => {
    // Apply search term filter
    if (filters.searchTerm && !JSON.stringify(item).toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply activity type filter
    if (filters.activityType && 'activity_type' in item && item.activity_type !== filters.activityType) {
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
  });
};

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

export const getDefaultCsvFileName = (tabView: ActivityTabView): string => {
  const date = new Date().toISOString().split('T')[0];
  return tabView === 'daily'
    ? `activites-journalieres-${date}.csv`
    : `statistiques-activites-${date}.csv`;
};

// Added function for compatibility with ActivityLogsTab.tsx
export const exportActivityData = (data: any[], filename: string): void => {
  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(item => Object.values(item).join(','))
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
