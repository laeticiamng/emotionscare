import React from 'react';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export interface NotificationProps {
  id?: string;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const NotificationIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertCircle,
  info: Info,
};

export const showNotification = ({
  title,
  message,
  type = 'info',
  duration = 4000,
  action,
}: NotificationProps) => {
  const Icon = NotificationIcons[type];
  
  return toast(
    <div className="flex items-start gap-3">
      <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
        type === 'success' ? 'text-green-500' :
        type === 'error' ? 'text-red-500' :
        type === 'warning' ? 'text-yellow-500' :
        'text-blue-500'
      }`} />
      <div className="flex-1">
        {title && <div className="font-medium text-sm">{title}</div>}
        <div className="text-sm text-muted-foreground">{message}</div>
        {action && (
          <button
            onClick={action.onClick}
            className="mt-2 text-sm font-medium text-primary hover:underline"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>,
    {
      duration,
    }
  );
};

export const NotificationSystem: React.FC = () => {
  return null; // Sonner handles rendering
};

export default NotificationSystem;