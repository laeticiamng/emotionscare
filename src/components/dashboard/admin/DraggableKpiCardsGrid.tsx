
import React, { useState } from 'react';
import { DraggableCardProps } from './draggable/types';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DraggableCard from './draggable/DraggableCard';

export interface DraggableKpiCardsGridProps {
  cards?: DraggableCardProps[];
  kpiCards?: DraggableCardProps[];
  onOrderChange?: (cards: DraggableCardProps[]) => void;
}

export const DraggableKpiCardsGrid: React.FC<DraggableKpiCardsGridProps> = ({ 
  cards,
  kpiCards,
  onOrderChange 
}) => {
  const cardsToUse = cards || kpiCards || [];
  
  const [sortedCards, setSortedCards] = useState<DraggableCardProps[]>(
    cardsToUse.map((card, index) => ({
      ...card,
      id: card.id || `card-${index}`
    }))
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = sortedCards.findIndex(card => card.id === active.id);
      const newIndex = sortedCards.findIndex(card => card.id === over.id);
      
      const newOrder = [...sortedCards];
      const [removed] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, removed);
      
      setSortedCards(newOrder);
      onOrderChange?.(newOrder);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortedCards.map(card => ({ id: card.id }))}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedCards.map((card) => (
            <SortableCardWrapper
              key={card.id}
              id={card.id}
              {...card}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

const SortableCardWrapper: React.FC<DraggableCardProps> = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <DraggableCard {...props} />
    </div>
  );
};

export default DraggableKpiCardsGrid;
