// Global type declarations to fix module resolution issues

declare module 'react-grid-layout' {
  const ReactGridLayout: any;
  export default ReactGridLayout;
  export const WidthProvider: any;
  export const Responsive: any;
}

declare module 'types/dashboard' {
  export * from '../types/dashboard';
  // Re-export from root types/dashboard.ts
  export interface KpiCardProps {
    id?: string;
    title: string;
    value: React.ReactNode;
    delta?: any;
    icon?: React.ReactNode;
    subtitle?: React.ReactNode;
    status?: string;
    className?: string;
    isLoading?: boolean;
    ariaLabel?: string;
    onClick?: () => void;
    footer?: React.ReactNode;
  }
  export type KpiCardStatus = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  export interface KpiCardsGridProps {
    cards: KpiCardProps[];
    className?: string;
  }
  export interface GlobalOverviewTabProps {
    className?: string;
    data?: any;
    isLoading?: boolean;
    period?: string;
    onPeriodChange?: (period: string) => void;
  }
  export interface DashboardWidgetConfig {
    id: string;
    title: string;
    type: string;
    width: number;
    height: number;
    x: number;
    y: number;
    visible: boolean;
    settings?: Record<string, any>;
  }
  export interface DraggableKpiCardsGridProps {
    cards?: KpiCardProps[];
    kpiCards?: KpiCardProps[];
    onOrderChange?: (cards: KpiCardProps[]) => void;
    onLayoutChange?: (layout: any) => void;
    className?: string;
    isEditable?: boolean;
  }
  export interface TeamSummary {
    id: string;
    teamId?: string;
    name: string;
    memberCount: number;
    activeUsers: number;
    averageScore: number;
    trend: number;
    trendDirection: 'up' | 'down' | 'stable';
    trendValue: number;
    department: string;
    alertCount?: number;
    averageMood?: string | number;
  }
  export interface AdminAccessLog {
    id: string;
    adminId: string;
    action: string;
    timestamp: string;
    userName?: string;
    resource?: string;
    ip?: string;
    adminName?: string;
    userId?: string;
    details?: string;
  }
  export interface KpiDelta {
    value?: number;
    trend?: 'up' | 'down' | 'neutral';
    direction?: 'up' | 'down' | 'stable';
    label?: string;
  }
}
