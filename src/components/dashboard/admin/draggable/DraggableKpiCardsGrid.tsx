
import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import DraggableCard from './DraggableCard';

export interface DraggableCardProps {
  id: string;
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  description?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  status?: 'positive' | 'negative' | 'neutral';
}

interface DraggableKpiCardsGridProps {
  kpiCards: DraggableCardProps[];
  onOrderChange?: (newOrder: string[]) => void;
}

const DraggableKpiCardsGrid: React.FC<DraggableKpiCardsGridProps> = ({ 
  kpiCards, 
  onOrderChange 
}) => {
  const [items, setItems] = React.useState<DraggableCardProps[]>(kpiCards);
  
  React.useEffect(() => {
    setItems(kpiCards);
  }, [kpiCards]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeIndex = items.findIndex((item) => item.id === active.id);
      const overIndex = items.findIndex((item) => item.id === over.id);
      
      const newItems = [...items];
      newItems.splice(activeIndex, 1);
      newItems.splice(overIndex, 0, items[activeIndex]);
      
      setItems(newItems);
      
      if (onOrderChange) {
        onOrderChange(newItems.map(item => item.id));
      }
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={items.map(item => ({ id: item.id }))}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((card) => (
            <DraggableCard
              key={card.id}
              id={card.id}
              title={card.title}
              value={card.value}
              icon={card.icon}
              change={card.change}
              description={card.description}
              color={card.color}
              status={card.status}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default DraggableKpiCardsGrid;
