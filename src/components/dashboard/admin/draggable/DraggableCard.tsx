
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowDown, ArrowRight, ArrowUp, GripHorizontal } from 'lucide-react';
import { DraggableCardProps } from '@/types/widgets';
import { cn } from '@/lib/utils';

export const DraggableCard: React.FC<DraggableCardProps> = ({
  id,
  title,
  value,
  icon,
  delta,
  subtitle,
  ariaLabel,
  onClick,
  status
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  // Determine the color based on status
  const getStatusClasses = () => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-700';
      case 'warning':
        return 'border-amber-200 bg-amber-50 text-amber-700';
      case 'danger':
        return 'border-red-200 bg-red-50 text-red-700';
      default:
        return '';
    }
  };

  // Render the trend indicator if delta is provided
  const renderTrend = () => {
    if (!delta) return null;
    
    const deltaValue = typeof delta === 'number' ? delta : delta.value;
    const deltaLabel = typeof delta === 'number' ? null : delta.label;
    const trend = typeof delta === 'number' 
      ? (delta > 0 ? 'up' : delta < 0 ? 'down' : 'neutral') 
      : delta.trend;
    
    let TrendIcon;
    let trendClass;
    
    switch (trend) {
      case 'up':
        TrendIcon = ArrowUp;
        trendClass = 'text-green-600';
        break;
      case 'down':
        TrendIcon = ArrowDown;
        trendClass = 'text-red-600';
        break;
      default:
        TrendIcon = ArrowRight;
        trendClass = 'text-amber-600';
    }
    
    return (
      <div className={`flex items-center gap-1 text-sm ${trendClass}`}>
        <TrendIcon className="h-4 w-4" />
        <span>{Math.abs(deltaValue)}%</span>
        {deltaLabel && <span className="text-muted-foreground text-xs">{deltaLabel}</span>}
      </div>
    );
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'cursor-grab active:cursor-grabbing transition-colors',
        getStatusClasses(),
        onClick && 'hover:bg-muted/50 transition-colors'
      )}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-sm">{title}</span>
        </div>
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted/50"
        >
          <GripHorizontal className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">{value}</div>
          {renderTrend()}
        </div>
        {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
      </CardContent>
    </Card>
  );
};
