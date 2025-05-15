
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface DraggableCardProps {
  id: string;
  title: string;
  value: string | number;
  icon?: LucideIcon;
  delta?: number;
  subtitle?: string;
  ariaLabel?: string;
  onClick?: () => void;
}
