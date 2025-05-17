
import * as React from "react";
import { type VariantProps } from "class-variance-authority";

interface ToastProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof toastVariants> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type ToastActionElement = React.ReactElement<any, string | React.JSXElementConstructor<any>>;

interface Toast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: 'default' | 'destructive';
}

interface ToastOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: 'default' | 'destructive';
}

export type {
  Toast,
  ToastProps,
  ToastActionElement,
  ToastOptions,
};
