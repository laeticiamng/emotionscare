
import { ReactNode } from 'react';

export interface Toast {
  id?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  variant?: 'default' | 'destructive';
  duration?: number;
}
