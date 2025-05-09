
import React from 'react';
import { Mic } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg text-center">
      <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
        <Mic className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">Prêt à analyser votre émotion</h3>
      <p className="text-muted-foreground mt-2 max-w-md">
        Cliquez sur "Démarrer" pour commencer l'enregistrement et l'analyse de votre voix en temps réel.
      </p>
    </div>
  );
};

export default EmptyState;
