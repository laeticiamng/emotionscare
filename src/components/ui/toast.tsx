
import React from 'react';
import { cn } from '@/lib/utils';

interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
  children?: React.ReactNode;
}

export const Toast: React.FC<ToastProps> = ({
  title,
  description,
  action,
  variant = 'default',
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
        variant === 'destructive'
          ? 'border-destructive bg-destructive text-destructive-foreground'
          : 'border bg-background text-foreground'
      )}
      {...props}
    >
      <div className="grid gap-1">
        {title && <div className="text-sm font-semibold">{title}</div>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
      {action}
      {children}
    </div>
  );
};

export const ToastTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-sm font-semibold">{children}</div>
);

export const ToastDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-sm opacity-90">{children}</div>
);

export const ToastClose: React.FC = () => (
  <button className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none group-hover:opacity-100">
    ×
  </button>
);

export const ToastAction: React.FC<{ 
  altText: string; 
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
  >
    {children}
  </button>
);

export const ToastViewport: React.FC = () => (
  <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]" />
);

export { ToastProvider } from '@/hooks/use-toast';
