
import React from 'react';
import { Loader2 } from 'lucide-react';

export const ComponentLoadingFallback: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    </div>
  );
};
