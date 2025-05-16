
import React, { ReactNode } from 'react';

export interface ChartContainerProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  className = '',
  title,
  description
}) => {
  return (
    <div className={`rounded-lg border bg-card p-4 ${className}`}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      <div className="h-full w-full">
        {children}
      </div>
    </div>
  );
};
