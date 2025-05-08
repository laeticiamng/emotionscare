
import React from 'react';
import { Bot, Music, VolumeX } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = "Commencez l'analyse vocale pour obtenir des résultats" 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
        <Bot className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="max-w-sm">
        <h3 className="text-lg font-medium mb-2">Analyse émotionnelle vocale</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <div className="flex items-center gap-4 mt-4 text-muted-foreground">
        <VolumeX className="h-5 w-5" />
        <span className="text-xs">→</span>
        <Bot className="h-5 w-5" />
        <span className="text-xs">→</span>
        <Music className="h-5 w-5" />
      </div>
    </div>
  );
};

export default EmptyState;
