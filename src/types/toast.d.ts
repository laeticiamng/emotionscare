
import * as React from "react";

export interface ToastProps {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  duration?: number;
  open?: boolean;
}

export type ToastActionElement = React.ReactElement<any, string | React.JSXElementConstructor<any>>;

export interface Toast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  duration?: number;
}

export interface ToastOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  duration?: number;
}
