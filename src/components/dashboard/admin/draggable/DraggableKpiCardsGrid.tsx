// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Button } from "@/components/ui/button";
import { DraggableKpiCardsGridProps } from '@types/dashboard';
import KpiCard from '../KpiCard';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DraggableKpiCardsGrid: React.FC<DraggableKpiCardsGridProps> = ({
  cards = [],
  onCardsReorder,
  onOrderChange,
  onSave,
  savedLayout,
  className,
  isEditable = true
}) => {
  const [layouts, setLayouts] = useState(savedLayout || {});
  const [isEdit, setIsEdit] = useState(false);

  // Generate layout based on cards if no saved layout
  useEffect(() => {
    if (!savedLayout && cards.length > 0) {
      const defaultLayout = cards.map((card, index) => ({
        i: card.id || `card-${index}`,
        x: ('x' in card && card.x !== undefined) ? card.x : (index % 3) * 4,
        y: ('y' in card && card.y !== undefined) ? card.y : Math.floor(index / 3) * 4,
        w: ('w' in card && card.w !== undefined) ? card.w : 4,
        h: ('h' in card && card.h !== undefined) ? card.h : 3,
      }));

      setLayouts({ lg: defaultLayout, md: defaultLayout, sm: defaultLayout });
    }
  }, [cards, savedLayout]);

  const handleLayoutChange = (current: any, all: any) => {
    setLayouts(all);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(layouts);
    }
    if (onOrderChange || onCardsReorder) {
      // Update card order based on layout
      const orderedCards = [...cards].sort((a, b) => {
        const idA = a.id || '';
        const idB = b.id || '';
        const layoutItemA = layouts.lg?.find((item: any) => item.i === idA);
        const layoutItemB = layouts.lg?.find((item: any) => item.i === idB);
        if (!layoutItemA || !layoutItemB) return 0;
        return layoutItemA.y === layoutItemB.y 
          ? layoutItemA.x - layoutItemB.x 
          : layoutItemA.y - layoutItemB.y;
      });
      
      if (onOrderChange) onOrderChange(orderedCards);
      if (onCardsReorder) onCardsReorder(orderedCards);
    }
    setIsEdit(false);
  };

  return (
    <div className={`w-full ${className || ''}`}>
      {isEditable && (
        <div className="mb-4 flex justify-end">
          {isEdit ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEdit(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Layout
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setIsEdit(true)}>
              Edit Layout
            </Button>
          )}
        </div>
      )}

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
        isDraggable={isEdit}
        isResizable={isEdit}
        onLayoutChange={handleLayoutChange}
        margin={[16, 16]}
        containerPadding={[0, 0]}
      >
        {cards.map((card, index) => (
          <div key={card.id || `card-${index}`}>
            <KpiCard {...card} />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default DraggableKpiCardsGrid;
