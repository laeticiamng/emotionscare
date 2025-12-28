import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

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
  return (
    <div className="flex items-center gap-2">
      {error ? (
        <AlertCircle className="h-5 w-5 text-destructive" />
      ) : isProcessing ? (
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      ) : isListening ? (
        <div className="relative">
          <div className="absolute -inset-1 bg-primary/25 rounded-full animate-ping"></div>
          <div className="h-5 w-5 bg-primary rounded-full relative"></div>
        </div>
      ) : (
        <CheckCircle className="h-5 w-5 text-muted-foreground" />
      )}
      
      <span className={error ? "text-destructive" : "text-muted-foreground"}>
        {statusText}
      </span>
    </div>
  );
};

export default StatusIndicator;
