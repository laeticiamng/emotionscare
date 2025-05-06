
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
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from "@dnd-kit/utilities";
import KpiCard from './KpiCard';
import { GripVertical, TrendingUp, Activity, Users } from 'lucide-react';
import { toast } from "sonner";
import { LucideIcon } from 'lucide-react';

// Type for the card data
interface KpiCardData {
  id: string;
  title: string;
  value: string | React.ReactNode;
  icon: LucideIcon;
  delta?: {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  };
  subtitle?: React.ReactNode;
  ariaLabel?: string;
}

// Props for our draggable card component
interface DraggableCardProps extends KpiCardData {
  handle?: boolean;
}

// Component for a single draggable card
const DraggableCard: React.FC<DraggableCardProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
    position: 'relative' as 'relative',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`transition-all duration-300 ${isDragging ? 'scale-105 shadow-md' : ''}`}
    >
      <div className="relative">
        <div
          className="absolute right-2 top-2 cursor-grab p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          tabIndex={0}
          role="button"
          aria-grabbed={isDragging}
          aria-keyshortcuts="Space, ArrowUp, ArrowDown, ArrowLeft, ArrowRight"
        >
          <GripVertical size={16} />
        </div>
        <KpiCard 
          title={props.title} 
          value={props.value} 
          icon={props.icon} 
          delta={props.delta} 
          subtitle={props.subtitle} 
          ariaLabel={props.ariaLabel}
        />
      </div>
    </div>
  );
};

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
      ariaLabel: `Productivité: ${dashboardStats.productivity.current}%`
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
      ariaLabel: `Score émotionnel moyen: ${dashboardStats.emotionalScore.current}/100`
    },
    {
      id: 'engagementGamification',
      title: 'Engagement gamification',
      value: `${gamificationData.activeUsersPercent}%`,
      icon: Users,
      subtitle: `${gamificationData.totalBadges} badges distribués ce mois`,
      ariaLabel: `Engagement gamification: ${gamificationData.activeUsersPercent}%`
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
