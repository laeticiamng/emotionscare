/**
 * VinylIntroduction - Section d'introduction avec vinyle
 */

import React from 'react';
import { Disc3 } from 'lucide-react';
import { getOptimizedUniverse } from '@/data/universes/config';

export const VinylIntroduction: React.FC = () => {
  const universe = getOptimizedUniverse('music');

  return (
    <div className="text-center space-y-6">
      <div
        className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
        style={{ 
          background: `linear-gradient(135deg, ${universe.ambiance.colors.primary}, ${universe.ambiance.colors.accent})` 
        }}
      >
        <Disc3 className="h-10 w-10 text-primary-foreground" />
      </div>
      
      <h2 className="text-4xl font-light text-foreground tracking-wide">
        Vinyles en Apesanteur
      </h2>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
        Choisis ton vinyle et laisse-le composer ton aura sonore.
        Chaque mélodie s'adapte à ton état pour créer l'harmonie parfaite.
      </p>
    </div>
  );
};

export default VinylIntroduction;
