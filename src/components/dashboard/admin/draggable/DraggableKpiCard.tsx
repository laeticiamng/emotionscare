
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from "@dnd-kit/utilities";
import { KpiCardProps } from '@/types';
import KpiCard from '../KpiCard';

// Component for a draggable KPI card
const DraggableKpiCard = (props: KpiCardProps & { id: string }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: props.id || props.title });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
    position: 'relative' as 'relative',
  };

  // Pass only the KpiCard props without DnD specific props
  const cardProps: KpiCardProps = {
    title: props.title,
    value: props.value,
    icon: props.icon,
    delta: props.delta,
    subtitle: props.subtitle,
    ariaLabel: props.ariaLabel,
    onClick: props.onClick,
    className: props.className
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`transition-all duration-300 ${isDragging ? 'scale-105 shadow-md' : ''}`}
    >
      <div {...attributes} {...listeners}>
        <KpiCard {...cardProps} />
      </div>
    </div>
  );
};

export default DraggableKpiCard;
