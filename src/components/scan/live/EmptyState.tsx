
import React from 'react';
import { Music } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = "Aucune donnée à afficher" 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <div className="w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center mb-4">
        <Music className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground max-w-xs">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
