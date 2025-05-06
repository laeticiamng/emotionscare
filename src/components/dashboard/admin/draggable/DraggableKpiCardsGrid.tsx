
import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { toast } from "sonner";
import { TrendingUp, Activity, Users } from 'lucide-react';
import DraggableCard from './DraggableCard';
import { KpiCardData } from './types';
import { useNavigate } from 'react-router-dom';

// Props for our grid component
interface DraggableKpiCardsGridProps {
  dashboardStats: {
    productivity: {
      current: number;
      trend: number;
    };
    emotionalScore: {
      current: number;
      trend: number;
    };
  };
  gamificationData: {
    activeUsersPercent: number;
    totalBadges: number;
  };
}

// Main component that handles the draggable grid
const DraggableKpiCardsGrid: React.FC<DraggableKpiCardsGridProps> = ({ dashboardStats, gamificationData }) => {
  const navigate = useNavigate();
  
  // Define navigation handlers for drill-down
  const navigateToProductivity = () => navigate('/stats/productivity');
  const navigateToEmotionalScore = () => navigate('/stats/emotional-score');
  const navigateToEngagement = () => navigate('/stats/engagement');
  
  // Create card data from props
  const createCardData = (): KpiCardData[] => [
    {
      id: 'productivity',
      title: 'Productivité',
      value: `${dashboardStats.productivity.current}%`,
      icon: TrendingUp,
      delta: {
        value: dashboardStats.productivity.trend,
        label: "vs période précédente",
        trend: dashboardStats.productivity.trend >= 0 ? 'up' : 'down'
      },
      ariaLabel: `Productivité: ${dashboardStats.productivity.current}%`,
      onClick: navigateToProductivity
    },
    {
      id: 'emotionalScore',
      title: 'Score émotionnel moyen',
      value: `${dashboardStats.emotionalScore.current}/100`,
      icon: Activity,
      delta: {
        value: dashboardStats.emotionalScore.trend,
        label: "vs période précédente",
        trend: dashboardStats.emotionalScore.trend >= 0 ? 'up' : 'down'
      },
      ariaLabel: `Score émotionnel moyen: ${dashboardStats.emotionalScore.current}/100`,
      onClick: navigateToEmotionalScore
    },
    {
      id: 'engagementGamification',
      title: 'Engagement gamification',
      value: `${gamificationData.activeUsersPercent}%`,
      icon: Users,
      subtitle: `${gamificationData.totalBadges} badges distribués ce mois`,
      ariaLabel: `Engagement gamification: ${gamificationData.activeUsersPercent}%`,
      onClick: navigateToEngagement
    }
  ];

  // Load the default card order or retrieve from localStorage
  const loadCardOrder = (): string[] => {
    try {
      const savedOrder = localStorage.getItem('dashboard.kpiOrder');
      if (savedOrder) {
        const parsedOrder = JSON.parse(savedOrder) as string[];
        // Validate that all required cards are present
        const defaultIds = createCardData().map(card => card.id);
        const isValid = defaultIds.every(id => parsedOrder.includes(id));
        if (isValid && parsedOrder.length === defaultIds.length) {
          return parsedOrder;
        }
      }
    } catch (error) {
      console.error("Error loading card order:", error);
    }
    // Return default order if no saved order or invalid
    return createCardData().map(card => card.id);
  };

  // State for card data and order
  const [cards] = useState<KpiCardData[]>(createCardData);
  const [cardOrder, setCardOrder] = useState<string[]>(loadCardOrder);

  // Save card order to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dashboard.kpiOrder', JSON.stringify(cardOrder));
  }, [cardOrder]);

  // Sort cards based on current order
  const sortedCards = cardOrder.map(id => 
    cards.find(card => card.id === id)
  ).filter(Boolean) as KpiCardData[];

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle the end of a drag event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setCardOrder(currentOrder => {
        const oldIndex = currentOrder.indexOf(active.id as string);
        const newIndex = currentOrder.indexOf(over.id as string);
        
        const newOrder = arrayMove(currentOrder, oldIndex, newIndex);
        
        // Notify user of successful reordering
        toast.success("Layout personnalisé enregistré", {
          description: "Votre disposition des cartes a été sauvegardée"
        });
        
        return newOrder;
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={cardOrder} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 col-span-1 md:col-span-2">
          {sortedCards.map(card => (
            <DraggableCard key={card.id} {...card} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default DraggableKpiCardsGrid;
