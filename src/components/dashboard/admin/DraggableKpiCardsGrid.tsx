// @ts-nocheck
import React, { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { DraggableCard } from './draggable/DraggableCard';
import { DraggableKpiCardsGridProps, DraggableCardProps } from '@/types/widgets';

const DraggableKpiCardsGrid: React.FC<DraggableKpiCardsGridProps> = ({ kpiCards }) => {
  const [cards, setCards] = useState<DraggableCardProps[]>(
    kpiCards.map((card, index) => ({
      ...card,
      id: card.id || `card-${index}`
    }))
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newItems = [...items];
          const [removed] = newItems.splice(oldIndex, 1);
          newItems.splice(newIndex, 0, removed);
          return newItems;
        }

        return items;
      });
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={cards.map(card => card.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <DraggableCard
              key={card.id}
              id={card.id}
              title={card.title}
              value={card.value}
              icon={card.icon}
              delta={card.delta}
              subtitle={card.subtitle}
              ariaLabel={card.ariaLabel}
              onClick={card.onClick}
              status={card.status}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default DraggableKpiCardsGrid;
