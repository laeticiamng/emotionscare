
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cube, Sparkles, Play, PauseCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/contexts/MusicContext';

interface ARExperienceProps {
  emotion?: string;
  intensity?: number;
  onComplete?: () => void;
}

const ARExperience: React.FC<ARExperienceProps> = ({
  emotion = 'calm',
  intensity = 50,
  onComplete
}) => {
  const [isActive, setIsActive] = useState(false);
  const [loadingAR, setLoadingAR] = useState(false);
  const { toast } = useToast();
  const { loadPlaylistForEmotion, playTrack, pauseTrack, isPlaying, currentTrack } = useMusic();

  const arExperiences = {
    calm: {
      title: "Forêt apaisante",
      description: "Immergez-vous dans une forêt apaisante avec des sons naturels",
      icon: <Sparkles className="h-6 w-6 text-emerald-500" />,
      audioType: "ambient"
    },
    happy: {
      title: "Jardin ensoleillé",
      description: "Explorez un jardin vibrant et coloré",
      icon: <Sparkles className="h-6 w-6 text-yellow-500" />,
      audioType: "upbeat"
    },
    sad: {
      title: "Pluie méditative",
      description: "Écoutez la pluie tomber doucement autour de vous",
      icon: <Sparkles className="h-6 w-6 text-blue-500" />,
      audioType: "calming"
    },
    anxious: {
      title: "Refuge de montagne",
      description: "Trouvez la paix dans un refuge de montagne serein",
      icon: <Sparkles className="h-6 w-6 text-violet-500" />,
      audioType: "ambient"
    },
    angry: {
      title: "Plage au crépuscule",
      description: "Laissez votre tension se dissiper sur une plage paisible",
      icon: <Sparkles className="h-6 w-6 text-orange-500" />,
      audioType: "calming"
    },
    neutral: {
      title: "Jardin zen",
      description: "Contemplez un jardin zen minimaliste",
      icon: <Sparkles className="h-6 w-6 text-slate-500" />,
      audioType: "focus"
    }
  };

  const currentExperience = arExperiences[emotion as keyof typeof arExperiences] || arExperiences.neutral;

  const handleStartAR = async () => {
    setLoadingAR(true);
    
    try {
      // Simuler le chargement de l'expérience AR
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Charger une playlist adaptée à l'émotion
      const playlist = await loadPlaylistForEmotion(currentExperience.audioType);
      
      if (playlist && playlist.tracks.length > 0) {
        // Préparer la piste avec les propriétés requises
        const track = {
          ...playlist.tracks[0],
          url: playlist.tracks[0].url || '',
          duration: playlist.tracks[0].duration || 0
        };
        
        playTrack(track);
      }
      
      setIsActive(true);
      
      toast({
        title: "Expérience AR activée",
        description: `Vous êtes maintenant immergé dans "${currentExperience.title}"`,
      });
    } catch (error) {
      console.error("Erreur lors du démarrage de l'AR:", error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer l'expérience AR",
        variant: "destructive"
      });
    } finally {
      setLoadingAR(false);
    }
  };

  const handleEndAR = () => {
    setIsActive(false);
    pauseTrack();
    
    toast({
      title: "Expérience AR terminée",
      description: "Comment vous sentez-vous après cette expérience?",
    });
    
    if (onComplete) {
      onComplete();
    }
  };

  // Vérifier si l'appareil est compatible AR
  const [arSupported, setArSupported] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Vérification simplifiée des capacités AR
    const checkARSupport = () => {
      // Pour une véritable implémentation, nous vérifierions WebXR ou ARKit/ARCore
      const isWebXRSupported = 'xr' in navigator;
      
      setArSupported(isWebXRSupported || window.innerWidth < 768); // Pour la démo, considérer les appareils mobiles comme compatibles
    };
    
    checkARSupport();
  }, []);

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/20 to-primary/5">
        <CardTitle className="flex items-center gap-2">
          <Cube className="h-5 w-5" />
          Expérience de Réalité Augmentée
        </CardTitle>
        <CardDescription>
          Utilisez votre appareil pour une immersion émotionnelle en réalité augmentée
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        {arSupported === false ? (
          <div className="text-center p-4 border border-dashed rounded-lg">
            <p className="text-muted-foreground">
              Votre appareil ne semble pas compatible avec la réalité augmentée.
              Essayez avec un appareil mobile récent pour vivre l'expérience complète.
            </p>
          </div>
        ) : (
          <>
            <div className={`relative rounded-lg overflow-hidden transition-all duration-500 ${isActive ? 'h-64' : 'h-40'}`}>
              <div className={`absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/20 flex items-center justify-center ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                <div className="text-center p-4 z-10">
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    {currentExperience.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{currentExperience.title}</h3>
                  <p className="text-sm text-muted-foreground">{currentExperience.description}</p>
                </div>
              </div>
              
              {isActive && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent animate-pulse" />
                  <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-primary/10 rounded-full animate-float" />
                  <div className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-primary/20 rounded-full animate-float-delay" />
                  <div className="absolute top-1/2 right-1/3 w-10 h-10 bg-primary/10 rounded-full animate-float-slow" />
                </div>
              )}
            </div>
            
            <div className="mt-6 flex items-center justify-between">
              <div>
                {isActive && currentTrack && (
                  <div className="text-sm">
                    <p className="font-medium">{currentTrack.title}</p>
                    <p className="text-xs text-muted-foreground">{currentTrack.artist}</p>
                  </div>
                )}
              </div>
              
              {!isActive ? (
                <Button 
                  onClick={handleStartAR}
                  className="w-full sm:w-auto"
                  disabled={loadingAR}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {loadingAR ? "Préparation..." : "Démarrer l'expérience AR"}
                </Button>
              ) : (
                <Button 
                  variant="outline"
                  onClick={handleEndAR}
                  className="w-full sm:w-auto"
                >
                  <PauseCircle className="h-4 w-4 mr-2" />
                  Terminer l'expérience
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4 text-xs text-muted-foreground">
        <p>Expérience adaptée à votre émotion: {emotion}</p>
        <p>Intensité: {intensity}%</p>
      </CardFooter>
    </Card>
  );
};

export default ARExperience;
