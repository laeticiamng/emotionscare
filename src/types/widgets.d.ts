
import { Badge, LeaderboardEntry } from './gamification';
import { ReactNode } from 'react';

export interface BadgesWidgetProps {
  badges: Badge[];
  title?: string;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
}

export interface LeaderboardWidgetProps {
  leaderboard: LeaderboardEntry[];
  title?: string;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
  highlightUserId?: string;
}

export interface DailyInsightCardProps {
  message?: string;
}

export interface QuickActionLinksProps {
  links: {
    title: string;
    description: string;
    icon: ReactNode;
    href: string;
    color: string;
  }[];
}

export interface KpiCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  description?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'danger';
  onClick?: () => void;
  status?: 'success' | 'warning' | 'danger';
  subtitle?: ReactNode;
  ariaLabel?: string;
  delta?: number | {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  };
  className?: string;
  trendText?: string;
  loading?: boolean;
}

export interface DraggableCardProps {
  id: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  title: string;
  value: string | number;
  icon?: ReactNode;
  delta?: number | {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  };
  subtitle?: ReactNode;
  ariaLabel?: string;
  onClick?: () => void;
  status?: 'success' | 'warning' | 'danger';
}

export interface DraggableKpiCardsGridProps {
  cards?: DraggableCardProps[];
  kpiCards?: DraggableCardProps[];
  onLayoutChange?: (layout: any[]) => void;
  className?: string;
  isEditable?: boolean;
  onReorder?: (cards: DraggableCardProps[]) => void;
  editable?: boolean;
}
