
import * as React from "react";

export interface ToastProps {
  id?: string;
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactElement;
  variant?: "default" | "success" | "destructive" | "warning" | "info";
  duration?: number;
}

export type Toast = ToastProps;

export interface ToasterToast extends ToastProps {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactElement;
  dismissible?: boolean;
}

export interface ToasterProps {
  toasts: ToasterToast[];
}
