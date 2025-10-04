import React from 'react';
import { useVRGalaxy } from '../hooks/useVRGalaxy';

interface VRGalaxyMainProps {
  className?: string;
}

/**
 * Composant principal du module VR Galaxy
 * Expérience immersive de galaxie VR
 */
export const VRGalaxyMain: React.FC<VRGalaxyMainProps> = ({ className = '' }) => {
  const { isImmersed, galaxyType, enterGalaxy, exitGalaxy } = useVRGalaxy();

  return (
    <div className={`vr-galaxy-container ${className}`}>
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-2xl font-bold text-foreground">VR Galaxy 🌌</h2>
        
        {isImmersed ? (
          <div className="space-y-4 text-center">
            <p className="text-muted-foreground">Exploration: {galaxyType}</p>
            <button
              onClick={exitGalaxy}
              className="px-6 py-3 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
            >
              Quitter l'expérience
            </button>
          </div>
        ) : (
          <button
            onClick={enterGalaxy}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Entrer dans la galaxie
          </button>
        )}
      </div>
    </div>
  );
};

export default VRGalaxyMain;
