
import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ChartContainerProps extends HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  controls?: React.ReactNode;
  loading?: boolean;
}

export const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, title, description, children, footer, controls, loading, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-3 rounded-lg border p-4 pb-8", className)}
        {...props}
      >
        {(title || description || controls) && (
          <div className="flex items-center justify-between gap-2">
            {(title || description) && (
              <div className="space-y-1">
                {title && <div className="text-base font-medium">{title}</div>}
                {description && <div className="text-sm text-muted-foreground">{description}</div>}
              </div>
            )}
            {controls && <div>{controls}</div>}
          </div>
        )}
        <div className={cn("h-[200px] w-full", { "animate-pulse": loading })}>
          {children}
        </div>
        {footer && <div className="text-xs text-muted-foreground">{footer}</div>}
      </div>
    );
  }
);

ChartContainer.displayName = "ChartContainer";
