
import React from 'react';
import { DraggableKpiCardsGridProps } from '@/types';
import { default as DraggableKpiCard } from './draggable/DraggableKpiCard';

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
