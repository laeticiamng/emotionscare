
import React from 'react';
import { Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatusType = 'loading' | 'success' | 'error' | 'idle';

interface StatusIndicatorProps {
  status: StatusType;
  message?: string;
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  message,
  className
}) => {
  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  const getBgColor = () => {
    switch (status) {
      case 'loading':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };
  
  if (status === 'idle') return null;
  
  return (
    <div 
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md border text-sm",
        getBgColor(),
        className
      )}
    >
      {getIcon()}
      {message && <span>{message}</span>}
    </div>
  );
};

export default StatusIndicator;
