
import React from 'react';
import { Mic, Wand2 } from 'lucide-react';

interface StatusIndicatorProps {
  isListening: boolean;
  isProcessing: boolean;
  progressText: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ isListening, isProcessing, progressText }) => {
  if (!isListening && !isProcessing && !progressText) return null;

  return (
    <div className="mb-4 p-3 bg-muted rounded-md flex items-center gap-3">
      {isProcessing ? (
        <div className="animate-pulse flex items-center">
          <Wand2 className="mr-2 h-5 w-5 text-primary" />
          <span>{progressText || "Traitement en cours..."}</span>
        </div>
      ) : (
        <div className="flex items-center">
          <div className="relative mr-3">
            <div className="absolute -inset-1 rounded-full bg-primary opacity-30 animate-ping"></div>
            <Mic className="relative h-5 w-5 text-primary" />
          </div>
          <span>{progressText || "Écoute active..."}</span>
        </div>
      )}
    </div>
  );
};

export default StatusIndicator;
