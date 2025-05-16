
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import KpiCard from '@/components/dashboard/admin/KpiCard';
import { KpiCardProps, DraggableKpiCardsGridProps } from '@/types/dashboard';

const DraggableKpiCardsGrid: React.FC<DraggableKpiCardsGridProps> = ({
  kpiCards,
  cards,
  onLayoutChange,
  className,
  isEditable = false
}) => {
  // Use either cards or kpiCards prop, prioritizing cards if both are provided
  const cardsToUse = cards || kpiCards || [];

  const [layout, setLayout] = useState(
    cardsToUse.map((card, index) => ({
      i: card.id,
      x: card.x !== undefined ? card.x : (index % 3) * 4,
      y: card.y !== undefined ? card.y : Math.floor(index / 3),
      w: card.w !== undefined ? card.w : 4,
      h: card.h !== undefined ? card.h : 1,
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
        {cardsToUse.map(card => (
          <div key={card.id} className="shadow-sm">
            <KpiCard
              id={card.id}
              title={card.title}
              value={card.value}
              icon={card.icon}
              delta={card.delta}
              subtitle={card.subtitle}
              ariaLabel={card.ariaLabel || card.title}
              onClick={card.onClick}
              status={card.status}
            />
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default DraggableKpiCardsGrid;
