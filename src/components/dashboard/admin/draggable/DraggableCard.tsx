
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from "@dnd-kit/utilities";
import KpiCard from '../KpiCard';
import { GripVertical } from 'lucide-react';
import { DraggableCardProps } from './types';

// Component for a single draggable card
const DraggableCard: React.FC<DraggableCardProps> = (props) => {
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
      <div className="relative">
        <div
          className="absolute right-2 top-2 cursor-grab p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          tabIndex={0}
          role="button"
          aria-grabbed={isDragging}
          aria-keyshortcuts="Space, ArrowUp, ArrowDown, ArrowLeft, ArrowRight"
        >
          <GripVertical size={16} />
        </div>
        <KpiCard 
          title={props.title} 
          value={props.value?.toString() || ''} 
          icon={props.icon && <props.icon className="h-6 w-6" />}
          delta={props.delta} 
          subtitle={props.subtitle} 
          ariaLabel={props.ariaLabel}
          onClick={props.onClick}
        />
      </div>
    </div>
  );
};

export default DraggableCard;
