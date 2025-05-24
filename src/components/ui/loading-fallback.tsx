
import React from 'react';
import { Loader2 } from 'lucide-react';

export const PageLoadingFallback: React.FC = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
      <p className="text-muted-foreground">Chargement de la page...</p>
    </div>
  </div>
);

export const ComponentLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
      <p className="text-sm text-muted-foreground">Chargement...</p>
    </div>
  </div>
);
