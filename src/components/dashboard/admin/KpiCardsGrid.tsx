// @ts-nocheck
import React from 'react';
import KpiCard from './KpiCard';
import { KpiCardsGridProps } from '@/types/widgets';

const KpiCardsGrid: React.FC<KpiCardsGridProps> = ({ cards = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <KpiCard
          key={card.id || card.title}
          id={card.id}
          title={card.title}
          value={card.value}
          delta={card.delta}
          status={card.status || 'neutral'}
          icon={card.icon}
          subtitle={card.subtitle}
          className={card.className}
          isLoading={card.isLoading}
          onClick={card.onClick}
          footer={card.footer}
          ariaLabel={card.ariaLabel}
        />
      ))}
    </div>
  );
};

export default KpiCardsGrid;
