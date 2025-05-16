
import React, { useState } from 'react';
import { GridLayout, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Card, CardContent } from '@/components/ui/card';
import { DraggableCardProps, DraggableKpiCardsGridProps } from '@/types/widgets';
import { DraggableCard } from './DraggableCard';
import { ReactNode } from 'react';
import { 
  BarChart3, 
  Users, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Heart, 
  Activity 
} from 'lucide-react';

const DraggableKpiCardsGrid: React.FC<DraggableKpiCardsGridProps> = ({ kpiCards }) => {
  // Default layout for the KPI cards
  const [layouts, setLayouts] = useState<Layout[]>([
    { i: 'activeUsers', x: 0, y: 0, w: 1, h: 1 },
    { i: 'totalSessions', x: 1, y: 0, w: 1, h: 1 },
    { i: 'avgDuration', x: 2, y: 0, w: 1, h: 1 },
    { i: 'completionRate', x: 3, y: 0, w: 1, h: 1 },
    { i: 'weeklyTrend', x: 0, y: 1, w: 2, h: 1 },
    { i: 'emotionalBalance', x: 2, y: 1, w: 2, h: 1 },
  ]);

  // Handle layout change
  const handleLayoutChange = (newLayout: Layout[]) => {
    setLayouts(newLayout);
    // You can save the layout to user preferences here
  };
  
  // Default cards if no cards are provided
  const defaultKpiCards: DraggableCardProps[] = [
    {
      id: 'activeUsers',
      title: 'Utilisateurs actifs',
      value: '1,234',
      icon: <Users className="h-4 w-4" />,
      delta: {
        value: 12,
        trend: 'up',
        label: 'vs last week'
      },
      subtitle: 'Utilisateurs uniques',
      status: 'success'
    },
    {
      id: 'totalSessions',
      title: 'Sessions totales',
      value: '5,678',
      icon: <Calendar className="h-4 w-4" />,
      delta: {
        value: 8,
        trend: 'up'
      }
    },
    {
      id: 'avgDuration',
      title: 'Durée moyenne',
      value: '12:34',
      icon: <Clock className="h-4 w-4" />,
      delta: {
        value: 3,
        trend: 'down'
      },
      status: 'warning'
    },
    {
      id: 'completionRate',
      title: 'Taux de complétion',
      value: '87%',
      icon: <BarChart3 className="h-4 w-4" />,
      delta: {
        value: 5,
        trend: 'up'
      }
    },
    {
      id: 'weeklyTrend',
      title: 'Tendance hebdo',
      value: '+23%',
      icon: <TrendingUp className="h-4 w-4" />,
      delta: {
        value: 15,
        trend: 'up'
      },
      status: 'success'
    },
    {
      id: 'emotionalBalance',
      title: 'Score émotionnel',
      value: '72/100',
      icon: <Heart className="h-4 w-4" />,
      delta: {
        value: 4,
        trend: 'up'
      }
    }
  ];

  // Use provided cards or default ones
  const cardsToRender = kpiCards || defaultKpiCards;

  return (
    <div className="w-full">
      <GridLayout
        className="layout"
        layout={layouts}
        cols={4}
        rowHeight={120}
        width={1200}
        margin={[16, 16]}
        isResizable={false}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
      >
        {cardsToRender.map((card) => (
          <div key={card.id} className="shadow-sm">
            <DraggableCard {...card} />
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default DraggableKpiCardsGrid;
