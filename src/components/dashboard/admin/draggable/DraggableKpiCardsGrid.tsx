
import React, { useState, useEffect } from 'react';
import { DraggableCardProps } from './types';
import DraggableCard from './DraggableCard';
import { KpiCardProps } from '@/types';

interface DraggableKpiCardsGridProps {
  cards?: KpiCardProps[];
  onReorder?: (cards: KpiCardProps[]) => void;
  editable?: boolean;
  className?: string;
}

const DraggableKpiCardsGrid: React.FC<DraggableKpiCardsGridProps> = ({
  cards = [],
  onReorder,
  editable = false,
  className
}) => {
  const [draggableCards, setDraggableCards] = useState<DraggableCardProps[]>([]);

  useEffect(() => {
    // Convert KpiCardProps to DraggableCardProps
    const convertedCards: DraggableCardProps[] = cards.map((card, index) => ({
      id: `card-${index}`,
      title: card.title,
      value: card.value,
      icon: card.icon,
      delta: card.delta,
      subtitle: card.subtitle,
      ariaLabel: card.ariaLabel,
      onClick: card.onClick
    }));
    
    setDraggableCards(convertedCards);
  }, [cards]);

  const handleReorder = (reorderedCards: DraggableCardProps[]) => {
    setDraggableCards(reorderedCards);
    if (onReorder) {
      // Convert DraggableCardProps back to KpiCardProps
      const convertedCards = reorderedCards.map((card) => ({
        title: card.title,
        value: card.value,
        icon: card.icon,
        delta: card.delta,
        subtitle: card.subtitle,
        ariaLabel: card.ariaLabel,
        onClick: card.onClick
      }));
      
      onReorder(convertedCards as KpiCardProps[]);
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className || ''}`}>
      {draggableCards.map((card) => (
        <DraggableCard
          key={card.id}
          id={card.id}
          title={card.title}
          value={card.value}
          icon={card.icon}
          delta={card.delta}
          subtitle={card.subtitle}
          ariaLabel={card.ariaLabel}
          onClick={card.onClick}
        />
      ))}
    </div>
  );
};

export default DraggableKpiCardsGrid;
