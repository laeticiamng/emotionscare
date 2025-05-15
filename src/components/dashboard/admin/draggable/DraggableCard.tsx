
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, GripHorizontal, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DraggableCardProps } from './types';

const DraggableCard: React.FC<DraggableCardProps> = ({
  id,
  title,
  value,
  icon: Icon,
  delta,
  subtitle,
  ariaLabel,
  onClick
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('cardId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedCardId = e.dataTransfer.getData('cardId');
    // Handle drop logic here or pass to parent component
  };

  // Determine delta display
  let deltaElement = null;
  if (delta) {
    const deltaValue = typeof delta === 'number' ? delta : delta.value;
    const deltaLabel = typeof delta === 'number' ? undefined : delta.label;
    const trend = typeof delta === 'number' 
      ? (deltaValue > 0 ? 'up' : deltaValue < 0 ? 'down' : 'neutral')
      : delta.trend;
      
    const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
    
    deltaElement = (
      <div className={`flex items-center ${trendColor}`}>
        {trend === 'up' && <ArrowUp className="h-4 w-4 mr-1" />}
        {trend === 'down' && <ArrowDown className="h-4 w-4 mr-1" />}
        {trend === 'neutral' && <Minus className="h-4 w-4 mr-1" />}
        <span>
          {Math.abs(deltaValue)}%
          {deltaLabel && <span className="text-muted-foreground ml-1">{deltaLabel}</span>}
        </span>
      </div>
    );
  }

  return (
    <Card
      className={cn("relative group", onClick && "cursor-pointer hover:shadow-md transition-shadow")}
      draggable={true}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
        <GripHorizontal className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <CardHeader className="flex flex-row items-start space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground ml-auto" />}
      </CardHeader>
      
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === 'string' || typeof value === 'number' ? value : '—'}
        </div>
        
        <div className="flex items-center justify-between mt-1">
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
          {deltaElement}
        </div>
      </CardContent>
    </Card>
  );
};

export default DraggableCard;
