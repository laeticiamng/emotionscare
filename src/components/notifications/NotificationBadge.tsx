
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NotificationBadgeProps {
  count: number;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  maxCount?: number;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  className,
  variant = 'destructive',
  maxCount = 99,
}) => {
  if (count <= 0) {
    return null;
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  return (
    <Badge
      variant={variant}
      className={cn(
        'absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs',
        'animate-pulse',
        className
      )}
    >
      {displayCount}
    </Badge>
  );
};

export default NotificationBadge;
