
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowRight, ArrowUp, LucideIcon } from 'lucide-react';
import { DraggableCardProps } from './types';

const DraggableCard: React.FC<DraggableCardProps> = ({
  id,
  title,
  value,
  icon,
  delta,
  subtitle,
  onClick,
  status = 'primary'
}) => {
  // Handle delta display
  const getDeltaInfo = () => {
    if (!delta) return null;

    let deltaValue: number;
    let trend: 'up' | 'down' | 'neutral';
    let label: string | undefined;

    if (typeof delta === 'number') {
      deltaValue = delta;
      trend = delta > 0 ? 'up' : delta < 0 ? 'down' : 'neutral';
    } else {
      deltaValue = delta.value;
      trend = delta.trend;
      label = delta.label;
    }

    const colors = {
      up: 'text-emerald-500',
      down: 'text-red-500',
      neutral: 'text-gray-500',
    };

    const icons = {
      up: <ArrowUp className="h-4 w-4" />,
      down: <ArrowDown className="h-4 w-4" />,
      neutral: <ArrowRight className="h-4 w-4" />,
    };

    return (
      <div className={`flex items-center gap-1 ${colors[trend]}`}>
        {icons[trend]}
        <span>
          {deltaValue > 0 && '+'}
          {deltaValue}%
          {label && ` ${label}`}
        </span>
      </div>
    );
  };

  // Status colors
  const statusColors = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-emerald-500/10 text-emerald-500',
    warning: 'bg-amber-500/10 text-amber-500',
    danger: 'bg-red-500/10 text-red-500',
    info: 'bg-sky-500/10 text-sky-500',
  };

  // Determine icon component
  const IconComponent = () => {
    if (!icon) return null;
    
    // If icon is a ReactNode (already rendered component)
    if (React.isValidElement(icon)) {
      return <div className="p-2 rounded-full bg-muted">{icon}</div>;
    }
    
    // If icon is a LucideIcon component type
    const LucideIconComponent = icon as LucideIcon;
    if (typeof LucideIconComponent === 'function') {
      return (
        <div className="p-2 rounded-full bg-muted">
          <LucideIconComponent className="h-5 w-5" />
        </div>
      );
    }
    
    // Fallback
    return null;
  };

  return (
    <Card 
      className={cn(
        "transition-all border shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing",
        onClick && "hover:border-primary"
      )}
      onClick={onClick}
      data-id={id}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <IconComponent />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-1">
          <p className="text-2xl font-bold">{value}</p>
          {getDeltaInfo()}
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default DraggableCard;
