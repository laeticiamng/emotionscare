
import React from 'react';

export interface StatusIndicatorProps {
  isListening: boolean;
  isProcessing: boolean;
  statusText: string;
  error: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  isListening,
  isProcessing,
  statusText,
  error
}) => {
  const getStatusColor = () => {
    if (error) return 'bg-red-500';
    if (isListening) return 'bg-green-500';
    if (isProcessing) return 'bg-amber-500';
    return 'bg-blue-500';
  };

  return (
    <div className="flex items-center">
      <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor()}`}>
        {isListening && <div className="animate-pulse w-full h-full rounded-full bg-green-400"></div>}
      </div>
      <span className="text-sm font-medium">{statusText}</span>
    </div>
  );
};

export default StatusIndicator;
