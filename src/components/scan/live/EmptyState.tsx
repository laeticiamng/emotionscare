
import React from 'react';
import { AudioWaveform } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = "Cliquez sur le bouton d'enregistrement pour commencer l'analyse vocale", 
  className 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-6 text-center ${className || ''}`}>
      <AudioWaveform className="h-12 w-12 text-muted-foreground/50 mb-3" />
      <p className="text-sm text-muted-foreground max-w-xs">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
