
import React from 'react';
import { AudioWaveform } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  className?: string;
  icon?: React.ReactNode;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = "Cliquez sur le bouton d'enregistrement pour commencer l'analyse vocale", 
  className,
  icon = <AudioWaveform className="h-12 w-12 text-muted-foreground/50 mb-3" />,
  description
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-6 text-center ${className || ''}`}>
      {icon}
      <p className="text-sm font-medium text-muted-foreground/80 max-w-xs mb-1">
        {message}
      </p>
      {description && (
        <p className="text-xs text-muted-foreground/70 max-w-xs">
          {description}
        </p>
      )}
    </div>
  );
};

export default EmptyState;
