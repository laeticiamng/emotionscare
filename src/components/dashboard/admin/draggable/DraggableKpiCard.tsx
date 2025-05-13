
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GripVertical, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DashboardWidgetConfig } from '@/types/dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardStats, GamificationData } from '../tabs/overview/types';

// Import our KPI card components
import AbsenteeismKpiCard from '../kpi/AbsenteeismKpiCard';
import EmotionalHealthKpiCard from '../kpi/EmotionalHealthKpiCard';
import ProductivityKpiCard from '../kpi/ProductivityKpiCard';
import TurnoverRiskKpiCard from '../kpi/TurnoverRiskKpiCard';

// Map of widget types to their display components
const WIDGET_COMPONENTS: Record<string, React.FC<any>> = {
  'absenteeism-card': AbsenteeismKpiCard,
  'emotional-health-card': EmotionalHealthKpiCard,
  'productivity-card': ProductivityKpiCard,
  'turnover-risk-card': TurnoverRiskKpiCard,
};

export interface DraggableKpiCardProps {
  widget: DashboardWidgetConfig;
  editable?: boolean;
  onSettingsClick?: (widget: DashboardWidgetConfig) => void;
  dashboardStats?: DashboardStats;
  gamificationData?: GamificationData;
}

export const DraggableKpiCard: React.FC<DraggableKpiCardProps> = ({
  widget,
  editable = true,
  onSettingsClick,
  dashboardStats,
  gamificationData
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: widget.id,
    disabled: !editable
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  // Get the component for this widget type or show placeholder
  const WidgetComponent = WIDGET_COMPONENTS[widget.type] || PlaceholderWidget;

  // Prepare props for the widget component
  const componentProps: any = { widget };
  
  // Add additional data props if available and applicable
  if (dashboardStats && widget.type.includes('dashboard-stats')) {
    componentProps.dashboardStats = dashboardStats;
  }
  
  if (gamificationData && widget.type.includes('gamification')) {
    componentProps.gamificationData = gamificationData;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative',
        editable && 'cursor-grab',
        isDragging && 'cursor-grabbing'
      )}
    >
      <Card className="h-full">
        {editable && (
          <div className="absolute top-2 left-2 opacity-50 hover:opacity-100 z-10">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
              <span className="sr-only">Déplacer</span>
            </Button>
          </div>
        )}
        
        {editable && onSettingsClick && (
          <div className="absolute top-2 right-2 opacity-50 hover:opacity-100 z-10">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onSettingsClick(widget)}
            >
              <Settings className="h-4 w-4" />
              <span className="sr-only">Paramètres</span>
            </Button>
          </div>
        )}
        
        <WidgetComponent {...componentProps} />
      </Card>
    </div>
  );
};

// Placeholder widget to show when the widget type isn't found
const PlaceholderWidget: React.FC<{widget: DashboardWidgetConfig}> = ({ widget }) => {
  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{widget.type || 'Widget'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-3/4" />
        </div>
      </CardContent>
    </>
  );
};
