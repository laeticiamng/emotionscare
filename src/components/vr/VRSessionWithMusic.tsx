
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import VRSessionProgress from './VRSessionProgress';
import VRSessionControls from './VRSessionControls';
import { VRSessionTemplate, MusicTrack, VRSessionWithMusicProps } from '@/types';
import VRAudioSession from './VRAudioSession';
import YoutubeEmbed from './YoutubeEmbed';

const VRSessionWithMusic: React.FC<VRSessionWithMusicProps> = ({
  session,
  musicTracks = [],
  onSessionComplete,
  isAudioOnly = false,
  videoUrl,
  audioUrl,
  emotion = 'calm'
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const { playTrack, pauseTrack, currentTrack } = useMusic();
  const { toast } = useToast();
  
  // Convertir la durée en secondes
  const sessionDuration = (session?.duration || 5) * 60;
  
  // Timer pour le suivi de la session
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (!isPaused) {
      timer = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1;
          const newProgress = Math.min((newTime / sessionDuration) * 100, 100);
          setProgress(newProgress);
          
          // Si la session est terminée
          if (newProgress >= 100) {
            clearInterval(timer);
            onSessionComplete();
            return sessionDuration;
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPaused, sessionDuration, onSessionComplete]);
  
  // Gestion de la musique
  const toggleMusic = () => {
    if (isMusicPlaying) {
      pauseTrack();
      setIsMusicPlaying(false);
    } else {
      if (musicTracks.length > 0 && !currentTrack) {
        // Jouer la première piste
        playTrack(musicTracks[0]);
      } else if (currentTrack) {
        // Reprendre la lecture
        playTrack(currentTrack);
      } else {
        // Pas de pistes disponibles
        toast({
          title: "Aucune musique disponible",
          description: "Aucune piste audio n'est disponible pour cette session."
        });
        return;
      }
      setIsMusicPlaying(true);
    }
  };
  
  const handleTogglePause = () => {
    setIsPaused(prev => !prev);
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">
          {session?.name || 'Session VR'}
        </h2>
        
        <div className="mb-8">
          <VRSessionProgress percentComplete={progress} />
        </div>
        
        <div className="space-y-8">
          {isAudioOnly ? (
            <VRAudioSession
              template={{
                id: session?.id || '1',
                template_id: session?.template_id || '1',
                name: session?.name || 'Audio Session',
                theme: session?.theme || emotion,
                description: session?.description || '',
                duration: session?.duration || 5,
                type: 'meditation',
                difficulty: 'beginner',
                audio_url: audioUrl,
                created_at: new Date(),
                is_audio_only: true
              }}
              isPaused={isPaused}
              onTogglePause={handleTogglePause}
              onComplete={onSessionComplete}
            />
          ) : (
            <div className="aspect-video rounded-lg overflow-hidden">
              <YoutubeEmbed 
                videoUrl={videoUrl || ''} 
                autoplay={!isPaused}
                controls={true}
              />
            </div>
          )}
          
          <VRSessionControls 
            isPaused={isPaused}
            isAudioOnly={isAudioOnly}
            isMusicPlaying={isMusicPlaying}
            onTogglePause={handleTogglePause}
            onToggleMusic={toggleMusic}
            onComplete={onSessionComplete}
          />
        </div>
      </div>
    </Card>
  );
};

export default VRSessionWithMusic;
