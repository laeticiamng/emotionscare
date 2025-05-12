
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';

interface ARExperienceProps {
  emotion?: string;
  intensity?: number;
  onComplete?: () => void;
}

const ARExperience: React.FC<ARExperienceProps> = ({ 
  emotion = 'calm',
  intensity = 5,
  onComplete 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const { loadPlaylistForEmotion, playTrack, pauseTrack, adjustVolume } = useMusic();
  const { toast } = useToast();
  
  // Démarrer l'expérience AR
  const startExperience = async () => {
    setIsActive(true);
    
    try {
      // Charger la musique associée à l'émotion
      const playlist = await loadPlaylistForEmotion(emotion);
      if (playlist && playlist.tracks.length > 0) {
        playTrack(playlist.tracks[0]);
        
        // Ajuster le volume en fonction de l'intensité
        const volume = Math.min(1, Math.max(0.2, intensity / 10));
        adjustVolume(volume - 0.5);
        
        toast({
          title: "Expérience AR démarrée",
          description: `Mode ${emotion} activé avec une musique adaptée`
        });
      }
    } catch (error) {
      console.error("Erreur lors du démarrage de l'expérience AR:", error);
    }
  };
  
  // Arrêter l'expérience AR
  const stopExperience = () => {
    setIsActive(false);
    pauseTrack();
    
    if (onComplete) {
      onComplete();
    }
    
    toast({
      title: "Expérience AR terminée",
      description: `Durée: ${formatTime(elapsed)}`,
    });
  };
  
  // Formater le temps écoulé
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Gérer le chronomètre
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isActive) {
      timer = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive]);
  
  return (
    <div className="ar-experience">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">
              {isActive ? "Expérience AR en cours" : "Prêt à commencer"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {isActive 
                ? `En cours depuis ${formatTime(elapsed)}` 
                : "Appuyez sur Démarrer pour lancer l'expérience AR"}
            </p>
            
            {isActive ? (
              <Button 
                variant="destructive" 
                size="lg" 
                onClick={stopExperience}
              >
                Arrêter l'expérience
              </Button>
            ) : (
              <Button 
                variant="default" 
                size="lg" 
                onClick={startExperience}
              >
                Démarrer l'expérience
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {isActive && (
        <div className="text-center mt-4">
          <div className="inline-block animate-pulse p-4 bg-primary/10 rounded-full mb-2">
            <div className="h-8 w-8 rounded-full bg-primary/30"></div>
          </div>
          <p className="text-sm text-muted-foreground">
            L'expérience AR est active. Vos émotions sont analysées.
          </p>
        </div>
      )}
    </div>
  );
};

export default ARExperience;
