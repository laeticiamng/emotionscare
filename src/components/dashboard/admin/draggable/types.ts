
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface DraggableCardProps {
  id: string;
  title: string;
  value: string | number;
  icon?: ReactNode | LucideIcon;
  delta?: number | {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  };
  subtitle?: string | ReactNode;
  ariaLabel?: string;
  onClick?: () => void;
  status?: 'success' | 'warning' | 'danger' | 'info';
}

export interface DraggableKpiCardsGridProps {
  cards?: DraggableCardProps[];
  kpiCards?: DraggableCardProps[];
  onOrderChange?: (cards: DraggableCardProps[]) => void;
}

export type KpiCardProps = DraggableCardProps;
