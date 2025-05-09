
import React from 'react';
import { Info } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="text-center p-8 border border-dashed rounded-md bg-muted/30">
      <div className="flex justify-center mb-4">
        <div className="rounded-full bg-accent p-3">
          <Info className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
      <h3 className="font-medium text-lg mb-1">Analyseur émotionnel</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Cliquez sur le bouton "Démarrer" pour commencer l'enregistrement audio.
        Parlez de votre journée ou de ce que vous ressentez actuellement.
      </p>
    </div>
  );
};

export default EmptyState;
