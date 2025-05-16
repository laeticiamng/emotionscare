
import React from 'react';
import { Bell, Check, Info, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NotificationItemProps {
  id: string;
  title: string;
  message?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  time?: string;
  read?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  message,
  type = 'info',
  time,
  read = false,
  onClick,
  compact = false
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-start p-3 gap-3 rounded-md hover:bg-muted/60 transition-colors cursor-pointer",
        !read && "bg-muted/40"
      )}
    >
      <div className="mt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={cn("font-medium line-clamp-1", !read && "font-semibold")}>{title}</p>
          {time && !compact && <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>}
        </div>
        {message && !compact && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
            {message}
          </p>
        )}
      </div>
      {!read && <span className="block w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
    </div>
  );
};

export default NotificationItem;
