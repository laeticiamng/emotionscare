
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { GripVertical, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface DraggableCardProps {
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

const DraggableCard: React.FC<DraggableCardProps> = ({
  id,
  title,
  value,
  icon,
  change,
  description,
  color = 'primary',
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
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  // Map status if provided, otherwise use change trend to determine color
  let colorClass = '';
  let statusIcon = null;
  
  if (status) {
    switch (status) {
      case 'positive':
        colorClass = 'text-green-500';
        statusIcon = <TrendingUp className="h-4 w-4" />;
        break;
      case 'negative':
        colorClass = 'text-red-500';
        statusIcon = <TrendingDown className="h-4 w-4" />;
        break;
      default:
        colorClass = 'text-gray-500';
        statusIcon = <Minus className="h-4 w-4" />;
    }
  } else if (change) {
    switch (change.trend) {
      case 'up':
        colorClass = 'text-green-500';
        statusIcon = <TrendingUp className="h-4 w-4" />;
        break;
      case 'down':
        colorClass = 'text-red-500';
        statusIcon = <TrendingDown className="h-4 w-4" />;
        break;
      default:
        colorClass = 'text-gray-500';
        statusIcon = <Minus className="h-4 w-4" />;
    }
  }

  return (
    <div ref={setNodeRef} style={style} className="touch-none">
      <Card className="group relative">
        <div
          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              {icon && <div className="mr-3 text-muted-foreground">{icon}</div>}
              <h3 className="text-sm font-medium">{title}</h3>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-2xl font-bold">{value}</p>
              {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
            </div>
            {(change || status) && (
              <div className={`flex items-center ${colorClass}`}>
                {statusIcon}
                {change && <span className="ml-1 text-xs">{change.value > 0 ? '+' : ''}{change.value}%</span>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DraggableCard;
