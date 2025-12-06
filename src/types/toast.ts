// @ts-nocheck

import { ReactElement } from 'react';

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  action?: ToastActionElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: 'default' | 'destructive';
  duration?: number;
}

export interface ToastActionElement extends ReactElement {
  altText: string;
}

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'destructive';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}
