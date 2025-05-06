
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface NotificationBadgeProps {
  count: number;
  max?: number;
  className?: string;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  max = 9,
  className = ''
}) => {
  if (count <= 0) return null;
  
  return (
    <Badge 
      variant="destructive" 
      className={`min-w-[18px] h-[18px] flex items-center justify-center p-0 text-[10px] animate-scale-in ${className}`}
    >
      {count > max ? `${max}+` : count}
    </Badge>
  );
};

export default NotificationBadge;
