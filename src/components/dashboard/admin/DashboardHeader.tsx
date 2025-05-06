
import React from 'react';
import PeriodSelector from './PeriodSelector';
import { SegmentSelector } from './SegmentSelector';
import { useSegment } from '@/contexts/SegmentContext';
import AutoRefreshControl from '@/components/dashboard/AutoRefreshControl';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';

interface DashboardHeaderProps {
  timePeriod: string;
  setTimePeriod: (period: string) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  timePeriod, 
  setTimePeriod, 
  isLoading = false,
  onRefresh = () => {}
}) => {
  const { activeDimension, activeOption } = useSegment();
  
  const {
    enabled: autoRefreshEnabled,
    interval: autoRefreshInterval,
    refreshing,
    toggleAutoRefresh,
    changeInterval
  } = useAutoRefresh({
    onRefresh,
    defaultEnabled: false,
    defaultInterval: 60000 // 1 minute default
  });
  
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord <span className="font-semibold">Direction</span></h1>
          <h2 className="text-muted-foreground mt-2">
            Métriques globales et anonymisées
          </h2>
          {activeDimension && activeOption && (
            <div className="mt-2 text-sm font-medium text-primary">
              Segment actif : {activeDimension.label} → {activeOption.label}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0 items-center">
          <AutoRefreshControl
            enabled={autoRefreshEnabled}
            interval={autoRefreshInterval}
            refreshing={refreshing}
            onToggle={toggleAutoRefresh}
            onIntervalChange={changeInterval}
          />
          <SegmentSelector />
          <PeriodSelector timePeriod={timePeriod} setTimePeriod={setTimePeriod} />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
