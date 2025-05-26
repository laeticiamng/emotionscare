
import React from 'react';

export const ComponentLoadingFallback: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-2 text-muted-foreground">Chargement...</span>
    </div>
  );
};
