
import React from 'react';

export const ComponentLoadingFallback: React.FC = () => (
  <div 
    data-testid="page-loading" 
    className="min-h-screen bg-background flex items-center justify-center"
  >
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p className="text-lg font-medium text-foreground">Chargement...</p>
      <p className="text-sm text-muted-foreground">EmotionsCare se prépare</p>
    </div>
  </div>
);
