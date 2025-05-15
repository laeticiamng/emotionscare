
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiCardProps } from '@/types';

interface DraggableKpiCardsGridProps {
  kpiCards: KpiCardProps[];
}

const DraggableKpiCardsGrid: React.FC<DraggableKpiCardsGridProps> = ({ kpiCards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiCards.map((card) => (
        <Card key={card.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{card.value}</div>
                {card.delta && (
                  <p className={`text-xs ${
                    card.delta.trend === 'up' 
                      ? 'text-green-600' 
                      : card.delta.trend === 'down' 
                        ? 'text-red-600' 
                        : 'text-gray-500'
                  }`}>
                    {card.delta.value > 0 ? '+' : ''}{card.delta.value}%
                    {card.delta.label && ` ${card.delta.label}`}
                  </p>
                )}
              </div>
              <div className="p-2 rounded-md bg-primary/10">
                <card.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DraggableKpiCardsGrid;
