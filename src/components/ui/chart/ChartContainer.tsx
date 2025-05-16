
import React, { ReactElement, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ChartContainerProps {
  title?: string | ReactNode;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  error?: string | null;
  headerAction?: ReactNode;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  className,
  contentClassName,
  children,
  fullWidth = false,
  loading = false,
  error = null,
  headerAction
}) => {
  return (
    <Card className={cn('overflow-hidden', className)}>
      {title && (
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              {typeof title === 'string' ? title : title}
            </CardTitle>
            {headerAction && headerAction}
          </div>
        </CardHeader>
      )}
      <CardContent className={cn('p-0', contentClassName)}>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-destructive">
            <p>{error}</p>
          </div>
        ) : (
          <div className={fullWidth ? 'w-full' : 'p-4'}>
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChartContainer;
