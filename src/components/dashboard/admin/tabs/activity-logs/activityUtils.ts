
/**
 * Get a human-readable label for an activity type
 */
export const getActivityLabel = (type: string): string => {
  switch (type) {
    case 'connexion': return 'Connexion';
    case 'consultation': return 'Consultation';
    case 'inscription_event': return 'Inscription';
    case 'modification_profil': return 'Modification profil';
    case 'questionnaire_reponse': return 'Questionnaire';
    default: return type;
  }
};

/**
 * Export activity data as CSV
 */
export const exportActivityData = (
  activeTab: ActivityTabView,
  data: AnonymousActivity[] | ActivityStats[]
): void => {
  if (data.length === 0) return;
  
  let csvContent = '';
  let fileName = '';
  
  if (activeTab === 'daily') {
    const activities = data as AnonymousActivity[];
    const csvHeaders = ['Type d\'activité', 'Catégorie', 'Nombre', 'Date'];
    csvContent = activities.map(activity => {
      return [
        activity.activity_type,
        activity.category,
        activity.count,
        activity.timestamp_day
      ].join(',');
    }).join('\n');
    fileName = 'activites_anonymes.csv';
    
    const csv = [csvHeaders.join(','), csvContent].join('\n');
    downloadCsv(csv, fileName);
  } else {
    const stats = data as ActivityStats[];
    const csvHeaders = ['Type d\'activité', 'Total', 'Pourcentage'];
    csvContent = stats.map(stat => {
      return [
        stat.activity_type,
        stat.total_count,
        `${stat.percentage}%`
      ].join(',');
    }).join('\n');
    fileName = 'statistiques_activites.csv';
    
    const csv = [csvHeaders.join(','), csvContent].join('\n');
    downloadCsv(csv, fileName);
  }
};

/**
 * Create and download a CSV file
 */
const downloadCsv = (csvContent: string, fileName: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
