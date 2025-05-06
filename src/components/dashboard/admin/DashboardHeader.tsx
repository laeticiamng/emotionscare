
import React from 'react';
import PeriodSelector from './PeriodSelector';

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
  return (
    <div className="mb-10 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start justify-between">
        <div>
          <h1 className="text-4xl font-light">Tableau de bord <span className="font-semibold">Direction</span></h1>
          <h2 className="text-xl text-muted-foreground mt-2">
            Métriques globales et anonymisées
            {isLoading && (
              <span className="inline-block ml-2 w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" 
                    aria-hidden="true" />
            )}
          </h2>
        </div>
        <PeriodSelector 
          timePeriod={timePeriod} 
          setTimePeriod={setTimePeriod} 
          disabled={isLoading} 
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
