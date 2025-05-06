
import React from 'react';
import PeriodSelector from './PeriodSelector';
import { SegmentSelector } from './SegmentSelector';
import { useSegment } from '@/contexts/SegmentContext';

interface DashboardHeaderProps {
  timePeriod: string;
  setTimePeriod: (period: string) => void;
  isLoading?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  timePeriod, 
  setTimePeriod, 
  isLoading = false 
}) => {
  const { activeDimension, activeOption } = useSegment();
  
  return (
    <div className="mb-10 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start justify-between">
        <div>
          <h1 className="text-4xl font-light">Tableau de bord <span className="font-semibold">Direction</span></h1>
          <h2 className="text-xl text-muted-foreground mt-2">
            Métriques globales et anonymisées
          </h2>
          {activeDimension && activeOption && (
            <div className="mt-2 text-sm font-medium text-primary">
              Segment actif : {activeDimension.label} → {activeOption.label}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <SegmentSelector />
          <PeriodSelector timePeriod={timePeriod} setTimePeriod={setTimePeriod} />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
