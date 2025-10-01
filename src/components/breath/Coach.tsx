// @ts-nocheck
import React, { useEffect } from 'react';
import { Phase } from '@/store/breath.store';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CoachProps {
  phase: Phase | null;
  voiceEnabled: boolean;
  running: boolean;
  onToggleVoice?: () => void;
}

const PHASE_MESSAGES = {
  inhale: 'Inspire doucement par le nez',
  hold: 'Retiens ton souffle',
  exhale: 'Expire lentement par la bouche'
} as const;

export const Coach: React.FC<CoachProps> = ({
  phase,
  voiceEnabled,
  running,
  onToggleVoice
}) => {
  // Text-to-speech for voice guidance
  useEffect(() => {
    if (!voiceEnabled || !phase || !running) return;
    
    const speak = (text: string) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.volume = 0.3;
        utterance.rate = 0.8;
        utterance.pitch = 0.9;
        
        // Use a calm, soft voice if available
        const voices = speechSynthesis.getVoices();
        const calmVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('female') ||
          voice.name.toLowerCase().includes('calm')
        );
        if (calmVoice) {
          utterance.voice = calmVoice;
        }
        
        speechSynthesis.speak(utterance);
      }
    };

    const message = PHASE_MESSAGES[phase];
    speak(message);
  }, [phase, voiceEnabled, running]);

  return (
    <div className="text-center space-y-4">
      {/* Main instruction */}
      <div 
        aria-live="polite" 
        className="min-h-[3rem] flex items-center justify-center"
      >
        {running && phase ? (
          <p className="text-lg font-medium text-foreground">
            {PHASE_MESSAGES[phase]}
          </p>
        ) : (
          <p className="text-muted-foreground">
            Prépare-toi à respirer en conscience
          </p>
        )}
      </div>

      {/* Voice toggle */}
      {onToggleVoice && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleVoice}
            className="h-8 px-2"
            aria-label={voiceEnabled ? "Désactiver le guidage vocal" : "Activer le guidage vocal"}
          >
            {voiceEnabled ? (
              <>
                <Volume2 className="w-4 h-4 mr-1" />
                <span className="text-xs">Voix ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 mr-1" />
                <span className="text-xs">Voix OFF</span>
              </>
            )}
          </Button>
        </div>
      )}

      {/* Breathing tips */}
      {!running && (
        <div className="text-xs text-muted-foreground max-w-md mx-auto">
          <p>
            Trouve une position confortable. Respire naturellement pour commencer.
          </p>
        </div>
      )}
    </div>
  );
};