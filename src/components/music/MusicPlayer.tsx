
import React, { useState, useEffect, useRef } from 'react';
import { Music2, Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useMusic } from '@/contexts/MusicContext';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const MusicPlayer = () => {
  const { 
    currentTrack, 
    isPlaying, 
    volume, 
    playTrack, 
    pauseTrack, 
    nextTrack, 
    previousTrack, 
    setVolume,
    playlist
  } = useMusic();
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [loadingTrack, setLoadingTrack] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Création et gestion de l'élément audio
  useEffect(() => {
    // Création de l'élément audio si nécessaire
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Ajout des écouteurs d'événements
      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('loadeddata', setAudioData);
      audioRef.current.addEventListener('ended', handleTrackEnd);
      audioRef.current.addEventListener('error', handleAudioError);
      audioRef.current.addEventListener('loadstart', () => setLoadingTrack(true));
      audioRef.current.addEventListener('canplay', () => setLoadingTrack(false));
    }
    
    // Mise à jour de la source audio quand la piste change
    if (currentTrack) {
      console.log(`Chargement du morceau: ${currentTrack.title} - URL: ${currentTrack.url}`);
      setAudioError(null); // Réinitialiser les erreurs précédentes
      setLoadingTrack(true);
      audioRef.current.src = currentTrack.url;
      audioRef.current.volume = volume;
      
      if (isPlaying) {
        playAudio();
      }
    }
    
    // Nettoyage
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('loadeddata', setAudioData);
        audioRef.current.removeEventListener('ended', handleTrackEnd);
        audioRef.current.removeEventListener('error', handleAudioError);
        audioRef.current.removeEventListener('loadstart', () => setLoadingTrack(true));
        audioRef.current.removeEventListener('canplay', () => setLoadingTrack(false));
        audioRef.current.pause();
      }
    };
  }, [currentTrack]);
  
  // Gestion des changements lecture/pause
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    
    if (isPlaying) {
      playAudio();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);
  
  // Gestion des changements de volume
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);
  
  // Fonction pour lancer la lecture
  const playAudio = () => {
    if (!audioRef.current) return;
    
    setLoadingTrack(true);
    const playPromise = audioRef.current.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setLoadingTrack(false);
        })
        .catch(err => {
          console.error("Erreur de lecture audio:", err);
          setAudioError(`Erreur de lecture: ${err.message}`);
          setLoadingTrack(false);
          
          // Notifier l'utilisateur de l'erreur
          toast({
            title: "Problème de lecture",
            description: "Impossible de lire ce morceau. Essai du morceau suivant...",
            variant: "destructive"
          });
          
          // Tenter automatiquement de passer au morceau suivant
          setTimeout(() => {
            nextTrack();
          }, 1500);
        });
    }
  };
  
  // Gestionnaire d'erreur audio
  const handleAudioError = (e: Event) => {
    const error = (e.target as HTMLAudioElement).error;
    if (error) {
      console.error("Erreur audio:", error.message, error.code);
      let errorMsg = '';
      
      // Messages d'erreur plus spécifiques selon le code
      switch(error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMsg = "La lecture a été interrompue";
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          errorMsg = "Problème réseau lors du chargement";
          break;
        case MediaError.MEDIA_ERR_DECODE:
          errorMsg = "Impossible de décoder le fichier audio";
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMsg = "Format audio non supporté ou introuvable";
          break;
        default:
          errorMsg = error.message;
      }
      
      setAudioError(`Erreur: ${errorMsg}`);
      setLoadingTrack(false);
      
      toast({
        title: "Erreur de lecture",
        description: `${errorMsg}. Passage au morceau suivant...`,
        variant: "destructive"
      });
      
      // Passer automatiquement au morceau suivant
      setTimeout(() => {
        nextTrack();
      }, 1500);
    }
  };
  
  // Mise à jour de la progression
  const updateProgress = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };
  
  // Configuration des données audio
  const setAudioData = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
    setAudioError(null); // Réinitialiser l'erreur en cas de chargement réussi
  };
  
  const handleTrackEnd = () => {
    nextTrack();
  };
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !currentTrack) return;
    
    const progressBar = e.currentTarget;
    const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
    const newTime = clickPosition * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  // Format du temps affiché
  const formatTime = (time: number) => {
    if (!time) return "0:00";
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Gestion du changement de volume
  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0]);
  };
  
  // Icône de volume selon le niveau actuel
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  
  // Si aucune piste n'est sélectionnée
  if (!currentTrack) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded-lg border border-dashed">
        <Music2 className="h-12 w-12 mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">Aucune musique sélectionnée</h3>
        <p className="text-muted-foreground">
          Sélectionnez un morceau de musique dans les recommandations ou créez votre propre musique
        </p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border p-4 bg-background">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-16 w-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
          {currentTrack.cover ? (
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="h-full w-full object-cover" 
              onError={(e) => {
                // Fallback en cas d'erreur de chargement d'image
                e.currentTarget.src = '';
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.classList.add('bg-primary/10');
                const icon = document.createElement('div');
                icon.className = 'h-full w-full flex items-center justify-center';
                icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary/70"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>';
                e.currentTarget.parentElement!.appendChild(icon);
              }}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-primary/10">
              <Music2 className="h-8 w-8 text-primary/70" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium leading-none truncate">{currentTrack.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 truncate">{currentTrack.artist}</p>
          
          {loadingTrack && (
            <p className="text-xs text-muted mt-1">Chargement en cours...</p>
          )}
          
          {audioError && (
            <p className="text-xs text-destructive mt-1">{audioError}</p>
          )}
        </div>
      </div>
      
      {/* Barre de progression */}
      <div className="space-y-1 mb-4">
        <div 
          className="relative h-1.5 bg-secondary/50 rounded-full overflow-hidden cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className="absolute left-0 top-0 h-full bg-primary"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      {/* Contrôles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full" 
            onClick={previousTrack}
          >
            <SkipBack size={18} />
          </Button>
          
          <Button 
            variant="default" 
            size="icon" 
            className="rounded-full h-9 w-9" 
            onClick={isPlaying ? pauseTrack : () => playTrack(currentTrack)}
            disabled={loadingTrack}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full" 
            onClick={nextTrack}
          >
            <SkipForward size={18} />
          </Button>
        </div>
        
        {/* Contrôle du volume */}
        <div className="flex items-center gap-2 w-28">
          <VolumeIcon size={18} className="text-muted-foreground" />
          <Slider
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
