
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCardProps } from '@/types/dashboard';
import { DraggableKpiCardsGridProps } from '@/types/dashboard';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

const DraggableKpiCardsGrid: React.FC<DraggableKpiCardsGridProps> = ({ 
  kpiCards,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {kpiCards.map((card, index) => (
        <Card 
          key={`kpi-card-${index}`}
          className="relative"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {card.value}
            </div>
            
            {card.delta !== undefined && (
              <div className="flex items-center mt-1 text-xs">
                {card.delta > 0 ? (
                  <>
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                    <span className="text-green-500">+{card.delta}%</span>
                  </>
                ) : card.delta < 0 ? (
                  <>
                    <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                    <span className="text-red-500">{card.delta}%</span>
                  </>
                ) : (
                  <>
                    <Minus className="mr-1 h-3 w-3 text-gray-500" />
                    <span className="text-gray-500">Stable</span>
                  </>
                )}
                <span className="ml-1 text-muted-foreground">
                  depuis 30 jours
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DraggableKpiCardsGrid;
