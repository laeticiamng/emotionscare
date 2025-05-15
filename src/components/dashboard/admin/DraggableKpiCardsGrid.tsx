
import React from 'react';
import { DraggableKpiCardsGridProps } from '@/types';
import DraggableKpiCard from './draggable/DraggableKpiCard';

const DraggableKpiCardsGrid: React.FC<DraggableKpiCardsGridProps> = ({ 
  cards,
  kpiCards,
  className = ""
}) => {
  // Use either cards or kpiCards, with preference for kpiCards
  const cardsToRender = kpiCards || cards || [];
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {cardsToRender.map((card, index) => (
        <DraggableKpiCard key={index} {...card} />
      ))}
    </div>
  );
};

export default DraggableKpiCardsGrid;
