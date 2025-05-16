
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from "@dnd-kit/utilities";
import { KpiCardProps } from '@/types';
import KpiCard from '../KpiCard';

// Component for a draggable KPI card
const DraggableKpiCard = (props: KpiCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
    position: 'relative' as 'relative',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`transition-all duration-300 ${isDragging ? 'scale-105 shadow-md' : ''}`}
    >
      <div {...attributes} {...listeners}>
        <KpiCard {...props} />
      </div>
    </div>
  );
};

export default DraggableKpiCard;
