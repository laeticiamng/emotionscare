
import React, { useState } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { DraggableKpiCard } from './DraggableKpiCard';
import { DashboardWidgetConfig } from '@/types/dashboard';
import { DashboardStats, GamificationData } from '../tabs/overview/types';

interface DraggableKpiCardsGridProps {
  widgets: DashboardWidgetConfig[];
  onWidgetsChange?: (widgets: DashboardWidgetConfig[]) => void;
  className?: string;
  editable?: boolean;
  dashboardStats?: DashboardStats;
  gamificationData?: GamificationData;
}

const DraggableKpiCardsGrid: React.FC<DraggableKpiCardsGridProps> = ({
  widgets,
  onWidgetsChange,
  className = '',
  editable = true,
  dashboardStats,
  gamificationData
}) => {
  const [items, setItems] = useState<DashboardWidgetConfig[]>(widgets);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }

    setItems((currentItems) => {
      const oldIndex = currentItems.findIndex(item => item.id === active.id);
      const newIndex = currentItems.findIndex(item => item.id === over.id);
      
      const newItems = arrayMove(currentItems, oldIndex, newIndex);
      
      // Call the callback if provided
      if (onWidgetsChange) {
        onWidgetsChange(newItems);
      }
      
      return newItems;
    });
  }

  // Pass the dashboardStats and gamificationData to each card that might need them
  const getCardProps = (widget: DashboardWidgetConfig) => {
    let props: any = { widget };

    if (dashboardStats && widget.type.includes('dashboard-stats')) {
      props.dashboardStats = dashboardStats;
    }
    
    if (gamificationData && widget.type.includes('gamification')) {
      props.gamificationData = gamificationData;
    }

    return props;
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map(item => item.id)} strategy={rectSortingStrategy}>
          {items.map((widget) => (
            <DraggableKpiCard
              key={widget.id}
              {...getCardProps(widget)}
              editable={editable}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default DraggableKpiCardsGrid;
