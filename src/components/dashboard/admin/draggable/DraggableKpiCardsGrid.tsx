
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import KpiCard from '@/components/dashboard/admin/cards/KpiCard';
import { KpiCardProps } from '@/types';

export interface DraggableCardProps {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  delta?: number | {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  };
  subtitle?: React.ReactNode;
  ariaLabel?: string;
  onClick?: () => void;
  status?: 'success' | 'warning' | 'danger';
}

interface DraggableKpiCardsGridProps {
  cards: DraggableCardProps[];
  onLayoutChange?: (layout: any[]) => void;
  className?: string;
  isEditable?: boolean;
}

const DraggableKpiCardsGrid: React.FC<DraggableKpiCardsGridProps> = ({
  cards,
  onLayoutChange,
  className,
  isEditable = false
}) => {
  const [layout, setLayout] = useState(
    cards.map(card => ({
      i: card.id,
      x: card.x,
      y: card.y,
      w: card.w,
      h: card.h,
      minW: 1,
      maxW: 12,
      minH: 1,
      maxH: 4
    }))
  );

  const handleLayoutChange = (newLayout: any) => {
    setLayout(newLayout);
    if (onLayoutChange) {
      onLayoutChange(newLayout);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={100}
        width={1200}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        isDraggable={isEditable}
        isResizable={isEditable}
        onLayoutChange={handleLayoutChange}
      >
        {cards.map(card => (
          <div key={card.id} className="shadow-sm">
            <KpiCard
              title={card.title}
              value={card.value}
              icon={card.icon}
              delta={card.delta}
              subtitle={card.subtitle}
              ariaLabel={card.ariaLabel}
              onClick={card.onClick}
              className="h-full"
              status={card.status}
            />
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default DraggableKpiCardsGrid;
