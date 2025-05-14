
import { ReactNode } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

export interface ToastAction {
  altText: string;
  onClick: () => void;
  children?: React.ReactNode;
}

export type ToastActionElement = React.ReactElement<
  React.ComponentPropsWithoutRef<'button'>
>;
