
import React, { useState } from 'react';
import DraggableCard from './DraggableCard';
import { DraggableCardProps, DraggableKpiCardsGridProps } from './types';

const DraggableKpiCardsGrid: React.FC<DraggableKpiCardsGridProps> = ({ 
  cards,
  kpiCards,
  onOrderChange 
}) => {
  // Use either cards or kpiCards prop
  const cardsList = cards || kpiCards || [];
  const [draggableCards, setDraggableCards] = useState<DraggableCardProps[]>(cardsList);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex === dropIndex) return;

    const newCards = [...draggableCards];
    const draggedCard = newCards[dragIndex];
    
    // Remove the dragged card
    newCards.splice(dragIndex, 1);
    // Insert it at the drop position
    newCards.splice(dropIndex, 0, draggedCard);

    setDraggableCards(newCards);
    if (onOrderChange) {
      onOrderChange(newCards);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {draggableCards.map((card, index) => (
        <div
          key={card.id || `card-${index}`}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          className="transition-all"
        >
          <DraggableCard
            id={card.id || `card-${index}`}
            title={card.title}
            value={card.value}
            icon={card.icon}
            delta={card.delta}
            subtitle={card.subtitle}
            status={card.status}
          />
        </div>
      ))}
    </div>
  );
};

export default DraggableKpiCardsGrid;
