import { ActivityTabView, AnonymousActivity, ActivityStats } from './types';
import { getActivityLabel } from './activityUtils';
import { toast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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

export const exportActivityData = (
  activeTab: ActivityTabView, 
  data: AnonymousActivity[] | ActivityStats[]
): void => {
  try {
    const formattedData = formatCsvData(activeTab, data);
    const fileName = getDefaultCsvFileName(activeTab);
    
    // Convert to CSV and download
    const headers = Object.keys(formattedData[0]);
    const csvRows = [
      headers.join(','),
      ...formattedData.map(row => Object.values(row).join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export réussi",
      description: `Les données ont été exportées dans ${fileName}`
    });
  } catch (error) {
    console.error("Export error:", error);
    toast({
      title: "Erreur lors de l'export",
      description: "Impossible d'exporter les données",
      variant: "destructive"
    });
  }
};
