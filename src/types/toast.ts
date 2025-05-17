
import { ReactNode } from 'react';

export type NotificationType = 'default' | 'error' | 'success' | 'warning' | 'info' | 'badge';

export interface Toast {
  id: string;
  title?: string | ReactNode;
  description?: string | ReactNode;
  action?: ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  duration?: number;
  open?: boolean;
}

export interface ToastProps {
  toast: Toast;
}

export interface ToastOptions {
  title?: string | ReactNode;
  description?: string | ReactNode;
  action?: ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  duration?: number;
  open?: boolean;
}

export interface ToastAction {
  altText: string;
  onClick: () => void;
  children?: React.ReactNode;
}

export type ToastActionElement = React.ReactElement<
  React.ComponentPropsWithoutRef<'button'>
>;
