
import React from 'react';

export const FullScreenLoader: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
        <p className="text-lg text-muted-foreground">Chargement de l'application...</p>
        <p className="text-sm text-muted-foreground/60 mt-2">Veuillez patienter</p>
      </div>
    </div>
  );
};
