
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
  description?: string;
  icon?: ReactNode;
  status?: KpiCardStatus;
  trend?: number;
  className?: string;
}

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  description?: string;
  visible?: boolean;
  position?: number;
}

export type KpiCardStatus = 'positive' | 'negative' | 'neutral' | 'warning';

export interface DraggableKpiCardsGridProps {
  cards: KpiCardProps[];
  className?: string;
}

export interface GamificationData {
  activeChallenges: number;
  badges: number;
  completedChallenges: number;
  level: number;
  points: number;
  streak: number;
}
