
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ActivityFiltersState, ActivityStats, AnonymousActivity, ActivityTabView } from './types';

// Helper to get a user-friendly label for activity types
export const getActivityLabel = (activityType: string): string => {
  const activityLabels: Record<string, string> = {
    'login': 'Connexion',
    'logout': 'Déconnexion',
    'scan_emotion': 'Scan émotionnel',
    'journal_entry': 'Journal',
    'music_play': 'Écoute musicale',
    'vr_session': 'Session VR',
    'profile_update': 'Mise à jour profil',
    'invitation_sent': 'Invitation envoyée',
    'invitation_accepted': 'Invitation acceptée',
    'account_created': 'Compte créé',
  };
  
  return activityLabels[activityType] || activityType;
};

// Format CSV data based on the active tab
export const formatCsvData = (
  activeTab: ActivityTabView, 
  data: AnonymousActivity[] | ActivityStats[]
): any[] => {
  if (activeTab === 'daily') {
    return (data as AnonymousActivity[]).map(item => ({
      Date: item.timestamp_day,
      'Type d\'activité': getActivityLabel(item.activity_type),
      Catégorie: item.category,
      'Nombre': item.count
    }));
  } else {
    return (data as ActivityStats[]).map(item => ({
      'Type d\'activité': getActivityLabel(item.activity_type),
      'Nombre total': item.total_count,
      'Pourcentage': `${item.percentage.toFixed(1)}%`
    }));
  }
};

// Get a default file name for CSV export
export const getDefaultCsvFileName = (activeTab: ActivityTabView): string => {
  const today = format(new Date(), 'yyyy-MM-dd', { locale: fr });
  return activeTab === 'daily' 
    ? `activites-journalieres-${today}.csv` 
    : `statistiques-activites-${today}.csv`;
};

// Apply filters to activity data
export const applyFilters = (
  data: AnonymousActivity[], 
  filters: ActivityFiltersState
): AnonymousActivity[] => {
  return data.filter(activity => {
    // Apply search filter
    const matchesSearch = !filters.searchTerm || 
      activity.activity_type.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      activity.category.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    // Apply activity type filter
    const matchesType = !filters.activityType || activity.activity_type === filters.activityType;
    
    // Apply date filters if provided
    const activityDate = new Date(activity.timestamp_day);
    const matchesStartDate = !filters.startDate || activityDate >= filters.startDate;
    const matchesEndDate = !filters.endDate || activityDate <= filters.endDate;
    
    return matchesSearch && matchesType && matchesStartDate && matchesEndDate;
  });
};
