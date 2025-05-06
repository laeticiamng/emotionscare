
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Calendar, 
  Info, 
  AlertCircle, 
  UserPlus, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Notification } from '@/hooks/useNotifications';

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
}

export const NotificationIcon: React.FC<{ 
  type: Notification['type']; 
  className?: string 
}> = ({ type, className }) => {
  switch (type) {
    case 'info':
      return <Info className={className} />;
    case 'warning':
      return <AlertTriangle className={className} />;
    case 'success':
      return <CheckCircle className={className} />;
    case 'error':
      return <AlertCircle className={className} />;
    case 'system':
      return <Bell className={className} />;
    case 'invitation':
      return <UserPlus className={className} />;
    case 'reminder':
      return <Calendar className={className} />;
    default:
      return <Bell className={className} />;
  }
};

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onRead 
}) => {
  const navigate = useNavigate();
  const { id, type, title, message, date, isRead, linkTo } = notification;
  
  const handleClick = () => {
    if (!isRead) {
      onRead(id);
    }
    
    if (linkTo) {
      navigate(linkTo);
    }
  };
  
  const formattedDate = formatDistanceToNow(new Date(date), { 
    addSuffix: true,
    locale: fr 
  });

  return (
    <button
      className={`flex items-start p-3 space-x-3 w-full text-left transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        isRead ? "opacity-60" : "bg-accent/20"
      }`}
      onClick={handleClick}
      role="button"
      aria-pressed={isRead}
    >
      <NotificationIcon 
        type={type} 
        className={`w-5 h-5 mt-1 ${
          type === 'error' ? 'text-destructive' : 
          type === 'warning' ? 'text-warning-500' : 
          type === 'success' ? 'text-success-500' : 
          'text-primary'
        }`} 
      />
      <div className="flex-1">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{message}</div>
        <div className="text-xs text-muted-foreground/70 mt-1">{formattedDate}</div>
      </div>
      {!isRead && (
        <span
          className="w-2 h-2 bg-destructive rounded-full self-center flex-shrink-0"
          aria-label="Non lu"
        />
      )}
    </button>
  );
};

export default NotificationItem;
