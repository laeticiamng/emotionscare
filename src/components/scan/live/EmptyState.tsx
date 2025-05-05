
import React from 'react';
import { Mic } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="py-8 flex flex-col items-center text-center text-muted-foreground">
      <Mic className="h-10 w-10 mb-4 opacity-50" />
      <p>Cliquez sur "Commencer" pour analyser vos émotions en temps réel via votre voix</p>
    </div>
  );
};

export default EmptyState;
