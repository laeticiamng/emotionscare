import React from 'react';
import { Loader2, Heart } from 'lucide-react';

export const FullPageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Heart className="h-8 w-8 text-primary animate-pulse" />
          <Loader2 className="absolute inset-0 h-8 w-8 animate-spin text-primary/30" />
        </div>
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    </div>
  );
};