
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Calendar as CalendarIcon, Download, BarChart4 } from 'lucide-react';
import EmotionHistory from './EmotionHistory';
import EmotionTrendChart from './EmotionTrendChart';
import { useScanPageState } from '@/hooks/useScanPageState';
import { useAuth } from '@/contexts/AuthContext';

const HistoryTabContent = () => {
  const { user } = useAuth();
  const { emotions, loading, periodFilter, setPeriodFilter, refreshEmotionHistory } = useScanPageState(user?.id);
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');
  
  const handlePeriodChange = (value: string) => {
    setPeriodFilter(value as '7' | '30' | '90');
  };
  
  const handleDownload = () => {
    // Logic for downloading emotion history
    console.log('Téléchargement de l\'historique des émotions...');
    alert('Téléchargement commencé');
  };
  
  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-semibold">Historique de mes émotions</h2>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            onClick={() => setViewMode('list')}
            size="sm"
          >
            Liste
          </Button>
          <Button 
            variant={viewMode === 'chart' ? 'default' : 'outline'} 
            onClick={() => setViewMode('chart')}
            size="sm"
          >
            <BarChart4 className="h-4 w-4 mr-1" /> Graphique
          </Button>
          <Select value={periodFilter} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[140px]">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 derniers jours</SelectItem>
              <SelectItem value="30">30 derniers jours</SelectItem>
              <SelectItem value="90">90 derniers jours</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" /> Exporter
          </Button>
        </div>
      </div>
      
      {/* Content based on view mode */}
      {viewMode === 'list' ? (
        <EmotionHistory emotions={emotions} loading={loading} error={null} />
      ) : (
        <EmotionTrendChart emotions={emotions} loading={loading} />
      )}
      
      <div className="flex justify-end">
        <Button variant="outline" onClick={refreshEmotionHistory}>
          Actualiser l'historique
        </Button>
      </div>
    </div>
  );
};

export default HistoryTabContent;
