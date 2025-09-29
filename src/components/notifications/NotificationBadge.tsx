
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NotificationBadgeProps {
  count: number;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  className,
  variant = 'destructive'
}) => {
  if (count === 0) return null;

  return (
    <Badge 
      variant={variant}
      className={cn(
        'h-5 w-5 p-0 flex items-center justify-center text-xs font-bold',
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </Badge>
  );
};

export default NotificationBadge;
