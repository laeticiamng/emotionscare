
import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VRSessionTemplate } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface VRAudioSessionProps {
  template: VRSessionTemplate;
  isPaused: boolean;
  onTogglePause: () => void;
  onComplete: () => void;
}

const VRAudioSession: React.FC<VRAudioSessionProps> = ({
  template,
  isPaused,
  onTogglePause,
  onComplete
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioError, setAudioError] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Initialize audio element
    const audioUrl = template.audio_url || template.audioTrack;
    if (audioUrl && !audioRef.current) {
      const audio = new Audio(audioUrl);
      
      // Add event listeners
      audio.addEventListener('ended', onComplete);
      audio.addEventListener('error', () => {
        setAudioError(true);
        toast({
          title: "Erreur audio",
          description: "Impossible de charger le fichier audio. Veuillez réessayer.",
          variant: "destructive"
        });
      });
      
      audioRef.current = audio;
    }
    
    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', onComplete);
        audioRef.current.pause();
      }
    };
  }, [template.audio_url, template.audioTrack, onComplete, toast]);
  
  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (!isPaused) {
      const playPromise = audioRef.current.play();
      // Handle play() promise
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Erreur de lecture audio:", error);
          setAudioError(true);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPaused]);
  
  return (
    <div className="bg-gradient-to-br from-purple-900 to-indigo-600 p-10 rounded-lg flex flex-col items-center justify-center space-y-6">
      <div className="h-32 w-32 rounded-full bg-indigo-700/50 flex items-center justify-center">
        {isPaused ? (
          <Play className="h-16 w-16 text-white" />
        ) : (
          <Pause className="h-16 w-16 text-white" />
        )}
      </div>
      <div className="text-white text-xl font-medium">
        {audioError ? "Problème audio détecté" : "Méditation guidée"}
      </div>
      
      {audioError && (
        <Button
          variant="outline"
          className="border-white/30 hover:bg-white/10 text-white"
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.load();
              setAudioError(false);
              const playPromise = audioRef.current.play();
              if (playPromise !== undefined) {
                playPromise.catch(() => setAudioError(true));
              }
            }
          }}
        >
          Réessayer
        </Button>
      )}
    </div>
  );
};

export default VRAudioSession;
