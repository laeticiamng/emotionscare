
import { LucideIcon } from "lucide-react";

// Type for the card data
export interface KpiCardData {
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
export interface DraggableCardProps extends KpiCardData {
  handle?: boolean;
}
