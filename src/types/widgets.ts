
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface DraggableCardProps {
  id: string;
  title: string;
  value: string | number;
  icon?: ReactNode;
  delta?: number | {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  };
  subtitle?: string | ReactNode;
  ariaLabel?: string;
  onClick?: () => void;
  status?: 'success' | 'warning' | 'danger' | 'info';
  className?: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

export interface DraggableKpiCardsGridProps {
  cards?: DraggableCardProps[];
  kpiCards?: DraggableCardProps[];
  onOrderChange?: (cards: DraggableCardProps[]) => void;
  onLayoutChange?: (layout: any) => void;
  className?: string;
  isEditable?: boolean;
}

export type KpiCardProps = DraggableCardProps;

export interface DailyInsightCardProps {
  title: string;
  insight: string;
  message?: string;
  date?: Date | string;
  category?: string;
  icon?: ReactNode;
  className?: string;
}

export interface QuickActionLinksProps {
  actions: {
    id: string;
    name: string;
    href: string;
    icon?: ReactNode;
    description?: string;
  }[];
  links?: {
    id: string;
    name: string;
    href: string;
    icon?: ReactNode;
    description?: string;
  }[];
  className?: string;
}
