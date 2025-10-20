// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Vibrate } from 'lucide-react';
import { type GlowPhase } from '@/store/glow.store';
import { logger } from '@/lib/logger';

interface BreathCoachProps {
  phase: GlowPhase;
  enableSound?: boolean;
  enableHaptic?: boolean;
  onToggleSound?: (enabled: boolean) => void;
  onToggleHaptic?: (enabled: boolean) => void;
  className?: string;
}

const BreathCoach: React.FC<BreathCoachProps> = ({ 
  phase, 
  enableSound = true,
  enableHaptic = true,
  onToggleSound,
  onToggleHaptic,
  className = '' 
}) => {
  const [currentInstruction, setCurrentInstruction] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  // Configuration des instructions par phase
  const getInstruction = (currentPhase: GlowPhase): string => {
    switch (currentPhase) {
      case 'inhale':
        return 'Inspire lentement par le nez';
      case 'hold':
        return 'Retenez votre souffle';
      case 'exhale':
        return 'Expirez doucement par la bouche';
      case 'paused':
        return 'Session en pause';
      case 'finished':
        return 'Excellent travail ! 🌟';
      default:
        return 'Prêt pour votre session ?';
    }
  };

  // Messages d'encouragement selon la phase
  const getEncouragement = (currentPhase: GlowPhase): string => {
    switch (currentPhase) {
      case 'inhale':
        return 'Laissez l\'air remplir vos poumons...';
      case 'hold':
        return 'Gardez le calme, retenez...';
      case 'exhale':
        return 'Relâchez toute tension...';
      case 'finished':
        return 'Vous avez trouvé votre centre ✨';
      default:
        return '';
    }
  };

  // Effet sonore discret (si supporté et activé)
  const playPhaseSound = (currentPhase: GlowPhase) => {
    if (!enableSound || typeof window === 'undefined') return;

    // Utilise Web Audio API pour des sons synthétiques subtils
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Fréquences douces selon la phase
      const frequencies = {
        inhale: 220,   // La grave
        hold: 330,     // Mi
        exhale: 165,   // Mi grave
      };

      const frequency = frequencies[currentPhase as keyof typeof frequencies];
      if (frequency) {
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sine';
        
        // Envelope douce
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      }
    } catch (error) {
      logger.warn('Web Audio not supported', error, 'UI');
    }
  };

  // Vibration tactile (si supporté et activé)
  const triggerHaptic = (currentPhase: GlowPhase) => {
    if (!enableHaptic || !('vibrate' in navigator)) return;

    const patterns = {
      inhale: [50],           // Courte vibration
      hold: [100],            // Vibration moyenne
      exhale: [50, 100, 50],  // Pattern plus complexe
    };

    const pattern = patterns[currentPhase as keyof typeof patterns];
    if (pattern) {
      navigator.vibrate(pattern);
    }
  };

  // Mise à jour des instructions
  useEffect(() => {
    const newInstruction = getInstruction(phase);
    
    if (newInstruction !== currentInstruction) {
      // Animation d'apparition
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentInstruction(newInstruction);
        setIsVisible(true);
        
        // Déclenchement des effets
        if (phase === 'inhale' || phase === 'hold' || phase === 'exhale') {
          playPhaseSound(phase);
          triggerHaptic(phase);
        }
      }, 150);
    }
  }, [phase, currentInstruction, enableSound, enableHaptic]);

  const encouragement = getEncouragement(phase);

  return (
    <div className={`breath-coach text-center space-y-4 ${className}`}>
      {/* Instruction principale */}
      <div 
        className={`
          transition-all duration-300 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        `}
        aria-live="polite"
        aria-atomic="true"
      >
        <h2 className="text-2xl font-semibold mb-2">
          {currentInstruction}
        </h2>
        
        {encouragement && (
          <p className="text-muted-foreground italic">
            {encouragement}
          </p>
        )}
      </div>

      {/* Badge de phase */}
      <div className="flex justify-center">
        <Badge 
          variant={phase === 'finished' ? 'default' : 'outline'}
          className={`
            transition-all duration-300
            ${phase === 'inhale' ? 'border-blue-500 text-blue-600' :
              phase === 'hold' ? 'border-green-500 text-green-600' :
              phase === 'exhale' ? 'border-orange-500 text-orange-600' :
              phase === 'finished' ? 'bg-purple-500' :
              ''
            }
          `}
        >
          {phase === 'idle' && 'En attente'}
          {phase === 'inhale' && 'Inspiration'}
          {phase === 'hold' && 'Rétention'}
          {phase === 'exhale' && 'Expiration'}
          {phase === 'paused' && 'En pause'}
          {phase === 'finished' && 'Terminé'}
        </Badge>
      </div>

      {/* Contrôles d'accessibilité */}
      <div className="flex items-center justify-center gap-4 pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleSound?.(!enableSound)}
          className="flex items-center gap-2"
          aria-label={enableSound ? 'Désactiver le son' : 'Activer le son'}
        >
          {enableSound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          <span className="text-xs">Son</span>
        </Button>

        {('vibrate' in navigator) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleHaptic?.(!enableHaptic)}
            className="flex items-center gap-2"
            aria-label={enableHaptic ? 'Désactiver les vibrations' : 'Activer les vibrations'}
          >
            <Vibrate className={`h-4 w-4 ${enableHaptic ? '' : 'opacity-50'}`} />
            <span className="text-xs">Vibration</span>
          </Button>
        )}
      </div>

      {/* Instructions pour lecteurs d'écran */}
      <div className="sr-only" aria-live="polite">
        {phase !== 'idle' && phase !== 'finished' && (
          <span>
            Phase de respiration en cours : {currentInstruction}. 
            {encouragement}
          </span>
        )}
      </div>
    </div>
  );
};

export default BreathCoach;