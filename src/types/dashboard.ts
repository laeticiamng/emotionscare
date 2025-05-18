
import { ReactNode } from 'react';

export interface EmotionalTeamViewProps {
  period?: string;
  anonymized?: boolean;
  dateRange?: { from: Date; to: Date };
  showGraph?: boolean;
  showMembers?: boolean;
  className?: string;
}

export interface KpiCardProps {
  title: string;
  value: string | number;
  label?: string;
  description?: string;
  icon?: ReactNode;
  status?: KpiCardStatus;
  trend?: number;
  className?: string;
  id?: string;
  delta?: number | {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  };
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  subtitle?: ReactNode | string;
  ariaLabel?: string;
  isLoading?: boolean;
  onClick?: () => void;
  footer?: ReactNode;
}

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  description?: string;
  settings?: Record<string, any>;
  visible?: boolean;
  position?: number;
}

export type KpiCardStatus = 'positive' | 'negative' | 'neutral' | 'warning' | 'default' | 'info';

export interface DraggableKpiCardsGridProps {
  cards: KpiCardProps[];
  className?: string;
  onOrderChange?: (cards: KpiCardProps[]) => void;
  onLayoutChange?: (layout: any) => void;
  onCardsReorder?: (cards: KpiCardProps[]) => void;
  onSave?: (layout: any) => void;
  savedLayout?: any;
  isEditable?: boolean;
}

export interface GamificationData {
  activeChallenges: number;
  badges: number;
  completedChallenges: number;
  level: number;
  points: number;
  streak: number;
}
