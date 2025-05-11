
export interface DashboardWidgetProps {
  id: string;
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  width?: 'full' | 'half' | 'third' | 'quarter';
  height?: 'small' | 'medium' | 'large';
  priority?: number;
  className?: string;
  onRefresh?: () => void;
}

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: DashboardWidgetConfig[];
  createdAt?: string;
  updatedAt?: string;
  isDefault?: boolean;
  user_id?: string;
}

export interface DashboardWidgetConfig {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  settings?: Record<string, any>;
  visible?: boolean;
}

export interface LayoutSettings {
  compactType: 'vertical' | 'horizontal' | null;
  cols: number;
  rowHeight: number;
  gap: number;
  isDraggable: boolean;
  isResizable: boolean;
}
