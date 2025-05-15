
import React from 'react';
import { KpiCardProps } from '@/types/dashboard';
import DraggableKpiCard from './DraggableKpiCard';

interface DraggableKpiCardsGridProps {
  kpiCards: KpiCardProps[];
  className?: string;
}

const DraggableKpiCardsGrid: React.FC<DraggableKpiCardsGridProps> = ({ 
  kpiCards,
  className = ""
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {kpiCards.map((card, index) => (
        <DraggableKpiCard key={index} {...card} />
      ))}
    </div>
  );
};

export default DraggableKpiCardsGrid;
